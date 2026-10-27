import { AIClassificationResult, IssueCategory, IssuePriority } from "./types";

interface RuleMatch {
  category: IssueCategory;
  subcategory: string;
  departmentSlug: string;
  departmentName: string;
  priority: IssuePriority;
  score: number;
  matchedKeywords: string[];
}

const DOMAIN_RULES: Array<{
  category: IssueCategory;
  subcategory: string;
  departmentSlug: string;
  departmentName: string;
  keywords: string[];
  priorityKeywords: {
    CRITICAL: string[];
    HIGH: string[];
    LOW: string[];
  };

}> = [
  {
    category: "ROADS",
    subcategory: "Pothole / Road Cavity",
    departmentSlug: "public-works",
    departmentName: "Department of Public Works",
    keywords: [
      "pothole",
      "potholes",
      "asphalt",
      "crater",
      "sinkhole",
      "road",
      "street",
      "curb",
      "tarmac",
      "pavement",
      "rebar",
      "cavity",
      "speed bump",
    ],
    priorityKeywords: {
      CRITICAL: ["sinkhole", "collapsing", "rebar exposed", "axle broken", "unavoidable deep"],
      HIGH: ["bus stop", "crosswalk", "intersection", "deep", "large pothole", "cyclist", "tire damage"],
      LOW: ["minor crack", "paint", "surface wear"],
    },
  },

  {
    category: "WATER",
    subcategory: "Water Main / Sewer Leak",
    departmentSlug: "water-drainage",
    departmentName: "Water Supply & Drainage Board",
    keywords: [
      "water",
      "leak",
      "pipe",
      "burst",
      "drain",
      "sewage",
      "flood",
      "flooding",
      "hydrant",
      "stagnant",
      "overflow",
      "gushing",
      "valve",
      "sewer",
    ],
    priorityKeywords: {
      CRITICAL: ["burst", "gushing", "flooding houses", "basement", "drinking water contaminated"],
      HIGH: ["roadway flooding", "open manhole", "overflowing sewer", "high pressure"],
      LOW: ["slow drip", "trickle", "damp spot"],
    },
  },
  {
    category: "ELECTRICAL",
    subcategory: "Streetlight / Electrical Grid",
    departmentSlug: "electrical-lighting",
    departmentName: "Electrical & Lighting Bureau",
    keywords: [
      "streetlight",
      "street light",
      "lamp",
      "dark",
      "light",
      "blackout",
      "wire",
      "spark",
      "cable",
      "luminaire",
      "pole",
      "unlit",
      "bulb",
    ],
    priorityKeywords: {
      CRITICAL: ["live wire", "sparking", "hanging cable", "electric shock hazard"],
      HIGH: ["school crosswalk unlit", "entire street dark", "pedestrian hazard", "blackout"],
      LOW: ["flickering slightly", "globe dirty"],
    },
  },
  {
    category: "SANITATION",
    subcategory: "Solid Waste & Dumping",
    departmentSlug: "waste-management",
    departmentName: "Waste Management Authority",
    keywords: [
      "garbage",
      "trash",
      "waste",
      "dumping",
      "litter",
      "bin",
      "bins",
      "rotting",
      "smell",
      "stench",
      "debris",
      "cardboard",
      "rubbish",
    ],
    priorityKeywords: {
      CRITICAL: ["medical waste", "hazardous chemicals", "blocking fire exit"],
      HIGH: ["commercial dumping", "rotting meat", "pest infestation", "blocking sidewalk"],
      LOW: ["single bag", "litter on grass"],
    },
  },
  {
    category: "INFRASTRUCTURE",
    subcategory: "Public Assets & Parks",
    departmentSlug: "parks-infrastructure",
    departmentName: "Parks & Public Infrastructure",
    keywords: [
      "bench",
      "guardrail",
      "railing",
      "park",
      "playground",
      "swing",
      "slide",
      "bridge",
      "walkway",
      "barrier",
      "sidewalk slab",
      "statue",
    ],
    priorityKeywords: {
      CRITICAL: ["bridge gap", "guardrail broken over drop", "playground structure collapsing"],
      HIGH: ["sharp metal", "exposed bolt", "fall hazard", "loose barrier"],
      LOW: ["peeling paint", "graffiti", "weathered wood"],
    },
  },
  {
    category: "TRAFFIC",
    subcategory: "Traffic & Mobility",
    departmentSlug: "traffic-mobility",
    departmentName: "Traffic & Mobility Operations",
    keywords: [
      "traffic",
      "signal",
      "stop sign",
      "sign",
      "gridlock",
      "blocking",
      "abandoned car",
      "blind spot",
      "crosswalk marking",
    ],
    priorityKeywords: {
      CRITICAL: ["stop sign missing at busy corner", "traffic signals dead all directions"],
      HIGH: ["signal stuck on red", "30 minute gridlock", "crosswalk line erased"],
      LOW: ["faded sign border", "minor sticker"],
    },
  },
];

async function classifyWithLLM(
  text: string,
  imageUrl?: string
): Promise<AIClassificationResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      {
        role: "system",
        content:
          "You are a municipal civic issue triage AI. Classify the citizen report into one of the 6 categories: ROADS, SANITATION, WATER, ELECTRICAL, INFRASTRUCTURE, TRAFFIC. Priority must be: CRITICAL, HIGH, MEDIUM, or LOW. Return JSON with keys: category, subcategory, departmentSlug, departmentName, priority, confidence (number 0.0-1.0), rationale.",
      },
    ];

    if (imageUrl && imageUrl.startsWith("http")) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: text,
      });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 250,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (parsed.category && parsed.priority) {
      return {
        category: parsed.category,
        subcategory: parsed.subcategory || `${parsed.category} Issue`,
        departmentSlug: parsed.departmentSlug || "public-works",
        departmentName: parsed.departmentName || "Department of Public Works",
        priority: parsed.priority,
        confidence: Number((parsed.confidence || 0.95).toFixed(2)),
        rationale: parsed.rationale || "Categorized via external LLM municipal triage.",
      };
    }
    return null;
  } catch {
    return null; // Graceful fallback to heuristic rules
  }
}

export function classifyWithLocalHeuristics(
  text: string
): AIClassificationResult {
  const normalizedText = text.toLowerCase();

  // Score each category based on keyword matches
  const matches: RuleMatch[] = DOMAIN_RULES.map((rule) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    for (const kw of rule.keywords) {
      if (normalizedText.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
        matchedKeywords.push(kw);
      }
    }

    // Determine priority
    let priority: IssuePriority = "MEDIUM";
    for (const crit of rule.priorityKeywords.CRITICAL) {
      if (normalizedText.includes(crit)) {
        priority = "CRITICAL";
        score += 5;
        break;
      }
    }

    if (priority !== "CRITICAL") {
      for (const high of rule.priorityKeywords.HIGH) {
        if (normalizedText.includes(high)) {
          priority = "HIGH";
          score += 3;
          break;
        }
      }
    }

    if (priority === "MEDIUM") {
      for (const low of rule.priorityKeywords.LOW) {
        if (normalizedText.includes(low)) {
          priority = "LOW";
          break;
        }
      }
    }

    return {
      category: rule.category,
      subcategory: rule.subcategory,
      departmentSlug: rule.departmentSlug,
      departmentName: rule.departmentName,
      priority,
      score,
      matchedKeywords,
    };
  });

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);
  const best = matches[0];

  // If no confident match, provide balanced default
  if (!best || best.score === 0) {
    return {
      category: "ROADS",
      subcategory: "General Municipal Observation",
      departmentSlug: "public-works",
      departmentName: "Department of Public Works",
      priority: "MEDIUM",
      confidence: 0.65,
      rationale:
        "Standard civic report routed to Public Works for primary triage.",
    };
  }

  // Calculate normalized confidence score
  const confidence = Math.min(0.98, Math.max(0.72, 0.7 + best.score * 0.05));

  const keywordList = best.matchedKeywords.slice(0, 3).join(", ");
  const rationale = `Detected semantic markers (${keywordList || best.category.toLowerCase()}) indicating ${best.subcategory.toLowerCase()}. Suggested ${best.priority} priority based on public safety impact.`;

  return {
    category: best.category,
    subcategory: best.subcategory,
    departmentSlug: best.departmentSlug,
    departmentName: best.departmentName,
    priority: best.priority,
    confidence: Number(confidence.toFixed(2)),
    rationale,
  };
}


export async function classifyCivicIssue(
  text: string,
  imageUrl?: string
): Promise<AIClassificationResult> {
  // 1. Try external LLM if configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
    const llm = await classifyWithLLM(text, imageUrl);
    if (llm) return llm;
  }
  // 2. Zero-latency local deterministic heuristic engine
  return classifyWithLocalHeuristics(text);

}
