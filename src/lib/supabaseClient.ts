import { createClient } from '@supabase/supabase-js';

// Real Supabase client using environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Tables = {
  users: {
    Row: {
      id: string;
      email: string;
      full_name: string | null;
      role: 'farmer' | 'vet' | 'admin';
      created_at: string;
      updated_at: string;
      avatar_url: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      zip_code: string | null;
      country: string | null;
    };
  };
  animals: {
    Row: {
      id: string;
      name: string;
      species: string | null;
      breed: string | null;
      date_of_birth: string | null;
      health_status: string | null;
      user_id: string;
      created_at: string;
      updated_at: string;
      profile_image: string | null;
    };
  };
  rescue_reports: {
    Row: {
      id: string;
      reporter_id: string | null;
      animal_type: string | null;
      animal_description: string | null;
      location: any;
      images: string[] | null;
      urgency_level: string | null;
      description: string | null;
      contact_phone: string | null;
      status: string | null;
      assigned_ngo_id: string | null;
      created_at: string;
      updated_at: string;
    };
  };
  tele_consultations: {
    Row: {
      id: string;
      farmer_id: string | null;
      vet_id: string | null;
      animal_id: string | null;
      title: string | null;
      description: string | null;
      images: string[] | null;
      urgency_level: string | null;
      status: string | null;
      contact_phone: string | null;
      location: any;
      vet_response: string | null;
      created_at: string;
      updated_at: string;
    };
  };
  posts: {
    Row: {
      id: string;
      user_id: string;
      content: string | null;
      image_url: string | null;
      created_at: string;
    };
  };
  comments: {
    Row: {
      id: string;
      post_id: string;
      user_id: string;
      content: string | null;
      created_at: string;
    };
  };
  likes: {
    Row: {
      id: string;
      post_id: string;
      user_id: string;
      created_at: string;
    };
  };
};
