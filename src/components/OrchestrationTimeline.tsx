import React from 'react';
import { Sparkles, CheckCircle2, Loader2, ShieldCheck, Video, Mic, Languages } from 'lucide-react';

interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
}

interface OrchestrationTimelineProps {
  isOrchestrating: boolean;
  progressPercent: number;
  currentAgentName: string;
}

export const OrchestrationTimeline: React.FC<OrchestrationTimelineProps> = ({
  isOrchestrating,
  progressPercent,
  currentAgentName,
}) => {
  if (!isOrchestrating) return null;

  return (
    <div className="bg-[#3B176B] text-white rounded-3xl p-6 border-2 border-purple-800 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bright-orange text-white rounded-xl flex items-center justify-center font-bold animate-spin">
            ⚙️
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Orchestration Pipeline Active</span>
              <span className="text-[10px] bg-bright-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                20 Agents
              </span>
            </h3>
            <p className="text-xs text-purple-200">
              Active Agent: <span className="font-bold text-orange-300">{currentAgentName || 'Curriculum Retrieval Agent'}</span>
            </p>
          </div>
        </div>
        <span className="text-sm font-extrabold text-orange-300">{progressPercent}%</span>
      </div>

      <div className="w-full bg-[#201A2B] h-3 rounded-full overflow-hidden border border-purple-800">
        <div
          className="bg-bright-orange h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-purple-200 font-medium">
        <div className="flex items-center gap-1.5 bg-purple-900/60 p-2 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-bright-orange shrink-0" />
          <span>NERDC Evidence Verified</span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-900/60 p-2 rounded-lg">
          <Loader2 className="w-3.5 h-3.5 text-orange-300 animate-spin shrink-0" />
          <span>Pedagogy & Quiz Generation</span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-900/60 p-2 rounded-lg">
          <Video className="w-3.5 h-3.5 text-orange-300 shrink-0" />
          <span>Pixverse 15s Video Hook</span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-900/60 p-2 rounded-lg">
          <Mic className="w-3.5 h-3.5 text-orange-300 shrink-0" />
          <span>NotebookLM Audio Podcast</span>
        </div>
      </div>
    </div>
  );
};
