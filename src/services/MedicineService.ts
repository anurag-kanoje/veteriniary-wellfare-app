import { supabase } from '../lib/supabaseClient';

export type Medicine = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  manufacturer: string | null;
  dosage: string | null;
  side_effects: string | null;
  contraindications: string | null;
  storage_requirements: string | null;
  price_range: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateMedicineInput = {
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  dosage?: string;
  side_effects?: string;
  contraindications?: string;
  storage_requirements?: string;
  price_range?: string;
  availability?: string;
};

export type UpdateMedicineInput = Partial<CreateMedicineInput>;

export class MedicineService {
  /**
   * Get all medicines
   */
  static async getAllMedicines(): Promise<{ data: Medicine[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get medicines by category
   */
  static async getMedicinesByCategory(category: string): Promise<{ data: Medicine[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search medicines by name
   */
  static async searchMedicines(query: string): Promise<{ data: Medicine[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get medicine by ID
   */
  static async getMedicine(id: string): Promise<{ data: Medicine | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get available medicines
   */
  static async getAvailableMedicines(): Promise<{ data: Medicine[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('*')
        .eq('availability', 'available')
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all medicine categories
   */
  static async getCategories(): Promise<{ data: string[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('medicine_directory')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        return { data: null, error: error as Error };
      }

      const categories = [...new Set(data.map((item: any) => item.category))];
      return { data: categories, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new medicine (admin only)
   */
  static async createMedicine(input: CreateMedicineInput): Promise<{ data: Medicine | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('medicine_directory')
        .insert({
          name: input.name,
          category: input.category || null,
          description: input.description || null,
          manufacturer: input.manufacturer || null,
          dosage: input.dosage || null,
          side_effects: input.side_effects || null,
          contraindications: input.contraindications || null,
          storage_requirements: input.storage_requirements || null,
          price_range: input.price_range || null,
          availability: input.availability || 'available',
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Medicine, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update a medicine (admin only)
   */
  static async updateMedicine(id: string, input: UpdateMedicineInput): Promise<{ data: Medicine | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('medicine_directory')
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

      return { data: data as Medicine, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update medicine availability (admin only)
   */
  static async updateAvailability(
    id: string,
    availability: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('medicine_directory')
        .update({
          availability,
          updated_at: new Date().toISOString(),
        })
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
   * Delete a medicine (admin only)
   */
  static async deleteMedicine(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('medicine_directory')
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
}
