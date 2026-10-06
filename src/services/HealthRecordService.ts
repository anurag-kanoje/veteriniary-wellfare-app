import { supabase } from '../lib/supabaseClient';

export type HealthRecord = {
  id: string;
  animal_id: string;
  record_type: 'checkup' | 'vaccination' | 'treatment' | 'surgery' | 'other';
  title: string;
  description: string | null;
  veterinarian_name: string | null;
  clinic_name: string | null;
  cost: number | null;
  medications: string[] | null;
  notes: string | null;
  record_date: string | null;
  next_visit_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateHealthRecordInput = {
  animal_id: string;
  record_type: 'checkup' | 'vaccination' | 'treatment' | 'surgery' | 'other';
  title: string;
  description?: string;
  veterinarian_name?: string;
  clinic_name?: string;
  cost?: number;
  medications?: string[];
  notes?: string;
  record_date?: string;
  next_visit_date?: string;
};

export type UpdateHealthRecordInput = Partial<CreateHealthRecordInput>;

export class HealthRecordService {
  /**
   * Get all health records for an animal
   */
  static async getAnimalHealthRecords(
    animalId: string
  ): Promise<{ data: HealthRecord[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('animal_id', animalId)
        .order('record_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as HealthRecord[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a single health record by ID
   */
  static async getHealthRecord(
    id: string
  ): Promise<{ data: HealthRecord | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as HealthRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new health record
   */
  static async createHealthRecord(
    input: CreateHealthRecordInput
  ): Promise<{ data: HealthRecord | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          animal_id: input.animal_id,
          record_type: input.record_type,
          title: input.title,
          description: input.description || null,
          veterinarian_name: input.veterinarian_name || null,
          clinic_name: input.clinic_name || null,
          cost: input.cost || null,
          medications: input.medications || null,
          notes: input.notes || null,
          record_date: input.record_date || null,
          next_visit_date: input.next_visit_date || null,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as HealthRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update an existing health record
   */
  static async updateHealthRecord(
    id: string,
    input: UpdateHealthRecordInput
  ): Promise<{ data: HealthRecord | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .update({
          title: input.title,
          record_type: input.record_type,
          description: input.description || null,
          veterinarian_name: input.veterinarian_name || null,
          clinic_name: input.clinic_name || null,
          cost: input.cost || null,
          medications: input.medications || null,
          notes: input.notes || null,
          record_date: input.record_date || null,
          next_visit_date: input.next_visit_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as HealthRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a health record
   */
  static async deleteHealthRecord(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
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
   * Get upcoming vaccinations for user's animals
   */
  static async getUpcomingVaccinations(): Promise<{
    data: HealthRecord[] | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          animals!inner (
            id,
            name,
            species
          )
        `)
        .eq('record_type', 'vaccination')
        .gte('next_visit_date', new Date().toISOString().split('T')[0])
        .order('next_visit_date', { ascending: true })
        .limit(10);

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as HealthRecord[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}
