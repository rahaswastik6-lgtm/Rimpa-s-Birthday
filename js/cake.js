/* cake.js — the cake surprise page. Self-contained: only needs js/config.js (for editable text) + css/style.css + css/cake.css. */
(() => {
  const C = CONFIG;
  // fallback text, used only if config.js has no `cake` block — the real, editable text lives in config.js
  C.cake = Object.assign({
    page: "cake.html",
    entryButton: "Wait... one last thing 👀",
    introTitle: "One last surprise...",
    introMessage: "Okay... this one is actually fun 😂",
    boxLabel: "For {her} ✨",
    boxNote: "okay... this is actually the last one 😂",
    openButton: "Open it",
    candles: 18,
    wishLine: "Okay, birthday girl...",
    wishTitle: "Make a wish ✨",
    blowInstruction: "Take a breath... and blow 🎂",
    blowHere: "Blow at the candles ↓",
    micNote: "(your mic only listens for the blow — nothing is recorded)",
    micFallback: "Mic not cooperating? Tap the button below 👇",
    manualBlowButton: "Tap to blow instead",
    afterBlow: "Wish made ✨",
    blownTitle: "Happy 18th, {her} 🥳🎂",
    cutTitle: "Now comes the important part 😂",
    cutButton: "Cut the cake 🎂",
    cutHint: "Drag the knife down the dotted line (or just tap it)",
    cutDone: "Finally 😂",
    cutDone2: "Now someone has to eat it...",
    cutJoke: "Unfortunately, the website cannot deliver cake. 😭😂",
    finalTitle: "Happy 18th, {her} 🥳🎂✨",
    finalMessage: "Hope this little website made you smile.",
    finalFunny: "Okay, NOW we're actually done. 😂"
  }, C.cake);
  const app = document.getElementById("app");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>\"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- music state + page transitions (same behaviour as script.js) ---------- */
  const audio = C.music ? new Audio(C.music) : null;
  const go = file => {
    if (audio) sessionStorage.setItem("music", JSON.stringify({ on: !audio.paused, t: audio.currentTime }));
    
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = file), 450);
  };
  document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

  /* ---------- the cake ---------- */
  const views = {
        /* ★ CAKE — box opens → candles light → blow (mic or button) → knife cut → celebration. All text from C.cake */
    cake() {
      const K = C.cake, $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
      const f = s => esc(s).replaceAll("{her}", esc(C.herName)), rnd = (a, b) => a + Math.random() * (b - a);
      const N = K.candles || 18, back = Math.ceil(N / 2), cols = ["#f8c8d4", "#d9cfeb", "#fbe3d3", "#fff"];
      const cds = Array.from({ length: N }, (_, n) => {
        const r = n < back ? 0 : 1, cnt = r ? N - back : back, k = r ? n - back : n;
        return `<b class="cd r${r}" style="left:${cnt > 1 ? 3 + k * 94 / (cnt - 1) : 50}%;--c:${cols[n % 4]}"><u class="fl"><i></i></u></b>`;
      }).join("");
      app.innerHTML = `<section class="cakepg">
        <div class="msgs" role="status" aria-live="polite"><p id="m1" class="hand"></p><h1 id="m2" class="big"></h1><p id="m3"></p></div>
        <div class="cst" id="cst">
          <div class="gbox" id="gbox" role="button" tabindex="0" aria-label="${esc(K.openButton)}">
            <div class="bx"><i class="rb"></i></div><div class="lid"><i class="rb"></i><i class="bow"></i></div>
            <div class="tag"><b>${f(K.boxLabel)}</b><span>${f(K.boxNote)}</span></div></div>
          <div class="cake" id="cake"><i class="plate"></i>
            <div class="tier b"><div class="main"></div><div class="cutface"></div><div class="slice"></div><span class="num">18</span></div>
            <div class="tier t"><div class="tm"></div><div class="cds">${cds}</div></div>
            <div class="zone" id="zone" tabindex="0" aria-label="${esc(K.cutButton)}"><i class="cl"></i>
              <svg class="knife" viewBox="0 0 26 52" aria-hidden="true"><path d="M9 0h8v17H9z" fill="#7a2e3f"/><path d="M6 17h14l-7 35z" fill="#eef1f5" stroke="#9aa3ad"/></svg></div>
          </div></div>
        <div class="cact"><button class="btn" id="ob">${esc(K.openButton)}</button><button class="btn ghost" id="fb" hidden>${esc(K.manualBlowButton)}</button></div></section>`;
      const [st, cake, gb, zone, fb] = ["cst", "cake", "gbox", "zone", "fb"].map($), cs = [...cake.querySelectorAll(".cd")];
      const say = (a, b, c) => [["m1", a], ["m2", b], ["m3", c]].forEach(([id, t]) => {
        if (t === undefined) return; const el = $(id); el.classList.remove("on"); void el.offsetWidth; el.innerHTML = t; if (t) el.classList.add("on"); });
      const bend = v => cake.style.setProperty("--bend", v.toFixed(2));
      say("", f(K.introTitle), f(K.introMessage));

      /* ----- 1. open the box ----- */
      let opened = false;
      const open = async () => {
        if (opened) return; opened = true; $("ob").hidden = true; say("", "", "");
        gb.classList.add("shake"); await wait(500);
        gb.classList.remove("shake"); gb.classList.add("open"); await wait(500);                // ribbon + lid
        st.classList.add("glow", "zm"); st.classList.add("rise");                                // warm light, cake rises out
        if (!reduced) for (let k = 0; k < 22; k++) { const s = document.createElement("span"); s.className = "sp"; s.textContent = ["✦", "✧", "·"][k % 3];
          s.style.cssText = `left:${35 + Math.random() * 30}%;--dx:${rnd(-70, 70)}px;animation-delay:${rnd(0, .8)}s`; st.appendChild(s); setTimeout(() => s.remove(), 2800); }
        await wait(900); st.classList.add("sides"); await wait(900);                           // box sides fall away
        light();
      };
      gb.onclick = $("ob").onclick = open;
      gb.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };

      /* ----- 2. light the candles one by one ----- */
      const light = async () => {
        for (const c of cs) { c.classList.add("lit"); await wait(130); }
        st.classList.add("lit"); say(f(K.wishLine), f(K.wishTitle), ""); await wait(2600);
        say("", f(K.blowInstruction), `${f(K.blowHere)}<br><small>${f(K.micNote)}</small>`);
        fb.hidden = false; startMic(); setTimeout(() => { if (!blown) { fb.classList.add("nudge"); say(undefined, undefined, f(K.micFallback)); } }, 9000);
      };

      /* ----- 3. blow: microphone (local only, never recorded) + button fallback ----- */
      let mic = null, blown = false;
      const stopMic = () => { if (!mic) return; cancelAnimationFrame(mic.raf); try { mic.s.getTracks().forEach(t => t.stop()); mic.x.close(); } catch (_) {} mic = null; };
      const startMic = async () => {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
          if (blown) return s.getTracks().forEach(t => t.stop());
          const x = new (window.AudioContext || window.webkitAudioContext)(), an = x.createAnalyser(), buf = new Float32Array(1024);
          an.fftSize = 1024; x.createMediaStreamSource(s).connect(an); x.resume();
          mic = { s, x, raf: 0 }; let base = 0.01, n = 0, held = 0, sm = 0, last = performance.now();
          const loop = t => {
            if (!mic || blown) return;
            try {
              an.getFloatTimeDomainData(buf); let sum = 0; for (let k = 0; k < buf.length; k++) sum += buf[k] * buf[k];
              const rms = Math.sqrt(sum / buf.length), dt = t - last; last = t;
              if (n < 25) { base = Math.min(.04, base * .8 + rms * .2); n++; }               // learn the room's noise first (~0.4s)
              const thr = Math.max(.05, base * 3);
              sm += (Math.min(1, Math.max(0, (rms - base) / (thr * 2))) - sm) * .3; if (n >= 25) bend(sm);   // flames lean while she blows
              held = n >= 25 && rms > thr ? held + dt : Math.max(0, held - dt * 2);
              if (held > 450) return blow();                                                // sustained airflow = blown
            } catch (_) { return stopMic(); }
            mic.raf = requestAnimationFrame(loop);
          };
          mic.raf = requestAnimationFrame(loop);
          document.addEventListener("pointerdown", () => mic && mic.x.resume());            // iOS: wake audio on first touch
        } catch (_) { say(undefined, undefined, f(K.micFallback)); fb.classList.add("nudge"); }   // denied / unsupported → button still works
      };
      fb.onpointerdown = () => !blown && bend(1); fb.onpointerup = fb.onpointerleave = () => !blown && bend(0); fb.onclick = () => blow();

      const smoke = c => { const s = document.createElement("s"); s.className = "sm"; s.style.setProperty("--x", rnd(-.8, .8) + "em"); c.appendChild(s); setTimeout(() => s.remove(), 2500); };
      const blow = async () => {
        if (blown) return; blown = true; stopMic(); fb.hidden = true; fb.classList.remove("nudge");   // mic is released immediately
        cake.classList.add("blowing"); bend(1); say("", "", "");
        for (const c of cs) { await wait(140); c.classList.add("out"); if (!reduced) smoke(c); }
        await wait(500); cake.classList.remove("blowing"); bend(0); st.classList.remove("glow"); st.classList.add("dim");
        say(f(K.afterBlow), f(K.blownTitle), ""); $("m2").classList.add("glow"); await wait(3000);
        cut();
      };

      /* ----- 4. cut the cake: drag the knife (mouse/touch) or tap the dotted line ----- */
      const cut = () => {
        $("m2").classList.remove("glow"); say(f(K.cutTitle), f(K.cutButton), f(K.cutHint));
        const cl = zone.querySelector(".cl"), kn = zone.querySelector(".knife"); zone.classList.add("on");
        let p = 0, drag = false, moved = 0, y0 = 0, done = false, lastC = 0;
        const crumbs = (n, big) => { if (reduced) return; const h = zone.offsetHeight;
          for (let k = 0; k < n; k++) { const c = document.createElement("i"); c.className = "crumb";
            c.style.cssText = `left:${zone.offsetLeft + zone.offsetWidth / 2}px;top:${zone.offsetTop + (big ? rnd(0, h) : p * h)}px;--dx:${rnd(-1, 1) * (big ? 70 : 28)}px;--dy:${rnd(big ? -50 : 0, 60)}px`;
            cake.appendChild(c); setTimeout(() => c.remove(), 1000); } };
        const set = v => {
          if (done) return; p = Math.max(p, Math.min(1, v)); cl.style.height = p * 100 + "%";
          kn.style.translate = `0 ${p * zone.offsetHeight}px`;
          if (Date.now() - lastC > 90) { lastC = Date.now(); crumbs(1); }
          if (p >= .96) finish();
        };
        const finish = async () => {
          done = true; zone.classList.remove("on"); crumbs(20, true); cake.classList.add("cut"); say("", "", "");
          await wait(1300); say("", f(K.cutDone), `${f(K.cutDone2)}<br>${f(K.cutJoke)}`); await wait(3600); celebrate();
        };
        zone.onpointerdown = e => { drag = true; moved = 0; y0 = e.clientY; zone.setPointerCapture(e.pointerId); };
        zone.onpointermove = e => { if (!drag) return; moved = Math.max(moved, Math.abs(e.clientY - y0)); const r = zone.getBoundingClientRect(); set((e.clientY - r.top) / r.height); };
        zone.onpointerup = zone.onpointercancel = () => { if (drag && moved < 8) set(p + .34); drag = false; };   // a plain tap also advances the cut
        zone.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(p + .34); } };
      };

      /* ----- 5. final celebration (soft, not a huge explosion) ----- */
      const celebrate = async () => {
        say("", f(K.finalTitle), f(K.finalMessage)); burst(24);
        if (!reduced) { const col = ["#e8b8c0", "#d9cfeb", "#fbe3d3", "#ffd98a", "#7a2e3f"];
          for (let k = 0; k < 38; k++) setTimeout(() => { const c = document.createElement("i"); c.className = "cf"; c.style.cssText =
            `left:${rnd(0, 100)}%;background:${col[k % 5]};--dx:${rnd(-60, 60)}px;animation-duration:${rnd(5, 9)}s`; document.body.appendChild(c); setTimeout(() => c.remove(), 9500); }, k * 160); }
        await wait(2800); $("m3").innerHTML += `<br><span class="hand">${f(K.finalFunny)}</span>`;
      };
    }

  };

  /* ---------- floating stars, music button, back button, cursor sparkles ---------- */
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
    const W = document.documentElement.clientWidth || innerWidth, phone = W <= 480;
    n = Math.max(4, Math.round(n * (phone ? .6 : W <= 820 ? .75 : 1)));
    for (let k = 0; k < n; k++) {
      const kind = k % 9 === 0 ? "fl" : k % 9 === 4 ? "sil" : k % 3 === 1 ? "pt" : "dot";   // flower · green silhouette · petal · gold dust
      let s = kind === "fl" ? r(24, 34) : kind === "sil" ? r(12, 18) : kind === "pt" ? r(7, 11) : r(3, 6);
      s *= (phone ? .8 : 1);
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
  mountMusic();
  app.insertAdjacentHTML("beforebegin", `<button class="backbtn" data-go="final.html">← back</button>`);
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
  views.cake();
  burst(8);
})();
