import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

const RequestView = () => {
    const requests = [
        {
          type: "Missing Lecturer",
          message: "Lecturer for COSC 201 cannot be found on the list of lecturers. Name is Agbam Daphne",
          date: "Aug 02"
        },
        {
          type: "Couse not found on List",
          message: "Course COSC 401- introduction to programming cannot be found on the list of courses",
          date: "Aug 02"
        },
        {
          type: "Missing Lecturer",
          message: "Lecturer for COSC 201 cannot be found on the list of lecturers. Name is Agbam Daphne",
          date: "Aug 02"
        },
        {
          type: "Couse not found on List",
          message: "Course COSC 201- introduction to programming cannot be found on the list of courses",
          date: "Aug 02"
        }
      ];

  return (
    <div>
        <Card className="md:h-[550px] overflow-auto">
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3 sticky top-6">
                    <div className="flex items-center">
                        <Inbox className="w-5 h-5 mr-2 text-gray-600" />
                        <h3 className="text-lg font-medium">Requests</h3>
                    </div>
                    <Button variant="outline" className="w-full md:w-auto">
                        New Request
                        <PlusCircle className="w-4 h-4 ml-2" />
                    </Button>
                </div>
                
                <div className="space-y-4">
                {requests.map((request, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                        <p className="font-medium text-sm md:text-base">{request.type}</p>
                        <p className="text-xs md:text-sm text-gray-600">{request.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{request.date}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default RequestView