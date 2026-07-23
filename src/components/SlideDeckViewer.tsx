import React, { useState } from 'react';
import { SlideDeckSection } from '../types';
import { ChevronLeft, ChevronRight, Presentation, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface SlideDeckViewerProps {
  slideDeck?: SlideDeckSection;
  onToggleApproval?: () => void;
}

export const SlideDeckViewer: React.FC<SlideDeckViewerProps> = ({ slideDeck, onToggleApproval }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!slideDeck) {
    return (
      <div className="bg-white rounded-3xl p-5 border-2 border-primary-purple shadow-sm text-center text-gray-500 text-xs">
        Slide deck section not available.
      </div>
    );
  }

  const isApproved = slideDeck.status === 'approved';
  const slides = slideDeck.slides || [];
  const activeSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-primary-purple shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 text-primary-purple rounded-xl flex items-center justify-center font-bold">
            🎨
          </div>
          <div>
            <h3 className="text-sm font-bold text-deep-purple">PowerPoint Slide Deck</h3>
            <p className="text-[10px] text-gray-500">6 Interactive Lesson Slides</p>
          </div>
        </div>

        <button
          onClick={() => onToggleApproval?.()}
          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
            isApproved ? 'bg-bright-orange text-white' : 'bg-orange-100 text-bright-orange hover:bg-orange-200'
          }`}
        >
          {isApproved ? 'APPROVED' : 'APPROVE PPT'}
        </button>
      </div>

      {activeSlide && (
        <div className="bg-[#3B176B] text-white rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-inner relative overflow-hidden">
          {/* Slide Header */}
          <div className="flex items-center justify-between border-b border-purple-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-orange-300">
              Slide {activeSlide.slideNumber} of {slides.length}
            </span>
            <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-bold">
              16:9 Presentation
            </span>
          </div>

          {/* Slide Content */}
          <div className="my-3">
            <h4 className="text-sm font-black text-white mb-2 leading-tight">{activeSlide.title}</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-purple-100">
              {activeSlide.bulletPoints?.map((bp, i) => (
                <li key={i}>{bp}</li>
              ))}
            </ul>
          </div>

          {/* AI Image Generation Prompt Preview */}
          <div className="bg-[#201A2B] p-2.5 rounded-xl border border-purple-800 text-[10px] text-orange-200 flex items-start gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-bright-orange shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <span className="font-bold text-white">Visual Prompt:</span> {activeSlide.imagePrompt}
            </p>
          </div>

          {/* Speaker Notes */}
          <p className="text-[10px] text-purple-200 italic mt-2 border-t border-purple-800/60 pt-1.5">
            <span className="font-bold text-orange-300">Teacher Notes:</span> {activeSlide.speakerNotes}
          </p>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-purple-800">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-1 rounded-lg bg-purple-900 text-purple-200 hover:bg-purple-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    currentSlideIndex === idx ? 'bg-bright-orange' : 'bg-purple-900'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1 rounded-lg bg-purple-900 text-purple-200 hover:bg-purple-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
