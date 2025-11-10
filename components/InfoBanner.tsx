import React from 'react'

// A small, reusable component for displaying messages
const InfoBanner = ({ message, color = 'yellow' }: { message: string, color?: 'yellow' | 'orange' }) => {
  const colorClasses = {
    yellow: "bg-yellow-100 border-yellow-500 text-yellow-700",
    orange: "bg-orange-100 border-orange-500 text-orange-700",
  };

  return (
    <div className={`mb-6 p-4 border-l-4 ${colorClasses[color]}`}>
      <p>{message}</p>
    </div>
  );
};

export default InfoBanner

