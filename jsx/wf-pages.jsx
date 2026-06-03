// wf-pages.jsx — Dashboard, Posts list, Edit Post. Low-fi wireframe content.

const STATS = [
  { label: 'Total Posts', num: '128', delta: '+6 this week', up: true },
  { label: 'Published', num: '94', delta: '+3 this week', up: true },
  { label: 'Drafts', num: '22', delta: '4 awaiting review' },
  { label: 'Comments', num: '1.2k', delta: '+48 today', up: true },
];

function Sparkline() {
  return (
    <svg className="spark" viewBox="0 0 120 30" preserveAspectRatio="none" style={{ width: '100%' }}>
      <polyline points="0,24 18,18 34,22 52,12 70,16 88,7 106,11 120,4"
        fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: 'url(#sketch1)' }} />
    </svg>
  );
}

function Dashboard({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Good morning, David</h1>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft"><Icon name="export" size={17} /> Export</button>
          <button className="btn btn-primary sk" onClick={() => setPage('edit')}><Icon name="plus" size={17} /> New Post</button>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' }}>
        {STATS.map((s) => (
          <div key={s.label} className="card stat sk">
            <div className="label">{s.label}</div>
            <div className="num">{s.num}</div>
            <div className={"delta" + (s.up ? ' up' : '')}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: 'var(--gap)' }}>
        <div className="card sk">
          <div className="between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 20 }}>Traffic — last 30 days</h3>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip sk sk-soft btn-sm on">30d</span>
              <span className="chip sk sk-soft btn-sm">90d</span>
              <span className="chip sk sk-soft btn-sm">1y</span>
            </div>
          </div>
          <div className="ph" style={{ height: 240 }}>
            <span className="mono">[ area / line chart ]</span>
          </div>
        </div>
        <div className="card sk">
          <h3 style={{ fontSize: 20, marginBottom: 14 }}>Posts by category</h3>
          <div className="ph" style={{ height: 180, borderRadius: 999 }}>
            <span className="mono">[ donut ]</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {['Tutorials 38%', 'News 24%', 'Reviews 21%', 'Other 17%'].map((l) => (
              <div key={l} className="row between" style={{ padding: '5px 0', borderTop: '1.5px dashed var(--stroke-soft)' }}>
                <span className="row" style={{ gap: 9 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--accent)', opacity: .8 }}></span>{l.split(' ')[0]}</span>
                <span className="mono muted">{l.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent activity */}
      <div className="card sk">
        <div className="between" style={{ marginBottom: 10 }}>
          <h3 style={{ fontSize: 20 }}>Recent posts</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage('posts')}>View all →</button>
        </div>
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {[
              ['Designing a calm dashboard', 'David Dev', 'pub', 'May 30'],
              ['10 CMS patterns we love', 'Mara P.', 'pub', 'May 28'],
              ['Draft: migration notes', 'David Dev', 'draft', 'May 27'],
              ['Interview with the team', 'Leo R.', 'review', 'May 25'],
            ].map((r, i) => (
              <tr key={i}>
                <td><span className="row-title">{r[0]}</span></td>
                <td className="muted">{r[1]}</td>
                <td><span className={"badge " + (r[2] === 'pub' ? 'pub' : '')}>{r[2] === 'pub' ? 'Published' : r[2] === 'draft' ? 'Draft' : 'In review'}</span></td>
                <td className="muted mono" style={{ fontSize: 13 }}>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const POSTS = [
  { title: 'Designing a calm dashboard', author: 'David Dev', status: 'pub', date: 'May 30, 2026', langs: ['gb', 'it'] },
  { title: '10 CMS patterns we love', author: 'Mara Pinto', status: 'pub', date: 'May 28, 2026', langs: ['gb'] },
  { title: 'Migration notes for v2', author: 'David Dev', status: 'draft', date: 'May 27, 2026', langs: ['gb'] },
  { title: 'Interview with the team', author: 'Leo Rossi', status: 'review', date: 'May 25, 2026', langs: ['it'] },
  { title: 'Accessibility checklist', author: 'Mara Pinto', status: 'pub', date: 'May 22, 2026', langs: ['gb', 'fr', 'de'] },
  { title: 'Roadmap: summer 2026', author: 'David Dev', status: 'draft', date: 'May 20, 2026', langs: ['gb'] },
  { title: 'Theming with tokens', author: 'Leo Rossi', status: 'pub', date: 'May 18, 2026', langs: ['gb', 'es'] },
];

const FLAG = { gb: '🇬🇧', us: '🇺🇸', it: '🇮🇹', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪' };
const FLAG_NAME = { gb: 'English', us: 'English (US)', it: 'Italian', es: 'Spanish', fr: 'French', de: 'German' };

function Flags({ langs }) {
  return (
    <span className="row" style={{ gap: 5 }}>
      {langs.map((l) => (
        <span key={l} title={FLAG_NAME[l]} style={{ fontSize: 19, lineHeight: 1 }}>{FLAG[l]}</span>
      ))}
    </span>
  );
}

function statusBadge(s) {
  if (s === 'pub') return <span className="badge pub">Published</span>;
  if (s === 'draft') return <span className="badge">Draft</span>;
  return <span className="badge">In review</span>;
}

function PostsList({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Posts</h1>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft"><Icon name="export" size={17} /> Export</button>
          <button className="btn btn-primary sk" onClick={() => setPage('edit')}><Icon name="plus" size={17} /> New Post</button>
        </div>
      </div>

      {/* toolbar */}
      <div className="row between wrap" style={{ marginBottom: 'var(--gap)', gap: 12 }}>
        <div className="searchbox sk sk-soft" style={{ maxWidth: 320 }}>
          <Icon name="search" size={17} /><span>Search posts…</span>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="chip sk sk-soft on">All <span className="mono">128</span></span>
          <span className="chip sk sk-soft">Published</span>
          <span className="chip sk sk-soft">Drafts</span>
          <span className="chip sk sk-soft">In review</span>
        </div>
      </div>

      {/* table */}
      <div className="card sk" style={{ paddingTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 28 }}><span className="check" /></th>
              <th>Title</th><th>Author</th><th>Language</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {POSTS.map((r, i) => (
              <tr key={i}>
                <td><span className={"check" + (i === 0 ? ' on' : '')} /></td>
                <td>
                  <div className="row-title">{r.title}</div>
                  <div className="row-sub mono">/{r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 26)}</div>
                </td>
                <td className="muted">{r.author}</td>
                <td><Flags langs={r.langs} /></td>
                <td>{statusBadge(r.status)}</td>
                <td className="muted mono" style={{ fontSize: 13 }}>{r.date}</td>
                <td>
                  <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                    <button className="icon-btn" title="Edit" style={{ width: 34, height: 34 }} onClick={() => setPage('edit')}><Icon name="edit" size={17} /></button>
                    <button className="icon-btn" title="Delete" style={{ width: 34, height: 34 }}><Icon name="trash" size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="row between wrap" style={{ marginTop: 'var(--gap)' }}>
        <span className="anno">Showing 1–7 of 128 posts</span>
        <div className="pag">
          <span className="pg sk sk-soft"><Icon name="back" size={16} /></span>
          <span className="pg sk on">1</span>
          <span className="pg sk sk-soft">2</span>
          <span className="pg sk sk-soft">3</span>
          <span className="anno" style={{ padding: '0 4px' }}>…</span>
          <span className="pg sk sk-soft">18</span>
          <span className="pg sk sk-soft" style={{ transform: 'scaleX(-1)' }}><Icon name="back" size={16} /></span>
        </div>
      </div>
    </div>
  );
}

function EditPost({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="icon-btn sk sk-soft" onClick={() => setPage('posts')} title="Back to posts"><Icon name="back" /></button>
          <div>
            <h1>Edit Post</h1>
          </div>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft" onClick={() => setPage('posts')}>Cancel</button>
          <button className="btn sk sk-soft">Save draft</button>
          <button className="btn btn-primary sk">Publish</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        {/* main column */}
        <div className="grid">
          <div className="card sk">
            <div className="field">
              <label>Title</label>
              <div className="input sk sk-soft sk-thin"><span className="row-title">Designing a calm dashboard</span></div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Permalink / Slug</label>
              <div className="input sk sk-soft sk-thin"><span className="mono muted">/posts/designing-a-calm-dashboard</span></div>
            </div>
          </div>

          <div className="card sk">
            <div className="between" style={{ marginBottom: 12 }}>
              <label style={{ margin: 0 }}>Body</label>
              <div className="row" style={{ gap: 5 }}>
                {['B', 'i', 'H', '“', '🔗'].map((g, i) => (
                  <span key={i} className="pg sk sk-soft" style={{ width: 30, height: 30, fontSize: 14 }}>{g}</span>
                ))}
              </div>
            </div>
            <div className="input area sk sk-soft sk-thin">
              <span className="ph-text">Write the post content here… (rich-text / markdown editor)</span>
            </div>
            <div className="anno" style={{ marginTop: 10 }}>~ 1,240 words · 6 min read</div>
          </div>

          <div className="card sk">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Excerpt</label>
              <div className="input sk sk-soft sk-thin" style={{ minHeight: 70, alignItems: 'flex-start' }}>
                <span className="ph-text">Short summary shown in listings and search results…</span>
              </div>
            </div>
          </div>
        </div>

        {/* side column */}
        <div className="grid">
          <div className="card sk">
            <h3 style={{ fontSize: 19, marginBottom: 14 }}>Publish</h3>
            <div className="field">
              <label>Status</label>
              <div className="input select sk sk-soft sk-thin"><span>Draft</span><Icon name="caret" size={16} /></div>
            </div>
            <div className="field">
              <label>Visibility</label>
              <div className="input select sk sk-soft sk-thin"><span>Public</span><Icon name="caret" size={16} /></div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Publish date</label>
              <div className="input select sk sk-soft sk-thin"><span className="mono">2026-05-31  10:30</span><Icon name="caret" size={16} /></div>
            </div>
          </div>

          <div className="card sk">
            <h3 style={{ fontSize: 19, marginBottom: 12 }}>Featured image</h3>
            <div className="ph" style={{ height: 150 }}>
              <span className="mono">[ drop image · 1200×630 ]</span>
            </div>
          </div>

          <div className="card sk">
            <h3 style={{ fontSize: 19, marginBottom: 12 }}>Categories</h3>
            {['UI', 'Tutorials', 'News', 'Engineering', 'Culture'].map((c, i) => (
              <label key={c} className="row" style={{ gap: 10, padding: '5px 0', cursor: 'pointer' }}>
                <span className={"check" + (i < 2 ? ' on' : '')} />{c}
              </label>
            ))}
          </div>

          <div className="card sk">
            <h3 style={{ fontSize: 19, marginBottom: 12 }}>Tags</h3>
            <div className="row wrap" style={{ gap: 7, marginBottom: 10 }}>
              {['design', 'dashboard', 'cms'].map((tg) => (
                <span key={tg} className="chip sk sk-soft btn-sm">{tg} ✕</span>
              ))}
            </div>
            <div className="input sk sk-soft sk-thin"><span className="ph-text">Add a tag…</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Media Library ----------
const MEDIA = [
  { type: 'image', name: 'hero-dashboard.jpg', meta: '1.4 MB · 1600×900' },
  { type: 'image', name: 'team-photo.png', meta: '880 KB · 1200×800' },
  { type: 'file', ext: 'PDF', name: 'press-kit.pdf', meta: '2.1 MB' },
  { type: 'image', name: 'cover-summer.jpg', meta: '1.1 MB · 1600×900' },
  { type: 'file', ext: 'MP4', name: 'promo-clip.mp4', meta: '18 MB · 0:42' },
  { type: 'image', name: 'avatar-david.png', meta: '120 KB · 400×400' },
  { type: 'file', ext: 'DOCX', name: 'style-guide.docx', meta: '340 KB' },
  { type: 'image', name: 'chart-export.png', meta: '210 KB · 1024×768' },
  { type: 'file', ext: 'ZIP', name: 'assets-bundle.zip', meta: '46 MB' },
  { type: 'image', name: 'mockup-mobile.jpg', meta: '760 KB · 900×1600' },
  { type: 'file', ext: 'MP3', name: 'podcast-ep12.mp3', meta: '24 MB · 31:10' },
  { type: 'image', name: 'banner-news.jpg', meta: '1.0 MB · 1600×600' },
];

function FileGlyph({ ext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--muted)' }}>
      <svg width="46" height="56" viewBox="0 0 46 56" style={{ display: 'block', filter: 'url(#sketch1)' }}>
        <path d="M5 3h26l10 10v40H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M31 3v10h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="mono" style={{ fontSize: 12, letterSpacing: '.08em' }}>{ext}</span>
    </div>
  );
}

function MediaLibrary({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Media Library</h1>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft"><Icon name="dashboard" size={17} /> Grid</button>
          <button className="btn btn-primary sk"><Icon name="plus" size={17} /> Upload</button>
        </div>
      </div>

      {/* toolbar */}
      <div className="row between wrap" style={{ marginBottom: 'var(--gap)', gap: 12 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="chip sk sk-soft on">All <span className="mono">312</span></span>
          <span className="chip sk sk-soft">Images</span>
          <span className="chip sk sk-soft">Documents</span>
          <span className="chip sk sk-soft">Video</span>
          <span className="chip sk sk-soft">Audio</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip sk sk-soft">Sort: Newest <Icon name="caret" size={14} /></span>
        </div>
      </div>

      {/* media grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
        {MEDIA.map((m, i) => (
          <div key={i} className="card sk" style={{ padding: 12 }}>
            <div className="ph" style={{ aspectRatio: '4 / 3', marginBottom: 11, position: 'relative', overflow: 'hidden' }}>
              {m.type === 'image'
                ? <span className="mono" style={{ fontSize: 12 }}>[ image ]</span>
                : <FileGlyph ext={m.ext} />}
              <span className="icon-btn" style={{ position: 'absolute', top: 4, right: 4, width: 28, height: 28, background: 'var(--panel)' }}><Icon name="dots" size={16} /></span>
            </div>
            <div className="row-title" style={{ fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
            <div className="anno" style={{ marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.meta}</div>
          </div>
        ))}
      </div>

      <div className="row between wrap" style={{ marginTop: 'var(--gap)' }}>
        <span className="anno">Showing 1–12 of 312 files</span>
        <div className="pag">
          <span className="pg sk sk-soft"><Icon name="back" size={16} /></span>
          <span className="pg sk on">1</span>
          <span className="pg sk sk-soft">2</span>
          <span className="pg sk sk-soft">3</span>
          <span className="anno" style={{ padding: '0 4px' }}>…</span>
          <span className="pg sk sk-soft">26</span>
          <span className="pg sk sk-soft" style={{ transform: 'scaleX(-1)' }}><Icon name="back" size={16} /></span>
        </div>
      </div>
    </div>
  );
}

// ---------- Users list ----------
const USERS = [
  { name: 'Ann Bolton', role: 'Administrator', addr: ['5240 Moses Common Suite 747', 'East Maria, South Carolina, 36038, US'], email: 'a.bolton@yahoo.com', phone: '334.843.4437', init: 'AB' },
  { name: 'Catherine Robertson', role: 'Editor', addr: ['0 Jackson Run, 888', 'Hernandezbury, WA, 2191, AU'], email: 'francisco94@hotmail.com', phone: '0447.055.169', init: 'CR' },
  { name: 'Cristobal Menchaca', role: 'Author', addr: ['Diagonal San Luis Potosí 609 835', 'Veracruz de Ignacio, 84991, MX'], email: 'cristobal@hotmail.com', phone: '395.004.7974', init: 'CM' },
  { name: 'Aurelia Zygmuntowicz', role: 'Editor', addr: ['al. Rzeczna 925, Apt. 991', 'Jawor, 56-258, PL'], email: 'oprygiel@rejek.org', phone: '+48 734 736 471', init: 'AZ' },
  { name: 'Tomas Wallin', role: 'Author', addr: ['Ängsgatan 22, Apt. 205', 'Mölndal, Jönköpings, 48414, SE'], email: 'andersson@nilsson.com', phone: '08-17 78 52', init: 'TW' },
  { name: 'Olaf Lether', role: 'Author', addr: ['Timostraat 627, Apt. 216', 'Nijlande, 7059 RO, NL'], email: 'zzevenboom@hotmail.com', phone: '0161-692845', init: 'OL' },
];

function roleBadge(r) {
  const pub = r === 'Administrator';
  return <span className={"badge" + (pub ? ' pub' : '')}>{r}</span>;
}

function UsersList({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Users</h1>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft"><Icon name="export" size={17} /> Export</button>
          <button className="btn btn-primary sk" onClick={() => setPage('useredit')}><Icon name="plus" size={17} /> New User</button>
        </div>
      </div>

      <div className="row between wrap" style={{ marginBottom: 'var(--gap)', gap: 12 }}>
        <div className="searchbox sk sk-soft" style={{ maxWidth: 320 }}>
          <Icon name="search" size={17} /><span>Search users…</span>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="chip sk sk-soft on">All <span className="mono">24</span></span>
          <span className="chip sk sk-soft">Admins</span>
          <span className="chip sk sk-soft">Editors</span>
          <span className="chip sk sk-soft">Authors</span>
        </div>
      </div>

      <div className="card sk" style={{ paddingTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 28 }}><span className="check" /></th>
              <th style={{ width: 52 }}>Image</th>
              <th>Name</th><th>Email</th><th>Phone</th><th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={i} style={{ height: 'auto' }}>
                <td style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top' }}><span className="check" /></td>
                <td style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top' }}><div className="avatar sk" style={{ width: 40, height: 40 }}>{u.init}</div></td>
                <td style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top' }}>
                  <div className="row-title">{u.name}</div>
                  <div style={{ marginTop: 4 }}>{roleBadge(u.role)}</div>
                </td>
                <td className="muted mono" style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top', fontSize: 13 }}>{u.email}</td>
                <td className="muted mono" style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top', fontSize: 13 }}>{u.phone}</td>
                <td style={{ paddingTop: 16, paddingBottom: 16, verticalAlign: 'top' }}>
                  <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                    <button className="icon-btn" title="Edit" style={{ width: 34, height: 34 }} onClick={() => setPage('useredit')}><Icon name="edit" size={17} /></button>
                    <button className="icon-btn" title="Delete" style={{ width: 34, height: 34 }}><Icon name="trash" size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row between wrap" style={{ marginTop: 'var(--gap)' }}>
        <span className="anno">Showing 1–6 of 24 users</span>
        <div className="pag">
          <span className="pg sk sk-soft"><Icon name="back" size={16} /></span>
          <span className="pg sk on">1</span>
          <span className="pg sk sk-soft">2</span>
          <span className="pg sk sk-soft">3</span>
          <span className="pg sk sk-soft">4</span>
          <span className="pg sk sk-soft" style={{ transform: 'scaleX(-1)' }}><Icon name="back" size={16} /></span>
        </div>
      </div>
    </div>
  );
}

// ---------- User edit ----------
function UserEdit({ setPage }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="icon-btn sk sk-soft" onClick={() => setPage('users')} title="Back to users"><Icon name="back" /></button>
          <div>
            <h1>Edit User</h1>
          </div>
        </div>
        <div className="head-actions">
          <button className="btn sk sk-soft" onClick={() => setPage('users')}>Cancel</button>
          <button className="btn btn-primary sk">Save</button>
        </div>
      </div>

      <div className="tabs">
        <span className="tab sk sk-soft on">Profile</span>
        <span className="tab sk sk-soft">Notifications</span>
        <span className="tab sk sk-soft">Integrations</span>
      </div>

      <div className="card sk">
        <div className="sec-head">Profile</div>
        <div className="sec-sub">Manage your name, password and account settings.</div>

        <div className="frow">
          <div className="flabel">Avatar</div>
          <div>
            <div className="row" style={{ gap: 16 }}>
              <div className="avatar-drop ph"><Icon name="media" size={24} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="input select sk sk-soft sk-thin"><span className="ph-text">Browse… no file selected</span><span className="btn btn-sm sk sk-soft" style={{ pointerEvents: 'none' }}>Choose</span></div>
                <div className="fhelp">Pick a photo up to 1 MB.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card sk" style={{ marginTop: 'var(--gap)' }}>
        <div className="sec-head">Personal info</div>
        <div className="sec-sub">Update the user's account details.</div>

        <div className="frow">
          <div className="flabel">Name</div>
          <div>
            <div className="input sk sk-soft sk-thin"><span className="row-title" style={{ fontSize: 16 }}>Catherine Robertson</span></div>
            <div className="fhelp">Full name, or a display name they're comfortable with.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Username</div>
          <div>
            <div className="input sk sk-soft sk-thin mono">c.robertson</div>
            <div className="fhelp">Used in the public profile URL.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Email</div>
          <div>
            <div className="input sk sk-soft sk-thin mono">francisco94@hotmail.com</div>
            <div className="fhelp">The email used to sign in to SeppiaCms.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Role</div>
          <div>
            <div className="input select sk sk-soft sk-thin"><span>Editor</span><Icon name="caret" size={16} /></div>
            <div className="fhelp">Controls what this user can access and edit.</div>
          </div>
        </div>
        <div className="frow">
          <div className="flabel">Location</div>
          <div>
            <div className="input select sk sk-soft sk-thin"><span className="ph-text">Select country</span><Icon name="caret" size={16} /></div>
            <div className="fhelp">Only certain countries are served.</div>
          </div>
        </div>

        <div className="save-bar">
          <span className="anno">Last saved: Feb 10, 2026 — 06:16</span>
          <div className="row" style={{ marginLeft: 'auto', gap: 10 }}>
            <button className="btn sk sk-soft" onClick={() => setPage('users')}>Cancel</button>
            <button className="btn btn-primary sk">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, PostsList, EditPost, MediaLibrary, UsersList, UserEdit, Sparkline });
