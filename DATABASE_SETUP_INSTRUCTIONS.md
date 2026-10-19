# Database Setup Instructions

## Step 1: Apply Database Schema to Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project: `mgjsdmgpiggysaopyunq` (from your .env file)

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   - Copy the entire content of: `migrations/001_initial_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Tables Created**
   - Click on "Database" in the left sidebar
   - Expand "Tables"
   - You should see: users, animals, health_records, rescue_ngos, rescue_reports, veterinarians, tele_consultations, posts, comments, likes, medicine_directory

5. **Verify RLS Policies**
   - Click on "Authentication" → "Policies"
   - You should see all the RLS policies created

### Option B: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref mgjsdmgpiggysaopyunq

# Apply the migration
supabase db push migrations/001_initial_schema.sql
```

## Step 2: Verify Schema Applied

Run this query in SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- animals
- comments
- health_records
- likes
- medicine_directory
- posts
- rescue_ngos
- rescue_reports
- tele_consultations
- users
- veterinarians

## Step 3: Test Database Connection

1. **Start the Expo app**
   ```bash
   cd "C:\devlopment ptojects\veterinary app\project"
   npx expo start
   ```

2. **Test Registration**
   - Open the app (web or via Expo Go)
   - Try to register a new user
   - Check if the user is created in the `users` table

3. **Test Animal Creation**
   - Login with the registered user
   - Go to "My Animals"
   - Add an animal
   - Check if the animal is created in the `animals` table

## Step 4: Troubleshooting

### Error: "relation does not exist"
- This means the migration didn't run
- Re-run the migration script in SQL Editor

### Error: "permission denied"
- This means RLS is blocking access
- Check that you're logged in as the correct user
- Verify RLS policies are correctly applied

### Error: "duplicate key value violates unique constraint"
- This means a user with that email already exists
- Use a different email or delete the existing user from the database

## Step 5: Next Steps After Database Setup

Once the database schema is applied:

1. ✅ Configure Supabase Storage buckets
2. ✅ Test authentication flow end-to-end
3. ✅ Implement image upload service
4. ✅ Test animal management workflow
5. ✅ Test health records workflow

## Important Notes

- **Do NOT use `schema-final.sql`** - it drops all tables and data
- **Use `migrations/001_initial_schema.sql`** - it's safe and preserves data
- The migration script creates tables only if they don't exist
- RLS policies ensure users can only access their own data
- All tables have proper foreign key relationships
- Indexes are created for performance optimization
