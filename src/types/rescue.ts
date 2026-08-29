export interface RescueReport {
  id: string;
  reporter_id: string;
  animal_type: 'cow' | 'dog' | 'goat' | 'other';
  animal_description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  contact_phone: string;
  status: 'reported' | 'in_progress' | 'resolved' | 'cancelled';
  assigned_ngo_id?: string;
  assigned_volunteer_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RescueNGO {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  service_radius: number; // in kilometers
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RescueVolunteer {
  id: string;
  user_id: string;
  ngo_id: string;
  name: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  availability: 'available' | 'busy' | 'offline';
  skills: string[];
  created_at: string;
  updated_at: string;
}
