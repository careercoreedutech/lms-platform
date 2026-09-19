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

// Helper: Generate a time-limited signed URL for private course video
export async function getProtectedVideoUrl(storagePath, expiresIn = 1800) {
  if (!storagePath) return null;
  // If it's already an external URL or embedded link, return it directly
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://') || storagePath.startsWith('blob:')) {
    return storagePath;
  }

  try {
    const { data, error } = await supabase.storage
      .from('course-videos')
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      console.warn('Could not generate signed video URL:', error.message);
      return null;
    }
    return data?.signedUrl || null;
  } catch (err) {
    console.error('Error fetching signed video URL:', err);
    return null;
  }
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
