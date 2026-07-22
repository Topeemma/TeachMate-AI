import React from 'react';
import { Home, Edit3, Layout, History, Settings, Sparkles, Download, Calendar } from 'lucide-react';

export type ActiveScreen = 'landing' | 'workspace' | 'studio' | 'history' | 'dashboard' | 'settings';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  hasActiveLesson: boolean;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  hasActiveLesson,
  onOpenExport,
}) => {
  const navItems: Array<{ id: ActiveScreen; label: string; icon: React.ElementType }> = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'workspace', label: 'Workspace', icon: Edit3 },
    { id: 'dashboard', label: 'Teacher Dashboard', icon: Calendar },
    { id: 'studio', label: 'Review Studio', icon: Layout },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-deep-slate text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 bg-bright-orange rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            <img
              src="/src/assets/images/teachmate_logo_1784714143045.jpg"
              alt="TeachMate AI Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-white font-black text-lg">TM</span>
          </div>

          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
              <span>TEACHMATE AI</span>
              <span className="text-teal-300 text-xs font-normal hidden lg:inline">
                | Primary School Teacher Assistant
              </span>
            </h1>
            <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
              NERDC Primary Curriculum AI Studio (Grades 1-6)
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-bright-orange text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Export */}
        <div className="flex items-center gap-2">
          {hasActiveLesson && (
            <button
              onClick={onOpenExport}
              className="px-3.5 py-2 bg-bright-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Lesson</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('workspace')}
            className="px-3.5 py-2 bg-primary-teal hover:bg-teal-700 text-white font-bold text-xs rounded-xl border border-teal-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>New Lesson</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden bg-deep-slate border-t border-slate-800 flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-all min-w-[56px] cursor-pointer ${
                isActive ? 'text-bright-orange' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
