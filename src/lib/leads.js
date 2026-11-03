import { supabase } from './supabase';

// Inserts into the tables created by supabase-create-leads-tables.sql

export async function subscribeNewsletter(email, source = 'footer') {
  const clean = String(email || '').trim().toLowerCase();
  try {
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: clean, source });
    if (error) {
      // 23505 = unique_violation → already subscribed, which is a success for the user
      if (error.code === '23505') return { success: true, already: true };
      console.warn('[newsletter]', error.message);
      return { success: false, message: 'We couldn’t subscribe you right now. Please try again in a moment.' };
    }
    return { success: true };
  } catch (err) {
    console.warn('[newsletter]', err?.message || err);
    return { success: false, message: 'Network error — please check your connection and try again.' };
  }
}

export async function submitCounselingRequest(payload) {
  try {
    const { error } = await supabase.from('counseling_requests').insert({
      name: payload.name?.trim(),
      phone: payload.phone,
      email: payload.email?.trim() || null,
      track: payload.track || null,
      preferred_time: payload.preferredTime || null,
      topic: payload.topic || 'Free counseling',
      message: payload.message?.trim() || null,
      source: payload.source || 'website',
    });
    if (error) {
      console.warn('[counseling]', error.message);
      return { success: false, message: 'We couldn’t send your request right now. Please call us or try again shortly.' };
    }
    return { success: true };
  } catch (err) {
    console.warn('[counseling]', err?.message || err);
    return { success: false, message: 'Network error — please call us or try again shortly.' };
  }
}
