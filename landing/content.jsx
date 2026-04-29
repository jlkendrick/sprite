// content.jsx — section bodies + tree definition + shared icons
// Exposes: TREE, SECTIONS, Icon, IconButton

const Icon = ({ name, className = "ico", size }) => {
  const s = size || 16;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case "chev":
      return <svg {...common}><polyline points="9 6 15 12 9 18" /></svg>;
    case "folder":
      return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>;
    case "folder-open":
      return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V7z" /><path d="M3 9h18l-2 8a2 2 0 0 1-2 1.5H5a2 2 0 0 1-2-1.5V9z" /></svg>;
    case "file":
      return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><polyline points="14 3 14 8 19 8" /></svg>;
    case "doc":
      return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="2" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" /></svg>;
    case "rocket":
      return <svg {...common}><path d="M5 14l-2 7 7-2" /><path d="M14 4s5 0 7 2-2 7-2 7l-5 5-7-7 5-5z" /><circle cx="14" cy="10" r="1.5" /></svg>;
    case "sparkle":
      return <svg {...common}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>;
    case "brackets":
      return <svg {...common}><polyline points="8 4 4 12 8 20" /><polyline points="16 4 20 12 16 20" /></svg>;
    case "gear":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "term":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><polyline points="7 9 10 12 7 15" /><line x1="13" y1="15" x2="17" y2="15" /></svg>;
    case "bolt":
      return <svg {...common}><polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" /></svg>;
    case "link":
      return <svg {...common}><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" /></svg>;
    case "brain":
      return <svg {...common}><path d="M9 5a3 3 0 0 1 3 0 3 3 0 0 1 3 0 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 0 3 3 0 0 1-3 0 3 3 0 0 1-2-5 3 3 0 0 1 2-5z" /></svg>;
    case "db":
      return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case "refresh":
      return <svg {...common}><polyline points="21 12 21 5 14 5" /><path d="M21 12a9 9 0 1 1-3-6.7L21 5" /></svg>;
    case "x":
      return <svg {...common}><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>;
    case "copy":
      return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>;
    case "check":
      return <svg {...common}><polyline points="5 12 10 17 19 7" /></svg>;
    case "github":
      return <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor" className={className}><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case "list":
      return <svg {...common}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>;
    case "wrench":
      return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0 5 5L17 14a2 2 0 0 1 0 3l-1 1a2 2 0 0 1-3 0l-7-7a2 2 0 0 1 0-3l1-1a2 2 0 0 1 3 0l2.7-2.7a4 4 0 0 0 2 2z" /></svg>;
    case "compass":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><polygon points="15 9 11 13 9 15 13 11" /></svg>;
    case "key":
      return <svg {...common}><circle cx="8" cy="15" r="4" /><line x1="11" y1="12" x2="20" y2="3" /><line x1="17" y1="6" x2="20" y2="9" /></svg>;
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" />
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6.4" y2="6.4" />
          <line x1="17.6" y1="17.6" x2="19.4" y2="19.4" />
          <line x1="17.6" y1="6.4" x2="19.4" y2="4.6" />
          <line x1="4.6" y1="19.4" x2="6.4" y2="17.6" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4a6.5 6.5 0 1 0 10.5 10.5z" />
        </svg>
      );
    default: return null;
  }
};

// Tree definition — abstracted directory metaphor
// Each leaf `id` maps to a SECTIONS key.
const TREE = [
  {
    id: "_dirvana", label: "dirvana", type: "root", icon: "folder",
    children: [
      { id: "overview",      label: "overview.md",       type: "doc", icon: "doc" },
      { id: "quickstart",    label: "quick-start.sh",    type: "doc", icon: "term" },
      {
        id: "_install", label: "install/", type: "folder", icon: "folder",
        children: [
          { id: "install-curl",   label: "curl.sh",      type: "doc", icon: "term" },
          { id: "install-brew",   label: "brew.sh",      type: "doc", icon: "term" },
          { id: "install-manual", label: "manual.md",    type: "doc", icon: "doc"  },
        ]
      },
      {
        id: "_features", label: "features/", type: "folder", icon: "folder",
        children: [
          { id: "features",   label: "overview.md", type: "doc", icon: "doc" },
          { id: "shortcuts",  label: "shortcuts.md", type: "doc", icon: "key" },
          { id: "demo",       label: "live-demo.term",type: "doc", icon: "term" },
        ]
      },
      { id: "config",        label: "config.json",       type: "doc", icon: "gear" },
      { id: "tips",          label: "tips.md",           type: "doc", icon: "compass" },
      { id: "troubleshoot",  label: "troubleshoot.md",   type: "doc", icon: "wrench" },
    ]
  },
];

// Static command snippets reused as code blocks
const Code = ({ children }) => <pre className="code">{children}</pre>;
const P = ({ tok, val }) => <span className={"c-" + tok}>{val}</span>;

// ----- Section content -----
const SECTIONS = {
  overview: {
    label: "overview.md",
    icon: "doc",
    crumbs: ["~", "dirvana", "overview.md"],
    render: ({ openTab }) => (
      <>
        <div className="eyebrow">README · v1.0.1 · macOS</div>
        <h1 className="display">
          Terminal navigation, <em>distilled.</em>
        </h1>
        <p className="lede">
          Dirvana (<code className="inl">dv</code>) is an intelligent directory navigator and command augmenter for Zsh. Jump to any folder by partial match, autocomplete paths inside any command, and bind your own shortcuts — all backed by a learning algorithm that adapts to how you actually work.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => openTab("install-curl")}>
            <Icon name="rocket" /> Install in one line
          </button>
          <button className="btn btn-ghost" onClick={() => openTab("demo")}>
            <Icon name="term" /> Try the live demo
          </button>
          <a className="btn btn-ghost" href="https://github.com/jlkendrick/dirvana" target="_blank" rel="noreferrer">
            <Icon name="github" /> View source
          </a>
        </div>

        <div className="install-row" style={{ marginTop: 24 }}>
          <CmdCard label="curl" cmd={'curl -fsSL https://jlkendrick.github.io/dirvana/docs/install.sh | bash'} />
          <CmdCard label="homebrew" cmd={'brew install jlkendrick/tap/dirvana'} />
        </div>

        <hr className="rule" />

        <h2>Why Dirvana</h2>
        <p>
          Modern repos sprawl. You spend more time typing <code className="inl">cd ../../../</code> than running the command you actually wanted. Dirvana folds that overhead away — type a fragment, hit Enter, you're there. Prefix any command with <code className="inl">dv</code> and the same matching engine completes paths inside it.
        </p>

        <div className="stat-row">
          <div className="stat"><div className="n">4<em>×</em></div><div className="l">Match modes</div></div>
          <div className="stat"><div className="n">100<em>ms</em></div><div className="l">Tab completion</div></div>
          <div className="stat"><div className="n">∞</div><div className="l">Custom shortcuts</div></div>
        </div>

        <h2>How it feels</h2>
        <div className="anim-term-frame">
          <span className="anim-term-frame-corner tl" aria-hidden="true" />
          <span className="anim-term-frame-corner tr" aria-hidden="true" />
          <span className="anim-term-frame-corner bl" aria-hidden="true" />
          <span className="anim-term-frame-corner br" aria-hidden="true" />
          <div className="anim-term-frame-tag">
            <span className="dot" /> LIVE · autoplay
          </div>
          <AnimatedTerminal />
        </div>

        <h3>Continue reading</h3>
        <p>
          Open any file in the sidebar — or type <code className="inl">dv &lt;name&gt;</code> in the terminal below to navigate by name. Try{" "}
          <a onClick={() => openTab("quickstart")} style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>quick-start.sh</a>,{" "}
          <a onClick={() => openTab("shortcuts")} style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>shortcuts.md</a>, or{" "}
          <a onClick={() => openTab("demo")} style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>live-demo.term</a>.
        </p>
      </>
    )
  },

  quickstart: {
    label: "quick-start.sh",
    icon: "term",
    crumbs: ["~", "dirvana", "quick-start.sh"],
    render: ({ openTab }) => (
      <>
        <div className="eyebrow">Quick start · 60 seconds</div>
        <h1 className="display">From zero to <em>dv</em>.</h1>
        <p className="lede">
          Three steps. One terminal restart. You'll be navigating by fragment before your coffee cools.
        </p>

        <div className="steps">
          <div className="step"><div className="body">
            <strong>Install the binary</strong>
            <p>Pick your weapon. Both end at the same place.</p>
            <CmdCard label="curl" cmd={'curl -fsSL https://jlkendrick.github.io/dirvana/docs/install.sh | bash'} />
            <div style={{ height: 8 }} />
            <CmdCard label="homebrew" cmd={'brew install jlkendrick/tap/dirvana'} />
          </div></div>

          <div className="step"><div className="body">
            <strong>Initialize</strong>
            <p>Wires Zsh completion, drops the <code className="inl">dv()</code> function into your <code className="inl">~/.zshrc</code>, and indexes your home directory.</p>
            <Code><P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv-binary init" />{"\n"}<P tok="prompt" val="~ ❯ " /><P tok="cmd" val="source ~/.zshrc" /></Code>
          </div></div>

          <div className="step"><div className="body">
            <strong>Navigate</strong>
            <p>Type a fragment. Hit Enter. Or hit Tab for the menu.</p>
            <Code>
              <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv " /><P tok="arg" val="dirv" />{"\n"}
              <P tok="out" val="→ /Users/you/Code/dirvana" />{"\n\n"}
              <P tok="prompt" val="dirvana ❯ " /><P tok="cmd" val="dv code " /><P tok="arg" val="src" /><P tok="flag" val="<Enter>" />{"\n"}
              <P tok="out" val="→ code /Users/you/Code/dirvana/src" />
            </Code>
          </div></div>

          <div className="step"><div className="body">
            <strong>Make it yours</strong>
            <p>Bind a shortcut to your most-run command — see <a onClick={() => openTab("shortcuts")} style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>shortcuts.md</a> for the full system.</p>
            <Code><P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val='penv "source .venv/bin/activate && clear"' /></Code>
          </div></div>
        </div>

        <div className="tip"><strong>Tip:</strong> a database refresh runs automatically when you start a new terminal. Manually trigger one with <code className="inl">dv refresh</code>.</div>
      </>
    )
  },

  "install-curl": {
    label: "install/curl.sh",
    icon: "term",
    crumbs: ["~", "dirvana", "install", "curl.sh"],
    render: () => (
      <>
        <div className="eyebrow">Install · curl · recommended</div>
        <h1 className="display">One line. <em>Done.</em></h1>
        <p className="lede">
          The installer downloads the latest binary to <code className="inl">~/.local/bin</code>, sets up Zsh completion, configures your <code className="inl">.zshrc</code>, and builds the initial directory database.
        </p>
        <CmdCard big label="paste this into your shell" cmd={'curl -fsSL https://jlkendrick.github.io/dirvana/docs/install.sh | bash'} />

        <h3>What it does</h3>
        <ul style={{ paddingLeft: 18, color: "var(--ink-2)" }}>
          <li>Downloads <code className="inl">dv-binary</code> to <code className="inl">~/.local/bin</code></li>
          <li>Installs the Zsh completion script to <code className="inl">~/.zsh/completions/_dv</code></li>
          <li>Adds the completion block, <code className="inl">dv()</code> function, and PATH export to <code className="inl">~/.zshrc</code></li>
          <li>Builds the initial database from your home directory</li>
        </ul>

        <div className="tip"><strong>Note:</strong> Currently macOS only. Linux support is on the roadmap.</div>
      </>
    )
  },

  "install-brew": {
    label: "install/brew.sh",
    icon: "term",
    crumbs: ["~", "dirvana", "install", "brew.sh"],
    render: () => (
      <>
        <div className="eyebrow">Install · Homebrew</div>
        <h1 className="display">Brewed and bottled.</h1>
        <p className="lede">
          Available via the <code className="inl">jlkendrick/tap</code> Homebrew tap. Two flavors — pick whichever fits your muscle memory.
        </p>

        <h3>One-liner</h3>
        <CmdCard label="single command" cmd={'brew install jlkendrick/tap/dirvana'} />

        <h3>Or, step by step</h3>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="brew tap jlkendrick/tap" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="brew install dirvana" />
        </Code>

        <h3>Finish setup</h3>
        <p>After Homebrew finishes, wire up your shell and seed the directory database:</p>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv-binary init" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="source ~/.zshrc" />
        </Code>
        <p style={{ color: "var(--ink-3)", fontSize: 13.5 }}>
          <code className="inl">dv-binary init</code> adds the Dirvana completion block and <code className="inl">dv()</code> function to your <code className="inl">~/.zshrc</code> and builds the database from your home directory. The same step is repeated in the formula caveats.
        </p>
      </>
    )
  },

  "install-manual": {
    label: "install/manual.md",
    icon: "doc",
    crumbs: ["~", "dirvana", "install", "manual.md"],
    render: () => (
      <>
        <div className="eyebrow">Install · manual</div>
        <h1 className="display">Full control, every file.</h1>
        <p className="lede">
          For when you want to know — and own — every line that touches your shell config. There are two routes: semi-automatic (let <code className="inl">dv-binary init</code> finish the job) or fully manual.
        </p>

        <h3>1 · Download the binary</h3>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="curl -fsSL -o ~/.local/bin/dv-binary https://raw.githubusercontent.com/jlkendrick/dirvana/main/docs/bin/dv-binary" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="chmod +x ~/.local/bin/dv-binary" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val={'export PATH="$HOME/.local/bin:$PATH"'} />
        </Code>

        <h3>2 · Choose your finishing path</h3>
        <div className="two-col">
          <div className="feat">
            <div className="name"><Icon name="bolt" />Option A · semi-auto <span className="pill">recommended</span></div>
            <p className="desc">Let <code className="inl">dv-binary init</code> install the completion script, edit <code className="inl">~/.zshrc</code>, and seed the database in one go.</p>
            <Code><P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv-binary init" />{"\n"}<P tok="prompt" val="~ ❯ " /><P tok="cmd" val="source ~/.zshrc" /></Code>
          </div>
          <div className="feat">
            <div className="name"><Icon name="wrench" />Option B · fully manual</div>
            <p className="desc">Continue with the steps below if you want full control over every file.</p>
          </div>
        </div>

        <h3>3 · Install the Zsh completion script</h3>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="mkdir -p ~/.zsh/completions" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="curl -fsSL -o ~/.zsh/completions/_dv https://raw.githubusercontent.com/jlkendrick/dirvana/main/docs/scripts/_dv" />
        </Code>

        <h3>4 · Configure Zsh</h3>
        <p>Add the following to your <code className="inl">~/.zshrc</code>:</p>
        <Code>
          <P tok="comment" val="# Dirvana Zsh completion configuration" />{"\n"}
          <P tok="cmd" val="fpath=(~/.zsh/completions $fpath)" />{"\n\n"}
          <P tok="cmd" val="zstyle ':completion:*' list-grouped yes" />{"\n"}
          <P tok="cmd" val="zstyle ':completion:*' menu select" />{"\n"}
          <P tok="cmd" val="zstyle ':completion:*' matcher-list '' 'r:|=*'" />{"\n\n"}
          <P tok="cmd" val="setopt menucomplete" />{"\n"}
          <P tok="cmd" val="setopt autolist" />{"\n\n"}
          <P tok="cmd" val="autoload -Uz compinit && compinit -u" />{"\n\n"}
          <P tok="comment" val="# Dirvana command handler" />{"\n"}
          <P tok="cmd" val="dv() {" />{"\n"}
          <P tok="cmd" val={'  local cmd\n  cmd=$(dv-binary --enter dv "$@")\n  if [[ -n "$cmd" ]]; then eval "$cmd"; else echo "dv-error: No command found for \'$*\'"; fi\n}'} />{"\n\n"}
          <P tok="comment" val="# Auto-refresh database on terminal start" />{"\n"}
          <P tok="cmd" val="dv-binary --enter dv refresh &> /dev/null & disown" />
        </Code>

        <h3>5 · Initialize database</h3>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="source ~/.zshrc" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv build --root ~" />
        </Code>
      </>
    )
  },

  features: {
    label: "features/overview.md",
    icon: "sparkle",
    crumbs: ["~", "dirvana", "features", "overview.md"],
    render: () => (
      <>
        <div className="eyebrow">Features</div>
        <h1 className="display">Eight features, <em>one habit.</em></h1>
        <p className="lede">
          Each piece exists to remove a specific keystroke or context-switch. Together they collapse the gap between thinking of a directory and being inside it.
        </p>

        <div className="feat-grid">
          <Feat icon="rocket" name="Smart navigation" desc="Jump to any directory with partial matching — exact, prefix, suffix, or contains." />
          <Feat icon="bolt" name="Quick-nav" desc="Press Enter to land on the best match. No menus, no scrolling." />
          <Feat icon="term" name="Tab completion" desc="Interactive menu-based path completion integrated natively with Zsh." />
          <Feat icon="key" name="Custom shortcuts" desc="Bind aliases that work with path completion. Use {} to control where the path lands." />
          <Feat icon="brain" name="Learning algorithm" desc="Adapts to your usage with frequency-based and recency-based ranking." />
          <Feat icon="gear" name="Highly configurable" desc="Tune matching behavior, exclusions, and result limits to your taste." />
          <Feat icon="db" name="Persistent history" desc="SQLite-backed database remembers your navigation patterns across sessions." />
          <Feat icon="refresh" name="Auto-refresh" desc="Keeps your directory database up-to-date — automatically, in the background." />
        </div>

        <h2>Match modes</h2>
        <p>How Dirvana decides what counts as a hit. Default is <code className="inl">contains</code>; switch via <code className="inl">config.json</code>.</p>
        <div className="cfg-table">
          <div className="h">Mode</div><div className="h">Behavior</div><div className="h">Best for</div>
          <div className="c k">exact</div><div className="c d">Only matches directories with the exact name.</div><div className="c v">precision</div>
          <div className="c k">prefix</div><div className="c d">Matches directories starting with the query.</div><div className="c v">consistent naming</div>
          <div className="c k">suffix</div><div className="c d">Matches directories ending with the query.</div><div className="c v">-api / -web suffixes</div>
          <div className="c k">contains</div><div className="c d">Substring match anywhere in the name. The default.</div><div className="c v">flexibility</div>
        </div>

        <h2>Promotion strategies</h2>
        <p>How matches get ranked when there's more than one.</p>
        <div className="cfg-table">
          <div className="h">Strategy</div><div className="h">Behavior</div><div className="h">Use it when</div>
          <div className="c k">recently_accessed</div><div className="c d">Prioritizes recently visited directories.</div><div className="c v">default</div>
          <div className="c k">frequency_based</div><div className="c d">Prioritizes frequently visited directories.</div><div className="c v">repeat workflows</div>
        </div>

        <h2>Filesystem drill-in</h2>
        <p>Append <code className="inl">/</code> to any path to bypass the database and browse the live filesystem instead.</p>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv ~/Code/" /><P tok="flag" val="<Tab>" /><P tok="comment" val="    # Lists every entry inside ~/Code/" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv proj" /><P tok="flag" val="<Tab>" /><P tok="comment" val="        # Database match for 'proj'" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv /full/path/to/proj/" /><P tok="flag" val="<Tab>" /><P tok="comment" val="  # ...then drill in with /" />
        </Code>
      </>
    )
  },

  shortcuts: {
    label: "features/shortcuts.md",
    icon: "key",
    crumbs: ["~", "dirvana", "features", "shortcuts.md"],
    render: () => (
      <>
        <div className="eyebrow">Shortcuts system</div>
        <h1 className="display">Bind once. <em>Use forever.</em></h1>
        <p className="lede">
          A shortcut is an alias that knows about paths. Bind <code className="inl">code</code> to <code className="inl">code</code>, then <code className="inl">dv code dirv</code> resolves the path, expands, and runs.
        </p>

        <h2>Add</h2>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'cc "cd {} && claude"'} />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'gitlog "git -C {} log --oneline -10"'} />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'serve "python3 -m http.server 8080 --directory {}"'} />
        </Code>

        <h2>Use</h2>
        <p>Shortcuts use the same fuzzy completion as bare <code className="inl">dv</code>. A few bound above, in action:</p>
        <Code>
          <P tok="comment" val="# cd into a project and open Claude Code" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv cc " /><P tok="arg" val="api" /><P tok="flag" val="<Enter>" />{"\n"}
          <P tok="out" val="→ cd /Users/you/Code/api-server && claude" />{"\n\n"}
          <P tok="comment" val="# run git log inside a project without cd-ing first" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv gitlog " /><P tok="arg" val="front" /><P tok="flag" val="<Enter>" />{"\n"}
          <P tok="out" val="→ git -C /Users/you/Code/frontend log --oneline -10" />
        </Code>

        <h2>The <code className="inl">{"{}"}</code> placeholder</h2>
        <p>
          Without <code className="inl">{"{}"}</code>, the resolved path is appended to the end of the command. Add <code className="inl">{"{}"}</code> to control exactly where it lands — including using it multiple times.
        </p>
        <Code>
          <P tok="comment" val="# {} mid-command: path goes where you put it" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'diff "git -C {} diff HEAD"'} />{"\n\n"}
          <P tok="comment" val="# {} twice: same path in two places" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'mkcd "mkdir -p {} && cd {}"'} />
        </Code>

        <h2>Manage</h2>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv list" />{"\n"}
          <P tok="out" val="Shortcuts:" />{"\n"}
          <P tok="out" val="code  | code" />{"\n"}
          <P tok="out" val="idea  | idea" />{"\n"}
          <P tok="out" val="term  | open -a Terminal" />{"\n\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv show " /><P tok="arg" val="code" />{"\n"}
          <P tok="out" val="Shortcut: code | Command: code" />{"\n\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv delete " /><P tok="arg" val="code" />{"\n"}
          <P tok="out" val="Shortcut code deleted" />
        </Code>

        <div className="tip"><strong>Pro move:</strong> bind a single-letter shortcut to your editor (<code className="inl">dv add c "cursor"</code>) and you'll never type its name again.</div>
      </>
    )
  },

  demo: {
    label: "features/live-demo.term",
    icon: "term",
    crumbs: ["~", "dirvana", "features", "live-demo.term"],
    render: () => (
      <>
        <div className="eyebrow">Live demo</div>
        <h1 className="display">Try it without installing.</h1>
        <p className="lede">
          The terminal at the bottom of this window is real — well, real-ish. It runs a sandboxed simulation of Dirvana against this very documentation. Every file in the sidebar is a navigable directory.
        </p>

        <h3>Things to try</h3>
        <ol style={{ paddingLeft: 18, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.8 }}>
          <li>Type <code className="inl">dv install</code> and press <kbd>Enter</kbd> — quick-nav to the install tab.</li>
          <li>Type <code className="inl">dv shor</code> and press <kbd>Tab</kbd> — see the completion menu in action.</li>
          <li>Type <code className="inl">dv ls</code> to list everything in the current directory.</li>
          <li>Type <code className="inl">dv list</code> to see the bound shortcuts.</li>
          <li>Type <code className="inl">help</code> to see every supported command.</li>
        </ol>

        <h3>How it maps</h3>
        <div className="cfg-table">
          <div className="h">In your shell</div><div className="h">In this demo</div><div className="h">Effect</div>
          <div className="c k">dv &lt;name&gt;&lt;Enter&gt;</div><div className="c d">Navigates to the matching tab.</div><div className="c v">quick-nav</div>
          <div className="c k">dv &lt;name&gt;&lt;Tab&gt;</div><div className="c d">Shows a completion menu of matching docs.</div><div className="c v">tab menu</div>
          <div className="c k">dv ls</div><div className="c d">Prints the current directory's contents.</div><div className="c v">list</div>
          <div className="c k">dv code &lt;name&gt;</div><div className="c d">Pretends to open the file in your editor.</div><div className="c v">shortcut</div>
        </div>

        <div className="tip"><strong>Heads up:</strong> the simulation is not the real binary. For real-world use install via curl or Homebrew — it'll feel exactly the same.</div>
      </>
    )
  },

  config: {
    label: "config.json",
    icon: "gear",
    crumbs: ["~", "dirvana", "config.json"],
    render: () => (
      <>
        <div className="eyebrow">Configuration</div>
        <h1 className="display">Tune every knob.</h1>
        <p className="lede">
          Dirvana's config lives at <code className="inl">~/Library/Application Support/dirvana/config.json</code>. Edit it directly — changes take effect on the next command.
        </p>

        <h3>Default config</h3>
        <Code>
          {"{\n"}
          <P tok="key" val='  "paths"' /><P tok="cmd" val=": {" />{"\n"}
          <P tok="key" val='    "init"' /><P tok="cmd" val=": " /><P tok="str" val='"/Users/you"' /><P tok="cmd" val="," />{"\n"}
          <P tok="key" val='    "db"' /><P tok="cmd" val=": " /><P tok="str" val='"~/Library/Application Support/dirvana/dirvana.db"' />{"\n"}
          <P tok="cmd" val="  }," />{"\n"}
          <P tok="key" val='  "matching"' /><P tok="cmd" val=": {" />{"\n"}
          <P tok="key" val='    "max_results"' /><P tok="cmd" val=": " /><P tok="num" val="10" /><P tok="cmd" val="," />{"\n"}
          <P tok="key" val='    "max_history_size"' /><P tok="cmd" val=": " /><P tok="num" val="100" /><P tok="cmd" val="," />{"\n"}
          <P tok="key" val='    "type"' /><P tok="cmd" val=": " /><P tok="str" val='"contains"' /><P tok="cmd" val="," />{"\n"}
          <P tok="key" val='    "promotion_strategy"' /><P tok="cmd" val=": " /><P tok="str" val='"recently_accessed"' /><P tok="cmd" val="," />{"\n"}
          <P tok="key" val='    "exclusions"' /><P tok="cmd" val=": {" />{"\n"}
          <P tok="key" val='      "exact"' /><P tok="cmd" val=": [" /><P tok="str" val='"node_modules"' /><P tok="cmd" val=", " /><P tok="str" val='"dist"' /><P tok="cmd" val=", " /><P tok="str" val='".git"' /><P tok="cmd" val="]," />{"\n"}
          <P tok="key" val='      "prefix"' /><P tok="cmd" val=": [" /><P tok="str" val='"."' /><P tok="cmd" val="]," />{"\n"}
          <P tok="key" val='      "suffix"' /><P tok="cmd" val=": [" /><P tok="str" val='"sdk"' /><P tok="cmd" val=", " /><P tok="str" val='"Library"' /><P tok="cmd" val="]," />{"\n"}
          <P tok="key" val='      "contains"' /><P tok="cmd" val=": [" /><P tok="str" val='"release"' /><P tok="cmd" val="]" />{"\n"}
          <P tok="cmd" val="    }" />{"\n"}
          <P tok="cmd" val="  }" />{"\n"}
          <P tok="cmd" val="}" />
        </Code>

        <h3>Paths</h3>
        <div className="cfg-table">
          <div className="h">Option</div><div className="h">Description</div><div className="h">Default</div>
          <div className="c k">init</div><div className="c d">Root directory for database scanning.</div><div className="c v">~/</div>
          <div className="c k">db</div><div className="c d">SQLite database location.</div><div className="c v">…/dirvana.db</div>
        </div>

        <h3>Matching</h3>
        <div className="cfg-table">
          <div className="h">Option</div><div className="h">Description</div><div className="h">Default</div>
          <div className="c k">max_results</div><div className="c d">Maximum completions to show.</div><div className="c v">10</div>
          <div className="c k">max_history_size</div><div className="c d">Maximum history entries to track.</div><div className="c v">100</div>
          <div className="c k">type</div><div className="c d">How to match directory names.</div><div className="c v">contains</div>
          <div className="c k">promotion_strategy</div><div className="c d">How to rank results.</div><div className="c v">recently_accessed</div>
        </div>

        <h3>Exclusions</h3>
        <p>
          Four matching patterns — <code className="inl">exact</code>, <code className="inl">prefix</code>, <code className="inl">suffix</code>, <code className="inl">contains</code> — let you trim noise from the index. Defaults already exclude <code className="inl">.git</code>, <code className="inl">node_modules</code>, <code className="inl">dist</code>, <code className="inl">target</code>, virtual envs, and dotfile directories.
        </p>
      </>
    )
  },

  tips: {
    label: "tips.md",
    icon: "compass",
    crumbs: ["~", "dirvana", "tips.md"],
    render: () => (
      <>
        <div className="eyebrow">Tips & best practices</div>
        <h1 className="display">Get the most out of <em>dv</em>.</h1>

        <h2>Pick the right root</h2>
        <p>The root directory is the universe Dirvana scans. Make it tight enough to be fast, broad enough to cover your actual work.</p>
        <Code>
          <P tok="comment" val="# Good choices" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv build --root ~/Code" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv build --root ~/Documents" />{"\n\n"}
          <P tok="comment" val="# Less optimal — too many directories, slow performance" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv build --root /" />
        </Code>

        <h2>Match-mode cheat sheet</h2>
        <div className="cfg-table">
          <div className="h">Mode</div><div className="h">When to choose it</div><div className="h">Trade-off</div>
          <div className="c k">contains</div><div className="c d">Most flexible. Default for a reason.</div><div className="c v">more matches</div>
          <div className="c k">prefix</div><div className="c d">Faster, better for consistent naming.</div><div className="c v">strict starts</div>
          <div className="c k">exact</div><div className="c d">Most precise — when you know names.</div><div className="c v">no fuzz</div>
          <div className="c k">suffix</div><div className="c d">Useful for <code className="inl">-api</code> / <code className="inl">-web</code> patterns.</div><div className="c v">strict ends</div>
        </div>

        <h2>Shortcuts that pay rent</h2>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val='c "cursor"' />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val='penv "source .venv/bin/activate && source .env && clear"' />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val='rmdir "rm -rf"' />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="dv add " /><P tok="arg" val={'claude "cd {} && claude"'} />
        </Code>

        <h2>Performance</h2>
        <ul style={{ paddingLeft: 18, color: "var(--ink-2)" }}>
          <li>Use <strong>exclusions</strong> to skip large irrelevant directories.</li>
          <li>Run <code className="inl">dv refresh</code> periodically — or just rely on the auto-refresh on terminal start.</li>
          <li>Tune <code className="inl">max_results</code> to your screen size.</li>
          <li>Set <code className="inl">max_history_size</code> appropriately — larger means better predictions, more storage.</li>
        </ul>

        <div className="tip"><strong>Bypass syntax:</strong> use <code className="inl">--</code> to opt out of Dirvana's command interpretation. <code className="inl">dv -- build</code> navigates to a directory called "build" instead of running the build subcommand.</div>
      </>
    )
  },

  troubleshoot: {
    label: "troubleshoot.md",
    icon: "wrench",
    crumbs: ["~", "dirvana", "troubleshoot.md"],
    render: () => (
      <>
        <div className="eyebrow">Troubleshooting</div>
        <h1 className="display">When things <em>don't</em> work.</h1>
        <p className="lede">
          Most issues come from a missing PATH entry or a stale completion cache. The four sections below cover ~95% of reported problems.
        </p>

        <h3>Completion not working</h3>
        <ol style={{ paddingLeft: 18, color: "var(--ink-2)" }}>
          <li>Ensure <code className="inl">~/.local/bin</code> is in your <code className="inl">PATH</code>.</li>
          <li>Verify <code className="inl">fpath</code> includes <code className="inl">~/.zsh/completions</code>.</li>
          <li>Run <code className="inl">compinit</code> to rebuild the completion cache.</li>
          <li>Make sure <code className="inl">dv-binary</code> is executable: <code className="inl">chmod +x ~/.local/bin/dv-binary</code>.</li>
        </ol>

        <h3>Database not updating</h3>
        <ol style={{ paddingLeft: 18, color: "var(--ink-2)" }}>
          <li>Run <code className="inl">dv refresh</code> manually.</li>
          <li>Check the configured root: <code className="inl">cat ~/Library/Application\ Support/dirvana/config.json</code>.</li>
          <li>Rebuild from scratch: <code className="inl">dv build --root ~/your/root/path</code>.</li>
        </ol>

        <h3>Permission errors</h3>
        <Code>
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="chmod 755 ~/Library/Application\\ Support/dirvana" />{"\n"}
          <P tok="prompt" val="~ ❯ " /><P tok="cmd" val="chmod 644 ~/Library/Application\\ Support/dirvana/config.json" />
        </Code>

        <h3>Command not found</h3>
        <ol style={{ paddingLeft: 18, color: "var(--ink-2)" }}>
          <li>Find the binary: <code className="inl">which dv-binary</code>.</li>
          <li>Add to <code className="inl">PATH</code> in <code className="inl">.zshrc</code>: <code className="inl">{'export PATH="$HOME/.local/bin:$PATH"'}</code>.</li>
          <li>Reload your shell: <code className="inl">source ~/.zshrc</code>.</li>
        </ol>

        <hr className="rule" />
        <p style={{ fontSize: 13.5, color: "var(--ink-3)" }}>
          Still stuck? Open an issue on the{" "}
          <a href="https://github.com/jlkendrick/dirvana" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>GitHub repo</a> — issues and PRs are welcome under the MIT license.
        </p>
      </>
    )
  }
};

// ---------- Helper presentational components ----------
const CmdCard = ({ label, cmd, big }) => {
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="cmd-card" style={big ? { padding: "18px 18px 16px" } : null}>
      <div className="label">
        <span>$ {label}</span>
        <button className={"copy-btn" + (copied ? " copied" : "")} onClick={onCopy}>
          {copied ? <><Icon name="check" size={11} /> Copied</> : <><Icon name="copy" size={11} /> Copy</>}
        </button>
      </div>
      <div className="cmd"><span className="prompt">$</span>{cmd}</div>
    </div>
  );
};

const Feat = ({ icon, name, desc }) => (
  <div className="feat">
    <div className="name"><Icon name={icon} />{name}</div>
    <p className="desc">{desc}</p>
  </div>
);

Object.assign(window, { Icon, CmdCard, Feat, TREE, SECTIONS });
