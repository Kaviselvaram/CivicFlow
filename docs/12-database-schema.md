# 12 — Database Schema & Data Models

## 1. Entity-Relationship Diagram

```text
┌──────────────┐          1:N          ┌───────────────────┐
│     User     ├──────────────────────►│       Issue       │
│──────────────│                       │───────────────────│
│ id           │                       │ id                │
│ name         │                       │ ticketNumber      │
│ email        │                       │ title             │
│ passwordHash │                       │ description       │
│ role         │                       │ category          │
│ departmentId │──┐                    │ subcategory       │
│ phone        │  │                    │ priority          │
│ createdAt    │  │                    │ status            │
└──────────────┘  │                    │ address           │
                  │                    │ latitude          │
                  │                    │ longitude         │
                  │                    │ ward              │
                  │                    │ photoUrl          │
                  │                    │ resolutionPhotoUrl│
                  │                    │ resolutionNotes   │
                  │                    │ reporterId (User) │
                  │                    │ departmentId (FK) │
                  │                    │ assigneeId (FK)   │
                  │                    │ citizenRating     │
                  │                    │ citizenFeedback   │
                  │                    │ createdAt         │
                  │                    │ updatedAt         │
                  │                    │ resolvedAt        │
                  │                    │ verifiedAt        │
                  │                    └─────────┬─────────┘
                  │                              │
                  │                              │ 1:N
                  │                              ▼
                  │                    ┌───────────────────┐
                  │                    │   StatusHistory   │
                  │                    │───────────────────│
                  │                    │ id                │
                  │                    │ issueId (FK)      │
                  │                    │ fromStatus        │
                  │                    │ toStatus          │
                  │                    │ changedById (FK)  │
                  │                    │ note              │
                  │                    │ createdAt         │
                  │                    └───────────────────┘
                  │ 1:N                          ▲
                  ▼                              │
┌──────────────────────┐                         │
│      Department      │                         │
│──────────────────────│                         │
│ id                   │                         │
│ name                 │                         │
│ slug                 │                         │
│ description          │                         │
│ contactEmail         │                         │
│ slaHoursDefault      │                         │
└──────────────────────┘                         │
                  ▲                              │
                  │ 1:N                          │
┌─────────────────┴────┐                         │
│       FieldCrew      │                         │
│──────────────────────│                         │
│ id                   │                         │
│ departmentId (FK)    │                         │
│ name                 │                         │
│ leadName             │                         │
│ vehicleId            │                         │
│ phone                │                         │
│ active               │                         │
└──────────────────────┘                         │
                  ▲                              │
                  └──────────────────────────────┘
```

## 2. Prisma Schema Definition (`schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CITIZEN
  AUTHORITY
  ADMIN
}

enum Status {
  REPORTED
  IN_REVIEW
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  VERIFIED
  REOPENED
}

enum Priority {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum Category {
  ROADS
  SANITATION
  WATER
  ELECTRICAL
  INFRASTRUCTURE
  TRAFFIC
}

model User {
  id            String          @id @default(cuid())
  email         String          @unique
  name          String
  passwordHash  String
  role          Role            @default(CITIZEN)
  phone         String?
  avatarUrl     String?
  departmentId  String?
  department    Department?     @relation(fields: [departmentId], references: [id])
  issues        Issue[]         @relation("ReportedIssues")
  assignedIssues Issue[]        @relation("AssignedSupervisor")
  historyChanges StatusHistory[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model Department {
  id              String      @id @default(cuid())
  name            String      @unique
  slug            String      @unique
  description     String
  contactEmail    String
  slaHoursDefault Int         @default(48)
  crews           FieldCrew[]
  users           User[]
  issues          Issue[]
  createdAt       DateTime    @default(now())
}

model FieldCrew {
  id           String     @id @default(cuid())
  name         String
  leadName     String
  vehicleId    String?
  phone        String?
  active       Boolean    @default(true)
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  issues       Issue[]
  createdAt    DateTime   @default(now())
}

model Issue {
  id                 String          @id @default(cuid())
  ticketNumber       String          @unique // e.g. CF-1001
  title              String
  description        String
  category           Category
  subcategory        String?
  priority           Priority        @default(MEDIUM)
  status             Status          @default(REPORTED)
  
  // Geolocation
  address            String
  latitude           Float
  longitude          Float
  ward               String?
  
  // Visual Evidence
  photoUrl           String
  resolutionPhotoUrl String?
  resolutionNotes    String?
  
  // Relationships
  reporterId         String
  reporter           User            @relation("ReportedIssues", fields: [reporterId], references: [id])
  
  departmentId       String?
  department         Department?     @relation(fields: [departmentId], references: [id])
  
  assigneeId         String?
  assignee           User?           @relation("AssignedSupervisor", fields: [assigneeId], references: [id])
  
  crewId             String?
  crew               FieldCrew?      @relation(fields: [crewId], references: [id])
  
  // Citizen Verification
  citizenRating      Int?
  citizenFeedback    String?
  reopenReason       String?
  
  // Timestamps
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  resolvedAt         DateTime?
  verifiedAt         DateTime?
  reopenedAt         DateTime?
  
  statusHistory      StatusHistory[]
}

model StatusHistory {
  id         String   @id @default(cuid())
  issueId    String
  issue      Issue    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  fromStatus Status
  toStatus   Status
  actorId    String
  actor      User     @relation(fields: [actorId], references: [id])
  note       String?
  createdAt  DateTime @default(now())
}
```
