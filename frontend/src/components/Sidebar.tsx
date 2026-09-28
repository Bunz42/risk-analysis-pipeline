"use client";

import { useState } from "react";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
        active: true,
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r transition-all duration-300 ${collapsed ? "w-[52px]" : "w-[200px]"
                }`}
            style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Logo */}
            <div
                className="flex h-14 items-center justify-between px-3 border-b"
                style={{ borderColor: "var(--color-border)" }}
            >
                {!collapsed && (
                    <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                        Insight<span style={{ color: "var(--color-accent-red)" }}>Forge</span>
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-md p-1.5 transition-colors hover:bg-[var(--color-surface-2)]"
                    style={{ color: "var(--color-text-tertiary)" }}
                >
                    <svg
                        className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-0.5 px-2 py-3">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors"
                        style={{
                            backgroundColor: item.active ? "var(--color-surface-2)" : "transparent",
                            color: item.active ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                        }}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="border-t px-3 py-3" style={{ borderColor: "var(--color-border)" }}>
                    <div
                        className="rounded-md px-2.5 py-2"
                        style={{ backgroundColor: "var(--color-surface-2)" }}
                    >
                        <p className="text-[11px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                            Environment
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                            <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: "var(--color-accent-green)" }}
                            />
                            Mock Data
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
