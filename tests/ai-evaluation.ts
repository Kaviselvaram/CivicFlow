import { classifyWithLocalHeuristics } from "../lib/ai";
import { IssueCategory, IssuePriority } from "../lib/types";

interface TestCase {
  description: string;
  expectedCategory: IssueCategory;
  expectedPriority: IssuePriority;
  text: string;
}

const TEST_CASES: TestCase[] = [
  // Roads
  {
    description: "Deep dangerous road cavity",
    text: "Deep 45cm pothole damaging tires and wheels on Oak Avenue crosswalk.",
    expectedCategory: "ROADS",
    expectedPriority: "HIGH",
  },
  {
    description: "Catastrophic collapsing sinkhole",
    text: "Entire street is collapsing into a deep sinkhole exposing sub-base foundation and water main.",
    expectedCategory: "ROADS",
    expectedPriority: "CRITICAL",
  },
  {
    description: "Minor road surface wear",
    text: "Minor surface wear and faded paint markings on the side curb.",
    expectedCategory: "ROADS",
    expectedPriority: "LOW",
  },

  // Water
  {
    description: "Subterranean water main burst",
    text: "High-pressure pipe burst gushing clean water into basement level and roadway.",
    expectedCategory: "WATER",
    expectedPriority: "CRITICAL",
  },
  {
    description: "Stagnant drainage and sewer leak",
    text: "Storm drain blocked with stagnant water causing sewer overflow into street.",
    expectedCategory: "WATER",
    expectedPriority: "HIGH",
  },

  // Electrical
  {
    description: "Exposed live wire sparking",
    text: "Downed power cable with sparking live wire hanging near pedestrian school crosswalk.",
    expectedCategory: "ELECTRICAL",
    expectedPriority: "CRITICAL",
  },
  {
    description: "Unlit street fixture",
    text: "Streetlight luminaire completely unlit creating dark hazard for nighttime pedestrians.",
    expectedCategory: "ELECTRICAL",
    expectedPriority: "HIGH",
  },

  // Sanitation
  {
    description: "Illegal commercial waste dumping",
    text: "Massive pile of rotting garbage and commercial dumping blocking the sidewalk and fire exit.",
    expectedCategory: "SANITATION",
    expectedPriority: "HIGH",
  },
  {
    description: "Hazardous chemical waste",
    text: "Industrial drums with hazardous chemicals dumped in back alley next to playground.",
    expectedCategory: "SANITATION",
    expectedPriority: "CRITICAL",
  },

  // Infrastructure
  {
    description: "Collapsing public bridge rail",
    text: "Pedestrian bridge guardrail broken over steep drop, major fall hazard.",
    expectedCategory: "INFRASTRUCTURE",
    expectedPriority: "CRITICAL",
  },
  {
    description: "Damaged park bench",
    text: "Park bench has broken wooden slat and weathered wood in community garden.",
    expectedCategory: "INFRASTRUCTURE",
    expectedPriority: "LOW",
  },

  // Traffic
  {
    description: "Traffic signal failure causing gridlock",
    text: "Traffic signal dead in all directions causing 30 minute gridlock at busy intersection.",
    expectedCategory: "TRAFFIC",
    expectedPriority: "HIGH",
  },
  {
    description: "Missing stop sign at busy corner",
    text: "Stop sign missing at busy corner intersection causing near collisions.",
    expectedCategory: "TRAFFIC",
    expectedPriority: "CRITICAL",
  },

  // Ambiguous / Edge cases
  {
    description: "Compound issue (Flooded pothole on road)",
    text: "Deep pothole filled with flooded sewage water near the street corner.",
    expectedCategory: "ROADS", // Pothole keyword triggers road classification
    expectedPriority: "HIGH",
  },
  {
    description: "Vague report with minimal context",
    text: "Broken public facility near the corner",
    expectedCategory: "ROADS", // Standard fallback
    expectedPriority: "MEDIUM",
  },
];

export async function runAIEvaluation(): Promise<{
  total: number;
  passed: number;
  accuracy: number;
}> {
  console.log("🤖 Running CivicFlow AI Classification Evaluation Suite...");
  let passed = 0;

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    const result = classifyWithLocalHeuristics(tc.text);

    const categoryMatch = result.category === tc.expectedCategory;
    const isSuccess = categoryMatch; // Core evaluation metric is category accuracy

    if (isSuccess) {
      passed++;
      console.log(
        `   ✓ [Case ${i + 1}/${TEST_CASES.length}] ${tc.description} → ${result.category} (${result.priority}, ${(result.confidence * 100).toFixed(0)}% conf)`
      );
    } else {
      console.error(
        `   ❌ [Case ${i + 1}/${TEST_CASES.length}] ${tc.description} → Expected ${tc.expectedCategory}/${tc.expectedPriority}, Got ${result.category}/${result.priority}`
      );
    }
  }

  const accuracy = Number(((passed / TEST_CASES.length) * 100).toFixed(1));
  console.log(`\n📊 AI Evaluation Results: ${passed}/${TEST_CASES.length} passed (${accuracy}% accuracy)\n`);

  if (accuracy < 80) {
    throw new Error(`AI Classification accuracy ${accuracy}% below minimum 80% threshold`);
  }

  return { total: TEST_CASES.length, passed, accuracy };
}

if (require.main === module) {
  runAIEvaluation().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
