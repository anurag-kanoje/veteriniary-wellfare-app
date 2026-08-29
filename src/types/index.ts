export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  weight: number | null;
  birthDate: string | null;
  image: string | null;
  ownerId: string;
  medicalHistory: string | null;
  lastVetVisit: string | null;
  nextVaccinationDate: string | null;
  specialNeeds: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  followUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'owner' | 'vet' | 'admin';
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalVitals {
  temperature: number;
  heartRate: number;
  activityLevel: number;
  timestamp: string;
}

export interface DiseaseAlert {
  id: string;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  details: string;
  recommendations: string[];
}

export interface HealthRecord {
  id: string;
  animalId: string;
  timestamp: string;
  vitals: AnimalVitals;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  attachments?: {
    type: 'image' | 'video' | 'document';
    url: string;
    analysis?: any;
  }[];
}