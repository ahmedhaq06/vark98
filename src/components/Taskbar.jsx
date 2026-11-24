import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { useCart } from '../cart.jsx';
import { site } from '../config.js';
import { navigate, usePathname } from '../router.js';

export const SECTIONS = [
  { id: 'home', label: 'Welcome', icon: 'computer' },
  { id: 'music', label: 'Music', icon: 'note' },
  { id: 'paintings', label: 'Paintings', icon: 'picture' },
  { id: 'cds', label: 'CDs', icon: 'cd' },
  { id: 'shop', label: 'Shop', icon: 'cart', route: '/shop' },
  { id: 'gigs', label: 'Gigs', icon: 'calendar' },
  { id: 'links', label: 'Links', icon: 'globe' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
];

const goSection = (id, onShop) => {
  if (onShop) {
    navigate('/');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return <span className="tray-clock">{now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>;
}

export default function Taskbar({ onShutDown }) {
  const [startOpen, setStartOpen] = useState(false);
  const [active, setActive] = useState('home');
  const menuRef = useRef(null);
  const cart = useCart();
  const path = usePathname();
  const onShop = path.startsWith('/shop');

  // Highlight the taskbar button of the section in view when on the desktop
  useEffect(() => {
    if (onShop) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.filter((s) => !s.route).forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onShop]);

  // Close Start menu on outside click
  useEffect(() => {
    if (!startOpen) return;
    const close = (e) => !menuRef.current?.contains(e.target) && setStartOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [startOpen]);

  const pick = (fn) => () => {
    setStartOpen(false);
    fn();
  };

  const openSection = (s) => (s.route ? navigate(s.route) : goSection(s.id, onShop));

  return (
    <footer className="taskbar">
      <div className="start-wrap" ref={menuRef}>
        <button className={`start-btn ${startOpen ? 'pressed' : ''}`} onClick={() => setStartOpen((o) => !o)}>
          <Icon name="flag" />
          <b>Start</b>
        </button>
        {startOpen && (
          <div className="start-menu window">
            <div className="start-banner">
              <span>
                <b>{site.artist}</b>98
              </span>
            </div>
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button onClick={pick(() => openSection(s))}>
                    <Icon name={s.icon} />
                    {s.label}
                  </button>
                </li>
              ))}
              <li className="sep" />
              <li>
                <button onClick={pick(() => navigate('/shop/cart'))}>
                  <Icon name="cart" />
                  Shopping Cart ({cart.count})
                </button>
              </li>
              <li className="sep" />
              <li>
                <button onClick={pick(onShutDown)}>
                  <Icon name="shutdown" />
                  Shut Down...
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <span className="taskbar-divider" />

      <nav className="taskbar-tasks">
        {SECTIONS.map((s) => {
          const isPressed = onShop ? s.id === 'shop' : active === s.id;
          return (
            <button key={s.id} className={`task-btn ${isPressed ? 'pressed' : ''}`} onClick={() => openSection(s)}>
              <Icon name={s.icon} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="tray">
        <button className="tray-btn" onClick={() => navigate('/shop/cart')} title="Shopping Cart" aria-label={`Cart, ${cart.count} items`}>
          <Icon name="cart" />
          {cart.count > 0 && <span className="tray-badge">{cart.count}</span>}
        </button>
        <Icon name="speaker" />
        <Clock />
      </div>
    </footer>
  );
}
