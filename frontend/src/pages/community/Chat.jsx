import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiVideo, FiSearch } from 'react-icons/fi';
import Avatar from '../../components/ui/Avatar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { eApi } from '../../api/phaseEApi.js';
import useApi from '../../hooks/useApi.js';

const Chat = () => {
  const { data: convs, loading, error, refetch } = useApi(() => eApi.conversations(), []);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => { if (convs?.length && !active) setActive(convs[0]); }, [convs, active]);
  useEffect(() => {
    if (active) eApi.messages(active.id).then(setMessages).catch(() => setMessages([]));
  }, [active]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (loading) return <Loader label="جارٍ تحميل المحادثات…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const send = async () => {
    if (!text.trim() || !active) return;
    const t = text; setText('');
    setMessages((m) => [...m, { id: 'tmp' + Date.now(), sender: 'me', text: t }]);
    try { await eApi.sendMessage(active.id, { text: t }); } catch { /* optimistic */ }
  };

  return (
    <div className="grid h-[76vh] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Conversations Sidebar */}
      <aside className="glass flex flex-col overflow-hidden">
        <div className="border-b border-white/10 p-3">
          <div className="relative">
            <FiSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-ink-faint" size={15} />
            <input placeholder="بحث في المحادثات…" className="input ltr:pl-9 rtl:pr-9 py-2 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convs.map((c) => (
            <button key={c.id} onClick={() => setActive(c)}
              className={`flex w-full items-center gap-3 border-b border-white/5 p-3 text-start transition ${active?.id === c.id ? 'bg-gold/10' : 'hover:bg-white/5'}`}>
              <Avatar seed={c.seed} size={44} />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-ink">{c.name}</p>
                <p className="truncate text-xs text-ink-muted">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Messages Panel */}
      <section className="glass flex flex-col overflow-hidden">
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-white/10 p-3">
              <Avatar seed={active.seed} size={40} />
              <div className="flex-1">
                <p className="font-semibold text-ink">{active.name}</p>
                <p className="text-xs text-ok">{active.online ? 'متصل الآن' : 'غير متصل'}</p>
              </div>
              <button className="btn-ghost p-2"><FiVideo size={20} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.sender === 'me' ? 'bg-gold text-navy' : 'bg-navy-800 text-ink'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <button className="btn-ghost p-2"><FiPaperclip size={20} /></button>
              <input value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="اكتب رسالة…" className="input flex-1" />
              <button onClick={send} className="btn-gold px-4"><FiSend size={18} /></button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-ink-muted">اختر محادثة للبدء</div>
        )}
      </section>
    </div>
  );
};
export default Chat;
