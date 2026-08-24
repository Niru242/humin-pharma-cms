import React from 'react';
import './EmployeeProfileCell.css';

interface EmployeeProfileCellProps {
  firstName: string;
  lastName?: string;
  employeeId?: string;
  subtitle?: React.ReactNode;
  imageUrl?: string | null;
}

const colors = [
  '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', 
  '#2dd4bf', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', 
  '#e879f9', '#f472b6', '#fb7185'
];

const getColorForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const EmployeeProfileCell: React.FC<EmployeeProfileCellProps> = ({
  firstName,
  lastName = '',
  employeeId,
  subtitle,
  imageUrl
}) => {
  const fName = firstName || '';
  const lName = lastName || '';
  const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();
  const fullName = `${fName} ${lName}`.trim();
  const bgColor = getColorForName(fullName);

  return (
    <div className="emp-profile-cell">
      {imageUrl ? (
        <img src={imageUrl} alt={fullName} className="emp-avatar" />
      ) : (
        <div 
          className="emp-avatar" 
          style={{ 
            backgroundColor: bgColor, 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {initials}
        </div>
      )}
      <div>
        <div className="font-semibold">{fName} {lName}</div>
        <div className="text-muted text-xs">{subtitle || employeeId}</div>
      </div>
    </div>
  );
};
