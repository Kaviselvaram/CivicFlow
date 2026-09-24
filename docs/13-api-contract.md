# 13 — API Contract & Endpoint Specifications

## Base URL
`/api`

All API requests and responses use standard `application/json`.
Authenticated requests read from HTTP-only encrypted session cookies or Bearer JWT headers.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new citizen account.
- **Request Body:**
  ```json
  {
    "name": "Maya Chen",
    "email": "maya@civicflow.org",
    "password": "SecurePassword123!",
    "phone": "+1 (555) 234-5678"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "user": {
      "id": "cuid_123",
      "name": "Maya Chen",
      "email": "maya@civicflow.org",
      "role": "CITIZEN"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user and establishes session.
- **Request Body:**
  ```json
  {
    "email": "maya@civicflow.org",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "cuid_123",
      "name": "Maya Chen",
      "email": "maya@civicflow.org",
      "role": "CITIZEN"
    }
  }
  ```

### `POST /api/auth/demo`
Instantly logs in as a pre-seeded demo persona without typing credentials.
- **Request Body:** `{ "persona": "citizen" | "authority" }`
- **Response (200 OK):** User payload with appropriate role.

### `GET /api/auth/me`
Retrieves current authenticated session.
- **Response (200 OK):** Current user object or `{ "user": null }`.

### `POST /api/auth/logout`
Destroys session cookies.

---

## 2. Issues Endpoints

### `GET /api/issues`
Retrieves list of civic issues with optional filtering.
- **Query Params:**
  - `status`: `REPORTED` | `IN_REVIEW` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `VERIFIED` | `REOPENED`
  - `category`: `ROADS` | `SANITATION` | `WATER` | `ELECTRICAL` | `INFRASTRUCTURE` | `TRAFFIC`
  - `priority`: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`
  - `departmentId`: string
  - `ward`: string
  - `mine`: `true` (filters to logged-in citizen's reports)
  - `search`: string (free text on title, description, address, ticketNumber)
- **Response (200 OK):**
  ```json
  {
    "issues": [
      {
        "id": "cuid_issue_1",
        "ticketNumber": "CF-1001",
        "title": "Severe road cavity near transit stop",
        "description": "Deep 40cm pothole exposing rebar.",
        "category": "ROADS",
        "priority": "HIGH",
        "status": "IN_PROGRESS",
        "address": "442 Elm Street, Ward 4",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "photoUrl": "https://...",
        "reporter": { "name": "Maya Chen", "email": "maya@..." },
        "department": { "name": "Department of Public Works" },
        "crew": { "name": "Road Patching Crew Bravo" },
        "createdAt": "2026-09-24T10:30:00Z"
      }
    ],
    "total": 1
  }
  ```

### `POST /api/issues`
Creates a new civic issue report.
- **Request Body:**
  ```json
  {
    "title": "Deep pothole near crosswalk",
    "description": "Deep hole damaging tire rims and bicycle wheels",
    "category": "ROADS",
    "address": "442 Elm Street, Ward 4",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "ward": "Ward 4",
    "photoUrl": "data:image/jpeg;base64,...",
    "suggestedPriority": "HIGH",
    "suggestedDepartment": "Public Works"
  }
  ```
- **Response (201 Created):** Full issue object with generated `ticketNumber` and initial `StatusHistory` record.

### `GET /api/issues/[id]`
Retrieves complete issue detail including audit timeline, photos, crew info, and resolution proof.

### `PATCH /api/issues/[id]/triage` (Authority Only)
Overrides classification, department, priority, or field crew.
- **Request Body:**
  ```json
  {
    "priority": "CRITICAL",
    "departmentId": "dept_cuid_pw",
    "crewId": "crew_cuid_bravo",
    "note": "Re-triaged due to proximity to school crossing"
  }
  ```

### `POST /api/issues/[id]/status` (Authority Only)
Transitions issue lifecycle status.
- **Request Body:**
  ```json
  {
    "toStatus": "RESOLVED",
    "note": "Pothole filled with hot asphalt and compacted",
    "resolutionPhotoUrl": "https://..."
  }
  ```

### `POST /api/issues/[id]/verify` (Citizen Only)
Citizen confirms problem is physically resolved.
- **Request Body:**
  ```json
  {
    "citizenRating": 5,
    "citizenFeedback": "Inspected on my walk home. Excellent smooth finish!"
  }
  ```

### `POST /api/issues/[id]/reopen` (Citizen Only)
Citizen flags that defect was not properly fixed.
- **Request Body:**
  ```json
  {
    "reopenReason": "Loose gravel washed away after rain, hole remains hazardous."
  }
  ```

---

## 3. Intelligent Triage Endpoint

### `POST /api/ai/classify`
Receives natural language issue description and returns structured recommendations.
- **Request Body:**
  ```json
  {
    "text": "Huge water pipe burst flooding the entire intersection on 4th Ave."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "category": "WATER",
    "subcategory": "Water Main Burst",
    "department": "Water Supply & Drainage",
    "departmentSlug": "water-drainage",
    "priority": "CRITICAL",
    "confidence": 0.96,
    "rationale": "High volume water leak poses immediate erosion hazard to asphalt foundation and traffic."
  }
  ```

---

## 4. Operational Telemetry & Analytics

### `GET /api/analytics`
Returns operational metrics for authority dashboard and public transparency page:
- `totalIssues`, `openIssues`, `inProgressIssues`, `resolvedIssues`, `verifiedIssues`
- `verificationRatePercent`
- `averageResolutionHours`
- `issuesByCategory`
- `issuesByWard`
- `recentActivityFeed`
