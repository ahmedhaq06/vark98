import { useEffect, useRef, useState } from 'react';
import { site } from '../config.js';

/**
 * Placeholder responder — swap this out for an LLM + knowledge base endpoint later.
 */
async function askRover(question) {
  const q = question.toLowerCase();
  if (q.includes('who') || q.includes('vark') || q.includes('music') || q.includes('genre')) {
    return `${site.artist} is a ${site.tagline} artist. I'm still waiting on his full bio and tracklist!`;
  }
  if (q.includes('paint') || q.includes('art') || q.includes('cd') || q.includes('shop') || q.includes('buy') || q.includes('ship')) {
    return `You can browse ${site.artist}'s paintings and CDs in the Shop (All India shipping).`;
  }
  return `Woof! My knowledge base isn't connected yet — check back soon to ask more about ${site.artist}.`;
}

/** Windows XP Search Companion-style dog in the bottom-right corner. */
export default function RoverChat() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sprite = open ? '/rover/chat.png' : hovered ? '/rover/hover.png' : '/rover/idle.png';

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setThinking(true);
    try {
      const reply = await askRover(text);
      setMessages((m) => [...m, { role: 'dog', text: reply }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="rover-wrap">
      {open && (
        <div className="rover-bubble window" role="dialog" aria-label={`Ask about ${site.artist}`}>
          <div className="rover-bubble-bar">
            <span>Ask about {site.artist}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="rover-messages sunken-panel" ref={listRef}>
            {messages.length === 0 ? (
              <p className="rover-empty">Ask me anything about {site.artist}...</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`rover-msg is-${m.role}`}>
                  <b>{m.role === 'user' ? 'You' : 'Rover'}:</b> {m.text}
                </div>
              ))
            )}
            {thinking && <div className="rover-msg is-dog muted">Reading...</div>}
          </div>

          <form className="rover-form" onSubmit={send}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${site.artist}...`}
              aria-label="Ask a question"
            />
            <button type="submit" className="default" disabled={!input.trim() || thinking}>
              Ask
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="rover-btn"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={open ? 'Close assistant' : `Ask about ${site.artist}`}
        title={open ? 'Close assistant' : `Ask about ${site.artist}`}
      >
        <img src={sprite} alt="Desktop dog assistant" />
      </button>
    </div>
  );
}
