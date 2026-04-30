// components.jsx — Sidebar tree + Tab bar + Title bar
// Depends on: TREE, SECTIONS, Icon (globals from content.jsx)

const Sidebar = ({ activeId, openTab, expanded, setExpanded }) => {
  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const renderNode = (node, depth = 0) => {
    if (node.type === "folder" || node.type === "root") {
      const open = expanded[node.id] !== false; // default open
      return (
        <div key={node.id}>
          <div
            className={"sb-row" + (open ? " open" : "")}
            onClick={() => toggle(node.id)}
            style={{ paddingLeft: 8 }}
          >
            <span className="chev"><Icon name="chev" size={12} /></span>
            <span className="ico"><Icon name={open ? "folder-open" : "folder"} size={15} /></span>
            <span className="lbl">{node.label}</span>
            <span className="meta">{node.children.length}</span>
          </div>
          {open && (
            <div className="sb-children">
              {node.children.map((c) => renderNode(c, depth + 1))}
            </div>
          )}
        </div>
      );
    }
    // leaf
    const active = activeId === node.id;
    return (
      <div
        key={node.id}
        className={"sb-row" + (active ? " active" : "")}
        onClick={(e) => openTab(node.id, { focus: true, fromDouble: e.detail >= 2 })}
        onDoubleClick={() => openTab(node.id, { focus: true, fromDouble: true })}
        title={node.label}
      >
        <span className="leaf" />
        <span className="ico"><Icon name={node.icon} size={14} /></span>
        <span className="lbl">{node.label}</span>
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sb-section">Workspace</div>
      <div className="sb-tree">{TREE.map((n) => renderNode(n))}</div>
      <div className="sb-foot">
        <div className="row"><span className="key">version</span><span>1.0.1</span></div>
        <div className="row"><span className="key">platform</span><span>macOS</span></div>
        <div className="row"><span className="key">license</span><span>MIT</span></div>
      </div>
    </aside>
  );
};

const TabBar = ({ tabs, activeId, setActive, closeTab }) => {
  return (
    <div className="tabs">
      {tabs.map((t) => {
        const sec = SECTIONS[t];
        if (!sec) return null;
        const active = t === activeId;
        return (
          <div
            key={t}
            className={"tab entering" + (active ? " active" : "")}
            onClick={() => setActive(t)}
          >
            <span className="ico"><Icon name={sec.icon} size={13} /></span>
            <span className="lbl">{sec.label}</span>
            {tabs.length > 1 && (
              <span
                className="x"
                onClick={(e) => { e.stopPropagation(); closeTab(t); }}
                title="Close tab"
              ><Icon name="x" size={11} /></span>
            )}
          </div>
        );
      })}
      <div className="tabs-tail" />
    </div>
  );
};

const TitleBar = ({ activeId, theme, onToggleTheme }) => {
  const sec = SECTIONS[activeId];
  const crumbs = sec?.crumbs || ["~", "sprite"];
  const isDark = (theme || "light") === "dark";
  const themeIcon = isDark ? "sun" : "moon";
  return (
    <div className="titlebar">
      <div className="traffic"><span className="r" /><span className="y" /><span className="g" /></div>
      <div className="titlebar-path">
        <Icon name="folder" size={12} />
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span className={"crumb" + (i === crumbs.length - 1 ? " active" : "")}>{c}</span>
            {i < crumbs.length - 1 && <span className="sep">›</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="titlebar-actions">
        <button className="icon-btn" title="Search"><Icon name="search" size={14} /></button>
        <button
          type="button"
          className="icon-btn"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={onToggleTheme}
        >
          <Icon name={themeIcon} size={14} />
        </button>
        <a className="icon-btn" href="https://github.com/jlkendrick/sprite" target="_blank" rel="noreferrer" title="GitHub"><Icon name="github" size={14} /></a>
      </div>
    </div>
  );
};

Object.assign(window, { Sidebar, TabBar, TitleBar });
