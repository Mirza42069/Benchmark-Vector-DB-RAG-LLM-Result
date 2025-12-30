"use client";

import React, { useState } from "react";
import benchmarkData from "../benchmark_full_20251230_223258.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Trophy, Timer, CheckCircle, Database, ChevronDown, ChevronUp } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";


// Types derived from the JSON structure
type BenchmarkData = typeof benchmarkData;

export function BenchmarkDashboard() {
    const { metadata, summary, winner, raw_results } = benchmarkData;
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDb, setFilterDb] = useState<string>("all");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    // Filter and Sort Logic
    const filteredResults = React.useMemo(() => {
        return raw_results.filter((result) => {
            const matchesSearch = result.query.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDb = filterDb === "all" || result.database === filterDb;
            return matchesSearch && matchesDb;
        });
    }, [searchTerm, filterDb, raw_results]);

    const sortedResults = React.useMemo(() => {
        if (!sortConfig) return filteredResults;
        return [...filteredResults].sort((a, b) => {
            // @ts-ignore
            const aValue = a[sortConfig.key];
            // @ts-ignore
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });
    }, [filteredResults, sortConfig]);

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const FormatMs = ({ ms }: { ms: number }) => (
        <span className="font-mono tabular-nums text-sm">
            {ms.toFixed(2)}ms
        </span>
    );

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-12 font-sans">

            {/* Header Section */}
            <div className="space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Benchmark Results
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Performance analysis of RAG pipeline across vector databases.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <Badge variant="outline" className="px-3 py-1 text-sm">
                                {new Date(metadata.benchmark_date).toLocaleDateString()}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">{metadata.llm_model}</Badge>
                            <Badge variant="secondary" className="text-xs">{metadata.embedding_model}</Badge>
                        </div>
                    </div>

                </div>
                <Separator className="my-6" />
            </div>

            {/* Winner Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3 border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Trophy className="w-64 h-64 text-primary" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <Trophy className="w-5 h-5" />
                            <span>OVERALL WINNER</span>
                        </div>
                        <CardTitle className="text-3xl md:text-4xl">{winner.database}</CardTitle>
                        <CardDescription className="text-lg text-primary/80 font-medium">
                            Outperformed competitors with {winner.speed_improvement_percent}% faster speeds and avg retrieval of {winner.avg_retrieval_ms}ms.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Summary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summary.map((db) => (
                    <Card key={db.database} className={cn(
                        "border transition-all hover:shadow-lg",
                        db.database === winner.database ? "border-primary shadow-md" : "border-border"
                    )}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Database className="w-4 h-4 text-muted-foreground" />
                                    {db.database}
                                </CardTitle>
                                {db.database === winner.database && <Badge>Winner</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1"><Timer className="w-3 h-3" /> Mean Total</span>
                                        <span className="font-semibold"><FormatMs ms={db.mean_total_ms} /></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                db.database === winner.database ? "bg-primary" : "bg-muted-foreground/30"
                                            )}
                                            style={{ width: `${(Math.min(...summary.map(s => s.mean_total_ms)) / db.mean_total_ms) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Retrieval</span>
                                        <div className="font-medium text-sm"><FormatMs ms={db.mean_retrieval_ms} /></div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">LLM Gen</span>
                                        <div className="font-medium text-sm"><FormatMs ms={db.mean_llm_ms} /></div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-muted-foreground flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Success Rate</span>
                                    <span className="text-primary">{((parseInt(db.successful_queries) / db.total_queries) * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </CardContent>

                    </Card>
                ))}
            </div>

            {/* Detailed Analysis Section */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Detailed Results</h2>
                        <p className="text-muted-foreground text-sm">Explore individual query performance.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search queries..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterDb} onValueChange={setFilterDb}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Database" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Databases</SelectItem>
                                {summary.map(s => (
                                    <SelectItem key={s.database} value={s.database}>{s.database}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <div className="relative w-full overflow-auto max-h-[600px]">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b sticky top-0 bg-secondary/90 backdrop-blur z-10">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => requestSort('query_num')}>
                                        # {sortConfig?.key === 'query_num' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => requestSort('query')}>
                                        Query {sortConfig?.key === 'query' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => requestSort('database')}>
                                        Database {sortConfig?.key === 'database' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('retrieval_time')}>
                                        Retrieval {sortConfig?.key === 'retrieval_time' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('llm_time')}>
                                        Gen Time {sortConfig?.key === 'llm_time' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('total_time')}>
                                        Total {sortConfig?.key === 'total_time' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {sortedResults.map((row, i) => (
                                    <tr key={`${row.query_num}-${row.database}`} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{row.query_num}</td>
                                        <td className="p-4 align-middle max-w-[300px] truncate" title={row.query}>{row.query}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="secondary" className="font-normal">{row.database}</Badge>
                                        </td>
                                        <td className="p-4 align-middle text-right"><FormatMs ms={row.retrieval_time} /></td>
                                        <td className="p-4 align-middle text-right"><FormatMs ms={row.llm_time} /></td>
                                        <td className="p-4 align-middle text-right font-semibold"><FormatMs ms={row.total_time} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sortedResults.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground">
                                No results found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
