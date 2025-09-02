import React from 'react'
import AdminManagementModal from './AdminManagementModal'
import { FolderOpen } from 'lucide-react'

type EmptyPageProps = {
    title: string,
    desc: string,
    btnName: string,
    onAddUser?: () => void;
}

const EmptyPage: React.FC<EmptyPageProps> = ({title, desc, btnName, onAddUser}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-4 py-16 px-4 bg-blue-100 h-[510px] rounded-3xl">
        <FolderOpen className="h-16 w-16 text-gray-400" />
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="text-gray-500 mt-2">{desc}</p>
        <div className="mt-6">
            <AdminManagementModal btnName={btnName} onAddUser={onAddUser} />
        </div>
    </div>
  )
}

export default EmptyPage;