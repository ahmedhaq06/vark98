import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { TOOLS, ToolGlyph } from './Paintings.jsx';
import { paintings } from '../data/paintings.js';
import { cds } from '../data/cds.js';
import { useCart } from '../cart.jsx';
import { formatPrice } from '../format.js';
import { shop, site } from '../config.js';
import { navigate } from '../router.js';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

function buildCatalog() {
  const pItems = paintings.map((p) => ({
    key: `painting:${p.id}`,
    type: 'painting',
    id: p.id,
    title: p.title,
    image: p.image,
    images: p.images?.length ? p.images : [p.image],
    price: p.price,
    year: p.year,
    subtitle: [p.medium, p.size].filter(Boolean).join(' · '),
    description: p.description,
    colors: p.colors || ['#000000', '#ffffff', '#ff0000'],
    unavailable: Boolean(p.sold),
    unavailableLabel: 'SOLD',
    max: 1,
    sample: p.sample,
  }));
  const cItems = cds.map((c) => ({
    key: `cd:${c.id}`,
    type: 'cd',
    id: c.id,
    title: c.title,
    image: c.cover,
    images: c.images?.length ? c.images : [c.cover],
    price: c.price,
    year: c.year,
    subtitle: `${c.tracks?.length || c.trackCount ? `${c.tracks?.length || c.trackCount} tracks · ` : ''}Audio CD`,
    tracks: c.tracks,
    description: c.description,
    unavailable: c.stock === 0,
    unavailableLabel: 'OUT OF STOCK',
    max: c.stock ?? 10,
    sample: c.sample,
  }));
  return [...pItems, ...cItems];
}

function getInitialCategory() {
  const cat = new URLSearchParams(window.location.search).get('cat');
  return cat === 'paintings' || cat === 'cds' ? cat : 'all';
}

function ieAddress(path, category) {
  if (path === '/shop/cart') return 'http://www.vark98.in/shop/cart.asp';
  if (path === '/shop/checkout') return 'http://www.vark98.in/shop/checkout.asp';
  if (path.startsWith('/shop/item/')) return `http://www.vark98.in${path}.htm`;
  return category === 'all' ? 'http://www.vark98.in/shop/index.htm' : `http://www.vark98.in/shop/${category}.htm`;
}

function ProductCard({ item, inCart, onAdd, onView }) {
  return (
    <article className={`ie-card ${item.unavailable ? 'is-unavailable' : ''}`}>
      <button className="ie-card-thumb" onClick={onView}>
        <img src={item.image} alt={item.title} loading="lazy" />
        {item.sample && <span className="ie-sample-tag">SAMPLE</span>}
        {item.unavailable && <span className="ie-sold-stamp">{item.unavailableLabel}</span>}
      </button>
      <div className="ie-card-body">
        <span className="ie-card-cat">{item.type === 'painting' ? 'Original Painting' : 'Music CD'}</span>
        <a
          href={`/shop/item/${item.type}/${item.id}`}
          className="ie-card-title"
          onClick={(e) => {
            e.preventDefault();
            onView();
          }}
        >
          {item.title}
        </a>
        {item.subtitle && <div className="ie-card-sub">{item.subtitle}</div>}
        <div className="ie-card-price">{item.unavailable ? item.unavailableLabel : formatPrice(item.price)}</div>
        <div className="ie-card-actions">
          <button onClick={onView}>Details</button>
          <button
            className="default"
            disabled={item.unavailable || (item.max === 1 && inCart)}
            onClick={onAdd}
          >
            {item.unavailable ? item.unavailableLabel : item.max === 1 && inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

const VIEWER_PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
];

function PaintViewer({ item, activeImage }) {
  const [tool, setTool] = useState('fill');
  const [fg, setFg] = useState(item.colors?.[0] || '#000000');
  const [bg, setBg] = useState('#1c1c1c');

  return (
    <div className="window win ie-paint-viewer">
      <div className="title-bar">
        <div className="title-bar-text">
          <Icon name="picture" className="title-icon" />
          <span>{item.title} - Paint</span>
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" disabled />
          <button aria-label="Maximize" disabled />
          <button aria-label="Close" disabled />
        </div>
      </div>

      <nav className="win-menubar">
        {['File', 'Edit', 'View', 'Image', 'Options'].map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </nav>

      <div className="ie-paint-main">
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
          <div className="ie-paint-canvas" style={{ background: bg }}>
            <img src={activeImage || item.image} alt={item.title} />
            {item.unavailable && <span className="ie-sold-stamp big">{item.unavailableLabel}</span>}
          </div>
        </div>
      </div>

      <div className="paint-palette">
        <div className="paint-swatch-current" onContextMenu={(e) => e.preventDefault()}>
          <span className="sw-bg" style={{ background: bg }} />
          <span className="sw-fg" style={{ background: fg }} />
        </div>
        <div className="ie-paint-swatches">
          {VIEWER_PALETTE.map((c) => (
            <button
              key={c}
              className="paint-swatch"
              style={{ background: c }}
              aria-label={`Canvas colour ${c}`}
              title="Click to change background colour"
              onClick={() => setBg(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setFg(c);
              }}
            />
          ))}
        </div>
      </div>

      <div className="status-bar">
        <p className="status-bar-field">Click any colour to change the canvas background.</p>
        <p className="status-bar-field">{VIEWER_PALETTE.length} colours</p>
      </div>
    </div>
  );
}

function ProductDetail({ item, inCart, onAdd, onBack }) {
  const [angleIdx, setAngleIdx] = useState(0);

  if (!item) {
    return (
      <div className="ie-not-found">
        <h2>HTTP 404 - Item not found</h2>
        <p>The product you requested could not be found in the {site.artist} catalog.</p>
        <button onClick={onBack}>← Back to Shop</button>
      </div>
    );
  }

  const gallery = item.images?.length ? item.images : [item.image];
  const activeImg = gallery[angleIdx] || item.image;

  return (
    <div className="ie-detail">
      <div className="ie-breadcrumb">
        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          Shop
        </a>{' '}
        &gt; {item.type === 'painting' ? 'Paintings' : 'CDs'} &gt; <b>{item.title}</b>
      </div>

      <div className={`ie-detail-grid ${item.type === 'painting' ? 'is-painting' : ''}`}>
        <div>
          {item.type === 'painting' ? (
            <PaintViewer item={item} activeImage={activeImg} />
          ) : (
            <div className="ie-detail-img">
              <img src={activeImg} alt={item.title} />
              {item.sample && <span className="ie-sample-tag">SAMPLE</span>}
              {item.unavailable && <span className="ie-sold-stamp big">{item.unavailableLabel}</span>}
            </div>
          )}

          {gallery.length > 1 && (
            <div className="ie-angles">
              {gallery.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  className={`ie-angle-btn ${idx === angleIdx ? 'active' : ''}`}
                  onClick={() => setAngleIdx(idx)}
                  aria-label={`Angle ${idx + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ie-detail-info">
          <h2 className="ie-detail-title">{item.title}</h2>
          <div className="ie-detail-price">{item.unavailable ? item.unavailableLabel : formatPrice(item.price)}</div>
          <p className="ie-detail-ship">
            Ships: <b>{shop.shippingRegion}</b>
          </p>

          {item.subtitle && <p className="ie-detail-meta">{item.subtitle}{item.year ? ` · ${item.year}` : ''}</p>}
          {item.description && <p className="ie-detail-desc">{item.description}</p>}

          {item.tracks?.length > 0 && (
            <div className="ie-tracks">
              <b>Tracklist:</b>
              <ol>
                {item.tracks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>
          )}

          {item.type === 'painting' && (
            <div className="ie-painting-note">
              <p>This piece will be delivered, framed and well packaged dont you worry (also with a little surprise) !</p>
              <p>
                I know the prices are high and you could feel hesitant to order directly from the website in that case you can directly contact me on my instagram dm (painting page{' '}
                <a href="https://www.instagram.com/pratibimbmeriaankhmesirf" target="_blank" rel="noreferrer">
                  @pratibimbmeriaankhmesirf
                </a>
                ) or{' '}
                <a href={`mailto:${site.email || 'vark19team@gmail.com'}`}>email</a>, I am always available to here your queries.
              </p>
            </div>
          )}

          <div className="ie-detail-actions">
            <button
              className="default"
              disabled={item.unavailable || (item.max === 1 && inCart)}
              onClick={onAdd}
            >
              {item.unavailable ? item.unavailableLabel : item.max === 1 && inCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
            {inCart && (
              <button onClick={() => navigate('/shop/cart')}>View Cart →</button>
            )}
            <button onClick={onBack}>← Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart }) {
  return (
    <div className="ie-cart">
      <h2 className="ie-page-heading">Your Shopping Cart</h2>
      {cart.count === 0 ? (
        <div className="ie-cart-empty">
          <p>Your shopping cart is currently empty.</p>
          <button className="default" onClick={() => navigate('/shop')}>
            Browse VARK Shop
          </button>
        </div>
      ) : (
        <>
          <div className="ie-cart-table-wrap">
            <table className="ie-cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cart.items.map((i) => (
                <tr key={i.key}>
                  <td>
                    <div className="ie-cart-item">
                      <img src={i.image} alt="" />
                      <span>{i.title}</span>
                    </div>
                  </td>
                  <td>{i.type === 'painting' ? 'Painting' : 'CD'}</td>
                  <td>{formatPrice(i.price)}</td>
                  <td>
                    {i.max === 1 ? (
                      '1 (Original)'
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max={i.max}
                        value={i.qty}
                        onChange={(e) => cart.setQty(i.key, Number(e.target.value))}
                        className="cart-qty"
                        aria-label={`Quantity of ${i.title}`}
                      />
                    )}
                  </td>
                  <td>
                    <b>{formatPrice(i.price * i.qty)}</b>
                  </td>
                  <td>
                    <button onClick={() => cart.remove(i.key)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          <div className="ie-cart-summary">
            <div>
              <div>
                Shipping: <b>{shop.shippingRegion}</b>
              </div>
              <div className="ie-cart-total">
                Order Total: <b>{formatPrice(cart.total)}</b>
              </div>
            </div>
            <div className="ie-cart-btns">
              <button onClick={() => navigate('/shop')}>← Continue Shopping</button>
              <button className="default" onClick={() => navigate('/shop/checkout')}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CheckoutWizard({ cart }) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Review, 3: Payment
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Delhi',
    pincode: '',
  });
  const [error, setError] = useState('');

  if (cart.count === 0) {
    return (
      <div className="ie-cart-empty">
        <p>Your cart is empty. Add items before checking out.</p>
        <button className="default" onClick={() => navigate('/shop')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const setField = (k) => (e) => {
    setError('');
    setShipping((s) => ({ ...s, [k]: e.target.value }));
  };

  const nextFromShipping = (e) => {
    e.preventDefault();
    if (!shipping.name.trim() || !shipping.phone.trim() || !shipping.email.trim() || !shipping.address.trim() || !shipping.city.trim() || !shipping.pincode.trim()) {
      return setError('Please fill in all shipping fields.');
    }
    if (!/^\d{6}$/.test(shipping.pincode.trim())) {
      return setError('Please enter a valid 6-digit Indian PIN code.');
    }
    setStep(2);
  };

  return (
    <div className="wizard window">
      <div className="title-bar">
        <div className="title-bar-text">VARK Shop Checkout Wizard — Step {step} of 3</div>
      </div>
      <div className="window-body wizard-body">
        <div className="wizard-sidebar">
          <div className="wizard-logo">
            <span>{site.artist}</span>
            <small>98</small>
          </div>
          <ol className="wizard-steps">
            <li className={step === 1 ? 'active' : step > 1 ? 'done' : ''}>1. Shipping (India)</li>
            <li className={step === 2 ? 'active' : step > 2 ? 'done' : ''}>2. Review Order</li>
            <li className={step === 3 ? 'active' : ''}>3. Payment</li>
          </ol>
        </div>

        <div className="wizard-content">
          {step === 1 && (
            <form id="checkout-shipping" onSubmit={nextFromShipping}>
              <h3>Shipping Address ({shop.shippingRegion})</h3>
              <p className="wizard-sub">Enter your delivery details. Currently shipping across India.</p>
              <div className="wizard-form">
                <label>Full Name *</label>
                <input required value={shipping.name} onChange={setField('name')} placeholder="Your full name" />
                <label>Phone *</label>
                <input required type="tel" value={shipping.phone} onChange={setField('phone')} placeholder="10-digit mobile number" />
                <label>Email *</label>
                <input required type="email" value={shipping.email} onChange={setField('email')} placeholder="you@example.com" />
                <label>Address *</label>
                <input required value={shipping.address} onChange={setField('address')} placeholder="House / Flat no., Street, Locality" />
                <label>City *</label>
                <input required value={shipping.city} onChange={setField('city')} placeholder="e.g. New Delhi" />
                <label>State *</label>
                <select value={shipping.state} onChange={setField('state')}>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <label>PIN Code *</label>
                <input required value={shipping.pincode} onChange={setField('pincode')} placeholder="6-digit PIN" maxLength={6} />
              </div>
              {error && <p className="wizard-error">{error}</p>}
            </form>
          )}

          {step === 2 && (
            <div>
              <h3>Review Your Order</h3>
              <div className="wizard-review-box sunken-panel">
                <p>
                  <b>Deliver to:</b> {shipping.name} ({shipping.phone})
                  <br />
                  {shipping.address}, {shipping.city}, {shipping.state} – {shipping.pincode}
                  <br />
                  {shipping.email}
                </p>
                <hr />
                <table className="wizard-review-table">
                  <tbody>
                    {cart.items.map((i) => (
                      <tr key={i.key}>
                        <td>
                          {i.title} × {i.qty}
                        </td>
                        <td align="right">{formatPrice(i.price * i.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <b>Total ({shop.shippingRegion})</b>
                      </td>
                      <td align="right">
                        <b>{formatPrice(cart.total)}</b>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Payment — {shop.payments.provider}</h3>
              <div className="wizard-payment-box sunken-panel">
                <p>
                  <b>Online payment integration ({shop.payments.provider}) is coming soon.</b>
                </p>
                <p>
                  Once merchant credentials are added, clicking <b>Pay Now</b> will securely redirect you to {shop.payments.provider} (UPI, Cards, NetBanking) for{' '}
                  <b>{formatPrice(cart.total)}</b>.
                </p>
                <p className="muted">No payment has been charged and no order was placed yet.</p>
              </div>
            </div>
          )}

          <div className="wizard-footer">
            {step > 1 && <button onClick={() => setStep((s) => s - 1)}>&lt; Back</button>}
            {step === 1 && (
              <button type="submit" form="checkout-shipping" className="default">
                Next &gt;
              </button>
            )}
            {step === 2 && (
              <button className="default" onClick={() => setStep(3)}>
                Next &gt;
              </button>
            )}
            <button onClick={() => navigate('/shop/cart')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Shop({ path }) {
  const [category, setCategory] = useState(getInitialCategory);
  const cart = useCart();
  const catalog = useMemo(buildCatalog, []);

  const isCart = path === '/shop/cart';
  const isCheckout = path === '/shop/checkout';
  const itemMatch = path.match(/^\/shop\/item\/(painting|cd)\/([^/]+)$/);
  const activeItem = itemMatch ? catalog.find((x) => x.type === itemMatch[1] && x.id === itemMatch[2]) : null;

  const filtered = category === 'all' ? catalog : catalog.filter((i) => (category === 'paintings' ? i.type === 'painting' : i.type === 'cd'));

  const pickCategory = (cat) => {
    setCategory(cat);
    navigate(cat === 'all' ? '/shop' : `/shop?cat=${cat}`);
  };

  return (
    <section className="window win ie-window" aria-label="VARK Shop">
      <div className="title-bar">
        <div className="title-bar-text">
          <Icon name="cart" className="title-icon" />
          <span>{site.artist} Shop - Microsoft Internet Explorer</span>
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => navigate('/')} />
          <button aria-label="Maximize" disabled />
          <button aria-label="Close" onClick={() => navigate('/')} />
        </div>
      </div>

      <nav className="win-menubar">
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </nav>

      <div className="ie-toolbar">
        <button onClick={() => window.history.back()}>← Back</button>
        <button onClick={() => navigate('/')}>Home (Desktop)</button>
        <button onClick={() => navigate('/shop')}>Shop Index</button>
        <button className="ie-toolbar-cart" onClick={() => navigate('/shop/cart')}>
          <Icon name="cart" />
          Cart ({cart.count})
        </button>
      </div>

      <div className="explorer-address ie-address">
        <label htmlFor="ie-addr">Address</label>
        <div className="explorer-addr-field field-border">
          <Icon name="computer" />
          <input id="ie-addr" readOnly value={ieAddress(path, category)} />
        </div>
        <button onClick={() => navigate('/shop')}>Go</button>
      </div>

      <div className="ie-viewport sunken-panel">
        <header className="ie-store-banner">
          <div className="ie-store-brand">
            <b>{site.artist}98</b> OFFICIAL SHOP
          </div>
          <div className="ie-store-ticker">
            <span>★ ORIGINAL PAINTINGS &amp; MUSIC CDs ★ SHIPPING: {shop.shippingRegion.toUpperCase()} ★</span>
          </div>
        </header>

        <div className="ie-store-layout">
          <aside className="ie-sidebar">
            <div className="ie-side-box">
              <div className="ie-side-head">Categories</div>
              <ul>
                <li>
                  <button className={!isCart && !isCheckout && !itemMatch && category === 'all' ? 'active' : ''} onClick={() => pickCategory('all')}>
                    All Items ({catalog.length})
                  </button>
                </li>
                <li>
                  <button className={!isCart && !isCheckout && !itemMatch && category === 'paintings' ? 'active' : ''} onClick={() => pickCategory('paintings')}>
                    Paintings ({paintings.length})
                  </button>
                </li>
                <li>
                  <button className={!isCart && !isCheckout && !itemMatch && category === 'cds' ? 'active' : ''} onClick={() => pickCategory('cds')}>
                    Music CDs ({cds.length})
                  </button>
                </li>
              </ul>
            </div>

            <div className="ie-side-box">
              <div className="ie-side-head">Shopping Bag</div>
              <div className="ie-side-bag">
                <p>
                  Items: <b>{cart.count}</b>
                  <br />
                  Total: <b>{formatPrice(cart.total)}</b>
                </p>
                <button onClick={() => navigate('/shop/cart')}>View Cart</button>
                <button className="default" disabled={cart.count === 0} onClick={() => navigate('/shop/checkout')}>
                  Checkout
                </button>
              </div>
            </div>

            <div className="ie-side-box ie-side-note">
              <div className="ie-side-head">Store Info</div>
              <p>
                <b>Shipping:</b> {shop.shippingRegion}
                <br />
                <b>Payments:</b> {shop.payments.provider} (coming soon)
              </p>
            </div>
          </aside>

          <main className="ie-main">
            {isCart ? (
              <CartPage cart={cart} />
            ) : isCheckout ? (
              <CheckoutWizard cart={cart} />
            ) : itemMatch ? (
              <ProductDetail
                item={activeItem}
                inCart={activeItem ? cart.has(activeItem.key) : false}
                onAdd={() => activeItem && cart.add({ key: activeItem.key, type: activeItem.type, id: activeItem.id, title: activeItem.title, price: activeItem.price, image: activeItem.image, max: activeItem.max })}
                onBack={() => navigate('/shop')}
              />
            ) : (
              <>
                <div className="ie-catalog-head">
                  <h2>{category === 'paintings' ? 'Original Paintings' : category === 'cds' ? 'Music CDs' : 'All Products'}</h2>
                  <span className="muted">Sample catalog — real artwork &amp; CDs coming soon</span>
                </div>
                <div className="ie-grid">
                  {filtered.map((item) => (
                    <ProductCard
                      key={item.key}
                      item={item}
                      inCart={cart.has(item.key)}
                      onView={() => navigate(`/shop/item/${item.type}/${item.id}`)}
                      onAdd={() => cart.add({ key: item.key, type: item.type, id: item.id, title: item.title, price: item.price, image: item.image, max: item.max })}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <div className="status-bar">
        <p className="status-bar-field">Done</p>
        <p className="status-bar-field">Internet zone</p>
      </div>
    </section>
  );
}
