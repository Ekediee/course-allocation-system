import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ComplianceScore = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">HOD Compliance Score</h3>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm">Average</p>
        <p className="text-sm font-medium">78%</p>
      </div>
      <Progress value={78} className="w-full " />
    </Card>
  );
};

export default ComplianceScore;
