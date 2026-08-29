export interface Medicine {
  id: string;
  name_en: string;
  name_hi: string;
  generic_name: string;
  category: 'antibiotic' | 'anti-inflammatory' | 'anti-parasitic' | 'vaccine' | 'vitamin' | 'other';
  description_en: string;
  description_hi: string;
  dosage_form: 'tablet' | 'injection' | 'syrup' | 'ointment' | 'powder' | 'other';
  manufacturer: string;
  price_range: {
    min: number;
    max: number;
    currency: string;
  };
  prescription_required: boolean;
  storage_requirements: string[];
  expiry_info: string;
  side_effects: string[];
  contraindications: string[];
  animal_types: ('cow' | 'dog' | 'goat' | 'other')[];
  created_at: string;
  updated_at: string;
}

export interface MedicineStore {
  id: string;
  name: string;
  type: 'pharmacy' | 'veterinary_clinic' | 'ngo' | 'gaushala';
  phone: string;
  email?: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  operating_hours: {
    [key: string]: { // day_of_week: 0-6
      open: string;
      close: string;
      closed: boolean;
    };
  };
  services: string[];
  delivery_available: boolean;
  emergency_service: boolean;
  verified: boolean;
  rating: number;
  total_reviews: number;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicineInventory {
  id: string;
  store_id: string;
  medicine_id: string;
  stock_quantity: number;
  unit_price: number;
  currency: string;
  last_updated: string;
  batch_number?: string;
  expiry_date?: string;
  manufacturer?: string;
}

export interface MedicineSearchResult {
  medicine: Medicine;
  available_stores: {
    store: MedicineStore;
    inventory: MedicineInventory;
    distance: number; // in kilometers
  }[];
}

// Alias for backward compatibility
export type DrugInfo = Medicine;
