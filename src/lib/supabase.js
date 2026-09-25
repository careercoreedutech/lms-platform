import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://plgzsaxvydceqidiwdup.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper: Extract clean storage path from Supabase storage URL or relative path
export function extractStoragePath(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return '';
  // If it's a blob URL, no storage path
  if (urlOrPath.startsWith('blob:')) return '';
  // If it contains /course-videos/, strip everything up to and including /course-videos/
  const match = urlOrPath.match(/(?:course-videos\/)(.+?)(?:\?.*)?$/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  // If it doesn't start with http, it's already a relative storage path (e.g. courses/123.mp4)
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    return urlOrPath.replace(/^\/+/, '');
  }
  return '';
}

// Helper: Generate a time-limited signed URL for private course video
export async function getProtectedVideoUrl(storagePathOrUrl, expiresIn = 86400) {
  if (!storagePathOrUrl) return null;

  // If it's an in-memory blob URL, return it directly
  if (typeof storagePathOrUrl === 'string' && storagePathOrUrl.startsWith('blob:')) {
    return storagePathOrUrl;
  }

  // Check if it's a storage path or a URL targeting our private bucket
  const cleanPath = extractStoragePath(storagePathOrUrl);

  if (cleanPath) {
    try {
      const { data, error } = await supabase.storage
        .from('course-videos')
        .createSignedUrl(cleanPath, expiresIn);

      if (error) {
        console.warn('Could not generate signed video URL for path', cleanPath, error.message);
        return storagePathOrUrl.startsWith('http') ? storagePathOrUrl : null;
      }
      return data?.signedUrl || null;
    } catch (err) {
      console.error('Error fetching signed video URL:', err);
      return storagePathOrUrl.startsWith('http') ? storagePathOrUrl : null;
    }
  }

  // External URLs (e.g. YouTube, external CDN) that are not in our Supabase bucket
  if (typeof storagePathOrUrl === 'string' && (storagePathOrUrl.startsWith('http://') || storagePathOrUrl.startsWith('https://'))) {
    return storagePathOrUrl;
  }

  return null;
}

// Helper: Upload video to private bucket
export async function uploadCourseVideo(file, courseId, lessonId) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${courseId}/${lessonId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('course-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;
  return filePath;
}
