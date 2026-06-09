"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button variant="outline" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun aria-hidden="true" className="h-3.5 w-3.5 rotate-0 scale-100 transition-transform motion-reduce:transition-none dark:-rotate-90 dark:scale-0" />
            <Moon aria-hidden="true" className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-transform motion-reduce:transition-none dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

// Theme toggle styled to match the floating sidebar's tab buttons
// (same size / round shape / ghost treatment), with optional reveal styling.
export function SidebarThemeToggle({
    className,
    style,
}: {
    className?: string
    style?: React.CSSProperties
}) {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
            style={style}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,opacity,transform] duration-200 ease-out hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset motion-reduce:transition-none",
                className
            )}
        >
            <Sun aria-hidden="true" className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 motion-reduce:transition-none dark:-rotate-90 dark:scale-0" />
            <Moon aria-hidden="true" className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 motion-reduce:transition-none dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
