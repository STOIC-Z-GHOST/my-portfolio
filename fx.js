(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.getElementById('nav');
  if(nav){
    var f=function(){nav.classList.toggle('scrolled',window.scrollY>50)};
    addEventListener('scroll',f,{passive:true});f();
    var mb=nav.querySelector('.menu-btn');
    if(mb){
      mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
      nav.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')})});
    }
  }
  /* back button: previous page if it was on this site, otherwise the project list */
  var back=document.querySelector('.back-fab');
  if(back){back.addEventListener('click',function(e){
    try{if(document.referrer&&new URL(document.referrer).origin===location.origin&&history.length>1){e.preventDefault();history.back()}}catch(_){}
  })}
  var rev=document.querySelectorAll('.reveal');
  if(rev.length){
    if(reduce||!('IntersectionObserver' in window)){rev.forEach(function(e){e.classList.add('visible')})}
    else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});rev.forEach(function(e){io.observe(e)})}
  }
})();
