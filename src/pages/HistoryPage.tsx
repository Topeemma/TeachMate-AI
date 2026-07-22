import React, { useState } from 'react';
import { FullLessonPackage, GradeLevel, SubjectName } from '../types';
import { BookOpen, Search, Trash2, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  historyList: FullLessonPackage[];
  onSelectPackage: (pkg: FullLessonPackage) => void;
  onDeletePackage: (id: string) => void;
}

export const HistoryPage: React.FC<Props> = ({ historyList, onSelectPackage, onDeletePackage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const filteredList = historyList.filter((pkg) => {
    const matchesSearch = pkg.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || pkg.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || pkg.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-deep-purple">Lesson Package History</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Access, inspect, and export all generated NERDC lesson packages stored in this session.
            </p>
          </div>
          <span className="text-xs font-bold bg-purple-100 text-primary-purple px-3 py-1 rounded-full self-start sm:self-auto">
            {historyList.length} Saved Packages
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic name..."
              className="w-full pl-9 pr-3 h-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-purple focus:outline-none"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark-text"
          >
            <option value="All">All Grade Levels</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark-text"
          >
            <option value="All">All Subject Areas</option>
            <option value="Basic Science & Technology">Basic Science & Technology</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English Studies">English Studies</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Civic Education">Civic Education</option>
          </select>
        </div>
      </div>

      {/* Package List Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">No Lesson Packages Found</h3>
          <p className="text-xs text-gray-500">
            Generate a new lesson note in the Workspace or adjust your search filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-purple-100 text-primary-purple px-2.5 py-0.5 rounded-full">
                    {pkg.subject}
                  </span>
                  <span className="text-[11px] font-bold bg-orange-100 text-bright-orange px-2 py-0.5 rounded-full">
                    {pkg.grade}
                  </span>
                </div>

                <h3 className="font-bold text-deep-purple text-base leading-snug">{pkg.topic}</h3>

                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(pkg.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{pkg.durationMinutes} Mins</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="px-4 py-2 bg-primary-purple hover:bg-deep-purple text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </button>

                <button
                  onClick={() => onDeletePackage(pkg.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
