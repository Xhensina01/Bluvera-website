/* BluVera shared script: cookie consent + GA4, image warm-cache, certificate lightbox */
(function(){
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var GA_ID = 'G-XXXXXXXXXX';   /* <- replace with your GA4 Measurement ID */
  function loadGA(){
    if(!GA_ID || GA_ID.indexOf('XXXX') !== -1 || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID);
  }
  var banner = document.getElementById('cookieBanner');
  if(banner){
    var stored; try{ stored = localStorage.getItem('bluvera-cookie-consent'); }catch(e){ stored = null; }
    if(!stored){ banner.classList.remove('hidden'); }
    if(stored === 'accepted'){ loadGA(); }
    function setConsent(v){ try{ localStorage.setItem('bluvera-cookie-consent', v); }catch(e){} banner.classList.add('hidden'); }
    document.getElementById('cookieAccept').addEventListener('click', function(){ setConsent('accepted'); loadGA(); });
    document.getElementById('cookieDecline').addEventListener('click', function(){ setConsent('declined'); });
  }
  /* Warm the cache for the shared hero/banner images so the next page opens instantly */
  function warm(){
    ['bluvera-bg-pump.jpg','bluvera-bg-label.jpg','bluvera-bg-poster.jpg'].forEach(function(u){ var im = new Image(); im.decoding='async'; im.src = ROOT + u; });
  }
  function start(){ (window.requestIdleCallback || function(f){ setTimeout(f, 400); })(warm); }
  if(document.readyState === 'complete') start(); else window.addEventListener('load', start);
  /* Hero slideshow: crossfade every 5 seconds */
  var slides = document.querySelectorAll('.hero-slides .slide'), dots = document.querySelectorAll('.hero-dots button');
  if(slides.length > 1){
    var cur = 0, timer = null;
    var show = function(n){ cur = (n + slides.length) % slides.length; slides.forEach(function(s,i){ s.classList.toggle('active', i === cur); }); dots.forEach(function(d,i){ d.classList.toggle('active', i === cur); }); };
    var start = function(){ if(timer || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return; timer = setInterval(function(){ show(cur + 1); }, 5000); };
    var stop = function(){ clearInterval(timer); timer = null; };
    dots.forEach(function(d,i){ d.addEventListener('click', function(){ stop(); show(i); start(); }); });
    document.addEventListener('visibilitychange', function(){ if(document.hidden) stop(); else start(); });
    slides.forEach(function(s){ var m = /url\(['"]?([^'")]+)['"]?\)/.exec(s.getAttribute('style') || ''); if(m){ var im = new Image(); im.src = ROOT + m[1]; } });
    start();
  }
  /* Mobile menu */
  var hdr = document.querySelector('header'), mbtn = document.querySelector('.menu-btn');
  if(hdr && mbtn){
    var setMenu = function(o){ hdr.classList.toggle('open', o); mbtn.setAttribute('aria-expanded', o ? 'true' : 'false'); };
    mbtn.addEventListener('click', function(e){ e.stopPropagation(); setMenu(!hdr.classList.contains('open')); });
    document.addEventListener('click', function(e){ if(!hdr.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function(){ if(window.innerWidth > 900) setMenu(false); });
  }
  /* Certificate lightbox (Quality page) */
  var lb = document.getElementById('coaLightbox');
  if(lb){
    var open = function(){ lb.classList.add('open'); document.body.style.overflow='hidden'; };
    var close = function(){ lb.classList.remove('open'); document.body.style.overflow=''; };
    ['coaOpen','coaOpen2'].forEach(function(id){ var el=document.getElementById(id); if(el) el.addEventListener('click', open); });
    document.getElementById('coaClose').addEventListener('click', close);
    lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  }
  /* Gallery lightbox */
  var gl = [].slice.call(document.querySelectorAll('.g-link'));
  if(gl.length){
    var box = document.createElement('div'); box.className = 'g-lb';
    box.innerHTML = '<button class="g-x" aria-label="Close">&times;</button><button class="g-p" aria-label="Previous">&#8249;</button><img alt=""><button class="g-n" aria-label="Next">&#8250;</button>';
    document.body.appendChild(box);
    var gi = 0, gimg = box.querySelector('img');
    var gshow = function(i){ gi = (i + gl.length) % gl.length; gimg.src = gl[gi].getAttribute('href'); gimg.alt = (gl[gi].querySelector('img') || {}).alt || ''; };
    var gopen = function(i){ gshow(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; };
    var gclose = function(){ box.classList.remove('open'); document.body.style.overflow = ''; };
    gl.forEach(function(a,i){ a.addEventListener('click', function(e){ e.preventDefault(); gopen(i); }); });
    box.querySelector('.g-x').addEventListener('click', gclose);
    box.querySelector('.g-p').addEventListener('click', function(){ gshow(gi - 1); });
    box.querySelector('.g-n').addEventListener('click', function(){ gshow(gi + 1); });
    box.addEventListener('click', function(e){ if(e.target === box) gclose(); });
    document.addEventListener('keydown', function(e){ if(!box.classList.contains('open')) return; if(e.key === 'Escape') gclose(); if(e.key === 'ArrowLeft') gshow(gi - 1); if(e.key === 'ArrowRight') gshow(gi + 1); });
  }
})();
