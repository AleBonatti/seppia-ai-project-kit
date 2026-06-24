// hf-pages.jsx — hi-fi pages: Dashboard (real charts), Posts, Edit Post, Media, Users, User edit.

/* ---------- chart helpers ---------- */
function smoothPath(vals, w, h, pad) {
  const max = Math.max(...vals) * 1.12, min = Math.min(...vals) * 0.9;
  const n = vals.length;
  const x = (i) => pad + (i / (n - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  let d = `M ${x(0)} ${y(vals[0])}`;
  for (let i = 1; i < n; i++) {
    const xc = (x(i - 1) + x(i)) / 2;
    d += ` C ${xc} ${y(vals[i - 1])}, ${xc} ${y(vals[i])}, ${x(i)} ${y(vals[i])}`;
  }
  return { d, x, y };
}

function AreaChart({ vals }) {
  const w = 720, h = 240, pad = 14;
  const { d, x, y } = smoothPath(vals, w, h, pad);
  const area = `${d} L ${x(vals.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;
  const grid = [0.0, 0.25, 0.5, 0.75, 1.0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 240, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + g * (h - pad * 2)} y2={pad + g * (h - pad * 2)}
          stroke="var(--border)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="4.5" fill="var(--accent)" stroke="var(--box)" strokeWidth="2.5" />
    </svg>
  );
}

function Sparkline({ vals, up = true }) {
  const w = 90, h = 30, pad = 3;
  const { d } = smoothPath(vals, w, h, pad);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: 90, height: 30 }} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={up ? 'var(--accent)' : 'var(--faint)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Donut({ segs }) {
  const r = 54, c = 2 * Math.PI * r, cx = 70, cy = 70;
  let off = 0;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 150, height: 150 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="16" />
      {segs.map((s, i) => {
        const len = (s.v / 100) * c;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="16"
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off}
            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
        );
        off += len;
        return el;
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--ink)" style={{ letterSpacing: '-0.03em' }}>128</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill="var(--muted)">total posts</text>
    </svg>
  );
}

/* ---------- Dashboard ---------- */
const STATS = [
  { label: 'Total Posts', icon: 'posts', num: '128', delta: '+6 this week', pos: true, spark: [10,12,11,14,13,16,15,18,17,20], up: true },
  { label: 'Published', icon: 'eye', num: '94', delta: '+3 this week', pos: true, spark: [8,9,9,11,12,12,14,15,15,17], up: true },
  { label: 'Drafts', icon: 'edit', num: '22', delta: '4 awaiting review', pos: false, spark: [12,11,13,10,12,9,11,10,9,9], up: false },
  { label: 'Comments', icon: 'users', num: '1.2k', delta: '+48 today', pos: true, spark: [20,22,21,26,28,30,29,34,38,42], up: true },
];
const TRAFFIC = [22,26,24,30,28,34,31,38,30,36,40,38,44,42,48,45,52,50,58,54,60,57,64,62,68,66,72,70,76,80];
const CATS = [
  { name: 'Tutorials', v: 38, color: 'var(--accent)' },
  { name: 'News', v: 24, color: 'color-mix(in srgb, var(--accent) 62%, #3b3b40)' },
  { name: 'Reviews', v: 21, color: 'color-mix(in srgb, var(--accent) 38%, #3b3b40)' },
  { name: 'Other', v: 17, color: 'var(--faint)' },
];

function Dashboard({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Good morning, David</h1>
          <div className="sub">Here's what's happening with your content today.</div>
        </div>
        <div className="head-actions">
          <button className="btn"><Icon name="export" size={17} /> Export</button>
          <button className="btn btn-primary" onClick={() => setPage('edit')}><Icon name="plus" size={17} /> New Post</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginBottom: 'var(--gap)' }}>
        {STATS.map((s) => (
          <div key={s.label} className="card stat" style={{ minWidth: 0 }}>
            <div className="stat-top">
              <span className="label">{s.label}</span>
              <span className="ic"><Icon name={s.icon} size={17} /></span>
            </div>
            <div className="num">{s.num}</div>
            <div className="between">
              <span className="delta"><span className={s.pos ? 'pos' : ''}>{s.delta}</span></span>
              <Sparkline vals={s.spark} up={s.up} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 'var(--gap)' }}>
        <div className="card chart-card" style={{ minWidth: 0 }}>
          <div className="between" style={{ marginBottom: 16 }}>
            <div>
              <h3>Traffic</h3>
              <div className="anno" style={{ marginTop: 2 }}>Visitors over the last 30 days</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip btn-sm on">30d</span>
              <span className="chip btn-sm">90d</span>
              <span className="chip btn-sm">1y</span>
            </div>
          </div>
          <AreaChart vals={TRAFFIC} />
        </div>
        <div className="card chart-card" style={{ minWidth: 0 }}>
          <h3 style={{ marginBottom: 8 }}>Posts by category</h3>
          <div className="row" style={{ justifyContent: 'center', padding: '8px 0' }}>
            <Donut segs={CATS} />
          </div>
          <div className="legend">
            {CATS.map((c) => (
              <div key={c.name} className="legend-row">
                <span className="row" style={{ gap: 9 }}><span className="dot" style={{ background: c.color }}></span>{c.name}</span>
                <span className="muted mono">{c.v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="between" style={{ marginBottom: 6 }}>
          <h3 style={{ fontSize: 16 }}>Recent posts</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage('posts')}>View all</button>
        </div>
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {[
              ['Designing a calm dashboard', 'David Dev', 'pub', 'May 30'],
              ['10 CMS patterns we love', 'Mara Pinto', 'pub', 'May 28'],
              ['Migration notes for v2', 'David Dev', 'draft', 'May 27'],
              ['Interview with the team', 'Leo Rossi', 'draft', 'May 25'],
            ].map((r, i) => (
              <tr key={i}>
                <td><span className="row-title">{r[0]}</span></td>
                <td className="muted">{r[1]}</td>
                <td>{statusBadge(r[2])}</td>
                <td className="muted mono" style={{ fontSize: 13 }}>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- shared ---------- */
function statusBadge(s) {
  if (s === 'pub') return <span className="badge pub">Published</span>;
  return <span className="badge draft">Draft</span>;
}

const FLAG = { gb: '🇬🇧', us: '🇺🇸', it: '🇮🇹', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪' };
const FLAG_NAME = { gb: 'English', us: 'English (US)', it: 'Italian', es: 'Spanish', fr: 'French', de: 'German' };
function Flags({ langs }) {
  return (
    <span className="row" style={{ gap: 5 }}>
      {langs.map((l) => <span key={l} title={FLAG_NAME[l]} style={{ fontSize: 18, lineHeight: 1 }}>{FLAG[l]}</span>)}
    </span>
  );
}

/* ---------- Posts list ---------- */
const POSTS = [
  { title: 'Designing a calm dashboard', author: 'David Dev', status: 'pub', date: 'May 30, 2026', langs: ['gb', 'it'] },
  { title: '10 CMS patterns we love', author: 'Mara Pinto', status: 'pub', date: 'May 28, 2026', langs: ['gb'] },
  { title: 'Migration notes for v2', author: 'David Dev', status: 'draft', date: 'May 27, 2026', langs: ['gb'] },
  { title: 'Interview with the team', author: 'Leo Rossi', status: 'draft', date: 'May 25, 2026', langs: ['it'] },
  { title: 'Accessibility checklist', author: 'Mara Pinto', status: 'pub', date: 'May 22, 2026', langs: ['gb', 'fr', 'de'] },
  { title: 'Roadmap: summer 2026', author: 'David Dev', status: 'draft', date: 'May 20, 2026', langs: ['gb'] },
  { title: 'Theming with tokens', author: 'Leo Rossi', status: 'pub', date: 'May 18, 2026', langs: ['gb', 'es'] },
];

function PostsList({ setPage }) {
  return (
    <div className="page">
      <div className="card list-card">
        <div className="lc-head">
          <div><h1>Posts</h1></div>
          <div className="lc-actions">
            <button className="btn"><Icon name="export" size={17} /> Export</button>
            <button className="btn btn-primary" onClick={() => setPage('edit')}><Icon name="plus" size={17} /> New Post</button>
          </div>
        </div>

        <div className="lc-toolbar">
          <div className="searchbox" style={{ maxWidth: 320 }}>
            <Icon name="search" size={17} /><span>Search posts…</span>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            <span className="chip on">All <span className="ct">128</span></span>
            <span className="chip">Published</span>
            <span className="chip">Drafts</span>
          </div>
        </div>

        <div className="lc-table">
          <table>
            <thead>
              <tr>
                <th className="cb-cell"></th>
                <th>Title</th><th>Author</th><th>Language</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {POSTS.map((r, i) => (
                <tr key={i}>
                  <td className="cb-cell"><span className={"check" + (i === 0 ? ' on' : '')}><Icon name="check" size={13} strokeWidth={2.6} /></span></td>
                  <td>
                    <div className="row-title">{r.title}</div>
                    <div className="row-sub">/{r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 26)}</div>
                  </td>
                  <td className="muted">{r.author}</td>
                  <td><Flags langs={r.langs} /></td>
                  <td>{statusBadge(r.status)}</td>
                  <td className="muted mono" style={{ fontSize: 13 }}>{r.date}</td>
                  <td>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 4 }}>
                      <button className="icon-btn" title="Edit" style={{ width: 34, height: 34 }} onClick={() => setPage('edit')}><Icon name="edit" size={17} /></button>
                      <button className="icon-btn" title="Delete" style={{ width: 34, height: 34 }}><Icon name="trash" size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lc-foot">
          <span className="anno">Showing 1–7 of 128 posts</span>
          <div className="pag">
            <span className="pg"><Icon name="back" size={16} /></span>
            <span className="pg on">1</span><span className="pg">2</span><span className="pg">3</span>
            <span className="anno" style={{ padding: '0 4px' }}>…</span>
            <span className="pg">18</span>
            <span className="pg"><Icon name="next" size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Edit Post ---------- */
function EditPost({ setPage }) {
  const [active, setActive] = React.useState(true);
  return (
    <div className="page">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="icon-btn bordered" onClick={() => setPage('posts')} title="Back to posts"><Icon name="back" size={18} /></button>
          <div><h1>Edit Post</h1><div className="sub">Last edited 12 minutes ago</div></div>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => setPage('posts')}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.9fr 1fr', alignItems: 'start' }}>
        <div className="grid">
          <div className="card">
            <div className="field">
              <label>Title</label>
              <div className="input"><span style={{ fontSize: 14.5 }}>Designing a calm dashboard</span></div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Permalink</label>
              <div className="input mono" style={{ color: 'var(--muted)' }}>/posts/designing-a-calm-dashboard</div>
            </div>
          </div>

          <div className="card">
            <div className="between" style={{ marginBottom: 12 }}>
              <label style={{ margin: 0 }}>Body</label>
              <div className="row" style={{ gap: 4 }}>
                {['bold', 'italic', 'heading', 'quote', 'link'].map((g) => (
                  <span key={g} className="icon-btn bordered" style={{ width: 30, height: 30 }}><Icon name={g} size={15} /></span>
                ))}
              </div>
            </div>
            <div className="input area"><span className="ph-text">Write the post content here… (rich-text / markdown editor)</span></div>
            <div className="anno" style={{ marginTop: 10 }}>~ 1,240 words · 6 min read</div>
          </div>

          <div className="card">
            <div className="row" style={{ gap: 9, marginBottom: 14 }}>
              <span className="ic" style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'var(--surface-2)', color: 'var(--accent)' }}><Icon name="media" size={17} /></span>
              <h3 style={{ fontSize: 16 }}>Media</h3>
            </div>
            <div className="dropzone">
              <Icon name="upload" size={24} />
              <div className="dz-main">Drag &amp; drop files here, or <span className="dz-link">browse</span></div>
              <div className="anno">PNG, JPG, GIF, MP4 up to 10 MB</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))', gap: 12, marginTop: 14 }}>
              {[0,1,2,3].map((i) => (
                <div key={i} className="edit-thumb">
                  <Icon name="media" size={22} />
                  <button className="thumb-x" title="Remove"><Icon name="trash" size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Publish</h3>
            <div className="field"><label>Status</label><div className="input select"><span>Draft</span><Icon name="caret" size={16} /></div></div>
            <div className="field"><label>Active</label><div className="row" style={{ justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--muted)', fontSize: 13.5 }}>{active ? 'Visible on site' : 'Hidden from site'}</span><button type="button" className={"switch row" + (active ? ' on' : '')} role="switch" aria-checked={active} onClick={() => setActive((v) => !v)}><span className="knob" /></button></div></div>
            <div className="field" style={{ marginBottom: 0 }}><label>Publish date</label><div className="input select"><span className="mono">2026-05-31 · 10:30</span><Icon name="calendar" size={16} /></div></div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Categories</h3>
            {['UI', 'Tutorials', 'News', 'Engineering', 'Culture'].map((c, i) => (
              <label key={c} className="row" style={{ gap: 10, padding: '5px 0', cursor: 'pointer' }}>
                <span className={"check" + (i < 2 ? ' on' : '')}><Icon name="check" size={13} strokeWidth={2.6} /></span>{c}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Media Library ---------- */
const MEDIA = [
  { type: 'image', name: 'hero-dashboard.jpg', meta: '1.4 MB · 1600×900' },
  { type: 'image', name: 'team-photo.png', meta: '880 KB · 1200×800' },
  { type: 'file', ext: 'PDF', icon: 'doc', name: 'press-kit.pdf', meta: '2.1 MB' },
  { type: 'image', name: 'cover-summer.jpg', meta: '1.1 MB · 1600×900' },
  { type: 'file', ext: 'MP4', icon: 'video', name: 'promo-clip.mp4', meta: '18 MB · 0:42' },
  { type: 'image', name: 'avatar-david.png', meta: '120 KB · 400×400' },
  { type: 'file', ext: 'DOCX', icon: 'doc', name: 'style-guide.docx', meta: '340 KB' },
  { type: 'image', name: 'chart-export.png', meta: '210 KB · 1024×768' },
  { type: 'file', ext: 'ZIP', icon: 'zip', name: 'assets-bundle.zip', meta: '46 MB' },
  { type: 'image', name: 'mockup-mobile.jpg', meta: '760 KB · 900×1600' },
  { type: 'file', ext: 'MP3', icon: 'audio', name: 'podcast-ep12.mp3', meta: '24 MB · 31:10' },
  { type: 'image', name: 'banner-news.jpg', meta: '1.0 MB · 1600×600' },
];

function MediaLibrary({ setPage }) {
  return (
    <div className="page">
      <div className="card list-card">
        <div className="lc-head">
          <div><h1>Media Library</h1></div>
        </div>

        <div className="lc-toolbar">
          <div className="searchbox" style={{ maxWidth: 320 }}>
            <Icon name="search" size={17} /><span>Search files…</span>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="input select" style={{ minWidth: 150, whiteSpace: 'nowrap' }}><span>All types</span><Icon name="caret" size={16} /></div>
            <div className="input select" style={{ minWidth: 130, whiteSpace: 'nowrap' }}><span>Newest</span><Icon name="caret" size={16} /></div>
          </div>
        </div>

        <div className="lc-body">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))' }}>
            {MEDIA.map((m, i) => (
              <div key={i} className="card media-card">
                <div className="media-thumb">
                  {m.type === 'image'
                    ? <Icon name="media" size={26} />
                    : <div style={{ textAlign: 'center' }}><Icon name={m.icon} size={28} /><div className="ftype">{m.ext}</div></div>}
                  <span className="kebab"><Icon name="dots" size={16} /></span>
                </div>
                <div className="row-title" style={{ fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                <div className="anno" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lc-foot">
          <span className="anno">Showing 1–12 of 312 files</span>
          <div className="pag">
            <span className="pg"><Icon name="back" size={16} /></span>
            <span className="pg on">1</span><span className="pg">2</span><span className="pg">3</span>
            <span className="anno" style={{ padding: '0 4px' }}>…</span>
            <span className="pg">26</span>
            <span className="pg"><Icon name="next" size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Users list ---------- */
const USERS = [
  { name: 'Ann Bolton', role: 'Administrator', email: 'a.bolton@yahoo.com', phone: '334.843.4437', init: 'AB' },
  { name: 'Catherine Robertson', role: 'Editor', email: 'francisco94@hotmail.com', phone: '0447.055.169', init: 'CR' },
  { name: 'Cristobal Menchaca', role: 'Author', email: 'cristobal@hotmail.com', phone: '395.004.7974', init: 'CM' },
  { name: 'Aurelia Zygmunt', role: 'Editor', email: 'oprygiel@rejek.org', phone: '+48 734 736 471', init: 'AZ' },
  { name: 'Tomas Wallin', role: 'Author', email: 'andersson@nilsson.com', phone: '08-17 78 52', init: 'TW' },
  { name: 'Olaf Lether', role: 'Author', email: 'zzevenboom@hotmail.com', phone: '0161-692845', init: 'OL' },
];
function roleBadge(r) {
  if (r === 'Administrator') return <span className="badge pub">{r}</span>;
  if (r === 'Editor') return <span className="badge review">{r}</span>;
  return <span className="badge draft">{r}</span>;
}

function UsersList({ setPage }) {
  return (
    <div className="page">
      <div className="card list-card">
        <div className="lc-head">
          <div><h1>Users</h1></div>
          <div className="lc-actions">
            <button className="btn"><Icon name="export" size={17} /> Export</button>
            <button className="btn btn-primary" onClick={() => setPage('useredit')}><Icon name="plus" size={17} /> New User</button>
          </div>
        </div>

        <div className="lc-toolbar">
          <div className="searchbox" style={{ maxWidth: 320 }}>
            <Icon name="search" size={17} /><span>Search users…</span>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            <span className="chip on">All <span className="ct">24</span></span>
            <span className="chip">Admins</span>
            <span className="chip">Editors</span>
            <span className="chip">Authors</span>
          </div>
        </div>

        <div className="lc-table">
          <table>
            <thead>
              <tr>
                <th className="cb-cell"></th>
                <th style={{ width: 50 }}></th>
                <th>Name</th><th>Email</th><th>Phone</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u, i) => (
                <tr key={i}>
                  <td className="cb-cell"><span className="check"><Icon name="check" size={13} strokeWidth={2.6} /></span></td>
                  <td><div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>{u.init}</div></td>
                  <td>
                    <div className="row-title">{u.name}</div>
                    <div style={{ marginTop: 3 }}>{roleBadge(u.role)}</div>
                  </td>
                  <td className="muted mono" style={{ fontSize: 13 }}>{u.email}</td>
                  <td className="muted mono" style={{ fontSize: 13 }}>{u.phone}</td>
                  <td>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 4 }}>
                      <button className="icon-btn" title="Edit" style={{ width: 34, height: 34 }} onClick={() => setPage('useredit')}><Icon name="edit" size={17} /></button>
                      <button className="icon-btn" title="Delete" style={{ width: 34, height: 34 }}><Icon name="trash" size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lc-foot">
          <span className="anno">Showing 1–6 of 24 users</span>
          <div className="pag">
            <span className="pg"><Icon name="back" size={16} /></span>
            <span className="pg on">1</span><span className="pg">2</span><span className="pg">3</span><span className="pg">4</span>
            <span className="pg"><Icon name="next" size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- User edit ---------- */
function UserEdit({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="icon-btn bordered" onClick={() => setPage('users')} title="Back to users"><Icon name="back" size={18} /></button>
          <div><h1>Edit User</h1><div className="sub">Catherine Robertson · Editor</div></div>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => setPage('users')}>Cancel</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </div>

      <div className="tabs">
        <span className="tab on">Profile</span>
        <span className="tab">Notifications</span>
        <span className="tab">Integrations</span>
      </div>

      <div className="card">
        <div className="sec-head">Profile</div>
        <div className="sec-sub">Manage the photo and how this account appears.</div>
        <div className="frow" style={{ paddingBottom: 0, borderTop: 'none' }}>
          <div className="flabel">Avatar</div>
          <div className="row" style={{ gap: 16 }}>
            <div className="avatar-drop"><Icon name="media" size={24} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-sm"><Icon name="upload" size={15} /> Upload</button>
                <button className="btn btn-sm btn-ghost">Remove</button>
              </div>
              <div className="fhelp">JPG, PNG or GIF. Max size 1 MB.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--gap)' }}>
        <div className="sec-head">Personal info</div>
        <div className="sec-sub">Update the user's account details.</div>

        <div className="frow">
          <div className="flabel">Full name</div>
          <div>
            <div className="input"><span style={{ fontSize: 14.5 }}>Catherine Robertson</span></div>
            <div className="fhelp">Name shown across the workspace and on posts.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Username</div>
          <div>
            <div className="input mono">c.robertson</div>
            <div className="fhelp">Used in the public profile URL.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Email</div>
          <div>
            <div className="input mono">francisco94@hotmail.com</div>
            <div className="fhelp">The email used to sign in to SeppiaCms.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Role</div>
          <div>
            <div className="input select"><span>Editor</span><Icon name="caret" size={16} /></div>
            <div className="fhelp">Controls what this user can access and edit.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Location</div>
          <div>
            <div className="input select"><span className="ph-text">Select country</span><Icon name="caret" size={16} /></div>
            <div className="fhelp">Used for localisation and timezone defaults.</div>
          </div>
        </div>

        <div className="save-bar">
          <span className="anno">Last saved Feb 10, 2026 · 06:16</span>
          <div className="row" style={{ marginLeft: 'auto', gap: 9 }}>
            <button className="btn" onClick={() => setPage('users')}>Cancel</button>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Account settings ---------- */
function PwField({ value, reveal, placeholder, onChange, onToggle }) {
  return (
    <div className="input pwd">
      <input type={reveal ? 'text' : 'password'} value={value} placeholder={placeholder} onChange={onChange} />
      <button type="button" className="pwd-toggle" onClick={onToggle}>{reveal ? 'Hide' : 'Show'}</button>
    </div>
  );
}

function Settings({ setPage }) {
  const fileRef = React.useRef(null);
  const [avatar, setAvatar] = React.useState(null);
  const [name, setName] = React.useState('David Dev');
  const [email] = React.useState('david@seppiacms.com');
  const [pw, setPw] = React.useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = React.useState({ current: false, next: false, confirm: false });

  function onPick(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setAvatar(r.result);
    r.readAsDataURL(f);
  }

  const score = (() => {
    const v = pw.next;
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    return s;
  })();
  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score];
  const match = pw.next.length > 0 && pw.next === pw.confirm;

  const setField = (id) => (e) => setPw((p) => ({ ...p, [id]: e.target.value }));
  const toggle = (id) => () => setShow((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Account settings</h1>
          <div className="sub">Manage your personal details, photo and password.</div>
        </div>
      </div>

      <div className="card">
        <div className="sec-head">Profile photo</div>
        <div className="sec-sub">This image appears next to your name across SeppiaCms.</div>
        <div className="frow" style={{ paddingBottom: 0, borderTop: 'none' }}>
          <div className="flabel">Avatar</div>
          <div className="row" style={{ gap: 16 }}>
            <div className="avatar-pic">
              {avatar ? <img src={avatar} alt="Avatar preview" /> : 'DD'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-sm" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="upload" size={15} /> Upload new</button>
                <button className="btn btn-sm btn-ghost" onClick={() => setAvatar(null)}>Remove</button>
              </div>
              <div className="fhelp">JPG, PNG or GIF. Max size 1 MB. Recommended 256×256px.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--gap)' }}>
        <div className="sec-head">Personal info</div>
        <div className="sec-sub">Update your name and the email you sign in with.</div>

        <div className="frow">
          <div className="flabel">Full name</div>
          <div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <div className="fhelp">Shown across the workspace and on your posts.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Email</div>
          <div>
            <div className="input mono" style={{ justifyContent: 'space-between' }}>
              <span>{email}</span>
              <span className="badge pub">Verified</span>
            </div>
            <div className="fhelp">The email you use to sign in. Contact an admin to change it.</div>
          </div>
        </div>

        <div className="save-bar">
          <span className="anno">Last saved Jun 12, 2026 · 14:09</span>
          <div className="row" style={{ marginLeft: 'auto', gap: 9 }}>
            <button className="btn" onClick={() => setPage('dashboard')}>Cancel</button>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--gap)' }}>
        <div className="sec-head">Password</div>
        <div className="sec-sub">Choose a strong password you don't reuse on other sites.</div>

        <div className="frow">
          <div className="flabel">Current password</div>
          <div><PwField value={pw.current} reveal={show.current} placeholder="Enter current password" onChange={setField('current')} onToggle={toggle('current')} /></div>
        </div>
        <div className="frow">
          <div className="flabel">New password</div>
          <div>
            <PwField value={pw.next} reveal={show.next} placeholder="Enter new password" onChange={setField('next')} onToggle={toggle('next')} />
            <div className="pw-strength">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={"pw-bar" + (i < score ? ' on' : '')}></span>
              ))}
            </div>
            <div className="fhelp">{pw.next ? strengthLabel + ' — at least 8 characters with a number and a symbol.' : 'At least 8 characters with a number and a symbol.'}</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Confirm password</div>
          <div>
            <PwField value={pw.confirm} reveal={show.confirm} placeholder="Re-enter new password" onChange={setField('confirm')} onToggle={toggle('confirm')} />
            {pw.confirm.length > 0 && (
              <div className="fhelp" style={{ color: match ? 'var(--accent)' : '#e5484d' }}>
                {match ? 'Passwords match.' : "Passwords don't match yet."}
              </div>
            )}
          </div>
        </div>

        <div className="save-bar">
          <span className="anno">Last changed 3 months ago</span>
          <div className="row" style={{ marginLeft: 'auto', gap: 9 }}>
            <button className="btn">Cancel</button>
            <button className="btn btn-primary">Update password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Error Logs ---------- */
const LOGS = [
  { level: 'error', code: '500', msg: 'Uncaught TypeError: cannot read property "slug" of undefined', src: 'api/posts/[id].js:42', time: 'Jun 16, 2026 · 09:41:22', count: 12 },
  { level: 'error', code: 'DB', msg: 'Connection timeout while querying media_library', src: 'lib/db/pool.js:118', time: 'Jun 16, 2026 · 08:17:05', count: 3 },
  { level: 'warn', code: '404', msg: 'Asset not found: /uploads/banner-news@2x.jpg', src: 'middleware/static.js:27', time: 'Jun 15, 2026 · 22:03:54', count: 47 },
  { level: 'error', code: '403', msg: 'Permission denied: user "leo" attempted to publish without role', src: 'auth/guard.js:88', time: 'Jun 15, 2026 · 19:48:11', count: 1 },
  { level: 'warn', code: 'CACHE', msg: 'Stale cache served for dashboard metrics (TTL exceeded)', src: 'lib/cache/redis.js:64', time: 'Jun 15, 2026 · 16:30:00', count: 8 },
  { level: 'info', code: 'JOB', msg: 'Nightly backup completed in 42.6s', src: 'jobs/backup.js:12', time: 'Jun 15, 2026 · 03:00:42', count: 1 },
  { level: 'error', code: '500', msg: 'Failed to render template: missing partial "post-card"', src: 'render/templates.js:203', time: 'Jun 14, 2026 · 14:22:39', count: 5 },
];

function levelBadge(l) {
  if (l === 'error') return <span className="badge err">Error</span>;
  if (l === 'warn') return <span className="badge warn">Warning</span>;
  return <span className="badge info">Info</span>;
}

function ErrorLogs({ setPage }) {
  return (
    <div className="page">
      <div className="card list-card">
        <div className="lc-head">
          <div><h1>Log errori</h1></div>
          <div className="lc-actions">
            <button className="btn"><Icon name="export" size={17} /> Export</button>
            <button className="btn"><Icon name="trash" size={17} /> Clear logs</button>
          </div>
        </div>

        <div className="lc-toolbar">
          <div className="searchbox" style={{ maxWidth: 320 }}>
            <Icon name="search" size={17} /><span>Search logs…</span>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="input select" style={{ minWidth: 150, whiteSpace: 'nowrap' }}><span>All levels</span><Icon name="caret" size={16} /></div>
            <div className="input select" style={{ minWidth: 140, whiteSpace: 'nowrap' }}><span>Last 24 hours</span><Icon name="caret" size={16} /></div>
          </div>
        </div>

        <div className="lc-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: 90 }}>Level</th>
                <th>Message</th><th style={{ width: 180 }}>Time</th><th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((r, i) => (
                <tr key={i}>
                  <td>{levelBadge(r.level)}</td>
                  <td>
                    <div className="row" style={{ gap: 9 }}>
                      <span className="logcode mono">{r.code}</span>
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.msg}</span>
                    </div>
                  </td>
                  <td className="muted mono" style={{ fontSize: 12.5 }}>{r.time}</td>
                  <td>
                    <button className="icon-btn" title="View detail" style={{ width: 34, height: 34 }}><Icon name="next" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lc-foot">
          <span className="anno">Showing 1–7 of 213 entries</span>
          <div className="pag">
            <span className="pg"><Icon name="back" size={16} /></span>
            <span className="pg on">1</span><span className="pg">2</span><span className="pg">3</span>
            <span className="anno" style={{ padding: '0 4px' }}>…</span>
            <span className="pg">31</span>
            <span className="pg"><Icon name="next" size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, PostsList, EditPost, MediaLibrary, UsersList, UserEdit, PwField, Settings, ErrorLogs });
