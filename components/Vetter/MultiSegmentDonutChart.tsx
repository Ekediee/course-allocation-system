import React from 'react';

interface Segment {
  percentage: number;
  color: string;
}

interface MultiSegmentDonutChartProps {
  data: Segment[];
  size?: number;
  strokeWidth?: number;
}

const MultiSegmentDonutChart: React.FC<MultiSegmentDonutChartProps> = ({
  data,
  size = 150,
  strokeWidth = 20,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentDashOffset = 0; // This will accumulate the length of previous segments

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle to ensure full circle is drawn if percentages don't add up to 100 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // Light gray background
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {data.map((segment, index) => {
          const segmentLength = (segment.percentage / 100) * circumference;
          // The dasharray defines the length of the stroke and the gap
          // The dashoffset shifts the start point of the dasharray
          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const dashOffset = currentDashOffset; // Start where the previous segment ended

          currentDashOffset -= segmentLength; // Accumulate for the next segment

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              style={{
                transition: "stroke-dashoffset 0.3s ease-out", // Optional: add transition
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default MultiSegmentDonutChart;