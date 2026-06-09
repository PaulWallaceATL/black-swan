"use client";

import * as React from "react";
import {
  Wand2,
  UserRound,
  BookOpen,
  LifeBuoy,
  Layers3,
  MessagesSquare,
  LineChart,
  Type,
  Link2,
  ImageIcon,
  AudioLines,
  Video,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { bandColor } from "@/lib/ai/display";
import type { FeatureId } from "@/lib/ai/schemas";
import type {
  AnalyzeResponse,
  ContentInput,
  ContentKind,
  ConversationMessage,
  UserProfile,
} from "@/lib/ai/types";
import {
  clearHistory,
  computeStats,
  getPatternsServerSnapshot,
  getPatternsSnapshot,
  recordAnalysis,
  subscribePatterns,
  type PatternRecord,
} from "@/lib/patterns";

type Status = "idle" | "loading" | "done" | "error";

interface FileContent {
  dataUrl: string;
  mediaType: string;
  name: string;
}

const INPUT_TABS: {
  kind: ContentKind;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { kind: "text", label: "Text", icon: Type },
  { kind: "url", label: "Link", icon: Link2 },
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "audio", label: "Audio", icon: AudioLines },
  { kind: "video", label: "Video", icon: Video },
  { kind: "conversation", label: "Conversation", icon: MessagesSquare },
];

const FEATURES: {
  id: FeatureId;
  name: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "personalLens",
    name: "Personal Lens",
    blurb: "Tailor the reading to your context",
    icon: UserRound,
  },
  {
    id: "narrative",
    name: "Narrative Explanation",
    blurb: "Educational breakdown of why",
    icon: BookOpen,
  },
  {
    id: "coach",
    name: "Response Coach",
    blurb: "Practical, safe next steps",
    icon: LifeBuoy,
  },
  {
    id: "misogynoir",
    name: "Misogynoir Lens",
    blurb: "Intersectional (misogyny + anti-Black racism)",
    icon: Layers3,
  },
  {
    id: "conversation",
    name: "Conversation Analyzer",
    blurb: "Multi-turn dynamics & escalation",
    icon: MessagesSquare,
  },
];

const MAX_FILE_BYTES = 25 * 1024 * 1024;

export function Console() {
  const [kind, setKind] = React.useState<ContentKind>("text");
  const [text, setText] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState<FileContent | null>(null);
  const [messages, setMessages] = React.useState<ConversationMessage[]>([
    { speaker: "Person A", text: "" },
    { speaker: "Person B", text: "" },
  ]);
  const [features, setFeatures] = React.useState<Set<FeatureId>>(
    new Set(["personalLens", "narrative", "coach"])
  );
  const [profile, setProfile] = React.useState<UserProfile>({});

  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null);

  const history = React.useSyncExternalStore(
    subscribePatterns,
    getPatternsSnapshot,
    getPatternsServerSnapshot
  );

  const stats = React.useMemo(() => computeStats(history), [history]);

  function toggleFeature(id: FeatureId) {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onFileSelected(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setError("File is larger than 25 MB. Please use a smaller file.");
      return;
    }
    setError(null);
    const dataUrl = await readFileAsDataUrl(f);
    setFile({ dataUrl, mediaType: f.type, name: f.name });
  }

  function buildContent(): ContentInput | { error: string } {
    switch (kind) {
      case "text":
        if (!text.trim()) return { error: "Enter some text to analyze." };
        return { type: "text", text };
      case "url":
        if (!url.trim()) return { error: "Enter a URL to analyze." };
        return { type: "url", url: url.trim() };
      case "image":
      case "audio":
      case "video":
        if (!file) return { error: `Upload ${kind} to analyze.` };
        return {
          type: kind,
          dataUrl: file.dataUrl,
          mediaType: file.mediaType,
          name: file.name,
        };
      case "conversation": {
        const filled = messages.filter((m) => m.text.trim());
        if (filled.length === 0)
          return { error: "Add at least one message with text." };
        return { type: "conversation", messages: filled };
      }
    }
  }

  async function analyze() {
    const content = buildContent();
    if ("error" in content) {
      setError(content.error);
      setStatus("error");
      return;
    }

    const activeFeatures = new Set(features);
    if (kind === "conversation") activeFeatures.add("conversation");
    const featureList = [...activeFeatures];

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content, features: featureList, profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed.");

      const response = data as AnalyzeResponse;
      setResult(response);
      setStatus("done");
      recordAnalysis(response, featureList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setStatus("error");
    }
  }

  function onClearHistory() {
    clearHistory();
  }

  const loading = status === "loading";

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:py-12">
      {/* ---------------- Input column ---------------- */}
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-violet/15 text-violet">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                Black Swan Engine
              </p>
              <p className="text-sm font-medium text-foreground">
                Analyze content
              </p>
            </div>
          </div>

          {/* Input type tabs */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {INPUT_TABS.map((tab) => (
              <button
                key={tab.kind}
                type="button"
                onClick={() => {
                  setKind(tab.kind);
                  setError(null);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                  kind === tab.kind
                    ? "border-violet/40 bg-violet/15 text-foreground"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input surface */}
          <div className="mt-4">
            {kind === "text" && (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a message, post, comment, or any text to assess for misogyny risk…"
                className="min-h-40"
              />
            )}

            {kind === "url" && (
              <div className="grid gap-1.5">
                <Label htmlFor="url-input">Page or post URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/post/123"
                />
                <p className="text-xs text-muted-foreground">
                  Black Swan fetches the page and extracts its readable text.
                </p>
              </div>
            )}

            {(kind === "image" || kind === "audio" || kind === "video") && (
              <FileDrop
                kind={kind}
                file={file}
                onSelect={onFileSelected}
                onClear={() => setFile(null)}
              />
            )}

            {kind === "conversation" && (
              <ConversationEditor
                messages={messages}
                setMessages={setMessages}
              />
            )}
          </div>
        </div>

        {/* Feature modules */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            Modules
          </p>
          <div className="mt-3 grid gap-2">
            {/* Transformation Engine — always on */}
            <div className="flex items-start gap-3 rounded-xl border border-violet/30 bg-violet/[0.06] p-3">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-violet/20 text-violet">
                <Wand2 className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Transformation Engine
                  <Lock className="size-3 text-muted-foreground" />
                </p>
                <p className="text-xs text-muted-foreground">
                  Core risk scoring — always runs
                </p>
              </div>
            </div>

            {FEATURES.map((f) => {
              const active = features.has(f.id);
              const autoConv =
                f.id === "conversation" && kind === "conversation";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFeature(f.id)}
                  aria-pressed={active || autoConv}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    active || autoConv
                      ? "border-violet/40 bg-violet/[0.05]"
                      : "border-border/60 bg-background/30 hover:border-border"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
                      active || autoConv
                        ? "bg-violet/20 text-violet"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <f.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {f.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{f.blurb}</p>
                    {autoConv && !active && (
                      <p className="mt-0.5 text-[0.7rem] text-violet">
                        Auto-enabled for conversations
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1 h-4 w-7 shrink-0 rounded-full p-0.5 transition-colors",
                      active || autoConv ? "bg-violet" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "block size-3 rounded-full bg-background transition-transform",
                        active || autoConv ? "translate-x-3" : "translate-x-0"
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {features.has("personalLens") && (
            <div className="mt-4 grid gap-2 rounded-xl border border-border/60 bg-background/30 p-3">
              <p className="text-xs font-medium text-foreground">
                Personal Lens context
              </p>
              <Input
                value={profile.context ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, context: e.target.value }))
                }
                placeholder="Who you are / relevant context"
              />
              <Input
                value={profile.goals ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, goals: e.target.value }))
                }
                placeholder="What you want from this analysis"
              />
              <Input
                value={profile.sensitivity ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, sensitivity: e.target.value }))
                }
                placeholder="Preferred tone / sensitivity"
              />
            </div>
          )}

          <Button
            onClick={analyze}
            disabled={loading}
            size="lg"
            className="mt-4 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Run analysis
              </>
            )}
          </Button>

          {error && (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ---------------- Results column ---------------- */}
      <div className="flex flex-col gap-5">
        {status === "idle" && !result && <EmptyState />}
        {loading && <LoadingState />}
        {result && <Results response={result} />}
        <PatternTracker
          stats={stats}
          records={history}
          onClear={onClearHistory}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input subcomponents                                                 */
/* ------------------------------------------------------------------ */

function FileDrop({
  kind,
  file,
  onSelect,
  onClear,
}: {
  kind: "image" | "audio" | "video";
  file: FileContent | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const accept =
    kind === "image" ? "image/*" : kind === "audio" ? "audio/*" : "video/*";
  return (
    <div className="grid gap-2">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-background/30 px-4 py-8 text-center transition-colors hover:border-violet/40">
        <input
          type="file"
          accept={accept}
          onChange={onSelect}
          className="sr-only"
        />
        {kind === "image" && <ImageIcon className="size-6 text-blush" />}
        {kind === "audio" && <AudioLines className="size-6 text-blush" />}
        {kind === "video" && <Video className="size-6 text-blush" />}
        <span className="text-sm text-foreground">
          {file ? file.name : `Upload ${kind} (max 25 MB)`}
        </span>
        <span className="text-xs text-muted-foreground">
          {kind === "image"
            ? "Screenshots, memes, posts — read with vision"
            : "Transcribed, then analyzed for gendered harm"}
        </span>
      </label>
      {file && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.dataUrl}
          alt="Selected preview"
          className="max-h-48 w-full rounded-lg object-contain"
        />
      )}
      {file && (
        <Button variant="ghost" size="sm" onClick={onClear} className="w-fit">
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      )}
    </div>
  );
}

function ConversationEditor({
  messages,
  setMessages,
}: {
  messages: ConversationMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
}) {
  function update(i: number, patch: Partial<ConversationMessage>) {
    setMessages((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m))
    );
  }
  return (
    <div className="grid gap-2">
      {messages.map((m, i) => (
        <div key={i} className="grid gap-1.5 rounded-xl border border-border/60 bg-background/30 p-2.5">
          <div className="flex items-center gap-2">
            <Input
              value={m.speaker}
              onChange={(e) => update(i, { speaker: e.target.value })}
              placeholder="Speaker"
              className="h-7 max-w-40 text-xs"
            />
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setMessages((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="ml-auto"
                aria-label="Remove message"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
          <Textarea
            value={m.text}
            onChange={(e) => update(i, { text: e.target.value })}
            placeholder="Message text…"
            className="min-h-12"
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setMessages((prev) => [
            ...prev,
            { speaker: `Person ${String.fromCharCode(65 + prev.length)}`, text: "" },
          ])
        }
        className="w-fit"
      >
        <Plus className="size-3.5" />
        Add message
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result subcomponents                                                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-violet/15 text-violet">
        <Wand2 className="size-6" />
      </span>
      <p className="mt-4 font-display text-lg text-foreground">
        Run an analysis to see results
      </p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Black Swan returns a calibrated misogyny risk score plus any modules you
        enable — narrative explanation, response coaching, lenses, and more.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-border/60 bg-card/40 px-6 py-16 text-center">
      <Loader2 className="size-8 animate-spin text-violet" />
      <p className="mt-4 text-sm text-muted-foreground">
        Reading, transcribing, and reasoning over the content…
      </p>
    </div>
  );
}

function Results({ response }: { response: AnalyzeResponse }) {
  const { analysis, meta } = response;
  const t = analysis.transformation;
  const color = bandColor(t.band);

  return (
    <div className="flex flex-col gap-4">
      {/* Transformation Engine — score */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wand2 className="size-4 text-violet" />
            <h2 className="text-sm font-medium text-foreground">
              Transformation Engine
            </h2>
          </div>
          <span className="truncate font-mono text-[0.7rem] text-muted-foreground">
            {meta.sourceLabel}
          </span>
        </header>

        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <ScoreDial score={t.riskScore} color={color} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-lg font-semibold"
                style={{ color }}
              >
                {t.band} risk
              </span>
              <Badge variant="outline" className="font-mono">
                conf {t.confidence.toFixed(2)}
              </Badge>
              {t.reclaimedOrCritique && (
                <Badge variant="secondary">Reclaimed / critique</Badge>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.summary}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-5 grid gap-2.5">
          {t.categories.map((c) => (
            <div key={c.name}>
              <div className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-xs text-foreground/90">
                  {c.name}
                </span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-pearl/10">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700"
                    style={{
                      width: `${clamp(c.score)}%`,
                      backgroundColor: bandColor(
                        c.score >= 85
                          ? "Critical"
                          : c.score >= 60
                            ? "Severe"
                            : c.score >= 30
                              ? "Elevated"
                              : "Low"
                      ),
                    }}
                  />
                </span>
                <span className="w-7 text-right font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                  {Math.round(c.score)}
                </span>
              </div>
              <p className="mt-1 pl-[10.75rem] text-[0.7rem] leading-snug text-muted-foreground/80">
                {c.rationale}
              </p>
            </div>
          ))}
        </div>

        {t.signals.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
            {t.signals.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[0.7rem] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {meta.notes.length > 0 && (
          <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground/70">
            {meta.notes.join(" · ")} · {meta.model}
          </p>
        )}
      </section>

      {analysis.personalLens && (
        <ModuleCard icon={UserRound} title="Personal Lens">
          <Field label="Tailored reading">
            {analysis.personalLens.tailoredReading}
          </Field>
          <Field label="Likely impact">
            {analysis.personalLens.likelyImpact}
          </Field>
          <Field label="Validation">{analysis.personalLens.validation}</Field>
          {analysis.personalLens.suggestedFocus.length > 0 && (
            <ChipList items={analysis.personalLens.suggestedFocus} />
          )}
        </ModuleCard>
      )}

      {analysis.narrative && (
        <ModuleCard icon={BookOpen} title="Narrative Explanation">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis.narrative.explanation}
          </p>
          {analysis.narrative.keyTerms.length > 0 && (
            <dl className="mt-3 grid gap-2">
              {analysis.narrative.keyTerms.map((k) => (
                <div
                  key={k.term}
                  className="rounded-lg border border-border/60 bg-background/30 p-2.5"
                >
                  <dt className="text-xs font-medium text-foreground">
                    {k.term}
                  </dt>
                  <dd className="mt-0.5 text-xs text-muted-foreground">
                    {k.definition}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <Field label="Why it matters">
            {analysis.narrative.whyItMatters}
          </Field>
        </ModuleCard>
      )}

      {analysis.coach && (
        <ModuleCard icon={LifeBuoy} title="Response Coach">
          <p className="text-sm italic leading-relaxed text-muted-foreground">
            “{analysis.coach.readback}”
          </p>
          <div className="mt-3 grid gap-2">
            {analysis.coach.options.map((o, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 bg-background/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{o.approach}</Badge>
                  <span className="text-sm font-medium text-foreground">
                    {o.label}
                  </span>
                </div>
                <p className="mt-2 rounded-lg bg-violet/[0.06] p-2.5 text-sm text-foreground/90">
                  {o.script}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {o.rationale}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-1.5 rounded-xl border border-border/60 bg-background/30 p-3">
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-rose-gold" />
              {analysis.coach.safetyNote}
            </p>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-blush" />
              <span>
                <span className="font-medium text-foreground">
                  When to escalate:{" "}
                </span>
                {analysis.coach.whenToEscalate}
              </span>
            </p>
          </div>
        </ModuleCard>
      )}

      {analysis.misogynoirLens && (
        <ModuleCard icon={Layers3} title="Misogynoir Lens">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                analysis.misogynoirLens.present ? "destructive" : "secondary"
              }
            >
              {analysis.misogynoirLens.present ? "Detected" : "Not detected"}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {analysis.misogynoirLens.analysis}
          </p>
          {analysis.misogynoirLens.intersectionalSignals.length > 0 && (
            <ChipList items={analysis.misogynoirLens.intersectionalSignals} />
          )}
          {analysis.misogynoirLens.notes && (
            <Field label="Notes">{analysis.misogynoirLens.notes}</Field>
          )}
        </ModuleCard>
      )}

      {analysis.conversation && (
        <ModuleCard icon={MessagesSquare} title="Conversation Analyzer">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              Trend: {analysis.conversation.escalationTrend}
            </Badge>
          </div>
          <Field label="Targeting">{analysis.conversation.targeting}</Field>
          <Field label="Dynamics">{analysis.conversation.dynamics}</Field>
          <div className="mt-3 grid gap-2">
            {analysis.conversation.turns.map((turn) => (
              <div
                key={turn.index}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/30 p-2.5"
              >
                <span
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold tabular-nums"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--violet) 12%, transparent)",
                    color: bandColor(
                      turn.riskScore >= 85
                        ? "Critical"
                        : turn.riskScore >= 60
                          ? "Severe"
                          : turn.riskScore >= 30
                            ? "Elevated"
                            : "Low"
                    ),
                  }}
                >
                  {Math.round(turn.riskScore)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {turn.speaker}
                  </p>
                  <p className="truncate text-xs text-muted-foreground/80">
                    “{turn.excerpt}”
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {turn.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ModuleCard>
      )}
    </div>
  );
}

function ScoreDial({ score, color }: { score: number; color: string }) {
  const pct = clamp(score);
  return (
    <div className="relative grid size-24 place-items-center">
      <svg viewBox="0 0 36 36" className="size-24 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="oklch(0.7 0.04 320 / 0.14)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="block font-mono text-2xl font-semibold tabular-nums text-foreground">
          {Math.round(score)}
        </span>
        <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <header className="flex items-center gap-2">
        <Icon className="size-4 text-blush" />
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90">
        {children}
      </p>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[0.7rem] text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pattern Tracker                                                     */
/* ------------------------------------------------------------------ */

function PatternTracker({
  stats,
  records,
  onClear,
}: {
  stats: ReturnType<typeof computeStats>;
  records: PatternRecord[];
  onClear: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LineChart className="size-4 text-blush" />
          <h2 className="text-sm font-medium text-foreground">
            Pattern Tracker
          </h2>
        </div>
        {records.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        )}
      </header>

      {stats.total === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Your analyses are tracked here over time, surfacing trends, recurring
          categories, and escalation. Run your first analysis to begin.
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Analyses" value={String(stats.total)} />
            <Stat label="Avg risk" value={String(stats.averageRisk)} />
            <Stat
              label="Trend"
              value={
                stats.trend === "insufficient"
                  ? "—"
                  : `${stats.trendDelta > 0 ? "+" : ""}${stats.trendDelta}`
              }
              hint={stats.trend}
            />
          </div>

          <Sparkline series={stats.series} />

          {stats.topCategories.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                Recurring categories
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {stats.topCategories.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[0.7rem] text-muted-foreground"
                  >
                    {c.name}
                    <span className="font-mono text-foreground/70">
                      ×{c.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-1.5">
            {records.slice(0, 6).map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/20 px-3 py-2"
              >
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-md font-mono text-[0.7rem] font-semibold tabular-nums"
                  style={{ color: bandColor(r.band) }}
                >
                  {Math.round(r.riskScore)}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                  {r.sourceLabel}
                </span>
                <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground/70">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-3 text-center">
      <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {hint && (
        <p className="text-[0.6rem] capitalize text-muted-foreground/70">
          {hint}
        </p>
      )}
    </div>
  );
}

function Sparkline({
  series,
}: {
  series: { createdAt: string; riskScore: number }[];
}) {
  if (series.length < 2) return null;
  const w = 280;
  const h = 48;
  const max = 100;
  const step = w / (series.length - 1);
  const points = series
    .map((s, i) => `${i * step},${h - (s.riskScore / max) * h}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-12 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--violet)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
