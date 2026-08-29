import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for development - no real database needed
const mockSupabaseClient = {
  auth: {
    signIn: async ({ email, password }: { email: string; password: string }) => ({ 
      user: { id: '1', email: 'demo@demo.com' }, 
      session: { user: { id: '1', email: 'demo@demo.com' } },
      error: null 
    }),
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => ({ 
      user: { id: '2', email }, 
      session: { user: { id: '2', email } },
      error: null 
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getCurrentUser: async () => ({ user: { id: '1', email: 'demo@demo.com' }, error: null }),
    getSession: async () => ({ session: { user: { id: '1', email: 'demo@demo.com' } }, error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      }),
      then: (resolve: any) => resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          data: { id: '1', created_at: new Date().toISOString() },
          error: null
        })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({
            data: { id: '1', updated_at: new Date().toISOString() },
            error: null
          })
        })
      })
    }),
    delete: () => ({
      eq: () => ({
        then: (resolve: any) => resolve({ data: null, error: null })
      })
    })
  })
};

export const supabase = mockSupabaseClient;

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
