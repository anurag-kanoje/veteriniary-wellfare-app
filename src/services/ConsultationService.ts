import { supabase } from '../lib/supabaseClient';

export type TeleConsultation = {
  id: string;
  farmer_id: string;
  vet_id: string | null;
  animal_id: string | null;
  title: string | null;
  description: string | null;
  images: string[] | null;
  urgency_level: string | null;
  status: string;
  contact_phone: string | null;
  location: any;
  vet_response: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateConsultationInput = {
  farmer_id: string;
  animal_id: string;
  title: string;
  description: string;
  images?: string[];
  urgency_level: string;
  contact_phone: string;
  location?: any;
  scheduled_at?: string;
};

export type UpdateConsultationInput = Partial<CreateConsultationInput> & {
  vet_id?: string;
  vet_response?: string;
  status?: string;
  completed_at?: string;
};

export class ConsultationService {
  /**
   * Get all consultations for a farmer
   */
  static async getFarmerConsultations(
    farmerId: string
  ): Promise<{ data: TeleConsultation[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('tele_consultations')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all consultations for a veterinarian
   */
  static async getVetConsultations(
    vetId: string
  ): Promise<{ data: TeleConsultation[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('tele_consultations')
        .select('*')
        .eq('vet_id', vetId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get consultation by ID
   */
  static async getConsultation(id: string): Promise<{ data: TeleConsultation | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('tele_consultations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get pending consultations for a veterinarian
   */
  static async getPendingConsultations(
    vetId: string
  ): Promise<{ data: TeleConsultation[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('tele_consultations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get upcoming consultations for a farmer
   */
  static async getUpcomingConsultations(
    farmerId: string
  ): Promise<{ data: TeleConsultation[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('tele_consultations')
        .select('*')
        .eq('farmer_id', farmerId)
        .in('status', ['confirmed', 'scheduled'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new consultation request
   */
  static async createConsultation(
    input: CreateConsultationInput
  ): Promise<{ data: TeleConsultation | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('tele_consultations')
        .insert({
          farmer_id: input.farmer_id,
          animal_id: input.animal_id,
          title: input.title,
          description: input.description,
          images: input.images || null,
          urgency_level: input.urgency_level,
          contact_phone: input.contact_phone,
          location: input.location || null,
          scheduled_at: input.scheduled_at || null,
          status: 'pending',
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as TeleConsultation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update consultation
   */
  static async updateConsultation(
    id: string,
    input: UpdateConsultationInput
  ): Promise<{ data: TeleConsultation | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('tele_consultations')
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

      return { data: data as TeleConsultation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Accept consultation (for veterinarians)
   */
  static async acceptConsultation(
    id: string,
    vetId: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('tele_consultations')
        .update({
          vet_id: vetId,
          status: 'confirmed',
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
   * Reject consultation (for veterinarians)
   */
  static async rejectConsultation(
    id: string,
    vetId: string,
    reason: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('tele_consultations')
        .update({
          vet_id: vetId,
          status: 'rejected',
          vet_response: reason,
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
   * Complete consultation
   */
  static async completeConsultation(
    id: string,
    notes: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('tele_consultations')
        .update({
          status: 'completed',
          vet_response: notes,
          completed_at: new Date().toISOString(),
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
   * Cancel consultation
   */
  static async cancelConsultation(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('tele_consultations')
        .update({
          status: 'cancelled',
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
   * Delete consultation
   */
  static async deleteConsultation(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('tele_consultations')
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
