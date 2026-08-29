export interface GaushalaAnimal {
  id: string;
  gaushala_id: string;
  name: string;
  tag_number?: string;
  breed: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  date_of_arrival: string;
  source: 'born_in_gaushala' | 'rescued' | 'donated' | 'purchased';
  source_details?: string;
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  special_needs?: string;
  behavior_notes?: string;
  location_in_gaushala: string;
  assigned_caretaker?: string;
  adoption_status: 'not_available' | 'available' | 'pending' | 'adopted';
  adoption_date?: string;
  adopter_details?: string;
  images: string[];
  weight_records: WeightRecord[];
  created_at: string;
  updated_at: string;
}

export interface WeightRecord {
  id: string;
  animal_id: string;
  weight: number; // in kg
  date: string;
  notes?: string;
  recorded_by: string;
}

export interface MedicalRecord {
  id: string;
  animal_id: string;
  gaushala_id: string;
  type: 'checkup' | 'treatment' | 'vaccination' | 'surgery' | 'emergency' | 'other';
  title: string;
  description: string;
  symptoms?: string[];
  diagnosis?: string;
  treatment?: string;
  medications?: MedicationRecord[];
  vet_name: string;
  vet_contact?: string;
  cost?: number;
  follow_up_required: boolean;
  follow_up_date?: string;
  outcome: 'successful' | 'ongoing' | 'referred' | 'deceased';
  images?: string[];
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  animal_id: string;
  vaccine_name: string;
  vaccine_type: string;
  manufacturer: string;
  batch_number: string;
  administration_date: string;
  next_due_date?: string;
  administered_by: string;
  cost?: number;
  notes?: string;
  created_at: string;
}

export interface DeathRecord {
  id: string;
  animal_id: string;
  gaushala_id: string;
  date_of_death: string;
  time_of_death?: string;
  cause_of_death: string;
  suspected_cause?: string;
  symptoms_before_death?: string;
  vet_examination?: boolean;
  post_mortem?: boolean;
  post_mortem_report?: string;
  burial_location?: string;
  ceremony_performed: boolean;
  ceremony_details?: string;
  witness_names?: string[];
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface Gaushala {
  id: string;
  name: string;
  registration_number?: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email?: string;
  website?: string;
  established_date: string;
  capacity: number;
  current_animal_count: number;
  land_area: number; // in acres
  facilities: string[];
  services: string[];
  operating_hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  emergency_contact: string;
  registration_documents: string[];
  images: string[];
  verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface DailyCareLog {
  id: string;
  animal_id: string;
  gaushala_id: string;
  date: string;
  caretaker_name: string;
  feeding_time: string;
  food_type: string;
  food_quantity: number;
  water_provided: boolean;
  water_clean: boolean;
  shelter_clean: boolean;
  health_observation: string;
  behavior_notes?: string;
  medication_given?: string;
  special_care?: string;
  images?: string[];
  created_at: string;
}
