
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-square bg-slate-200"></div>
      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
          <div className="h-3 w-20 bg-slate-200 rounded"></div>
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="space-y-2">
            <div className="h-2 w-8 bg-slate-100 rounded"></div>
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
