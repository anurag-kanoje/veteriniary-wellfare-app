import { supabase } from '../lib/supabaseClient';

export type Animal = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  date_of_birth: string | null;
  health_status: string | null;
  user_id: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAnimalInput = {
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
  health_status?: string;
  profile_image?: string;
};

export type UpdateAnimalInput = Partial<CreateAnimalInput>;

export class AnimalService {
  /**
   * Get all animals for the authenticated user
   */
  static async getMyAnimals(): Promise<{ data: Animal[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Animal[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a single animal by ID
   */
  static async getAnimal(id: string): Promise<{ data: Animal | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Animal, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new animal
   */
  static async createAnimal(
    input: CreateAnimalInput
  ): Promise<{ data: Animal | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('animals')
        .insert({
          name: input.name,
          species: input.species,
          breed: input.breed || null,
          date_of_birth: input.date_of_birth || null,
          health_status: input.health_status || 'healthy',
          profile_image: input.profile_image || null,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Animal, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update an existing animal
   */
  static async updateAnimal(
    id: string,
    input: UpdateAnimalInput
  ): Promise<{ data: Animal | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('animals')
        .update({
          name: input.name,
          species: input.species,
          breed: input.breed || null,
          date_of_birth: input.date_of_birth || null,
          health_status: input.health_status || null,
          profile_image: input.profile_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Animal, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete an animal
   */
  static async deleteAnimal(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('animals')
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
