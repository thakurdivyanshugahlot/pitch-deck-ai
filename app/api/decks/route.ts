import { NextResponse } from "next/server";

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idea?: string };
    const idea = body.idea?.trim();

    if (!idea || idea.length < 20) {
      return NextResponse.json(
        { error: "Tell us a little more about your idea (at least 20 characters)." },
        { status: 400 },
      );
    }

    const deck = await prisma.deck.create({ data: { idea } });
    await inngest.send({ name: "deck/generate", data: { deckId: deck.id } });

    return NextResponse.json({ deckId: deck.id }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start deck generation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}