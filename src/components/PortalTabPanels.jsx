import React, { useEffect, useState } from 'react';
import { StickyNote, Video, Trophy, Megaphone, CheckCircle2 } from 'lucide-react';
import { getNextBatchStart } from '../config/site';

function EmptyPanel({ icon: Icon, title, children }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-gray-200 text-center space-y-3 max-w-2xl">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1A9C9B] flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-extrabold text-[#0A317B]">{title}</h3>
      <div className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

// Personal notes, saved in this browser for this student and course.
function NotesPanel({ studentId, courseTitle }) {
  const key = `careercore_notes_${studentId || 'guest'}_${courseTitle || 'course'}`;
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    try { setText(localStorage.getItem(key) || ''); } catch (e) { setText(''); }
  }, [key]);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(key, text); setSavedAt(new Date()); } catch (e) {}
    }, 500);
    return () => clearTimeout(t);
  }, [key, text]);

  return (
    <div className="max-w-3xl space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0A317B] flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-[#1A9C9B]" /> My notes · {courseTitle}
        </h3>
        {savedAt && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>
      <label htmlFor="portal-notes" className="sr-only">My notes</label>
      <textarea
        id="portal-notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder="Jot down key ideas, commands and questions for your mentor. Notes save automatically on this device."
        className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A9C9B]/40 resize-y"
      />
      <p className="text-[11px] text-gray-400">Notes are stored in this browser only.</p>
    </div>
  );
}

export default function PortalTabPanel({ tab, currentUser, courseTitle, completed, total }) {
  if (tab === 'NOTES') return <NotesPanel studentId={currentUser?.id} courseTitle={courseTitle} />;

  if (tab === 'LIVE') {
    const next = getNextBatchStart();
    return (
      <EmptyPanel icon={Video} title="No live sessions scheduled right now">
        <p>Live classes and mentor office hours will be listed here with a join link as soon as they're scheduled.</p>
        {next && (
          <p>
            Next batch kick-off:{' '}
            <b className="text-slate-700">
              {next.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} IST
            </b>
          </p>
        )}
      </EmptyPanel>
    );
  }

  if (tab === 'LEADERBOARD') {
    return (
      <EmptyPanel icon={Trophy} title="Leaderboard opens when your batch starts">
        <p>Rankings are based on lessons completed and quiz scores across your batch.</p>
        <p>
          Your progress so far: <b className="text-slate-700">{completed} of {total} lessons</b>.
        </p>
      </EmptyPanel>
    );
  }

  if (tab === 'NOTICEBOARD') {
    return (
      <EmptyPanel icon={Megaphone} title="No notices yet">
        <p>Announcements from your mentors and the CareerCore team, like schedule changes and assignment deadlines, will appear here.</p>
      </EmptyPanel>
    );
  }

  return null;
}
