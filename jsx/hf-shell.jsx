// hf-shell.jsx — Hugeicons renderer, Sidebar, Breadcrumb, user menu (hi-fi).

// Map our semantic names -> candidate Hugeicons export names (first that exists wins).
const ICON_MAP = {
  dashboard:   ['DashboardSquare01Icon', 'DashboardSquare02Icon', 'GridIcon'],
  posts:       ['File01Icon', 'DocumentText01Icon', 'Note01Icon'],
  edit:        ['PencilEdit01Icon', 'PencilEdit02Icon', 'Edit02Icon'],
  media:       ['Image01Icon', 'Image02Icon', 'Album02Icon'],
  users:       ['UserGroupIcon', 'UserMultiple02Icon', 'UserMultipleIcon'],
  settings:    ['Settings01Icon', 'Settings02Icon'],
  appearance:  ['PaintBoardIcon', 'PaintBrush01Icon', 'ColorsIcon'],
  search:      ['Search01Icon', 'Search02Icon'],
  panel:       ['SidebarLeft01Icon', 'SidebarLeftIcon', 'Menu01Icon'],
  sun:         ['Sun03Icon', 'Sun01Icon', 'Sun02Icon'],
  moon:        ['Moon02Icon', 'Moon01Icon'],
  caret:       ['ArrowDown01Icon'],
  'caret-up':  ['ArrowUp01Icon'],
  plus:        ['PlusSignIcon', 'Add01Icon'],
  back:        ['ArrowLeft01Icon'],
  next:        ['ArrowRight01Icon'],
  check:       ['Tick02Icon', 'Tick01Icon', 'CheckmarkSquare01Icon'],
  trash:       ['Delete02Icon', 'Delete01Icon'],
  dots:        ['MoreHorizontalIcon', 'MoreHorizontalCircle01Icon'],
  export:      ['Download01Icon', 'Download04Icon'],
  upload:      ['Upload01Icon', 'CloudUpload01Icon'],
  home:        ['Home01Icon', 'Home03Icon'],
  logout:      ['Logout01Icon', 'Logout02Icon'],
  account:     ['UserAccountIcon', 'UserCircleIcon', 'User01Icon'],
  filter:      ['FilterIcon', 'FilterHorizontalIcon'],
  up:          ['ArrowUpRight01Icon', 'TradeUpIcon'],
  calendar:    ['Calendar03Icon', 'Calendar01Icon'],
  link:        ['Link01Icon', 'Link02Icon'],
  eye:         ['ViewIcon', 'Eye01Icon'],
  bold:        ['TextBoldIcon'],
  italic:      ['TextItalicIcon'],
  heading:     ['Heading01Icon', 'TextIcon'],
  quote:       ['QuoteDownIcon', 'LeftToRightBlockQuoteIcon'],
  doc:         ['File02Icon', 'DocumentAttachmentIcon'],
  video:       ['Video01Icon', 'PlayIcon'],
  audio:       ['MusicNote01Icon', 'AudioWave01Icon'],
  zip:         ['FolderZipIcon', 'Archive02Icon', 'Archive01Icon'],
  errors:      ['Alert02Icon', 'AlertCircleIcon', 'AlertDiamondIcon'],
  warn:        ['AlertCircleIcon', 'Alert02Icon'],
  info:        ['InformationCircleIcon', 'InformationSquareIcon'],
  copy:        ['Copy01Icon', 'Copy02Icon'],
};

function resolveIcon(name) {
  const ns = window.HUGE_NS;
  if (!ns) return null;
  const candidates = ICON_MAP[name] || [];
  for (const c of candidates) { if (ns[c]) return ns[c]; }
  return null;
}

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const data = resolveIcon(name);
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', style: { display: 'block', flex: 'none' } };
  if (!data) {
    // graceful fallback box (keeps layout stable until icons load)
    return <svg {...common}></svg>;
  }
  return (
    <svg {...common} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" color="currentColor">
      {data.map((el, i) => {
        const [tag, attrs] = el;
        return React.createElement(tag, { ...attrs, key: attrs.key != null ? attrs.key : i });
      })}
    </svg>
  );
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
    { id: 'logs', label: 'Log errori', icon: 'errors', pill: '3' },
  ]},
];

const LIVE = new Set(['dashboard', 'posts', 'edit', 'media', 'users', 'useredit', 'settings', 'logs']);

function Sidebar({ page, setPage, sidebar, onToggleSidebar, theme, setTheme }) {
  const activeId = page === 'edit' ? 'posts' : page === 'useredit' ? 'users' : page;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const bodyRef = React.useRef(null);
  const [bodyH, setBodyH] = React.useState(264);
  React.useLayoutEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight);
  }, [theme, sidebar]);
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="mark"><svg className="mark-svg" aria-label="SeppiaCms"><use href="#seppia-mark" /></svg></span>
        <div className="name">SeppiaCms</div>
        <button className="sb-toggle" onClick={onToggleSidebar}
          title={sidebar === 'icononly' ? 'Expand menu' : 'Collapse menu'}>
          <Icon name="panel" size={19} />
        </button>
      </div>

      {NAV.map((sec) => (
        <div key={sec.group}>
          <div className="group-label"><span className="gl-text">{sec.group}</span></div>
          {sec.items.map((it) => (
            <button key={it.id}
              className={"nav-item" + (activeId === it.id ? " active" : "")}
              title={it.label}
              onClick={() => LIVE.has(it.id) && setPage(it.id)}>
              <span className="ico"><Icon name={it.icon} size={19} /></span>
              <span className="lbl">{it.label}</span>
              {it.pill && <span className="pill">{it.pill}</span>}
            </button>
          ))}
        </div>
      ))}

      <div className="sb-foot">
        {menuOpen && <div className="um-overlay" onClick={() => setMenuOpen(false)}></div>}
        <div className="usercard-wrap" style={{ height: (bodyH + 66) + 'px' }}>
          <div className={"um-panel" + (menuOpen ? " open" : "")} style={{ '--um-body-h': bodyH + 'px' }}>
            <button className={"usercard" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((v) => !v)}>
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>DD</div>
              <div className="uname">
                <b>David Dev</b><span>Administrator</span>
              </div>
              <span className="uc-caret"><Icon name="caret-up" size={16} /></span>
            </button>
            <div className="um-body" ref={bodyRef}>
              <div className="um-seg">
                <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
                  <Icon name="moon" size={15} /> Dark
                </button>
                <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
                  <Icon name="sun" size={15} /> Light
                </button>
              </div>
              <div className="um-sep"></div>
              <button className="um-item" onClick={() => { setMenuOpen(false); setPage('settings'); }}><span className="ico"><Icon name="account" size={17} /></span> Account settings</button>
              <button className="um-item" onClick={() => { setMenuOpen(false); setPage('settings'); }}><span className="ico"><Icon name="settings" size={17} /></span> Preferences</button>
              <div className="um-sep"></div>
              <button className="um-item" onClick={() => { window.location.href = 'Login.html'; }}><span className="ico"><Icon name="logout" size={17} /></span> Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const CRUMBS = {
  dashboard: [{ label: 'Home', icon: 'home' }, { label: 'Dashboard', icon: 'dashboard' }],
  posts:     [{ label: 'Home', icon: 'home' }, { label: 'Posts', icon: 'posts' }],
  edit:      [{ label: 'Home', icon: 'home' }, { label: 'Posts', icon: 'posts' }, { label: 'Designing a calm dashboard', icon: 'edit' }],
  media:     [{ label: 'Home', icon: 'home' }, { label: 'Media', icon: 'media' }],
  users:     [{ label: 'Home', icon: 'home' }, { label: 'Users', icon: 'users' }],
  useredit:  [{ label: 'Home', icon: 'home' }, { label: 'Users', icon: 'users' }, { label: 'Catherine Robertson', icon: 'edit' }],
  logs:      [{ label: 'Home', icon: 'home' }, { label: 'Log errori', icon: 'errors' }],
  settings:  [{ label: 'Home', icon: 'home' }, { label: 'Settings', icon: 'settings' }, { label: 'Account', icon: 'account' }],
};

function Breadcrumb({ page }) {
  const items = CRUMBS[page] || CRUMBS.dashboard;
  return (
    <div className="crumbbar">
      {items.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="cb-sep"><Icon name="next" size={14} strokeWidth={2} /></span>}
          <span className={"cb-item" + (i === items.length - 1 ? " cur" : "")}>
            <span className="ico"><Icon name={c.icon} size={15} /></span>{c.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, Breadcrumb });
