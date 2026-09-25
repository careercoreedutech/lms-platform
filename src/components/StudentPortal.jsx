import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  Circle,
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Award, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  Search, 
  LogOut, 
  Bell, 
  Sparkles, 
  Video, 
  FileCode, 
  X, 
  Check,
  AlertCircle,
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  ChevronsRight,
  File,
  GraduationCap,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { supabase, getProtectedVideoUrl } from '../lib/supabase';
import SecureVideoPlayer from './SecureVideoPlayer';
import FeedbackModal from './FeedbackModal';

export default function StudentPortal() {
  const { currentUser, courses, logout, setActiveView, syncUsersFromSupabase, loginStudent } = useLms();
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentAuthError, setStudentAuthError] = useState('');
  const [studentAuthenticating, setStudentAuthenticating] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('RESOURCES');
  const [expandedWeeks, setExpandedWeeks] = useState({ 0: true, 1: false, 2: false });
  const [sidebarRailTab, setSidebarRailTab] = useState('articles'); // 'all' | 'articles' | 'quiz'
  const [activeModalItem, setActiveModalItem] = useState(null); // Item currently open in reader modal
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // Mobile lessons drawer toggle
  const [protectedVideoUrls, setProtectedVideoUrls] = useState({}); // Signed Supabase URLs for private video streaming

  // Anti-Piracy DRM: Intercept and prevent right-clicks, inspect, and downloads while reader is open
  useEffect(() => {
    if (!activeModalItem) return;

    const handleGlobalContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleGlobalKeyDown = (e) => {
      // Intercept Ctrl+S / Cmd+S (Save), Ctrl+U (Source), Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p', 'S', 'U', 'P'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });

    return () => {
      window.removeEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, [activeModalItem]);

  // ── Progress persistence (localStorage + Supabase cloud sync) ───────────────
  const studentIdentifier = currentUser?.id || currentUser?.username || currentUser?.email || 'default_student';
  const progressKey = `careercore_progress_${studentIdentifier}_${currentUser?.course || 'default'}`;

  // Multi-identifier array to reliably match student_progress rows across UUID, username, or email
  const possibleStudentIds = [currentUser?.id, currentUser?.username, currentUser?.email]
    .filter(Boolean)
    .map(String);

  const [completedItemIds, setCompletedItemIds] = useState(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Whenever progressKey changes (e.g. currentUser resolves from context), load its local cached progress
  useEffect(() => {
    if (!studentIdentifier || studentIdentifier === 'default_student') return;
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCompletedItemIds(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, [progressKey, studentIdentifier]);

  // Load progress from Supabase on mount/auth change and merge with local state
  useEffect(() => {
    let isMounted = true;
    async function loadProgressFromSupabase() {
      if (possibleStudentIds.length === 0) return;
      try {
        const { data, error } = await supabase
          .from('student_progress')
          .select('item_id, status')
          .in('student_id', possibleStudentIds);

        if (!error && Array.isArray(data) && isMounted) {
          const cloudMap = {};
          data.forEach(row => {
            if (row.item_id && (row.status === 'COMPLETED' || row.status === 'completed')) {
              cloudMap[row.item_id] = true;
            }
          });
          setCompletedItemIds(prev => {
            const merged = { ...prev, ...cloudMap };
            try {
              if (studentIdentifier !== 'default_student') {
                localStorage.setItem(progressKey, JSON.stringify(merged));
              }
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase progress load notice:', err);
      }
    }
    loadProgressFromSupabase();
    return () => { isMounted = false; };
  }, [studentIdentifier, progressKey]);

  // Persist locally whenever completedItemIds changes (only for valid student accounts)
  useEffect(() => {
    if (!studentIdentifier || studentIdentifier === 'default_student') return;
    try { localStorage.setItem(progressKey, JSON.stringify(completedItemIds)); } catch {}
  }, [completedItemIds, progressKey, studentIdentifier]);

  // Find enrolled course or default to matching course title or first available
  const courseData = courses.find(c => c.title === currentUser?.course)
    || courses.find(c => c.title?.toLowerCase() === (currentUser?.course || '').toLowerCase())
    || courses.find(c => c.title?.toLowerCase().includes((currentUser?.course || '').toLowerCase()))
    || courses[0];
  const sections = courseData?.sections || [];
  const allCourseItems = sections.flatMap(s => s.items || []);

  // Helper to extract multi-blocks for an item
  const getBlocksForItem = useCallback((item) => {
    if (!item) return [];
    if (Array.isArray(item.blocks) && item.blocks.length > 0) {
      return item.blocks;
    }
    const nDoc = item.notionDoc || item.notion_doc || '';
    if (typeof nDoc === 'string' && nDoc.startsWith('<!--CC_BLOCKS_DATA:')) {
      const endIdx = nDoc.indexOf('-->');
      if (endIdx !== -1) {
        try {
          const jsonStr = nDoc.substring('<!--CC_BLOCKS_DATA:'.length, endIdx);
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse CC_BLOCKS_DATA in StudentPortal:', e);
        }
      }
    }
    const type = item.contentType || 'video';
    const fallbackPath = item.videoStoragePath || 
      (item.videoUrl && !item.videoUrl.startsWith('http') && !item.videoUrl.startsWith('blob:') ? item.videoUrl : '') ||
      (type === 'video' && (item.title?.includes('Day 1') || !item.videoUrl) ? 'courses/1789887976311_AirBnB_Concept_Ad.mp4' : '');

    return [{
      id: item.id ? `block_${item.id}` : 'block_init',
      type: type,
      videoFileName: item.videoFileName || (fallbackPath ? 'AirBnB_Concept_Ad.mp4' : ''),
      videoBlobUrl: item.videoBlobUrl || '',
      videoUrl: item.videoUrl || fallbackPath,
      videoStoragePath: fallbackPath,
      notionDoc: item.notionDoc || (type === 'notion' ? '# Study Article\n\nWrite lesson notes here...' : ''),
      quizQuestions: item.quizQuestions || (type === 'quiz' ? [{ question: 'Sample Question', options: ['Option A', 'Option B'], correctIndex: 0 }] : []),
      resourceFileName: item.resourceFileName || ''
    }];
  }, []);

  // Helper to check if a specific block is completed
  const isBlockCompleted = useCallback((item, block, blockIdx) => {
    if (!item) return false;
    const blockId = block?.id || `b_${item.id}_${blockIdx}`;
    
    // Explicit block completion state
    if (completedItemIds[blockId] === true) return true;
    if (completedItemIds[blockId] === false) return false;

    // Check parent item completion
    if (completedItemIds[item.id]) {
      const blocks = getBlocksForItem(item);
      // If item only has 1 block, it's complete
      if (blocks.length <= 1) return true;
      // If item has multiple blocks, only block 0 was completed under old single-item completion;
      // newly added blocks (blockIdx > 0) are not complete until watched/marked
      if (blockIdx === 0) return true;
    }
    return false;
  }, [completedItemIds, getBlocksForItem]);

  // Helper to check if a topic item is fully completed (all its blocks must be complete)
  const isItemCompleted = useCallback((item) => {
    if (!item) return false;
    const blocks = getBlocksForItem(item);
    if (blocks.length === 0) return Boolean(completedItemIds[item.id]);
    return blocks.every((b, idx) => isBlockCompleted(item, b, idx));
  }, [getBlocksForItem, isBlockCompleted, completedItemIds]);

  // Accurate granular progress tracking across all blocks (units of learning)
  const allBlocksList = sections.flatMap(s => s.items || []).flatMap(item => {
    const blocks = getBlocksForItem(item);
    return blocks.map((b, idx) => ({ item, block: b, idx }));
  });

  const totalLessons = allBlocksList.length > 0 ? allBlocksList.length : allCourseItems.length;
  const completedLessonsCount = allBlocksList.length > 0
    ? allBlocksList.filter(({ item, block, idx }) => isBlockCompleted(item, block, idx)).length
    : allCourseItems.filter(item => isItemCompleted(item)).length;

  const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100)) : 0;
  const isCourseFullyCompleted = totalLessons > 0 && completedLessonsCount >= totalLessons;

  // Identify next lesson to continue or review
  const nextIncompleteItem = allCourseItems.find(item => !isItemCompleted(item));
  const featuredItem = nextIncompleteItem || allCourseItems[allCourseItems.length - 1] || sections[0]?.items[0];
  const isFeaturedCompleted = featuredItem && isItemCompleted(featuredItem);

  // Mark all blocks of a lesson as complete: saves locally immediately and syncs to Supabase cloud
  const markComplete = useCallback(async (itemId, score = null) => {
    if (!itemId) return;

    const targetItem = allCourseItems.find(it => it.id === itemId) || (activeModalItem?.id === itemId ? activeModalItem : null);
    const blocks = targetItem ? getBlocksForItem(targetItem) : [];

    // Mark item AND all its constituent blocks as completed
    const updatedIds = { ...completedItemIds, [itemId]: true };
    blocks.forEach((b, idx) => {
      const bId = b.id || `b_${itemId}_${idx}`;
      updatedIds[bId] = true;
    });

    setCompletedItemIds(updatedIds);
    try {
      if (studentIdentifier !== 'default_student') {
        localStorage.setItem(progressKey, JSON.stringify(updatedIds));
      }
    } catch {}

    // Cloud sync to Supabase student_progress
    const primaryStudentId = String(currentUser?.id || studentIdentifier);
    if (primaryStudentId && primaryStudentId !== 'default_student') {
      try {
        const payload = {
          student_id: primaryStudentId,
          item_id: String(itemId),
          status: 'COMPLETED',
          updated_at: new Date().toISOString()
        };
        if (score !== null) {
          payload.quiz_score = typeof score === 'object' ? `${score.correct}/${score.total}` : String(score);
        }

        const { data: existing } = await supabase
          .from('student_progress')
          .select('id')
          .in('student_id', possibleStudentIds)
          .eq('item_id', String(itemId))
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('student_progress').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('student_progress').insert(payload);
        }

        // Also upsert individual block progress rows
        for (let idx = 0; idx < blocks.length; idx++) {
          const b = blocks[idx];
          const bId = b.id || `b_${itemId}_${idx}`;
          await supabase.from('student_progress').upsert({
            student_id: primaryStudentId,
            item_id: String(bId),
            status: 'COMPLETED',
            updated_at: new Date().toISOString()
          }, { onConflict: 'student_id,item_id' });
        }

        // Update enrollments & profiles progress_percent in Supabase
        const targetCourseId = courseData?.id;
        if (targetCourseId && currentUser?.id) {
          const updatedBlocksList = (courseData?.sections || []).flatMap(s => s.items || []).flatMap(it => {
            const blks = getBlocksForItem(it);
            return blks.map((b, i) => ({ it, b, i }));
          });
          const currentTotal = updatedBlocksList.length > 0 ? updatedBlocksList.length : 1;
          const updatedLessonsCount = updatedBlocksList.filter(({ it, b, i }) => {
            const bId = b.id || `b_${it.id}_${i}`;
            if (it.id === itemId) return true;
            return updatedIds[bId] || (i === 0 && updatedIds[it.id]);
          }).length;

          const pct = Math.min(100, Math.round((updatedLessonsCount / currentTotal) * 100));

          await supabase
            .from('enrollments')
            .update({ progress_percent: pct })
            .eq('student_id', currentUser.id)
            .eq('course_id', targetCourseId);

          const completedWeeksCount = (courseData?.sections || []).filter(sec => 
            (sec.items || []).length > 0 && 
            (sec.items || []).every(it => it.id === itemId || updatedIds[it.id])
          ).length;

          try {
            await supabase
              .from('profiles')
              .update({
                course: courseData?.title || currentUser?.course || 'Full Stack Web Dev',
                progress_percent: pct,
                completed_lessons: updatedLessonsCount,
                total_lessons: currentTotal,
                completed_weeks: completedWeeksCount,
                current_week: Math.min((courseData?.sections || []).length || 1, completedWeeksCount + 1),
                updated_at: new Date().toISOString()
              })
              .eq('id', currentUser.id);
          } catch {}
        }

        if (typeof syncUsersFromSupabase === 'function') {
          syncUsersFromSupabase();
        }
      } catch (err) {
        console.warn('Supabase progress sync notice:', err);
      }
    }
  }, [allCourseItems, activeModalItem, getBlocksForItem, completedItemIds, studentIdentifier, progressKey, currentUser, possibleStudentIds, courseData, syncUsersFromSupabase]);

  // Toggle or mark individual block completed
  const toggleBlockComplete = useCallback(async (item, block, blockIdx) => {
    if (!item) return;
    const blockId = block?.id || `b_${item.id}_${blockIdx}`;
    const wasComplete = isBlockCompleted(item, block, blockIdx);
    const newStatus = !wasComplete;

    const blocks = getBlocksForItem(item);
    const updatedIds = {
      ...completedItemIds,
      [blockId]: newStatus
    };

    // Check if all blocks of this item are now completed
    const allComplete = blocks.every((b, idx) => {
      const bId = b.id || `b_${item.id}_${idx}`;
      if (idx === blockIdx) return newStatus;
      return updatedIds[bId] !== undefined ? updatedIds[bId] : isBlockCompleted(item, b, idx);
    });

    updatedIds[item.id] = allComplete;
    setCompletedItemIds(updatedIds);

    try {
      if (studentIdentifier !== 'default_student') {
        localStorage.setItem(progressKey, JSON.stringify(updatedIds));
      }
    } catch {}

    const primaryStudentId = String(currentUser?.id || studentIdentifier);
    if (primaryStudentId && primaryStudentId !== 'default_student') {
      try {
        await supabase.from('student_progress').upsert({
          student_id: primaryStudentId,
          item_id: String(blockId),
          status: newStatus ? 'COMPLETED' : 'IN_PROGRESS',
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_id,item_id' });

        await supabase.from('student_progress').upsert({
          student_id: primaryStudentId,
          item_id: String(item.id),
          status: allComplete ? 'COMPLETED' : 'IN_PROGRESS',
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_id,item_id' });

        const targetCourseId = courseData?.id;
        if (targetCourseId && currentUser?.id) {
          const updatedBlocksList = (courseData?.sections || []).flatMap(s => s.items || []).flatMap(it => {
            const blks = getBlocksForItem(it);
            return blks.map((b, i) => ({ it, b, i }));
          });
          const currentTotal = updatedBlocksList.length > 0 ? updatedBlocksList.length : 1;
          const updatedLessonsCount = updatedBlocksList.filter(({ it, b, i }) => {
            const bId = b.id || `b_${it.id}_${i}`;
            if (it.id === item.id && i === blockIdx) return newStatus;
            return updatedIds[bId] !== undefined ? updatedIds[bId] : isBlockCompleted(it, b, i);
          }).length;

          const pct = Math.min(100, Math.round((updatedLessonsCount / currentTotal) * 100));

          await supabase
            .from('enrollments')
            .update({ progress_percent: pct })
            .eq('student_id', currentUser.id)
            .eq('course_id', targetCourseId);

          try {
            await supabase
              .from('profiles')
              .update({
                progress_percent: pct,
                completed_lessons: updatedLessonsCount,
                total_lessons: currentTotal,
                updated_at: new Date().toISOString()
              })
              .eq('id', currentUser.id);
          } catch {}
        }

        if (typeof syncUsersFromSupabase === 'function') {
          syncUsersFromSupabase();
        }
      } catch (err) {
        console.warn('Block sync notice:', err);
      }
    }
  }, [completedItemIds, isBlockCompleted, getBlocksForItem, studentIdentifier, progressKey, currentUser, courseData, syncUsersFromSupabase]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const toggleWeek = (index) => {
    setExpandedWeeks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const openItemModal = (item) => {
    setActiveModalItem(item);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Automatically resolve Supabase protected video URLs for active topic blocks
  useEffect(() => {
    if (!activeModalItem) {
      setProtectedVideoUrls({});
      return;
    }
    const blocks = getBlocksForItem(activeModalItem);
    blocks.forEach(async (b, idx) => {
      // ONLY resolve this block's target; do NOT fallback to activeModalItem for idx > 0
      const rawTarget = b.videoStoragePath || 
        b.videoUrl ||
        (idx === 0 ? (activeModalItem?.videoStoragePath || activeModalItem?.videoUrl) : '');

      if (rawTarget && !rawTarget.startsWith('blob:')) {
        try {
          const signed = await getProtectedVideoUrl(rawTarget, 86400);
          if (signed) {
            setProtectedVideoUrls(prev => ({ 
              ...prev, 
              [b.id]: signed,
              [idx]: signed,
              ...(idx === 0 ? { [activeModalItem.id]: signed, 'active': signed } : {})
            }));
          }
        } catch (e) {
          console.warn('Could not load protected video URL:', e);
        }
      }
    });
  }, [activeModalItem]);

  const handleQuizSubmit = (questions) => {
    if (!questions) return;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const finalScore = { correct, total: questions.length };
    setQuizScore(finalScore);
    setQuizSubmitted(true);
    markComplete(activeModalItem.id, finalScore);
  };

  // Helper to render Notion Markdown Text
  const renderNotionContent = (contentStr) => {
    if (!contentStr) return <p className="text-gray-500">No document content added yet for this topic.</p>;

    let cleanStr = contentStr;
    if (typeof cleanStr === 'string' && cleanStr.startsWith('<!--CC_BLOCKS_DATA:')) {
      const endIdx = cleanStr.indexOf('-->');
      if (endIdx !== -1) {
        cleanStr = cleanStr.substring(endIdx + 3).replace(/^\n/, '');
      }
    }
    if (!cleanStr.trim()) return <p className="text-gray-500">No document content added yet for this topic.</p>;

    const lines = cleanStr.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-extrabold text-[#0A317B] my-3 border-b border-gray-200 pb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold text-[#0A317B] my-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-[#1A9C9B] my-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <div key={idx} className="my-3 p-4 rounded-2xl bg-amber-50 border-l-4 border-[#FA9C16] text-xs font-medium text-amber-900 shadow-xs">
            {line.replace('> ', '')}
          </div>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 text-xs text-gray-700 list-disc font-medium my-1">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '---') {
        return <hr key={idx} className="my-4 border-gray-200" />;
      }
      return <p key={idx} className="text-xs text-gray-700 leading-relaxed my-1.5 font-medium">{line}</p>;
    });
  };

  const handleStudentAuth = async (e) => {
    if (e) e.preventDefault();
    if (!studentUsername.trim()) {
      setStudentAuthError('Please enter your username or email.');
      return;
    }
    if (!studentPassword.trim()) {
      setStudentAuthError('Please enter your password.');
      return;
    }
    setStudentAuthError('');
    setStudentAuthenticating(true);
    try {
      const res = await loginStudent(studentUsername.trim(), studentPassword.trim());
      if (res && !res.success) {
        setStudentAuthError(res.message || 'Invalid credentials. Access Denied.');
      }
    } catch (err) {
      setStudentAuthError('Authentication error: ' + (err?.message || err));
    } finally {
      setStudentAuthenticating(false);
    }
  };

  // ── STUDENT PORTAL AUTHENTICATION GATE ───────────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-[#0A317B]">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('landing')} className="cursor-pointer">
              <img src="/logo.png" alt="CareerCore Logo" className="h-8 w-auto" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0D9488] text-[11px] font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>STUDENT PORTAL ACCESS</span>
            </div>
          </div>
          <button
            onClick={() => setActiveView('landing')}
            className="text-xs font-bold text-gray-500 hover:text-[#0A317B] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Site</span>
          </button>
        </header>

        {/* Center Login Card */}
        <div className="max-w-md w-full mx-auto px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center border border-teal-200 shadow-xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#0A317B] tracking-tight">Student Learning Portal</h2>
              <p className="text-xs text-gray-500">
                Sign in with your student credentials to access course materials, video lectures, and track your progress.
              </p>
            </div>

            {studentAuthError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {studentAuthError}
              </div>
            )}

            <form onSubmit={handleStudentAuth} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-gray-700 block mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentUsername}
                    onChange={(e) => { setStudentUsername(e.target.value); setStudentAuthError(''); }}
                    placeholder="Enter username or email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#1A9C9B] focus:ring-2 focus:ring-[#1A9C9B]/20 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-700 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => { setStudentPassword(e.target.value); setStudentAuthError(''); }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#1A9C9B] focus:ring-2 focus:ring-[#1A9C9B]/20 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={studentAuthenticating}
                className="w-full py-3.5 rounded-xl bg-[#0A317B] hover:bg-[#08265e] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {studentAuthenticating ? 'Authenticating...' : 'Enter Student Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <footer className="py-4 text-center text-xs text-gray-400">
          CareerCore LMS Platform · Secured Student Learning Portal
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 font-sans">
      
      {/* Top Navbar matching Mentor Portal styling */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setActiveView('landing')}
              className="cursor-pointer shrink-0"
            >
              <img src="/logo.png" alt="CareerCore Logo" className="h-8 sm:h-9 w-auto object-contain" />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F6] border border-[#BDEEE9] text-[#0D9488] font-extrabold text-[11px] uppercase tracking-wider shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>STUDENT PORTAL</span>
            </div>

            {/* Kept Search Option Same */}
            <div className="relative hidden md:block w-60 lg:w-72 ml-2">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full border border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
              />
            </div>
          </div>

          {/* Right Header Controls matching Mentor Portal */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Student Profile Pill */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 rounded-2xl transition-all shadow-2xs">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#0A317B] to-[#1A9C9B] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {(currentUser?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white bg-emerald-500"
                  title="Active Student"
                />
              </div>

              <div className="text-left hidden sm:block pr-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-extrabold text-[#0F172A] leading-tight">
                    {currentUser?.name || 'Enrolled Student'}
                  </p>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  <span className="font-semibold text-slate-500">STUDENT</span>
                  {(currentUser?.course || courseData?.title) ? ` · ${currentUser?.course || courseData?.title}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('landing')}
              className="px-3.5 py-2 rounded-xl bg-[#EEF2F6] hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer hidden sm:block"
            >
              Return to Site
            </button>

            <button
              onClick={logout}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#FEECEB] text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Course Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Course Header Banner Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-200/80">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {courseData?.title}
            </h1>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold max-w-md">
                <span>{completedLessonsCount} of {totalLessons} Complete. ({progressPercent}%)</span>
                {isCourseFullyCompleted && (
                  <span className="text-emerald-600 flex items-center gap-1 font-extrabold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Completed
                  </span>
                )}
              </div>

              <div className="w-full max-w-sm bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isCourseFullyCompleted ? 'bg-emerald-500' : 'bg-[#1A9C9B]'}`} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-500">
                {isCourseFullyCompleted ? '🎉 Congratulations! You have finished all lessons in this course.' : 'Progress updates in real-time.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <Award className="w-4 h-4" />
              <span>Get Certificates</span>
            </button>

            <button 
              onClick={() => setFeedbackModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#1A9C9B] text-[#1A9C9B] hover:bg-teal-50 font-bold text-xs shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Feedback</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200 text-xs font-bold text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
          {['RESOURCES', 'NOTES', 'LIVE', 'LEADERBOARD', 'NOTICEBOARD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`py-3 transition-all relative cursor-pointer ${
                activeSubTab === tab ? 'text-[#1A9C9B] font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              {activeSubTab === tab && (
                <motion.div 
                  layoutId="activeSubTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A9C9B]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Course Structure Section */}
        <div className="max-w-5xl space-y-4">
            
            {/* Top Featured Item Card */}
            {featuredItem && (
              <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between gap-4 transition-all ${
                isCourseFullyCompleted ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCourseFullyCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-[#1A9C9B]'
                  }`}>
                    {isCourseFullyCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Play className="w-5 h-5 fill-[#1A9C9B]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {featuredItem.title || 'Course Overview & Setup'}
                      </h4>
                      {isFeaturedCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#1A9C9B]" />
                      <span>{courseData?.title}</span>
                      {isCourseFullyCompleted && (
                        <span className="text-emerald-600 font-semibold">• 100% Finished</span>
                      )}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => openItemModal(featuredItem)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isCourseFullyCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : completedLessonsCount > 0
                        ? 'bg-[#1A9C9B] hover:bg-[#147d7c] text-white'
                        : 'bg-[#0A317B] hover:bg-[#061e4f] text-white'
                  }`}
                >
                  {isCourseFullyCompleted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Review Lesson</span>
                    </>
                  ) : completedLessonsCount > 0 ? (
                    <span>Continue</span>
                  ) : (
                    <span>Start Learning</span>
                  )}
                </button>
              </div>
            )}

            {/* Hierarchical Sections Accordion Tree */}
            <div className="space-y-3">
              {sections.map((sec, secIdx) => {
                const isExpanded = expandedWeeks[secIdx];

                return (
                  <div 
                    key={sec.id || secIdx} 
                    className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Accordion Folder Header */}
                    <div 
                      onClick={() => toggleWeek(secIdx)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {sec.weekNumber || secIdx + 1}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                          {sec.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span>{sec.items?.length || sec.topicsCount || 8} Topics</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Expanded Sub-topics List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-100 bg-slate-50/50 p-3 sm:p-4 space-y-2.5"
                        >
                          {sec.items?.map((item, itemIdx) => {
                            const isVideo = item.contentType === 'video';
                            const isQuiz = item.contentType === 'quiz';
                            const itemBlocks = getBlocksForItem(item);
                            const isCompleted = isItemCompleted(item);
                            const completedBlocksCount = itemBlocks.filter((b, idx) => isBlockCompleted(item, b, idx)).length;

                            return (
                              <div 
                                key={item.id || itemIdx}
                                onClick={() => openItemModal(item)}
                                className={`p-3 sm:p-4 rounded-xl border bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all cursor-pointer hover:border-[#1A9C9B] ${
                                  isCompleted ? 'bg-teal-50/30 border-teal-200' : 'border-gray-200/90'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isVideo ? 'bg-blue-50 text-[#0A317B]' : isQuiz ? 'bg-amber-50 text-[#FA9C16]' : 'bg-teal-50 text-[#1A9C9B]'
                                  }`}>
                                    {isVideo ? <Video className="w-4 h-4 text-[#0A317B]" /> : isQuiz ? <HelpCircle className="w-4 h-4 text-[#FA9C16]" /> : <FileCode className="w-4 h-4 text-[#1A9C9B]" />}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-slate-900">
                                        {item.title}
                                      </h4>
                                      {isVideo ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-blue-100 text-[#0A317B]">
                                          VIDEO
                                        </span>
                                      ) : isQuiz ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-100 text-[#FA9C16]">
                                          QUIZ / MCQS
                                        </span>
                                      ) : (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-teal-100 text-[#1A9C9B]">
                                          NOTION DOC
                                        </span>
                                      )}
                                      {itemBlocks.length > 1 && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono bg-slate-100 text-slate-700">
                                          {completedBlocksCount}/{itemBlocks.length} Blocks
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                                      <span className="flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5 text-[#1A9C9B]" /> {itemBlocks.filter(b => b.type === 'notion').length || item.articles || 1} Articles
                                      </span>
                                      {(item.mcqs !== undefined || itemBlocks.some(b => b.type === 'quiz')) && (
                                        <span className="flex items-center gap-1">
                                          <HelpCircle className="w-3.5 h-3.5 text-[#FA9C16]" /> {item.mcqs || itemBlocks.filter(b => b.type === 'quiz').length} MCQ's
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button className={`px-5 py-1.5 rounded-lg text-white font-bold text-xs shadow-2xs transition-all shrink-0 self-end sm:self-center cursor-pointer ${
                                  isCompleted 
                                    ? 'bg-emerald-600' 
                                    : completedBlocksCount > 0 
                                      ? 'bg-amber-600 hover:bg-amber-700' 
                                      : 'bg-[#1A9C9B] hover:bg-[#147d7c]'
                                }`}>
                                  {isCompleted 
                                    ? '✓ Completed' 
                                    : completedBlocksCount > 0 
                                      ? `Continue (${Math.round((completedBlocksCount / itemBlocks.length) * 100)}%)` 
                                      : item.status || 'Start'}
                                </button>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* GEEKSFORGEEKS MATCHING SPLIT-SIDEBAR DRAWER & CONTENT READER (EXACT MATCH) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-white w-full h-full flex flex-col overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="w-full h-full bg-white flex flex-col overflow-hidden"
            >
              {/* Top Drawer Header Bar (Matching Image 2) */}
              <div className="px-5 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveModalItem(null)} 
                    className="w-7 h-7 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title="Return to Course"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-md sm:max-w-xl">
                    {activeModalItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Circular Progress Badge */}
                  {(() => {
                    const activeBlocks = getBlocksForItem(activeModalItem);
                    const completedCount = activeBlocks.filter((b, idx) => isBlockCompleted(activeModalItem, b, idx)).length;
                    const topicPct = activeBlocks.length > 0 
                      ? Math.round((completedCount / activeBlocks.length) * 100) 
                      : (isItemCompleted(activeModalItem) ? 100 : 0);
                    return (
                      <div 
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-extrabold font-mono transition-all ${
                          topicPct === 100 
                            ? 'border-emerald-500 text-emerald-800 bg-emerald-50' 
                            : topicPct > 0 
                              ? 'border-[#1A9C9B] text-[#0A317B] bg-teal-50' 
                              : 'border-gray-300 text-gray-500 bg-gray-50'
                        }`}
                        title={`${completedCount} of ${activeBlocks.length} blocks completed`}
                      >
                        {topicPct}%
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    className="lg:hidden px-2.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0D9488] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#1A9C9B]" />
                    <span>{mobileDrawerOpen ? 'Reader' : 'Lessons'}</span>
                  </button>

                  <button 
                    onClick={() => setActiveModalItem(null)} 
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Split Body: Left Sidebar Rail + Articles Panel + Right Content Reader */}
              <div className="flex flex-1 overflow-hidden relative">
                
                {/* 1. SLIM LEFT VERTICAL RAIL (Icon Toolbar - Width ~64px) */}
                <div className={`${mobileDrawerOpen ? 'flex' : 'hidden lg:flex'} w-16 bg-slate-50 border-r border-gray-200 py-4 flex-col items-center justify-between shrink-0 text-gray-500 z-20`}>
                  <div className="space-y-4 w-full px-1.5">
                    {/* All Button */}
                    <button
                      onClick={() => setSidebarRailTab('all')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'all' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>All</span>
                    </button>

                    {/* Articles Button (Active Green Border) */}
                    <button
                      onClick={() => setSidebarRailTab('articles')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'articles' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-400 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Articles</span>
                    </button>

                    {/* Quiz Button */}
                    <button
                      onClick={() => setSidebarRailTab('quiz')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'quiz' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Quiz</span>
                    </button>
                  </div>

                  {/* Bottom Next Track Icon */}
                  <button
                    onClick={() => {
                      markComplete(activeModalItem.id);
                      setActiveModalItem(null);
                    }}
                    className="w-full py-2 flex flex-col items-center gap-1 text-[9px] font-bold text-gray-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <ChevronsRight className="w-5 h-5 text-emerald-700" />
                    <span>Next Track</span>
                  </button>
                </div>

                {/* 2. ARTICLES & BLOCKS DRAWER PANEL (Middle Column) */}
                <div className={`${mobileDrawerOpen ? 'flex' : 'hidden lg:flex'} w-full sm:w-72 bg-white border-r border-gray-200 flex-col shrink-0 z-20`}>
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      {sidebarRailTab === 'all' && `Page Content (${getBlocksForItem(activeModalItem).length} Blocks)`}
                      {sidebarRailTab === 'articles' && `Articles / Docs (${getBlocksForItem(activeModalItem).filter(b => b.type === 'notion').length > 0 ? getBlocksForItem(activeModalItem).filter(b => b.type === 'notion').length : sections.flatMap(s => s.items || []).filter(i => i.contentType === 'notion' || getBlocksForItem(i).some(b => b.type === 'notion')).length})`}
                      {sidebarRailTab === 'quiz' && `Quizzes & MCQs (${getBlocksForItem(activeModalItem).filter(b => b.type === 'quiz').length > 0 ? getBlocksForItem(activeModalItem).filter(b => b.type === 'quiz').length : sections.flatMap(s => s.items || []).filter(i => i.contentType === 'quiz' || getBlocksForItem(i).some(b => b.type === 'quiz')).length})`}
                    </h4>
                  </div>

                  <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                    {/* If current page has blocks matching active filter tab */}
                    {getBlocksForItem(activeModalItem).filter(b => {
                      if (sidebarRailTab === 'articles') return b.type === 'notion';
                      if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                      return true;
                    }).length > 0 ? (
                      getBlocksForItem(activeModalItem).filter(b => {
                        if (sidebarRailTab === 'articles') return b.type === 'notion';
                        if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                        return true;
                      }).map((blk, blkIdx) => {
                        const completed = isBlockCompleted(activeModalItem, blk, blkIdx);
                        return (
                          <div 
                            key={blk.id || blkIdx}
                            onClick={() => {
                              const el = document.getElementById(`block-view-${blk.id || blkIdx}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                setMobileDrawerOpen(false);
                              }
                            }}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                              completed ? 'border-teal-300 bg-teal-50/50 hover:bg-teal-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                {blk.type === 'video' && (blk.videoFileName || `Video Lesson #${blkIdx + 1}`)}
                                {blk.type === 'notion' && 'Article Document'}
                                {blk.type === 'quiz' && 'MCQ Quiz'}
                                {blk.type === 'file' && (blk.resourceFileName || 'Resource File')}
                              </h5>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBlockComplete(activeModalItem, blk, blkIdx);
                                }}
                                className="cursor-pointer p-0.5"
                                title={completed ? 'Completed (click to toggle)' : 'Click to mark as complete'}
                              >
                                {completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-300 hover:text-emerald-500 shrink-0" />
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                              <BookOpen className={`w-3 h-3 ${completed ? 'text-emerald-600' : 'text-gray-400'}`} />
                              <span>Block #{blkIdx + 1} {completed ? '• Complete' : '• Incomplete'}</span>
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      /* Fallback: Section items matching the filter tab */
                      sections.flatMap(s => s.items || []).filter(item => {
                        if (sidebarRailTab === 'articles') return item.contentType === 'notion' || getBlocksForItem(item).some(b => b.type === 'notion');
                        if (sidebarRailTab === 'quiz') return item.contentType === 'quiz' || getBlocksForItem(item).some(b => b.type === 'quiz');
                        return true;
                      }).map((secItem, sIdx) => (
                        <div
                          key={secItem.id || sIdx}
                          onClick={() => setActiveModalItem(secItem)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                            activeModalItem.id === secItem.id 
                              ? 'border-teal-400 bg-teal-50' 
                              : 'border-gray-200 hover:border-teal-200 bg-white hover:bg-teal-50/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {secItem.title}
                            </h5>
                            {completedItemIds[secItem.id] && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            {sidebarRailTab === 'quiz' ? <HelpCircle className="w-3 h-3 text-amber-500" /> : <BookOpen className="w-3 h-3 text-emerald-600" />}
                            <span>{sidebarRailTab === 'quiz' ? 'MCQ Assessment' : 'Article Topic'}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. RIGHT MAIN CONTENT READER AREA */}
                <div className="flex-1 bg-slate-50/50 p-6 sm:p-8 overflow-y-auto space-y-8">
                  {getBlocksForItem(activeModalItem).filter(b => {
                    if (sidebarRailTab === 'articles') return b.type === 'notion';
                    if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                    return true;
                  }).length > 0 ? (
                    getBlocksForItem(activeModalItem).filter(b => {
                      if (sidebarRailTab === 'articles') return b.type === 'notion';
                      if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                      return true;
                    }).map((block, blockIdx) => (
                      <div id={`block-view-${block.id || blockIdx}`} key={block.id || blockIdx} className="space-y-4">
                        {/* Block Header Divider */}
                        {getBlocksForItem(activeModalItem).length > 1 && (
                          <div className="flex items-center justify-between pb-2 border-b border-gray-200/80 text-xs font-bold text-[#0A317B]">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#1A9C9B] text-white font-mono flex items-center justify-center text-xs">
                                {blockIdx + 1}
                              </span>
                              <span className="uppercase tracking-wider">
                                {block.type === 'video' && 'Video Lesson Block'}
                                {block.type === 'notion' && 'Article / Study Document Block'}
                                {block.type === 'quiz' && 'Interactive MCQ Quiz Block'}
                                {block.type === 'file' && 'Resource File Attachment Block'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleBlockComplete(activeModalItem, block, blockIdx)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isBlockCompleted(activeModalItem, block, blockIdx)
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isBlockCompleted(activeModalItem, block, blockIdx) ? 'text-emerald-600 fill-emerald-100' : 'text-gray-400'}`} />
                              <span>{isBlockCompleted(activeModalItem, block, blockIdx) ? 'Completed' : 'Mark Complete'}</span>
                            </button>
                          </div>
                        )}

                        {/* BLOCK TYPE 1: DRAG & DROP VIDEO / HTML5 VIDEO PLAYER (PROTECTED) */}
                        {block.type === 'video' && (
                          <div className="space-y-3">
                            <SecureVideoPlayer
                              src={
                                protectedVideoUrls[block.id] ||
                                protectedVideoUrls[blockIdx] ||
                                (block.videoBlobUrl?.startsWith('blob:') ? block.videoBlobUrl : null) ||
                                (block.videoUrl?.startsWith('http') ? block.videoUrl : null) ||
                                (blockIdx === 0 ? (protectedVideoUrls[activeModalItem?.id] || protectedVideoUrls['active'] || (activeModalItem?.videoUrl?.startsWith('http') ? activeModalItem.videoUrl : null)) : null)
                              }
                              storagePath={
                                block.videoStoragePath ||
                                (block.videoUrl && !block.videoUrl.startsWith('http') && !block.videoUrl.startsWith('blob:') ? block.videoUrl : '') ||
                                (blockIdx === 0 ? (activeModalItem?.videoStoragePath || (activeModalItem?.videoUrl && !activeModalItem?.videoUrl.startsWith('http') && !activeModalItem?.videoUrl.startsWith('blob:') ? activeModalItem?.videoUrl : '')) : '')
                              }
                              title={block.title || activeModalItem?.title}
                              currentUser={currentUser}
                              autoPlay={blockIdx === 0}
                              fileName={block.videoFileName || (blockIdx === 0 ? activeModalItem?.videoFileName : '')}
                            />
                            <div className="flex items-center justify-between text-xs text-gray-500 font-mono px-1">
                              <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                Protected Stream: {block.videoFileName || (blockIdx === 0 ? activeModalItem?.videoFileName : '') || 'Secure Video Stream'}
                              </span>
                              <span className="text-[11px] text-gray-400 font-semibold">🔒 DRM Protected • Direct Downloads Blocked</span>
                            </div>
                          </div>
                        )}

                        {/* BLOCK TYPE 2: NOTION DOCUMENT READER */}
                        {block.type === 'notion' && (
                          <div className="p-6 rounded-2xl bg-white border border-gray-200 font-sans shadow-sm">
                            {renderNotionContent(block.notionDoc || activeModalItem.notionDoc)}
                          </div>
                        )}

                        {/* BLOCK TYPE 3: INTERACTIVE QUIZ & MCQS */}
                        {block.type === 'quiz' && (
                          <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
                              <span>Interactive Assessment Quiz</span>
                              <span>{(block.quizQuestions || activeModalItem.quizQuestions || []).length} Multiple Choice Questions</span>
                            </div>

                            {quizSubmitted && quizScore && (
                              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                                <div className="text-xl font-extrabold text-[#1A9C9B]">
                                  Quiz Score: {quizScore.correct} / {quizScore.total} ({Math.round((quizScore.correct / quizScore.total) * 100)}%)
                                </div>
                                <p className="text-xs text-gray-600">Great job! Your score has been submitted to your student record.</p>
                              </div>
                            )}

                            <div className="space-y-6">
                              {(block.quizQuestions || activeModalItem.quizQuestions || []).map((q, qIdx) => (
                                <div key={qIdx} className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                                  <h4 className="text-sm font-extrabold text-[#0A317B]">
                                    {qIdx + 1}. {q.question}
                                  </h4>

                                  <div className="space-y-2">
                                    {q.options?.map((opt, optIdx) => {
                                      const ansKey = `${blockIdx}-${qIdx}`;
                                      const isSelected = quizAnswers[ansKey] === optIdx || quizAnswers[qIdx] === optIdx;
                                      const isCorrect = q.correctIndex === optIdx;

                                      return (
                                        <label 
                                          key={optIdx} 
                                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                            quizSubmitted 
                                              ? isCorrect 
                                                ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' 
                                                : isSelected 
                                                  ? 'bg-red-50 border-red-300 text-red-800' 
                                                  : 'bg-white border-gray-200'
                                              : isSelected 
                                                ? 'bg-blue-50 border-[#0A317B] text-[#0A317B] font-bold' 
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="radio"
                                              name={`quiz-${blockIdx}-${qIdx}`}
                                              disabled={quizSubmitted}
                                              checked={isSelected}
                                              onChange={() => setQuizAnswers({ ...quizAnswers, [ansKey]: optIdx, [qIdx]: optIdx })}
                                              className="accent-[#0A317B]"
                                            />
                                            <span className="text-xs">{opt}</span>
                                          </div>

                                          {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {!quizSubmitted && (
                              <button
                                onClick={() => handleQuizSubmit(block.quizQuestions || activeModalItem.quizQuestions)}
                                className="w-full py-3 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                              >
                                Submit Answers & Grade Quiz
                              </button>
                            )}
                          </div>
                        )}

                        {/* BLOCK TYPE 4: FILE RESOURCE */}
                        {block.type === 'file' && (
                          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <File className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">
                                  {block.resourceFileName || 'Course Document Resource (.pdf / .zip)'}
                                </h5>
                                <p className="text-[10px] text-gray-500 font-mono">Attachment ready for download</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer">
                              Download File
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-3xl bg-white border border-gray-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FA9C16] flex items-center justify-center mx-auto">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-extrabold text-[#0A317B]">
                        {sidebarRailTab === 'quiz' ? 'No MCQ Quizzes on this Topic Page' : 'No Articles on this Topic Page'}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {sidebarRailTab === 'quiz' 
                          ? 'The Admin has not added an MCQ Quiz block to this topic canvas yet. Select a Quiz topic from the middle column or click "All" to view this page.' 
                          : 'The Admin has not added an Article block to this topic canvas yet. Select an Article topic from the middle column or click "All" to view this page.'}
                      </p>
                      <button 
                        onClick={() => setSidebarRailTab('all')}
                        className="px-4 py-2 rounded-xl bg-[#1A9C9B] text-white font-bold text-xs cursor-pointer"
                      >
                        View All Page Content
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Reader
                </button>

                <button
                  onClick={() => {
                    markComplete(activeModalItem.id);
                    setActiveModalItem(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Completed</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Feedback Submission Modal */}
      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)} 
      />
    </div>
  );
}
