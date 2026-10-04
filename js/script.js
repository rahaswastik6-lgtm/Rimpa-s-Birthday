/* script.js — builds every page from CONFIG (js/config.js). You normally don't edit this. */
(() => {
  const C = CONFIG;
  const PAGES = ["entry", "welcome", "memories", "letter", "final"];
  const FILES = ["index.html", "welcome.html", "memories.html", "letter.html", "final.html"];
  const i = PAGES.indexOf(document.body.dataset.page);
  const app = document.getElementById("app");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Soft placeholder shown when a photo file is missing
  window.PH = () => "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='#efd9dc'/>" +
    "<text x='300' y='310' font-size='30' text-anchor='middle' fill='#8a5a63' font-family='serif'>your photo here ✨</text></svg>");

  const photo = (src, alt, cls = "") =>
    `<figure class="polaroid ${cls}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src=PH()"></figure>`;
  const next = t => `<div class="center"><button class="btn" data-go="${FILES[i + 1]}">${t}</button></div>`;

  /* ---------- page transitions + music state ---------- */
  const audio = C.music ? new Audio(C.music) : null;
  const go = file => {
    if (audio) sessionStorage.setItem("music", JSON.stringify({ on: !audio.paused, t: audio.currentTime }));
    if (document.body.classList.contains("zoom")) sessionStorage.setItem("arrive", "1");   // lets the next page fade in softly
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = file), 450);
  };
  document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

  /* ---------- SUNFLOWER THEME · phase 2: decoration for countdown, curtains and locked letter ----------
     Decor only (aria-hidden, pointer-events none). Everything returns "" when theme.sunflower is false. */
  const SFX = (() => {
    const on = !C.theme || C.theme.sunflower !== false, r = (a, b) => a + Math.random() * (b - a);
    const leaf = (x, y, w, a) => `<use href="#sf-leaf" x="${x}" y="${y - w / 3.75}" width="${w}" height="${w / 1.875}" transform="rotate(${a} ${x} ${y})"/>`;
    const bloom = (x, y, s, a) => `<use href="#sf-bloom" x="${x}" y="${y}" width="${s}" height="${s}" transform="rotate(${a} ${x + s / 2} ${y + s / 2})"/>`;
    const stem = d => `<path d="${d}" fill="none" stroke="#52643A" stroke-width="4.5" stroke-linecap="round"/>`;
    const svg = (vb, body, cls = "") => `<svg${cls ? ` class="${cls}"` : ""} viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
    const tall = svg("0 0 120 260", stem("M60 100C57 150 66 205 60 260") + leaf(60, 205, 44, -148) + leaf(61, 172, 38, -32) + bloom(5, 0, 110, -8));
    const posy = svg("0 0 120 150", stem("M60 85C58 105 62 125 60 150") + leaf(60, 130, 36, -150) + leaf(61, 116, 32, -32) + bloom(10, 0, 100, 6), "sfpo");
    const sprig = svg("0 -10 110 90", stem("M4 74C34 70 62 52 90 22") + leaf(20, 71, 28, -60) + leaf(30, 68, 26, 25) + leaf(48, 58, 28, -62) + leaf(56, 52, 26, 22) + leaf(76, 35, 22, -70) + bloom(70, -6, 40, 10));
    /* phase 3B builders: mini() = one small bloom (+ optional leaf), corner = a little leaf sprig for a card corner */
    const mini = (cls, rot, flip, withLeaf) => `<svg class="${cls}" viewBox="0 0 110 108" style="--r:${rot}deg;--f:${flip}" aria-hidden="true" focusable="false">` +
      (withLeaf ? `<use href="#sf-leaf" x="46" y="52" width="46" height="24.5" transform="rotate(38 46 64)"/>` : "") + `<use href="#sf-bloom" width="100" height="100"/></svg>`;
    const corner = svg("0 0 48 54", stem("M44 4C34 10 22 22 10 40").replace('stroke-width="4.5"', 'stroke-width="2.2"') +
      leaf(36, 10, 15, 90) + leaf(28, 17.5, 15, 190) + leaf(19, 27.6, 14, 75) + leaf(10, 40, 13, 122), "sfm-cn");
    /* phase 5 builders (final page): fnCn = the corner sunflower, fnDv = a tiny leaf-and-bloom signature for the foot of the card */
    const fnCn = svg("0 0 72 84", stem("M45 42C45 56 40 70 31 82").replace('stroke-width="4.5"', 'stroke-width="1.8"') + leaf(40, 67, 20, -150) + leaf(43.7, 54.5, 16, -22) + bloom(22, 0, 46, -8), "sff-a");
    const fnDv = (() => {
      let p = "";
      for (let k = 0; k < 10; k++) p += `<ellipse cx="50" cy="4.6" rx="1.8" ry="3.7" transform="rotate(${k * 36} 50 8)"/>`;
      return svg("0 0 100 16", `<path d="M7 8H25M75 8H93" fill="none" stroke="#788A4A" stroke-width="1" stroke-linecap="round" opacity=".7"/>` +
        `<g fill="#788A4A" opacity=".85"><path d="M42 8C38 4 31 4.5 27 8 31 11.5 38 12 42 8Z"/><path d="M58 8C62 4 69 4.5 73 8 69 11.5 62 12 58 8Z"/><circle cx="4" cy="8" r="1.2"/><circle cx="96" cy="8" r="1.2"/></g>` +
        `<g fill="#F4C542" stroke="#E8AA22" stroke-width=".35">${p}</g><circle cx="50" cy="8" r="2.5" fill="#7a5128"/>`, "sff-dv");
    })();
    const defs = () => {                                   // one shared bloom + leaf, injected once into <body>
      if (document.getElementById("sf-bloom")) return;
      let p = "", d = "";
      for (let k = 0; k < 16; k++) p += `<ellipse cx="50" cy="25" rx="6.5" ry="22" transform="rotate(${k * 22.5} 50 50)" fill="#E8AA22"/>`;
      for (let k = 0; k < 16; k++) p += `<ellipse cx="50" cy="28" rx="6" ry="18" transform="rotate(${k * 22.5 + 11.25} 50 50)" fill="#F4C542"/>`;
      for (let k = 0; k < 14; k++) { const a = k * 25.7 * Math.PI / 180, q = k % 2 ? 11 : 6.5; d += `<circle cx="${(50 + Math.cos(a) * q).toFixed(1)}" cy="${(50 + Math.sin(a) * q).toFixed(1)}" r="1.3" fill="#c28a45"/>`; }
      document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><radialGradient id="sfDisc"><stop offset="0" stop-color="#7a5128"/><stop offset="1" stop-color="#3a2412"/></radialGradient></defs>` +
        `<symbol id="sf-bloom" viewBox="0 0 100 100">${p}<circle cx="50" cy="50" r="16" fill="url(#sfDisc)"/>${d}</symbol>` +
        `<symbol id="sf-leaf" viewBox="0 0 30 16"><path d="M0 8C8 0 22 0 30 8 22 16 8 16 0 8Z" fill="#788A4A"/><path d="M2 8H28" stroke="#52643A" stroke-width=".8" opacity=".6"/></symbol></svg>`);
    };
    /* phase 4 builders (letter page): lnWm = faint line-art watermark, lnCn = one small corner sunflower, lnDv = tiny divider, lnPt = resting petals */
    const lnWm = (() => {
      let p = "", d = "";
      for (let k = 0; k < 18; k++) p += `<ellipse cx="100" cy="40" rx="8" ry="31" transform="rotate(${k * 20} 100 100)"/>`;
      for (let k = 0; k < 18; k++) p += `<ellipse class="in" cx="100" cy="48" rx="6" ry="22" transform="rotate(${k * 20 + 10} 100 100)"/>`;
      for (let k = 1; k < 64; k++) { const a = k * 137.508 * Math.PI / 180, q = 3.3 * Math.sqrt(k); d += `<circle cx="${(100 + Math.cos(a) * q).toFixed(1)}" cy="${(100 + Math.sin(a) * q).toFixed(1)}" r="1"/>`; }
      return svg("0 0 200 200", `<g class="pe">${p}</g><circle class="dc" cx="100" cy="100" r="28"/><g class="sd">${d}</g>`, "sfl-wm");
    })();
    const lnCn = svg("0 0 72 84", stem("M45 42C45 56 40 70 31 82").replace('stroke-width="4.5"', 'stroke-width="1.8"') + leaf(40, 67, 20, -150) + leaf(43.7, 54.5, 16, -22) + bloom(22, 0, 46, -8), "sfl-cn");
    const lnDv = (() => {
      let p = "";
      for (let k = 0; k < 10; k++) p += `<ellipse cx="66" cy="5.5" rx="2.2" ry="4.5" transform="rotate(${k * 36} 66 10)"/>`;
      return svg("0 0 132 20", `<path d="M8 10H34M98 10H124" fill="none" stroke="#788A4A" stroke-width="1" stroke-linecap="round" opacity=".7"/>` +
        `<g fill="#788A4A" opacity=".85"><path d="M55 10C50 5 43 5.5 38 10 43 14.5 50 15 55 10Z"/><path d="M77 10C82 5 89 5.5 94 10 89 14.5 82 15 77 10Z"/><circle cx="5" cy="10" r="1.3"/><circle cx="127" cy="10" r="1.3"/></g>` +
        `<g fill="#F4C542" stroke="#E8AA22" stroke-width=".4">${p}</g><circle cx="66" cy="10" r="3" fill="#7a5128"/>`, "sfl-dv");
    })();
    const lnPt = ["right:6px;top:21%;--r:35deg", "left:7px;top:41%;--r:-28deg", "right:9px;bottom:33%;--r:-52deg", "left:18%;bottom:6px;--r:20deg"].map(s => `<i class="sfl-pt" style="${s}"></i>`).join("");
    const drift = () => {                                  // a few slow petals over the curtains (reuses phase-1 sfDrift / sfSway)
      if (reduced) return ""; let h = "";
      for (let k = 0, N = innerWidth <= 480 ? 5 : 9; k < N; k++) {      // fewer drifting petals on phones
        const dot = k % 3 === 2, s = dot ? r(3, 5) : r(8, 12);
        const L = r(4, 90); h += `<i class="sfd" style="left:${L.toFixed(0)}%;--s:${s.toFixed(1)}px;--o:.5;--t:${r(30, 50).toFixed(0)}s;--w:${r(6, 10).toFixed(1)}s;--wd:${(-r(0, 8)).toFixed(1)}s;--x:${((L > 50 ? -1 : 1) * r(0, 40)).toFixed(0)}px;--r:${r(-25, 25).toFixed(0)}deg;animation-delay:${(-r(0, 40)).toFixed(0)}s"><b class="sf-in ${dot ? "dot" : "pt"}"></b></i>`;
      }
      return h;
    };
    return {
      stage: () => { if (!on) return ""; defs(); return `<div class="sfl" aria-hidden="true"><div class="sfp sfp-a">${tall}</div><div class="sfp sfp-b">${tall}</div>${drift()}</div>`; },
      halo: () => on ? `<i class="sfhalo" aria-hidden="true"></i>` : "",                                   // golden glow behind the 18
      ring: () => on ? `<svg class="sfring" aria-hidden="true" focusable="false"><use href="#sf-bloom"/></svg>` : "",   // petals around the seal
      env: () => on ? posy + `<i class="sfpt" aria-hidden="true" style="left:-4%;top:-9%;--r:-32deg"></i><i class="sfpt" aria-hidden="true" style="left:-7%;top:46%;--r:24deg"></i><i class="sfpt" aria-hidden="true" style="left:34%;bottom:-10%;--r:-12deg"></i>` : "",
      sprig: () => on ? `<span class="sfcorner" aria-hidden="true">${sprig}</span>` : "",
      /* phase 3 · welcome page: two small blooms (by the heading, tucked behind the photo) + a few tiny petals.
         welcome() returns the markup; fit() places the blooms from the real measured positions, so nothing can overlap. */
      welcome: () => {
        if (!on) return ""; defs();
        const bloom = (cls, r) => `<svg class="sfm ${cls}" viewBox="0 0 110 108" style="--r:${r}deg" aria-hidden="true" focusable="false">` +
          `<use href="#sf-leaf" x="46" y="52" width="46" height="24.5" transform="rotate(38 46 64)"/><use href="#sf-bloom" width="100" height="100"/></svg>`;
        let p = "";
        if (!reduced) [[3, 9, 31, 0], [8, 7, 38, 14], [90, 8, 34, 7], [95, 9, 29, 21], [6, 7, 41, 27]].forEach(([l, s, t, d]) =>
          p += `<i class="sfwp" style="left:${l}%;--s:${s}px;--t:${t}s;--d:${-d}s;--x:${(l > 50 ? -1 : 1) * (10 + d % 9)}px"></i>`);
        return `<div class="sfw" aria-hidden="true">${bloom("sfm-h", 12)}${bloom("sfm-p", -14)}${p}</div>`;
      },
      fit(card) {
        const lay = card && card.querySelector(".sfw"); if (!lay) return;
        const h1 = card.querySelector("h1"), fig = card.querySelector(".polaroid");
        const mh = lay.querySelector(".sfm-h"), mp = lay.querySelector(".sfm-p");
        const put = (el, x, y, s) => { el.style.cssText += `;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${s.toFixed(1)}px;height:${(s * 108 / 110).toFixed(1)}px`; el.classList.add("on"); return true; };
        const place = () => {
          const R = card.getBoundingClientRect(), W = R.width;
          lay.style.setProperty("--H", R.height + "px");
          let okH = false, okP = false;                     // un-placed blooms are hidden; placed ones are just moved (no re-fade)
          if (h1) {                                         // beside the heading text: right of it, else left, else nothing
            const g = document.createRange(); g.selectNodeContents(h1);
            const t = g.getBoundingClientRect(), fs = parseFloat(getComputedStyle(h1).fontSize) || 32;
            if (t.height && t.height < fs * 2) {            // single line only (a wrapped heading gets no flower)
              const s = Math.min(40, Math.max(26, t.height * .7)), y = t.top - R.top - s * .3, gap = 6;
              const xr = t.right - R.left + gap, xl = t.left - R.left - gap - s;
              if (xr + s <= W - 4) okH = put(mh, xr, y, s); else if (xl >= 4) okH = put(mh, xl, y, s);
            }
          }
          if (fig) {                                        // tucked behind the photo's edge, inside the upper half of its height
            const P = fig.getBoundingClientRect(), want = Math.min(64, Math.max(44, P.width * .2));
            const mr = W - (P.right - R.left), ml = P.left - R.left;                        // free room each side of the photo
            const sr = Math.min(want, (mr - 4) / .5), sl = Math.min(want, (ml - 4) / .5);    // half of the bloom stays visible
            const y = P.top - R.top + P.height * .14;
            if (sr >= 22 && sr >= sl) okP = put(mp, P.right - R.left - sr * .5, y, sr);
            else if (sl >= 22) okP = put(mp, P.left - R.left - sl * .5, y, sl);              // no room → no flower
          }
          if (!okH) mh.classList.remove("on"); if (!okP) mp.classList.remove("on");
        };
        place();
        const again = () => requestAnimationFrame(place);
        addEventListener("resize", again); addEventListener("load", again);
        if (fig) fig.querySelectorAll("img").forEach(im => im.addEventListener("load", again));
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
        if (window.ResizeObserver) new ResizeObserver(again).observe(card);
      },
      petals(host) {                                       // petals lift off with the burning 17
        if (!on || reduced) return; let h = "";
        for (let k = 0; k < 14; k++) h += `<i class="sfpet" aria-hidden="true" style="--l:${r(25, 75).toFixed(0)}%;--t:${r(35, 70).toFixed(0)}%;--x:${r(-70, 70).toFixed(0)}px;--y:${(-r(110, 260)).toFixed(0)}px;--r:${r(-200, 200).toFixed(0)}deg;--d:${r(1.8, 3).toFixed(1)}s;--w:${r(0, 2).toFixed(1)}s"></i>`;
        host.insertAdjacentHTML("beforeend", h);
      },
      /* phase 3B · memories page: a tiny bloom by "chapter one", a leaf sprig on each card corner, two small blooms + a few faint
         petals tucked behind the grid. All aria-hidden, no pointer events, no layout impact. Returns "" when theme.sunflower is false. */
      memLabel: () => { if (!on) return ""; defs(); return mini("sfm-lab", 8, 1, false); },
      memCorner: () => { if (!on) return ""; defs(); return corner; },
      memLayer: () => {
        if (!on) return ""; defs();
        let p = "";
        if (!reduced && !(C.theme && C.theme.backgroundPetals === false)) [[8, 8, 36, 0], [27, 7, 42, 12], [58, 9, 38, 6], [80, 7, 44, 20], [94, 8, 34, 3]].forEach(([l, s, t, d]) =>
          p += `<i class="sfmp" style="left:${l}%;--s:${s}px;--t:${t}s;--d:${-d}s;--x:${(l > 50 ? -1 : 1) * (10 + d % 9)}px"></i>`);
        return `<div class="sfmv" aria-hidden="true">${mini("sfm-b sfm-b1", -14, -1, true)}${mini("sfm-b sfm-b2", 18, 1, true)}${p}</div>`;
      },
      memFit(grid) {                                       // petals fall exactly as far as the grid is tall (kept in sync as photos load)
        const lay = grid && grid.querySelector(".sfmv"); if (!lay) return;
        const set = () => lay.style.setProperty("--H", grid.offsetHeight + "px");
        set(); addEventListener("resize", set); addEventListener("load", set);
        if (window.ResizeObserver) new ResizeObserver(set).observe(grid);
      },
      /* phase 4 · letter page: a decoration layer BEHIND the paper text (watermark, corner sunflower, a few petals) + a tiny divider
         that sits in the blank line above the signature. All absolutely positioned, aria-hidden, clipped to the paper. "" when theme.sunflower is false. */
      letterDeco: () => { if (!on) return ""; defs(); return `<div class="sfl-deco" aria-hidden="true">${lnWm}${lnCn}${lnPt}</div>`; },
      letterRule: () => on ? lnDv : "",
      /* phase 5 · final page: one sunflower on the card's top-right corner, one small bloom in the gutter beside the photo, a warm glow behind the ✨,
         a few petals drifting down the card's SIDE PADDING only (never across text or the photo) and a tiny signature in the bottom padding.
         One aria-hidden layer appended as the card's LAST child, all absolutely positioned → no layout impact. "" when theme.sunflower is false. */
      finalDeco: () => {
        if (!on) return ""; defs();
        let p = "";
        if (!reduced && !(C.theme && C.theme.backgroundPetals === false)) [["l", 6, 36, 0], ["r", 7, 44, 14], ["l", 7, 50, 26], ["r", 6, 38, 7]].forEach(([side, s, t, d]) =>
          p += `<i class="sffp ${side}" style="--s:${s}px;--t:${t}s;--d:${-d}s;--x:${(side === "r" ? -1 : 1) * (2 + d % 3)}px"></i>`);
        return `<div class="sff" aria-hidden="true"><div class="sff-clip"><i class="sff-glow"></i>${p}</div>${fnCn}${mini("sff-m", -10, -1, true)}${fnDv}</div>`;
      },
      finalFit(card) {                                     // places the small bloom in the free gutter beside the photo (no room → no flower)
        const lay = card && card.querySelector(".sff"); if (!lay) return;
        const fig = card.querySelector(".polaroid"), m = lay.querySelector(".sff-m");
        const place = () => {
          const R = card.getBoundingClientRect(); lay.style.setProperty("--H", R.height + "px");   // petals fall exactly as far as the card is tall
          if (!fig || !m) return;
          const P = fig.getBoundingClientRect(), gutter = P.left - R.left - 10;                      // photo's real edge (tilt included) minus 10px of air
          const s = Math.min(Math.min(56, Math.max(40, P.width * .2)), gutter / .78);                // a fifth of its width hangs off the card edge
          if (s < 26) return void m.classList.remove("on");
          m.style.cssText += `;left:${(-s * .22).toFixed(1)}px;top:${(P.top - R.top + P.height * .56 - s / 2).toFixed(1)}px;width:${s.toFixed(1)}px`;
          m.classList.add("on");
        };
        place();
        const again = () => requestAnimationFrame(place);
        addEventListener("resize", again); addEventListener("load", again);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
        if (window.ResizeObserver) new ResizeObserver(again).observe(card);
      }
    };
  })();

  /* ---------- pages ---------- */
  const views = {
    /* ★ NEW — countdown → 17 burns → 18 → curtains open → lock(). Birthday comes ONLY from config.js */
    entry() {
      const K = C.countdown, target = new Date(C.birthdayDate).getTime();
      const wait = ms => new Promise(r => setTimeout(r, ms)), two = n => String(n).padStart(2, "0");
      const seen = { get: () => { try { return sessionStorage.getItem("bday"); } catch (_) { return null; } },
                     set: () => { try { sessionStorage.setItem("bday", "1"); } catch (_) {} } };
      const bulbs = Array.from({ length: 15 }, (_, n) =>
        `<i style="left:${n * 100 / 14}%;--y:${Math.sin(Math.PI * n / 14) * 26}px;animation-delay:${(n % 5) * .4}s"></i>`).join("");
      app.innerHTML = `<div class="theatre" id="theatre">
        <div class="backdrop" aria-hidden="true"><div class="lights">${bulbs}</div></div>
        <div class="scene" id="scene"></div>
        <div class="curtain l" aria-hidden="true"><div class="cloth"></div></div><div class="curtain r" aria-hidden="true"><div class="cloth"></div></div>
        <div class="hud" id="hud">${SFX.stage()}
          <div class="pre"><p class="hand">${esc(K.curtainTitle)}</p><h1>${esc(K.title)}</h1>
            <div class="clock" role="timer">${K.labels.map(l => `<div class="unit"><b>00</b><span>${esc(l)}</span></div>`).join("")}</div>
            <p class="hand" id="early">${esc(K.earlyMessage)}</p><p class="small">${esc(K.unlockMessage)}</p><p class="eyebrow">${esc(K.curtainSub)}</p></div>
          <div class="post"><div class="age">${SFX.halo()}<b class="old" id="o17">${esc(K.oldAge)}</b><div class="nw" id="n18"><b>${esc(K.newAge)}</b><span>✨</span></div></div>
            <h2 class="bday" id="bday">${esc(K.birthdayMessage)}</h2><p class="hand oline" id="oline">${esc(K.openLine)}</p></div>
          <i class="flare"></i></div></div>`;
      const $ = id => document.getElementById(id);
      const th = $("theatre"), hud = $("hud"), scene = $("scene"), o17 = $("o17"), n18 = $("n18");
      const units = [...hud.querySelectorAll(".unit b")], show = el => el.classList.add("show");
      let started = false;

      const star = n => {                                    // gold sparkles for the 18 reveal
        if (reduced) return;
        for (let k = 0; k < n; k++) {
          const s = document.createElement("span"), a = Math.random() * 6.28, d = 90 + Math.random() * 300;
          s.className = "out gold"; s.textContent = ["✦", "✧", "·"][k % 3];
          s.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
          document.body.appendChild(s); setTimeout(() => s.remove(), 1700);
        }
      };
      const embers = () => {                                 // ember + smoke particles around the 17
        if (reduced) return; let h = "";
        for (let k = 0; k < 38; k++) h += `<i class="ember" style="--l:${20 + Math.random() * 60}%;--t:${25 + Math.random() * 50}%;--x:${Math.random() * 90 - 45}px;--y:${-70 - Math.random() * 150}px;--d:${1.2 + Math.random() * 1.2}s;--w:${Math.random() * 2}s"></i>`;
        for (let k = 0; k < 5; k++) h += `<i class="smoke" style="--l:${22 + k * 14}%;--w:${.4 + k * .35}s"></i>`;
        o17.parentNode.insertAdjacentHTML("beforeend", h);
      };
      const tick = d => {                                    // d = ms left; ceil so 00:00:00:00 appears only at true zero
        const s = Math.ceil(Math.max(0, d) / 1000), v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
        units.forEach((u, n) => { const t = two(v[n]); if (u.textContent !== t) { u.textContent = t; u.classList.remove("tick"); void u.offsetWidth; u.classList.add("tick"); } });
        if (d < 36e5) $("early").textContent = K.almostMessage;
      };

      // ★ CURTAINS OPEN, then the existing password experience starts (lock() is the old entry page, unchanged)
      const open = async instant => {
        seen.set(); th.classList.add("open"); if (instant) th.classList.add("instant");
        await wait(instant ? 0 : 1300);                      // curtains part first, envelope fades in behind them
        views.lock(scene); scene.classList.add("in");
      };
      // ★ 17 → 18 SEQUENCE: edit the wait() times (ms) to speed up / slow down
      const reveal = async instant => {
        if (started) return; started = true; th.classList.add("bright");
        if (!instant) await wait(900);                       // zeros hold, everything glows brighter
        hud.classList.add("reveal"); await wait(900);        // countdown fades, age block appears
        if (!instant) { show(o17); await wait(1400); o17.classList.add("burn"); embers(); SFX.petals(o17.parentNode); await wait(3100); }   // 17 burns away
        show(n18); hud.classList.add("flash"); star(26); await wait(1700);                                       // 18 appears
        show($("bday")); await wait(1400); show($("oline")); await wait(instant ? 1500 : 2400);
        open(false);
      };
      const loop = () => {                                   // self-correcting 1-second tick, always recomputed from the clock
        const d = target - Date.now();
        if (!(d > 0)) { tick(0); return reveal(false); }
        tick(d); setTimeout(loop, d % 1000 + 20);
      };

      if (target > Date.now()) loop();                       // before birthday: countdown only, no password in the DOM
      else if (seen.get()) open(true);                       // already revealed this session (e.g. pressed "back")
      else { tick(0); reveal(true); }                        // opened after the birthday: brief 18, then curtains
    },

    lock(app) {                                              // the ORIGINAL opening page (envelope + password), now mounted into #scene
      const code = String(C.secretCode), len = code.length;
      const SUBMIT = C.submitKey || "😂";                  // the bottom-right key
      const bad = C.wrongMessages && C.wrongMessages.length ? C.wrongMessages : ["Nope."];
      const fill = s => esc(s).replaceAll("{her}", esc(C.herName));
      // intro letter: blank line = new paragraph; single line breaks just reflow
      const lines = C.introLetter.trim().split(/\n\s*\n/)
        .map(p => `<p>${fill(p.split("\n").map(x => x.trim()).join(" "))}</p>`).join("");
      const lock = `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="5" y="11" width="14" height="10" rx="3" fill="currentColor"/></svg>`;
      app.innerHTML = `<div class="gift">
        <header class="top"><p class="hand">${esc(C.topLabel)}</p><h1>${esc(C.heading).replace(/\n/g, "<br> ")}</h1><p class="lead">${esc(C.subheading)}</p></header>
        <div class="stage" id="stage">
          <div class="float" id="float"><div class="env">
            <div class="back"></div>
            <div class="letter" id="letter" aria-hidden="true">${lines}</div>
            <div class="front"><i></i></div><div class="flap"><i></i></div>${SFX.ring()}
            <div class="seal">${lock}</div>
            <div class="tags"><p class="hand">${fill(C.envelopeLabel)}</p><p class="hand small">${esc(C.lockedMessage)}</p></div>
            <p class="note hand">${esc(C.envelopeNote)}<svg viewBox="0 0 30 36" aria-hidden="true"><path d="M24 2C6 6 4 20 12 31M5 25l7 7 6-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
            <figure class="polaroid"><img src="${esc(C.entryPhoto)}" alt="A photo for you" onerror="this.onerror=null;this.src=PH()"><figcaption class="hand">${esc(C.photoCaption)}</figcaption></figure>${SFX.env()}
          </div></div>
          <p class="say hand" id="say" role="status" aria-live="polite"></p>
        </div>
        <section class="panel" id="panel">
          <p class="eyebrow">${esc(C.passwordIntro)}</p><h2>${esc(C.passwordTitle)}</h2><p class="hand locked">${esc(C.passwordSubtitle)}</p>
          <p class="msg" id="msg" role="status" aria-live="polite">${esc(C.promptMessage)}</p>
          <div class="dots" aria-hidden="true">${"<i></i>".repeat(len)}</div>
          <div class="pad" id="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, SUBMIT].map(k =>
            `<button class="key${k === SUBMIT ? " go" : ""}" data-k="${k}" aria-label="${k === "⌫" ? "delete" : k === SUBMIT ? "unlock" : k}">${k}</button>`).join("")}</div>${SFX.sprig()}
        </section></div>`;

      const $ = id => document.getElementById(id);
      const stage = $("stage"), fl = $("float"), panel = $("panel"), msg = $("msg"), say = $("say"), pad = $("pad"), letter = $("letter");
      const dots = panel.querySelectorAll(".dots i");
      let v = "", busy = false, lastBad = -1, tPrompt, done = false;
      const show = (el, s) => { el.textContent = s; el.classList.remove("on"); void el.offsetWidth; el.classList.add("on"); };
      const paint = () => dots.forEach((d, n) => d.classList.toggle("on", n < v.length));

      // sparkles that fly outward from the centre of the screen
      const sparkle = n => {
        if (reduced) return;
        for (let k = 0; k < n; k++) {
          const s = document.createElement("span"), a = Math.random() * 6.28, d = 120 + Math.random() * 280;
          s.className = "out"; s.textContent = ["✦", "✧", "·"][k % 3];
          s.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
          document.body.appendChild(s); setTimeout(() => s.remove(), 1700);
        }
      };

      const press = k => {
        if (busy) return;
        if (k === SUBMIT) return submit();                    // submit
        if (k === "⌫") v = v.slice(0, -1); else if (v.length < len) v += k;   // never more than the code length
        paint();
      };
      const submit = () => {
        if (v.length < len) return show(msg, C.incompleteMessage);
        busy = true;
        v === code ? unlock() : wrong();
      };
      const wrong = () => {
        let n; do n = Math.floor(Math.random() * bad.length); while (n === lastBad && bad.length > 1);   // never the same joke twice in a row
        lastBad = n; show(msg, bad[n]);
        fl.classList.add("shake"); pad.classList.add("wiggle");
        setTimeout(() => { fl.classList.remove("shake"); pad.classList.remove("wiggle"); v = ""; paint(); busy = false; }, 500);
        clearTimeout(tPrompt); tPrompt = setTimeout(() => { if (!busy) show(msg, C.promptMessage); }, 2800);
      };

      // zoom + fade out, then open the next page (also runs if she taps the letter to skip the wait)
      const finish = () => {
        if (done) return; done = true;
        document.body.classList.add("zoom"); sparkle(30);
        setTimeout(() => go(C.nextPage), 1000);
      };

      // The unlocking story. Times are in milliseconds from the moment the code is right — tweak freely.
      const unlock = () => {
        // make the letter tall enough for however much text you wrote
        stage.style.setProperty("--lh", Math.max(128, Math.ceil(letter.scrollHeight / stage.querySelector(".env").clientHeight * 100) + 4) + "%");
        msg.textContent = ""; panel.classList.add("glow"); show(say, C.waitMessage);                 // dots glow, "WAIT..."
        stage.scrollIntoView({ block: "center", behavior: "smooth" });
        [[900,  () => stage.classList.add("unlocked")],                        // lock opens
         [1400, () => stage.classList.add("opened")],                          // flap opens
         [1950, () => stage.classList.add("rise")],                            // letter slides up
         [2700, () => { stage.classList.add("read"); letter.removeAttribute("aria-hidden"); show(say, C.successMessage); sparkle(16); }],
         [4100, () => { show(say, C.moreMessage); letter.style.cursor = "pointer"; letter.addEventListener("click", finish); }],
         [4100 + (C.holdTime || 6500), finish]                                 // pause so she can read, then transition
        ].forEach(([ms, fn]) => setTimeout(fn, ms));
        mountMusic();                                                          // music button appears only after unlocking
      };

      panel.addEventListener("click", ev => { const b = ev.target.closest(".key"); if (b) press(b.dataset.k); });
      document.addEventListener("keydown", ev => {
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;                     // leave browser shortcuts alone
        const k = /^\d$/.test(ev.key) ? ev.key : ev.key === "Backspace" ? "⌫" : ev.key === "Enter" ? SUBMIT : null;
        if (k) { ev.preventDefault(); press(k); }                              // preventDefault stops Enter from also clicking a focused key
      });
    },

    welcome() {
      const w = C.welcome;
      app.innerHTML = `<section class="card center"><p class="hand">${w.label}</p><h1>Hey, ${C.herName} ✨</h1>
        <p class="sub">${w.subtitle}</p>${photo(w.photo, "A photo for you", "big tilt")}
        <p class="lead">${w.line}</p><p class="msg">${w.message.join("<br>")}</p>${next(w.button)}${SFX.welcome()}</section>`;
      SFX.fit(app.querySelector(".card"));
    },

    memories() {
      const m = C.memories, tilt = [-3, 2, -1.5, 3, -2, 1.5];
      app.innerHTML = `<header class="head center"><p class="hand">${m.label}${SFX.memLabel()}</p><h1>${m.title}</h1><p class="sub">${m.subtitle}</p></header>
        <div class="grid">${m.items.map((it, n) => `<article class="mem" style="--r:${tilt[n % 6]}deg">
          ${SFX.memCorner()}${photo(it.photo, it.title)}<p class="hand date">${it.date}</p><h2>${it.title}</h2><p>${it.caption}</p></article>`).join("")}${SFX.memLayer()}</div>${next("Continue →")}`;
      SFX.memFit(app.querySelector(".grid"));
    },

    letter() {
      const l = C.letter;
      const total = l.paragraphs.join(" ").split(" ").length, step = Math.min(0.06, 7 / total);
      let n = 0;
      const words = t => t.split(" ").map(w => `<span class="w" style="animation-delay:${(n++ * step).toFixed(2)}s">${w}</span>`).join(" ");
      app.innerHTML = `<header class="head center"><p class="hand">${l.label}</p><h1>${l.title}</h1></header>
        <article class="paper">${SFX.letterDeco()}<p>Hey ${C.herName},</p>${l.paragraphs.map(p => `<p>${words(p)}</p>`).join("")}
        <p class="sign">${SFX.letterRule()}— ${C.yourName}</p></article><p class="hand more center">${l.next}</p>${next(l.button)}`;
    },

    final() {
      const f = C.final;
      app.innerHTML = `<section class="card center"><div class="heart" aria-hidden="true">✨</div><h1>${f.heading}</h1>
        <p class="sub">${f.sub}</p><p class="msg">${f.message}</p>${photo(f.photo, "A final photo", "tilt")}
        <p class="hand foot">${f.footer}</p>${SFX.finalDeco()}</section>`;
      SFX.finalFit(app.querySelector(".card"));
      setTimeout(() => burst(T.sunflower ? 8 : 26), 3000);                // stars appear after a few seconds
    }
  };

  /* ---------- floating stars / hearts ---------- */
  const sky = document.getElementById("sky");
  /* ---------- SUNFLOWER THEME: drifting petals, tiny flowers, golden dust (switch in config.js → theme) ---------- */
  const T = Object.assign({ sunflower: true, backgroundPetals: true }, C.theme);
  function burst(n) {
    if (reduced) return;
    if (!T.sunflower) return stars(n);                    // theme off → the original stars, exactly as before
    if (!T.backgroundPetals) return;
    if (!document.getElementById("sf-flower")) {          // one shared SVG flower, reused everywhere via <use href="#sf-flower">
      const ell = (a, cy, ry, v) => `<ellipse cx="20" cy="${cy}" rx="3.3" ry="${ry}" transform="rotate(${a} 20 20)" style="fill:var(${v})"/>`;
      let p = "";
      for (let k = 0; k < 14; k++) p += ell(k * 360 / 14, 9, 8, "--sf-p2,#E8AA22");
      for (let k = 0; k < 14; k++) p += ell(k * 360 / 14 + 360 / 28, 10.5, 6.5, "--sf-p1,#F4C542");
      sky.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="sf-flower" viewBox="0 0 40 40">${p}<circle cx="20" cy="20" r="6" style="fill:var(--sf-c,#7a5128)"/><circle cx="20" cy="20" r="3.2" style="fill:var(--sf-c2,#c28a45);opacity:.55"/></symbol></svg>`);
    }
    const r = (a, b) => a + Math.random() * (b - a);
    /* responsive pass: phones/tablets get fewer, smaller items; each item is placed so that it, its sway and its drift stay inside the viewport */
    const W = document.documentElement.clientWidth || innerWidth, phone = W <= 480;
    n = Math.max(4, Math.round(n * (phone ? .6 : W <= 820 ? .75 : 1)));
    for (let k = 0; k < n; k++) {
      const kind = k % 9 === 0 ? "fl" : k % 9 === 4 ? "sil" : k % 3 === 1 ? "pt" : "dot";   // flower · green silhouette · petal · gold dust
      const s = (kind === "fl" ? r(24, 34) : kind === "sil" ? r(12, 18) : kind === "pt" ? r(7, 11) : r(3, 6)) * (phone ? .8 : 1);
      const o = { fl: .42, sil: .24, pt: .5, dot: .6 }[kind];
      const el = document.createElement("i");
      const lx = 12 + r(0, Math.max(1, W - s - 24)), dx = Math.max(10 - lx, Math.min(W - s - 10 - lx, r(-50, 50)));   // 12px safe margin: left + drift + sway all stay on screen
      el.className = "sf-item"; el.setAttribute("aria-hidden", "true");
      el.style.cssText = `left:${(lx / W * 100).toFixed(2)}%;--s:${s.toFixed(1)}px;--o:${o};--t:${r(32, 56).toFixed(1)}s;--w:${r(6, 11).toFixed(1)}s;--wd:${(-r(0, 10)).toFixed(1)}s;--x:${dx.toFixed(0)}px;--r:${r(-25, 25).toFixed(0)}deg;animation-delay:${(-r(0, 50)).toFixed(1)}s`;
      el.innerHTML = kind === "fl" || kind === "sil"
        ? `<b class="sf-in ${kind}"><svg class="sf-flower" aria-hidden="true" focusable="false"><use href="#sf-flower"/></svg></b>`
        : `<b class="sf-in ${kind}"></b>`;
      sky.appendChild(el);
    }
  }
  function stars(n) {                                     // the ORIGINAL star/heart decoration, kept as the theme-off fallback
    if (reduced) return;
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      s.textContent = ["✦", "✧", "·", "✦", "✧", "·", "♡"][k % 7];
      s.style.cssText = `left:${Math.random() * 100}%;font-size:${10 + Math.random() * 16}px;` +
        `animation-duration:${12 + Math.random() * 14}s;animation-delay:${-Math.random() * 14}s;--x:${Math.random() * 80 - 40}px`;
      sky.appendChild(s);
    }
  }

  /* ---------- music button ---------- */
  window.mountMusic = () => {
    if (!audio || audio.error || document.querySelector(".music")) return;   // audio.error = music file is missing
    audio.loop = true;
    const btn = document.createElement("button");
    btn.className = "music"; btn.setAttribute("aria-label", "Toggle music"); btn.setAttribute("aria-pressed", "false"); btn.textContent = "♪";
    const sync = () => { btn.classList.toggle("on", !audio.paused); btn.setAttribute("aria-pressed", String(!audio.paused)); };
    btn.onclick = () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); };
    audio.addEventListener("play", sync); audio.addEventListener("pause", sync);
    audio.addEventListener("error", () => btn.remove());   // no music file → hide button
    document.body.appendChild(btn);
    try {                                                   // resume from the previous page if she had it on
      const s = JSON.parse(sessionStorage.getItem("music") || "null");
      if (s) { audio.currentTime = s.t || 0; if (s.on) audio.play().catch(() => {}); }
    } catch (_) {}
  };
  if (PAGES[i] !== "entry") mountMusic();

  /* ---------- back button, cursor sparkles ---------- */
  if (i > 0) app.insertAdjacentHTML("beforebegin", `<button class="backbtn" data-go="${FILES[i - 1]}">← back</button>`);
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    let last = 0;
    document.addEventListener("mousemove", e => {
      if (Date.now() - last < 70) return; last = Date.now();
      const s = document.createElement("span");
      s.className = "spark"; s.textContent = "✦"; s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    });
  }

  if (sessionStorage.getItem("arrive")) { document.body.classList.add("arrive"); sessionStorage.removeItem("arrive"); }
  views[PAGES[i]]();
  burst(PAGES[i] === "final" ? 8 : 16);
})();