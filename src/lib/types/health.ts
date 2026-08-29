export interface Symptom {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  duration: number; // in days
}

export interface Disease {
  name: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string;
}