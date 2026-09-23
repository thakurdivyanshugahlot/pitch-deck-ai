"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight01Icon,
  ArrowUp02Icon,
  CheckmarkCircle02Icon,
  Layout01Icon,
  Loading03Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Deck = {
  id: string;
  title: string | null;
  idea: string;
  status: "PENDING" | "GENERATING" | "COMPLETE" | "FAILED";
  errorMessage: string | null;
  slides: Array<{ id: string; order: number; title: string; content: string; imageUrl: string | null }>;
};

const suggestions = ["A marketplace for local makers", "AI copilot for climate teams", "The next generation of remote work"];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!deck || (deck.status !== "PENDING" && deck.status !== "GENERATING")) return;
    const poll = async () => {
      const response = await fetch(`/api/decks/${deck.id}`);
      if (response.ok) setDeck(await response.json());
    };
    const interval = window.setInterval(poll, 2500);
    return () => window.clearInterval(interval);
  }, [deck]);

  async function createDeck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to start generation.");
      setDeck({ id: result.deckId, title: null, idea, status: "PENDING", errorMessage: null, slides: [] });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isWorking = deck?.status === "PENDING" || deck?.status === "GENERATING";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f5] text-[#18211d]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#dfe5de] pb-5">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-[-0.03em]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#183d32] text-[#d9f46f]"><HugeiconsIcon icon={SparklesIcon} size={18} strokeWidth={1.8} /></span>
            pitchcraft
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-[#728077]"><span className="size-2 rounded-full bg-[#a6d64f]" />AI workspace</div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6e8375]"><span className="h-px w-8 bg-[#a6d64f]" />From idea to investor-ready</p>
            <h1 className="font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-[#183d32] sm:text-7xl">Make your big idea <em className="font-normal text-[#88a936]">land.</em></h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#718078]">Turn a rough thought into a clear, compelling pitch deck in minutes. You bring the spark. We shape the story.</p>

            <form onSubmit={createDeck} className="mt-10 max-w-lg">
              <div className="rounded-[22px] border border-[#cfd9cf] bg-white p-2 shadow-[0_20px_60px_-35px_rgba(24,61,50,0.55)] focus-within:border-[#91af45] focus-within:ring-4 focus-within:ring-[#d9f46f]/30">
                <textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Describe your startup idea..." aria-label="Describe your startup idea" rows={3} disabled={isWorking} className="w-full resize-none border-0 bg-transparent px-3 py-2 text-base leading-7 outline-none placeholder:text-[#a2aea6] disabled:opacity-60" />
                <div className="flex items-center justify-between border-t border-[#edf0ec] px-2 pt-2"><span className="px-1 text-xs text-[#94a098]">{idea.length}/500</span><button type="submit" disabled={isSubmitting || isWorking || idea.trim().length < 20} className="flex h-10 items-center gap-2 rounded-xl bg-[#183d32] px-4 text-sm font-semibold text-white transition hover:bg-[#2d5949] disabled:cursor-not-allowed disabled:opacity-45">{isSubmitting ? "Starting..." : isWorking ? "Building..." : "Build my deck"}<HugeiconsIcon icon={ArrowUp02Icon} size={16} strokeWidth={2} /></button></div>
              </div>
              {error && <p className="mt-3 text-sm text-[#b55245]">{error}</p>}
            </form>

            <div className="mt-5 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setIdea(suggestion)} disabled={isWorking} className="rounded-full border border-[#d9e1d8] bg-white/70 px-3 py-1.5 text-xs text-[#718078] transition hover:border-[#9cb75d] hover:text-[#385a4b] disabled:opacity-50">{suggestion}</button>)}</div>
          </div>

          <div className="relative min-h-[430px] lg:min-h-[560px]">
            <div className="absolute right-0 top-0 h-full w-[90%] rounded-[38px] bg-[#e5eddf]" />
            <div className="absolute left-0 top-10 w-[86%] overflow-hidden rounded-[28px] border border-[#d6e1d4] bg-white shadow-[0_30px_70px_-35px_rgba(24,61,50,0.42)]">
              <div className="flex items-center justify-between border-b border-[#edf0ec] px-5 py-4"><div className="flex items-center gap-2 text-xs font-semibold text-[#587064]"><HugeiconsIcon icon={Layout01Icon} size={16} />Your deck preview</div><span className="rounded-full bg-[#eef6d9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6d8e2d]">7 slides</span></div>
              <div className="p-5 sm:p-8"><div className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a0aea4]">01 / 07 <span className="h-px flex-1 bg-[#edf0ec]" /></div><div className="grid gap-7 sm:grid-cols-[1fr_0.8fr]"><div><div className="mb-4 h-2 w-16 rounded-full bg-[#d9f46f]" /><h2 className="font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#183d32] sm:text-5xl">The future is already here.</h2><p className="mt-5 text-sm leading-6 text-[#839087]">A sharp narrative, a memorable point of view, and the confidence to take the next step.</p></div><div className="min-h-44 rounded-2xl bg-[#1b493d] p-5 text-[#e6f5c8] [background-image:linear-gradient(135deg,rgba(166,214,79,.2),transparent_48%)]"><div className="flex h-full flex-col justify-between"><span className="text-3xl">✦</span><span className="text-xs leading-5 text-[#b4cbb9]">A story worth<br />sharing.</span></div></div></div></div>
            </div>
            <div className="absolute bottom-5 right-0 hidden w-48 rounded-2xl border border-[#d6e1d4] bg-white p-4 shadow-lg sm:block"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#587064]"><span className="size-2 rounded-full bg-[#a6d64f]" />Story arc</div><div className="space-y-2"><span className="block h-2 w-full rounded bg-[#e8eee6]" /><span className="block h-2 w-4/5 rounded bg-[#e8eee6]" /><span className="block h-2 w-3/5 rounded bg-[#d9f46f]" /></div></div>
          </div>
        </section>

        {deck && <section className="border-t border-[#dfe5de] py-10"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8b80]">{deck.status === "COMPLETE" ? "Your finished deck" : "Working on it"}</p><h2 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em] text-[#183d32]">{deck.title ?? "Building your story..."}</h2></div>{isWorking && <div className="flex items-center gap-2 text-sm text-[#718078]"><HugeiconsIcon icon={Loading03Icon} className="animate-spin" size={18} />Generating slides and visuals</div>}</div>{deck.status === "FAILED" ? <p className="text-sm text-[#b55245]">{deck.errorMessage ?? "Generation failed. Try a different idea."}</p> : deck.slides.length > 0 && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{deck.slides.map((slide) => <article key={slide.id} className="overflow-hidden rounded-2xl border border-[#dfe5de] bg-white"><div className="aspect-[16/9] bg-[#e5eddf]">{slide.imageUrl && <Image src={slide.imageUrl} alt="" width={800} height={450} className="h-full w-full object-cover" />}</div><div className="p-5"><p className="text-xs font-semibold text-[#91aa4b]">{String(slide.order).padStart(2, "0")}</p><h3 className="mt-2 font-heading text-xl font-semibold text-[#183d32]">{slide.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#718078]">{slide.content}</p></div></article>)}</div>}{deck.status === "COMPLETE" && <p className="mt-6 flex items-center gap-2 text-sm text-[#718078]"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-[#82a83b]" />Your deck is ready to present.</p>}</section>}
 
        <footer className="flex items-center justify-between border-t border-[#dfe5de] py-5 text-xs text-[#94a098]"><span>Built for bold beginnings.</span><span className="flex items-center gap-1">Pitchcraft <HugeiconsIcon icon={ArrowRight01Icon} size={14} /></span></footer>
      </div>
    </main>
  );
}
