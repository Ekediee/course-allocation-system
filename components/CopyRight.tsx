import React from 'react'

const CopyRight = () => {
  return (
    <>
        <div className="mt-12 text-center text-sm text-gray-500">
          {'© '} {new Date().getFullYear()} Directorate of Academic Planning
        </div>
    </>
  )
}

export default CopyRight