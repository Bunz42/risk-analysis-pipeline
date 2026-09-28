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
    HIGH: "#ff4c4c",
    MEDIUM: "#ffbd2e",
    LOW: "#27c93f",
};

interface ChurnRiskChartProps {
    data: Record<string, number>;
}

export default function ChurnRiskChart({ data }: ChurnRiskChartProps) {
    const chartData = [
        { name: "High", value: data.HIGH || 0, color: COLORS.HIGH },
        { name: "Medium", value: data.MEDIUM || 0, color: COLORS.MEDIUM },
        { name: "Low", value: data.LOW || 0, color: COLORS.LOW },
    ];

    return (
        <div className="card p-5">
            <h3
                className="mb-1 text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
            >
                Churn Risk Breakdown
            </h3>
            <p className="mb-4 text-[12px]" style={{ color: "var(--color-text-tertiary)" }}>
                Customer risk distribution
            </p>
            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1a1a1a"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={{ stroke: "#2e2e2e" }}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={{ stroke: "#2e2e2e" }}
                            tickLine={false}
                            width={55}
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
                            formatter={(value: any) => [value, "Customers"]}
                            cursor={{ fill: "rgba(255,255,255,0.02)" }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
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
