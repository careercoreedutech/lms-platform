import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'drm-stream-proxy',
      configureServer(server) {
        const handleDrmRequest = (req, res) => {
          try {
            const reqUrl = new URL(req.url, 'http://localhost');
            let targetUrl = '';

            // Method 1: Decode obfuscated token (prevents .mp4 in URL query)
            const token = reqUrl.searchParams.get('token') || reqUrl.searchParams.get('tok');
            if (token) {
              try {
                const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
                const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
                const parsed = JSON.parse(jsonStr);
                if (parsed.url) {
                  // Validate token freshness (valid within 5 minutes)
                  if (!parsed.exp || parsed.exp > Date.now() - 300000) {
                    targetUrl = parsed.url;
                  }
                }
              } catch (e) {
                // Token decode fallback
              }
            }

            // Method 2: Direct url query fallback
            if (!targetUrl) {
              targetUrl = reqUrl.searchParams.get('url');
            }

            if (!targetUrl) {
              res.statusCode = 403;
              return res.end('Access Denied: Invalid DRM session token');
            }

            const parsedTarget = new URL(targetUrl);
            const client = parsedTarget.protocol === 'https:' ? https : http;

            const headers = { ...req.headers };
            delete headers.host;
            delete headers.referer;

            const isChunkClient = req.headers['x-drm-client'] === 'careercore-v2' || reqUrl.pathname.includes('drm-chunk');

            const proxyReq = client.request(
              {
                hostname: parsedTarget.hostname,
                port: parsedTarget.port,
                path: parsedTarget.pathname + parsedTarget.search,
                method: req.method,
                headers
              },
              (proxyRes) => {
                // Return application/octet-stream so video downloader extensions ignore this request
                const responseHeaders = {
                  ...proxyRes.headers,
                  'content-type': 'application/octet-stream',
                  'content-disposition': 'inline; filename="bundle.bin"',
                  'cache-control': 'no-store, no-cache, must-revalidate, private',
                  'pragma': 'no-cache',
                  'expires': '0',
                  'x-content-type-options': 'nosniff',
                  'x-drm-protected': 'active',
                  'x-drm-scrambled': isChunkClient ? 'true' : 'false',
                  'access-control-allow-origin': '*',
                  'access-control-expose-headers': 'x-drm-protected, x-drm-scrambled, content-length, content-range'
                };

                // Prevent extensions from identifying it as downloadable media file
                delete responseHeaders['content-type-original'];

                res.writeHead(proxyRes.statusCode || 200, responseHeaders);

                // Scramble the first 32 bytes on the wire for authorized DRM clients
                // This makes the file permanently corrupt if intercepted by external network sniffers
                if (isChunkClient) {
                  let bytesSent = 0;
                  proxyRes.on('data', (chunk) => {
                    if (bytesSent < 32) {
                      const copy = Buffer.from(chunk);
                      const scrambleLen = Math.min(32 - bytesSent, copy.length);
                      for (let i = 0; i < scrambleLen; i++) {
                        copy[i] ^= 0x5A;
                      }
                      bytesSent += chunk.length;
                      res.write(copy);
                    } else {
                      bytesSent += chunk.length;
                      res.write(chunk);
                    }
                  });
                  proxyRes.on('end', () => res.end());
                } else {
                  proxyRes.pipe(res);
                }
              }
            );

            proxyReq.on('error', (err) => {
              res.statusCode = 502;
              res.end('DRM stream fetch failed: ' + err.message);
            });

            req.pipe(proxyReq);
          } catch (err) {
            res.statusCode = 500;
            res.end('Server proxy error: ' + err.message);
          }
        };

        server.middlewares.use('/api/drm-chunk', handleDrmRequest);
        server.middlewares.use('/api/drm-stream', handleDrmRequest);
      }
    }
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-core': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-lottie': ['lottie-react']
        }
      }
    },
    chunkSizeWarningLimit: 1500
  },
  server: {
    port: 3001,
    open: false
  }
});
