# Veterinary App - Architecture Document

**Last Updated**: October 5, 2026
**Status**: Database schema complete, client mocked, needs real integration

## Current Architecture State

### ✅ What Exists (Production Ready)

**Database Schema (schema-final.sql)**
- Complete PostgreSQL schema with 14 tables
- Row Level Security (RLS) policies defined
- Storage buckets configured
- Proper indexes and constraints
- **Tables**: users, animals, rescue_reports, diseases, vet_profiles, tele_consultations, medicines, medicine_stores, gaushalas, gaushala_animals, posts, comments, likes

**Frontend Structure**
- React Native + Expo + TypeScript
- React Navigation (Tabs + Stack)
- Context providers (Auth, Language, Offline)
- 10+ screen components
- TypeScript types defined

### ❌ What Needs Real Implementation

**Supabase Client (src/lib/supabaseClient.ts)**
- **CURRENT**: Mocked client returning fake data
- **NEEDS**: Real Supabase connection using environment variables
- **IMPACT**: All database operations are fake

**Authentication (src/contexts/AuthContext.tsx)**
- **CURRENT**: Mock auth with demo user
- **NEEDS**: Real Supabase Auth integration
- **IMPACT**: No real login/logout, no real user sessions

**Screen Data Flow**
- **CURRENT**: All screens use hardcoded/mock data
- **NEEDS**: Real database queries for each screen
- **IMPACT**: App looks like a demo, not a real product

## Technical Stack

### Mobile
- **Framework**: React Native + Expo SDK 48
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State**: React Context (to be enhanced with React Query)

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime (planned)

### Architecture Pattern

```
┌─────────────────────────────────────────┐
│         Mobile App (React Native)       │
├─────────────────────────────────────────┤
│  UI Layer (Screens, Components)          │
│  ┌───────────────────────────────────┐  │
│  │ Context Providers                 │  │
│  │ - AuthContext                    │  │
│  │ - LanguageContext                │  │
│  │ - OfflineContext                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Data Layer (Services)             │  │
│  │ - AnimalService                 │  │
│  │ - VetService                     │  │
│  │ - ConsultationService            │  │
│  │ - CommunityService               │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│         Supabase Client (Real)         │
├─────────────────────────────────────────┤
│         Supabase (PostgreSQL)          │
│  - Authentication                     │
│  - Database                          │
│  - Storage                           │
│  - Realtime                          │
└─────────────────────────────────────────┘
```

## Data Flow Architecture

### Current (Mock) vs Target (Real)

**Current Mock Flow:**
```
Screen → Hardcoded Data → Display
```

**Target Real Flow:**
```
Screen → Service → Supabase Client → Database → Real Data → Display
```

## Service Layer Design

### Required Services

1. **AuthService**
   - login()
   - register()
   - logout()
   - getCurrentUser()
   - updateProfile()

2. **AnimalService**
   - getAnimals(userId)
   - addAnimal(animalData)
   - updateAnimal(animalId, data)
   - deleteAnimal(animalId)
   - getAnimal(animalId)

3. **HealthRecordService**
   - getHealthRecords(animalId)
   - addHealthRecord(record)
   - updateHealthRecord(recordId, data)

4. **VetService**
   - searchVets(filters)
   - getVetProfile(vetId)
   - getAvailableVets()

5. **ConsultationService**
   - requestConsultation(data)
   - getConsultations(userId)
   - updateConsultationStatus()
   - getConsultationMessages()

6. **CommunityService**
   - getPosts(filters)
   - createPost(data)
   - addComment(postId, data)
   - likePost(postId)

7. **RescueService**
   - submitRescueReport(data)
   - getRescueReports(userId)
   - getNearbyNGOs(location)

8. **MedicineService**
   - searchMedicines(query)
   - getNearbyStores(location)

## Real Implementation Roadmap

### Phase 1: Foundation (Week 1)
1. **Real Supabase Client**
   - Replace mock client with real one
   - Configure environment variables
   - Test connection

2. **Real Authentication**
   - Implement real Supabase Auth
   - Update AuthContext
   - Add proper session management
   - Remove demo user

3. **Database Connection**
   - Apply schema to real Supabase
   - Test RLS policies
   - Verify storage buckets

### Phase 2: Core Services (Week 2)
1. **Animal Management**
   - Real CRUD operations
   - Remove mock data
   - Show empty states
   - Real image upload

2. **User Profile**
   - Real profile operations
   - Real avatar upload
   - Remove demo data

### Phase 3: Veterinary Services (Week 3)
1. **Vet Directory**
   - Real database queries
   - Real location-based search
   - Remove fake vets

2. **Consultations**
   - Real appointment system
   - Real status updates
   - Remove fake appointments

### Phase 4: Community & AI (Week 4)
1. **Community Features**
   - Real posts/comments
   - Real likes
   - Remove fake content

2. **AI Integration**
   - Real AI service connection
   - Real image analysis
   - Remove fake AI responses

## Security Architecture

### Row Level Security (RLS)

**Current Status**: Policies defined in schema, not applied to real database

**Required Implementation**:
- Apply security-policies.sql to real Supabase
- Test permissions for each role
- Verify ownership checks

### Role-Based Access

**Roles**: farmer, vet, admin

**Permissions**:
- **farmer**: own animals, own appointments, own health records
- **vet**: authorized consultations, patient data
- **admin**: platform management, verification

## Performance Optimization

### Rural Environment Considerations

1. **Data Loading**
   - Lazy loading for lists
   - Pagination for large datasets
   - Caching strategies

2. **Image Handling**
   - Compression before upload
   - Thumbnail generation
   - Progressive loading

3. **Network**
   - Offline support (partially implemented)
   - Request queuing
   - Error retry logic

## Next Implementation Task

**IMMEDIATE**: Replace mock Supabase client with real one and implement real authentication.

This is the foundation that will enable all other real features to work with actual data instead of mock data.