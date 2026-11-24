import { useCallback, useState } from 'react';
import BootScreen from './components/BootScreen.jsx';
import Taskbar from './components/Taskbar.jsx';
import Welcome from './components/Welcome.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import Videos from './components/Videos.jsx';
import Paintings from './components/Paintings.jsx';
import CDs from './components/CDs.jsx';
import Gigs from './components/Gigs.jsx';
import Links from './components/Links.jsx';
import Contact from './components/Contact.jsx';
import Shop from './components/Shop.jsx';
import StickyNote from './components/StickyNote.jsx';
import RoverChat from './components/RoverChat.jsx';
import ShutDown from './components/ShutDown.jsx';
import { CartProvider } from './cart.jsx';
import { boot, site } from './config.js';
import { usePathname } from './router.js';

const BOOT_KEY = 'vark-booted';

const shouldBoot = () => {
  if (new URLSearchParams(location.search).has('boot')) return true;
  if (!boot.oncePerSession) return true;
  return !sessionStorage.getItem(BOOT_KEY);
};

export default function App() {
  const [phase, setPhase] = useState(shouldBoot() ? 'boot' : 'desktop'); // boot | desktop | off
  const path = usePathname();
  const onShop = path.startsWith('/shop');

  const finishBoot = useCallback(() => {
    sessionStorage.setItem(BOOT_KEY, '1');
    setPhase('desktop');
  }, []);
  const shutDown = useCallback(() => setPhase('off'), []);
  const restart = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase('boot');
  }, []);

  if (phase === 'off') return <ShutDown onRestart={restart} />;

  return (
    <CartProvider>
      {phase === 'boot' && <BootScreen durationMs={boot.durationMs} onDone={finishBoot} />}
      <div className={`desktop ${phase === 'boot' ? 'is-booting' : ''}`}>
        <main className="desktop-content">
          {onShop ? (
            <Shop path={path} />
          ) : (
            <>
              <StickyNote />
              <Welcome />
              <MusicPlayer />
              <Paintings />
              <CDs />
              <Gigs />
              <Videos />
              <Links />
              <Contact />
            </>
          )}
          <p className="desktop-footer">
            © {new Date().getFullYear()} {site.artist}. All rights reserved.
          </p>
        </main>
        {!onShop && <RoverChat />}
        <Taskbar onShutDown={shutDown} />
      </div>
    </CartProvider>
  );
}
