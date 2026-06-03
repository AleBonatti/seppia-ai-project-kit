// wf-shell.jsx — Sidebar + Topbar for the SeppiaCms wireframe.
// Simple geometric icons only (squares, circles, lines) to keep the low-fi vibe.

function Icon({ name, size = 19 }) {
  const s = { width: size, height: size, display: 'block' };
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'dashboard':
      return (<svg style={s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="8" rx="1.5" {...p}/><rect x="14" y="3" width="7" height="5" rx="1.5" {...p}/><rect x="14" y="11" width="7" height="10" rx="1.5" {...p}/><rect x="3" y="14" width="7" height="7" rx="1.5" {...p}/></svg>);
    case 'posts':
      return (<svg style={s} viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" {...p}/><line x1="8" y1="8" x2="16" y2="8" {...p}/><line x1="8" y1="12" x2="16" y2="12" {...p}/><line x1="8" y1="16" x2="13" y2="16" {...p}/></svg>);
    case 'edit':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M5 19h4l9-9-4-4-9 9z" {...p}/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" {...p}/></svg>);
    case 'media':
      return (<svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" {...p}/><circle cx="9" cy="10" r="2" {...p}/><path d="M4 18l5-4 4 3 3-2 4 3" {...p}/></svg>);
    case 'comments':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 3v-3H4z" {...p}/></svg>);
    case 'users':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" {...p}/><path d="M3.5 20c0-3.3 2.5-5 5.5-5s5.5 1.7 5.5 5" {...p}/><circle cx="17" cy="9" r="2.2" {...p}/><path d="M16 14.4c2.5.1 4.5 1.7 4.5 4.6" {...p}/></svg>);
    case 'appearance':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" {...p}/><circle cx="9" cy="9" r="1.2" {...p}/><circle cx="14.5" cy="9" r="1.2" {...p}/><circle cx="9.5" cy="14.5" r="1.2" {...p}/></svg>);
    case 'settings':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" {...p}/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2" {...p}/></svg>);
    case 'search':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" {...p}/><line x1="20" y1="20" x2="15.5" y2="15.5" {...p}/></svg>);
    case 'bell':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z" {...p}/><path d="M10 20a2 2 0 0 0 4 0" {...p}/></svg>);
    case 'menu':
      return (<svg style={s} viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7" {...p}/><line x1="4" y1="12" x2="20" y2="12" {...p}/><line x1="4" y1="17" x2="16" y2="17" {...p}/></svg>);
    case 'panel':
      return (<svg style={s} viewBox="0 0 24 24"><rect x="3.5" y="4" width="17" height="16" rx="2" {...p}/><line x1="10" y1="4" x2="10" y2="20" {...p}/></svg>);
    case 'sun':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" {...p}/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19" {...p}/></svg>);
    case 'moon':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" {...p}/></svg>);
    case 'caret':
      return (<svg style={s} viewBox="0 0 24 24"><polyline points="7 10 12 15 17 10" {...p}/></svg>);
    case 'plus':
      return (<svg style={s} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" {...p}/><line x1="5" y1="12" x2="19" y2="12" {...p}/></svg>);
    case 'back':
      return (<svg style={s} viewBox="0 0 24 24"><polyline points="14 6 8 12 14 18" {...p}/></svg>);
    case 'trash':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" {...p}/></svg>);
    case 'dots':
      return (<svg style={s} viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>);
    case 'export':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4" {...p}/><path d="M4 15v4h16v-4" {...p}/></svg>);
    case 'home':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M4 11l8-7 8 7" {...p}/><path d="M6 9.5V20h12V9.5" {...p}/></svg>);
    case 'logout':
      return (<svg style={s} viewBox="0 0 24 24"><path d="M14 4H6v16h8" {...p}/><path d="M11 12h9M17 8l4 4-4 4" {...p}/></svg>);
    case 'caret-up':
      return (<svg style={s} viewBox="0 0 24 24"><polyline points="7 14 12 9 17 14" {...p}/></svg>);
    default:
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" {...p}/></svg>;
  }
}

const NAV = [
  { group: 'Main Contents', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'posts', label: 'Posts', icon: 'posts', pill: '128' },
    { id: 'media', label: 'Media', icon: 'media' },
  ]},
  { group: 'Settings', items: [
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'appearance', label: 'Appearance', icon: 'appearance' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]},
];

// pages that aren't wired get a gentle no-op (stay on current page visual cue)
const LIVE = new Set(['dashboard', 'posts', 'edit', 'media', 'users', 'useredit']);

function Sidebar({ page, setPage, sidebar, onToggleSidebar, theme, setTheme }) {
  const activeId = page === 'edit' ? 'posts' : page === 'useredit' ? 'users' : page;
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark sk">S</div>
        <div className="name">SeppiaCms</div>
        <button className="sb-toggle" onClick={onToggleSidebar}
          title={sidebar === 'icononly' ? 'Expand menu' : 'Collapse menu'}>
          <Icon name="panel" size={18} />
        </button>
      </div>
      {NAV.map((sec) => (
        <div key={sec.group}>
          <div className="group-label">{sec.group}</div>
          {sec.items.map((it) => (
            <button
              key={it.id}
              className={"nav-item" + (activeId === it.id ? " active" : "")}
              title={it.label}
              onClick={() => LIVE.has(it.id) && setPage(it.id)}
            >
              <span className="ico"><Icon name={it.icon} /></span>
              <span className="lbl">{it.label}</span>
              {it.pill && <span className="pill">{it.pill}</span>}
            </button>
          ))}
        </div>
      ))}

      <div className="sb-foot">
        {menuOpen && <div className="um-overlay" onClick={() => setMenuOpen(false)}></div>}
        <div className="usercard-wrap">
          {menuOpen && (
            <div className="usermenu sk">
              <div className="um-label">Appearance</div>
              <div className="um-seg">
                <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
                  <Icon name="moon" size={16} /> Dark
                </button>
                <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
                  <Icon name="sun" size={16} /> Light
                </button>
              </div>
              <div className="um-sep"></div>
              <button className="um-item"><Icon name="settings" size={17} /> Account settings</button>
              <button className="um-item"><Icon name="logout" size={17} /> Sign out</button>
            </div>
          )}
          <button className={"usercard" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((v) => !v)}>
            <div className="avatar sk">DD</div>
            <div className="uname">
              <b>David Dev</b><span>Administrator</span>
            </div>
            <span className="uc-caret"><Icon name="caret-up" size={16} /></span>
          </button>
        </div>
      </div>
    </aside>
  );
}

const CRUMBS = {
  dashboard: [{ label: 'Home', icon: 'home' }, { label: 'Dashboard', icon: 'dashboard' }],
  posts: [{ label: 'Home', icon: 'home' }, { label: 'Posts', icon: 'posts' }],
  edit: [{ label: 'Home', icon: 'home' }, { label: 'Posts', icon: 'posts' }, { label: 'Edit', icon: 'edit' }, { label: 'Designing a calm dashboard', icon: 'posts' }],
  media: [{ label: 'Home', icon: 'home' }, { label: 'Media', icon: 'media' }],
  users: [{ label: 'Home', icon: 'home' }, { label: 'Users', icon: 'users' }, { label: 'List', icon: 'users' }],
  useredit: [{ label: 'Home', icon: 'home' }, { label: 'Users', icon: 'users' }, { label: 'Edit', icon: 'edit' }, { label: 'Catherine Robertson', icon: 'users' }],
};

function Breadcrumb({ page }) {
  const items = CRUMBS[page] || CRUMBS.dashboard;
  return (
    <div className="crumbbar">
      {items.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="cb-sep">/</span>}
          <span className={"cb-item" + (i === items.length - 1 ? " cur" : "")}>
            <Icon name={c.icon} size={16} />{c.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, Breadcrumb });
