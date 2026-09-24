import { NextResponse } from "next/server";
import { classifyCivicIssue } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { text, imageUrl } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Description text is required for classification" },
        { status: 400 }
      );
    }

    const result = await classifyCivicIssue(text, imageUrl);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI classification endpoint error:", error);
    return NextResponse.json(
      { error: "Classification engine error" },
      { status: 500 }
    );
  }
}
