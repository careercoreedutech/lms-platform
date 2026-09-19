import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  LogOut, 
  UserCheck, 
  UserX,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  FolderPlus,
  FilePlus,
  HelpCircle,
  FileText,
  Video,
  FileCode,
  UploadCloud,
  Check,
  Layers,
  ChevronRight,
  ChevronDown,
  Eye,
  File,
  X,
  Edit3,
  Image as ImageIcon,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LayoutGrid,
  Award,
  Star,
  Building,
  Mail,
  Briefcase,
  BarChart3,
  Settings,
  Bell,
  Bookmark,
  Calendar,
  Share2,
  ArrowRight,
  Grid,
  List,
  Lightbulb,
  Cloud
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

const PRESET_IMAGES = [
  { label: 'Full Stack', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80' },
  { label: 'Cloud & DevOps', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80' },
  { label: 'Product Mgmt', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80' },
  { label: 'Business Analyst', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80' },
  { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=80' },
  { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80' },
  { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80' }
];

const INITIAL_MENTORS = [
  {
    id: 'm1',
    name: 'Dr. Arjun Mehta',
    role: 'Staff AI Research Engineer',
    company: 'Google DeepMind',
    course: 'Artificial Intelligence & Machine Learning',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    rating: 4.9,
    reviewsCount: 142,
    mentees: 210,
    status: 'Active',
    experience: '12+ Years',
    bio: 'Former IIT researcher & AI Lead at DeepMind. Specializes in LLMs, Transformer architectures, and neural networks.'
  },
  {
    id: 'm2',
    name: 'Priya Sharma',
    role: 'Principal Full Stack Architect',
    company: 'Microsoft Azure',
    course: 'Full Stack Web Development',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    rating: 4.9,
    reviewsCount: 198,
    mentees: 340,
    status: 'Active',
    experience: '10+ Years',
    bio: 'Architected high-scale distributed microservices and modern React applications serving 50M+ daily requests.'
  },
  {
    id: 'm3',
    name: 'Vikramaditya Roy',
    role: 'Head of Cloud & DevOps',
    company: 'Amazon AWS',
    course: 'Cloud Computing & DevOps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    rating: 4.8,
    reviewsCount: 88,
    mentees: 165,
    status: 'Active',
    experience: '9+ Years',
    bio: 'Kubernetes certified instructor, Terraform enthusiast, and AWS community hero guiding hands-on CI/CD pipelines.'
  },
  {
    id: 'm4',
    name: 'Ananya Deshmukh',
    role: 'Group Product Manager',
    company: 'Uber Technologies',
    course: 'Product Management Masterclass',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    rating: 5.0,
    reviewsCount: 112,
    mentees: 195,
    status: 'Active',
    experience: '8+ Years',
    bio: 'Product leader driving growth & monetisation loops. Guides students in product teardowns, metrics & PRDs.'
  },
  {
    id: 'm5',
    name: 'Rohan Verma',
    role: 'Lead Business Intelligence & Analytics',
    company: 'McKinsey & Company',
    course: 'Business Analyst Specialization',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    rating: 4.8,
    reviewsCount: 76,
    mentees: 130,
    status: 'Active',
    experience: '7+ Years',
    bio: 'Consultant passionate about turning raw enterprise data into actionable business strategy with SQL & Tableau.'
  },
  {
    id: 'm6',
    name: 'Sneha Kapoor',
    role: 'Design Director & UX Lead',
    company: 'Figma',
    course: 'UI/UX Design & User Research',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    rating: 4.9,
    reviewsCount: 94,
    mentees: 175,
    status: 'Active',
    experience: '8+ Years',
    bio: 'Design system creator and advocate for human-centered design, user testing, and interactive prototyping.'
  }
];

const PRESET_MENTOR_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
];

export default function AdminPanel() {
  const { users, courses, approveUser, rejectUser, createCourse, deleteCourse, logout, setActiveView } = useLms();
  
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'mentors' | 'programs' | 'students' | 'analytics' | 'settings'
  const [adminCourseMode, setAdminCourseMode] = useState('list'); // 'list' | 'create'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'alphabetical' | 'duration'
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mentors state and management
  const [mentors, setMentors] = useState(() => {
    try {
      const saved = localStorage.getItem('careercore_lms_mentors_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load mentors', e);
    }
    return INITIAL_MENTORS;
  });
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    id: '',
    name: '',
    role: '',
    company: '',
    course: 'Full Stack Web Development',
    avatar: PRESET_MENTOR_AVATARS[0],
    rating: 4.9,
    reviewsCount: 120,
    mentees: 180,
    status: 'Active',
    experience: '8+ Years',
    bio: ''
  });
  const [mentorStatusFilter, setMentorStatusFilter] = useState('ALL');

  // Save mentors to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('careercore_lms_mentors_v1', JSON.stringify(mentors));
    } catch (e) {
      console.error('Failed to save mentors', e);
    }
  }, [mentors]);

  // Settings State
  const [platformSettings, setPlatformSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('careercore_lms_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      platformName: 'CareerCore Edutech',
      adminEmail: 'admin@careercore.com',
      autoApprove: false,
      emailAlerts: true,
      weeklyDigest: true
    };
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('careercore_lms_settings_v1', JSON.stringify(platformSettings));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3000);
    } catch (e) {}
  };

  // Mentor handlers
  const handleOpenAddMentor = () => {
    setMentorForm({
      id: `mentor-${Date.now()}`,
      name: '',
      role: '',
      company: '',
      course: courses[0]?.title || 'Full Stack Web Development',
      avatar: PRESET_MENTOR_AVATARS[0],
      rating: 4.9,
      reviewsCount: 1,
      mentees: 25,
      status: 'Active',
      experience: '5+ Years',
      bio: ''
    });
    setShowMentorModal(true);
  };

  const handleOpenEditMentor = (m) => {
    setMentorForm({ ...m });
    setShowMentorModal(true);
  };

  const handleSaveMentor = (e) => {
    if (e) e.preventDefault();
    if (!mentorForm.name.trim()) return;

    setMentors(prev => {
      const exists = prev.some(item => item.id === mentorForm.id);
      if (exists) {
        return prev.map(item => item.id === mentorForm.id ? mentorForm : item);
      } else {
        return [mentorForm, ...prev];
      }
    });
    setShowMentorModal(false);
  };

  const handleDeleteMentor = (mentorId) => {
    if (window.confirm('Are you sure you want to remove this mentor profile?')) {
      setMentors(prev => prev.filter(m => m.id !== mentorId));
    }
  };

  const handleToggleMentorStatus = (mentorId) => {
    setMentors(prev => prev.map(m => {
      if (m.id === mentorId) {
        return { ...m, status: m.status === 'Active' ? 'On Leave' : 'Active' };
      }
      return m;
    }));
  };

  const filteredMentors = mentors.filter(m => {
    const matchesFilter = mentorStatusFilter === 'ALL' || m.status === mentorStatusFilter;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Selected item tracking in the 3-column Course Builder
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showCourseMetaModal, setShowCourseMetaModal] = useState(false); // Header popup modal state
  const [addTopicModalSecIdx, setAddTopicModalSecIdx] = useState(null); // Content Type Selection Modal for + Add Topic (New Sidebar Page)
  const [addBlockModalOpen, setAddBlockModalOpen] = useState(false); // Content Type Selection Modal for + Canvas Button (Add Block to Page)
  
  // Dedicated Course Creation Form State
  const [courseForm, setCourseForm] = useState({
    id: '',
    title: '',
    title1: '',
    title2: '',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
    category: '',
    duration: '',
    price: '',
    description: '',
    buttonText: 'Enroll',
    redirectCourse: '',
    sections: [
      {
        weekNumber: 1,
        title: 'Week 1: Introduction and Fundamentals',
        items: [
          { 
            title: 'Day 1: Course Overview & Setup (Video)', 
            contentType: 'video', 
            videoFileName: '',
            videoBlobUrl: '',
            blocks: [
              { id: 'b_init_1', type: 'video', videoFileName: '', videoBlobUrl: '' }
            ],
            articles: 1, 
            mcqs: 0, 
            status: 'Start' 
          },
          { 
            title: 'Day 2: Core Concepts (Article)', 
            contentType: 'notion', 
            notionDoc: `# Day 2: Core Concepts Guide\n\n### Overview\nWelcome to the official study notes for Day 2.\n\n> **Pro Tip**: Review the key takeaways below.`,
            blocks: [
              { id: 'b_init_2', type: 'notion', notionDoc: `# Day 2: Core Concepts Guide\n\n### Overview\nWelcome to the official study notes for Day 2.\n\n> **Pro Tip**: Review the key takeaways below.` }
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
            articles: 1,
            mcqs: 2,
            status: 'Start',
            quizQuestions: [
              {
                question: 'What is the primary role of a Product Manager during Discovery?',
                options: ['Writing CSS code', 'Validating customer pain points', 'Managing hardware', 'Tax auditing'],
                correctIndex: 1
              }
            ],
            blocks: [
              {
                id: 'b_init_3',
                type: 'quiz',
                quizQuestions: [
                  {
                    question: 'What is the primary role of a Product Manager during Discovery?',
                    options: ['Writing CSS code', 'Validating customer pain points', 'Managing hardware', 'Tax auditing'],
                    correctIndex: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      { weekNumber: 3, title: 'Week 3: Advanced Topics', items: [] },
      { weekNumber: 4, title: 'Week 4: Projects & Case Studies', items: [] },
      { weekNumber: 5, title: 'Week 5: Final Assessment', items: [] }
    ]
  });

  const pendingCount = users.filter(u => u.status === 'PENDING').length;
  const approvedCount = users.filter(u => u.status === 'APPROVED').length;
  const rejectedCount = users.filter(u => u.status === 'REJECTED').length;

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'ALL' || u.status === filter;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Dynamic Handlers
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
      quizQuestions: item.quizQuestions || (type === 'quiz' ? [{ question: 'What is the key takeaway?', options: ['Option A', 'Option B'], correctIndex: 0 }] : [])
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

  // Toggle Section Collapse
  const toggleCollapse = (secIdx) => {
    setCollapsedSections(prev => ({ ...prev, [secIdx]: !prev[secIdx] }));
  };

  // Drag & Drop Video Handler
  const handleVideoFileUpload = (secIdx, itemIdx, file) => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCourseForm(prev => {
      const updatedSections = [...prev.sections];
      if (updatedSections[secIdx]?.items?.[itemIdx]) {
        updatedSections[secIdx].items[itemIdx].videoFileName = file.name;
        updatedSections[secIdx].items[itemIdx].videoBlobUrl = blobUrl;
      }
      return { ...prev, sections: updatedSections };
    });
  };

  // Quiz Question Handlers
  const addQuizQuestion = (secIdx, itemIdx) => {
    setCourseForm(prev => {
      const updatedSections = [...prev.sections];
      if (updatedSections[secIdx]?.items?.[itemIdx]) {
        const currentQuestions = updatedSections[secIdx].items[itemIdx].quizQuestions || [];
        updatedSections[secIdx].items[itemIdx].quizQuestions = [
          ...currentQuestions,
          {
            question: `Question ${currentQuestions.length + 1}: Enter question title here...`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 0
          }
        ];
      }
      return { ...prev, sections: updatedSections };
    });
  };

  const handleEditCourse = (courseToEdit, openMode = 'builder') => {
    setCourseForm({
      id: courseToEdit.id,
      title: courseToEdit.title || '',
      title1: courseToEdit.title1 || '',
      title2: courseToEdit.title2 || '',
      image: courseToEdit.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
      category: courseToEdit.category || '',
      duration: courseToEdit.duration || '',
      price: courseToEdit.price || '',
      description: courseToEdit.description || '',
      buttonText: courseToEdit.buttonText || 'Enroll',
      redirectCourse: courseToEdit.redirectCourse || courseToEdit.title || '',
      sections: courseToEdit.sections && courseToEdit.sections.length > 0 ? courseToEdit.sections : [
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

    if (openMode === 'meta') {
      setShowCourseMetaModal(true);
    } else {
      setAdminCourseMode('create');
    }
  };

  const handleStartNewCourse = (openMode = 'builder') => {
    setCourseForm({
      id: `course-${Date.now()}`,
      title: '',
      title1: '',
      title2: '',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
      category: 'Engineering',
      duration: '6 Weeks',
      price: '₹30,000',
      description: 'Master practical industry skills with project-based learning and expert mentor feedback.',
      buttonText: 'Enroll',
      redirectCourse: '',
      sections: [
        {
          weekNumber: 1,
          title: 'Week 1: Introduction and Fundamentals',
          items: [
            { 
              title: 'Day 1: Course Overview & Setup (Video)', 
              contentType: 'video', 
              videoFileName: '',
              videoBlobUrl: '',
              blocks: [
                { id: 'b_init_1', type: 'video', videoFileName: '', videoBlobUrl: '' }
              ],
              articles: 1, 
              mcqs: 0, 
              status: 'Start' 
            }
          ]
        }
      ]
    });
    setActiveSecIdx(0);
    setActiveItemIdx(0);

    if (openMode === 'meta') {
      setShowCourseMetaModal(true);
    } else {
      setAdminCourseMode('create');
    }
  };

  const handleSaveCourse = (e) => {
    if (e) e.preventDefault();
    if (!courseForm.title.trim()) {
      setShowCourseMetaModal(true);
      return;
    }

    createCourse(courseForm);
    setAdminCourseMode('list');
    setShowCourseMetaModal(false);
  };

  const renderCourseMetaModal = () => (
    <AnimatePresence>
      {showCourseMetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 border border-gray-100 relative my-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-[#FA9C16]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A317B]">
                    {courseForm.id ? 'Edit Course & Card Details' : 'Create Course & Card'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Customize the card image, dual-tone title, description, and button action for "Our Courses & Programs".
                  </p>
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
              {/* Course Title */}
              <div>
                <label className="text-xs font-extrabold text-[#0A317B] block mb-1">
                  Course Title / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setCourseForm(prev => ({
                      ...prev,
                      title: newTitle,
                      redirectCourse: prev.redirectCourse ? prev.redirectCourse : newTitle
                    }));
                  }}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0A317B] bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                  required
                />
              </div>

              {/* Dual-Tone Card Split (Optional) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#0A317B]">Dual-Tone Card Title (Optional)</span>
                  <span className="text-[10px] text-gray-400 font-mono">Auto-splits if left blank</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#22d3dd] block mb-0.5">Top Line (Cyan)</label>
                    <input
                      type="text"
                      value={courseForm.title1 || ''}
                      onChange={e => setCourseForm({ ...courseForm, title1: e.target.value })}
                      placeholder="e.g. Full Stack"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-2 focus:ring-[#22d3dd] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#f18f01] block mb-0.5">Bottom Line (Orange)</label>
                    <input
                      type="text"
                      value={courseForm.title2 || ''}
                      onChange={e => setCourseForm({ ...courseForm, title2: e.target.value })}
                      placeholder="e.g. Developer"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-2 focus:ring-[#f18f01] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card Cover Image URL & Presets */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#0A317B] block mb-1">
                  Card Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={courseForm.image || ''}
                    onChange={e => setCourseForm({ ...courseForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                  />
                  {courseForm.image && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-2xs">
                      <img src={courseForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">Quick Preset Covers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setCourseForm({ ...courseForm, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          courseForm.image === preset.url
                            ? 'bg-[#1A9C9B] text-white border-[#1A9C9B]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Description */}
              <div>
                <label className="text-xs font-extrabold text-[#0A317B] block mb-1">
                  Card Description (Shown on Card Hover)
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description || ''}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Describe the skills taught, curriculum highlights, and career outcomes..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Button Action / Redirect Target */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <label className="text-xs font-extrabold text-[#0A317B] block">
                  Card Button Action & Redirect Target
                </label>
                <p className="text-[11px] text-gray-500">
                  When a student clicks the card button, which course should they enroll in?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Button Label</label>
                    <input
                      type="text"
                      value={courseForm.buttonText || 'Enroll'}
                      onChange={e => setCourseForm({ ...courseForm, buttonText: e.target.value })}
                      placeholder="e.g. Enroll"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none font-bold text-[#0A317B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Stick / Redirect to Course</label>
                    <select
                      value={courseForm.redirectCourse || courseForm.title || ''}
                      onChange={e => setCourseForm({ ...courseForm, redirectCourse: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none font-bold text-[#0A317B] cursor-pointer"
                    >
                      <option value={courseForm.title || 'This Course'}>This Course ({courseForm.title || 'New Course'})</option>
                      {courses
                        .filter(c => c.title !== courseForm.title)
                        .map((c, i) => (
                          <option key={i} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Category, Duration & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Category</label>
                  <input
                    type="text"
                    value={courseForm.category || ''}
                    onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                    placeholder="e.g. Engineering"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration || ''}
                    onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 12 Weeks"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#0A317B] block mb-1">Price / Fee</label>
                  <input
                    type="text"
                    value={courseForm.price || ''}
                    onChange={e => setCourseForm({ ...courseForm, price: e.target.value })}
                    placeholder="e.g. ₹35,000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCourseMetaModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!courseForm.title.trim()) {
                    alert('Course title is required!');
                    return;
                  }
                  createCourse(courseForm);
                  setShowCourseMetaModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0A317B] hover:bg-[#07245c] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Course & Card</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderMentorModal = () => (
    <AnimatePresence>
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 border border-slate-100 relative my-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-[#FA9C16]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    {mentorForm.id && mentors.some(m => m.id === mentorForm.id) ? 'Edit Mentor Profile' : 'Add New Industry Mentor'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add senior engineers & industry leaders to guide CareerCore learners.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMentorModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveMentor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mentor Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.name}
                    onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })}
                    placeholder="e.g. Dr. Arjun Mehta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Role / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.role}
                    onChange={e => setMentorForm({ ...mentorForm, role: e.target.value })}
                    placeholder="e.g. Staff AI Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.company}
                    onChange={e => setMentorForm({ ...mentorForm, company: e.target.value })}
                    placeholder="e.g. Google DeepMind"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Track / Course */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Assigned Program / Specialization
                  </label>
                  <select
                    value={mentorForm.course}
                    onChange={e => setMentorForm({ ...mentorForm, course: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id || c.title} value={c.title}>{c.title}</option>
                    ))}
                    <option value="General Engineering & Careers">General Engineering & Careers</option>
                  </select>
                </div>

                {/* Experience & Status */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={mentorForm.experience}
                    onChange={e => setMentorForm({ ...mentorForm, experience: e.target.value })}
                    placeholder="e.g. 10+ Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mentor Status
                  </label>
                  <select
                    value={mentorForm.status}
                    onChange={e => setMentorForm({ ...mentorForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Rating & Mentees */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={mentorForm.rating}
                    onChange={e => setMentorForm({ ...mentorForm, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Total Mentees Guided
                  </label>
                  <input
                    type="number"
                    value={mentorForm.mentees}
                    onChange={e => setMentorForm({ ...mentorForm, mentees: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar URL & Presets */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mentor Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs">
                    <img src={mentorForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="url"
                    value={mentorForm.avatar}
                    onChange={e => setMentorForm({ ...mentorForm, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  {PRESET_MENTOR_AVATARS.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMentorForm({ ...mentorForm, avatar: imgUrl })}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        mentorForm.avatar === imgUrl ? 'border-blue-600 scale-110 shadow-xs' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Professional Bio / Background
                </label>
                <textarea
                  rows={2}
                  value={mentorForm.bio}
                  onChange={e => setMentorForm({ ...mentorForm, bio: e.target.value })}
                  placeholder="Summarize engineering expertise, key achievements, and mentorship focus areas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMentorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Save Mentor Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Full-Screen Dedicated Course Builder Page (No Window Borders!)
  if (adminCourseMode === 'create') {
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
              onClick={() => setAdminCourseMode('list')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A317B]">Create New Custom Course (Full Page Builder)</h2>
              <p className="text-xs text-gray-500">Add Drag & Drop Video Files, Notion Articles, or Custom MCQ Quizzes.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCourseMetaModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#FA9C16] border border-amber-200/80 font-extrabold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Course Details & Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminCourseMode('list')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              Cancel & Return
            </button>

            <button
              type="button"
              onClick={handleSaveCourse}
              className="px-5 py-2 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Course</span>
            </button>
          </div>
        </header>

        {/* Unified Edge-to-Edge Workspace (Single Page, No Separate Window Cards) */}
        <form onSubmit={handleSaveCourse} className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-65px)] bg-white">
          
          {/* LEFT SIDEBAR (w-full lg:w-64 shrink-0): Flush Left Sidebar Tree */}
          <div className="w-full lg:w-64 shrink-0 border-r border-gray-200 p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-1 rounded-lg bg-teal-50 text-[#1A9C9B] shrink-0">
                      <FolderPlus className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-extrabold text-[#0A317B] text-[11px] truncate">Structure</h3>
                  </div>

                  <button
                    type="button"
                    onClick={addSectionFolder}
                    className="px-2 py-1 rounded-lg bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-extrabold text-[10px] flex items-center gap-0.5 cursor-pointer transition-all shadow-2xs shrink-0"
                    title="Add Week Section"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Week</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-0.5">
                  {courseForm.sections.map((sec, secIdx) => {
                    const isCollapsed = collapsedSections[secIdx];
                    const hasActive = safeSecIdx === secIdx;

                    return (
                      <div key={secIdx} className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-2xs">
                        {/* Week Header Bar */}
                        <div className={`p-1.5 px-2 flex items-center justify-between gap-1 border-b border-gray-100 transition-colors ${hasActive ? 'bg-blue-50/80' : 'bg-slate-50/70'}`}>
                          <div className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer" onClick={() => { setActiveSecIdx(secIdx); if (sec.items?.length > 0) setActiveItemIdx(0); }}>
                            <span className="w-4 h-4 rounded-full bg-[#0A317B] text-white font-extrabold text-[9px] flex items-center justify-center shrink-0">
                              {secIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={e => {
                                const updated = [...courseForm.sections];
                                updated[secIdx].title = e.target.value;
                                setCourseForm({ ...courseForm, sections: updated });
                              }}
                              className="w-full text-[10px] font-bold text-[#0A317B] bg-transparent focus:outline-none truncate"
                            />
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleCollapse(secIdx)}
                              className="p-0.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            {courseForm.sections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSectionFolder(secIdx)}
                                className="p-0.5 text-red-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Nested Topic Items */}
                        {!isCollapsed && (
                          <div className="p-1 space-y-1 bg-white">
                            {sec.items?.map((item, itemIdx) => {
                              const isSelected = safeSecIdx === secIdx && safeItemIdx === itemIdx;

                              return (
                                <div
                                  key={itemIdx}
                                  onClick={() => {
                                    setActiveSecIdx(secIdx);
                                    setActiveItemIdx(itemIdx);
                                  }}
                                  className={`p-1.5 px-2 rounded-lg border flex items-center justify-between gap-1 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/80 text-[#0A317B] ring-1 ring-blue-500/20 shadow-2xs'
                                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-1 text-[10px] font-bold truncate min-w-0">
                                    {item.contentType === 'video' && <Video className="w-3 h-3 text-blue-500 shrink-0" />}
                                    {item.contentType === 'notion' && <FileText className="w-3 h-3 text-teal-600 shrink-0" />}
                                    {item.contentType === 'quiz' && <HelpCircle className="w-3 h-3 text-amber-500 shrink-0" />}
                                    {item.contentType === 'file' && <File className="w-3 h-3 text-rose-500 shrink-0" />}
                                    <span className="truncate">{item.title}</span>
                                  </div>

                                  <span className="text-[8px] text-gray-400 font-mono capitalize shrink-0">{item.contentType}</span>
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => setAddTopicModalSecIdx(secIdx)}
                              className="w-full py-1 px-1.5 rounded-lg border border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50/40 text-gray-600 font-bold text-[9px] flex items-center justify-center gap-0.5 transition-all cursor-pointer mt-0.5"
                            >
                              <Plus className="w-3 h-3 text-[#1A9C9B]" />
                              <span>+ Add Topic</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
          </div>

          {/* MAIN CONTENT AREA (flex-1 min-w-0): Content & Media Editor */}
          <div className="flex-1 min-w-0 p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[calc(100vh-65px)] bg-white">
            <div className="space-y-4">
                
                {/* Selected Item Header */}
                {currentActiveItem ? (
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                        {currentActiveItem.contentType === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                        {currentActiveItem.contentType === 'notion' && <FileText className="w-5 h-5 text-teal-600" />}
                        {currentActiveItem.contentType === 'quiz' && <HelpCircle className="w-5 h-5 text-amber-600" />}
                        {currentActiveItem.contentType === 'file' && <File className="w-5 h-5 text-rose-600" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={currentActiveItem.title}
                          onChange={e => {
                            const updated = [...courseForm.sections];
                            if (updated[safeSecIdx]?.items?.[safeItemIdx]) {
                              updated[safeSecIdx].items[safeItemIdx].title = e.target.value;
                              setCourseForm({ ...courseForm, sections: updated });
                            }
                          }}
                          className="w-full font-extrabold text-sm text-[#0A317B] border-b border-transparent focus:border-blue-400 focus:outline-none bg-transparent"
                        />
                        <p className="text-[11px] text-gray-400 truncate">
                          {currentSection.title || `Week ${safeSecIdx + 1}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={currentActiveItem.contentType}
                        onChange={e => {
                          updateTypeForCurrentTopic(e.target.value);
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-extrabold text-[#0A317B] focus:outline-none cursor-pointer"
                      >
                        <option value="video">Video</option>
                        <option value="notion">Article / Notion</option>
                        <option value="quiz">MCQ Quiz</option>
                        <option value="file">File / Resource</option>
                      </select>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-extrabold text-[#0A317B] transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1A9C9B]" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeTopicItem(safeSecIdx, safeItemIdx)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400 text-xs">Select or add a topic from the left panel to edit content.</div>
                )}

                {/* CONTENT EDITOR CANVAS */}
                {currentActiveItem && (
                  <div className="space-y-6">
                    {getBlocksForItem(currentActiveItem).map((block, blockIdx) => (
                      <div key={block.id || blockIdx} className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4 relative shadow-2xs">
                        {/* Block Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            {block.type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                            {block.type === 'notion' && <FileText className="w-4 h-4 text-teal-600" />}
                            {block.type === 'quiz' && <HelpCircle className="w-4 h-4 text-amber-500" />}
                            {block.type === 'file' && <File className="w-4 h-4 text-rose-500" />}
                            <span className="text-xs font-bold capitalize text-[#0A317B]">
                              {block.type === 'video' && 'Video Player Block'}
                              {block.type === 'notion' && 'Article / Document Block'}
                              {block.type === 'quiz' && 'MCQ Quiz Block'}
                              {block.type === 'file' && 'Resource Attachment Block'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeBlockFromCurrentTopic(blockIdx)}
                            className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Block from Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

                        {/* BLOCK TYPE 4: FILE / RESOURCE */}
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

                    {/* CANVAS ADD CONTENT PLUS BUTTON (Adds Content Block to THIS Page) */}
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
            </div>
          </form>

        {/* Modal Popup: Select Content Type for New Topic */}
        <AnimatePresence>
          {addTopicModalSecIdx !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-gray-100 relative"
              >
                {/* Header */}
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

                  <button
                    type="button"
                    onClick={() => setAddTopicModalSecIdx(null)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Content Type Choices */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={(e) => addTopicItem(addTopicModalSecIdx, 'video', e)}
                    className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Video Lesson</p>
                      <p className="text-[10px] text-gray-500">Drag & drop native video</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addTopicItem(addTopicModalSecIdx, 'notion', e)}
                    className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Article / Notion</p>
                      <p className="text-[10px] text-gray-500">Document & notes editor</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addTopicItem(addTopicModalSecIdx, 'quiz', e)}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">MCQ Quiz</p>
                      <p className="text-[10px] text-gray-500">Interactive questions</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addTopicItem(addTopicModalSecIdx, 'file', e)}
                    className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <File className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">File Resource</p>
                      <p className="text-[10px] text-gray-500">PDF, ZIP, or DOCX file</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Popup: Add Content Block to CURRENT PAGE */}
        <AnimatePresence>
          {addBlockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-gray-100 relative"
              >
                {/* Header */}
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

                  <button
                    type="button"
                    onClick={() => setAddBlockModalOpen(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Content Type Choices */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={(e) => addBlockToCurrentTopic('video', e)}
                    className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Video Lesson</p>
                      <p className="text-[10px] text-gray-500">Drag & drop native video</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addBlockToCurrentTopic('notion', e)}
                    className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">Article / Notion</p>
                      <p className="text-[10px] text-gray-500">Document & notes editor</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addBlockToCurrentTopic('quiz', e)}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">MCQ Quiz</p>
                      <p className="text-[10px] text-gray-500">Interactive questions</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => addBlockToCurrentTopic('file', e)}
                    className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <File className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#0A317B]">File Resource</p>
                      <p className="text-[10px] text-gray-500">PDF, ZIP, or DOCX file</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Popup: Course Details & Pricing */}
        {renderCourseMetaModal()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 p-4 sticky top-0 md:h-screen z-20">
        <div className="space-y-6">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer select-none" 
            onClick={() => setActiveView('landing')}
          >
            <img 
              src="/logo.png" 
              alt="CareerCore Edutech Logo" 
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
              { id: 'mentors', label: 'Mentors', icon: Award, count: mentors.length },
              { id: 'programs', label: 'Programs', icon: Layers, count: courses.length },
              { id: 'students', label: 'Students', icon: Users, badge: pendingCount },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.badge === undefined && item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Floating Card: "Keep Building" */}
        <div className="p-4 rounded-2xl bg-[#F0F7FF] border border-blue-100/80 space-y-2 relative overflow-hidden mt-6">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB]">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-[#0F172A] text-xs">Keep Building</h5>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              Great courses create better learners.
            </p>
          </div>
          <svg className="w-14 h-4 text-blue-300 stroke-current fill-none stroke-2 mt-1" viewBox="0 0 50 15">
            <path d="M0 10 Q12 0 25 10 T50 10" />
          </svg>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Search Pill */}
          <div className="relative w-full max-w-md sm:max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search courses, programs, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-full text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setAdminTab('students')}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title={`${pendingCount} Pending Student Approvals`}
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  AA
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#0F172A]">Administrator</p>
                    <p className="text-[10px] text-slate-400 font-mono">admin@careercore.com</p>
                  </div>

                  <button
                    onClick={() => { setUserDropdownOpen(false); setActiveView('landing'); }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>Back to Landing</span>
                  </button>

                  <button
                    onClick={() => { setUserDropdownOpen(false); logout(); }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard / Content Body */}
        <main className="p-6 sm:p-8 space-y-7 max-w-[1600px] mx-auto w-full">
          
          {/* Top Hero Banner */}
          {adminTab === 'dashboard' && (
            <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 border border-blue-100/90 rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
              {/* Left Info */}
              <div className="space-y-1.5 max-w-lg z-10">
                <span className="text-[11px] font-extrabold text-[#2563EB] tracking-wider uppercase">
                  ADMIN CONTROL CENTER
                </span>
                <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Manage Courses & Build Better Learning
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Approve student access requests, assign senior mentors, and build hierarchical course file structures.
                </p>
              </div>

              {/* Center Vector Illustration */}
              <div className="hidden lg:flex items-center justify-center relative w-44 h-28 shrink-0 z-10">
                <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25" y="95" width="110" height="18" rx="4" fill="#3B82F6" />
                  <rect x="20" y="80" width="115" height="16" rx="4" fill="#60A5FA" />
                  <rect x="30" y="65" width="100" height="16" rx="4" fill="#93C5FD" />
                  <path d="M80 28L40 46L80 64L120 46L80 28Z" fill="#1D4ED8" />
                  <rect x="62" y="52" width="36" height="14" rx="2" fill="#1E40AF" />
                  <path d="M120 46V68" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="120" cy="71" r="3.5" fill="#F59E0B" />
                  <path d="M145 88L150 115H170L175 88H145Z" fill="#93C5FD" />
                  <ellipse cx="160" cy="88" rx="15" ry="4" fill="#60A5FA" />
                  <path d="M160 88C155 70 145 65 140 68C140 76 150 82 160 88Z" fill="#34D399" />
                  <path d="M160 88C165 68 178 65 182 70C180 78 170 82 160 88Z" fill="#10B981" />
                  <path d="M160 88C160 62 162 55 165 52C168 55 165 72 160 88Z" fill="#059669" />
                </svg>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3 z-10 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => handleStartNewCourse('meta')}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-blue-50/80 text-[#2563EB] border border-blue-200/90 shadow-2xs transition-all flex items-center gap-3 cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#2563EB]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#2563EB]">Quick Add Course Card</div>
                    <div className="text-[10px] text-slate-400 font-medium">Create a new course in seconds</div>
                  </div>
                </button>

                <button
                  onClick={() => handleStartNewCourse('builder')}
                  className="px-5 py-3 rounded-2xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white shadow-md transition-all flex items-center gap-3 cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center shrink-0 text-white">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">Create Course Structure</div>
                    <div className="text-[10px] text-blue-200 font-medium">Build full course with hierarchy</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 4 Stats Cards */}
          {adminTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Courses */}
              <div 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setAdminTab('programs')}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Total Courses</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0F172A]">{courses.length}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <span>Published</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Mentors */}
              <div 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setAdminTab('mentors')}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FA9C16] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Industry Mentors</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0F172A]">{mentors.length}</span>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                      <span>Faculty</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Programs */}
              <div 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setAdminTab('programs')}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Total Programs</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0F172A]">{courses.length} Tracks</span>
                    <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-0.5">
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setAdminTab('students')}
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Pending Approvals</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0F172A]">{pendingCount}</span>
                    <span className="text-amber-500 text-xs">
                      <Clock className="w-3.5 h-3.5 inline" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DASHBOARD */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Header with Title and Grid/List Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4.5 bg-[#2563EB] rounded-full" />
                    <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
                      Course & Landing Card Manager
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-normal mt-1 max-w-2xl">
                    Courses listed here dynamically display in "Our Courses & Programs". You can customize card image, dual-tone titles, description, and enrollment redirect target.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'}`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'}`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="px-3 py-1.5 pr-7 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                    >
                      <option value="latest">Sort by: Latest</option>
                      <option value="alphabetical">Sort by: Name</option>
                      <option value="duration">Sort by: Duration</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Course Cards Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses
                    .filter(c => {
                      if (!searchTerm.trim()) return true;
                      const term = searchTerm.toLowerCase();
                      return (
                        c.title?.toLowerCase().includes(term) ||
                        c.category?.toLowerCase().includes(term) ||
                        c.description?.toLowerCase().includes(term)
                      );
                    })
                    .sort((a, b) => {
                      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
                      if (sortBy === 'duration') return (a.duration || '').localeCompare(b.duration || '');
                      return 0;
                    })
                    .map((c) => {
                      const titleParts = (() => {
                        if (c.title1 && c.title2) return { t1: c.title1, t2: c.title2 };
                        const words = (c.title || 'Course Program').trim().split(/\s+/);
                        if (words.length === 1) return { t1: words[0], t2: '' };
                        const mid = Math.ceil(words.length / 2);
                        return {
                          t1: words.slice(0, mid).join(' '),
                          t2: words.slice(mid).join(' ')
                        };
                      })();

                      return (
                        <div key={c.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                          <div>
                            {/* Image Header */}
                            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                              <img 
                                src={c.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80'} 
                                alt={c.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                              
                              {/* Category Badge */}
                              <div className="absolute top-3 left-3">
                                <span className={`px-2.5 py-1 rounded-full text-white text-[10px] font-extrabold uppercase shadow-sm flex items-center gap-1 ${
                                  c.category?.toLowerCase().includes('ai') ? 'bg-[#7C3AED]' :
                                  c.category?.toLowerCase().includes('cloud') ? 'bg-[#0284C7]' :
                                  c.category?.toLowerCase().includes('product') ? 'bg-[#EA580C]' :
                                  c.category?.toLowerCase().includes('design') ? 'bg-[#D97706]' :
                                  'bg-[#2563EB]'
                                }`}>
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{c.category || 'Engineering'}</span>
                                </span>
                              </div>

                              {/* Bookmark Icon */}
                              <button 
                                type="button" 
                                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>

                              {/* Bottom Overlay Title & Dual-tone Pills */}
                              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <h4 className="text-base font-extrabold drop-shadow-sm line-clamp-1">{c.title}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="px-2 py-0.5 rounded-md bg-[#1E3A8A]/90 text-white font-bold text-[10px] backdrop-blur-xs">
                                    {titleParts.t1}
                                  </span>
                                  {titleParts.t2 && (
                                    <span className="px-2 py-0.5 rounded-md bg-[#312E81]/90 text-white font-bold text-[10px] backdrop-blur-xs">
                                      {titleParts.t2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 sm:p-5 space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{c.duration || '12 Weeks'}</span>
                                </span>
                                <span className="font-extrabold text-[#0D9488]">
                                  {c.price || '₹35,000'}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                {c.description || 'A comprehensive, industry-aligned curriculum designed with senior mentors.'}
                              </p>

                              {/* Card Metadata Box */}
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div className="space-y-1 text-[11px] text-slate-500 font-medium">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400">Card Button:</span>
                                    <span className="font-bold text-[#0F172A]">{c.buttonText || 'Enroll'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400">Redirects to:</span>
                                    <span className="font-bold text-[#2563EB] truncate max-w-[130px]">{c.redirectCourse || c.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400">Curriculum:</span>
                                    <span className="text-slate-700">{c.sections?.length || 1} Weeks ({c.totalCount || 5} Lessons)</span>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1.5 items-end">
                                  <button
                                    onClick={() => handleEditCourse(c, 'meta')}
                                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                                  >
                                    <span>View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleEditCourse(c, 'builder')}
                                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                      title="Edit Curriculum"
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to remove "${c.title}"?`)) {
                                          deleteCourse(c.id);
                                        }
                                      }}
                                      className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                      title="Delete Course"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                /* Course Cards List View */
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
                  {courses.map(c => (
                    <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={c.image} alt={c.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-sm text-[#0F172A]">{c.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">{c.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-400">
                            <span className="text-[#2563EB] font-bold">{c.category}</span>
                            <span>•</span>
                            <span>{c.duration}</span>
                            <span>•</span>
                            <span className="font-bold text-[#0D9488]">{c.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleEditCourse(c, 'meta')}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#2563EB] font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditCourse(c, 'builder')}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Curriculum
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${c.title}"?`)) deleteCourse(c.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB: MENTORS & INDUSTRY FACULTY */}
          {adminTab === 'mentors' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#FA9C16] tracking-wider uppercase flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> SENIOR FACULTY & INDUSTRY EXPERTS
                  </span>
                  <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight">
                    Mentors Management
                  </h2>
                  <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
                    Connect students with senior engineering leaders from Google, Amazon, Microsoft, Meta & Uber for 1-on-1 mentorship, code reviews, and mock interviews.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenAddMentor}
                    className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Mentor</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  {['ALL', 'Active', 'On Leave'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMentorStatusFilter(st)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mentorStatusFilter === st
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st} {st === 'Active' && `(${mentors.filter(m => m.status === 'Active').length})`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search mentor by name, company, or course..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMentors.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
                    <Award className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-600">No mentors match your search criteria</p>
                    <button
                      type="button"
                      onClick={handleOpenAddMentor}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-[#2563EB] text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      + Add New Mentor
                    </button>
                  </div>
                ) : (
                  filteredMentors.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Top Row: Avatar + Status + Verified */}
                        <div className="flex items-start justify-between">
                          <div className="relative">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                                m.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'
                              }`}
                              title={m.status}
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              m.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                        </div>

                        {/* Name & Role */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-[#0F172A] text-base group-hover:text-[#2563EB] transition-colors">
                              {m.name}
                            </h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {m.role}
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold mt-2">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{m.company}</span>
                          </div>
                        </div>

                        {/* Assigned Course Tag */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Domain Track
                          </p>
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50/80 text-[#2563EB] font-bold text-[11px] border border-blue-100">
                            {m.course}
                          </span>
                        </div>

                        {/* Stats Row: Rating + Mentees + Exp */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold">Rating</p>
                            <p className="text-xs font-black text-amber-600 flex items-center justify-center gap-0.5 mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{m.rating}</span>
                            </p>
                          </div>
                          <div className="border-x border-slate-200/80">
                            <p className="text-[10px] text-slate-400 font-semibold">Mentees</p>
                            <p className="text-xs font-black text-[#0F172A] mt-0.5">{m.mentees}+</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold">Exp</p>
                            <p className="text-xs font-black text-slate-700 mt-0.5">{m.experience}</p>
                          </div>
                        </div>

                        {/* Bio snippet */}
                        {m.bio && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
                            "{m.bio}"
                          </p>
                        )}
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleMentorStatus(m.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {m.status === 'Active' ? 'Mark On Leave' : 'Mark Active'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMentor(m)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMentor(m.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove Mentor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PROGRAMS & CURRICULUM */}
          {adminTab === 'programs' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-200/80 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#1A9C9B] tracking-wider uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> CAREER TRACKS & CERTIFICATIONS
                  </span>
                  <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight">
                    Academic Programs & Curriculums
                  </h2>
                  <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
                    View structured programs, configure curriculum modules, manage video lessons, quizzes, and landing page presentation cards.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartNewCourse('builder')}
                    className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Program</span>
                  </button>
                </div>
              </div>

              {/* Programs List / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course, idx) => {
                  const totalModules = course.sections ? course.sections.length : 0;
                  const totalItems = course.sections
                    ? course.sections.reduce((acc, s) => acc + (s.items ? s.items.length : 0), 0)
                    : 0;

                  return (
                    <div
                      key={course.id || idx}
                      className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Cover Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <img
                            src={course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
                              {course.category || 'Career Track'}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <span className="text-[10px] font-bold text-blue-200">
                              {course.duration || '6 Weeks'} Intensive
                            </span>
                            <h4 className="text-base font-extrabold leading-snug drop-shadow-sm">
                              {course.title}
                            </h4>
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-5 space-y-3.5">
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {course.description || 'Master industry-relevant skills with practical projects, expert mentor feedback, and portfolio reviews.'}
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-center">
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] text-slate-400 font-semibold">Curriculum</p>
                              <p className="text-xs font-black text-[#0F172A] mt-0.5">{totalModules} Modules ({totalItems} items)</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] text-slate-400 font-semibold">Tuition</p>
                              <p className="text-xs font-black text-emerald-600 mt-0.5">{course.price || '₹30,000'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="p-5 pt-0 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditCourse(course, 'builder')}
                          className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Curriculum Builder</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditCourse(course, 'meta')}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                          title="Edit Card Appearance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete program "${course.title}"?`)) deleteCourse(course.id);
                          }}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-400 text-xs font-bold transition-colors cursor-pointer"
                          title="Delete Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: STUDENTS APPROVAL QUEUE */}
          {adminTab === 'students' && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilter(st)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filter === st ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st} {st === 'PENDING' && `(${pendingCount})`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by student name, email, or course..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-3.5 px-6">Student Details</th>
                        <th className="py-3.5 px-6">Course Selected</th>
                        <th className="py-3.5 px-6">Application Date</th>
                        <th className="py-3.5 px-6">Access Status</th>
                        <th className="py-3.5 px-6 text-right">Admin Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-mono text-xs">
                            No student records found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                              <div className="font-bold text-[#0F172A]">{user.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{user.email} (Username: {user.username})</div>
                            </td>

                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-200/60">
                                {user.course}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                              {user.registeredAt}
                            </td>

                            <td className="py-4 px-6">
                              {user.status === 'PENDING' && (
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-[#FA9C16] font-extrabold text-[10px] border border-amber-200 flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3 animate-pulse" /> PENDING APPROVAL
                                </span>
                              )}

                              {user.status === 'APPROVED' && (
                                <span className="px-3 py-1 rounded-full bg-teal-50 text-[#1A9C9B] font-extrabold text-[10px] border border-teal-200 flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3" /> APPROVED & ACTIVE
                                </span>
                              )}

                              {user.status === 'REJECTED' && (
                                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-extrabold text-[10px] border border-red-200 flex items-center gap-1 w-fit">
                                  <XCircle className="w-3 h-3" /> ACCESS REJECTED
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {user.status !== 'APPROVED' && (
                                  <button
                                    onClick={() => approveUser(user.id)}
                                    className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {user.status !== 'REJECTED' && (
                                  <button
                                    onClick={() => rejectUser(user.id)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {adminTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A]">Platform Performance & Learner Analytics</h4>
                    <p className="text-xs text-slate-500">Track active enrollment velocity, completion metrics, and mentor satisfaction ratings.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <p className="text-xs font-semibold text-slate-500">Total Enrolled Learners</p>
                    <p className="text-2xl font-black text-[#2563EB] mt-1">{users.filter(u => u.status === 'APPROVED').length}</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Verified active students</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <p className="text-xs font-semibold text-slate-500">Pending Applications</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">Awaiting admin review</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                    <p className="text-xs font-semibold text-slate-500">Published Courses</p>
                    <p className="text-2xl font-black text-[#0D9488] mt-1">{courses.length}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">Active curriculum tracks</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <p className="text-xs font-semibold text-slate-500">Industry Mentors</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">{mentors.length}</p>
                    <p className="text-[10px] text-purple-600 font-semibold mt-1">Active mentor faculty</p>
                  </div>
                </div>

                {/* Enrollment Distribution */}
                <div className="pt-6 space-y-3">
                  <h5 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                    Program Enrollment Distribution
                  </h5>
                  {users.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No student enrollments yet. New registrations will automatically reflect here in real-time.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {courses.map((course, i) => {
                        const count = users.filter(u => u.course && (u.course.toLowerCase().includes(course.title.toLowerCase()) || course.title.toLowerCase().includes(u.course.toLowerCase()))).length;
                        const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
                        const colors = ['bg-blue-600', 'bg-teal-500', 'bg-purple-600', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-600'];
                        const color = colors[i % colors.length];

                        return (
                          <div key={course.id || i} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-700">{course.title}</span>
                              <span className="text-slate-500">{count} students ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {adminTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5 max-w-2xl">
                <div>
                  <h4 className="text-base font-extrabold text-[#0F172A]">System Settings & Control</h4>
                  <p className="text-xs text-slate-500">Configure platform identity, notification preferences, and student enrollment policies.</p>
                </div>

                {settingsSavedToast && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Settings and configurations saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Platform Brand Name</label>
                    <input
                      type="text"
                      value={platformSettings.platformName}
                      onChange={e => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Administrator Email</label>
                    <input
                      type="email"
                      value={platformSettings.adminEmail}
                      onChange={e => setPlatformSettings({ ...platformSettings, adminEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Toggle Controls */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">Auto-Approve Student Registrations</p>
                        <p className="text-[11px] text-slate-400">Instantly grant access upon application without manual review</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={platformSettings.autoApprove}
                        onChange={e => setPlatformSettings({ ...platformSettings, autoApprove: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">New Student Registration Email Alerts</p>
                        <p className="text-[11px] text-slate-400">Receive instant notification email when a learner enrolls</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={platformSettings.emailAlerts}
                        onChange={e => setPlatformSettings({ ...platformSettings, emailAlerts: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">Weekly Learner Analytics Digest</p>
                        <p className="text-[11px] text-slate-400">Summary of platform engagement, quiz pass rates, and mentor hours</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={platformSettings.weeklyDigest}
                        onChange={e => setPlatformSettings({ ...platformSettings, weeklyDigest: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Render Course Card Meta Modal */}
      {renderCourseMetaModal()}

      {/* Render Mentor Modal */}
      {renderMentorModal()}
    </div>
  );
}
