# 03 — User Journeys & End-to-End Workflows

## 1. Happy Path: Citizen Reports Pothole → Authority Resolves → Citizen Verifies

```text
[Maya walking on Elm Street]
   │  Notices 40cm pothole exposing rebar
   ▼
[Step 1: Open CivicFlow Web App]
   │  Taps "Report an Issue" CTA on Landing or Dashboard
   ▼
[Step 2: Interactive Intake Wizard]
   ├── Category: Selects "Roads & Potholes"
   ├── Photo: Snaps/uploads photo of the hazard
   ├── Location: Interactive map auto-detects "442 Elm Street, Ward 4"
   └── Description: Types "Deep pothole near crosswalk causing cyclists to swerve"
         └── AI Engine detects:
             • Recommendation: Roads Department
             • Suggested Priority: HIGH (due to cyclist hazard / deep rebar)
             • Confidence: 94%
   ▼
[Step 3: Instant Submission Receipt]
   │  Ticket #CF-8921 generated; estimated resolution window: 48 Hours
   ▼
[David at Public Works Command Center]
   ├── Filters Operations Map for "Ward 4" + "Roads"
   ├── Views Ticket #CF-8921 with photo and AI priority badge
   ├── Validates priority as "HIGH" and clicks "Assign Crew"
   └── Assigns to "Patching Crew Bravo (Vehicle #14)"
         └── Ticket moves to: ASSIGNED -> IN_PROGRESS
   ▼
[Field Crew Dispatched & Work Executed]
   ├── Crew repairs cavity with cold-mix asphalt and tamping roller
   ├── Supervisor uploads resolution photo showing smooth, cured surface
   └── Clicks "Mark as Resolved" with field notes
         └── Ticket moves to: RESOLVED
   ▼
[Maya Receives Notification & Checks Timeline]
   ├── Opens CivicFlow "My Reports"
   ├── Sees before/after comparison photo slider
   ├── Confirms repair looks solid
   └── Clicks "Confirm Resolution" (Star rating + "Thank you, crew!")
         └── Ticket moves to: VERIFIED (Closed with permanent audit hash)
```

## 2. Unhappy Path: Incomplete Repair → Citizen Reopens Issue

```text
[Ticket marked RESOLVED by Authority]
   ▼
[Citizen inspects site on their evening commute]
   │  Finds that only temporary loose gravel was poured; scattered by car tires; hole still active
   ▼
[Citizen clicks "Issue Persists / Reopen"]
   ├── Uploads new photo showing gravel dispersed
   └── Enters remark: "Gravel was displaced within 2 hours; hazard remains for cyclists"
   ▼
[Ticket moves to: REOPENED (Escalated Priority)]
   ▼
[Operations Center Alert]
   │  Ticket flagged with urgent "REOPENED BY CITIZEN" badge
   │  Supervisor routes to senior foreman for permanent hot-asphalt repair
```

## 3. Operations Supervisor Morning Routine
```text
1. Opens /authority/dashboard
2. Scans Operational Health Bar: 14 new reports, 3 critical alerts (water main burst)
3. Switches to Geospatial Cluster View to group 4 nearby streetlight outages on 5th Ave
4. Batch-assigns streetlight cluster to Electrical Contractor Unit 2
5. Inspects resolving crews' photographic submissions before approving resolution notices
```
