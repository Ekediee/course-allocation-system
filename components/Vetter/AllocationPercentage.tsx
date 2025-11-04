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

const AllocationPercentage = () => {
  const data = [
    { percentage: 40, color: "#6366F1" }, // Completed - Blue 500
    { percentage: 20, color: "#A78BFA" }, // Not Started - Violet 400
    { percentage: 40, color: "#3B82F6" }, // Inprogress - Indigo 500
  ];

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Allocations</h3>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="First Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first">First Semester</SelectItem>
            <SelectItem value="second">Second Semester</SelectItem>
            <SelectItem value="summer">Summer Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h4 className="text-md font-semibold mb-4">Allocations by percentage</h4>

      <div className="flex flex-col items-center mt-[50px] space-y-4">
        <MultiSegmentDonutChart data={data} size={250} strokeWidth={50} />
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>Inprogress</span>
            </div>
            <span>40%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-violet-400 mr-2"></span>
              <span>Not Started</span>
            </div>
            <span>20%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
              <span>Completed</span>
            </div>
            <span>40%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AllocationPercentage;
