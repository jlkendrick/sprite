// app.jsx — root component, tab state, theme/accent/sidebar tweaks

const { useState, useEffect, useMemo } = React;

const ACCENT_OPTIONS = [
  { value: "moss",   label: "Moss" },
  { value: "tide",   label: "Tide" },
  { value: "dusk",   label: "Dusk" },
  { value: "ember",  label: "Ember" },
];
const SIDEBAR_OPTIONS = [
  { value: "left",   label: "Left" },
  { value: "right",  label: "Right" },
  { value: "hidden", label: "Hidden" },
];
const LOGO_OPTIONS = [
  { value: "warp",    label: "Warp" },
  { value: "bracket", label: "Bracket" },
  { value: "stack",   label: "Stack" },
];

// ---------- Logo marks ----------
// Sprite: a luminous wisp/spark, folklore-style — a four-point star with
// a curling motion trail. White on the gradient mark.
const BrandMark = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" fill="none"
       stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
    {/* curling motion trail (the sprite's path) */}
    <path d="M7 30 Q 11 22 16 22 T 24 16"
          strokeWidth="1.4" opacity="0.55"
          strokeDasharray="1 3" />
    {/* four-point sparkle star — the sprite itself */}
    <g transform="translate(25 16)">
      <path d="M0 -8 L1.6 -1.6 L8 0 L1.6 1.6 L0 8 L-1.6 1.6 L-8 0 L-1.6 -1.6 Z"
            fill="#fff" stroke="none" />
      {/* inner core */}
      <circle cx="0" cy="0" r="1.6" fill="#fff" stroke="none" opacity="0.6" />
      {/* tiny secondary spark */}
    </g>
    {/* trailing tiny spark */}
    <g transform="translate(13 26)">
      <path d="M0 -2.6 L0.6 -0.6 L2.6 0 L0.6 0.6 L0 2.6 L-0.6 0.6 L-2.6 0 L-0.6 -0.6 Z"
            fill="#fff" stroke="none" opacity="0.75" />
    </g>
  </svg>
);

// ---------- Runic monolith ----------
// A stylized stone obelisk for the margin: tapered silhouette, a few
// carved bands of runic glyphs (file-syntax characters), moss creep on
// the lower third, and a faint glowing sigil. Geometric, not photoreal.
const Monolith = ({ variant = "a" }) => {
  // Two slight variants for left/right asymmetry
  const tall = variant === "a";
  return (
    <svg viewBox="0 0 200 800" preserveAspectRatio="xMidYEnd meet" fill="none">
      <defs>
        <linearGradient id={`stone-${variant}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0"   stopColor="oklch(0.42 0.018 80)" />
          <stop offset="0.4" stopColor="oklch(0.55 0.022 80)" />
          <stop offset="0.7" stopColor="oklch(0.48 0.020 80)" />
          <stop offset="1"   stopColor="oklch(0.32 0.016 75)" />
        </linearGradient>
        <linearGradient id={`stone-light-${variant}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0"   stopColor="oklch(0.78 0.10 90 / 0.55)" />
          <stop offset="0.4" stopColor="oklch(0.70 0.08 85 / 0.15)" />
          <stop offset="1"   stopColor="transparent" />
        </linearGradient>
        <linearGradient id={`moss-${variant}`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0"   stopColor="oklch(0.42 0.13 145 / 0.92)" />
          <stop offset="0.5" stopColor="oklch(0.50 0.13 145 / 0.6)" />
          <stop offset="1"   stopColor="oklch(0.55 0.10 145 / 0)" />
        </linearGradient>
        <radialGradient id={`sigil-${variant}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0"   stopColor="oklch(0.85 0.18 90 / 0.9)" />
          <stop offset="0.5" stopColor="oklch(0.75 0.20 85 / 0.4)" />
          <stop offset="1"   stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Pillar silhouette — slight taper, capped with a small architrave */}
      <g>
        {/* architrave (top cap) */}
        <path d={tall
          ? "M 30 90 L 170 90 L 178 78 L 22 78 Z"
          : "M 35 180 L 165 180 L 172 168 L 28 168 Z"}
          fill={`url(#stone-${variant})`} />
        {/* main shaft */}
        <path d={tall
          ? "M 36 90 L 164 90 L 168 800 L 32 800 Z"
          : "M 42 180 L 158 180 L 162 800 L 38 800 Z"}
          fill={`url(#stone-${variant})`} />
        {/* light side highlight */}
        <path d={tall
          ? "M 36 90 L 64 90 L 68 800 L 32 800 Z"
          : "M 42 180 L 68 180 L 70 800 L 38 800 Z"}
          fill={`url(#stone-light-${variant})`} />
      </g>

      {/* Carved horizontal bands (chiseled lines) */}
      <g stroke="oklch(0.22 0.012 70 / 0.55)" strokeWidth="1.2" fill="none">
        <line x1="36" y1={tall ? 110 : 200} x2="164" y2={tall ? 110 : 200} />
        <line x1="36" y1={tall ? 118 : 208} x2="164" y2={tall ? 118 : 208} />
        <line x1="36" y1={tall ? 360 : 380} x2="164" y2={tall ? 360 : 380} />
        <line x1="36" y1={tall ? 368 : 388} x2="164" y2={tall ? 368 : 388} />
      </g>

      {/* Carved runic glyph rows — file-syntax chars, like the bg-glyphs vocabulary */}
      <g fontFamily="var(--font-mono)" fontSize="13"
         fill="oklch(0.22 0.012 70 / 0.78)" letterSpacing="2">
        <text x="100" y={tall ? 150 : 240} textAnchor="middle">
          {tall ? "✦  ❯  ✦  ❯  ✦" : "·  ✦  ❯  ✦  ·"}
        </text>
        <text x="100" y={tall ? 180 : 270} textAnchor="middle" fontSize="11" opacity="0.75">
          {tall ? "{ / } * /" : "/ ✦ /"}
        </text>
        <text x="100" y={tall ? 220 : 310} textAnchor="middle" fontSize="11" opacity="0.65">
          {tall ? "❯❯  ~/" : "~/  ❯"}
        </text>
        <text x="100" y={tall ? 260 : 350} textAnchor="middle">
          {tall ? "⟡  ✦  ⟡" : "⟡  ❯  ⟡"}
        </text>
      </g>

      {/* Glowing sigil — a single carved star that catches the light */}
      <g transform={`translate(100 ${tall ? 320 : 420})`}>
        <circle r="22" fill={`url(#sigil-${variant})`} />
        <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z"
              fill="oklch(0.92 0.18 90 / 0.85)" />
      </g>

      {/* Lower band of runes near the moss */}
      <g fontFamily="var(--font-mono)" fontSize="12"
         fill="oklch(0.22 0.012 70 / 0.55)" letterSpacing="2.5">
        <text x="100" y="540" textAnchor="middle">{"<*>  ⟡  </>"}</text>
        <text x="100" y="566" textAnchor="middle" fontSize="10" opacity="0.7">
          ../  /  ../
        </text>
      </g>

      {/* Moss creep — irregular blob along the base */}
      <g>
        <path d="M 20 800
                 L 20 640
                 Q 36 620 50 638
                 Q 64 612 82 632
                 Q 96 608 116 628
                 Q 132 604 152 628
                 Q 168 614 180 638
                 L 180 800 Z"
              fill={`url(#moss-${variant})`} />
        {/* small leafy clumps */}
        <g fill="oklch(0.55 0.14 145 / 0.7)">
          <ellipse cx="42" cy="652" rx="6" ry="3" />
          <ellipse cx="76" cy="640" rx="7" ry="3" />
          <ellipse cx="108" cy="648" rx="6" ry="3" />
          <ellipse cx="140" cy="638" rx="7" ry="3" />
          <ellipse cx="166" cy="654" rx="5" ry="2.5" />
        </g>
      </g>

      {/* A vine creeping up the side */}
      <g stroke="oklch(0.45 0.13 145 / 0.7)" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M 30 800 Q 50 720 36 640 Q 22 560 44 480 Q 60 420 40 360" />
      </g>
      <g fill="oklch(0.55 0.14 145 / 0.78)">
        <ellipse cx="42" cy="700" rx="5" ry="2.5" transform="rotate(-25 42 700)" />
        <ellipse cx="32" cy="600" rx="5" ry="2.5" transform="rotate(20 32 600)" />
        <ellipse cx="48" cy="500" rx="5" ry="2.5" transform="rotate(-15 48 500)" />
        <ellipse cx="38" cy="420" rx="4.5" ry="2.2" transform="rotate(25 38 420)" />
      </g>
    </svg>
  );
};

// ---------- Vine drape (top corners) ----------
const VineDrape = () => (
  <svg viewBox="0 0 400 460" preserveAspectRatio="xMinYMin meet" fill="none">
    <defs>
      <linearGradient id="vine-fade" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0"   stopColor="oklch(0.42 0.13 145 / 0.85)" />
        <stop offset="0.7" stopColor="oklch(0.50 0.14 145 / 0.5)" />
        <stop offset="1"   stopColor="oklch(0.55 0.13 145 / 0)" />
      </linearGradient>
    </defs>
    {/* Main trailing vine */}
    <g stroke="url(#vine-fade)" strokeWidth="2.2" fill="none" strokeLinecap="round">
      <path d="M -10 -10 Q 60 40 50 110 Q 40 180 90 220 Q 140 260 120 340 Q 110 400 60 440" />
      <path d="M 0 0 Q 80 30 110 90 Q 140 150 200 170 Q 250 188 240 260" opacity="0.7" />
      <path d="M 30 0 Q 100 60 170 80 Q 230 95 280 140" opacity="0.55" />
    </g>
    {/* Leaf clusters — simple ellipses rotated, layered */}
    <g fill="oklch(0.50 0.14 145 / 0.85)">
      {/* Cluster 1 — near top-left */}
      <ellipse cx="55" cy="120" rx="14" ry="6" transform="rotate(-30 55 120)" />
      <ellipse cx="48" cy="132" rx="12" ry="5" transform="rotate(15 48 132)" />
      <ellipse cx="68" cy="116" rx="11" ry="5" transform="rotate(35 68 116)" />
      {/* Cluster 2 */}
      <ellipse cx="98" cy="226" rx="15" ry="6.5" transform="rotate(-15 98 226)" />
      <ellipse cx="86" cy="240" rx="12" ry="5" transform="rotate(40 86 240)" />
      <ellipse cx="116" cy="218" rx="13" ry="5.5" transform="rotate(20 116 218)" />
      {/* Cluster 3 */}
      <ellipse cx="128" cy="346" rx="13" ry="6" transform="rotate(-25 128 346)" />
      <ellipse cx="116" cy="360" rx="11" ry="5" transform="rotate(20 116 360)" />
      {/* Hanging tip */}
      <ellipse cx="64" cy="436" rx="10" ry="4.5" transform="rotate(60 64 436)" />
      {/* Branch leaves */}
      <ellipse cx="200" cy="172" rx="13" ry="5.5" transform="rotate(-10 200 172)" />
      <ellipse cx="216" cy="184" rx="11" ry="4.8" transform="rotate(35 216 184)" />
      <ellipse cx="240" cy="262" rx="12" ry="5" transform="rotate(-20 240 262)" />
      <ellipse cx="252" cy="276" rx="10" ry="4.5" transform="rotate(30 252 276)" />
    </g>
    {/* Lighter highlight leaves on top */}
    <g fill="oklch(0.68 0.16 145 / 0.7)">
      <ellipse cx="58" cy="118" rx="8" ry="3.2" transform="rotate(-30 58 118)" />
      <ellipse cx="100" cy="224" rx="9" ry="3.5" transform="rotate(-15 100 224)" />
      <ellipse cx="130" cy="344" rx="8" ry="3.2" transform="rotate(-25 130 344)" />
      <ellipse cx="202" cy="170" rx="8" ry="3.2" transform="rotate(-10 202 170)" />
    </g>
  </svg>
);

// ---------- Runic landscape wrapper ----------
const RunicLandscape = () => (
  <div className="bg-runic" aria-hidden="true">
    <div className="bg-vine left"><VineDrape /></div>
    <div className="bg-vine right"><VineDrape /></div>
    <div className="bg-monolith left"><Monolith variant="a" /></div>
    <div className="bg-monolith right"><Monolith variant="b" /></div>
    <div className="bg-undergrowth" />
    <span className="firefly"     style={{ left: "18%", top: "62%" }} />
    <span className="firefly f2"  style={{ left: "82%", top: "58%" }} />
    <span className="firefly f3"  style={{ left: "12%", top: "38%" }} />
    <span className="firefly f4"  style={{ left: "88%", top: "44%" }} />
    <span className="firefly f5"  style={{ left: "50%", top: "22%" }} />
    <span className="firefly f2"  style={{ left: "26%", top: "20%" }} />
    <span className="firefly f4"  style={{ left: "74%", top: "26%" }} />
  </div>
);

// ---------- Background ornaments ----------
// SVG layer rendered behind the app frame: a faint constellation grid
// (vertices = directory nodes) with a few connecting lines, a runic margin
// of file-syntax glyphs, and three drifting "sprite motes."
const BgCanvas = () => (
  <>
    <div className="bg-canvas" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="vert-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="var(--glow)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--glow)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--glow)" stopOpacity="0" />
          </radialGradient>
          <pattern id="dot-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="currentColor" />
          </pattern>
        </defs>
        {/* dot grid — very faint */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#dot-grid)"
              style={{ color: "var(--accent)" }} opacity="0.10" />
        {/* connecting "filesystem" lines — sparse constellation */}
        <g stroke="var(--accent)" strokeWidth="0.7" fill="none" opacity="0.22">
          <path d="M 90 140 L 220 220 L 180 360 L 320 410" />
          <path d="M 220 220 L 360 180" />
          <path d="M 1320 720 L 1180 660 L 1240 540 L 1100 470" />
          <path d="M 1180 660 L 1060 760" />
        </g>
        {/* nodes (with one or two glowing) */}
        <g fill="var(--accent)">
          <circle cx="90" cy="140" r="2" />
          <circle cx="220" cy="220" r="2.4" />
          <circle cx="180" cy="360" r="2" />
          <circle cx="320" cy="410" r="2" />
          <circle cx="360" cy="180" r="2" />
          <circle cx="1320" cy="720" r="2" />
          <circle cx="1180" cy="660" r="2.4" />
          <circle cx="1240" cy="540" r="2" />
          <circle cx="1100" cy="470" r="2" />
          <circle cx="1060" cy="760" r="2" />
        </g>
        {/* phosphorescent halos on key nodes */}
        <circle cx="220" cy="220" r="44" fill="url(#vert-glow)" />
        <circle cx="1180" cy="660" r="52" fill="url(#vert-glow)" />
        <circle cx="1240" cy="540" r="32" fill="url(#vert-glow)" opacity="0.7" />
      </svg>
    </div>
    <div className="bg-glyphs" aria-hidden="true">
      <span style={{ top: "8%",  left: "3%"  }}>~/</span>
      <span style={{ top: "18%", left: "94%" }}>✦</span>
      <span style={{ top: "32%", left: "2%"  }}>{"//"}</span>
      <span style={{ top: "46%", left: "96%" }}>{"<*>"}</span>
      <span style={{ top: "62%", left: "1.5%" }}>../</span>
      <span style={{ top: "78%", left: "95%" }}>❯</span>
      <span style={{ top: "92%", left: "4%"  }}>{"{}"}</span>
      <span style={{ top: "6%",  left: "62%", opacity: 0.5 }}>·</span>
      <span style={{ top: "88%", left: "48%", opacity: 0.5 }}>✦</span>
    </div>
    <div className="bg-canvas" aria-hidden="true">
      <span className="sprite-mote" />
      <span className="sprite-mote m2" />
      <span className="sprite-mote m3" />
    </div>
  </>
);

const App = () => {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__);
  const currentTheme = tweaks.theme || "light";

  // tabs: array of section ids; activeId: which is shown
  const [tabs, setTabs] = useState(["overview"]);
  const [activeId, setActiveId] = useState("overview");
  const [expanded, setExpanded] = useState({ _sprite: true, _features: true, _install: true });

  // apply theme + accent
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "light");
    document.documentElement.setAttribute("data-accent", tweaks.accent || "blue");
  }, [tweaks.theme, tweaks.accent]);

  const toggleTheme = () => {
    setTweak("theme", currentTheme === "dark" ? "light" : "dark");
  };

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
    <>
    {tweaks.ornaments !== false && <BgCanvas />}
    {tweaks.atmosphere !== "minimal" && <RunicLandscape />}
    <div className="app-frame">
      <div className="brand-row">
        <div className="brand">
          <div className="brand-mark"><BrandMark /></div>
          <div>
            <div className="brand-name">Sprite</div>
          </div>
          <span className="brand-tag">v1.0.1 · macOS</span>
        </div>
        <div className="brand-meta">
          <span className="dot" />
          <span>shipping · MIT</span>
        </div>
      </div>

      <div className="window">
        <TitleBar activeId={activeId} theme={currentTheme} onToggleTheme={toggleTheme} />

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
        <TweakSection title="Atmosphere">
          <TweakRadio
            label="Landscape"
            value={tweaks.atmosphere || "runic"}
            options={[{ value: "runic", label: "Runic" }, { value: "minimal", label: "Minimal" }]}
            onChange={(v) => setTweak("atmosphere", v)}
          />
          <TweakToggle
            label="Background ornaments"
            value={tweaks.ornaments !== false}
            onChange={(v) => setTweak("ornaments", v)}
          />
        </TweakSection>
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
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
