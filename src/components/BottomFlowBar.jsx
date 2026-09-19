import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import lottie from 'lottie-web';

// Import Lottie JSON files from icons directory
import buildingBlocksJson from '../../icons/building-blocks.json';
import businessVerificationJson from '../../icons/business-verification.json';
import creativeThinkingJson from '../../icons/creative-thinking.json';
import focusLearningJson from '../../icons/focus-learning.json';
import proactiveThinkingJson from '../../icons/proactive-thinking.json';
import scienceDiscoveryJson from '../../icons/science-discovery.json';
import skillBuildingJson from '../../icons/skill-building.json';
import achievementJson from '../../icons/achievement.json';

const FLOW_ITEMS = [
  { id: 'item-1', name: 'Building Blocks', json: buildingBlocksJson },
  { id: 'item-2', name: 'Business Verification', json: businessVerificationJson },
  { id: 'item-3', name: 'Creative Thinking', json: creativeThinkingJson },
  { id: 'item-4', name: 'Focus Learning', json: focusLearningJson },
  { id: 'item-5', name: 'Proactive Thinking', json: proactiveThinkingJson },
  { id: 'item-6', name: 'Science Discovery', json: scienceDiscoveryJson },
  { id: 'item-7', name: 'Skill Building', json: skillBuildingJson },
  { id: 'item-8', name: 'Achievement', json: achievementJson, isAchievement: true }
];

function LottieIcon({ item }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let anim;
    if (containerRef.current) {
      const data = typeof item.json === 'object' && item.json.default ? item.json.default : item.json;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: data
      });
    }
    return () => {
      if (anim) anim.destroy();
    };
  }, [item.json]);

  return (
    <div className="flex items-center justify-center shrink-0 px-3 sm:px-6 py-1">
      <div 
        ref={containerRef} 
        className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
          item.isAchievement ? 'drop-shadow-[0_0_15px_rgba(250,156,22,0.6)] scale-110' : ''
        }`}
      />
    </div>
  );
}

export default function BottomFlowBar() {
  // Duplicate sequence for continuous seamless infinite left-to-right flow
  const marqueeItems = [...FLOW_ITEMS, ...FLOW_ITEMS];

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden relative mb-6 py-2">
      {/* Soft edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Pure Lottie Icons Flow Row (Left-to-Right Continuous Flow) */}
      <div className="flex overflow-hidden w-full items-center">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 22
          }}
          className="flex items-center shrink-0"
        >
          {marqueeItems.map((item, index) => (
            <LottieIcon key={`${item.id}-${index}`} item={item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}




