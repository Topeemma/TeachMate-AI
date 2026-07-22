import React, { useState } from 'react';
import { AudioPodcastSection } from '../types';
import { Play, Pause, Mic, CheckCircle, Volume2, MessageSquare, Download } from 'lucide-react';

interface AudioPodcastPlayerProps {
  audioPodcast?: AudioPodcastSection;
  podcast?: AudioPodcastSection;
  topic?: string;
  onToggleApproval?: () => void;
}

export const AudioPodcastPlayer: React.FC<AudioPodcastPlayerProps> = ({
  audioPodcast: audioPodcastProp,
  podcast,
  topic,
  onToggleApproval,
}) => {
  const audioPodcast = audioPodcastProp || podcast;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  if (!audioPodcast) {
    return (
      <div className="bg-white rounded-3xl p-5 border-2 border-teal-500 shadow-sm text-center text-gray-500 text-xs">
        Audio podcast section not available.
      </div>
    );
  }

  const isApproved = audioPodcast.status === 'approved';

  const toggleSpeechPlayback = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const textToSpeak = (audioPodcast.dialogueScript || [])
          .map((item) => item.line)
          .join(' ');
        const utterance = new SpeechSynthesisUtterance(textToSpeak || `Audio podcast lesson for ${topic || 'topic'}`);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownloadMp3 = () => {
    const text = (audioPodcast.dialogueScript || []).map((i) => i.line).join('\n\n');
    const blob = new Blob([text], { type: 'audio/mpeg;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TeachMate_${(audioPodcast.title || 'Audio_Podcast').replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-teal-500 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold">
            🎧
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-950">2-Voice Audio Podcast</h3>
            <p className="text-[10px] text-gray-500">NotebookLM Classroom Dialogue</p>
          </div>
        </div>

        <button
          onClick={() => onToggleApproval?.()}
          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
            isApproved ? 'bg-teal-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
          }`}
        >
          {isApproved ? 'APPROVED' : 'APPROVE AUDIO'}
        </button>
      </div>

      <div className="bg-teal-900 text-white rounded-2xl p-4 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeechPlayback}
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div>
              <span className="font-bold text-xs text-white block">{audioPodcast.title}</span>
              <span className="text-[10px] text-teal-200">AI-Generated Educational Discussion (Voice A & Voice B)</span>
            </div>
          </div>
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-orange-400 animate-pulse' : 'text-teal-400'}`} />
        </div>

        {/* AI Disclosure Notice */}
        <div className="bg-teal-950/60 p-2 rounded-xl text-[10px] text-teal-300 italic border border-teal-800">
          Note: This is an AI-generated educational audio discussion, not a real recording.
        </div>

        {/* Audio Waveform Effect */}
        <div className="flex items-center justify-center gap-1 h-8 bg-teal-950/80 rounded-xl p-2 border border-teal-800">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-orange-400 transition-all duration-300 ${
                isPlaying ? 'animate-bounce' : 'h-2 opacity-50'
              }`}
              style={{
                height: isPlaying ? `${Math.floor(Math.random() * 20) + 6}px` : '8px',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] text-teal-300 pt-1 flex-wrap gap-2">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1 text-orange-300 hover:underline cursor-pointer"
          >
            <MessageSquare className="w-3 h-3" />
            <span>{showTranscript ? 'Hide Dialogue Transcript' : 'View Dialogue Transcript'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMp3}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg font-bold cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download MP3 Audio</span>
            </button>
            <span>~2 Min Duration</span>
          </div>
        </div>

        {/* Dialogue Script Transcript Drawer */}
        {showTranscript && (
          <div className="bg-teal-950 p-3 rounded-xl border border-teal-800 space-y-2 text-[11px] max-h-40 overflow-y-auto">
            {audioPodcast.dialogueScript?.map((line, idx) => (
              <div key={idx} className="space-y-0.5">
                <span
                  className={`font-bold block text-[10px] ${
                    line.speaker === 'Voice A (Educator)' ? 'text-orange-300' : 'text-teal-300'
                  }`}
                >
                  {line.speaker}:
                </span>
                <p className="text-teal-100">{line.line}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
