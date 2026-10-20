import { supabase } from '../lib/supabaseClient';

export type Veterinarian = {
  id: string;
  user_id: string;
  license_number: string;
  specialization: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  location: any;
  service_radius: number;
  consultation_fee: number;
  available: boolean;
  rating: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateVeterinarianInput = {
  user_id: string;
  license_number: string;
  specialization: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  location: any;
  service_radius: number;
  consultation_fee: number;
};

export type UpdateVeterinarianInput = Partial<CreateVeterinarianInput>;

export class VetService {
  /**
   * Get all verified veterinarians
   */
  static async getAllVeterinarians(): Promise<{ data: Veterinarian[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('verified', true)
        .eq('available', true)
        .order('rating', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Veterinarian[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get veterinarians near a location
   */
  static async getVeterinariansNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<{ data: Veterinarian[] | null; error: Error | null }> {
    try {
      // This is a simplified version - in production, use PostGIS for actual distance calculations
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('verified', true)
        .eq('available', true)
        .order('rating', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      // Filter by service radius in application layer (simplified)
      const vets = data as Veterinarian[];
      const nearbyVets = vets.filter(vet => {
        if (!vet.location || !vet.location.latitude || !vet.location.longitude) {
          return false;
        }
        const distance = this.calculateDistance(
          latitude,
          longitude,
          vet.location.latitude,
          vet.location.longitude
        );
        return distance <= (vet.service_radius || radiusKm);
      });

      return { data: nearbyVets, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get veterinarian by ID
   */
  static async getVeterinarian(id: string): Promise<{ data: Veterinarian | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Veterinarian, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get veterinarian by user ID
   */
  static async getVeterinarianByUserId(userId: string): Promise<{ data: Veterinarian | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Veterinarian, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create veterinarian profile
   */
  static async createVeterinarian(
    input: CreateVeterinarianInput
  ): Promise<{ data: Veterinarian | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('veterinarians')
        .insert({
          user_id: input.user_id,
          license_number: input.license_number,
          specialization: input.specialization,
          clinic_name: input.clinic_name,
          clinic_address: input.clinic_address,
          clinic_phone: input.clinic_phone,
          location: input.location,
          service_radius: input.service_radius,
          consultation_fee: input.consultation_fee,
          available: true,
          rating: 0,
          verified: false,
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Veterinarian, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update veterinarian profile
   */
  static async updateVeterinarian(
    id: string,
    input: UpdateVeterinarianInput
  ): Promise<{ data: Veterinarian | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('veterinarians')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = updateResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Veterinarian, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update veterinarian availability
   */
  static async updateAvailability(
    id: string,
    available: boolean
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('veterinarians')
        .update({ available, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
