export const EmptyFolderIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Folder back */}
    <rect x="10" y="35" width="80" height="45" rx="6" fill="#DCE6F9" />
    {/* Folder tab */}
    <path
      d="M10 35 L30 20 H50 L60 35 H10 Z"
      fill="#A6C8FF"
    />
    {/* Folder outline */}
    <rect x="10" y="35" width="80" height="45" rx="6" stroke="#90B4E8" strokeWidth="2" />
    
    {/* Empty badge circle */}
    <circle cx="50" cy="60" r="12" fill="#3B82F6" />
    {/* Badge number */}
    <text
      x="50"
      y="64"
      textAnchor="middle"
      fill="white"
      fontSize="12"
      fontWeight="bold"
    >
      0
    </text>

    {/* Floating paper illustration */}
    <rect x="45" y="20" width="10" height="14" rx="1" fill="#E0EDFF" transform="rotate(-15 45 20)" />
    <path d="M48 21 H52 M48 24 H52 M48 27 H52" stroke="#90B4E8" strokeWidth="0.5" />

    {/* Sparkle/star */}
    <path
      d="M70 25 L72 30 L77 32 L72 34 L70 39 L68 34 L63 32 L68 30 L70 25"
      fill="#C7DBFF"
    />
  </svg>
);
