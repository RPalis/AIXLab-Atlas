import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sun, 
  Moon, 
  RotateCcw, 
  BookOpen, 
  Network, 
  UserCheck, 
  Search,
  Bell
} from 'lucide-react';

export interface PrototypeUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const DEMO_PERSONAS: PrototypeUser[] = [
  { id: '1', name: 'Sarah Chen', role: 'Senior Advisor', avatar: 'SC' },
  { id: '2', name: 'Marcus Vance', role: 'Compliance Officer', avatar: 'MV' },
  { id: '3', name: 'Elena Rostova', role: 'Tech Intake Admin', avatar: 'ER' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [currentPersona, setCurrentPersona] = useState<PrototypeUser>(DEMO_PERSONAS[0]);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleResetData = () => {
    if (window.confirm('Reset all prototype mock data to default seed state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-surface-border bg-surface px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
            <div className="w-8 h-8 rounded-lg bg-action-primary text-white flex items-center justify-center font-black">
              P
            </div>
            <span>Prototype App</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-info/15 text-status-info-text border border-status-info/30">
            UX Prototype
          </span>
        </div>

        {/* Prototype Tools & Persona Controls */}
        <div className="flex items-center gap-3">
          {/* Prototype Tools Menu */}
          <div className="flex items-center bg-surface-hover rounded-lg p-1 border border-surface-border text-xs">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded hover:bg-surface text-secondary hover:text-primary transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-status-warning-text" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsStorybookOpen(true)}
              className="p-1.5 rounded hover:bg-surface text-secondary hover:text-primary transition-colors flex items-center gap-1"
              title="Open Embedded Storybook"
            >
              <BookOpen className="w-4 h-4 text-action-primary" />
              <span className="hidden md:inline font-medium">Storybook</span>
            </button>
            <button 
              onClick={() => setIsGraphOpen(true)}
              className="p-1.5 rounded hover:bg-surface text-secondary hover:text-primary transition-colors flex items-center gap-1"
              title="View UX Architecture Graph"
            >
              <Network className="w-4 h-4 text-brand" />
              <span className="hidden md:inline font-medium">UX Map</span>
            </button>
            <button 
              onClick={handleResetData}
              className="p-1.5 rounded hover:bg-surface text-secondary hover:text-status-error-text transition-colors flex items-center gap-1"
              title="Reset Mock Data"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline font-medium">Reset</span>
            </button>
          </div>

          {/* Persona Switcher */}
          <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
            <select
              value={currentPersona.id}
              onChange={(e) => {
                const found = DEMO_PERSONAS.find(p => p.id === e.target.value);
                if (found) setCurrentPersona(found);
              }}
              className="text-xs bg-surface border border-surface-border rounded-lg px-2.5 py-1.5 font-medium text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              {DEMO_PERSONAS.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
              ))}
            </select>
            <div className="w-8 h-8 rounded-full bg-action-primary/20 text-action-primary border border-action-primary/40 font-bold text-xs flex items-center justify-center">
              {currentPersona.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      {/* Storybook Embed Modal */}
      {isStorybookOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-surface border border-surface-border w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5 text-action-primary" />
                Embedded Storybook Design System
              </h3>
              <button 
                onClick={() => setIsStorybookOpen(false)}
                className="px-3 py-1 text-sm bg-surface-hover rounded-lg text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>
            <iframe src="/storybook/index.html" className="flex-1 w-full h-full border-none" title="Storybook" />
          </div>
        </div>
      )}
    </div>
  );
}
