"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type DonutChartProps = {
  value: number; // 0 to 100
  size?: number; // in px, default is 120
};

const DonutChart = ({ value, size = 120 }: DonutChartProps) => {
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate after mount
        const timeout = setTimeout(() => {
        setProgress(value);
        }, 300);
        return () => clearTimeout(timeout);
    }, [value]);

    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
        <svg
            width={size}
            height={size}
            className="rotate-[-90deg]"
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E5E7EB" // Tailwind's gray-200
                strokeWidth={strokeWidth}
                fill="transparent"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#3B82F6" // Tailwind's blue-500
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: "stroke-dashoffset 1s ease-out",
                }}
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-black">
            {progress}%
        </div>
        </div>
    );
}

export default DonutChart