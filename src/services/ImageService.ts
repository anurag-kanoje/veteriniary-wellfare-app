import { supabase } from '../lib/supabaseClient';

export type ImageUploadResult = {
  url: string | null;
  error: Error | null;
};

export class ImageService {
  /**
   * Upload an animal profile image
   * @param userId - The authenticated user's ID
   * @param animalId - The animal's ID
   * @param file - The file to upload (File object or base64 string)
   * @param fileName - The name of the file
   */
  static async uploadAnimalProfileImage(
    userId: string,
    animalId: string,
    file: File | string,
    fileName: string
  ): Promise<ImageUploadResult> {
    try {
      // Generate a unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/${animalId}/${Date.now()}.${fileExt}`;

      let fileToUpload: File | Blob;

      // Handle base64 string
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        fileToUpload = file;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('animal-profiles')
        .upload(filePath, fileToUpload);

      if (error) {
        return { url: null, error: error as Error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('animal-profiles')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Upload a health record image
   * @param userId - The authenticated user's ID
   * @param animalId - The animal's ID
   * @param recordId - The health record's ID
   * @param file - The file to upload (File object or base64 string)
   * @param fileName - The name of the file
   */
  static async uploadHealthRecordImage(
    userId: string,
    animalId: string,
    recordId: string,
    file: File | string,
    fileName: string
  ): Promise<ImageUploadResult> {
    try {
      // Generate a unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/${animalId}/${recordId}/${Date.now()}.${fileExt}`;

      let fileToUpload: File | Blob;

      // Handle base64 string
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        fileToUpload = file;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('health-records')
        .upload(filePath, fileToUpload);

      if (error) {
        return { url: null, error: error as Error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('health-records')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Upload a user avatar
   * @param userId - The authenticated user's ID
   * @param file - The file to upload (File object or base64 string)
   * @param fileName - The name of the file
   */
  static async uploadUserAvatar(
    userId: string,
    file: File | string,
    fileName: string
  ): Promise<ImageUploadResult> {
    try {
      // Generate a unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      let fileToUpload: File | Blob;

      // Handle base64 string
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        fileToUpload = file;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, fileToUpload);

      if (error) {
        return { url: null, error: error as Error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Upload a rescue report image
   * @param userId - The authenticated user's ID
   * @param reportId - The rescue report's ID
   * @param file - The file to upload (File object or base64 string)
   * @param fileName - The name of the file
   */
  static async uploadRescueReportImage(
    userId: string,
    reportId: string,
    file: File | string,
    fileName: string
  ): Promise<ImageUploadResult> {
    try {
      // Generate a unique file path
      const fileExt = fileName.split('.').pop();
      const filePath = `${userId}/${reportId}/${Date.now()}.${fileExt}`;

      let fileToUpload: File | Blob;

      // Handle base64 string
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        fileToUpload = file;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('rescue-reports')
        .upload(filePath, fileToUpload);

      if (error) {
        return { url: null, error: error as Error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('rescue-reports')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Delete an image from storage
   * @param bucket - The bucket name
   * @param filePath - The file path
   */
  static async deleteImage(
    bucket: 'animal-profiles' | 'health-records' | 'user-avatars' | 'rescue-reports',
    filePath: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Get a signed URL for private images (valid for 60 seconds)
   * @param bucket - The bucket name
   * @param filePath - The file path
   */
  static async getSignedUrl(
    bucket: 'animal-profiles' | 'health-records' | 'user-avatars' | 'rescue-reports',
    filePath: string
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60);

      if (error) {
        return { url: null, error: error as Error };
      }

      return { url: data.signedUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }
}
