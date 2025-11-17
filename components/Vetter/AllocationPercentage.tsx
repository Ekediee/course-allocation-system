import { Card } from "@/components/ui/card";
import MultiSegmentDonutChart from "./MultiSegmentDonutChart";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/ContextProvider";
import { MetricType } from "./VetterStats";
import { useQuery } from "@tanstack/react-query";
import { Segment } from "next/dist/server/app-render/types";

const AllocationPercentage = () => {
  const {
    fetchAllocatationMetrics
  } = useAppContext()

  const { data: metrics, isLoading: metricsLoading } = useQuery<MetricType>({
    queryKey: ['metrics'],
    queryFn: fetchAllocatationMetrics,
  });
  
  // const data = [
  //   { percentage: metrics?.compliance_score, color: "#2c8d4fff" }, // Completed - Blue 500
  //   { percentage: metrics?.not_started_rate, color: "#e84c4cff" }, // Not Started - Violet 400
  //   { percentage: metrics?.in_progress_rate, color: "#2868ceff" }, // Inprogress - Indigo 500
  // ];
  // if (metricsLoading) {
  //   return (
  //     <Card className="p-4 h-full">
  //       {/* lightweight loading state */}
  //       <div className="h-64 flex items-center justify-center">Loading...</div>
  //     </Card>
  //   );
  // }

  const data: Segment[] = [
    { percentage: Number(metrics?.compliance_score ?? 0), color: "#2c8d4fff" },
    { percentage: Number(metrics?.not_started_rate ?? 0), color: "#e84c4cff" },
    { percentage: Number(metrics?.in_progress_rate ?? 0), color: "#2868ceff" },
  ];

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Allocations</h3>
        </div>
        {/* <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="First Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first">First Semester</SelectItem>
            <SelectItem value="second">Second Semester</SelectItem>
            <SelectItem value="summer">Summer Semester</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <h4 className="text-md font-semibold mb-4">Allocations by percentage</h4>

      <div className="flex flex-col items-center mt-[50px] space-y-4">
        <MultiSegmentDonutChart data={data} size={250} strokeWidth={50} />
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>In progress</span>
            </div>
            <span>{metrics?.in_progress_rate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
              <span>Not Started</span>
            </div>
            <span>{metrics?.not_started_rate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
              <span>Completed</span>
            </div>
            <span>{metrics?.compliance_score}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AllocationPercentage;
