# 14 — Intelligent Classification & Triage System

## 1. Objective & Human-in-the-Loop Philosophy
The CivicFlow AI Engine reduces administrative friction by analyzing free-form citizen text and photos to suggest:
1. **Primary Category & Subcategory**
2. **Target Municipal Department**
3. **Recommended Priority Level (Critical, High, Medium, Low)**
4. **Human-Readable Rationale & Confidence Score**

### Non-Negotiable Rule:
> **"AI recommendations are strictly advisory. The system assists humans; it never makes irreversible administrative decisions or closes tickets autonomously."**
> Authorities and citizens retain full override power over category, priority, and routing.

## 2. Dual-Engine Architecture (Zero-Failure Resilience)

To guarantee that CivicFlow operates with 100% reliability in local, offline, demo, and production environments, the AI subsystem employs a **tiered architecture**:

```text
               User types description / snaps photo
                                │
                                ▼
               ┌─────────────────────────────────┐
               │    CivicFlow Intelligent Router │
               └────────────────┬────────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          │ (If OPENAI_API_KEY / LLM is configured)   │ (Default / Offline / Fast)
          ▼                                           ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│     Semantic LLM Engine       │           │  Deterministic NLP Heuristics │
│  • OpenAI GPT-4o-mini /       │           │  • Lexical Stemming & TF-IDF  │
│    Compatible LLM Completion  │           │  • Priority Risk Matrix Rules │
│  • High-context reasoning     │           │  • Zero-latency (< 5ms)       │
└──────────────┬────────────────┘           └──────────────┬────────────────┘
               │                                           │
               └─────────────────────┬─────────────────────┘
                                     ▼
                   Standardized AI Recommendation Output:
                   • Category: ROADS
                   • Subcategory: Pothole / Road Cavity
                   • Department: Department of Public Works
                   • Priority: HIGH
                   • Confidence: 0.94
                   • Rationale: "Pothole detected near transit stop posing hazard to vehicles."
```

## 3. Heuristic NLP Rule Matrix
The local deterministic classifier evaluates semantic tokens against municipal domain dictionaries:

| Category | High-Confidence Lexical Signals | Target Department | Default SLA |
| :--- | :--- | :--- | :--- |
| **ROADS** | pothole, asphalt, crater, sinkhole, curb, road cavity, pavement, speed bump | Department of Public Works | 48 Hours |
| **SANITATION** | garbage, trash, waste, dumping, landfill, bins, recycling, stench, litter | Waste Management Authority | 24 Hours |
| **WATER** | leak, water burst, pipe, sewage, drain, overflow, flooding, hydrants, pooling | Water Supply & Drainage Board | 12 Hours |
| **ELECTRICAL** | streetlight, lamp, dark road, wiring, exposed cable, blackout, traffic light | Electrical & Lighting Bureau | 24 Hours |
| **INFRASTRUCTURE**| bench, guardrail, sidewalk, bridge, park, playground, cracked wall | Parks & Public Infrastructure | 72 Hours |
| **TRAFFIC** | blockage, illegal parking, abandoned vehicle, blind corner, sign missing | Traffic & Mobility Operations | 24 Hours |

### Priority Determination Rules:
- **CRITICAL:** Triggered if keywords include: *burst, flood, spark, live wire, sinkhole, collapsing, fire hazard, rebar exposed*.
- **HIGH:** Triggered if keywords include: *deep hole, busy intersection, school zone, hospital, transit stop, total blackout*.
- **MEDIUM:** Standard default for typical maintenance reports.
- **LOW:** Cosmetic wear, graffiti, minor scuffs, non-hazardous peeling paint.

## 4. UI Representation
In both the Citizen Reporting Wizard and the Authority Triage Drawer:
- The recommendation is displayed as an editorial intelligence chip:
  > **✦ AI Recommendation: Roads & Potholes • High Priority (94% confidence)**
  > *Rationale: Detected road cavity near active transit corridor.*
- Users can click **"Accept Recommendation"** with 1 click or manually select any alternate category from the visual grid.
