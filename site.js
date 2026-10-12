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
})();
