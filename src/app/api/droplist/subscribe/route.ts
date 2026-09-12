import { NextResponse } from "next/server";
import { subscribeToDroplistAction } from "@/app/actions/droplist";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const result = await subscribeToDroplistAction({ email, phone });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      inviteCode: result.inviteCode,
      isExisting: result.isExisting,
      message: result.isExisting
        ? "Welcome back. Your priority access key has been retrieved."
        : "You have been registered for AETHEX Priority Access.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
