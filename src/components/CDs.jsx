import { useState } from 'react';
import Window from './Window.jsx';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';
import { cds } from '../data/cds.js';
import { formatPrice } from '../format.js';
import { navigate } from '../router.js';

/** CDs, shown as a Windows Explorer folder. */
export default function CDs() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(null);

  const soldOut = (c) => c.stock === 0;

  return (
    <>
      <Window
        id="cds"
        title="D:\VARK Discography"
        icon="cd"
        className="explorer"
        menu={['File', 'Edit', 'View', 'Go', 'Favorites', 'Help']}
        statusBar={[`${cds.length} object(s)`, 'My Computer']}
      >
        <div className="explorer-toolbar">
          <button disabled>Back</button>
          <button disabled>Forward</button>
          <button disabled>Up</button>
          <button className="explorer-shop-btn default" onClick={() => navigate('/shop?cat=cds')}>
            <Icon name="cart" />
            Visit Shop →
          </button>
        </div>
        <div className="explorer-address">
          <label htmlFor="cd-addr">Address</label>
          <div className="explorer-addr-field field-border">
            <Icon name="cd" />
            <input id="cd-addr" readOnly value="D:\VARK Discography" />
          </div>
        </div>

        <div className="explorer-view sunken-panel" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          {cds.length === 0 ? (
            <div className="explorer-empty">
              <Icon name="cd" scale={4} />
              <p>Please insert a disc into drive D:</p>
              <p className="muted">CDs are coming soon.</p>
            </div>
          ) : (
            <div className="explorer-grid">
              {cds.map((c) => (
                <button
                  key={c.id}
                  className={`explorer-item ${selected === c.id ? 'selected' : ''}`}
                  onClick={() => setSelected(c.id)}
                  onDoubleClick={() => setOpen(c)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpen(c)}
                >
                  <span className="explorer-thumb">{c.cover ? <img src={c.cover} alt="" loading="lazy" /> : <Icon name="cd" scale={3} />}</span>
                  <span className="explorer-label">{c.title}</span>
                  <span className="explorer-sub">{soldOut(c) ? 'Sold out' : formatPrice(c.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {cds.length > 0 && <p className="explorer-hint">Double-click a CD to open it.</p>}
      </Window>

      {open && (
        <Dialog
          title={`${open.title} Properties`}
          width={480}
          onClose={() => setOpen(null)}
          buttons={[
            soldOut(open)
              ? { label: 'Sold Out', disabled: true }
              : {
                label: 'View in Shop →',
                primary: true,
                onClick: () => {
                  const id = open.id;
                  setOpen(null);
                  navigate(`/shop/item/cd/${id}`);
                },
              },
            { label: 'Close', onClick: () => setOpen(null) },
          ]}
        >
          <div className="cd-detail">
            <div className="cd-detail-cover field-border">{open.cover ? <img src={open.cover} alt={`${open.title} cover`} /> : <Icon name="cd" scale={6} />}</div>
            <div>
              <h3 className="cd-detail-title">{open.title}</h3>
              <p>
                {open.year} · {formatPrice(open.price)}
              </p>
              {open.tracks?.length > 0 && (
                <ol className="cd-tracks">
                  {open.tracks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
