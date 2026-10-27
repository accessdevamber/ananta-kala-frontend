import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Upload,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
  Minus,
  Plus,
  MessageCircle,
  Home,
  Image as ImageIcon,
} from 'lucide-react';

const starter = [
  {
    id: 'shiva-himalayan-peace',
    name: 'Lord Shiva — Himalayan Peace',
    deity: 'Shiva',
    image: '/art/art1.jpg',
    price: 2999,
    digital: 499,
    description: 'Lord Shiva in serene meditation amid the Himalayan mountains, glowing clouds and a peaceful river.',
  },
];
// Room photos are fixed photographic scenes; frame coordinates align with each image's actual wall art.
// They are illustrative, not calibrated to real-world print dimensions.
const rooms = [
  {
    id: 'living',
    name: 'Living room',
    image: '/rooms/living.jpg',
    ratio: '1920 / 1062',
    box: { left: '46.5%', top: '5.7%', width: '24.7%', height: '59.2%' },
    hint: 'Statement piece above a sofa',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    image: '/rooms/bedroom.jpg',
    ratio: '1920 / 1061',
    box: { left: '38.2%', top: '5.4%', width: '23.0%', height: '53.0%' },
    hint: 'Restful bedroom with warm lighting',
  },
  {
    id: 'pooja',
    name: 'Pooja room',
    image: '/rooms/pooja.jpg',
    ratio: '1920 / 1562',
    box: { left: '37.5%', top: '7.2%', width: '27.7%', height: '49.7%' },
    hint: 'Warm devotional setting',
  },
  {
    id: 'hallway',
    name: 'Hallway',
    image: '/rooms/hallway.jpg',
    ratio: '1920 / 1619',
    box: { left: '38.8%', top: '10.3%', width: '22.1%', height: '38.4%' },
    hint: 'Art above an entryway console',
  },
  {
    id: 'office',
    name: 'Office',
    image: '/rooms/office.jpg',
    ratio: '1920 / 1608',
    box: { left: '39.4%', top: '6.8%', width: '26.4%', height: '46.1%' },
    hint: 'Calm creative workspace',
  },
];
const frames = [
  { id: 'oak', name: 'Natural oak', color: '#b88c56' },
  { id: 'walnut', name: 'Walnut', color: '#6c4227' },
  { id: 'gold', name: 'Antique gold', color: '#c49a45' },
  { id: 'black', name: 'Matte black', color: '#202020' },
];
// This artwork is 3:4; only offer sizes with the same aspect ratio.
const sizes = [
  { id: '12x16', name: '12 × 16', factor: 1 },
  { id: '18x24', name: '18 × 24', factor: 1.5 },
  { id: '24x32', name: '24 × 32', factor: 2 },
];
const money = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
type Artwork = (typeof starter)[number];

function RoomView({
  art,
  room,
  frame,
  onClick,
}: {
  art: Artwork;
  room: (typeof rooms)[number];
  frame: (typeof frames)[number];
  onClick?: () => void;
}) {
  return (
    <div
      className={`room-stage room-${room.id}`}
      style={{ aspectRatio: room.ratio }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${art.name} displayed in ${room.name}`}
    >
      <img className="room-photo" src={room.image} alt={`${room.name} interior`} />

      <div className="wall-art-position" style={room.box}>
        <div className="wall-art" style={{ borderColor: frame.color }}>
          <img src={art.image} alt={art.name} />
        </div>
      </div>


    </div>
  );
}

export default function KalaAndPranaGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>(starter);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [roomIndex, setRoomIndex] = useState(-1);
  const [frameIndex, setFrameIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(1);
  const [format, setFormat] = useState<'physical' | 'digital'>('physical');
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All art');
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const visible = useMemo(
    () =>
      artworks.filter(
        (a) =>
          (category === 'All art' || a.deity === category) &&
          `${a.name} ${a.description}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [artworks, category, search],
  );
  const price = selected
    ? format === 'digital'
      ? selected.digital
      : Math.round(selected.price * sizes[sizeIndex].factor)
    : 0;
  const count = cart.reduce((s, c) => s + c.quantity, 0);
  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selected?.id]);
  function openArt(a: Artwork) {
    setSelected(a);
    setRoomIndex(-1);
    setFrameIndex(0);
    setSizeIndex(1);
    setFormat('physical');
    setQuantity(1);
  }
  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((f, i) => {
      if (!f.type.startsWith('image/')) return;
      const url = URL.createObjectURL(f);
      setArtworks((prev) => [
        {
          id: `upload-${Date.now()}-${i}`,
          name: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          deity: 'Custom',
          image: url,
          price: 2999,
          digital: 499,
          description: 'Your uploaded artwork — preview in room settings and frame styles.',
        },
        ...prev,
      ]);
    });
    e.target.value = '';
  }
  function addToCart() {
    if (!selected) return;
    const key = `${selected.id}-${format}-${sizeIndex}-${frameIndex}`;
    setCart((prev) => {
      const found = prev.find((c) => c.key === key);
      return found
        ? prev.map((c) => (c.key === key ? { ...c, quantity: c.quantity + quantity } : c))
        : [
            ...prev,
            {
              key,
              id: selected.id,
              name: selected.name,
              image: selected.image,
              format,
              size: format === 'digital' ? 'Digital file' : sizes[sizeIndex].name,
              frame: format === 'digital' ? '—' : frames[frameIndex].name,
              price,
              quantity,
            },
          ];
    });
    setCartOpen(true);
  }
  function nextRoom(d: number) {
    setRoomIndex((i) => ((i + 1 + d + rooms.length + 1) % (rooms.length + 1)) - 1);
  }
  const whatsAppMessage = encodeURIComponent(
    'Hello, I would like to enquire about these Kala & Prana items:\n' +
      cart
        .map(
          (c) =>
            `${c.name} | ${c.format} | ${c.size} | ${c.frame} | Qty ${c.quantity} | ${money(c.price * c.quantity)}`,
        )
        .join('\n') +
      `\nTotal: ${money(total)}\nPlease confirm availability and delivery.`,
  );
  return (
    <div className="site">
      <div className="announcement">
        Sacred art for beautiful spaces <span>·</span> Digital downloads & framed canvas previews
      </div>
      <header className="header">
        <button
          className="brand"
          onClick={() => {
            setSelected(null);
            setZoom(false);
          }}
        >
          <span className="brand-mark">कला</span>
          <span>
            <strong>KALA & PRANA</strong>
            <small>SACRED ART FOR MODERN SPACES</small>
          </span>
        </button>
        <div className="search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(null);
            }}
            placeholder="Search Shiva, Hanuman, sacred art..."
          />
        </div>
        <div className="header-actions">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            ref={inputRef}
            onChange={upload}
          />
          <button className="upload-btn" onClick={() => inputRef.current?.click()}>
            <Upload size={16} /> <span>Upload artwork</span>
          </button>
          <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingBag size={21} />
            {count > 0 && <b>{count}</b>}
          </button>
        </div>
      </header>
      <nav className="nav">
        {['All art', 'Shiva', 'Hanuman', 'Custom'].map((c) => (
          <button
            key={c}
            className={category === c ? 'active' : ''}
            onClick={() => {
              setCategory(c);
              setSelected(null);
            }}
          >
            {c}
          </button>
        ))}
      </nav>
      {!selected ? (
        <>
          <section className="hero">
            <div>
              <span className="eyebrow">THE KALA & PRANA COLLECTION</span>
              <h1>
                Sacred art, <em>beautifully at home.</em>
              </h1>
              <p>
                Explore original devotional artwork in realistic room settings. Choose a canvas,
                discover your ideal frame, or select a digital download.
              </p>
              <button
                className="primary"
                onClick={() =>
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Explore collection <ChevronRight size={18} />
              </button>
            </div>
            <div className="hero-preview">
              <RoomView art={artworks[0]} room={rooms[0]} frame={frames[2]} />
            </div>
          </section>
          <main className="container" id="collection">
            <div className="section-heading">
              <div>
                <span className="eyebrow">CURATED ARTWORKS</span>
                <h2>Explore the collection</h2>
              </div>
              <p>{visible.length} artworks · Click any artwork to explore room mockups</p>
            </div>
            <div className="product-grid">
              {visible.map((a) => (
                <button className="product-card" key={a.id} onClick={() => openArt(a)}>
                  <div className="product-img">
                    <img src={a.image} alt={a.name} />
                    <span>
                      View in your space <ChevronRight size={14} />
                    </span>
                  </div>
                  <div className="product-meta">
                    <small>{a.deity} · Sacred collection</small>
                    <h3>{a.name}</h3>
                    <p>Framed canvas from {money(a.price)}</p>
                    <span className="digital-note">Digital download available</span>
                  </div>
                </button>
              ))}
            </div>
            {visible.length === 0 && <p>No artwork found. Try a different search or category.</p>}
          </main>
        </>
      ) : (
        <main className="container detail">
          <button className="back" onClick={() => setSelected(null)}>
            <ArrowLeft size={17} /> Back to all artworks
          </button>
          <div className="detail-grid">
            <div className="gallery">
              <div className="gallery-main">
                {roomIndex === -1 ? (
                  <div
                    className="original-stage"
                    onClick={() => setZoom(true)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={selected.image} alt={`${selected.name} original artwork`} />
                    <span>Original artwork · unframed</span>
                  </div>
                ) : (
                  <RoomView
                    art={selected}
                    room={rooms[roomIndex]}
                    frame={frames[frameIndex]}
                    onClick={() => setZoom(true)}
                  />
                )}
                <button
                  className="gallery-prev"
                  onClick={() => nextRoom(-1)}
                  aria-label="Previous room"
                >
                  <ChevronLeft />
                </button>
                <button className="gallery-next" onClick={() => nextRoom(1)} aria-label="Next room">
                  <ChevronRight />
                </button>
                <button className="expand" onClick={() => setZoom(true)}>
                  <Maximize2 size={16} /> Expand
                </button>
              </div>
              <div className="thumb-row">
                <button
                  className={'thumb original ' + (roomIndex === -1 ? 'chosen' : '')}
                  onClick={() => setRoomIndex(-1)}
                >
                  <img src={selected.image} alt="Original artwork" />
                  <span>Original</span>
                </button>
                {rooms.map((r, i) => (
                  <button
                    key={r.id}
                    className={'thumb ' + (roomIndex === i ? 'chosen' : '')}
                    onClick={() => setRoomIndex(i)}
                  >
                    <RoomView art={selected} room={r} frame={frames[frameIndex]} />
                    <span>{r.name}</span>
                  </button>
                ))}
              </div>
              <div className="mockup-disclaimer">
                <ImageIcon size={17} /> Room photographs are illustrative mockups. Artwork is
                positioned inside the existing frame; print sizes are not shown to scale.
              </div>
            </div>
            <div className="purchase">
              <span className="eyebrow">KALA & PRANA · {selected.deity.toUpperCase()}</span>
              <h1>{selected.name}</h1>
              <p className="description">{selected.description}</p>
              <div className="rating">
                <span>Original devotional art · Sample pricing</span>
              </div>
              <div className="price">
                {money(price)}{' '}
                <small>
                  {format === 'digital' ? 'Digital download' : 'Framed canvas · sample price'}
                </small>
              </div>
              <div className="divider" />
              <h3>1. Choose product type</h3>
              <div className="option-grid">
                <button
                  className={format === 'physical' ? 'selected' : ''}
                  onClick={() => setFormat('physical')}
                >
                  <strong>Framed canvas</strong>
                  <small>Physical print</small>
                </button>
                <button
                  className={format === 'digital' ? 'selected' : ''}
                  onClick={() => setFormat('digital')}
                >
                  <strong>Digital download</strong>
                  <small>High-resolution file</small>
                </button>
              </div>
              {format === 'physical' && (
                <>
                  <h3>
                    2. Choose size <small>(inches)</small>
                  </h3>
                  <div className="sizes">
                    {sizes.map((s, i) => (
                      <button
                        key={s.id}
                        className={sizeIndex === i ? 'selected' : ''}
                        onClick={() => setSizeIndex(i)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <h3>3. Choose frame finish</h3>
                  <div className="frames">
                    {frames.map((f, i) => (
                      <button
                        key={f.id}
                        className={frameIndex === i ? 'selected' : ''}
                        onClick={() => setFrameIndex(i)}
                      >
                        <span style={{ background: f.color }} />
                        <small>{f.name}</small>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="qty-line">
                <span>Quantity</span>
                <div className="quantity">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus size={16} />
                  </button>
                  <strong>{quantity}</strong>
                  <button onClick={() => setQuantity((q) => Math.min(20, q + 1))}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button className="add" onClick={addToCart}>
                <ShoppingBag size={19} /> Add to cart · {money(price * quantity)}
              </button>
              <p className="checkout-note">
                <Check size={15} /> Frontend demo: orders and payments are not yet connected to a
                backend.
              </p>
            </div>
          </div>
        </main>
      )}
      <footer>
        <strong>KALA & PRANA</strong>
        <span>Original devotional art · Room mockup storefront prototype</span>
      </footer>
      {zoom && selected && (
        <div className="modal-backdrop" onClick={() => setZoom(false)}>
          <div className="zoom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setZoom(false)}>
              <X />
            </button>
            {roomIndex === -1 ? (
              <div className="original-stage">
                <img src={selected.image} alt={selected.name} />
              </div>
            ) : (
              <RoomView art={selected} room={rooms[roomIndex]} frame={frames[frameIndex]} />
            )}
            <p>
              {roomIndex === -1 ? 'Original artwork' : rooms[roomIndex].name} · {selected.name}
            </p>
            <div className="modal-controls">
              <button onClick={() => nextRoom(-1)}>
                <ChevronLeft /> Previous room
              </button>
              <button onClick={() => nextRoom(1)}>
                Next room <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-head">
              <h2>Your cart ({count})</h2>
              <button onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>
            {cart.length === 0 ? (
              <p>Your cart is empty. Choose an artwork to get started.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((c) => (
                    <div className="cart-item" key={c.key}>
                      <img src={c.image} alt={c.name} />
                      <div>
                        <strong>{c.name}</strong>
                        <small>
                          {c.format} · {c.size} · {c.frame}
                        </small>
                        <p>
                          {money(c.price)} × {c.quantity}
                        </p>
                        <button
                          onClick={() => setCart((prev) => prev.filter((x) => x.key !== c.key))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-bottom">
                  <div>
                    <strong>Subtotal</strong>
                    <strong>{money(total)}</strong>
                  </div>
                  <p>Shipping and payment will be confirmed by the owner.</p>
                  <button
                    className="add"
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(decodeURIComponent(whatsAppMessage))
                        .then(() =>
                          window.alert('Order enquiry copied. Paste it into WhatsApp or email.'),
                        )
                        .catch(() =>
                          window.prompt(
                            'Copy your order enquiry:',
                            decodeURIComponent(whatsAppMessage),
                          ),
                        );
                    }}
                  >
                    <MessageCircle size={18} /> Copy order enquiry
                  </button>
                  <p className="checkout-note">
                    Configure a real business WhatsApp number and backend before accepting orders.
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
