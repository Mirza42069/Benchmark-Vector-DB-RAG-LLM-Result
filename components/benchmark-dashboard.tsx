"use client";

import React, { useState, useMemo } from "react";
import benchmarkData from "../benchmark result.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// Type definitions
interface SpeedTestRawResult {
  query_num: number;
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
  mean_retrieval_ms: number;
  mean_llm_ms: number;
}

interface ScalabilityResult {
  top_k: number;
  avg_time: number;
  std_time: number;
  min_time: number;
  max_time: number;
}

interface QualityPerQuery {
  query: string;
  precision: number;
  recall: number;
  f1_score: number;
  relevant_retrieved: number;
  total_retrieved: number;
}

interface QualityMetrics {
  avg_precision: number;
  avg_recall: number;
  avg_f1_score: number;
  per_query: QualityPerQuery[];
}

type TabType = "speed" | "scalability" | "quality";

// Sub-components moved outside to avoid re-creation on render
const FormatMs = ({ ms }: { ms: number }) => (
  <span className="font-mono tabular-nums text-sm">{ms.toFixed(2)}ms</span>
);

const FormatPercent = ({ value }: { value: number }) => (
  <span className="font-mono tabular-nums text-sm">
    {(value * 100).toFixed(1)}%
  </span>
);

const SortIcon = ({
  active,
  direction,
}: {
  active: boolean;
  direction?: "asc" | "desc";
}) => (
  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
    {active &&
      (direction === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      ))}
  </div>
);

interface TabButtonProps {
  tab: TabType;
  label: string;
  icon: React.ElementType;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabButton = ({
  tab,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
}: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={cn(
      "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
      activeTab === tab
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export function BenchmarkDashboard() {
  const { metadata, speed_test, scalability_test, retrieval_quality } =
    benchmarkData;
  const [activeTab, setActiveTab] = useState<TabType>("speed");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDb, setFilterDb] = useState<string>("all");
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

  // Speed test data
  const speedSummary = speed_test.summary as SpeedTestSummary[];
  const speedRawResults = speed_test.raw_results as SpeedTestRawResult[];
  const speedWinner = speed_test.winner;

  // Scalability test data
  const scalabilityData = scalability_test as Record<string, ScalabilityResult[]>;

  // Retrieval quality data
  const qualityData = retrieval_quality as Record<string, QualityMetrics>;

  // Databases list - declare early as it's used in useMemo hooks
  const databases = metadata.databases_tested;

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

  // Sorted quality per-query data
  const sortedQualityResults = useMemo(() => {
    const data = qualityData[databases[0]]?.per_query || [];
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
  }, [qualityData, databases, qualitySortConfig]);

  // Sorted scalability data - always return combined format for consistency
  const sortedScalabilityData = useMemo(() => {
    const baseData = scalabilityData[databases[0]] || [];

    // Always create combined data format with database values as properties
    const combinedData = baseData.map((item, idx) => ({
      top_k: item.top_k,
      ...databases.reduce((acc, db) => {
        acc[db] = scalabilityData[db]?.[idx]?.avg_time ?? 0;
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


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 lg:p-12 space-y-8 font-sans">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Vector Database Benchmark
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
              Performance analysis of RAG pipeline across Pinecone, PostgreSQL,
              and ChromaDB vector databases.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                {new Date(metadata.benchmark_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                LLM: {metadata.llm_model}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Embed: {metadata.embedding_model}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {metadata.num_queries} Queries
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Top-K: {metadata.top_k}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-xl w-fit">
          <TabButton
            tab="speed"
            label="Speed Test"
            icon={Zap}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            tab="scalability"
            label="Scalability"
            icon={TrendingUp}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            tab="quality"
            label="Retrieval Quality"
            icon={Target}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      <Separator />

      {/* Speed Test Tab */}
      {activeTab === "speed" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Winner Spotlight */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.08] pointer-events-none">
              <Trophy className="w-48 h-48 md:w-64 md:h-64 text-primary" />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Speed Test Winner</span>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold">
                {speedWinner.database}
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-foreground/70 max-w-xl">
                {speedWinner.speed_improvement_percent}% faster retrieval speed
                with an average of{" "}
                <span className="font-semibold text-primary">
                  {speedWinner.avg_retrieval_ms}ms
                </span>{" "}
                per query.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Speed Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {speedSummary.map((db) => (
              <Card
                key={db.database}
                className={cn(
                  "border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                  db.database === speedWinner.database
                    ? "border-primary/50 shadow-md ring-1 ring-primary/20"
                    : "border-border"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      {db.database}
                    </CardTitle>
                    {db.database === speedWinner.database && (
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        Winner
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mean Total Time with Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5" />
                        Mean Total
                      </span>
                      <span className="font-semibold">
                        <FormatMs ms={db.mean_total_ms} />
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-700 rounded-full",
                          db.database === speedWinner.database
                            ? "bg-gradient-to-r from-primary to-primary/60"
                            : "bg-muted-foreground/30"
                        )}
                        style={{
                          width: `${(Math.min(...speedSummary.map((s) => s.mean_total_ms)) /
                            db.mean_total_ms) *
                            100
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                        Retrieval
                      </span>
                      <div className="font-semibold text-sm">
                        <FormatMs ms={db.mean_retrieval_ms} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                        LLM Gen
                      </span>
                      <div className="font-semibold text-sm">
                        <FormatMs ms={db.mean_llm_ms} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded-md">
                      <div className="text-muted-foreground mb-0.5">Min</div>
                      <div className="font-mono font-medium">
                        {db.min_total_ms.toFixed(0)}ms
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-md">
                      <div className="text-muted-foreground mb-0.5">Median</div>
                      <div className="font-mono font-medium">
                        {db.median_total_ms.toFixed(0)}ms
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-md">
                      <div className="text-muted-foreground mb-0.5">Max</div>
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
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Query Results
                </h2>
                <p className="text-muted-foreground text-sm">
                  Individual query performance breakdown
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search queries..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDb} onValueChange={setFilterDb}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Databases</SelectItem>
                    {databases.map((db) => (
                      <SelectItem key={db} value={db}>
                        {db}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <div className="relative w-full overflow-auto max-h-[500px]">
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="[&_tr]:border-b sticky top-0 bg-card/95 backdrop-blur z-10">
                    <tr className="border-b transition-colors">
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("query_num")}
                      >
                        <div className="flex items-center gap-1">
                          <SortIcon
                            active={sortConfig?.key === "query_num"}
                            direction={sortConfig?.direction}
                          />
                          <span>#</span>
                        </div>
                      </th>
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("query")}
                      >
                        <div className="flex items-center gap-1">
                          <SortIcon
                            active={sortConfig?.key === "query"}
                            direction={sortConfig?.direction}
                          />
                          <span>Query</span>
                        </div>
                      </th>
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("database")}
                      >
                        <div className="flex items-center gap-1">
                          <SortIcon
                            active={sortConfig?.key === "database"}
                            direction={sortConfig?.direction}
                          />
                          <span>Database</span>
                        </div>
                      </th>
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("retrieval_time")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={sortConfig?.key === "retrieval_time"}
                            direction={sortConfig?.direction}
                          />
                          <span>Retrieval</span>
                        </div>
                      </th>
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("llm_time")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={sortConfig?.key === "llm_time"}
                            direction={sortConfig?.direction}
                          />
                          <span>LLM</span>
                        </div>
                      </th>
                      <th
                        className="h-11 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestSort("total_time")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={sortConfig?.key === "total_time"}
                            direction={sortConfig?.direction}
                          />
                          <span>Total</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {sortedSpeedResults.map((row) => (
                      <tr
                        key={`${row.query_num}-${row.database}`}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle font-medium text-muted-foreground">
                          {row.query_num}
                        </td>
                        <td
                          className="p-4 align-middle max-w-[280px] truncate"
                          title={row.query}
                        >
                          {row.query}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="secondary" className="font-normal">
                            {row.database}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <FormatMs ms={row.retrieval_time} />
                        </td>
                        <td className="p-4 align-middle text-right">
                          <FormatMs ms={row.llm_time} />
                        </td>
                        <td className="p-4 align-middle text-right font-semibold">
                          <FormatMs ms={row.total_time} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedSpeedResults.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    No results found matching your criteria.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Scalability Tab */}
      {activeTab === "scalability" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Scalability Analysis
            </h2>
            <p className="text-muted-foreground">
              Performance at different top_k values (number of documents
              retrieved)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {databases.map((db) => (
              <Card key={db} className="overflow-hidden">
                <CardHeader className="pb-4 bg-muted/30">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Database className="w-5 h-5 text-muted-foreground" />
                    {db}
                  </CardTitle>
                  <CardDescription>Retrieval time by top_k</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {scalabilityData[db]?.map((item) => (
                      <div key={item.top_k} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
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
                              "h-full rounded-full transition-all duration-500",
                              db === "ChromaDB"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                : db === "PostgreSQL"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                  : "bg-gradient-to-r from-amber-500 to-amber-400"
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
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>±{item.std_time.toFixed(2)}ms std</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Performance Comparison Matrix
              </CardTitle>
              <CardDescription>
                Average retrieval time (ms) by database and top_k value. Click columns to sort.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestScalabilitySort("top_k")}
                      >
                        <div className="flex items-center gap-1">
                          <SortIcon
                            active={scalabilitySortConfig?.key === "top_k"}
                            direction={scalabilitySortConfig?.direction}
                          />
                          <span>top_k</span>
                        </div>
                      </th>
                      {databases.map((db) => (
                        <th
                          key={db}
                          className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                          onClick={() => requestScalabilitySort(db)}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <SortIcon
                              active={scalabilitySortConfig?.key === db}
                              direction={scalabilitySortConfig?.direction}
                            />
                            <span>{db}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedScalabilityData.map((item) => {
                      const minTime = Math.min(
                        ...databases.map((d) => (item as Record<string, number>)[d] ?? Infinity)
                      );
                      return (
                        <tr
                          key={item.top_k}
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-3 font-medium">{item.top_k}</td>
                          {databases.map((db) => {
                            const time = (item as Record<string, number>)[db];
                            const isMin = time === minTime;
                            return (
                              <td
                                key={db}
                                className={cn(
                                  "p-3 text-right font-mono",
                                  isMin && "text-primary font-semibold"
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
      )}

      {/* Quality Tab */}
      {activeTab === "quality" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Retrieval Quality Metrics
            </h2>
            <p className="text-muted-foreground">
              Precision, Recall, and F1-Score analysis across databases
            </p>
          </div>

          {/* Quality Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {databases.map((db) => {
              const metrics = qualityData[db];
              return (
                <Card key={db} className="overflow-hidden">
                  <CardHeader className="pb-4 bg-muted/30">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      {db}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Precision */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          Precision
                        </span>
                        <span className="font-semibold text-primary">
                          <FormatPercent value={metrics.avg_precision} />
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-700"
                          style={{ width: `${metrics.avg_precision * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Recall */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          Recall
                        </span>
                        <span className="font-semibold text-emerald-500">
                          <FormatPercent value={metrics.avg_recall} />
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                          style={{ width: `${metrics.avg_recall * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* F1 Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          F1 Score
                        </span>
                        <span className="font-semibold text-blue-500">
                          <FormatPercent value={metrics.avg_f1_score} />
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                          style={{ width: `${metrics.avg_f1_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quality Comparison Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Metrics Summary</CardTitle>
              <CardDescription>
                Side-by-side comparison of all quality metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Metric
                      </th>
                      {databases.map((db) => (
                        <th
                          key={db}
                          className="text-right p-3 font-medium text-muted-foreground"
                        >
                          {db}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">Avg. Precision</td>
                      {databases.map((db) => (
                        <td key={db} className="p-3 text-right font-mono">
                          <FormatPercent
                            value={qualityData[db].avg_precision}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">Avg. Recall</td>
                      {databases.map((db) => (
                        <td key={db} className="p-3 text-right font-mono">
                          <FormatPercent value={qualityData[db].avg_recall} />
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">Avg. F1 Score</td>
                      {databases.map((db) => (
                        <td key={db} className="p-3 text-right font-mono">
                          <FormatPercent value={qualityData[db].avg_f1_score} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Per-Query Quality Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Per-Query Quality Analysis</CardTitle>
              <CardDescription>
                Detailed precision, recall, and F1 scores for each query. Click columns to sort.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card/95 backdrop-blur z-10">
                    <tr className="border-b">
                      <th
                        className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestQualitySort("query")}
                      >
                        <div className="flex items-center gap-1">
                          <SortIcon
                            active={qualitySortConfig?.key === "query"}
                            direction={qualitySortConfig?.direction}
                          />
                          <span>Query</span>
                        </div>
                      </th>
                      <th
                        className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestQualitySort("precision")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={qualitySortConfig?.key === "precision"}
                            direction={qualitySortConfig?.direction}
                          />
                          <span>Precision</span>
                        </div>
                      </th>
                      <th
                        className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestQualitySort("recall")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={qualitySortConfig?.key === "recall"}
                            direction={qualitySortConfig?.direction}
                          />
                          <span>Recall</span>
                        </div>
                      </th>
                      <th
                        className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestQualitySort("f1_score")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={qualitySortConfig?.key === "f1_score"}
                            direction={qualitySortConfig?.direction}
                          />
                          <span>F1 Score</span>
                        </div>
                      </th>
                      <th
                        className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                        onClick={() => requestQualitySort("relevant_retrieved")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <SortIcon
                            active={qualitySortConfig?.key === "relevant_retrieved"}
                            direction={qualitySortConfig?.direction}
                          />
                          <span>Retrieved</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQualityResults.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td
                          className="p-3 max-w-[300px] truncate"
                          title={item.query}
                        >
                          {item.query}
                        </td>
                        <td
                          className={cn(
                            "p-3 text-right font-mono",
                            item.precision === 1.0 && "text-emerald-500"
                          )}
                        >
                          <FormatPercent value={item.precision} />
                        </td>
                        <td
                          className={cn(
                            "p-3 text-right font-mono",
                            item.recall === 1.0 && "text-emerald-500"
                          )}
                        >
                          <FormatPercent value={item.recall} />
                        </td>
                        <td
                          className={cn(
                            "p-3 text-right font-mono",
                            item.f1_score === 1.0 && "text-emerald-500"
                          )}
                        >
                          <FormatPercent value={item.f1_score} />
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {item.relevant_retrieved}/{item.total_retrieved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="pt-8 border-t">
        <p className="text-center text-muted-foreground text-sm">
          Benchmark conducted on{" "}
          {new Date(metadata.benchmark_date).toLocaleString()} • {metadata.num_queries}{" "}
          queries across {databases.length} databases
        </p>
      </div>
    </div>
  );
}
