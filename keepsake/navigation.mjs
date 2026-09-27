const nav=document.querySelector('.site-nav--home');
const mobileToggle=document.querySelector('.site-nav__toggle');
const moreToggle=document.querySelector('#littora-more-toggle');
const morePanel=document.querySelector('#littora-more-menu');
const moreGroup=moreToggle?.closest('.home-more');

if(nav&&mobileToggle&&moreToggle&&morePanel){
  const moreOpen=()=>moreToggle.getAttribute('aria-expanded')==='true';
  const mobileOpen=()=>mobileToggle.getAttribute('aria-expanded')==='true';
  const setMore=open=>{
    moreToggle.setAttribute('aria-expanded',String(open));
    morePanel.hidden=!open;
  };
  const setMobile=open=>{
    mobileToggle.setAttribute('aria-expanded',String(open));
    if(!open)setMore(false);
  };
  mobileToggle.addEventListener('click',()=>setMobile(!mobileOpen()));
  moreToggle.addEventListener('click',()=>setMore(!moreOpen()));
  moreToggle.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'){
      event.preventDefault();
      setMore(true);
      morePanel.querySelector('a')?.focus();
    }
  });
  moreGroup.addEventListener('focusout',event=>{
    if(!moreGroup.contains(event.relatedTarget))setMore(false);
  });
  nav.addEventListener('click',event=>{
    if(event.target.closest('a[href]'))setMobile(false);
  });
  document.addEventListener('click',event=>{
    if(!moreGroup.contains(event.target))setMore(false);
    if(!nav.contains(event.target)&&!mobileToggle.contains(event.target))setMobile(false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(moreOpen()){
      setMore(false);
      moreToggle.focus();
    }else if(mobileOpen()){
      setMobile(false);
      mobileToggle.focus();
    }
  });
  const desktop=matchMedia('(min-width:641px)');
  desktop.addEventListener('change',()=>setMobile(false));
  window.addEventListener('pagehide',()=>setMobile(false));
}
