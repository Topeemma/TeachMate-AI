import React from 'react';
import { ReviewStatus } from '../types';

interface SectionCardProps {
  id: string;
  title: string;
  icon: string;
  status: ReviewStatus;
  isActive: boolean;
  onClick: () => void;
  badgeText?: string;
  badgeBg?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  icon,
  status,
  isActive,
  onClick,
  badgeText,
  badgeBg = 'bg-purple-100 text-primary-purple',
}) => {
  const isApproved = status === 'approved';

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-4 shadow-xs relative flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.02] ${
        isActive
          ? 'bg-white border-2 border-bright-orange shadow-md ring-2 ring-orange-500/20'
          : isApproved
          ? 'bg-white border-2 border-primary-purple shadow-xs'
          : 'bg-white border border-orange-200 shadow-xs hover:border-orange-300'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${badgeBg}`}>
          {icon}
        </div>
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isApproved ? 'bg-bright-orange text-white' : 'bg-orange-100 text-bright-orange'
          }`}
        >
          {badgeText || (isApproved ? 'APPROVED' : 'REVIEW')}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-bold text-deep-purple group-hover:text-bright-orange transition-colors">
          {title}
        </h3>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {isApproved ? 'Ready for export' : 'Needs teacher review'}
        </p>
      </div>
    </div>
  );
};
