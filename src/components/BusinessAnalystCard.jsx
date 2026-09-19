import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLms } from '../context/LmsContext';

function CourseCard({ course, index, totalCards, isExpanded }) {
  const [isOpen, setIsOpen] = useState(false);
  const { openEnrollment } = useLms();

  // Dynamic stack & fan rotation for any number of courses
  const centerIndex = (totalCards - 1) / 2;
  const offsetFromCenter = index - centerIndex;
  
  // Dynamic fan rotation bounded between -10 and +10 degrees
  const rotateDeg = totalCards > 1 ? Math.round((offsetFromCenter / Math.max(1, centerIndex)) * 10) : 0;
  const zIndex = index + 1;

  // Stacking offset converges cards directly to the horizontal center
  const xStackPercent = -offsetFromCenter * 100;
  const remSpacing = offsetFromCenter * 0.75;
  const xTransform = totalCards > 1 ? `calc(${xStackPercent}% - ${remSpacing}rem)` : '0%';

  // Dual-tone title splitting
  const titleParts = (() => {
    if (course.title1 && course.title2) {
      return { t1: course.title1, t2: course.title2 };
    }
    const words = (course.title || 'Course Program').trim().split(/\s+/);
    if (words.length === 1) return { t1: words[0], t2: '' };
    const mid = Math.ceil(words.length / 2);
    return {
      t1: words.slice(0, mid).join(' '),
      t2: words.slice(mid).join(' ')
    };
  })();

  const imageUrl = course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80';
  const descriptionText = course.description || course.text || 'Master industry-relevant skills with practical projects and expert mentor guidance.';
  const buttonLabel = course.buttonText || 'Enroll';

  return (
    <motion.div
      animate={
        isExpanded
          ? {
              x: '0%',
              y: '0%',
              rotate: 0,
              scale: 1,
              zIndex: 1
            }
          : {
              x: xTransform,
              y: '0%',
              rotate: rotateDeg,
              scale: 0.96,
              zIndex: zIndex
            }
      }
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 22,
        mass: 0.8
      }}
      className="shrink-0 flex justify-center cursor-pointer"
    >
      <div
        className={`ba-card ${isOpen ? 'is-open' : ''}`}
        tabIndex={0}
        onClick={(e) => {
          if (isExpanded) {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        onTouchStart={(e) => {
          if (isExpanded) {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        title={isExpanded ? 'Hover or tap to toggle details' : 'Move mouse to separate cards'}
      >
        <div className="ba-card__image">
          <img
            src={imageUrl}
            alt={course.title || 'Course Image'}
            loading="lazy"
          />
        </div>

        <h2 className="ba-card__title">
          <span className="t1">{titleParts.t1}</span>
          {titleParts.t2 && <span className="t2">{titleParts.t2}</span>}
        </h2>

        <div className="ba-card__text">
          <p className="line-clamp-3 leading-relaxed font-normal">{descriptionText}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEnrollment(course.redirectCourse || course.title);
            }}
            className="mt-2.5 w-full py-1.5 px-2 rounded-md bg-[#0A317B] hover:bg-[#061e4f] text-white font-extrabold text-[9px] flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BusinessAnalystCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { courses } = useLms();
  const displayCourses = courses && courses.length > 0 ? courses : [];

  return (
    <section 
      onMouseLeave={() => setIsExpanded(false)}
      className="py-14 bg-white text-[#0A317B] relative overflow-hidden transition-colors"
    >
      {/* Scoped CSS for single-line compact cards */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans:wght@400;500;600&display=swap');

        .ba-card-row {
          --pad: 12px;
          --speed: 0.6s;
          --ease: cubic-bezier(.65, .05, .25, 1);
        }

        .ba-card {
          position: relative;
          width: 185px;
          height: 310px;
          border-radius: 14px;
          overflow: hidden;
          background: #ffffff;
          cursor: pointer;
          outline: none;
          border: 1px solid rgba(10, 49, 123, 0.08);
          box-shadow: 0 6px 18px -3px rgba(10, 49, 123, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .ba-card:hover {
          transform: translateY(-4px);
          border-color: rgba(26, 156, 155, 0.3);
          box-shadow: 0 14px 28px -6px rgba(10, 49, 123, 0.18), 0 0 18px rgba(26, 156, 155, 0.12);
        }

        .ba-card__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0;
          overflow: hidden;
          transition:
            top var(--speed) var(--ease),
            left var(--speed) var(--ease),
            width var(--speed) var(--ease),
            height var(--speed) var(--ease),
            border-radius var(--speed) var(--ease);
        }

        .ba-card__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ba-card__image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(20, 25, 40, 0.45);
          transition: opacity var(--speed) var(--ease);
        }

        .ba-card__title {
          position: relative;
          z-index: 2;
          margin: 0;
          padding: 14px var(--pad) 0;
          font-family: "Archivo Black", "Arial Black", sans-serif;
          font-size: 19px;
          line-height: 1.1;
          text-align: left;
        }

        .ba-card__title span {
          display: block;
        }

        .ba-card__title .t1 {
          color: #22d3dd;
        }

        .ba-card__title .t2 {
          color: #f18f01;
        }

        .ba-card__text {
          position: absolute;
          z-index: 2;
          left: var(--pad);
          right: var(--pad);
          top: 155px;
          margin: 0;
          font-family: "Fira Sans", system-ui, sans-serif;
          font-size: 10px;
          line-height: 1.35;
          color: #1a1a1a;
          text-align: left;
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity .4s ease,
            transform .4s ease;
        }

        /* Hover / Focus / Active Open States */
        .ba-card:hover .ba-card__image,
        .ba-card:focus-within .ba-card__image,
        .ba-card.is-open .ba-card__image {
          top: 75px;
          left: var(--pad);
          width: calc(100% - var(--pad) * 2);
          height: 70px;
          border-radius: 8px;
        }

        .ba-card:hover .ba-card__image::after,
        .ba-card:focus-within .ba-card__image::after,
        .ba-card.is-open .ba-card__image::after {
          opacity: 0;
        }

        .ba-card:hover .ba-card__text,
        .ba-card:focus-within .ba-card__text,
        .ba-card.is-open .ba-card__text {
          opacity: 1;
          transform: translateY(0);
          transition-delay: .3s;
        }

        .ba-card:focus-visible {
          box-shadow: 0 0 0 2px #22d3dd;
        }

        /* Custom scrollbar hiding */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A317B] tracking-tight leading-tight">
            Our{' '}
            <span className="bg-gradient-to-r from-[#1A9C9B] to-[#FA9C16] bg-clip-text text-transparent">
              Courses & Programs
            </span>
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed max-w-xl mx-auto font-medium">
            Industry-aligned curriculums engineered with senior mentors from top tech giants.
          </p>
        </div>

        {/* Single Horizontal Line Container */}
        <div 
          onMouseEnter={() => setIsExpanded(true)}
          onMouseMove={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          className="relative ba-card-row min-h-[340px] flex items-center justify-center overflow-x-auto no-scrollbar py-2"
        >
          <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4 min-w-max mx-auto relative px-2">
            {displayCourses.map((course, idx) => (
              <CourseCard 
                key={course.id || idx} 
                course={course} 
                index={idx}
                totalCards={displayCourses.length}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#1A9C9B]" />
            <span>Hover over any card to view description & syllabus</span>
          </div>
        )}

      </div>
    </section>
  );
}


