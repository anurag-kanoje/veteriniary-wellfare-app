import { supabase } from '../lib/supabaseClient';

export type Post = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type CreatePostInput = {
  user_id: string;
  content: string;
  image_url?: string;
  category?: string;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export type CreateCommentInput = {
  post_id: string;
  user_id: string;
  content: string;
};

export class CommunityService {
  /**
   * Get all posts
   */
  static async getAllPosts(): Promise<{ data: Post[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Post[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get posts by category
   */
  static async getPostsByCategory(category: string): Promise<{ data: Post[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Post[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get posts by user
   */
  static async getUserPosts(userId: string): Promise<{ data: Post[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Post[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get post by ID
   */
  static async getPost(id: string): Promise<{ data: Post | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Post, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new post
   */
  static async createPost(input: CreatePostInput): Promise<{ data: Post | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('posts')
        .insert({
          user_id: input.user_id,
          content: input.content,
          image_url: input.image_url || null,
          category: input.category || null,
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Post, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update a post
   */
  static async updatePost(id: string, input: UpdatePostInput): Promise<{ data: Post | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('posts')
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

      return { data: data as Post, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('posts')
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
   * Get comments for a post
   */
  static async getPostComments(postId: string): Promise<{ data: Comment[] | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Comment[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a comment
   */
  static async createComment(input: CreateCommentInput): Promise<{ data: Comment | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const insertResult = await supabase
        .from('comments')
        .insert({
          post_id: input.post_id,
          user_id: input.user_id,
          content: input.content,
        })
        .select()
        .single();

      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = insertResult;

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data: data as Comment, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update a comment
   */
  static async updateComment(id: string, content: string): Promise<{ data: Comment | null; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const updateResult = await supabase
        .from('comments')
        .update({
          content,
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

      return { data: data as Comment, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a comment
   */
  static async deleteComment(id: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('comments')
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
   * Check if user liked a post
   */
  static async hasUserLikedPost(postId: string, userId: string): Promise<{ data: boolean; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: false, error: error as Error };
      }

      return { data: !!data, error: null };
    } catch (error) {
      return { data: false, error: error as Error };
    }
  }

  /**
   * Like a post
   */
  static async likePost(postId: string, userId: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId,
        });

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Unlike a post
   */
  static async unlikePost(postId: string, userId: string): Promise<{ error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Get like count for a post
   */
  static async getLikeCount(postId: string): Promise<{ data: number; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) {
        return { data: 0, error: error as Error };
      }

      return { data: data?.count || 0, error: null };
    } catch (error) {
      return { data: 0, error: error as Error };
    }
  }

  /**
   * Get comment count for a post
   */
  static async getCommentCount(postId: string): Promise<{ data: number; error: Error | null }> {
    try {
      // @ts-ignore - Supabase v2.x API compatibility
      const { data, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) {
        return { data: 0, error: error as Error };
      }

      return { data: data?.count || 0, error: null };
    } catch (error) {
      return { data: 0, error: error as Error };
    }
  }
}
