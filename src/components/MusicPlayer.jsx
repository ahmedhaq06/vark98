import Window from './Window.jsx';
import { site } from '../config.js';

const SPOTIFY_ARTIST_ID = '1ZPrQdzfOL25ppQa4LlkpJ';

/** Music section using the official Spotify artist embed inside a Win98 window. */
export default function MusicPlayer() {
  const spotifyUrl = site.socials.find((s) => s.label === 'Spotify')?.url || `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}`;

  return (
    <Window
      id="music"
      title={`${site.artist} - Spotify`}
      icon="note"
      className="music-embed-win"
      menu={['File', 'Edit', 'View', 'Play', 'Help']}
      statusBar={[
        'Streaming via Spotify',
        <a key="open" href={spotifyUrl} target="_blank" rel="noreferrer">
          Open in Spotify ↗
        </a>,
      ]}
    >
      <div className="sunken-panel spotify-wrap">
        <iframe
          className="spotify-embed"
          src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${site.artist} on Spotify`}
        />
      </div>
    </Window>
  );
}
