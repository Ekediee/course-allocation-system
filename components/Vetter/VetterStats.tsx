import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Hourglass, XCircle, CheckCircle, FileText, Users, Blocks } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/ContextProvider";
import { useQuery } from "@tanstack/react-query";

export type MetricType = {
    id: number,
    name: string,
    total_allocated_course_groups: number,
    number_of_pushed_allocation: number,
    allocated_courses: number,
    allocation_in_progress: number,
    allocation_submitted: number,
    allocation_not_started: number,
    compliance_score: number,
    in_progress_rate: number,
    not_started_rate: number
}

const VetterStats = () => {
    const {
        fetchAllocatationMetrics
    } = useAppContext()

    const { data: metrics, isLoading: metricsLoading } = useQuery<MetricType>({
        queryKey: ['metrics'],
        queryFn: fetchAllocatationMetrics,
    });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="bg-green-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">HOD Compliance Score</p>
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Average</p>
                <p className="text-sm font-medium">{metrics?.compliance_score}%</p>
            </div>
            <Progress value={metrics?.compliance_score} className="w-full " />
            </CardContent>
        </Card>

        <Card className="bg-red-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Allocations in Progress</p>
                <Hourglass className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{metrics?.allocation_in_progress}</p>
            </CardContent>
        </Card>

        <Card className="bg-blue-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Allocations not Started</p>
                <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-800" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{metrics?.allocation_not_started}</p>
            </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Allocations Completed</p>
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{metrics?.allocation_submitted}</p>
            </CardContent>
        </Card>
        
    </div>
  );
};

export default VetterStats;
