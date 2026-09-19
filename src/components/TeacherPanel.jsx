import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User,
  BookOpen, 
  Sparkles, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  HelpCircle, 
  File, 
  Search, 
  CheckCircle2, 
  BarChart3, 
  GraduationCap, 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Clock, 
  LogOut, 
  FileCode, 
  UploadCloud,
  FolderPlus,
  Eye,
  Layers,
  Cpu,
  Cloud
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function TeacherPanel() {
  const { users, courses, createCourse, deleteCourse, logout, setActiveView, currentUser } = useLms();
  
  const [teacherTab, setTeacherTab] = useState('courses'); // 'courses' | 'analytics'
  const [teacherCourseMode, setTeacherCourseMode] = useState('list'); // 'list' | 'create'
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  const getEnrolledStudents = (courseTitle) => {
    if (!users || !Array.isArray(users)) return [];
    return users.filter(u => {
      if (!u.course) return false;
      const uCourse = u.course.toLowerCase();
      const cTitle = (courseTitle || '').toLowerCase();
      return uCourse.includes(cTitle) || cTitle.includes(uCourse);
    });
  };

  const totalEnrolledStudents = users ? users.filter(u => u.status === 'APPROVED').length : 0;
  const totalTopicPages = courses.reduce((acc, c) => acc + (c.sections ? c.sections.reduce((sAcc, s) => sAcc + (s.items?.length || 0), 0) : 0), 0);

  const getCourseMeta = (course) => {
    const cat = (course.category || '').toLowerCase();
    const title = (course.title || '').toLowerCase();

    if (cat.includes('ai') || cat.includes('data') || title.includes('ai') || title.includes('machine learning')) {
      return {
        categoryLabel: 'AI & DATA',
        categoryBadgeClass: 'bg-[#EDE9FE] text-[#7C3AED]',
        iconBgClass: 'bg-[#6366F1]',
        iconType: 'ai',
        defaultDuration: course.duration || '10 Weeks'
      };
    }
    if (cat.includes('cloud') || cat.includes('devops') || title.includes('cloud') || title.includes('devops')) {
      return {
        categoryLabel: 'CLOUD',
        categoryBadgeClass: 'bg-[#E0F7FA] text-[#0284C7]',
        iconBgClass: 'bg-[#06B6D4]',
        iconType: 'cloud',
        defaultDuration: course.duration || '8 Weeks'
      };
    }
    if (cat.includes('product') || cat.includes('business') || title.includes('product') || title.includes('analyst')) {
      return {
        categoryLabel: 'BUSINESS',
        categoryBadgeClass: 'bg-[#FFF7ED] text-[#EA580C]',
        iconBgClass: 'bg-[#F97316]',
        iconType: 'business',
        defaultDuration: course.duration || '6 Weeks'
      };
    }
    if (cat.includes('design') || title.includes('ui') || title.includes('ux')) {
      return {
        categoryLabel: 'DESIGN',
        categoryBadgeClass: 'bg-[#FDF2F8] text-[#DB2777]',
        iconBgClass: 'bg-[#EC4899]',
        iconType: 'design',
        defaultDuration: course.duration || '6 Weeks'
      };
    }
    return {
      categoryLabel: 'ENGINEERING',
      categoryBadgeClass: 'bg-[#E6F0FD] text-[#2563EB]',
      iconBgClass: 'bg-[#2563EB]',
      iconType: 'code',
      defaultDuration: course.duration || '12 Weeks'
    };
  };

  // Selected item tracking in the 3-column Course Builder
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showCourseMetaModal, setShowCourseMetaModal] = useState(false);
  const [addTopicModalSecIdx, setAddTopicModalSecIdx] = useState(null);
  const [addBlockModalOpen, setAddBlockModalOpen] = useState(false);

  // Form State for Create / Edit Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Product & Business',
    duration: '5 Weeks',
    price: '₹25,000',
    description: '',
    sections: [
      {
        weekNumber: 1,
        title: 'Week 1: Introduction and Fundamentals',
        items: [
          { 
            title: 'Day 1: Course Overview & Setup', 
            contentType: 'video', 
            blocks: [
              {
                id: 'block_init_1',
                type: 'video',
                videoFileName: 'Overview Video Lesson',
                videoBlobUrl: '',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              }
            ],
            articles: 1, 
            mcqs: 0, 
            status: 'Start' 
          },
          { 
            title: 'Day 2: Core Concepts (Article)', 
            contentType: 'notion', 
            blocks: [
              {
                id: 'block_init_2',
                type: 'notion',
                notionDoc: '# Day 2: Core Concepts\n\nAdd lesson notes or markdown content here...'
              }
            ],
            articles: 2, 
            mcqs: 5, 
            status: 'Start' 
          }
        ]
      },
      {
        weekNumber: 2,
        title: 'Week 2: Core Skills & Practice',
        items: [
          { 
            title: 'Day 1: Advanced Workflow & MCQs', 
            contentType: 'quiz', 
            blocks: [
              {
                id: 'block_init_3',
                type: 'quiz',
                quizQuestions: [
                  { question: 'What is the primary goal of product discovery?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0 }
                ]
              }
            ],
            articles: 1, 
            mcqs: 5, 
            status: 'Start' 
          }
        ]
      }
    ]
  });

  // Multi-Block Canvas Helpers
  const getBlocksForItem = (item) => {
    if (!item) return [];
    if (Array.isArray(item.blocks) && item.blocks.length > 0) {
      return item.blocks;
    }
    const type = item.contentType || 'video';
    return [{
      id: 'block_init_' + (item.id || Date.now()),
      type: type,
      videoFileName: item.videoFileName || '',
      videoBlobUrl: item.videoBlobUrl || '',
      notionDoc: item.notionDoc || (type === 'notion' ? '# Study Article\n\nWrite lesson notes here...' : ''),
      quizQuestions: item.quizQuestions || (type === 'quiz' ? [{ question: 'What is the key takeaway?', options: ['Option A', 'Option B'], correctIndex: 0 }] : []),
      resourceFileName: item.resourceFileName || ''
    }];
  };

  const updateTypeForCurrentTopic = (newType) => {
    setCourseForm(prev => {
      const safeSec = Math.min(activeSecIdx, Math.max(0, prev.sections.length - 1));
      const targetSec = prev.sections[safeSec];
      if (!targetSec) return prev;

      const safeItem = Math.min(activeItemIdx, Math.max(0, (targetSec.items?.length || 1) - 1));

      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== safeSec) return sec;
        const updatedItems = (sec.items || []).map((item, iIdx) => {
          if (iIdx !== safeItem) return item;

          const existingBlocks = getBlocksForItem(item);
          let updatedBlocks;

          if (existingBlocks.length <= 1) {
            const firstBlock = existingBlocks[0] || {
              id: 'block_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
            };
            updatedBlocks = [{
              ...firstBlock,
              type: newType,
              notionDoc: firstBlock.notionDoc || (newType === 'notion' ? '# Study Article\n\nWrite lesson notes here...' : ''),
              quizQuestions: (firstBlock.quizQuestions && firstBlock.quizQuestions.length > 0) ? firstBlock.quizQuestions : (newType === 'quiz' ? [{ question: 'What is the key takeaway?', options: ['Option A', 'Option B'], correctIndex: 0 }] : [])
            }];
          } else {
            updatedBlocks = existingBlocks.map((blk, bIdx) => {
              if (bIdx === 0) {
                return {
                  ...blk,
                  type: newType,
                  notionDoc: blk.notionDoc || (newType === 'notion' ? '# Study Article\n\nWrite lesson notes here...' : ''),
                  quizQuestions: (blk.quizQuestions && blk.quizQuestions.length > 0) ? blk.quizQuestions : (newType === 'quiz' ? [{ question: 'What is the key takeaway?', options: ['Option A', 'Option B'], correctIndex: 0 }] : [])
                };
              }
              return blk;
            });
          }

          return {
            ...item,
            contentType: newType,
            blocks: updatedBlocks
          };
        });

        return { ...sec, items: updatedItems };
      });

      return { ...prev, sections: updatedSections };
    });
  };

  const updateBlockInCurrentTopic = (secIdx, itemIdx, blockIdx, updateFn) => {
    setCourseForm(prev => {
      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== secIdx) return sec;
        const updatedItems = (sec.items || []).map((item, iIdx) => {
          if (iIdx !== itemIdx) return item;
          const currentBlocks = getBlocksForItem(item);
          const blocks = currentBlocks.map((blk, bIdx) => {
            if (bIdx !== blockIdx) return blk;
            return updateFn(blk);
          });
          return { ...item, blocks };
        });
        return { ...sec, items: updatedItems };
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const addBlockToCurrentTopic = (blockType, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseForm(prev => {
      const safeSec = Math.min(activeSecIdx, Math.max(0, prev.sections.length - 1));
      const targetSec = prev.sections[safeSec];
      if (!targetSec) return prev;

      const safeItem = Math.min(activeItemIdx, Math.max(0, (targetSec.items?.length || 1) - 1));

      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== safeSec) return sec;
        const updatedItems = (sec.items || []).map((item, iIdx) => {
          if (iIdx !== safeItem) return item;
          const existingBlocks = getBlocksForItem(item);
          const newBlock = {
            id: 'block_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            type: blockType,
            videoFileName: '',
            videoBlobUrl: '',
            notionDoc: blockType === 'notion' ? '# New Article Section\n\nAdd lesson notes or markdown content here...' : '',
            quizQuestions: blockType === 'quiz' ? [{ question: 'Enter your question...', options: ['Option A', 'Option B'], correctIndex: 0 }] : []
          };
          return {
            ...item,
            blocks: [...existingBlocks, newBlock]
          };
        });
        return { ...sec, items: updatedItems };
      });
      return { ...prev, sections: updatedSections };
    });
    setAddBlockModalOpen(false);
  };

  const removeBlockFromCurrentTopic = (blockIdx, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseForm(prev => {
      const safeSec = Math.min(activeSecIdx, Math.max(0, prev.sections.length - 1));
      const targetSec = prev.sections[safeSec];
      if (!targetSec) return prev;

      const safeItem = Math.min(activeItemIdx, Math.max(0, (targetSec.items?.length || 1) - 1));

      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== safeSec) return sec;
        const updatedItems = (sec.items || []).map((item, iIdx) => {
          if (iIdx !== safeItem) return item;
          const existingBlocks = getBlocksForItem(item);
          return {
            ...item,
            blocks: existingBlocks.filter((_, i) => i !== blockIdx)
          };
        });
        return { ...sec, items: updatedItems };
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const handleBlockVideoFileUpload = (secIdx, itemIdx, blockIdx, file) => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    updateBlockInCurrentTopic(secIdx, itemIdx, blockIdx, blk => ({
      ...blk,
      videoFileName: file.name,
      videoBlobUrl: blobUrl
    }));
  };

  const addBlockQuizQuestion = (secIdx, itemIdx, blockIdx) => {
    updateBlockInCurrentTopic(secIdx, itemIdx, blockIdx, blk => ({
      ...blk,
      quizQuestions: [
        ...(blk.quizQuestions || []),
        { question: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0 }
      ]
    }));
  };

  const removeBlockQuizQuestion = (secIdx, itemIdx, blockIdx, qIdx) => {
    updateBlockInCurrentTopic(secIdx, itemIdx, blockIdx, blk => ({
      ...blk,
      quizQuestions: (blk.quizQuestions || []).filter((_, i) => i !== qIdx)
    }));
  };

  const handleBlockFileUpload = (secIdx, itemIdx, blockIdx, file) => {
    if (!file) return;
    updateBlockInCurrentTopic(secIdx, itemIdx, blockIdx, blk => ({
      ...blk,
      resourceFileName: file.name
    }));
  };

  const addSectionFolder = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseForm(prev => {
      const newSecIdx = prev.sections.length;
      const newSection = {
        weekNumber: newSecIdx + 1,
        title: `Week ${newSecIdx + 1}: New Curriculum Module`,
        items: [
          { 
            title: `Day 1: Topic Introduction`, 
            contentType: 'video', 
            videoFileName: '',
            videoBlobUrl: '',
            articles: 1, 
            mcqs: 0, 
            status: 'Start' 
          }
        ]
      };
      return { ...prev, sections: [...prev.sections, newSection] };
    });
    setCourseForm(latest => {
      const newSecIdx = latest.sections.length - 1;
      setActiveSecIdx(Math.max(0, newSecIdx));
      setActiveItemIdx(0);
      return latest;
    });
  };

  const removeSectionFolder = (secIdx, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseForm(prev => {
      const updated = prev.sections.filter((_, i) => i !== secIdx);
      return { ...prev, sections: updated };
    });
    if (activeSecIdx >= secIdx && activeSecIdx > 0) {
      setActiveSecIdx(prev => prev - 1);
    }
  };

  const addTopicItem = (secIdx, contentType = 'video', e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (secIdx === null || secIdx === undefined) return;

    setCourseForm(prev => {
      const targetSec = prev.sections[secIdx];
      if (!targetSec) return prev;

      const itemNum = (targetSec.items?.length || 0) + 1;
      const typeTitles = {
        video: 'Video Lesson',
        notion: 'Study Article',
        quiz: 'Knowledge Quiz',
        file: 'Resource File'
      };
      const initialBlock = {
        id: 'block_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        type: contentType,
        videoFileName: '',
        videoBlobUrl: '',
        notionDoc: contentType === 'notion' ? `# Day ${itemNum}: Study Article\n\n### Overview\nWrite your document notes here...` : '',
        quizQuestions: contentType === 'quiz' ? [{ question: 'Sample Question', options: ['Option A', 'Option B'], correctIndex: 0 }] : []
      };
      const newItem = {
        title: `Day ${itemNum}: ${typeTitles[contentType] || 'Lesson Topic'}`,
        contentType: contentType,
        blocks: [initialBlock],
        articles: 1,
        mcqs: 0,
        status: 'Start'
      };

      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== secIdx) return sec;
        return {
          ...sec,
          items: [...(sec.items || []), newItem]
        };
      });

      return { ...prev, sections: updatedSections };
    });

    setCourseForm(latest => {
      const itemsCount = latest.sections[secIdx]?.items?.length || 1;
      setActiveSecIdx(secIdx);
      setActiveItemIdx(itemsCount - 1);
      return latest;
    });

    setAddTopicModalSecIdx(null);
  };

  const removeTopicItem = (secIdx, itemIdx, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseForm(prev => {
      const updatedSections = prev.sections.map((sec, sIdx) => {
        if (sIdx !== secIdx) return sec;
        return {
          ...sec,
          items: (sec.items || []).filter((_, i) => i !== itemIdx)
        };
      });
      return { ...prev, sections: updatedSections };
    });
    if (activeItemIdx >= itemIdx && activeItemIdx > 0) {
      setActiveItemIdx(prev => prev - 1);
    }
  };

  const handleSaveCourse = (e) => {
    if (e) e.preventDefault();
    if (!courseForm.title) {
      setShowCourseMetaModal(true);
      return;
    }

    createCourse(courseForm);
    setTeacherCourseMode('list');
    setCourseForm({
      title: '',
      category: 'Product & Business',
      duration: '5 Weeks',
      price: '₹25,000',
      description: '',
      sections: [
        {
          weekNumber: 1,
          title: 'Week 1: Introduction and Fundamentals',
          items: [
            { title: 'Day 1: Course Overview & Setup', contentType: 'video', articles: 1, mcqs: 0, status: 'Start' }
          ]
        }
      ]
    });
  };

  const openCourseForEdit = (course) => {
    setCourseForm({
      id: course.id,
      title: course.title,
      category: course.category || 'Product & Business',
      duration: course.duration || '5 Weeks',
      price: course.price || '₹25,000',
      description: course.description || '',
      sections: course.sections && course.sections.length > 0 ? course.sections : [
        {
          weekNumber: 1,
          title: 'Week 1: Introduction and Fundamentals',
          items: [
            { title: 'Day 1: Course Overview & Setup', contentType: 'video', articles: 1, mcqs: 0, status: 'Start' }
          ]
        }
      ]
    });
    setActiveSecIdx(0);
    setActiveItemIdx(0);
    setTeacherCourseMode('create');
  };

  // Dedicated Course Builder Page View
  if (teacherCourseMode === 'create') {
    const safeSecIdx = Math.min(activeSecIdx, Math.max(0, courseForm.sections.length - 1));
    const currentSection = courseForm.sections[safeSecIdx] || { title: '', items: [] };
    const safeItemIdx = Math.min(activeItemIdx, Math.max(0, (currentSection.items?.length || 1) - 1));
    const currentActiveItem = currentSection.items?.[safeItemIdx] || null;

    return (
      <div className="min-h-screen w-full bg-white text-[#0A317B]">
        
        {/* Full-Width Page Header */}
        <header className="bg-white border-b border-gray-200 pl-4 sm:pl-6 pr-6 sm:pr-10 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTeacherCourseMode('list')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A317B] tracking-tight">
                Teacher Course Builder
              </h1>
              <p className="text-xs text-gray-500">
                Add Drag & Drop Video Files, Notion Articles, or Custom MCQ Quizzes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCourseMetaModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[#FA9C16] hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FA9C16]" />
              <span>Course Details & Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setTeacherCourseMode('list')}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>

            <button
              type="button"
              onClick={handleSaveCourse}
              className="px-5 py-2.5 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Course</span>
            </button>
          </div>
        </header>

        {/* 3-Column Studio Page Layout */}
        <form onSubmit={handleSaveCourse} className="w-full flex h-[calc(100vh-65px)] overflow-hidden">
          
          {/* COLUMN 1: LEFT SIDEBAR CURRICULUM TREE */}
          <div className="w-80 bg-slate-50/70 border-r border-gray-200 flex flex-col shrink-0 h-full">
            <div className="p-4 border-b border-gray-200/80 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-[#1A9C9B]">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0A317B]">Structure</h3>
              </div>
              <button
                type="button"
                onClick={addSectionFolder}
                className="px-3 py-1.5 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Week
              </button>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {courseForm.sections.map((sec, secIdx) => {
                const isSelectedSec = activeSecIdx === secIdx;
                const isCollapsed = collapsedSections[secIdx];

                return (
                  <div key={secIdx} className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
                    <div 
                      onClick={() => {
                        setActiveSecIdx(secIdx);
                        setActiveItemIdx(0);
                      }}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelectedSec ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[#0A317B] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                          {sec.weekNumber || secIdx + 1}
                        </span>
                        <span className="font-bold text-xs text-[#0A317B] truncate">
                          {sec.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCollapsedSections(prev => ({ ...prev, [secIdx]: !prev[secIdx] }));
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                        </button>
                        {courseForm.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => removeSectionFolder(secIdx, e)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete Week"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="p-2 pt-0 space-y-1.5 border-t border-gray-100 bg-slate-50/40">
                        {sec.items?.map((item, itemIdx) => {
                          const isSelectedItem = isSelectedSec && activeItemIdx === itemIdx;
                          const isVideo = item.contentType === 'video';
                          const isQuiz = item.contentType === 'quiz';

                          return (
                            <div
                              key={itemIdx}
                              onClick={() => {
                                setActiveSecIdx(secIdx);
                                setActiveItemIdx(itemIdx);
                              }}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelectedItem 
                                  ? 'bg-white border-blue-500 shadow-xs ring-2 ring-blue-400/20 font-bold' 
                                  : 'bg-white/80 border-gray-200/80 hover:bg-white text-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isVideo ? <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : isQuiz ? <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                                <span className="text-xs font-semibold text-[#0A317B] truncate">
                                  {item.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {item.contentType}
                                </span>
                                {sec.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => removeTopicItem(secIdx, itemIdx, e)}
                                    className="p-0.5 text-gray-300 hover:text-red-500 rounded cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => setAddTopicModalSecIdx(secIdx)}
                          className="w-full py-2 rounded-xl border border-dashed border-teal-300/80 bg-teal-50/40 hover:bg-teal-50 text-[#1A9C9B] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer mt-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> + Add Topic
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2 & 3: CANVAS WORKSPACE AND CONTENT BLOCK EDITOR */}
          <div className="flex-1 bg-white overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Top Bar for Selected Topic */}
            {currentActiveItem && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white border border-gray-200 text-[#0A317B] shadow-2xs">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={currentActiveItem.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCourseForm(prev => {
                          const updated = [...prev.sections];
                          if (updated[safeSecIdx]?.items?.[safeItemIdx]) {
                            updated[safeSecIdx].items[safeItemIdx].title = val;
                          }
                          return { ...prev, sections: updated };
                        });
                      }}
                      className="text-base font-extrabold text-[#0A317B] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full sm:w-80"
                    />
                    <p className="text-xs text-gray-400">
                      {currentSection.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <select
                    value={currentActiveItem.contentType}
                    onChange={(e) => {
                      updateTypeForCurrentTopic(e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0A317B] bg-white cursor-pointer"
                  >
                    <option value="video">Video</option>
                    <option value="notion">Notion Document</option>
                    <option value="quiz">MCQ Quiz</option>
                    <option value="file">File Attachment</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    className="px-4 py-2 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            )}

            {/* Canvas Blocks View */}
            {currentActiveItem && (
              <div className="space-y-6">
                
                {getBlocksForItem(currentActiveItem).map((block, blockIdx) => (
                  <div key={block.id || blockIdx} className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-4 relative group">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-teal-50 text-[#1A9C9B] font-mono font-bold text-xs flex items-center justify-center">
                          {blockIdx + 1}
                        </span>
                        <span className="font-extrabold text-xs text-[#0A317B] uppercase tracking-wider">
                          {block.type === 'video' && 'Video Player Block'}
                          {block.type === 'notion' && 'Article / Notion Editor Block'}
                          {block.type === 'quiz' && 'MCQ Quiz Block'}
                          {block.type === 'file' && 'Resource Attachment Block'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => removeBlockFromCurrentTopic(blockIdx, e)}
                        className="p-1.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove Block from Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* BLOCK TYPE 1: VIDEO */}
                    {block.type === 'video' && (
                      <div className="space-y-3">
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleBlockVideoFileUpload(safeSecIdx, safeItemIdx, blockIdx, file);
                          }}
                          className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-colors cursor-pointer relative"
                        >
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleBlockVideoFileUpload(safeSecIdx, safeItemIdx, blockIdx, file);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2 animate-bounce" />
                          {block.videoFileName ? (
                            <div className="space-y-1">
                              <p className="font-extrabold text-[#0A317B] text-sm">{block.videoFileName}</p>
                              <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                                <Check className="w-4 h-4" /> Native Video File Attached & Ready to Play!
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="font-bold text-[#0A317B] text-sm">Drag & Drop Video File Here</p>
                              <p className="text-[11px] text-gray-500">or click to upload from computer</p>
                            </div>
                          )}
                        </div>
                        {block.videoBlobUrl && (
                          <div className="p-3 bg-slate-900 rounded-2xl overflow-hidden shadow-md">
                            <video controls src={block.videoBlobUrl} className="w-full max-h-64 rounded-xl" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* BLOCK TYPE 2: NOTION ARTICLE */}
                    {block.type === 'notion' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-700">
                          <span className="flex items-center gap-1.5"><FileCode className="w-4 h-4" /> Notion-Style Document Editor</span>
                          <span className="text-[10px] text-gray-400 font-mono">Markdown Supported</span>
                        </div>
                        <textarea
                          rows={8}
                          placeholder="Lesson Title&#10;&#10;Write lesson notes, markdown docs, code snippets, callouts..."
                          value={block.notionDoc || ''}
                          onChange={e => {
                            updateBlockInCurrentTopic(safeSecIdx, safeItemIdx, blockIdx, blk => ({
                              ...blk,
                              notionDoc: e.target.value
                            }));
                          }}
                          className="w-full p-4 rounded-2xl border border-teal-200 text-xs font-mono bg-teal-50/30 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                        />
                      </div>
                    )}

                    {/* BLOCK TYPE 3: MCQ QUIZ */}
                    {block.type === 'quiz' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-amber-500" /> MCQ Quiz Builder
                          </span>
                          <button
                            type="button"
                            onClick={() => addBlockQuizQuestion(safeSecIdx, safeItemIdx, blockIdx)}
                            className="px-3 py-1.5 rounded-lg bg-[#FA9C16] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Question
                          </button>
                        </div>
                        <div className="space-y-3">
                          {block.quizQuestions?.map((q, qIdx) => (
                            <div key={qIdx} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <div className="font-extrabold text-[#0A317B]">Question {qIdx + 1}</div>
                                {block.quizQuestions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeBlockQuizQuestion(safeSecIdx, safeItemIdx, blockIdx, qIdx)}
                                    className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Enter question text..."
                                value={q.question}
                                onChange={e => {
                                  const val = e.target.value;
                                  updateBlockInCurrentTopic(safeSecIdx, safeItemIdx, blockIdx, blk => {
                                    const qList = [...(blk.quizQuestions || [])];
                                    qList[qIdx] = { ...qList[qIdx], question: val };
                                    return { ...blk, quizQuestions: qList };
                                  });
                                }}
                                className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-bold text-[#0A317B] bg-white"
                              />
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                {q.options?.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${safeSecIdx}-${safeItemIdx}-${blockIdx}-${qIdx}`}
                                      checked={q.correctIndex === optIdx}
                                      onChange={() => {
                                        updateBlockInCurrentTopic(safeSecIdx, safeItemIdx, blockIdx, blk => {
                                          const qList = [...(blk.quizQuestions || [])];
                                          qList[qIdx] = { ...qList[qIdx], correctIndex: optIdx };
                                          return { ...blk, quizQuestions: qList };
                                        });
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={e => {
                                        const val = e.target.value;
                                        updateBlockInCurrentTopic(safeSecIdx, safeItemIdx, blockIdx, blk => {
                                          const qList = [...(blk.quizQuestions || [])];
                                          const opts = [...(qList[qIdx]?.options || [])];
                                          opts[optIdx] = val;
                                          qList[qIdx] = { ...qList[qIdx], options: opts };
                                          return { ...blk, quizQuestions: qList };
                                        });
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BLOCK TYPE 4: FILE RESOURCE */}
                    {block.type === 'file' && (
                      <div className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center bg-rose-50/20 hover:bg-rose-50/50 transition-colors space-y-2 relative">
                        <File className="w-10 h-10 text-rose-500 mx-auto" />
                        {block.resourceFileName ? (
                          <div className="space-y-1">
                            <p className="font-extrabold text-[#0A317B] text-sm">{block.resourceFileName}</p>
                            <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                              <Check className="w-4 h-4" /> Resource File Attached!
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-gray-700 text-sm">Upload Resource Document (.pdf, .zip, .docx)</p>
                            <p className="text-[11px] text-gray-400">Click to choose file from device</p>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleBlockFileUpload(safeSecIdx, safeItemIdx, blockIdx, file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* CANVAS ADD CONTENT PLUS BUTTON */}
                <div className="pt-6 border-t border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-center">
                  <button
                    type="button"
                    onClick={() => setAddBlockModalOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-teal-50 hover:bg-[#1A9C9B] text-[#1A9C9B] hover:text-white border border-teal-200/80 shadow-xs flex items-center justify-center transition-all cursor-pointer group hover:scale-105"
                    title="Click + to Add Content Block to this Page"
                  >
                    <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  </button>
                  <span className="text-xs font-extrabold text-[#0A317B]">Add Content Block to this Page</span>
                  <p className="text-[10px] text-gray-400">Click + to select Video, Article, Quiz, or Resource to add here</p>
                </div>
              </div>
            )}

          </div>
        </form>

        {/* Modal Popups for Adding Topic and Blocks */}
        <AnimatePresence>
          {addTopicModalSecIdx !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-gray-100 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-[#1A9C9B]">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#0A317B]">Select Content Type</h3>
                      <p className="text-xs text-gray-500">Choose the type of topic content to add</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setAddTopicModalSecIdx(null)} className="p-1.5 text-gray-400 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={(e) => addTopicItem(addTopicModalSecIdx, 'video', e)} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left space-y-2 cursor-pointer">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Video Lesson</p>
                      <p className="text-[10px] text-gray-500">Drag & drop native video</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addTopicItem(addTopicModalSecIdx, 'notion', e)} className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 text-left space-y-2 cursor-pointer">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Article / Notion</p>
                      <p className="text-[10px] text-gray-500">Document & notes editor</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addTopicItem(addTopicModalSecIdx, 'quiz', e)} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left space-y-2 cursor-pointer">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">MCQ Quiz</p>
                      <p className="text-[10px] text-gray-500">Interactive questions</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addTopicItem(addTopicModalSecIdx, 'file', e)} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left space-y-2 cursor-pointer">
                    <File className="w-5 h-5 text-rose-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">File Resource</p>
                      <p className="text-[10px] text-gray-500">PDF, ZIP, or DOCX file</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {addBlockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-gray-100 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-[#1A9C9B]">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#0A317B]">Add Content Block to Page</h3>
                      <p className="text-xs text-gray-500">Choose type of block to append to this page</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setAddBlockModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={(e) => addBlockToCurrentTopic('video', e)} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left space-y-2 cursor-pointer">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Video Lesson</p>
                      <p className="text-[10px] text-gray-500">Drag & drop native video</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addBlockToCurrentTopic('notion', e)} className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 text-left space-y-2 cursor-pointer">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Article / Notion</p>
                      <p className="text-[10px] text-gray-500">Document & notes editor</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addBlockToCurrentTopic('quiz', e)} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left space-y-2 cursor-pointer">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">MCQ Quiz</p>
                      <p className="text-[10px] text-gray-500">Interactive questions</p>
                    </div>
                  </button>

                  <button type="button" onClick={(e) => addBlockToCurrentTopic('file', e)} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left space-y-2 cursor-pointer">
                    <File className="w-5 h-5 text-rose-600" />
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">File Resource</p>
                      <p className="text-[10px] text-gray-500">PDF, ZIP, or DOCX file</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showCourseMetaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-gray-100 relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#FA9C16]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0A317B]">Course Details & Pricing</h3>
                      <p className="text-xs text-gray-500">Edit course title, category, duration, and tuition fee.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCourseMetaModal(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Course Title</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="e.g. Product Management - Skill Up"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0A317B] bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Category</label>
                      <input
                        type="text"
                        value={courseForm.category}
                        onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                        placeholder="e.g. Product & Business"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Program Duration</label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                        placeholder="e.g. 5 Weeks"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Tuition Fee / Price</label>
                      <input
                        type="text"
                        value={courseForm.price}
                        onChange={e => setCourseForm({ ...courseForm, price: e.target.value })}
                        placeholder="e.g. ₹25,000"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Course Description</label>
                      <input
                        type="text"
                        value={courseForm.description}
                        onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Briefly describe learning goals..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCourseMetaModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#0A317B] hover:bg-[#07245c] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Done & Apply</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Standard Teacher Dashboard View
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      
      {/* Teacher Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('landing')} className="cursor-pointer">
              <img src="/logo.png" alt="CareerCore Logo" className="h-8 sm:h-9 w-auto object-contain" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F6] border border-[#BDEEE9] text-[#0D9488] font-extrabold text-[11px] uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>TEACHER PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-[#0F172A]">{currentUser?.name || 'Instructor Alex'}</p>
              <p className="text-[10px] text-slate-400 font-medium">Certified Course Creator</p>
            </div>

            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 rounded-xl bg-[#EEF2F6] hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Return to Site
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-[#FEECEB] text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* Top Hero Banner */}
        <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#0250AB] via-[#0284C7] to-[#10B981] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-400/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-2.5 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-semibold text-xs border border-white/20">
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Instructor Workspace & Course Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight leading-tight">
              Welcome back, <span className="text-[#38BDF8]">Instructor Alex!</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
              Create and publish custom courses, build multi-block lesson pages, and track student enrollments and course performance in real time.
            </p>
          </div>

          {/* Center-Right 3D Illustration & Create Course Button */}
          <div className="flex items-center gap-6 relative z-10 shrink-0 w-full md:w-auto justify-between md:justify-end">
            {/* 3D Stack of Books with Mortarboard and Potted Plant */}
            <div className="hidden lg:flex items-center justify-center relative w-52 h-32 shrink-0">
              <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="115" cy="132" rx="85" ry="14" fill="rgba(0,0,0,0.18)" />
                
                {/* Book 1 (Bottom) */}
                <path d="M40 108L140 85L170 98L70 121Z" fill="#1E3A8A" />
                <path d="M40 108L40 118L70 131L70 121Z" fill="#172554" />
                <path d="M70 121L70 131L170 108L170 98Z" fill="#F8FAFC" />
                <path d="M40 118L140 95L170 108L70 131Z" fill="#1E40AF" />

                {/* Book 2 (Middle) */}
                <path d="M48 93L144 71L172 84L76 106Z" fill="#0284C7" />
                <path d="M48 93L48 102L76 115L76 106Z" fill="#0369A1" />
                <path d="M76 106L76 115L172 93L172 84Z" fill="#FFFFFF" />
                <path d="M48 102L144 80L172 93L76 115Z" fill="#0EA5E9" />

                {/* Book 3 (Top) */}
                <path d="M56 78L148 57L174 70L82 91Z" fill="#38BDF8" />
                <path d="M56 78L56 86L82 99L82 91Z" fill="#0284C7" />
                <path d="M82 91L82 99L174 78L174 70Z" fill="#F0F9FF" />
                <path d="M56 86L148 65L174 78L82 99Z" fill="#7DD3FC" />

                {/* Graduation Cap */}
                <ellipse cx="115" cy="50" rx="22" ry="10" fill="#0F172A" />
                <path d="M115 22L162 38L115 54L68 38Z" fill="#1E3A8A" />
                <path d="M115 22L162 38L115 42L68 38Z" fill="#2563EB" opacity="0.4" />
                <circle cx="115" cy="38" r="3.5" fill="#F59E0B" />
                <path d="M115 38C125 40 145 44 148 58" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="145,58 151,58 149,68 147,68" fill="#F59E0B" />

                {/* Potted Plant on right */}
                <ellipse cx="182" cy="115" rx="14" ry="5" fill="rgba(0,0,0,0.15)" />
                <path d="M172 95L175 114C175 116 189 116 189 114L192 95Z" fill="#FFFFFF" />
                <ellipse cx="182" cy="95" rx="10" ry="3" fill="#E2E8F0" />
                <ellipse cx="182" cy="95" rx="8" ry="2" fill="#334155" />
                <path d="M182 95Q180 82 176 74Q182 82 182 95Z" fill="#10B981" />
                <path d="M182 92Q188 80 193 72Q186 83 182 92Z" fill="#34D399" />
                <path d="M182 88Q183 72 181 65Q185 75 182 88Z" fill="#059669" />
              </svg>
            </div>

            {/* Create New Course Button */}
            <button
              onClick={() => {
                setCourseForm({
                  title: '',
                  category: 'Engineering',
                  duration: '12 Weeks',
                  price: '₹30,000',
                  description: '',
                  sections: [
                    {
                      weekNumber: 1,
                      title: 'Week 1: Introduction and Fundamentals',
                      items: [
                        { title: 'Day 1: Course Overview & Setup', contentType: 'video', articles: 1, mcqs: 0, status: 'Start' }
                      ]
                    }
                  ]
                });
                setActiveSecIdx(0);
                setActiveItemIdx(0);
                setTeacherCourseMode('create');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#FFA000] hover:bg-[#F59E0B] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        {/* 3 Analytics Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Courses */}
          <div 
            onClick={() => setTeacherTab('courses')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F0FD] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F172A] leading-tight">
                  {courses.length}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Total Active Courses Managed</p>
              </div>
            </div>
            <div className="text-xs font-bold text-[#2563EB] flex items-center gap-0.5 hover:underline self-start mt-1">
              <span>Courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Students */}
          <div 
            onClick={() => setTeacherTab('analytics')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F8F5] text-[#0D9488] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F172A] leading-tight">
                  {totalEnrolledStudents}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Total Students Taking Courses</p>
              </div>
            </div>
            <div className="text-xs font-bold text-[#0D9488] flex items-center gap-0.5 hover:underline self-start mt-1">
              <span>Students</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Curriculum */}
          <div 
            onClick={() => setTeacherTab('courses')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF6E5] text-[#F59E0B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0F172A] leading-tight">
                  {totalTopicPages}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Published Topic Pages</p>
              </div>
            </div>
            <div className="text-xs font-bold text-[#F59E0B] flex items-center gap-0.5 hover:underline self-start mt-1">
              <span>Curriculum</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setTeacherTab('courses')}
            className={`py-2.5 px-5 font-extrabold text-xs rounded-full transition-all cursor-pointer ${
              teacherTab === 'courses' 
                ? 'bg-[#0B48AD] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold'
            }`}
          >
            My Courses & Full Builder ({courses.length})
          </button>

          <button
            onClick={() => setTeacherTab('analytics')}
            className={`py-2.5 px-5 font-bold text-xs rounded-full transition-all cursor-pointer ${
              teacherTab === 'analytics' 
                ? 'bg-[#0B48AD] text-white shadow-xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold'
            }`}
          >
            Student Enrollment Analytics ({users.length})
          </button>
        </div>

        {/* TAB 1: COURSES MANAGEMENT & BUILDER */}
        {teacherTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrolled = getEnrolledStudents(course.title);
              const topicsCount = course.sections ? course.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0) : 1;
              const meta = getCourseMeta(course);

              return (
                <div 
                  key={course.id} 
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Category badge + Duration */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full ${meta.categoryBadgeClass} font-extrabold text-[10px] uppercase tracking-wider`}>
                        {meta.categoryLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {course.duration || meta.defaultDuration}
                      </span>
                    </div>

                    {/* Middle: Icon + Title & Description */}
                    <div className="flex items-start gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl ${meta.iconBgClass} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                        {meta.iconType === 'code' && (
                          <span className="font-mono font-black text-sm">&lt;/&gt;</span>
                        )}
                        {meta.iconType === 'ai' && (
                          <Cpu className="w-6 h-6" />
                        )}
                        {meta.iconType === 'cloud' && (
                          <Cloud className="w-6 h-6" />
                        )}
                        {meta.iconType === 'business' && (
                          <BarChart3 className="w-6 h-6" />
                        )}
                        {meta.iconType === 'design' && (
                          <Sparkles className="w-6 h-6" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-extrabold text-[#0F172A] leading-snug group-hover:text-[#0B48AD] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                          {course.description || 'A comprehensive, industry-aligned curriculum designed with senior mentors and real-world projects.'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: Enrolled pill + Topics pill */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 px-3 rounded-xl bg-[#E6F8F5] text-[#0D9488] flex items-center justify-center gap-1.5 text-xs font-bold">
                        <User className="w-3.5 h-3.5" />
                        <span>{enrolled.length > 0 ? enrolled.length : (course.id === 'c1' || course.id === 'c3' ? 1 : 0)} Students Enrolled</span>
                      </div>
                      <div className="p-2 px-3 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center gap-1.5 text-xs font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{topicsCount} Topics</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer (Quick open builder / Edit / Delete) */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openCourseForEdit(course)}
                      className="flex-1 py-2.5 rounded-xl bg-[#0B48AD] hover:bg-[#093e96] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <FileCode className="w-3.5 h-3.5" /> Open Course Builder
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${course.title}"?`)) deleteCourse(course.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: STUDENT ENROLLMENT ANALYTICS */}
        {teacherTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Search and Course Filter Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Course:</span>
                <select
                  value={selectedCourseFilter}
                  onChange={e => setSelectedCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] bg-white cursor-pointer w-full sm:w-auto"
                >
                  <option value="ALL">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0F172A]">
                  Enrolled Students List ({
                    users.filter(u => {
                      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesCourse = selectedCourseFilter === 'ALL' || u.course === selectedCourseFilter;
                      return matchesSearch && matchesCourse;
                    }).length
                  })
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Student Name</th>
                      <th className="px-6 py-3.5">Email Address</th>
                      <th className="px-6 py-3.5">Enrolled Course</th>
                      <th className="px-6 py-3.5">Registration Date</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter(u => {
                      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesCourse = selectedCourseFilter === 'ALL' || u.course === selectedCourseFilter;
                      return matchesSearch && matchesCourse;
                    }).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F172A]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-teal-50 text-[#0D9488] font-extrabold flex items-center justify-center text-xs border border-teal-200">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                            {user.course}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{user.registeredAt || '2026-09-15'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${
                            user.status === 'APPROVED' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {user.status || 'APPROVED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
