"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import benchmarkData1 from "../Data Benchmark/benchmark_final 5local db.json";
import benchmarkDataPinecone from "../Data Benchmark/benchmark_final PN.json";

// Merge the local-DB benchmark with the Pinecone benchmark so all databases are
// compared together. Both runs share identical config (models, queries, corpus,
// top-k levels), so they combine cleanly into one dataset.
const benchmarkDatasets = [
  mergeBenchmarkDatasets(
    benchmarkData1 as unknown as BenchmarkDataShape,
    benchmarkDataPinecone as unknown as BenchmarkDataShape,
  ),
];
const benchmarkSourceFallbacks = [
  "benchmark_final 5local db.json",
  "benchmark_final PN.json",
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Timer,
  Database,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  LayoutDashboard,
  CheckCircle,
  Clock,
  Gauge,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// Type definitions
interface SpeedTestRawResult {
  repetition?: number;
  query_num: number;
  global_query_num?: number;
  query: string;
  database: string;
  retrieval_time: number;
  llm_time: number;
  total_time: number;
  num_docs: number;
  success: boolean;
}

interface SpeedTestSummary {
  database: string;
  mean_total_ms: number;
  median_total_ms: number;
  std_total_ms: number;
  min_total_ms: number;
  max_total_ms: number;
  p95_total_ms?: number;
  mean_retrieval_ms: number;
  p95_retrieval_ms?: number;
  mean_llm_ms: number;
}

interface RepetitionSummaryItem {
  repetition: number;
  mean_retrieval_ms: number;
  mean_total_ms: number;
  p95_retrieval_ms?: number;
  p95_total_ms?: number;
}

interface QueryTypeSummaryItem {
  queries_tested: number;
  mean_retrieval_ms: number;
  mean_total_ms: number;
}

interface FailureSummaryItem {
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  success_rate: number;
}

interface ScalabilityResult {
  top_k: number;
  avg_time: number;
  std_time: number;
  min_time: number;
  max_time: number;
}

interface RawScalabilityResult {
  top_k: number;
  avg_time?: number;
  std_time?: number;
  min_time?: number;
  max_time?: number;
  mean_avg_time?: number;
  std_avg_time?: number;
  min_avg_time?: number;
  max_avg_time?: number;
}

interface CorpusScalabilityResult {
  doc_count: number;
  mean_avg_time: number;
}

interface QualityPerQuery {
  query: string;
  precision: number;
  recall?: number;
  hit_at_k?: number;
  f1_score: number;
  relevant_retrieved?: number;
  total_retrieved?: number;
}

interface QualityMetrics {
  avg_precision: number;
  avg_recall?: number;
  avg_hit_at_k?: number;
  avg_f1_score: number;
  per_query: QualityPerQuery[];
}

interface BenchmarkMetadata {
  benchmark_date?: string;
  benchmark_started_at?: string;
  benchmark_completed_at?: string;
  run_id?: string;
  status?: string;
  duration_seconds?: number;
  llm_model: string;
  embedding_model: string;
  num_queries: number;
  repetitions?: number;
  top_k: number;
  databases_tested: string[];
  aggregation?: string;
  runs_aggregated?: number;
  source_files?: string[];
  score_threshold?: number;
  scalability_doc_counts?: number[];
  scalability_query_count?: number;
}

interface BenchmarkDataShape {
  metadata: BenchmarkMetadata;
  document_manifest?: unknown[];
  speed_test: {
    winner: {
      database: string;
      avg_retrieval_ms: number;
      speed_improvement_percent: number;
    };
    summary: SpeedTestSummary[];
    raw_results: SpeedTestRawResult[];
    failure_summary?: Record<string, FailureSummaryItem>;
    per_repetition_summary?: Record<string, RepetitionSummaryItem[]>;
    query_type_summary?: Record<string, {
      answerable?: QueryTypeSummaryItem;
      no_answer?: QueryTypeSummaryItem;
    }>;
  };
  scalability_test?: Record<string, RawScalabilityResult[]>;
  top_k_sensitivity_test?: Record<string, RawScalabilityResult[]>;
  corpus_size_scalability_test?: Record<string, CorpusScalabilityResult[]>;
  retrieval_quality?: Record<string, QualityMetrics>;
  answerable_retrieval_quality?: Record<string, QualityMetrics>;
  deepeval_answer_quality?: Record<string, DeepEvalQualityMetrics>;
  concurrent_user_scalability_test?: Record<string, ConcurrentUserScalabilityItem[]>;
}

interface DeepEvalPerQuery {
  query: string;
  AnswerRelevancy_score?: number;
  Faithfulness_score?: number;
  ContextualRelevancy_score?: number;
  ContextualPrecision_score?: number;
  ContextualRecall_score?: number;
}

interface DeepEvalQualityMetrics {
  avg_answer_relevancy?: number;
  avg_faithfulness?: number;
  avg_contextual_relevancy?: number;
  avg_contextual_precision?: number;
  avg_contextual_recall?: number;
  per_query?: DeepEvalPerQuery[];
}

interface ConcurrentUserScalabilityItem {
  concurrent_users: number;
  runs: number;
  mean_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  throughput_rps: number;
  error_rate: number;
  avg_cpu_percent?: number;
  max_cpu_percent?: number;
  avg_ram_used_mb?: number;
  max_ram_used_mb?: number;
  avg_gpu_util_percent?: number | null;
  max_gpu_util_percent?: number | null;
  avg_gpu_memory_used_mb?: number;
  max_gpu_memory_used_mb?: number;
}

// Shallow-merge per-database record sections (keyed by database name). Returns
// undefined only when none of the sources define the section, so the component's
// existing fallbacks (e.g. quality -> deepeval) keep working.
function mergeRecord<T>(
  ...sources: Array<Record<string, T> | undefined>
): Record<string, T> | undefined {
  const present = sources.filter(
    (source): source is Record<string, T> => source != null
  );
  if (present.length === 0) return undefined;
  return Object.assign({}, ...present);
}

// Recompute the speed winner across the combined summary: fastest = lowest mean
// retrieval, and "speed_improvement_percent" = how much faster the winner is than
// the slowest database (matches the formula used in the source data).
function recomputeSpeedWinner(
  summary: SpeedTestSummary[]
): BenchmarkDataShape["speed_test"]["winner"] {
  const valid = summary.filter((row) => Number.isFinite(row.mean_retrieval_ms));
  if (valid.length === 0) {
    return { database: "", avg_retrieval_ms: 0, speed_improvement_percent: 0 };
  }
  const fastest = valid.reduce((best, curr) =>
    curr.mean_retrieval_ms < best.mean_retrieval_ms ? curr : best
  );
  const slowest = valid.reduce((worst, curr) =>
    curr.mean_retrieval_ms > worst.mean_retrieval_ms ? curr : worst
  );
  const improvement =
    slowest.mean_retrieval_ms > 0
      ? ((slowest.mean_retrieval_ms - fastest.mean_retrieval_ms) / slowest.mean_retrieval_ms) * 100
      : 0;
  return {
    database: fastest.database,
    avg_retrieval_ms: Number(fastest.mean_retrieval_ms.toFixed(2)),
    speed_improvement_percent: Number(improvement.toFixed(1)),
  };
}

// Combine multiple benchmark runs (same config, different databases) into a single
// dataset: concatenate the speed summary/raw rows, merge every per-database section,
// union the databases list, and recompute the overall speed winner.
function mergeBenchmarkDatasets(
  base: BenchmarkDataShape,
  ...additions: BenchmarkDataShape[]
): BenchmarkDataShape {
  return additions.reduce((acc, addition) => {
    const mergedSummary = [...acc.speed_test.summary, ...addition.speed_test.summary];
    return {
      ...acc,
      metadata: {
        ...acc.metadata,
        databases_tested: [
          ...acc.metadata.databases_tested,
          ...addition.metadata.databases_tested,
        ],
        source_files: [
          ...(acc.metadata.source_files ?? []),
          ...(addition.metadata.source_files ?? []),
        ],
      },
      speed_test: {
        ...acc.speed_test,
        summary: mergedSummary,
        raw_results: [...acc.speed_test.raw_results, ...addition.speed_test.raw_results],
        failure_summary: mergeRecord(
          acc.speed_test.failure_summary,
          addition.speed_test.failure_summary
        ),
        per_repetition_summary: mergeRecord(
          acc.speed_test.per_repetition_summary,
          addition.speed_test.per_repetition_summary
        ),
        query_type_summary: mergeRecord(
          acc.speed_test.query_type_summary,
          addition.speed_test.query_type_summary
        ),
        winner: recomputeSpeedWinner(mergedSummary),
      },
      scalability_test: mergeRecord(acc.scalability_test, addition.scalability_test),
      top_k_sensitivity_test: mergeRecord(
        acc.top_k_sensitivity_test,
        addition.top_k_sensitivity_test
      ),
      corpus_size_scalability_test: mergeRecord(
        acc.corpus_size_scalability_test,
        addition.corpus_size_scalability_test
      ),
      concurrent_user_scalability_test: mergeRecord(
        acc.concurrent_user_scalability_test,
        addition.concurrent_user_scalability_test
      ),
      retrieval_quality: mergeRecord(acc.retrieval_quality, addition.retrieval_quality),
      answerable_retrieval_quality: mergeRecord(
        acc.answerable_retrieval_quality,
        addition.answerable_retrieval_quality
      ),
      deepeval_answer_quality: mergeRecord(
        acc.deepeval_answer_quality,
        addition.deepeval_answer_quality
      ),
    };
  }, base);
}

function getQualityData(benchmarkData: {
  retrieval_quality?: Record<string, QualityMetrics>;
  answerable_retrieval_quality?: Record<string, QualityMetrics>;
  deepeval_answer_quality?: Record<string, DeepEvalQualityMetrics>;
}) {
  const retrievalQuality = benchmarkData.answerable_retrieval_quality ?? benchmarkData.retrieval_quality;
  if (retrievalQuality) return retrievalQuality as Record<string, QualityMetrics>;

  return Object.fromEntries(
    Object.entries(benchmarkData.deepeval_answer_quality ?? {}).map(([database, metrics]) => [
      database,
      {
        avg_precision: metrics.avg_contextual_precision ?? 0,
        avg_hit_at_k: metrics.avg_contextual_recall ?? 0,
        avg_f1_score: metrics.avg_faithfulness ?? 0,
        per_query: (metrics.per_query ?? []).map((item) => ({
          query: item.query,
          precision: item.ContextualPrecision_score ?? 0,
          hit_at_k: item.ContextualRecall_score ?? 0,
          f1_score: item.Faithfulness_score ?? 0,
          relevant_retrieved: undefined,
          total_retrieved: undefined,
        })),
      },
    ])
  ) as Record<string, QualityMetrics>;
}

function getQualityCoverageLabel(benchmarkData: {
  answerable_retrieval_quality?: Record<string, QualityMetrics>;
  deepeval_answer_quality?: Record<string, DeepEvalQualityMetrics>;
}) {
  if (benchmarkData.deepeval_answer_quality && !benchmarkData.answerable_retrieval_quality) return "Context Recall";
  return benchmarkData.answerable_retrieval_quality ? "Hit@K" : "Recall";
}

function getQualityScopeLabel(benchmarkData: {
  answerable_retrieval_quality?: Record<string, QualityMetrics>;
  deepeval_answer_quality?: Record<string, DeepEvalQualityMetrics>;
}) {
  if (benchmarkData.deepeval_answer_quality && !benchmarkData.answerable_retrieval_quality) return "DeepEval sampled answer quality";
  return benchmarkData.answerable_retrieval_quality ? "answerable queries only" : "all queries";
}

function getQualityCoverageValue(metrics?: QualityMetrics) {
  return metrics?.avg_hit_at_k ?? metrics?.avg_recall ?? 0;
}

function getPerQueryCoverageValue(result: QualityPerQuery) {
  return result.hit_at_k ?? result.recall ?? 0;
}

function getScalabilityData(benchmarkData: BenchmarkDataShape) {
  const rawData = (benchmarkData.scalability_test ?? benchmarkData.top_k_sensitivity_test ?? {}) as Record<string, RawScalabilityResult[]>;

  return Object.fromEntries(
    Object.entries(rawData).map(([database, rows]) => [
      database,
      rows.map((row) => ({
        top_k: row.top_k,
        avg_time: row.avg_time ?? row.mean_avg_time ?? 0,
        std_time: row.std_time ?? row.std_avg_time ?? 0,
        min_time: row.min_time ?? row.min_avg_time ?? 0,
        max_time: row.max_time ?? row.max_avg_time ?? 0,
      })),
    ])
  ) as Record<string, ScalabilityResult[]>;
}

const GPU_USAGE_NOTE = "GPU utilization was measured host-side using nvidia-smi sampling. For short retrieval-only tests, GPU utilization may appear as 0% if brief embedding bursts occur between sampling intervals. Therefore, GPU utilization is interpreted as approximate, but it is still included in the dashboard efficiency score together with concurrent latency, CPU usage, RAM usage, and VRAM usage.";

type TabType = "summary" | "speed" | "scalability" | "quality" | "info";

const tabOptions: TabType[] = ["summary", "speed", "scalability", "quality", "info"];

interface MetadataBadgeProps {
  label: string;
  children: React.ReactNode;
}

function MetadataBadge({ label, children }: MetadataBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="rounded-sm border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted sm:text-xs"
        >
          {children}
        </Badge>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}


// Sub-components moved outside to avoid re-creation on render
const FormatMs = ({ ms }: { ms: number }) => (
  <span className="font-mono tabular-nums">{ms.toFixed(2)}ms</span>
);

const FormatPercent = ({ value }: { value: number }) => (
  <span className="font-mono tabular-nums">
    {(value * 100).toFixed(1)}%
  </span>
);

// Animated Counter Component
const AnimatedCounter = ({
  value,
  suffix = "",
  decimals = 0,
  duration = 1000
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation, value will be set via useMemo below
      return;
    }
    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) startTimeRef.current = currentTime;
      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * easeOutQuart);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, prefersReducedMotion]);

  const finalValue = prefersReducedMotion ? value : displayValue;

  return (
    <span className="font-mono tabular-nums">
      {finalValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// Animated Progress Bar Component
const AnimatedProgressBar = ({
  value,
  className,
  duration = 800
}: {
  value: number;
  className: string;
  duration?: number;
}) => {
  const [width, setWidth] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation, value will be computed directly
      return;
    }
    // Small delay to ensure the bar starts from 0
    const timeout = setTimeout(() => {
      setWidth(value);
    }, 50);
    return () => clearTimeout(timeout);
  }, [value, prefersReducedMotion]);

  const finalWidth = prefersReducedMotion ? value : width;

  return (
    <div
      className={cn("h-full rounded-full transition-[width] ease-out motion-reduce:transition-none", className)}
      style={{ 
        width: `${finalWidth * 100}%`,
        transitionDuration: `${duration}ms`
      }}
    />
  );
};

const SortIcon = ({
  active,
  direction,
}: {
  active: boolean;
  direction?: "asc" | "desc";
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "shrink-0 flex items-center justify-center",
      active ? "w-4 h-4" : "w-0 h-0 overflow-hidden"
    )}
  >
    {active &&
      (direction === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      ))}
  </span>
);

// Database Icon Component with brand colors
const DatabaseIcon = ({ database, className = "w-5 h-5" }: { database: string; className?: string }) => {
  switch (database) {
    case "Pinecone":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L8 6v4l4-4 4 4V6l-4-4z" fill="hsl(45, 93%, 47%)" />
          <path d="M12 8L8 12v4l4-4 4 4v-4l-4-4z" fill="hsl(45, 93%, 57%)" />
          <path d="M12 14l-4 4v4l4-4 4 4v-4l-4-4z" fill="hsl(45, 93%, 67%)" />
        </svg>
      );
    case "PostgreSQL":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="8" rx="8" ry="4" fill="hsl(210, 100%, 50%)" />
          <path d="M4 8v8c0 2.2 3.6 4 8 4s8-1.8 8-4V8" stroke="hsl(210, 100%, 40%)" strokeWidth="2" fill="none" />
          <path d="M4 12c0 2.2 3.6 4 8 4s8-1.8 8-4" stroke="hsl(210, 100%, 40%)" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "ChromaDB":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="url(#chromaGradient)" />
          <defs>
            <linearGradient id="chromaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
              <stop offset="50%" stopColor="hsl(180, 70%, 50%)" />
              <stop offset="100%" stopColor="hsl(142, 71%, 55%)" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "SQLite":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16z" fill="hsl(265, 89%, 70%)" />
          <path d="M15.5 7.5c-3.8 1.6-6.6 4.4-8 8.2" stroke="hsl(265, 60%, 97%)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "LanceDB":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l9 10-9 10-9-10z" fill="hsl(24, 95%, 53%)" />
          <path d="M12 2l9 10-9 10z" fill="hsl(24, 95%, 45%)" />
          <path d="M12 7l4.5 5-4.5 5-4.5-5z" fill="hsl(24, 95%, 64%)" />
        </svg>
      );
    case "Qdrant":
      return (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="7.3" stroke="hsl(187, 92%, 42%)" strokeWidth="2.4" />
          <path d="M15.6 15.6l4.9 4.9" stroke="hsl(187, 92%, 42%)" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="10.5" cy="10.5" r="2.4" fill="hsl(187, 92%, 50%)" />
        </svg>
      );
    default:
      return <Database aria-hidden="true" className={className} />;
  }
};

const databasePalette = [
  { stroke: "hsl(210, 100%, 50%)", text: "text-blue-500", bar: "bg-blue-500" },
  { stroke: "hsl(142, 71%, 45%)", text: "text-emerald-500", bar: "bg-emerald-500" },
  { stroke: "hsl(265, 89%, 70%)", text: "text-violet-500", bar: "bg-violet-500" },
  { stroke: "hsl(24, 95%, 53%)", text: "text-orange-500", bar: "bg-orange-500" },
  { stroke: "hsl(187, 92%, 42%)", text: "text-cyan-500", bar: "bg-cyan-500" },
  { stroke: "hsl(45, 93%, 47%)", text: "text-amber-500", bar: "bg-amber-500" },
];

function getBenchmarkDate(metadata: BenchmarkMetadata) {
  return metadata.benchmark_date ?? metadata.benchmark_started_at ?? metadata.benchmark_completed_at ?? "";
}

function getDatabasePalette(database: string, databases: string[]) {
  const knownIndex = ["PostgreSQL", "ChromaDB", "SQLite", "LanceDB", "Qdrant", "Pinecone"].indexOf(database);
  const index = knownIndex >= 0 ? knownIndex : Math.max(databases.indexOf(database), 0);
  return databasePalette[index % databasePalette.length];
}

// Table cell that turns green when it holds the best value in its column
const bestCellClass = (isBest: boolean) =>
  cn(
    "p-1.5 text-right font-mono tabular-nums",
    isBest && "font-semibold text-green-600 dark:text-green-400"
  );

// Best value of a column, or null when tied across rows (ties get no highlight)
function uniqueBest(values: Array<number | null | undefined>, mode: "min" | "max" = "min") {
  const nums = values.filter((v): v is number => v !== null && v !== undefined && Number.isFinite(v));
  if (nums.length === 0) return null;
  const best = mode === "min" ? Math.min(...nums) : Math.max(...nums);
  return nums.filter((v) => v === best).length === 1 ? best : null;
}

function buildChartConfig(databases: string[]) {
  return Object.fromEntries(
    databases.map((database) => [
      database,
      {
        label: database,
        color: getDatabasePalette(database, databases).stroke,
      },
    ])
  ) satisfies ChartConfig;
}

interface TabButtonProps {
  tab: TabType;
  label: string;
  icon: React.ElementType;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  variant?: "sidebar" | "bottom";
}

// Header tab button (desktop) - minimal icon-only
const HeaderTabButton = ({
  tab,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
}: TabButtonProps) => (
  <button
    type="button"
    onClick={() => setActiveTab(tab)}
    title={label}
    aria-label={label}
    aria-selected={activeTab === tab}
    role="tab"
    className={cn(
      "relative flex h-8 w-8 items-center justify-center transition-colors duration-150 motion-reduce:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40",
      activeTab === tab
        ? "text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
  >
    <Icon aria-hidden="true" className="w-4 h-4" />
  </button>
);

// Bottom nav tab button (mobile) - icon with label
const BottomNavTabButton = ({
  tab,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
}: TabButtonProps) => (
  <button
    type="button"
    onClick={() => setActiveTab(tab)}
    aria-label={label}
    aria-selected={activeTab === tab}
    role="tab"
    className={cn(
      "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 min-w-[3.5rem] transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
      activeTab === tab
        ? "text-primary"
        : "text-muted-foreground active:text-foreground"
    )}
  >
    <Icon aria-hidden="true" className="w-5 h-5" />
    <span className="text-[10px] font-medium leading-none">{label.split(" ")[0]}</span>
  </button>
);

export function BenchmarkDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const tabParam = searchParams.get("tab");
  const activeTab: TabType =
    tabParam && tabOptions.includes(tabParam as TabType)
      ? (tabParam as TabType)
      : "summary";

  const searchTerm = searchParams.get("q") ?? "";

  const benchmarkData = benchmarkDatasets[0] as BenchmarkDataShape;
  const metadata = benchmarkData.metadata as BenchmarkMetadata;
  const documentCount = benchmarkData.document_manifest?.length ?? metadata.num_queries;
  const speed_test = benchmarkData.speed_test;
  const scalabilityData = getScalabilityData(benchmarkData);
  const qualityData = getQualityData(benchmarkData);
  const qualityCoverageLabel = getQualityCoverageLabel(benchmarkData);
  const qualityScopeLabel = getQualityScopeLabel(benchmarkData);
  const activeDatasetTitle = metadata.embedding_model;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [qualitySortConfig, setQualitySortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [scalabilitySortConfig, setScalabilitySortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  // Cap the speed-test table's initial render — the merged dataset has ~3k rows,
  // and mounting them all on tab switch is what made the Speed tab janky to open.
  const [speedRowLimit, setSpeedRowLimit] = useState(150);

  // Speed test data
  const speedSummary = speed_test.summary as SpeedTestSummary[];
  const speedRawResults = speed_test.raw_results as SpeedTestRawResult[];
  const validSpeedRawResults = useMemo(
    () => speedRawResults.filter((row) => Number.isFinite(row.retrieval_time) && row.retrieval_time >= 0),
    [speedRawResults]
  );
  const speedWinner = speed_test.winner;
  const speedSuccessCount = useMemo(
    () => speedRawResults.filter((row) => row.success).length,
    [speedRawResults]
  );
  const speedSuccessRate = useMemo(
    () => (speedRawResults.length > 0 ? (speedSuccessCount / speedRawResults.length) * 100 : 0),
    [speedRawResults.length, speedSuccessCount]
  );
  const runsAggregated = metadata.runs_aggregated ?? metadata.repetitions ?? 1;
  const aggregationLabel = metadata.aggregation ?? (runsAggregated > 1 ? "multi-run benchmark" : "single run");
  const sourceFiles =
    metadata.source_files && metadata.source_files.length > 0
      ? metadata.source_files
      : benchmarkSourceFallbacks;
  const perRepetitionSummary = speed_test.per_repetition_summary ?? {};
  const queryTypeSummary = speed_test.query_type_summary ?? {};
  const deepevalQuality = benchmarkData.deepeval_answer_quality ?? {};
  const concurrentUserScalability = useMemo(
    () => benchmarkData.concurrent_user_scalability_test ?? {},
    [benchmarkData.concurrent_user_scalability_test]
  );

  // Scalability test data
  // Databases list - declared early as it's used in useMemo hooks below
  const databases = metadata.databases_tested;

  const dbParam = searchParams.get("db");
  const filterDb =
    dbParam && (dbParam === "all" || databases.includes(dbParam))
      ? dbParam
      : "all";

  const qualityDbParam = searchParams.get("qualityDb");
  const selectedQualityDb =
    qualityDbParam && databases.includes(qualityDbParam)
      ? qualityDbParam
      : databases[0] ?? "";

  const updateUrl = (updater: (params: URLSearchParams) => void) => {
    const currentQuery = searchParams.toString();
    const params = new URLSearchParams(searchParams);
    updater(params);
    const nextQuery = params.toString();
    if (nextQuery === currentQuery) {
      return;
    }
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const setActiveTab = (tab: TabType) => {
    updateUrl((params) => {
      if (tab === "summary") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
    });
  };

  const setFilterDb = (value: string) => {
    updateUrl((params) => {
      if (value === "all") {
        params.delete("db");
      } else {
        params.set("db", value);
      }
    });
  };

  const setSelectedQualityDb = (value: string) => {
    updateUrl((params) => {
      if (!value || value === databases[0]) {
        params.delete("qualityDb");
      } else {
        params.set("qualityDb", value);
      }
    });
  };

  const setSearchTerm = (value: string) => {
    updateUrl((params) => {
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
    });
  };

  // Calculate scalability winner (lowest average time across all top_k values)
  const scalabilityWinner = useMemo(() => {
    let winner = { database: "", avgTime: Infinity };
    databases.forEach((db) => {
      const dbData = scalabilityData[db];
      if (dbData && dbData.length > 0) {
        const avgTime = dbData.reduce((sum, item) => sum + item.avg_time, 0) / dbData.length;
        if (avgTime < winner.avgTime) {
          winner = { database: db, avgTime };
        }
      }
    });
    return winner;
  }, [scalabilityData, databases]);

  const topKScaleSummary = useMemo(() => {
    const maxTopK = Math.max(
      ...Object.values(scalabilityData).flatMap((rows) => rows.map((row) => row.top_k))
    );
    if (!Number.isFinite(maxTopK)) return null;

    const times: Array<{ db: string; topK: number; time: number }> = databases
      .map((db) => ({
        db,
        topK: maxTopK,
        time: scalabilityData[db]?.find((row) => row.top_k === maxTopK)?.avg_time,
      }))
      .filter((item): item is { db: string; topK: number; time: number } => Number.isFinite(item.time));
    if (times.length === 0) return null;

    return times.reduce((min, curr) => curr.time < min.time ? curr : min);
  }, [databases, scalabilityData]);

  const concurrentSummary = (() => {
    const rows = Object.entries(concurrentUserScalability).flatMap(([database, entries]) =>
      (entries ?? []).map((entry) => ({ database, ...entry }))
    );
    if (rows.length === 0) return null;

    const maxUsers = Math.max(...rows.map((row) => row.concurrent_users));
    const maxUserRows = rows.filter((row) => row.concurrent_users === maxUsers);
    const best = maxUserRows.reduce((min, curr) => curr.mean_latency_ms < min.mean_latency_ms ? curr : min);

    return {
      database: best.database,
      concurrentUsers: maxUsers,
      meanLatencyMs: best.mean_latency_ms,
    };
  })();

  const maxTopKByDatabase = useMemo(() => {
    return Object.fromEntries(
      databases.map((db) => {
        const rows = scalabilityData[db] ?? [];
        const maxTopK = Math.max(...rows.map((row) => row.top_k));
        const row = Number.isFinite(maxTopK) ? rows.find((item) => item.top_k === maxTopK) : undefined;
        return [db, row ? { topK: row.top_k, avgTime: row.avg_time } : null];
      })
    ) as Record<string, { topK: number; avgTime: number } | null>;
  }, [databases, scalabilityData]);

  const maxCorpusByDatabase = useMemo(() => {
    const corpusData = benchmarkData.corpus_size_scalability_test ?? {};
    return Object.fromEntries(
      databases.map((db) => {
        const rows = corpusData[db] ?? [];
        const maxDocCount = Math.max(...rows.map((row) => row.doc_count));
        const row = Number.isFinite(maxDocCount) ? rows.find((item) => item.doc_count === maxDocCount) : undefined;
        return [db, row ? { docCount: row.doc_count, avgTime: row.mean_avg_time } : null];
      })
    ) as Record<string, { docCount: number; avgTime: number } | null>;
  }, [benchmarkData.corpus_size_scalability_test, databases]);

  const maxConcurrentByDatabase = useMemo(() => {
    return Object.fromEntries(
      databases.map((db) => {
        const rows = concurrentUserScalability[db] ?? [];
        const maxUsers = Math.max(...rows.map((row) => row.concurrent_users));
        const row = Number.isFinite(maxUsers) ? rows.find((item) => item.concurrent_users === maxUsers) : undefined;
        return [db, row ?? null];
      })
    ) as Record<string, ConcurrentUserScalabilityItem | null>;
  }, [concurrentUserScalability, databases]);

  const dbCompareWinners = useMemo(() => {
    const minBy = <T,>(entries: Array<[string, T | null]>, getValue: (value: T) => number | undefined) => {
      const validEntries = entries.filter((entry): entry is [string, T] => entry[1] !== null && Number.isFinite(getValue(entry[1])));
      if (validEntries.length === 0) return null;
      return validEntries.reduce((best, curr) => (getValue(curr[1]) ?? Infinity) < (getValue(best[1]) ?? Infinity) ? curr : best)[0];
    };

    return {
      retrieval: speedWinner.database,
      total: minBy(speedSummary.map((row) => [row.database, row] as [string, typeof row]), (row) => row.mean_total_ms),
      topK: minBy(Object.entries(maxTopKByDatabase), (row) => row.avgTime),
      corpus: minBy(Object.entries(maxCorpusByDatabase), (row) => row.avgTime),
      concurrent: minBy(Object.entries(maxConcurrentByDatabase), (row) => row.mean_latency_ms),
    };
  }, [maxConcurrentByDatabase, maxCorpusByDatabase, maxTopKByDatabase, speedSummary, speedWinner.database]);

  const resourceEfficiencyScores = useMemo(() => {
    const rows = Object.entries(maxConcurrentByDatabase)
      .filter((entry): entry is [string, ConcurrentUserScalabilityItem] => entry[1] !== null)
      .map(([database, row]) => ({ database, row }));

    const scoreFor = (value: number | null | undefined, values: number[]) => {
      if (!Number.isFinite(value) || values.length === 0) return null;
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (max === min) return 100;
      return ((max - Number(value)) / (max - min)) * 100;
    };

    const latencyValues = rows.map(({ row }) => row.mean_latency_ms).filter((value): value is number => Number.isFinite(value));
    const cpuValues = rows.map(({ row }) => row.avg_cpu_percent).filter((value): value is number => Number.isFinite(value));
    const ramValues = rows.map(({ row }) => row.avg_ram_used_mb).filter((value): value is number => Number.isFinite(value));
    const gpuValues = rows.map(({ row }) => row.avg_gpu_util_percent).filter((value): value is number => Number.isFinite(value));
    const vramValues = rows.map(({ row }) => row.avg_gpu_memory_used_mb).filter((value): value is number => Number.isFinite(value));

    return Object.fromEntries(
      rows.map(({ database, row }) => {
        const weightedScores = [
          { score: scoreFor(row.mean_latency_ms, latencyValues), weight: 0.4 },
          { score: scoreFor(row.avg_cpu_percent, cpuValues), weight: 0.2 },
          { score: scoreFor(row.avg_ram_used_mb, ramValues), weight: 0.15 },
          { score: scoreFor(row.avg_gpu_util_percent, gpuValues), weight: 0.15 },
          { score: scoreFor(row.avg_gpu_memory_used_mb, vramValues), weight: 0.1 },
        ].filter((item): item is { score: number; weight: number } => item.score !== null);

        const weightTotal = weightedScores.reduce((sum, item) => sum + item.weight, 0);

        return [
          database,
          weightTotal > 0 ? weightedScores.reduce((sum, item) => sum + item.score * item.weight, 0) / weightTotal : null,
        ];
      })
    ) as Record<string, number | null>;
  }, [maxConcurrentByDatabase]);

  const mostEfficientDatabase = useMemo(() => {
    const entries = Object.entries(resourceEfficiencyScores).filter((entry): entry is [string, number] => entry[1] !== null);
    if (entries.length === 0) return null;
    return entries.reduce((best, curr) => curr[1] > best[1] ? curr : best)[0];
  }, [resourceEfficiencyScores]);

  // Filter and Sort for Speed Test
  const filteredSpeedResults = useMemo(() => {
    return speedRawResults.filter((result) => {
      const matchesSearch = result.query
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDb = filterDb === "all" || result.database === filterDb;
      return matchesSearch && matchesDb;
    });
  }, [searchTerm, filterDb, speedRawResults]);

  const sortedSpeedResults = useMemo(() => {
    if (!sortConfig) return filteredSpeedResults;
    return [...filteredSpeedResults].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof SpeedTestRawResult];
      const bValue = b[sortConfig.key as keyof SpeedTestRawResult];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [filteredSpeedResults, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const requestQualitySort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      qualitySortConfig &&
      qualitySortConfig.key === key &&
      qualitySortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setQualitySortConfig({ key, direction });
  };

  const requestScalabilitySort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      scalabilitySortConfig &&
      scalabilitySortConfig.key === key &&
      scalabilitySortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setScalabilitySortConfig({ key, direction });
  };

  // aria-sort value for a sortable column header (announces sort state to screen readers)
  const ariaSortFor = (
    config: { key: string; direction: "asc" | "desc" } | null,
    key: string
  ): "ascending" | "descending" | "none" =>
    config?.key === key ? (config.direction === "asc" ? "ascending" : "descending") : "none";

  // Sorted quality per-query data
  const sortedQualityResults = useMemo(() => {
    const data = qualityData[selectedQualityDb]?.per_query || [];
    if (!qualitySortConfig) return data;
    return [...data].sort((a, b) => {
      const aValue = a[qualitySortConfig.key as keyof QualityPerQuery];
      const bValue = b[qualitySortConfig.key as keyof QualityPerQuery];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return qualitySortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return qualitySortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [qualityData, selectedQualityDb, qualitySortConfig]);

  // Sorted scalability data - always return combined format for consistency
  const sortedScalabilityData = useMemo(() => {
    const baseData = scalabilityData[databases[0]] || [];

    // Always create combined data format with database values as properties
    // Include upper/lower bounds for confidence intervals (±1 std)
    const combinedData = baseData.map((item, idx) => ({
      top_k: item.top_k,
      ...databases.reduce((acc, db) => {
        const dbData = scalabilityData[db]?.[idx];
        acc[db] = dbData?.avg_time ?? 0;
        return acc;
      }, {} as Record<string, number>),
    }));

    if (!scalabilitySortConfig) return combinedData;

    return [...combinedData].sort((a, b) => {
      const aValue = a[scalabilitySortConfig.key as keyof typeof a];
      const bValue = b[scalabilitySortConfig.key as keyof typeof b];

      return scalabilitySortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [scalabilityData, databases, scalabilitySortConfig]);


  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const idx = tabOptions.indexOf(activeTab);
      setActiveTab(tabOptions[(idx + 1) % tabOptions.length]);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const idx = tabOptions.indexOf(activeTab);
      setActiveTab(tabOptions[(idx - 1 + tabOptions.length) % tabOptions.length]);
    }
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-secondary rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:h-screen bg-background text-foreground font-sans sm:overflow-hidden text-render-optimize flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-full sm:h-full overflow-hidden">
        {/* Header - title, centered navigation, metadata */}
        <header className="shrink-0 px-3 sm:px-4 md:px-6 py-2 sm:py-2 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight leading-tight">
              Vector Database Benchmark
            </h1>
            {/* Desktop tab navigation */}
            <nav
              role="tablist"
              aria-label="Main navigation"
              onKeyDown={handleTabKeyDown}
              className="relative hidden sm:flex items-center rounded-md border border-border overflow-hidden"
            >
              {/* Sliding indicator behind the active tab */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-8 bg-primary transition-transform duration-200 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${tabOptions.indexOf(activeTab) * 2}rem)` }}
              />
              <HeaderTabButton
                tab="summary"
                label="Summary"
                icon={LayoutDashboard}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <HeaderTabButton
                tab="speed"
                label="Speed Test"
                icon={Zap}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <HeaderTabButton
                tab="scalability"
                label="Scalability"
                icon={TrendingUp}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <HeaderTabButton
                tab="quality"
                label="Retrieval Quality"
                icon={Target}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <HeaderTabButton
                tab="info"
                label="More Info"
                icon={Info}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </nav>
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <TooltipProvider>
                <div className="flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5">
                  <MetadataBadge label="Benchmark date">
                    {new Intl.DateTimeFormat(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(getBenchmarkDate(metadata)))}
                  </MetadataBadge>
                  <MetadataBadge label="LLM model">
                    {metadata.llm_model}
                  </MetadataBadge>
                  <MetadataBadge label="Embedding model">
                    {metadata.embedding_model}
                  </MetadataBadge>
                  {metadata.score_threshold !== undefined && (
                    <MetadataBadge label="Similarity score threshold">
                      threshold {metadata.score_threshold}
                    </MetadataBadge>
                  )}
                  <MetadataBadge label="Number of benchmark queries">
                    {metadata.num_queries}Q
                  </MetadataBadge>
                  <MetadataBadge label="Top-k retrieval setting">
                    K={metadata.top_k}
                  </MetadataBadge>
                </div>
              </TooltipProvider>
              <div className="hidden sm:block">
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with padding for mobile bottom nav */}
        <div className="flex-1 sm:min-h-0 relative px-3 sm:px-4 md:px-6 pt-3 sm:pt-2 pb-20 sm:pb-2 overflow-y-auto sm:overflow-hidden">
          <div className="sm:h-full sm:min-h-0 relative">
            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div key="summary-tab" className="sm:h-full sm:min-h-0 flex flex-col gap-3 sm:gap-2 md:gap-1.5 sm:overflow-y-auto no-scrollbar pb-4 sm:pb-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none motion-reduce:duration-0">
          <h2 className="sr-only">Summary</h2>
          {/* Overall Winner */}
            <Card size="sm" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-[0.08] pointer-events-none">
                <Trophy aria-hidden="true" className="w-12 sm:w-16 h-12 sm:h-16 text-primary" />
              </div>
              <CardHeader className="relative z-10 pb-3 px-3 sm:px-2.5">
                <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
                  <Trophy aria-hidden="true" className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                  <span>Overall Winner</span>
                </div>
              <CardTitle className={cn("text-2xl sm:text-3xl md:text-4xl font-bold leading-tight", getDatabasePalette(speedWinner.database, databases).text)}>
                {speedWinner.database}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground leading-snug">
                Best across speed benchmarks with{" "}
                <span className="font-semibold text-primary">
                  {speedWinner.speed_improvement_percent}%
                </span>{" "}
                faster retrieval.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Key Metrics Grid - 2 cols on small mobile, 3 on tablet+ */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-1.5">
            {/* Speed Winner */}
            <Card size="sm">
              <CardHeader className="pb-0.5 sm:pb-1 px-2.5 sm:px-2.5">
                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                  <Zap aria-hidden="true" className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                  <CardTitle className="text-[11px] sm:text-sm font-medium uppercase tracking-wide leading-tight">Fastest</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2.5 sm:px-2.5">
                <p className={cn("text-lg sm:text-2xl font-bold leading-tight", getDatabasePalette(speedWinner.database, databases).text)}>{speedWinner.database}</p>
                <p className="text-[11px] sm:text-sm text-muted-foreground">
                  <AnimatedCounter value={speedWinner.avg_retrieval_ms} decimals={1} suffix="ms" /> avg
                </p>
              </CardContent>
            </Card>

            {/* Fastest Query */}
            <Card size="sm">
              <CardHeader className="pb-0.5 sm:pb-1 px-2.5 sm:px-2.5">
                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                  <ArrowUp aria-hidden="true" className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                  <CardTitle className="text-[11px] sm:text-sm font-medium uppercase tracking-wide leading-tight">Best Query</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2.5 sm:px-2.5">
                {(() => {
                  const fastest = validSpeedRawResults.reduce((min, curr) =>
                    curr.retrieval_time < min.retrieval_time ? curr : min
                  );
                  return (
                    <>
                      <p className="text-lg sm:text-2xl font-bold leading-tight">
                        <AnimatedCounter value={fastest.retrieval_time} decimals={1} suffix="ms" />
                      </p>
                      <p className="text-[11px] sm:text-sm text-muted-foreground truncate" title={fastest.query}>
                        Q{fastest.query_num}: <span className={cn("font-medium", getDatabasePalette(fastest.database, databases).text)}>{fastest.database}</span>
                      </p>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Slowest Query - Hidden on very small screens to save space, shown as 2-col span on sm */}
            <Card size="sm" className="col-span-2 sm:col-span-1">
              <CardHeader className="pb-0.5 sm:pb-1 px-2.5 sm:px-2.5">
                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                  <ArrowDown aria-hidden="true" className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                  <CardTitle className="text-[11px] sm:text-sm font-medium uppercase tracking-wide leading-tight">Slowest Query</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2.5 sm:px-2.5">
                {(() => {
                  const slowest = validSpeedRawResults.reduce((max, curr) =>
                    curr.retrieval_time > max.retrieval_time ? curr : max
                  );
                  return (
                    <>
                      <p className="text-lg sm:text-2xl font-bold leading-tight">
                        <AnimatedCounter value={slowest.retrieval_time} decimals={1} suffix="ms" />
                      </p>
                      <p className="text-[11px] sm:text-sm text-muted-foreground truncate" title={slowest.query}>
                        Q{slowest.query_num}: <span className={cn("font-medium", getDatabasePalette(slowest.database, databases).text)}>{slowest.database}</span>
                      </p>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics - 3 cols on mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-1.5">
            {/* Best Scalability */}
            <Card size="sm">
              <CardHeader className="pb-0.5 sm:pb-1 px-2 sm:px-2.5">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp aria-hidden="true" className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" />
                  <CardTitle className="text-[10px] sm:text-sm font-medium uppercase tracking-wide leading-tight truncate">Scale</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-2.5">
                <p className={cn("text-base sm:text-2xl font-bold leading-tight truncate", topKScaleSummary && getDatabasePalette(topKScaleSummary.db, databases).text)}>
                  {topKScaleSummary?.db ?? "N/A"}
                </p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">
                  {topKScaleSummary ? (
                    <>
                      <AnimatedCounter value={topKScaleSummary.time ?? 0} decimals={1} suffix="ms" /> at k={topKScaleSummary.topK}
                    </>
                  ) : "No data"}
                </p>
              </CardContent>
            </Card>

            {/* Concurrent Users */}
            <Card size="sm">
              <CardHeader className="pb-0.5 sm:pb-1 px-2 sm:px-2.5">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Gauge aria-hidden="true" className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" />
                  <CardTitle className="text-[10px] sm:text-sm font-medium uppercase tracking-wide leading-tight truncate">Concurrent</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-2.5">
                <p className={cn("text-base sm:text-2xl font-bold leading-tight truncate", concurrentSummary && getDatabasePalette(concurrentSummary.database, databases).text)}>{concurrentSummary?.database ?? "N/A"}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">
                  {concurrentSummary ? (
                    <>
                      {concurrentSummary.concurrentUsers} users, <AnimatedCounter value={concurrentSummary.meanLatencyMs} decimals={1} suffix="ms" />
                    </>
                  ) : "No data"}
                </p>
              </CardContent>
            </Card>

            {/* Total Documents */}
            <Card size="sm">
              <CardHeader className="pb-0.5 sm:pb-1 px-2 sm:px-2.5">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Database aria-hidden="true" className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" />
                  <CardTitle className="text-[10px] sm:text-sm font-medium uppercase tracking-wide leading-tight truncate">Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-2.5">
                <p className="text-base sm:text-2xl font-bold leading-tight">
                  <AnimatedCounter value={documentCount} decimals={0} />
                </p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">tested</p>
              </CardContent>
            </Card>
          </div>

          {/* Database Comparison */}
            <Card
              size="sm"
              className="sm:flex-1 sm:min-h-0"
            >
              <CardHeader className="pb-2 pt-2.5 px-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-1.5">
                    <BarChart3 aria-hidden="true" className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">DB Compare</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 px-2.5 sm:px-3 flex flex-col sm:flex-1 sm:min-h-0">
                {/* Mobile: Horizontal scroll for database cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 sm:flex-1 sm:auto-rows-fr">
                {databases.map((db) => {
                      const speed = speedSummary.find(s => s.database === db);
                      const topKScale = maxTopKByDatabase[db];
                      const corpusScale = maxCorpusByDatabase[db];
                      const concurrentScale = maxConcurrentByDatabase[db];
                      const efficiencyScore = resourceEfficiencyScores[db];
                    const textColor = getDatabasePalette(db, databases).text;
                    const metricClassName = (isBest: boolean) => cn("font-mono text-sm sm:text-base whitespace-nowrap shrink-0", isBest ? "font-bold text-green-600 dark:text-green-400" : "font-medium text-muted-foreground");

                    return (
                      <div
                        key={db}
                        className="rounded-lg bg-card p-3 relative overflow-hidden flex flex-col"
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-3">
                          <h3 className={cn("text-sm sm:text-base font-bold flex items-center gap-1.5 min-w-0", textColor)}>
                            <DatabaseIcon database={db} className="w-4 h-4 shrink-0" />
                            <span className="truncate">{db}</span>
                          </h3>
                          {db === speedWinner.database && (
                            <Badge className="flex items-center gap-0.5 text-[10px] h-5 px-1.5 shrink-0">
                              <Trophy aria-hidden="true" className="w-2.5 h-2.5" />
                              Winner
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Avg Retrieval">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <Clock aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Retrieval</span>
                            </span>
                            <span className={metricClassName(dbCompareWinners.retrieval === db)}>{speed?.mean_retrieval_ms.toFixed(1)}ms</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Avg Total = retrieval + LLM time (end-to-end per query)">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <Gauge aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Total</span>
                            </span>
                            <span className={metricClassName(dbCompareWinners.total === db)}>{speed?.mean_total_ms.toFixed(0)}ms</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Top-K scale at maximum tested k">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <TrendingUp aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Top-K</span>
                            </span>
                            <span className={metricClassName(dbCompareWinners.topK === db)} title={topKScale ? `k=${topKScale.topK}` : undefined}>
                              {topKScale ? `${topKScale.avgTime.toFixed(1)}ms` : "-"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Corpus-size scale at maximum tested corpus percentage">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <Database aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Corpus</span>
                            </span>
                            <span className={metricClassName(dbCompareWinners.corpus === db)} title={corpusScale ? `${corpusScale.docCount}% corpus` : undefined}>
                              {corpusScale ? `${corpusScale.avgTime.toFixed(1)}ms` : "-"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Concurrent-user latency at maximum tested users">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <Activity aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Concurrent</span>
                            </span>
                            <span className={metricClassName(dbCompareWinners.concurrent === db)} title={concurrentScale ? `${concurrentScale.concurrent_users} users` : undefined}>
                              {concurrentScale ? `${concurrentScale.mean_latency_ms.toFixed(1)}ms` : "-"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 min-w-0 rounded-md bg-muted px-2.5 py-2 sm:flex-1" title="Weighted normalized efficiency from max-concurrent latency (40%), average CPU (20%), RAM (15%), GPU (15%), and VRAM (10%). Higher is better.">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 min-w-0 truncate">
                              <CheckCircle aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Efficient</span>
                            </span>
                            <span className={metricClassName(mostEfficientDatabase === db)}>
                              {efficiencyScore !== null && efficiencyScore !== undefined ? efficiencyScore.toFixed(1) : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </CardContent>
            </Card>


          </div>
        )
      }

        {/* Speed Test Tab */}
        {
          activeTab === "speed" && (
            <div key="speed-tab" className="sm:h-full sm:overflow-y-auto no-scrollbar space-y-3 sm:space-y-2 pb-6 sm:pb-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none motion-reduce:duration-0">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1.5">
                <Zap aria-hidden="true" className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                Speed Test
              </h2>
            </div>

            {/* Retrieval Time Chart - Now at top */}
            <Card className="pt-0">
              <CardHeader className="flex items-center gap-1.5 space-y-0 py-2 sm:py-2.5 px-2.5 sm:px-3 sm:flex-row">
                <div className="grid flex-1 gap-0.5">
                  <CardTitle className="text-sm sm:text-lg">Retrieval Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-2.5 pt-2 sm:pt-2.5">
                <ChartContainer
                  config={buildChartConfig(databases)}
                  className="aspect-auto h-[200px] sm:h-[280px] md:h-[340px] w-full"
                >
                  <AreaChart
                    data={(() => {
                      const queryMap = new Map<number, Record<string, number | string>>();
                      validSpeedRawResults.forEach((result) => {
                        if (!queryMap.has(result.query_num)) {
                          queryMap.set(result.query_num, { query_num: result.query_num, query: result.query });
                        }
                        const entry = queryMap.get(result.query_num)!;
                        entry[result.database] = result.retrieval_time;
                      });
                      return Array.from(queryMap.values()).sort((a, b) => (a.query_num as number) - (b.query_num as number));
                    })()}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      {databases.map((database) => {
                        const palette = getDatabasePalette(database, databases);
                        return (
                          <linearGradient key={database} id={`fill-${database}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={palette.stroke} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={palette.stroke} stopOpacity={0.1} />
                          </linearGradient>
                        );
                      })}
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="query_num"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={16}
                      tickFormatter={(value) => `Q${value}`}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value.toFixed(0)}ms`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            if (payload && payload.length > 0) {
                              const data = payload[0]?.payload;
                              return (
                                <div className="space-y-1">
                                  <div className="font-semibold">Query {data?.query_num}</div>
                                  <div className="text-xs text-muted-foreground max-w-[200px] truncate">{data?.query}</div>
                                </div>
                              );
                            }
                            return "Query";
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    {databases.map((database) => {
                      const palette = getDatabasePalette(database, databases);
                      return (
                        <Area
                          key={database}
                          dataKey={database}
                          type="monotone"
                          fill={`url(#fill-${database})`}
                          stroke={palette.stroke}
                          strokeWidth={2}
                        />
                      );
                    })}
                    <ChartLegend content={(props) => <ChartLegendContent {...props} />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Speed Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
              {speedSummary.map((db) => (
                <Card
                  key={db.database}
                  size="sm"
                  className="transition-shadow duration-200 hover:shadow-md overflow-hidden"
                >
                  <CardHeader className="pb-1">
                    <div className="flex justify-between items-center">
                      <CardTitle className={cn("text-sm flex items-center gap-1.5", getDatabasePalette(db.database, databases).text)}>
                        <DatabaseIcon database={db.database} className="w-4 h-4" />
                        {db.database}
                      </CardTitle>
                      {db.database === speedWinner.database && (
                        <Badge className="text-xs h-5 px-1.5">
                          Winner
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Mean Total Time with Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Timer aria-hidden="true" className="w-3.5 h-3.5" />
                          Mean Total
                        </span>
                        <span className="text-base font-bold">
                          <FormatMs ms={db.mean_total_ms} />
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-[width] duration-700 motion-reduce:transition-none rounded-full",
                            getDatabasePalette(db.database, databases).bar
                          )}
                          style={{
                            width: `${(Math.min(...speedSummary.map((s) => s.mean_total_ms)) / db.mean_total_ms) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          Retrieval
                        </span>
                        <div className="font-semibold text-xs">
                          <FormatMs ms={db.mean_retrieval_ms} />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          LLM Gen
                        </span>
                        <div className="font-semibold text-xs">
                          <FormatMs ms={db.mean_llm_ms} />
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-xs">
                      <div className="text-center p-1.5 bg-muted rounded-md">
                        <div className="text-muted-foreground text-xs">Min</div>
                        <div className="font-mono font-medium">
                          {db.min_total_ms.toFixed(0)}ms
                        </div>
                      </div>
                      <div className="text-center p-1.5 bg-muted rounded-md">
                        <div className="text-muted-foreground text-xs">Median</div>
                        <div className="font-mono font-medium">
                          {db.median_total_ms.toFixed(0)}ms
                        </div>
                      </div>
                      <div className="text-center p-1.5 bg-muted rounded-md">
                        <div className="text-muted-foreground text-xs">Std Dev</div>
                        <div className="font-mono font-medium">
                          {db.std_total_ms.toFixed(0)}ms
                        </div>
                      </div>
                      <div className="text-center p-1.5 bg-muted rounded-md">
                        <div className="text-muted-foreground text-xs">Max</div>
                        <div className="font-mono font-medium">
                          {db.max_total_ms.toFixed(0)}ms
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Results Table */}
            <Card size="sm">
              <CardHeader className="pb-2 px-2.5 sm:px-3">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-2 sm:gap-1.5">
                  <div>
                    <CardTitle className="text-sm sm:text-base">
                      Query Results
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs hidden sm:block">
                      Click columns to sort.
                    </CardDescription>
                  </div>
                  <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-1.5">
                    <div className="relative flex-1 sm:flex-none sm:w-48">
                      <Search aria-hidden="true" className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        name="query"
                        autoComplete="off"
                        inputMode="search"
                        aria-label="Search queries"
                        placeholder="Search…"
                        className="pl-8 h-8 sm:h-7 text-sm sm:text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterDb} onValueChange={setFilterDb}>
                      <SelectTrigger className="w-28 sm:w-[140px] h-8 sm:h-7" aria-label="Filter by database">
                        <SelectValue placeholder="DB…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All DBs</SelectItem>
                        {databases.map((db) => (
                          <SelectItem key={db} value={db}>
                            {db}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-2.5">
                <div className="w-full overflow-x-auto -mx-1.5 px-1.5 scroll-snap-x">
                  <table className="w-full min-w-[760px] table-fixed text-[11px] sm:text-xs">
                    <colgroup>
                      <col className="w-8" />
                      <col className="w-48" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                      <col className="w-[72px]" />
                      <col className="w-[88px]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "query_num")}>
                          <button
                            type="button"
                            onClick={() => requestSort("query_num")}
                            className="flex w-full items-center gap-1 text-left hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>#</span>
                            <SortIcon
                              active={sortConfig?.key === "query_num"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-left p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "query")}>
                          <button
                            type="button"
                            onClick={() => requestSort("query")}
                            className="flex w-full items-center gap-1 text-left hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Query</span>
                            <SortIcon
                              active={sortConfig?.key === "query"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "database")}>
                          <button
                            type="button"
                            onClick={() => requestSort("database")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Database</span>
                            <SortIcon
                              active={sortConfig?.key === "database"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "retrieval_time")}>
                          <button
                            type="button"
                            onClick={() => requestSort("retrieval_time")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Retrieval</span>
                            <SortIcon
                              active={sortConfig?.key === "retrieval_time"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "llm_time")}>
                          <button
                            type="button"
                            onClick={() => requestSort("llm_time")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>LLM</span>
                            <SortIcon
                              active={sortConfig?.key === "llm_time"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "total_time")}>
                          <button
                            type="button"
                            onClick={() => requestSort("total_time")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Total</span>
                            <SortIcon
                              active={sortConfig?.key === "total_time"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "num_docs")}>
                          <button
                            type="button"
                            onClick={() => requestSort("num_docs")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Docs</span>
                            <SortIcon
                              active={sortConfig?.key === "num_docs"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(sortConfig, "success")}>
                          <button
                            type="button"
                            onClick={() => requestSort("success")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Status</span>
                            <SortIcon
                              active={sortConfig?.key === "success"}
                              direction={sortConfig?.direction}
                            />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="content-visibility-auto">
                      {sortedSpeedResults.slice(0, speedRowLimit).map((row) => (
                        <tr
                          key={`${row.global_query_num ?? row.query_num}-${row.database}-${row.repetition ?? 1}`}
                          className="border-b last:border-0 hover:bg-muted transition-colors"
                        >
                          <td className="p-1.5 font-mono tabular-nums">{row.query_num}</td>
                          <td className="p-1.5 truncate" title={row.query}>
                            {row.query}
                          </td>
                          <td className="p-1.5 text-right">
                            <div className="flex justify-end">
                              <Badge variant="secondary" className="font-normal text-xs h-5 px-1.5">
                                {row.database}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-1.5 text-right font-mono tabular-nums">
                            <FormatMs ms={row.retrieval_time} />
                          </td>
                          <td className="p-1.5 text-right font-mono tabular-nums">
                            <FormatMs ms={row.llm_time} />
                          </td>
                          <td className="p-1.5 text-right font-mono tabular-nums">
                            <FormatMs ms={row.total_time} />
                          </td>
                          <td className="p-1.5 text-right font-mono tabular-nums">
                            {row.num_docs.toFixed(0)}
                          </td>
                          <td className="p-1.5 text-right">
                            <div className="flex justify-end">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "font-normal text-xs h-5 px-1.5",
                                  row.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                )}
                              >
                                {row.success ? "OK" : "Fail"}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedSpeedResults.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      No results found matching your criteria.
                    </div>
                  )}
                </div>
                {sortedSpeedResults.length > speedRowLimit && (
                  <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                    <span className="font-mono tabular-nums">
                      {speedRowLimit.toLocaleString()} of {sortedSpeedResults.length.toLocaleString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSpeedRowLimit((n) => n + 300)}
                    >
                      Show More
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          )
        }

        {/* Scalability Tab */}
        {
          activeTab === "scalability" && (
            <div key="scalability-tab" className="sm:h-full sm:overflow-y-auto no-scrollbar space-y-3 sm:space-y-2 pb-6 sm:pb-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none motion-reduce:duration-0">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1.5">
                <BarChart3 aria-hidden="true" className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                Scalability
              </h2>
            </div>

            {/* Scalability Line Chart - Now at top */}
            <Card className="pt-0">
              <CardHeader className="flex items-center gap-1.5 space-y-0 py-2 sm:py-2.5 px-2.5 sm:px-3 sm:flex-row">
                <div className="grid flex-1 gap-0.5">
                  <CardTitle className="text-sm sm:text-lg">Trend by top_k</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-2.5 pt-2 sm:pt-2.5">
                <ChartContainer
                  config={buildChartConfig(databases)}
                  className="aspect-auto h-[200px] sm:h-[280px] md:h-[340px] w-full"
                >
                  <LineChart
                    data={sortedScalabilityData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="top_k"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `k=${value}`}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value.toFixed(0)}ms`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            if (payload && payload.length > 0) {
                              const topK = payload[0]?.payload?.top_k;
                              return (
                                <div className="space-y-1">
                                  <div className="font-semibold">top_k = {topK}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Retrieving {topK} documents per query
                                  </div>
                                </div>
                              );
                            }
                            return "top_k";
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    {/* Confidence interval bands */}
                    {/* Main lines */}
                    {databases.map((database) => (
                      <Line
                        key={database}
                        dataKey={database}
                        type="monotone"
                        stroke={getDatabasePalette(database, databases).stroke}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    ))}
                    <ChartLegend content={(props) => <ChartLegendContent {...props} />} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Database Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
              {databases.map((db) => (
                <Card
                  key={db}
                  size="sm"
                  className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-1">
                    <div className="flex justify-between items-center">
                      <CardTitle className={cn("text-sm flex items-center gap-1.5", getDatabasePalette(db, databases).text)}>
                        <DatabaseIcon database={db} className="w-4 h-4" />
                        {db}
                      </CardTitle>
                      {db === scalabilityWinner.database && (
                        <Badge className="text-xs h-5 px-1.5">
                          Winner
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">Retrieval time by top_k</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {scalabilityData[db]?.map((item, idx) => (
                        <div key={`${db}-${item.top_k}-${idx}`} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">
                              top_k = {item.top_k}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              {item.avg_time.toFixed(2)}ms
                            </span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                                getDatabasePalette(db, databases).bar
                              )}
                              style={{
                                width: `${Math.min(
                                  (item.avg_time /
                                    Math.max(
                                      ...Object.values(scalabilityData).flatMap(
                                        (arr) => arr.map((i) => i.avg_time)
                                      )
                                    )) *
                                  100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>±{item.std_time.toFixed(2)}ms</span>
                            <span>
                              {item.min_time.toFixed(1)} - {item.max_time.toFixed(1)}ms
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scalability Comparison Table */}
            <Card size="sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Performance Comparison Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Average retrieval time (ms) by database and top_k value. Click columns to sort.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[520px] table-fixed text-xs">
                    <colgroup>
                      <col className="w-12" />
                      {databases.map((db) => (
                        <col key={db} className="w-[104px]" />
                      ))}
                    </colgroup>
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(scalabilitySortConfig, "top_k")}>
                          <button
                            type="button"
                            onClick={() => requestScalabilitySort("top_k")}
                            className="flex w-full items-center gap-1 text-left hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>top_k</span>
                            <SortIcon
                              active={scalabilitySortConfig?.key === "top_k"}
                              direction={scalabilitySortConfig?.direction}
                            />
                          </button>
                        </th>
                        {databases.map((db) => (
                          <th key={db} className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(scalabilitySortConfig, db)}>
                            <button
                              type="button"
                              onClick={() => requestScalabilitySort(db)}
                              className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                            >
                              <span>{db}</span>
                              <SortIcon
                                active={scalabilitySortConfig?.key === db}
                                direction={scalabilitySortConfig?.direction}
                              />
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="content-visibility-auto">
                      {sortedScalabilityData.map((item, idx) => {
                        const minTime = Math.min(
                          ...databases.map((d) => (item as Record<string, number>)[d] ?? Infinity)
                        );
                        return (
                          <tr
                            key={`${item.top_k}-${idx}`}
                            className="border-b last:border-0 hover:bg-muted transition-colors"
                          >
                            <td className="p-1.5 font-medium font-mono tabular-nums">{item.top_k}</td>
                            {databases.map((db) => {
                              const time = (item as Record<string, number>)[db];
                              const isMin = time === minTime;
                              return (
                                <td
                                  key={db}
                                  className={cn(
                                    "p-1.5 text-right font-mono tabular-nums",
                                    isMin && `${getDatabasePalette(db, databases).text} font-semibold`
                                  )}
                                >
                                  {time?.toFixed(2)}ms
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          )
        }

        {/* Quality Tab */}
        {
          activeTab === "quality" && (
            <div key="quality-tab" className="sm:h-full sm:min-h-0 sm:flex sm:flex-col sm:overflow-y-auto no-scrollbar space-y-3 sm:space-y-2 pb-6 sm:pb-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none motion-reduce:duration-0">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1.5">
                <Activity aria-hidden="true" className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                Quality Metrics
              </h2>
              <p className="text-xs text-muted-foreground">
                Quality is measured on {qualityScopeLabel} using precision, {qualityCoverageLabel.toLowerCase()}, and F1.
              </p>
            </div>

            {/* Quality Summary Cards - 3 cols on mobile for compact view */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-1.5">
              {databases.map((db) => {
                const metrics = qualityData[db];
                const palette = getDatabasePalette(db, databases);
                return (
                  <Card key={db} size="sm" className="overflow-hidden">
                    <CardHeader className="pb-0.5 sm:pb-1 px-2 sm:px-2.5">
                      <CardTitle className={cn("text-[11px] sm:text-sm flex items-center gap-1", palette.text)}>
                        <DatabaseIcon database={db} className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" />
                        <span className="truncate">{db}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5 sm:pt-2 space-y-1.5 sm:space-y-2 px-2 sm:px-2.5">
                      {/* Precision */}
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                          <span className="text-muted-foreground font-medium">P</span>
                          <span className={cn("text-[11px] sm:text-sm font-bold", palette.text)}>
                            <AnimatedCounter value={metrics.avg_precision * 100} decimals={1} suffix="%" />
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <AnimatedProgressBar
                            value={metrics.avg_precision}
                            className={palette.bar}
                          />
                        </div>
                      </div>

                      {/* Coverage */}
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                          <span className="text-muted-foreground font-medium">{qualityCoverageLabel === "Context Recall" ? "CR" : qualityCoverageLabel === "Recall" ? "R" : "H@K"}</span>
                          <span className={cn("text-[11px] sm:text-sm font-bold", palette.text)}>
                            <AnimatedCounter value={getQualityCoverageValue(metrics) * 100} decimals={1} suffix="%" />
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <AnimatedProgressBar
                            value={getQualityCoverageValue(metrics)}
                            className={palette.bar}
                          />
                        </div>
                      </div>

                      {/* F1 Score */}
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                          <span className="text-muted-foreground font-medium">{benchmarkData.deepeval_answer_quality ? "Faith" : "F1"}</span>
                          <span className={cn("text-[11px] sm:text-sm font-bold", palette.text)}>
                            <AnimatedCounter value={metrics.avg_f1_score * 100} decimals={1} suffix="%" />
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <AnimatedProgressBar
                            value={metrics.avg_f1_score}
                            className={palette.bar}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Per-Query Quality Results */}
            <Card size="sm" className="sm:flex-1 sm:min-h-0">
              <CardHeader className="pb-2 px-2.5 sm:px-3">
                <div className="flex flex-wrap items-start justify-between gap-1.5">
                  <div>
                    <CardTitle className="text-sm sm:text-base">Per-Query Analysis</CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs hidden sm:block">
                      Click columns to sort.
                    </CardDescription>
                  </div>
                  <Select value={selectedQualityDb} onValueChange={setSelectedQualityDb}>
                    <SelectTrigger className="w-[150px] h-8 sm:h-7" aria-label="Select quality database">
                      <SelectValue placeholder="Database" />
                    </SelectTrigger>
                    <SelectContent>
                      {databases.map((db) => (
                        <SelectItem key={db} value={db}>
                          {db}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-2.5 sm:flex sm:flex-1 sm:flex-col sm:min-h-0">
                <div className="w-full overflow-x-auto sm:overflow-auto sm:flex-1 sm:min-h-0 -mx-1.5 px-1.5 scroll-snap-x">
                  <table className="w-full min-w-[520px] sm:h-full table-fixed text-[11px] sm:text-xs">
                    <colgroup>
                      <col className="w-48" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                      <col className="w-[104px]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(qualitySortConfig, "query")}>
                          <button
                            type="button"
                            onClick={() => requestQualitySort("query")}
                            className="flex w-full items-center gap-1 text-left hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>Query</span>
                            <SortIcon
                              active={qualitySortConfig?.key === "query"}
                              direction={qualitySortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(qualitySortConfig, "precision")}>
                          <button
                            type="button"
                            onClick={() => requestQualitySort("precision")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>{benchmarkData.deepeval_answer_quality ? "Ctx Precision" : "Precision"}</span>
                            <SortIcon
                              active={qualitySortConfig?.key === "precision"}
                              direction={qualitySortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(qualitySortConfig, qualityCoverageLabel === "Recall" ? "recall" : "hit_at_k")}>
                          <button
                            type="button"
                            onClick={() => requestQualitySort(qualityCoverageLabel === "Recall" ? "recall" : "hit_at_k")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>{qualityCoverageLabel}</span>
                            <SortIcon
                              active={qualitySortConfig?.key === (qualityCoverageLabel === "Recall" ? "recall" : "hit_at_k")}
                              direction={qualitySortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(qualitySortConfig, "f1_score")}>
                          <button
                            type="button"
                            onClick={() => requestQualitySort("f1_score")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>{benchmarkData.deepeval_answer_quality ? "Faithfulness" : "F1"}</span>
                            <SortIcon
                              active={qualitySortConfig?.key === "f1_score"}
                              direction={qualitySortConfig?.direction}
                            />
                          </button>
                        </th>
                        <th className="text-right p-1.5 font-medium text-muted-foreground" aria-sort={ariaSortFor(qualitySortConfig, "relevant_retrieved")}>
                          <button
                            type="button"
                            onClick={() => requestQualitySort("relevant_retrieved")}
                            className="flex w-full items-center justify-end gap-1 text-right hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>{benchmarkData.deepeval_answer_quality ? "Sample" : "Retrieved"}</span>
                            <SortIcon
                              active={qualitySortConfig?.key === "relevant_retrieved"}
                              direction={qualitySortConfig?.direction}
                            />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="content-visibility-auto">
                      {sortedQualityResults.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b last:border-0 hover:bg-muted transition-colors"
                        >
                          <td className="p-1.5 truncate" title={item.query}>
                            {item.query}
                          </td>
                          <td
                            className={cn(
                              "p-1.5 text-right font-mono tabular-nums",
                              item.precision === 1.0 && "text-emerald-500"
                            )}
                          >
                            <FormatPercent value={item.precision} />
                          </td>
                          <td
                            className={cn(
                              "p-1.5 text-right font-mono tabular-nums",
                               getPerQueryCoverageValue(item) === 1.0 && "text-emerald-500"
                             )}
                           >
                             <FormatPercent value={getPerQueryCoverageValue(item)} />
                           </td>
                          <td
                            className={cn(
                              "p-1.5 text-right font-mono tabular-nums",
                              item.f1_score === 1.0 && "text-emerald-500"
                            )}
                          >
                            <FormatPercent value={item.f1_score} />
                          </td>
                          <td className="p-1.5 text-right font-mono tabular-nums">
                            {item.relevant_retrieved !== undefined && item.total_retrieved !== undefined
                              ? `${item.relevant_retrieved}/${item.total_retrieved}`
                              : "DeepEval"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            </div>
          )
        }

        {/* Info Tab */}
        {
          activeTab === "info" && (
            <div key="info-tab" className="sm:h-full sm:overflow-y-auto no-scrollbar space-y-3 sm:space-y-2 pb-6 sm:pb-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none motion-reduce:duration-0">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight flex items-center gap-1.5">
                  <Info aria-hidden="true" className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                  More Info
                </h2>
              </div>

              <Card size="sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-12 sm:size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                      <BarChart3 aria-hidden="true" className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{activeDatasetTitle}</CardTitle>
                      <CardDescription className="text-xs">
                        Configuration details, source files, and benchmark run metadata.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Aggregation</div>
                      <div className="font-medium">{aggregationLabel}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Runs</div>
                      <div className="font-medium font-mono tabular-nums">{runsAggregated}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Queries</div>
                      <div className="font-medium font-mono tabular-nums">{metadata.num_queries}</div>
                    </div>
                    {metadata.score_threshold !== undefined && (
                      <div>
                        <div className="text-muted-foreground">Threshold</div>
                        <div className="font-medium font-mono tabular-nums">{metadata.score_threshold}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-medium font-mono tabular-nums">{speedSuccessRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Timestamp</div>
                      <div className="font-medium font-mono break-all">{getBenchmarkDate(metadata)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Scalability Docs</div>
                      <div className="font-medium font-mono tabular-nums">
                        {metadata.scalability_doc_counts?.join(", ") ?? "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Scalability Queries</div>
                      <div className="font-medium font-mono tabular-nums">
                        {metadata.scalability_query_count ?? "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Quality Scope</div>
                      <div className="font-medium">{qualityCoverageLabel} on {qualityScopeLabel}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Speed Rows</div>
                      <div className="font-medium font-mono tabular-nums">{speedRawResults.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Quality Rows</div>
                      <div className="font-medium font-mono tabular-nums">{sortedQualityResults.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Scalability DBs</div>
                      <div className="font-medium font-mono tabular-nums">{Object.keys(scalabilityData).length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Winner</div>
                      <div className={cn("font-medium", getDatabasePalette(speedWinner.database, databases).text)}>{speedWinner.database}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">Models</p>
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                        <span className="text-muted-foreground">LLM</span>
                        <span className="font-mono break-all">{metadata.llm_model}</span>
                        <span className="text-muted-foreground">Embedding</span>
                        <span className="font-mono break-all">{metadata.embedding_model}</span>
                        <span className="text-muted-foreground">Top-K</span>
                        <span className="font-mono tabular-nums">{metadata.top_k}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">Source Files ({sourceFiles.length})</p>
                      <div className="space-y-0.5">
                        {sourceFiles.map((sourceFile) => (
                          <div key={sourceFile} className="font-mono truncate" title={sourceFile}>
                            {sourceFile}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {Object.keys(maxConcurrentByDatabase).length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Resource Usage at Max Concurrent Users</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1.5">
                        {(() => {
                          const rows = databases.map((database) => maxConcurrentByDatabase[database]);
                          const best = {
                            cpuAvg: uniqueBest(rows.map((r) => r?.avg_cpu_percent)),
                            cpuMax: uniqueBest(rows.map((r) => r?.max_cpu_percent)),
                            ramAvg: uniqueBest(rows.map((r) => r?.avg_ram_used_mb)),
                            ramMax: uniqueBest(rows.map((r) => r?.max_ram_used_mb)),
                            gpuAvg: uniqueBest(rows.map((r) => r?.avg_gpu_util_percent)),
                            gpuMax: uniqueBest(rows.map((r) => r?.max_gpu_util_percent)),
                            vramAvg: uniqueBest(rows.map((r) => r?.avg_gpu_memory_used_mb)),
                            vramMax: uniqueBest(rows.map((r) => r?.max_gpu_memory_used_mb)),
                          };
                          const bestValueClass = (isBest: boolean) =>
                            cn("text-right", isBest && "font-semibold text-green-600 dark:text-green-400");
                          return databases.map((db) => {
                          const row = maxConcurrentByDatabase[db];
                          return (
                            <div key={db} className="rounded-lg border bg-card px-2 py-1.5 text-xs">
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <div className={cn("flex items-center gap-1.5 font-medium", getDatabasePalette(db, databases).text)}>
                                  <DatabaseIcon database={db} className="w-3.5 h-3.5" />
                                  <span>{db}</span>
                                </div>
                                <span className="font-mono text-muted-foreground">{row?.concurrent_users ?? "-"} users</span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono tabular-nums">
                                <span className="text-muted-foreground">CPU avg</span>
                                <span className={bestValueClass(row?.avg_cpu_percent === best.cpuAvg)}>{row?.avg_cpu_percent?.toFixed(1) ?? "-"}%</span>
                                <span className="text-muted-foreground">CPU max</span>
                                <span className={bestValueClass(row?.max_cpu_percent === best.cpuMax)}>{row?.max_cpu_percent?.toFixed(1) ?? "-"}%</span>
                                <span className="text-muted-foreground">RAM avg</span>
                                <span className={bestValueClass(row?.avg_ram_used_mb === best.ramAvg)}>{row?.avg_ram_used_mb?.toFixed(0) ?? "-"}MB</span>
                                <span className="text-muted-foreground">RAM max</span>
                                <span className={bestValueClass(row?.max_ram_used_mb === best.ramMax)}>{row?.max_ram_used_mb?.toFixed(0) ?? "-"}MB</span>
                                <span className="text-muted-foreground">GPU avg</span>
                                <span className={bestValueClass(row?.avg_gpu_util_percent === best.gpuAvg)}>{row?.avg_gpu_util_percent?.toFixed(1) ?? "-"}%</span>
                                <span className="text-muted-foreground">GPU max</span>
                                <span className={bestValueClass(row?.max_gpu_util_percent === best.gpuMax)}>{row?.max_gpu_util_percent?.toFixed(1) ?? "-"}%</span>
                                <span className="text-muted-foreground">VRAM avg</span>
                                <span className={bestValueClass(row?.avg_gpu_memory_used_mb === best.vramAvg)}>{row?.avg_gpu_memory_used_mb?.toFixed(0) ?? "-"}MB</span>
                                <span className="text-muted-foreground">VRAM max</span>
                                <span className={bestValueClass(row?.max_gpu_memory_used_mb === best.vramMax)}>{row?.max_gpu_memory_used_mb?.toFixed(0) ?? "-"}MB</span>
                              </div>
                            </div>
                          );
                          });
                        })()}
                      </div>
                      <p className="text-[11px] leading-snug text-muted-foreground">{GPU_USAGE_NOTE}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base">Speed Summary Details</CardTitle>
                  <CardDescription className="text-xs">
                    Per-database latency summary from the active benchmark dataset.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-1.5 sm:px-2.5">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="p-1.5 text-left font-medium text-muted-foreground">DB</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Retrieval Mean</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Retrieval P95</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Total Mean</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Total Median</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Total P95</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Min</th>
                          <th className="p-1.5 text-right font-medium text-muted-foreground">Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const best = {
                            meanRetrieval: uniqueBest(speedSummary.map((r) => r.mean_retrieval_ms)),
                            p95Retrieval: uniqueBest(speedSummary.map((r) => r.p95_retrieval_ms)),
                            meanTotal: uniqueBest(speedSummary.map((r) => r.mean_total_ms)),
                            medianTotal: uniqueBest(speedSummary.map((r) => r.median_total_ms)),
                            p95Total: uniqueBest(speedSummary.map((r) => r.p95_total_ms)),
                            minTotal: uniqueBest(speedSummary.map((r) => r.min_total_ms)),
                            maxTotal: uniqueBest(speedSummary.map((r) => r.max_total_ms)),
                          };
                          return speedSummary.map((row) => (
                          <tr key={row.database} className="border-b last:border-0">
                            <td className="p-1.5">
                              <div className="flex items-center gap-1.5">
                                <DatabaseIcon database={row.database} className="w-3.5 h-3.5" />
                                <span>{row.database}</span>
                              </div>
                            </td>
                            <td className={bestCellClass(row.mean_retrieval_ms === best.meanRetrieval)}>{row.mean_retrieval_ms.toFixed(2)}ms</td>
                            <td className={bestCellClass(row.p95_retrieval_ms === best.p95Retrieval)}>{row.p95_retrieval_ms?.toFixed(2) ?? "-"}ms</td>
                            <td className={bestCellClass(row.mean_total_ms === best.meanTotal)}>{row.mean_total_ms.toFixed(2)}ms</td>
                            <td className={bestCellClass(row.median_total_ms === best.medianTotal)}>{row.median_total_ms.toFixed(2)}ms</td>
                            <td className={bestCellClass(row.p95_total_ms === best.p95Total)}>{row.p95_total_ms?.toFixed(2) ?? "-"}ms</td>
                            <td className={bestCellClass(row.min_total_ms === best.minTotal)}>{row.min_total_ms.toFixed(2)}ms</td>
                            <td className={bestCellClass(row.max_total_ms === best.maxTotal)}>{row.max_total_ms.toFixed(2)}ms</td>
                          </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {speed_test.failure_summary && Object.keys(speed_test.failure_summary).length > 0 && (
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">Failure Summary</CardTitle>
                    <CardDescription className="text-xs">
                      Per-database success and failure counts from `speed_test.failure_summary`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-1.5 sm:px-2.5">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[620px] text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="p-1.5 text-left font-medium text-muted-foreground">DB</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Total Rows</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Success Rows</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Failed Rows</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Success Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const failureSummary = speed_test.failure_summary;
                            if (!failureSummary) return null;
                            const entries = Object.entries(failureSummary);
                            const best = {
                              successRows: uniqueBest(entries.map(([, s]) => s.success_rows), "max"),
                              failedRows: uniqueBest(entries.map(([, s]) => s.failed_rows)),
                              successRate: uniqueBest(entries.map(([, s]) => s.success_rate), "max"),
                            };
                            return entries.map(([database, stats]) => (
                            <tr key={database} className="border-b last:border-0">
                              <td className="p-1.5">
                                <div className="flex items-center gap-1.5">
                                  <DatabaseIcon database={database} className="w-3.5 h-3.5" />
                                  <span>{database}</span>
                                </div>
                              </td>
                              <td className="p-1.5 text-right font-mono tabular-nums">{stats.total_rows}</td>
                              <td className={bestCellClass(stats.success_rows === best.successRows)}>{stats.success_rows}</td>
                              <td className={bestCellClass(stats.failed_rows === best.failedRows)}>{stats.failed_rows}</td>
                              <td className={bestCellClass(stats.success_rate === best.successRate)}>{(stats.success_rate * 100).toFixed(1)}%</td>
                            </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {Object.keys(queryTypeSummary).length > 0 && (
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">Query Type Breakdown</CardTitle>
                    <CardDescription className="text-xs">
                      Answerable vs no-answer performance split from `speed_test.query_type_summary`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-1.5 sm:px-2.5">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[920px] text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="p-1.5 text-left font-medium text-muted-foreground">DB</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Answerable Q</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Answerable Retrieval</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Answerable Total</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">No-Answer Q</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">No-Answer Retrieval</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">No-Answer Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const entries = Object.entries(queryTypeSummary);
                            const best = {
                              ansRetrieval: uniqueBest(entries.map(([, s]) => s.answerable?.mean_retrieval_ms)),
                              ansTotal: uniqueBest(entries.map(([, s]) => s.answerable?.mean_total_ms)),
                              noAnsRetrieval: uniqueBest(entries.map(([, s]) => s.no_answer?.mean_retrieval_ms)),
                              noAnsTotal: uniqueBest(entries.map(([, s]) => s.no_answer?.mean_total_ms)),
                            };
                            return entries.map(([database, stats]) => (
                            <tr key={database} className="border-b last:border-0">
                              <td className="p-1.5">
                                <div className="flex items-center gap-1.5">
                                  <DatabaseIcon database={database} className="w-3.5 h-3.5" />
                                  <span>{database}</span>
                                </div>
                              </td>
                              <td className="p-1.5 text-right font-mono tabular-nums">{stats.answerable?.queries_tested ?? 0}</td>
                              <td className={bestCellClass(stats.answerable?.mean_retrieval_ms === best.ansRetrieval)}>{stats.answerable?.mean_retrieval_ms.toFixed(2) ?? "-"}ms</td>
                              <td className={bestCellClass(stats.answerable?.mean_total_ms === best.ansTotal)}>{stats.answerable?.mean_total_ms.toFixed(2) ?? "-"}ms</td>
                              <td className="p-1.5 text-right font-mono tabular-nums">{stats.no_answer?.queries_tested ?? 0}</td>
                              <td className={bestCellClass(stats.no_answer?.mean_retrieval_ms === best.noAnsRetrieval)}>{stats.no_answer?.mean_retrieval_ms.toFixed(2) ?? "-"}ms</td>
                              <td className={bestCellClass(stats.no_answer?.mean_total_ms === best.noAnsTotal)}>{stats.no_answer?.mean_total_ms.toFixed(2) ?? "-"}ms</td>
                            </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {Object.keys(perRepetitionSummary).length > 0 && (
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">Per-Repetition Summary</CardTitle>
                    <CardDescription className="text-xs">
                      Repetition-level stability from `speed_test.per_repetition_summary`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(perRepetitionSummary).map(([database, repetitions]) => (
                      <div key={database} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <DatabaseIcon database={database} className="w-4 h-4" />
                            <span>{database}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{repetitions.length} runs</span>
                        </div>
                        <div className="w-full overflow-x-auto">
                          <table className="w-full min-w-[680px] text-xs">
                            <thead>
                              <tr className="border-b">
                                <th className="p-1.5 text-left font-medium text-muted-foreground">Run</th>
                                <th className="p-1.5 text-right font-medium text-muted-foreground">Retrieval Mean</th>
                                <th className="p-1.5 text-right font-medium text-muted-foreground">Retrieval P95</th>
                                <th className="p-1.5 text-right font-medium text-muted-foreground">Total Mean</th>
                                <th className="p-1.5 text-right font-medium text-muted-foreground">Total P95</th>
                              </tr>
                            </thead>
                            <tbody>
                              {repetitions.map((run) => (
                                <tr key={`${database}-${run.repetition}`} className="border-b last:border-0">
                                  <td className="p-1.5 font-mono tabular-nums">Run {run.repetition}</td>
                                  <td className="p-1.5 text-right font-mono tabular-nums">{run.mean_retrieval_ms.toFixed(2)}ms</td>
                                  <td className="p-1.5 text-right font-mono tabular-nums">{run.p95_retrieval_ms?.toFixed(2) ?? "-"}ms</td>
                                  <td className="p-1.5 text-right font-mono tabular-nums">{run.mean_total_ms.toFixed(2)}ms</td>
                                  <td className="p-1.5 text-right font-mono tabular-nums">{run.p95_total_ms?.toFixed(2) ?? "-"}ms</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {Object.keys(concurrentUserScalability).length > 0 && (
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">Concurrent User Scalability</CardTitle>
                    <CardDescription className="text-xs">
                      Latency, throughput, and resource summary from `concurrent_user_scalability_test`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-1.5 sm:px-2.5">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[1180px] text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="p-1.5 text-left font-medium text-muted-foreground">DB</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Users</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Mean Latency</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">P95</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">P99</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Throughput</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Error</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">CPU Avg</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">CPU Max</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">RAM Avg</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">RAM Max</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">GPU Avg</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">GPU Max</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">VRAM Avg</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">VRAM Max</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const allRows = Object.values(concurrentUserScalability).flat();
                            // Compare only rows with the same concurrent-user count
                            const bestForUsers = (users: number) => {
                              const group = allRows.filter((r) => r.concurrent_users === users);
                              return {
                                meanLatency: uniqueBest(group.map((r) => r.mean_latency_ms)),
                                p95: uniqueBest(group.map((r) => r.p95_latency_ms)),
                                p99: uniqueBest(group.map((r) => r.p99_latency_ms)),
                                throughput: uniqueBest(group.map((r) => r.throughput_rps), "max"),
                                error: uniqueBest(group.map((r) => r.error_rate)),
                                cpuAvg: uniqueBest(group.map((r) => r.avg_cpu_percent)),
                                cpuMax: uniqueBest(group.map((r) => r.max_cpu_percent)),
                                ramAvg: uniqueBest(group.map((r) => r.avg_ram_used_mb)),
                                ramMax: uniqueBest(group.map((r) => r.max_ram_used_mb)),
                                gpuAvg: uniqueBest(group.map((r) => r.avg_gpu_util_percent)),
                                gpuMax: uniqueBest(group.map((r) => r.max_gpu_util_percent)),
                                vramAvg: uniqueBest(group.map((r) => r.avg_gpu_memory_used_mb)),
                                vramMax: uniqueBest(group.map((r) => r.max_gpu_memory_used_mb)),
                              };
                            };
                            return Object.entries(concurrentUserScalability).flatMap(([database, rows]) =>
                              rows.map((row) => {
                                const best = bestForUsers(row.concurrent_users);
                                return (
                              <tr key={`${database}-${row.concurrent_users}`} className="border-b last:border-0">
                                <td className="p-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <DatabaseIcon database={database} className="w-3.5 h-3.5" />
                                    <span>{database}</span>
                                  </div>
                                </td>
                                <td className="p-1.5 text-right font-mono tabular-nums">{row.concurrent_users}</td>
                                <td className={bestCellClass(row.mean_latency_ms === best.meanLatency)}>{row.mean_latency_ms.toFixed(2)}ms</td>
                                <td className={bestCellClass(row.p95_latency_ms === best.p95)}>{row.p95_latency_ms.toFixed(2)}ms</td>
                                <td className={bestCellClass(row.p99_latency_ms === best.p99)}>{row.p99_latency_ms.toFixed(2)}ms</td>
                                <td className={bestCellClass(row.throughput_rps === best.throughput)}>{row.throughput_rps.toFixed(2)} rps</td>
                                <td className={bestCellClass(row.error_rate === best.error)}>{(row.error_rate * 100).toFixed(1)}%</td>
                                <td className={bestCellClass(row.avg_cpu_percent === best.cpuAvg)}>{row.avg_cpu_percent?.toFixed(1) ?? "-"}%</td>
                                <td className={bestCellClass(row.max_cpu_percent === best.cpuMax)}>{row.max_cpu_percent?.toFixed(1) ?? "-"}%</td>
                                <td className={bestCellClass(row.avg_ram_used_mb === best.ramAvg)}>{row.avg_ram_used_mb?.toFixed(0) ?? "-"}MB</td>
                                <td className={bestCellClass(row.max_ram_used_mb === best.ramMax)}>{row.max_ram_used_mb?.toFixed(0) ?? "-"}MB</td>
                                <td className={bestCellClass(row.avg_gpu_util_percent === best.gpuAvg)}>{row.avg_gpu_util_percent?.toFixed(1) ?? "-"}%</td>
                                <td className={bestCellClass(row.max_gpu_util_percent === best.gpuMax)}>{row.max_gpu_util_percent?.toFixed(1) ?? "-"}%</td>
                                <td className={bestCellClass(row.avg_gpu_memory_used_mb === best.vramAvg)}>{row.avg_gpu_memory_used_mb?.toFixed(0) ?? "-"}MB</td>
                                <td className={bestCellClass(row.max_gpu_memory_used_mb === best.vramMax)}>{row.max_gpu_memory_used_mb?.toFixed(0) ?? "-"}MB</td>
                              </tr>
                                );
                              })
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 px-1.5 text-[11px] leading-snug text-muted-foreground">{GPU_USAGE_NOTE}</p>
                  </CardContent>
                </Card>
              )}

              {Object.keys(deepevalQuality).length > 0 && (
                <Card size="sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base">DeepEval Answer Quality</CardTitle>
                    <CardDescription className="text-xs">
                      Answer relevancy, faithfulness, and contextual retrieval metrics from `deepeval_answer_quality`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-1.5 sm:px-2.5">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[820px] text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="p-1.5 text-left font-medium text-muted-foreground">DB</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Answer Relevancy</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Faithfulness</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Context Relevancy</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Context Precision</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Context Recall</th>
                            <th className="p-1.5 text-right font-medium text-muted-foreground">Rows</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const entries = Object.entries(deepevalQuality);
                            const best = {
                              relevancy: uniqueBest(entries.map(([, m]) => m.avg_answer_relevancy ?? 0), "max"),
                              faithfulness: uniqueBest(entries.map(([, m]) => m.avg_faithfulness ?? 0), "max"),
                              ctxRelevancy: uniqueBest(entries.map(([, m]) => m.avg_contextual_relevancy ?? 0), "max"),
                              ctxPrecision: uniqueBest(entries.map(([, m]) => m.avg_contextual_precision ?? 0), "max"),
                              ctxRecall: uniqueBest(entries.map(([, m]) => m.avg_contextual_recall ?? 0), "max"),
                            };
                            return entries.map(([database, metrics]) => (
                            <tr key={database} className="border-b last:border-0">
                              <td className="p-1.5">
                                <div className="flex items-center gap-1.5">
                                  <DatabaseIcon database={database} className="w-3.5 h-3.5" />
                                  <span>{database}</span>
                                </div>
                              </td>
                              <td className={bestCellClass((metrics.avg_answer_relevancy ?? 0) === best.relevancy)}>{((metrics.avg_answer_relevancy ?? 0) * 100).toFixed(2)}%</td>
                              <td className={bestCellClass((metrics.avg_faithfulness ?? 0) === best.faithfulness)}>{((metrics.avg_faithfulness ?? 0) * 100).toFixed(2)}%</td>
                              <td className={bestCellClass((metrics.avg_contextual_relevancy ?? 0) === best.ctxRelevancy)}>{((metrics.avg_contextual_relevancy ?? 0) * 100).toFixed(2)}%</td>
                              <td className={bestCellClass((metrics.avg_contextual_precision ?? 0) === best.ctxPrecision)}>{((metrics.avg_contextual_precision ?? 0) * 100).toFixed(2)}%</td>
                              <td className={bestCellClass((metrics.avg_contextual_recall ?? 0) === best.ctxRecall)}>{((metrics.avg_contextual_recall ?? 0) * 100).toFixed(2)}%</td>
                              <td className="p-1.5 text-right font-mono tabular-nums">{metrics.per_query?.length ?? 0}</td>
                            </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        }
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 inset-x-0 sm:hidden border-t border-border bg-background z-50 safe-area-inset"
      >
        <div className="flex items-center justify-between px-2 py-1">
          {/* Tab Navigation */}
          <div role="tablist" aria-label="Main navigation" className="flex items-center" onKeyDown={handleTabKeyDown}>
            <BottomNavTabButton
              tab="summary"
              label="Summary"
              icon={LayoutDashboard}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <BottomNavTabButton
              tab="speed"
              label="Speed"
              icon={Zap}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <BottomNavTabButton
              tab="scalability"
              label="Scale"
              icon={TrendingUp}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <BottomNavTabButton
              tab="quality"
              label="Quality"
              icon={Target}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <BottomNavTabButton
              tab="info"
              label="Info"
              icon={Info}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
