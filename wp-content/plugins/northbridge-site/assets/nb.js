(function(){
  if(/elementor-preview/.test(location.search)) return;
  var root=document.documentElement; root.classList.add('nb-js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init(){
    var h=document.querySelector('.site-header'), bar;
    if(h){ bar=document.createElement('span'); bar.className='nb-progress'; h.appendChild(bar); }
    var lastY=window.scrollY, mock=document.querySelector('.nb-mock'), ticking=false;
    function frame(){
      ticking=false; var y=window.scrollY, max=document.documentElement.scrollHeight-innerHeight;
      if(h){ h.classList.toggle('is-scrolled', y>8);
        var menuOpen=h.querySelector('.elementor-active');
        h.classList.toggle('is-hidden', !menuOpen && y>480 && y>lastY+2);
        if(y<lastY-2) h.classList.remove('is-hidden'); }
      if(bar) bar.style.setProperty('--p', max>0? Math.min(y/max,1):0);
      if(mock && !reduce){ var p=Math.min(Math.max(y/420,0),1); mock.style.setProperty('--tilt',(12*(1-p)).toFixed(2)+'deg'); mock.style.setProperty('--sc',(0.94+0.06*p).toFixed(3)); }
      lastY=y;
    }
    function onS(){ if(!ticking){ ticking=true; requestAnimationFrame(frame);} }
    frame(); window.addEventListener('scroll',onS,{passive:true});
    /* scroll reveal */
    var sel='.nb-sec:not(.nb-hero):not(.nb-phero) .e-con-inner > .elementor-widget, .nb-sec .e-con > .elementor-widget, .nb-card, .nb-step, .nb-plan, .nb-feat, .nb-indt, .nb-tier, .nb-faq details, .nb-ci, .nb-box';
    var els=reduce?[]:[].slice.call(document.querySelectorAll(sel)).filter(function(el){ return !el.closest('.nb-hero') && !el.closest('.nb-phero') && !el.closest('.site-header'); });
    els.forEach(function(el){
      var p=el.parentElement, sib=[].filter.call(p.children,function(c){return els.indexOf(c)>-1;});
      el.style.setProperty('--d', Math.min(sib.indexOf(el),6)*90+'ms'); el.classList.add('nb-rv');
      el.addEventListener('transitionend',function f(e){ if(e.target!==el||e.propertyName!=='transform')return; el.classList.remove('nb-rv','is-in'); el.style.removeProperty('--d'); el.removeEventListener('transitionend',f); });
    });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -6% 0px',threshold:0.06});
      els.forEach(function(e){ io.observe(e); });
    } else els.forEach(function(e){ e.classList.add('is-in'); });
    /* count-up numbers in the mockup */
    if(!reduce) [].forEach.call(document.querySelectorAll('.nb-kpis b'),function(b){
      var t=b.textContent, n=parseFloat(t.replace(/[^0-9.]/g,'')); if(!n) return; var s=performance.now();
      (function step(now){ var k=Math.min((now-s)/1400,1), e=1-Math.pow(1-k,4); b.textContent='$'+Math.round(n*e).toLocaleString('en-US'); if(k<1) requestAnimationFrame(step); else b.textContent=t; })(s);
    });
    /* smooth FAQ open/close */
    [].forEach.call(document.querySelectorAll('.nb-faq details'),function(d){
      var sum=d.querySelector('summary'), body=d.querySelector('p'), anim=null; if(!sum||!body) return;
      sum.addEventListener('click',function(ev){
        if(reduce) return; ev.preventDefault(); if(anim) anim.cancel();
        var closedH=sum.offsetHeight, opening=!d.open;
        if(opening) d.open=true;
        var fullH=d.scrollHeight;
        var ease='cubic-bezier(.16,1,.3,1)';
        anim=d.animate({height:opening?[closedH+'px',fullH+'px']:[d.offsetHeight+'px',closedH+'px']},{duration:opening?460:340,easing:ease});
        body.animate({opacity:opening?[0,1]:[1,0],transform:opening?['translateY(-6px)','none']:['none','translateY(-6px)']},{duration:opening?420:200,easing:'ease'});
        anim.onfinish=function(){ if(!opening) d.open=false; anim=null; };
      });
    });
    /* close mobile menu on link tap */
    [].forEach.call(document.querySelectorAll('.site-navigation-dropdown a'),function(a){ a.addEventListener('click',function(){ var t=document.querySelector('.site-navigation-toggle'); var hold=document.querySelector('.site-navigation-toggle-holder'); if(hold&&hold.classList.contains('elementor-active')&&t) t.click(); }); });
    /* page-leave fade for browsers without cross-document view transitions */
    if(!('onpagereveal' in window) && !reduce){
      document.addEventListener('click',function(e){
        var a=e.target.closest('a'); if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0) return;
        if(a.target&&a.target!=='_self') return; if(a.closest('#wpadminbar')) return;
        var url; try{ url=new URL(a.href,location.href);}catch(x){return;}
        if(url.origin!==location.origin||url.protocol.indexOf('http')!==0) return;
        if(url.pathname===location.pathname && url.hash) return;
        e.preventDefault(); root.classList.add('nb-leaving'); setTimeout(function(){ location.href=url.href; },260);
      });
      window.addEventListener('pageshow',function(ev){ if(ev.persisted) root.classList.remove('nb-leaving'); });
    }
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();
