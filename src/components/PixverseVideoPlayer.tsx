import React, { useState } from 'react';
import { VideoResourcesSection } from '../types';
import { Play, Pause, Film, CheckCircle, RefreshCw } from 'lucide-react';

interface PixverseVideoPlayerProps {
  videoResources?: VideoResourcesSection;
  topicTitle?: string;
  onToggleApproval?: () => void;
}

export const PixverseVideoPlayer: React.FC<PixverseVideoPlayerProps> = ({
  videoResources,
  topicTitle = 'Lesson Topic',
  onToggleApproval,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoResources) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-orange-200 shadow-sm text-center text-gray-500 text-xs">
        Video resources section not available.
      </div>
    );
  }

  const isApproved = videoResources.status === 'approved';

  return (
    <div className="bg-white rounded-3xl p-5 border border-orange-200 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 text-red-700 rounded-xl flex items-center justify-center font-bold">
            🎬
          </div>
          <div>
            <h3 className="text-sm font-bold text-deep-purple">15s Pixverse Topic Video</h3>
            <p className="text-[10px] text-gray-500">Visual Lesson Intro Animation</p>
          </div>
        </div>

        <button
          onClick={() => onToggleApproval?.()}
          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
            isApproved ? 'bg-bright-orange text-white' : 'bg-orange-100 text-bright-orange hover:bg-orange-200'
          }`}
        >
          {isApproved ? 'APPROVED' : 'APPROVE VIDEO'}
        </button>
      </div>

      <div className="bg-[#201A2B] rounded-2xl overflow-hidden relative border border-purple-900 aspect-video flex flex-col items-center justify-center group shadow-inner">
        {/* Animated Video Stream Banner or SVG Player */}
        <img
          src={videoResources.pixverse15sVideoUrl || `/api/sample-video-stream?topic=${encodeURIComponent(topicTitle)}`}
          alt="15s Pixverse Lesson Video"
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />

        {/* Play/Pause Overlay Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bg-bright-orange hover:bg-orange-600 text-white p-3.5 rounded-full shadow-xl transform transition-transform group-hover:scale-110 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>

        <div className="absolute bottom-2 left-2 right-2 bg-[#201A2B]/80 backdrop-blur-xs p-2 rounded-xl text-[10px] text-white flex justify-between items-center border border-white/10">
          <span className="font-bold text-orange-300">Pixverse v2 • 15 Seconds</span>
          <span className="bg-purple-900 text-purple-100 px-2 py-0.5 rounded font-mono">00:15 / 00:15</span>
        </div>
      </div>

      {/* YouTube Links Footer */}
      <div className="text-[11px] bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-purple-950 space-y-1">
        <span className="font-bold text-deep-purple block">Curated Educational YouTube Links:</span>
        {videoResources.youtubeLinks?.slice(0, 2).map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-primary-purple hover:text-bright-orange font-medium underline"
          >
            🔗 {link.title} ({link.duration})
          </a>
        ))}
      </div>
    </div>
  );
};
