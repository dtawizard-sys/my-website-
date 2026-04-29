// ══════════════════════════════════════════════════
// FLIP CARD ENGINE — 3 second hover to flip OR click
// ══════════════════════════════════════════════════
const FLIP_DELAY = 3000; // 3 seconds
const CIRCUMFERENCE = 94.25; // 2π×15
const flipTimers = new Map();

function initFlipCards() {
  document.querySelectorAll('.flip-wrap').forEach(card => {
    const ring = card.querySelector('.flip-timer-ring circle.prog');
    let timer = null, startTime = null, rafId = null;

    function startTimer() {
      if (card.classList.contains('flipped')) return;
      startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / FLIP_DELAY, 1);
        // progress 0→1 means offset goes from CIRCUMFERENCE→0
        ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          doFlip(card);
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function stopTimer() {
      cancelAnimationFrame(rafId);
      // Animate the ring back quickly
      ring.style.transition = 'stroke-dashoffset 0.4s ease';
      ring.style.strokeDashoffset = CIRCUMFERENCE;
      setTimeout(() => { ring.style.transition = ''; }, 400);
    }

    // Hover logic
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('flipped')) startTimer();
    });
    card.addEventListener('mouseleave', () => {
      stopTimer();
    });

    // Touch support: tap flipped card to unflip, long-press to flip
    let touchStart = null, touchTimer = null;
    card.addEventListener('touchstart', e => {
      if (card.classList.contains('flipped')) return;
      touchStart = Date.now();
      startTimer();
      touchTimer = setTimeout(() => {}, FLIP_DELAY);
    }, { passive: true });
    card.addEventListener('touchend', () => {
      stopTimer();
      clearTimeout(touchTimer);
    });

    // Click to flip (only if clicking the front)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.flip-front')) {
        stopTimer();
        doFlip(card);
      }
    });

  });
}

function doFlip(card) {
  card.classList.add('flipped');
  // hide ring after flip
  const ring = card.querySelector('.flip-timer-ring');
  if (ring) ring.style.opacity = '0';
}

function unflip(closeBtn) {
  const card = closeBtn.closest('.flip-wrap');
  card.classList.remove('flipped');
  const ring = card.querySelector('.flip-timer-ring circle.prog');
  ring.style.strokeDashoffset = CIRCUMFERENCE;
}

initFlipCards();

// ══════════════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════════════
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
(function animRing(){
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.flip-wrap').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ ring.style.transform='translate(-50%,-50%) scale(1.6)'; ring.style.opacity='0.7'; dot.style.transform='translate(-50%,-50%) scale(0.6)'; });
  el.addEventListener('mouseleave',()=>{ ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.opacity='0.5'; dot.style.transform='translate(-50%,-50%) scale(1)'; });
});

// ══════════════════════════════════════════════════
// PARTICLE CANVAS
// ══════════════════════════════════════════════════
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W,H;
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
resize();
window.addEventListener('resize',resize);
const particles = Array.from({length:80},()=>({
  x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
  vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
  r:Math.random()*2+.5, a:Math.random()*.5+.1
}));
(function animParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(26,92,255,${p.a})`; ctx.fill();
  });
  for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
    const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.hypot(dx,dy);
    if(d<120){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(26,92,255,${.12*(1-d/120)})`; ctx.lineWidth=.5; ctx.stroke(); }
  }
  requestAnimationFrame(animParticles);
})();

// ══════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════
window.addEventListener('scroll',()=> document.getElementById('mainNav').classList.toggle('scrolled',window.scrollY>30));
document.getElementById('hamburger').addEventListener('click',function(){ this.classList.toggle('open'); document.getElementById('mobileMenu').classList.toggle('open'); });
function closeMenu(){ document.getElementById('mobileMenu').classList.remove('open'); document.getElementById('hamburger').classList.remove('open'); }
document.addEventListener('click',e=>{ if(!e.target.closest('nav')&&!e.target.closest('.mobile-menu'))closeMenu(); });

// ══════════════════════════════════════════════════
// SCROLL FADE IN
// ══════════════════════════════════════════════════
const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:0.06});
document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));

// ══════════════════════════════════════════════════
// SMOOTH SCROLL
// ══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const href=this.getAttribute('href');
    if(href==='#'){window.scrollTo({top:0,behavior:'smooth'});e.preventDefault();return;}
    const t=document.querySelector(href);
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});closeMenu();}
  });
});

// ══════════════════════════════════════════════════
// NAV HIGHLIGHT
// ══════════════════════════════════════════════════
window.addEventListener('scroll',()=>{
  let cur='';
  document.querySelectorAll('section[id]').forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id;});
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const match=a.getAttribute('href')==='#'+cur;
    a.style.color=match?'var(--black)':''; a.style.fontWeight=match?'500':'';
  });
});

// ══════════════════════════════════════════════════
// FORM SUBMIT
// ══════════════════════════════════════════════════
function submitForm(){
  const fname=document.getElementById('fname').value.trim();
  const email=document.getElementById('email').value.trim();
  if(!fname||!email){alert('Please fill in at least your name and email address.');return;}
  const toast=document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4000);
  ['fname','lname','email','company','message'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('service').selectedIndex=0;
}

// ══════════════════════════════════════════════════
// HERO ENTRANCE
// ══════════════════════════════════════════════════
const h1=document.querySelector('.hero h1');
if(h1){ h1.style.opacity='0'; h1.style.transform='translateY(20px)'; setTimeout(()=>{ h1.style.transition='opacity 1s ease, transform 1s ease'; h1.style.opacity='1'; h1.style.transform='translateY(0)'; },200); }

// ══════════════════════════════════════════════════
// HERO VISUAL — COUNTER ANIMATION
// ══════════════════════════════════════════════════
(function() {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = Math.round(ease * target);
      if (elapsed < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.hv-metric-val');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        counters.forEach(c => animateCounter(c));
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });

  obs.observe(document.querySelector('.hero-visual'));
})();
