import { supabase } from '../lib/supabaseClient';

export type RescueNGO = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: any;
  service_radius: number;
  active: boolean;
  created_at: string;
};

export type RescueReport = {
  id: string;
  reporter_id: string;
  animal_type: string | null;
  animal_description: string | null;
  location: any;
  images: string[] | null;
  urgency_level: string | null;
  description: string | null;
  contact_phone: string | null;
  status: string;
  assigned_ngo_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateRescueReportInput = {
  reporter_id: string;
  animal_type: string;
  animal_description: string;
  location: any;
  images?: string[];
  urgency_level: string;
  description: string;
  contact_phone: string;
};

export type UpdateRescueReportInput = Partial<CreateRescueReportInput> & {
  status?: string;
  assigned_ngo_id?: string;
};

export class RescueService {
  /**
   * Get all rescue NGOs
   */
  static async getAllNGOs(): Promise<{ data: RescueNGO[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_ngos')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueNGO[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get NGOs near a location
   */
  static async getNGOsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<{ data: RescueNGO[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_ngos')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      // Filter by service radius in application layer
      const ngos = data as RescueNGO[];
      const nearbyNGOs = ngos.filter(ngo => {
        if (!ngo.location || !ngo.location.latitude || !ngo.location.longitude) {
          return false;
        }
        const distance = this.calculateDistance(
          latitude,
          longitude,
          ngo.location.latitude,
          ngo.location.longitude
        );
        return distance <= (ngo.service_radius || radiusKm);
      });

      return { data: nearbyNGOs, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get NGO by ID
   */
  static async getNGO(id: string): Promise<{ data: RescueNGO | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_ngos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueNGO, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all rescue reports for a user
   */
  static async getUserRescueReports(
    reporterId: string
  ): Promise<{ data: RescueReport[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('*')
        .eq('reporter_id', reporterId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueReport[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get rescue reports by status
   */
  static async getRescueReportsByStatus(
    status: string
  ): Promise<{ data: RescueReport[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueReport[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get rescue reports by urgency
   */
  static async getRescueReportsByUrgency(
    urgencyLevel: string
  ): Promise<{ data: RescueReport[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('*')
        .eq('urgency_level', urgencyLevel)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueReport[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get rescue report by ID
   */
  static async getRescueReport(id: string): Promise<{ data: RescueReport | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new rescue report
   */
  static async createRescueReport(
    input: CreateRescueReportInput
  ): Promise<{ data: RescueReport | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('rescue_reports')
        .insert({
          reporter_id: input.reporter_id,
          animal_type: input.animal_type,
          animal_description: input.animal_description,
          location: input.location,
          images: input.images || null,
          urgency_level: input.urgency_level,
          description: input.description,
          contact_phone: input.contact_phone,
          status: 'pending',
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as RescueReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update rescue report
   */
  static async updateRescueReport(
    id: string,
    input: UpdateRescueReportInput
  ): Promise<{ data: RescueReport | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('rescue_reports')
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

      return { data: data as RescueReport, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Assign NGO to rescue report
   */
  static async assignNGO(
    reportId: string,
    ngoId: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('rescue_reports')
        .update({
          assigned_ngo_id: ngoId,
          status: 'assigned',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Update rescue report status
   */
  static async updateStatus(
    id: string,
    status: string
  ): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('rescue_reports')
        .update({
          status,
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
   * Delete rescue report
   */
  static async deleteRescueReport(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('rescue_reports')
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
