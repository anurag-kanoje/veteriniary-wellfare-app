export interface Disease {
  id: string;
  name_en: string;
  name_hi: string;
  animal_type: 'cow' | 'dog' | 'goat' | 'other';
  category: 'infectious' | 'parasitic' | 'nutritional' | 'respiratory' | 'digestive' | 'skin' | 'other';
  severity: 'low' | 'medium' | 'high';
  description_en: string;
  description_hi: string;
  symptoms: Symptom[];
  causes: Cause[];
  first_aid: FirstAidStep[];
  when_to_call_vet: string[];
  prevention_tips: string[];
  common_medications: string[];
  recovery_time: string;
  contagious: boolean;
  zoonotic: boolean; // can spread to humans
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  name_en: string;
  name_hi: string;
  description_en: string;
  description_hi: string;
  severity_indicator: 'mild' | 'moderate' | 'severe';
}

export interface Cause {
  type_en: string;
  type_hi: string;
  description_en: string;
  description_hi: string;
}

export interface FirstAidStep {
  step_number: number;
  instruction_en: string;
  instruction_hi: string;
  duration?: string;
  materials_needed?: string[];
}

export interface DiseaseSearchResult {
  disease: Disease;
  relevance_score: number;
  matched_symptoms: string[];
}

// Alias for backward compatibility
export type DiseaseInfo = Disease;
