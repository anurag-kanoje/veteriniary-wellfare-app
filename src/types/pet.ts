export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  birthDate?: Date;
  color?: string;
  microchipNumber?: string;
  lastVisit?: Date;
  medicalNotes?: string;
  imageUrl?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePetDto = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePetDto = Partial<CreatePetDto>;
