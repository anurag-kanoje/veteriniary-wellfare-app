// Type declarations for @supabase/supabase-js
declare module '@supabase/supabase-js' {
  export function createClient(
    supabaseUrl: string, 
    supabaseKey: string, 
    options?: {
      auth?: {
        autoRefreshToken?: boolean;
        persistSession?: boolean;
        detectSessionInUrl?: boolean;
      };
      headers?: { [key: string]: string };
      shouldThrowOnError?: boolean;
      cookieOptions?: {
        name?: string;
        lifetime?: number;
        domain?: string;
        path?: string;
        sameSite?: string;
      };
    }
  ): SupabaseClient;

  export interface SupabaseClient {
    auth: {
      signIn: (credentials: { email: string; password: string }) => Promise<{
        user: any;
        session: any;
        error: any;
      }>;
      signUp: (credentials: { email: string; password: string }) => Promise<{
        user: any;
        session: any;
        error: any;
      }>;
      signOut: () => Promise<{ error: any }>;
      user: () => Promise<{ user: any; error: any }>;
      session: () => Promise<{ data: any; error: any }>;
      onAuthStateChange: (
        callback: (event: string, session: any) => void
      ) => { data: { subscription: { unsubscribe: () => void } } };
      updateUser: (attributes: any) => Promise<{ user: any; error: any }>;
      resetPasswordForEmail: (email: string) => Promise<{ data: any; error: any }>;
      verifyOtp: (params: { token: string; type: string }) => Promise<{ data: any; error: any }>;
    };
    
    from: (table: string) => {
      select: (query?: string) => {
        eq: (column: string, value: any) => any;
        neq: (column: string, value: any) => any;
        gt: (column: string, value: any) => any;
        gte: (column: string, value: any) => any;
        lt: (column: string, value: any) => any;
        lte: (column: string, value: any) => any;
        like: (column: string, pattern: string) => any;
        ilike: (column: string, pattern: string) => any;
        is: (column: string, value: any) => any;
        in: (column: string, values: any[]) => any;
        contains: (column: string, value: any) => any;
        containedBy: (column: string, value: any) => any;
        rangeGt: (column: string, range: any) => any;
        rangeGte: (column: string, range: any) => any;
        rangeLt: (column: string, range: any) => any;
        rangeLte: (column: string, range: any) => any;
        rangeAdjacent: (column: string, range: any) => any;
        overlaps: (column: string, value: any) => any;
        textSearch: (column: string, query: string, options?: any) => any;
        filter: (column: string, operator: string, value: any) => any;
        or: (filters: string, options?: any) => any;
        not: (column: string, operator: string, value: any) => any;
        order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }) => any;
        limit: (count: number, options?: { foreignTable?: string }) => any;
        range: (from: number, to: number, options?: { foreignTable?: string }) => any;
        single: () => Promise<{ data: any; error: any }>;
        maybeSingle: () => Promise<{ data: any; error: any }>;
        select: (query?: string) => Promise<{ data: any; error: any }>;
        insert: (values: any, options?: { returning?: 'minimal' | 'representation' }) => Promise<{ data: any; error: any }>;
        update: (values: any) => Promise<{ data: any; error: any }>;
        delete: () => Promise<{ data: any; error: any }>;
        upsert: (values: any) => Promise<{ data: any; error: any }>;
      };
      
      insert: (values: any, options?: { returning?: 'minimal' | 'representation' }) => Promise<{ data: any; error: any }>;
      update: (values: any) => Promise<{ data: any; error: any }>;
      delete: () => Promise<{ data: any; error: any }>;
      upsert: (values: any) => Promise<{ data: any; error: any }>;
      on: (event: 'INSERT' | 'UPDATE' | 'DELETE', callback: (payload: any) => void) => any;
    };
    
    rpc: (fn: string, params?: any) => Promise<{ data: any; error: any }>;
    
    storage: {
      from: (bucket: string) => {
        upload: (path: string, file: File, options?: any) => Promise<{ data: any; error: any }>;
        download: (path: string, options?: any) => Promise<{ data: Blob; error: any }>;
        getPublicUrl: (path: string) => { data: { publicUrl: string } };
        remove: (paths: string[]) => Promise<{ data: any; error: any }>;
        list: (path?: string, options?: any) => Promise<{ data: any; error: any }>;
      };
    };
    
    removeAllChannels: () => SupabaseClient;
    channel: (name: string) => any;
  }
  
  export interface PostgrestResponse<T> {
    data: T | null;
    error: any;
    status: number;
    statusText: string;
  }
  
  export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
    data: T;
  }
  
  export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }
  
  export interface PostgrestFilterBuilder<T> {
    eq(column: string, value: any): this;
    neq(column: string, value: any): this;
    gt(column: string, value: any): this;
    gte(column: string, value: any): this;
    lt(column: string, value: any): this;
    lte(column: string, value: any): this;
    like(column: string, pattern: string): this;
    ilike(column: string, pattern: string): this;
    is(column: string, value: any): this;
    in(column: string, values: any[]): this;
    contains(column: string, value: any): this;
    containedBy(column: string, value: any): this;
    rangeGt(column: string, range: any): this;
    rangeGte(column: string, range: any): this;
    rangeLt(column: string, range: any): this;
    rangeLte(column: string, range: any): this;
    rangeAdjacent(column: string, range: any): this;
    overlaps(column: string, value: any): this;
    textSearch(column: string, query: string, options?: any): this;
    filter(column: string, operator: string, value: any): this;
    or(filters: string, options?: any): this;
    not(column: string, operator: string, value: any): this;
    order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }): this;
    limit(count: number, options?: { foreignTable?: string }): this;
    range(from: number, to: number, options?: { foreignTable?: string }): this;
    single(): Promise<PostgrestSingleResponse<T>>;
    maybeSingle(): Promise<PostgrestMaybeSingleResponse<T>>;
    select(columns?: string): Promise<PostgrestResponse<T[]>>;
    insert(values: any, options?: { returning?: 'minimal' | 'representation' }): Promise<PostgrestResponse<T>>;
    update(values: any): Promise<PostgrestResponse<T>>;
    delete(): Promise<PostgrestResponse<T>>;
    upsert(values: any): Promise<PostgrestResponse<T>>;
  }
}
