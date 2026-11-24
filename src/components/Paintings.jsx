import { useState } from 'react';
import Window from './Window.jsx';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';
import { paintings } from '../data/paintings.js';
import { formatPrice } from '../format.js';
import { shop } from '../config.js';
import { navigate } from '../router.js';

// Windows 98 Paint palette
const PALETTE = [
  ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000'],
  ['#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'],
];

export const TOOLS = ['select', 'lasso', 'eraser', 'fill', 'picker', 'zoom', 'pencil', 'brush', 'spray', 'text', 'line', 'curve', 'rect', 'poly', 'ellipse', 'rrect'];

export function ToolGlyph({ tool }) {
  // Tiny SVG glyphs for the Paint toolbox (decorative)
  const s = { stroke: '#000', fill: 'none', strokeWidth: 1, shapeRendering: 'crispEdges' };
  const g = {
    select: <rect x="2.5" y="3.5" width="11" height="9" {...s} strokeDasharray="2 1" />,
    lasso: <path d="M8 3 L13 6 L11 12 L4 11 L3 6 Z" {...s} strokeDasharray="2 1" />,
    eraser: <path d="M3 10 L8 5 L13 8 L8 13 Z" fill="#ffff80" stroke="#000" />,
    fill: <path d="M4 7 L8 3 L12 7 L8 11 Z M12 8 v4" fill="#c0c0c0" stroke="#000" />,
    picker: <path d="M3 13 L10 6 M9 4 L12 7 M10 3 L13 6" stroke="#000" strokeWidth="1.5" />,
    zoom: (
      <>
        <circle cx="7" cy="7" r="3.5" {...s} />
        <path d="M10 10 L13 13" stroke="#000" strokeWidth="2" />
      </>
    ),
    pencil: <path d="M3 13 L4 10 L11 3 L13 5 L6 12 Z" fill="#ffff00" stroke="#000" />,
    brush: <path d="M7 2 h2 v6 h-2 Z M6 8 h4 v5 h-4 Z" fill="#804000" stroke="#000" />,
    spray: <path d="M5 6 h5 v8 h-5 Z M6 3 h3 v3 h-3 Z M11 3 h1 M13 4 h1 M12 6 h1" fill="#808080" stroke="#000" />,
    text: (
      <text x="8" y="13" textAnchor="middle" fontFamily="Times New Roman" fontWeight="bold" fontSize="13">
        A
      </text>
    ),
    line: <path d="M3 3 L13 13" stroke="#000" />,
    curve: <path d="M3 13 C 3 3, 13 13, 13 3" {...s} />,
    rect: <rect x="2.5" y="4.5" width="11" height="7" {...s} />,
    poly: <path d="M3 13 L5 4 L12 4 L10 9 L13 13 Z" {...s} />,
    ellipse: <ellipse cx="8" cy="8" rx="5.5" ry="3.5" {...s} />,
    rrect: <rect x="2.5" y="4.5" width="11" height="7" rx="2" {...s} />,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      {g[tool]}
    </svg>
  );
}

function PaintingCard({ p, onOpen }) {
  return (
    <button className={`painting ${p.sold ? 'is-sold' : ''}`} onClick={() => onOpen(p)}>
      <div className="painting-frame">
        {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <Icon name="picture" scale={3} />}
        {p.sold && <span className="sold-stamp">SOLD</span>}
      </div>
      <span className="painting-title">{p.title}</span>
      <span className="painting-price">{p.sold ? 'Sold' : formatPrice(p.price)}</span>
    </button>
  );
}

export default function Paintings() {
  const [tool, setTool] = useState('pencil');
  const [fg, setFg] = useState('#f0f0f0');
  const [bg, setBg] = useState('#1c1c1c');
  const [open, setOpen] = useState(null);

  const available = paintings.filter((p) => !p.sold).length;

  return (
    <>
      <Window
        id="paintings"
        title="Paintings for Sale"
        icon="picture"
        className="paint"
        menu={['File', 'Edit', 'View', 'Image', 'Options', 'Help']}
        statusBar={[
          paintings.length ? `${paintings.length} painting(s), ${available} available. Click a painting for details.` : 'For Help, click Help Topics on the Help Menu.',
          `Ships: ${shop.shippingRegion}`,
        ]}
      >
        <div className="paint-main">
          <div className="paint-toolbox">
            <div className="paint-tools">
              {TOOLS.map((t) => (
                <button key={t} className={`paint-tool ${tool === t ? 'pressed' : ''}`} onClick={() => setTool(t)} aria-label={t} title={t}>
                  <ToolGlyph tool={t} />
                </button>
              ))}
            </div>
            <div className="paint-tool-options field-border-disabled" />
          </div>

          <div className="paint-canvas-wrap sunken-panel">
            <div className="paint-canvas" style={{ background: bg }}>
              {paintings.length === 0 ? (
                <div className="paint-empty" style={{ color: fg }}>
                  <Icon name="picture" scale={4} />
                  <p>New paintings are on the way.</p>
                  <p className="muted">Original works by VARK will be available to buy here soon.</p>
                </div>
              ) : (
                <div className="painting-grid" style={{ color: fg }}>
                  {paintings.map((p) => (
                    <PaintingCard key={p.id} p={p} onOpen={setOpen} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="paint-palette">
          <div className="paint-swatch-current" onContextMenu={(e) => e.preventDefault()}>
            <span className="sw-bg" style={{ background: bg }} />
            <span className="sw-fg" style={{ background: fg }} />
          </div>
          <div className="paint-swatches">
            {PALETTE.flat().map((c) => (
              <button
                key={c}
                className="paint-swatch"
                style={{ background: c }}
                aria-label={`Colour ${c}`}
                title="Left-click: text colour · Right-click: canvas colour"
                onClick={() => setFg(c)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setBg(c);
                }}
              />
            ))}
          </div>
          <button className="paint-shop-btn default" onClick={() => navigate('/shop?cat=paintings')}>
            <Icon name="cart" />
            Visit Shop →
          </button>
        </div>
      </Window>

      {open && (
        <Dialog
          title={`${open.title} - Properties`}
          width={560}
          onClose={() => setOpen(null)}
          buttons={[
            open.sold
              ? { label: 'Sold', disabled: true }
              : {
                label: 'View in Shop →',
                primary: true,
                onClick: () => {
                  const id = open.id;
                  setOpen(null);
                  navigate(`/shop/item/painting/${id}`);
                },
              },
            { label: 'Close', onClick: () => setOpen(null) },
          ]}
        >
          <div className="painting-detail">
            <div className="painting-detail-img field-border">
              {open.image ? <img src={open.image} alt={open.title} /> : <Icon name="picture" scale={6} />}
              {open.sold && <span className="sold-stamp big">SOLD</span>}
            </div>
            <dl className="painting-props">
              <dt>Title:</dt>
              <dd>{open.title}</dd>
              {open.medium && (
                <>
                  <dt>Medium:</dt>
                  <dd>{open.medium}</dd>
                </>
              )}
              {open.size && (
                <>
                  <dt>Size:</dt>
                  <dd>{open.size}</dd>
                </>
              )}
              {open.year && (
                <>
                  <dt>Year:</dt>
                  <dd>{open.year}</dd>
                </>
              )}
              <dt>Price:</dt>
              <dd>{open.sold ? 'Sold' : formatPrice(open.price)}</dd>
            </dl>
            {open.description && <p className="painting-desc">{open.description}</p>}
          </div>
        </Dialog>
      )}
    </>
  );
}
