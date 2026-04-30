// terminal.jsx — Interactive Sprite simulator dock
// Depends on: SECTIONS, Icon globals

const COMMANDS_HELP = [
  { c: "sp<name>",        d: "Quick-nav to the matching tab" },
  { c: "sp<name><Tab>",   d: "Show completion menu" },
  { c: "sp ls",            d: "List current directory" },
  { c: "sp list",          d: "List bound shortcuts" },
  { c: "sp code <name>",   d: "Open file via 'code' shortcut" },
  { c: "sp add k cmd",     d: "Add a shortcut (simulated)" },
  { c: "sp refresh",       d: "Refresh the directory database" },
  { c: "clear",            d: "Clear terminal" },
  { c: "help",             d: "Show this help" },
];

// Search keys for matching
const NAV_INDEX = () => Object.entries(SECTIONS).map(([id, s]) => ({
  id,
  label: s.label,
  // searchable terms: id, label, last path segment
  terms: [id, s.label, s.label.split("/").pop().replace(/\.[^.]+$/, "")].map(x => x.toLowerCase())
}));

const matchSections = (q) => {
  const ql = q.toLowerCase();
  const idx = NAV_INDEX();
  const exact = idx.filter(e => e.terms.some(t => t === ql));
  const prefix = idx.filter(e => !exact.includes(e) && e.terms.some(t => t.startsWith(ql)));
  const contains = idx.filter(e => !exact.includes(e) && !prefix.includes(e) && e.terms.some(t => t.includes(ql)));
  return [...exact, ...prefix, ...contains];
};

const PROMPT = ({ path = "~/sprite" }) => (
  <span className="prompt"><span className="at">you</span>@sprite <span className="path">{path}</span> ❯ </span>
);

const Terminal = ({ openTab, currentLabel }) => {
  const [history, setHistory] = React.useState(() => initialHistory());
  const [input, setInput] = React.useState("");
  const [cmdHistory, setCmdHistory] = React.useState([]);
  const [hPos, setHPos] = React.useState(-1);
  const [menu, setMenu] = React.useState(null); // { matches, sel }
  const inputRef = React.useRef(null);
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [history, menu]);

  const path = "~/sprite" + (currentLabel ? "/" + currentLabel.replace(/\.[^.]+$/, "") : "");

  const push = (...lines) => setHistory((h) => [...h, ...lines]);

  const printPromptLine = (text) => ({
    kind: "in", text
  });

  const runCommand = (raw) => {
    const cmd = raw.trim();
    push({ kind: "in", text: cmd });

    if (!cmd) return;
    setCmdHistory((c) => [cmd, ...c].slice(0, 50));
    setHPos(-1);

    if (cmd === "clear") { setHistory([]); return; }
    if (cmd === "help") {
      push({ kind: "out", text: "Available commands:" });
      COMMANDS_HELP.forEach(({ c, d }) => push({ kind: "out", text: `  ${c.padEnd(22)} ${d}` }));
      return;
    }

    // sp...
    const parts = cmd.split(/\s+/);
    if (parts[0] !== "sp") {
      push({ kind: "out", text: `zsh: command not found: ${parts[0]}  (try \`help\`)` });
      return;
    }

    const sub = parts[1];

    if (!sub) { push({ kind: "out", text: "→ cd ~  (returned home)" }); return; }

    if (sub === "ls") {
      push({ kind: "out", text: "Contents of ~/sprite:" });
      Object.entries(SECTIONS).forEach(([id, s]) => {
        push({ kind: "out", text: `  ${s.label}` });
      });
      return;
    }

    if (sub === "list") {
      push({ kind: "out", text: "Shortcuts:" });
      push({ kind: "out", text: "  code  | code" });
      push({ kind: "out", text: "  idea  | idea" });
      push({ kind: "out", text: "  cc    | cd {} && claude" });
      return;
    }

    if (sub === "refresh") {
      push({ kind: "out match", text: "✓ Database refreshed (12 directories scanned)" });
      return;
    }

    if (sub === "add") {
      const name = parts[2];
      if (!name) { push({ kind: "out", text: "usage: sp add <name> <command>" }); return; }
      push({ kind: "out match", text: `✓ Shortcut '${name}' added` });
      return;
    }

    if (sub === "code") {
      const q = parts.slice(2).join(" ");
      if (!q) { push({ kind: "out", text: "usage: sp code <name>" }); return; }
      const m = matchSections(q);
      if (!m.length) { push({ kind: "out", text: `sp-error: no match for '${q}'` }); return; }
      push({ kind: "out match", text: `→ code  ${m[0].label}` });
      openTab(m[0].id, { focus: true });
      return;
    }

    // Default: sp<fragment>
    const q = parts.slice(1).join(" ");
    const m = matchSections(q);
    if (!m.length) { push({ kind: "out", text: `sp-error: no match for '${q}'` }); return; }
    const best = m[0];
    push({ kind: "out match", text: `→ ${best.label}` });
    openTab(best.id, { focus: true });
  };

  const showCompletionMenu = (q) => {
    if (!q) {
      // empty Tab — show all
      const all = Object.entries(SECTIONS).map(([id, s]) => ({ id, label: s.label, terms: [] }));
      setMenu({ matches: all, sel: 0, query: "" });
      return;
    }
    const m = matchSections(q);
    if (!m.length) {
      push({ kind: "in", text: `sp ${q}` });
      push({ kind: "out", text: `(no matches for '${q}')` });
      setInput("");
      return;
    }
    if (m.length === 1) {
      // auto-complete
      setInput(`sp ${m[0].label}`);
      return;
    }
    setMenu({ matches: m, sel: 0, query: q });
  };

  const acceptMenu = (item) => {
    push({ kind: "in", text: `sp ${menu.query || ""}` });
    push({ kind: "out match", text: `→ ${item.label}` });
    openTab(item.id, { focus: true });
    setMenu(null);
    setInput("");
  };

  const onKey = (e) => {
    // menu open — capture nav keys
    if (menu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenu((m) => ({ ...m, sel: (m.sel + 1) % m.matches.length }));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMenu((m) => ({ ...m, sel: (m.sel - 1 + m.matches.length) % m.matches.length }));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        acceptMenu(menu.matches[menu.sel]);
        return;
      }
      if (e.key === "Escape") { e.preventDefault(); setMenu(null); return; }
      // fall through for typing — close menu
      if (e.key.length === 1) setMenu(null);
    }

    if (e.key === "Tab") {
      e.preventDefault();
      // strip "sp" prefix
      const trimmed = input.trim();
      if (trimmed.startsWith("sp")) {
        const rest = trimmed.slice(2).trim();
        showCompletionMenu(rest);
      } else if (trimmed === "") {
        showCompletionMenu("");
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(hPos + 1, cmdHistory.length - 1);
      if (next >= 0 && cmdHistory[next] != null) { setHPos(next); setInput(cmdHistory[next]); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = hPos - 1;
      if (next < 0) { setHPos(-1); setInput(""); }
      else { setHPos(next); setInput(cmdHistory[next] || ""); }
      return;
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="term-dock" onClick={focusInput}>
      <div className="term-head">
        <div>
          <Icon name="term" size={11} style={{ verticalAlign: -2, marginRight: 6 }} />
          INTERACTIVE TERMINAL · simulated sp
        </div>
        <div className="hint">
          <span><kbd>Tab</kbd> complete</span>
          <span><kbd>Enter</kbd> run</span>
          <span><kbd>↑↓</kbd> history</span>
          <span><kbd>help</kbd> commands</span>
        </div>
      </div>
      <div className="term-body" ref={bodyRef}>
        {history.map((line, i) => (
          <Line key={i} line={line} path={path} />
        ))}

        {menu && (
          <div style={{ padding: "6px 0 4px" }}>
            <div className="term-line out" style={{ marginBottom: 2 }}>
              Available Options ({menu.matches.length})
            </div>
            {menu.matches.map((m, i) => (
              <div
                key={m.id}
                className={"term-line tab-menu" + (i === menu.sel ? " sel" : "")}
                onClick={() => acceptMenu(m)}
              >
                <span className="idx">{i + 1}</span>
                <span>{m.label}</span>
                <span className="meta">{m.id === "demo" ? "★ recent" : SECTIONS[m.id].crumbs.slice(1, -1).join("/") || "—"}</span>
              </div>
            ))}
          </div>
        )}

        <div className="term-input-row">
          <PROMPT path={path} />
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            placeholder="try: sp install · sp shor<Tab> · sp ls · help"
          />
        </div>
      </div>
    </div>
  );
};

const Line = ({ line, path }) => {
  if (line.kind === "in") {
    return (
      <div className="term-line in">
        <PROMPT path={path} />{line.text}
      </div>
    );
  }
  return <div className={"term-line " + line.kind}>{line.text}</div>;
};

function initialHistory() {
  return [
    { kind: "out", text: "Sprite 1.0.1 — interactive sandbox. Type `help` for commands." },
    { kind: "out", text: "Hint: try  sp install  or  sp shor<Tab>  to see fuzzy matching in action." },
  ];
}

Object.assign(window, { Terminal });

// ============================================================================
// AnimatedTerminal — autoplaying scripted demo for the "How it feels" section.
// ============================================================================

const ANIM_SCRIPT = [
  // Scene 1 — Tab → fuzzy menu, cycle, pick
  { kind: "comment", text: "# Tab → fuzzy-match menu. Tab again to cycle, Enter to pick." },
  { kind: "type", text: "sp proj " },
  { kind: "menu", items: [
    { label: "projects/",       meta: "~/Code" },
    { label: "my-projects/",    meta: "~/Documents" },
    { label: "project-alpha/",  meta: "~/Code/projects" },
    { label: "project-beta/",   meta: "~/Code/projects" },
  ], hold: 750 },
  { kind: "menuMove", to: 1, hold: 360 },
  { kind: "menuMove", to: 2, hold: 380 },
  { kind: "menuMove", to: 3, hold: 380 },
  { kind: "menuMove", to: 2, hold: 480 },
  { kind: "enter", inputOverride: "sp proj" },
  { kind: "output", text: "→ ~/Code/projects/project-alpha", className: "match" },
  { kind: "cd", path: "project-alpha" },
  { kind: "wait", ms: 1100 },

  // Scene 2 — bare `sp` returns home
  { kind: "comment", text: "# bare sp → cd ~" },
  { kind: "type", text: "sp" },
  { kind: "enter" },
  { kind: "output", text: "→ ~", className: "match" },
  { kind: "cd", path: "~" },
  { kind: "wait", ms: 800 },

  // Scene 3 — quick-nav uses learned ranking (no Tab, just Enter)
  { kind: "comment", text: "# Enter (no Tab) → quick-nav. Recent picks float to the top." },
  { kind: "type", text: "sp proj" },
  { kind: "enter" },
  { kind: "output", text: "→ ~/Code/projects/project-alpha   ★ recent", className: "match" },
  { kind: "cd", path: "project-alpha" },
  { kind: "wait", ms: 1500 },

  // Scene 4 — quick reset
  { kind: "type", text: "sp" },
  { kind: "enter" },
  { kind: "output", text: "→ ~", className: "match" },
  { kind: "cd", path: "~" },
  { kind: "wait", ms: 240 },
  { kind: "type", text: "clear" },
  { kind: "enter" },
  { kind: "clear" },
  { kind: "wait", ms: 600 },

  // Scene 5 — Tab inside any command resolves fragments to absolute paths
  { kind: "comment", text: "# Prefix any command with sp. Tab resolves fragments inside it." },
  { kind: "type", text: "sp cp -r temp" },
  { kind: "tabExpand", from: "temp", to: "~/scratch/temp" },
  { kind: "type", text: " proj" },
  { kind: "tabExpand", from: "proj", to: "~/Code/projects/project-alpha" },
  { kind: "enter" },
  { kind: "output", text: "✓ copied 14 files", className: "match" },
  { kind: "wait", ms: 1100 },

  // Scene 6 — bind a shortcut
  { kind: "comment", text: "# Bind a shortcut. {} expands to the matched path." },
  { kind: "type", text: 'sp add c "cd {} && cursor ."' },
  { kind: "enter" },
  { kind: "output", text: "✓ shortcut 'c' added", className: "match" },
  { kind: "wait", ms: 1000 },

  // Scene 7 — use the new shortcut, editor opens
  { kind: "type", text: "sp c proj" },
  { kind: "enter" },
  { kind: "output", text: "→ cd ~/Code/projects/project-alpha && cursor .", className: "match" },
  { kind: "cd", path: "project-alpha" },
  { kind: "wait", ms: 220 },
  { kind: "openEditor" },
  { kind: "wait", ms: 4200 },

  // loop
  { kind: "closeEditor" },
  { kind: "wait", ms: 700 },
];

function MockEditor({ open }) {
  return (
    <div className={"me-overlay" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="me-titlebar">
        <span className="me-traffic"><i/><i/><i/></span>
        <span className="me-title">project-alpha — Cursor</span>
      </div>
      <div className="me-body">
        <div className="me-tree">
          <div className="me-folder me-folder-open">▾ project-alpha</div>
          <div className="me-folder">  ▸ src</div>
          <div className="me-folder">  ▸ tests</div>
          <div className="me-file">  README.md</div>
          <div className="me-file me-file-active">  index.ts</div>
          <div className="me-file">  router.ts</div>
          <div className="me-file">  config.ts</div>
          <div className="me-file">  package.json</div>
        </div>
        <div className="me-code">
          <div className="me-tabs">
            <span className="me-tab me-tab-active">index.ts</span>
          </div>
          <pre className="me-pre">
{`import { Router } from "./router";
import { config } from "./config";

const app = new Router(config);

app.route("GET", "/", () => "hello");
app.route("GET", "/health", () => "ok");

app.listen(3000, () => {
  console.log("up on :3000");
});`}
          </pre>
        </div>
      </div>
      <div className="me-status">
        <span className="me-branch">⎇ main</span>
        <span className="me-cwd">~/Code/projects/project-alpha</span>
        <span className="me-status-r">UTF-8 · LF · TypeScript</span>
      </div>
    </div>
  );
}

const AnimPrompt = ({ path }) => (
  <span className="anim-prompt"><span className="anim-path">{path}</span> ❯ </span>
);

function AnimatedTerminal() {
  const [lines, setLines] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [path, setPath] = React.useState("~");
  const [menu, setMenu] = React.useState(null);
  const [keyHint, setKeyHint] = React.useState(null);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  const wrapRef = React.useRef(null);
  const bodyRef = React.useRef(null);

  // Start when scrolled into view (or immediately if no IO support)
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setStarted(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setStarted(true); io.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-scroll
  React.useEffect(() => {
    const b = bodyRef.current;
    if (!b) return;
    b.scrollTop = b.scrollHeight;
  }, [lines, menu, input, editorOpen]);

  // Run script
  React.useEffect(() => {
    if (!started) return;
    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // local mirrors so async events don't fight stale closures
    let liveInput = "";
    let livePath = "~";
    let liveMenu = null;

    const writeInput = (v) => { liveInput = v; setInput(v); };
    const writePath = (v) => { livePath = v; setPath(v); };
    const writeMenu = (m) => { liveMenu = m; setMenu(m); };

    const flashKey = async (label, ms = 280) => {
      setKeyHint(label);
      await sleep(ms);
      if (!cancelled) setKeyHint(null);
    };

    const runEvent = async (ev) => {
      switch (ev.kind) {
        case "comment":
          setLines((ls) => [...ls, { kind: "comment", text: ev.text }]);
          await sleep(420);
          return;

        case "type": {
          for (let i = 0; i < ev.text.length; i++) {
            if (cancelled) return;
            const ch = ev.text[i];
            writeInput(liveInput + ch);
            const base = 24 + Math.random() * 28;
            await sleep((ch === " " || ch === "\"") ? base + 40 : base);
          }
          await sleep(180);
          return;
        }

        case "tabExpand": {
          await flashKey("Tab", 240);
          if (cancelled) return;
          const cur = liveInput;
          const idx = cur.lastIndexOf(ev.from);
          if (idx >= 0 && idx + ev.from.length === cur.length) {
            writeInput(cur.slice(0, idx) + ev.to);
          } else {
            writeInput(cur + ev.to);
          }
          await sleep(280);
          return;
        }

        case "menu":
          await flashKey("Tab", 220);
          if (cancelled) return;
          writeMenu({ items: ev.items, sel: 0 });
          await sleep(ev.hold || 400);
          return;

        case "menuMove":
          await flashKey("Tab", 200);
          if (cancelled) return;
          if (liveMenu) writeMenu({ ...liveMenu, sel: ev.to });
          await sleep(ev.hold || 320);
          return;

        case "enter": {
          await flashKey("Enter", 200);
          if (cancelled) return;
          const committed = ev.inputOverride != null ? ev.inputOverride : liveInput;
          let chosen = null;
          if (liveMenu) {
            chosen = liveMenu.items[liveMenu.sel];
            writeMenu(null);
          }
          setLines((ls) => {
            const next = [...ls, { kind: "in", path: livePath, text: committed }];
            if (chosen) {
              next.push({ kind: "menu-pick", label: chosen.label, meta: chosen.meta });
            }
            return next;
          });
          writeInput("");
          await sleep(220);
          return;
        }

        case "output":
          setLines((ls) => [...ls, { kind: "out", text: ev.text, className: ev.className || "" }]);
          await sleep(220);
          return;

        case "cd":
          writePath(ev.path);
          return;

        case "clear":
          setLines([]);
          await sleep(180);
          return;

        case "openEditor":
          setEditorOpen(true);
          await sleep(420);
          return;

        case "closeEditor":
          setEditorOpen(false);
          await sleep(180);
          return;

        case "wait":
          await sleep(ev.ms);
          return;
      }
    };

    (async () => {
      setLines([{ kind: "out", text: "Sprite 1.0.1 · autoplay demo" }]);
      await sleep(700);
      while (!cancelled) {
        for (const ev of ANIM_SCRIPT) {
          if (cancelled) return;
          await runEvent(ev);
        }
        if (cancelled) return;
        await sleep(1500);
        if (cancelled) return;
        setLines([]);
        writePath("~");
        writeInput("");
        writeMenu(null);
        await sleep(400);
      }
    })();

    return () => { cancelled = true; };
  }, [started, tick]);

  const replay = () => {
    setLines([]);
    setInput("");
    setMenu(null);
    setEditorOpen(false);
    setKeyHint(null);
    setPath("~");
    setTick((t) => t + 1);
  };

  return (
    <div className="anim-term" ref={wrapRef}>
      <div className="anim-term-head">
        <div className="anim-term-head-l">
          <Icon name="term" size={11} className="ico anim-term-icon" />
          <span>DEMO · sp autoplay</span>
        </div>
        <button className="anim-term-replay" onClick={replay} aria-label="Replay">
          <Icon name="refresh" size={11} className="ico" />
          <span>replay</span>
        </button>
      </div>
      <div className="anim-term-body" ref={bodyRef}>
        {lines.map((l, i) => <AnimLine key={i} line={l} />)}

        {menu && (
          <div className="anim-term-menu">
            <div className="anim-term-menu-hd">{menu.items.length} matches</div>
            {menu.items.map((m, i) => (
              <div key={i} className={"anim-term-menu-row" + (i === menu.sel ? " sel" : "")}>
                <span className="idx">{i + 1}</span>
                <span className="lbl">{m.label}</span>
                <span className="meta">{m.meta}</span>
              </div>
            ))}
          </div>
        )}

        <div className="anim-term-input">
          <AnimPrompt path={path} />
          <span className="anim-term-typed">{input}</span>
          <span className="anim-term-caret" />
          {keyHint && <kbd className="anim-term-kbd">{keyHint}</kbd>}
        </div>
      </div>
      <MockEditor open={editorOpen} />
    </div>
  );
}

function AnimLine({ line }) {
  if (line.kind === "in") {
    return <div className="term-line in"><AnimPrompt path={line.path} />{line.text}</div>;
  }
  if (line.kind === "comment") {
    return <div className="term-line anim-comment">{line.text}</div>;
  }
  if (line.kind === "menu-pick") {
    return (
      <div className="anim-term-pick">
        <span className="anim-term-pick-arrow">↳</span>
        <span className="anim-term-pick-label">{line.label}</span>
        <span className="anim-term-pick-meta">{line.meta}</span>
      </div>
    );
  }
  return <div className={"term-line out " + (line.className || "")}>{line.text}</div>;
}

Object.assign(window, { AnimatedTerminal });
