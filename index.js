
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ---------------------------------------------------------
   CUSTOM CURSOR + SPAWNED "SITCKER" TRAIL ON HERO
   Adapted from a mousemove-trail concept: throttled spawn,
   GSAP in/out tween, auto cleanup.
--------------------------------------------------------- */
if (!isCoarsePointer && !reduceMotion && window.gsap) {
  document.body.classList.add('cursor-active');
  const cursorDot = document.getElementById('cursorDot');
  cursorDot.style.display = 'block';

  const quickX = gsap.quickTo(cursorDot, "x", { duration: 0.15, ease: "power3" });
  const quickY = gsap.quickTo(cursorDot, "y", { duration: 0.15, ease: "power3" });

  document.addEventListener('mousemove', (e) => {
    quickX(e.clientX);
    quickY(e.clientY);
  });
  document.addEventListener('mouseleave', () => { cursorDot.style.display = 'none'; });
  document.addEventListener('mouseenter', () => { cursorDot.style.display = 'block'; });

  // shrink/grow cursor over interactive elements
  document.querySelectorAll('a, button, .work-card, .pg-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('stamp-mode'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('stamp-mode'));
  });

  const heroArt = document.getElementById('heroArt');
  const STAMP_WORDS = [
    { text: '</>', cls: '' },
    { text: 'MERN', cls: 'alt-a' },
    { text: 'HIRE ME', cls: 'alt-b' },
    { text: 'OR.', cls: 'alt-c' },
    { text: '{ }', cls: '' },
  ];
  let stampIndex = 0;

  function throttle(func, delay) {
    let prev = 0;
    return (...args) => {
      const now = Date.now();
      if (now - prev > delay) {
        prev = now;
        return func(...args);
      }
    };
  }

  const spawnStamp = throttle((e) => {
    const data = STAMP_WORDS[stampIndex % STAMP_WORDS.length];
    stampIndex++;

    const el = document.createElement('div');
    el.className = 'stamp ' + data.cls;
    el.textContent = data.text;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    const rot = (Math.random() * 24 - 12).toFixed(1);
    el.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(0.4)`;
    el.style.opacity = '0';
    document.body.appendChild(el);

    gsap.to(el, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)" });
    gsap.to(el, { opacity: 0, y: "-=18", duration: 0.5, delay: 0.55, ease: "power1.in" });

    setTimeout(() => el.remove(), 1200);
  }, 120);

  heroArt.addEventListener('mousemove', spawnStamp);
}

/* ---------------------------------------------------------
   SCROLL-DRIVEN "LINE ART -> COLOR" REVEAL ON THE ILLUSTRATION
--------------------------------------------------------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (!reduceMotion) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * 1.1),
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      animation: gsap.timeline()
        .to('.art-mono', { clipPath: 'inset(0% 0% 0% 100%)', ease: 'none' })
        .to('.art-stage', { y: -30, ease: 'none' }, 0)
        .to('.art-badge', { opacity: 0, ease: 'none' }, 0),
    });
  } else {
    document.querySelector('.art-mono').style.clipPath = 'inset(0% 0% 0% 100%)';
  }

  /* Generic reveal-on-scroll for sections */
  document.querySelectorAll('.reveal').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => el.classList.add('in'),
      once: true,
    });
  });
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

/* ---------------------------------------------------------
   MARQUEE — duplicate content so the CSS loop is seamless
--------------------------------------------------------- */
const track = document.getElementById('marqueeTrack');
if (track) {
  track.innerHTML += track.innerHTML;
}
