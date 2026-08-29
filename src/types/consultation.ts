// User type definition
export type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

export type ConsultationStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface VetProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  specialization?: string;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
}

export interface Consultation {
  id: string;
  farmer_id: string;
  vet_id: string;
  animal_id: string;
  status: ConsultationStatus;
  scheduled_time: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vet: VetProfile;
  animal: Animal;
}

export interface CreateConsultationData {
  vetId: string;
  animalId: string;
  scheduledTime: Date;
  notes: string;
}

export interface UpdateConsultationStatusData {
  id: string;
  status: ConsultationStatus;
}

export interface ConsultationFilters {
  status?: ConsultationStatus;
  vetId?: string;
  animalId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TimeSlot {
  time: string;
  formattedTime: string;
  isAvailable: boolean;
}

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    ['00', '30'].forEach(minutes => {
      const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
      slots.push({
        time,
        formattedTime: `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`,
        isAvailable: true
      });
    });
  }
  
  return slots;
};
