export interface TeleConsultation {
  id: string;
  farmer_id: string;
  vet_id?: string;
  animal_id?: string;
  title: string;
  description: string;
  images: string[];
  urgency_level: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  preferred_time?: string;
  contact_phone: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  vet_response?: string;
  prescribed_medication?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  consultation_fee?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  assigned_at?: string;
  completed_at?: string;
}

export interface ConsultationMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_type: 'farmer' | 'vet';
  message: string;
  images?: string[];
  voice_note?: string;
  created_at: string;
  updated_at: string;
  read_at?: string;
}

export interface VetAvailability {
  id: string;
  vet_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  available: boolean;
  max_consultations: number;
  current_consultations: number;
}

export interface VetProfile {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  qualifications: string[];
  consultation_fee: number;
  languages: string[];
  available_for_teleconsultation: boolean;
  rating: number;
  total_consultations: number;
  bio: string;
  clinic_address?: string;
  clinic_phone?: string;
  created_at: string;
  updated_at: string;
}
