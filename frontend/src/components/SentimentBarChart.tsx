"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const COLORS: Record<string, string> = {
    Positive: "#27c93f",
    Negative: "#ff4c4c",
    Neutral: "#666666",
    Mixed: "#ffbd2e",
};

interface SentimentBarChartProps {
    data: Record<string, number>;
}

export default function SentimentBarChart({ data }: SentimentBarChartProps) {
    const chartData = Object.entries(data).map(([key, value]) => ({
        name: key,
        score: Math.round(value * 100),
        color: COLORS[key] || "#666666",
    }));

    return (
        <div className="card p-5">
            <h3
                className="mb-1 text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
            >
                Average Sentiment Scores
            </h3>
            <p className="mb-4 text-[12px]" style={{ color: "var(--color-text-tertiary)" }}>
                Confidence percentages
            </p>
            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1a1a1a"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={{ stroke: "#2e2e2e" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={{ stroke: "#2e2e2e" }}
                            tickLine={false}
                            domain={[0, 100]}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111111",
                                border: "1px solid #2e2e2e",
                                borderRadius: "8px",
                                color: "#ededed",
                                fontSize: "12px",
                                padding: "8px 12px",
                            }}
                            itemStyle={{ color: "#ededed" }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any) => [`${value}%`, "Score"]}
                            cursor={{ fill: "rgba(255,255,255,0.02)" }}
                        />
                        <Bar
                            dataKey="score"
                            radius={[4, 4, 0, 0]}
                            animationBegin={0}
                            animationDuration={600}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
