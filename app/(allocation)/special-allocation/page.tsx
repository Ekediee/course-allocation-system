import { EmptyFolderIcon } from "@/components/EmptyFolder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

const SpecialAllocation = () => {
  return (
    <div className="p-6 w-full">
      {/* Mobile header for small screens
      <div className="sm:hidden mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Special Allocation</h2>
        <p className="text-sm text-gray-500">First Semester 24/25:1</p>
      </div> */}

      {/* Stats Card */}
      <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-300 to-blue-100 bg-gradient-to-l from-blue-300 to-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Courses Specially Allocated
              </h3>
              <div className="text-4xl font-bold text-blue-900">0</div>
            </div>

            <Link
              href={{ pathname: "/special-allocation/allocate" }}
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-center">
                <Plus className="h-4 w-4" />
                Allocate courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-blue-100 h-[505px] rounded-3xl">
        {/* <div className="mb-6">
          <div className="relative">
            <div className="w-24 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <div className="w-16 h-12 bg-blue-200 rounded"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              0
            </div>
          </div>
        </div> */}
        <EmptyFolderIcon />
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          List is empty
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Allocate courses to view them here
        </p>
        
        <Link
          href={{ pathname: "/special-allocation/allocate" }}
        >
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Allocate courses
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SpecialAllocation