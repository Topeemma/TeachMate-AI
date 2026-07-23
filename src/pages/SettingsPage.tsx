import React, { useState, useEffect } from 'react';
import { ApiClient, HealthCheckResponse } from '../services/apiClient';
import { Key, Video, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Props {
  onSelectDemo: (topic: string) => void;
}

export const SettingsPage: React.FC<Props> = ({ onSelectDemo }) => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const { showToast } = useToast();

  const fetchHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await ApiClient.getHealth();
      setHealthData(res);
    } catch (err: any) {
      showToast('Health Check Warning', 'Could not fetch backend health metrics.', 'error');
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
        <h2 className="text-xl font-bold text-deep-purple">Settings, Privacy & Safety Studio</h2>
        <p className="text-xs text-gray-500">
          Manage API keys, video providers, NERDC curriculum compliance settings, and demo state switching.
        </p>
      </div>

      {/* Demo State Switcher Block */}
      <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-deep-purple font-bold text-base">
          <Layers className="w-5 h-5 text-bright-orange" />
          <h3>Interactive Demo State Selector</h3>
        </div>
        <p className="text-xs text-gray-600">
          Switch the active application state instantly to review pre-loaded NERDC lesson packages with zero wait time.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => {
              onSelectDemo('Water Cycle');
              showToast('Loaded Demo', 'Loaded Grade 4 Water Cycle Package', 'success');
            }}
            className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-primary-purple border border-purple-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Load Grade 4 Water Cycle
          </button>

          <button
            onClick={() => {
              onSelectDemo('Parts of a Plant');
              showToast('Loaded Demo', 'Loaded Grade 4 Parts of a Plant Package', 'success');
            }}
            className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-bright-orange border border-orange-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Load Grade 4 Parts of a Plant
          </button>
        </div>
      </section>

      {/* API Key Status Indicators */}
      <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-deep-purple font-bold text-base">
            <Key className="w-5 h-5 text-primary-purple" />
            <h3>Secrets & API Provider Status</h3>
          </div>
          <button
            onClick={fetchHealth}
            disabled={loadingHealth}
            className="p-2 text-gray-500 hover:text-primary-purple rounded-lg transition-all cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingHealth ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gemini Status */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-deep-purple">GEMINI_API_KEY</span>
              {healthData?.keys.geminiKeyConfigured ? (
                <span className="flex items-center gap-1 text-[10px] bg-purple-100 text-primary-purple font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-primary-purple" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Unconfigured
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Powers Gemini 3.6 Flash lesson generation, translations, and multi-agent reasoning.
            </p>
          </div>

          {/* Pixverse Status */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-deep-purple">PIXVERSE_API_KEY</span>
              {healthData?.keys.pixverseKeyConfigured ? (
                <span className="flex items-center gap-1 text-[10px] bg-purple-100 text-primary-purple font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-primary-purple" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] bg-orange-100 text-bright-orange font-bold px-2 py-0.5 rounded-full">
                  Canvas Fallback
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Generates 15-second timeboxed topic animations for classrooms.
            </p>
          </div>

          {/* Reserved PADI Video Provider */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-deep-purple">PADI_API_KEY</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                Reserved (Optional)
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Reserved provider for extended multi-minute video generation clips.
            </p>
          </div>
        </div>
      </section>

      {/* Video Provider Settings */}
      <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-deep-purple font-bold text-base">
          <Video className="w-5 h-5 text-bright-orange" />
          <h3>Video Provider Configuration</h3>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span>Primary Video Engine: Pixverse v2</span>
            <span className="text-bright-orange">Max Duration: 15 Seconds</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            In compliance with classroom attention limits and mobile bandwidth constraints across Nigerian primary schools, AI video generation clips are strictly timeboxed to 15 seconds.
          </p>
        </div>
      </section>

      {/* Safety & PII Zero Retention */}
      <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-deep-purple font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-primary-purple" />
          <h3>Privacy, Safety & PII Zero-Retention Guarantee</h3>
        </div>

        <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
          <p>
            • <strong>Zero PII Retention:</strong> No pupil names, addresses, or personal identifiable data are stored or logged.
          </p>
          <p>
            • <strong>Primary School Content Safety:</strong> All generated text, images, and audio pass through an automatic multi-step safety audit to ensure 100% age-appropriate educational value.
          </p>
          <p>
            • <strong>NERDC Curriculum Standard:</strong> Grounded strictly in Nigerian national educational guidelines for Primary 1 to 6.
          </p>
        </div>
      </section>
    </div>
  );
};
