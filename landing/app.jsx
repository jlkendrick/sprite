// app.jsx — root component, tab state, theme/accent/sidebar tweaks

const { useState, useEffect, useMemo } = React;

const ACCENT_OPTIONS = [
  { value: "blue",   label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "amber",  label: "Amber" },
  { value: "green",  label: "Green" },
];
const SIDEBAR_OPTIONS = [
  { value: "left",   label: "Left" },
  { value: "right",  label: "Right" },
  { value: "hidden", label: "Hidden" },
];

const App = () => {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__);

  // tabs: array of section ids; activeId: which is shown
  const [tabs, setTabs] = useState(["overview"]);
  const [activeId, setActiveId] = useState("overview");
  const [expanded, setExpanded] = useState({ _dirvana: true, _features: true, _install: true });

  // apply theme + accent
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "light");
    document.documentElement.setAttribute("data-accent", tweaks.accent || "blue");
  }, [tweaks.theme, tweaks.accent]);

  const openTab = (id, opts = {}) => {
    if (!SECTIONS[id]) return;
    setTabs((t) => (t.includes(id) ? t : [...t, id]));
    setActiveId(id);
    // expand parent folder in tree
    setExpanded((e) => {
      const next = { ...e };
      // find parent
      const findParent = (nodes, target, parents = []) => {
        for (const n of nodes) {
          if (n.id === target) return parents;
          if (n.children) {
            const r = findParent(n.children, target, [...parents, n.id]);
            if (r) return r;
          }
        }
        return null;
      };
      const ps = findParent(TREE, id) || [];
      ps.forEach((p) => next[p] = true);
      return next;
    });
  };

  const closeTab = (id) => {
    setTabs((t) => {
      const idx = t.indexOf(id);
      const next = t.filter((x) => x !== id);
      if (next.length === 0) {
        // keep at least one tab
        setActiveId("overview");
        return ["overview"];
      }
      if (id === activeId) {
        const newActive = next[Math.max(0, idx - 1)];
        setActiveId(newActive);
      }
      return next;
    });
  };

  const sec = SECTIONS[activeId];

  return (
    <div className="app-frame">
      <div className="brand-row">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-name">Dir<em>vana</em></div>
          </div>
          <span className="brand-tag">v1.0.1 · macOS</span>
        </div>
        <div className="brand-meta">
          <span className="dot" />
          <span>shipping · MIT</span>
        </div>
      </div>

      <div className="window">
        <TitleBar activeId={activeId} />

        <div className={"body-grid " + (tweaks.sidebar || "left")}>
          {tweaks.sidebar !== "hidden" && (
            <Sidebar
              activeId={activeId}
              openTab={openTab}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          )}

          <div className="main-col">
            <TabBar tabs={tabs} activeId={activeId} setActive={setActiveId} closeTab={closeTab} />
            <div className="content" key={activeId}>
              <div className="content-inner">
                {sec ? sec.render({ openTab }) : null}
              </div>
            </div>
            <Terminal openTab={openTab} currentLabel={sec?.label} />
          </div>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Appearance">
          <TweakRadio
            label="Theme"
            value={tweaks.theme || "light"}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
            onChange={(v) => setTweak("theme", v)}
          />
          <TweakRadio
            label="Accent"
            value={tweaks.accent || "blue"}
            options={ACCENT_OPTIONS}
            onChange={(v) => setTweak("accent", v)}
          />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Sidebar"
            value={tweaks.sidebar || "left"}
            options={SIDEBAR_OPTIONS}
            onChange={(v) => setTweak("sidebar", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
