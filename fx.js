(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;

  var nav=document.getElementById('nav');
  if(nav){var f=function(){nav.classList.toggle('scrolled',window.scrollY>50)};addEventListener('scroll',f,{passive:true});f();}

  /* back button: go to the previous page if it was on this site, otherwise to the project list */
  var back=document.querySelector('.back-fab');
  if(back){back.addEventListener('click',function(e){
    try{if(document.referrer&&new URL(document.referrer).origin===location.origin&&history.length>1){e.preventDefault();history.back()}}catch(_){}
  })}

  var rev=document.querySelectorAll('.reveal');
  if(rev.length){
    if(reduce||!('IntersectionObserver' in window)){rev.forEach(function(e){e.classList.add('visible')})}
    else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});rev.forEach(function(e){io.observe(e)})}
  }

  /* cursor, ring, glow and click burst: mouse devices only */
  if(fine&&!reduce){
    var mk=function(c){var d=document.createElement('div');d.className=c;d.setAttribute('aria-hidden','true');document.body.appendChild(d);return d};
    var cur=mk('cursor'),ring=mk('cursor-ring'),orb=mk('glow-orb'),burst=mk('glow-burst');
    document.body.classList.add('fx-cursor');
    var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,gx=mx,gy=my,ts=1,cs=1;
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;cur.style.transform='translate('+(mx-5)+'px,'+(my-5)+'px)'});
    (function tick(){
      rx+=(mx-rx)*.16;ry+=(my-ry)*.16;gx+=(mx-gx)*.05;gy+=(my-gy)*.05;cs+=(ts-cs)*.1;
      ring.style.transform='translate('+(rx-18)+'px,'+(ry-18)+'px)';
      orb.style.transform='translate('+gx+'px,'+gy+'px) scale('+cs+')';
      requestAnimationFrame(tick);
    })();
    addEventListener('pointerdown',function(e){
      burst.style.left=e.clientX+'px';burst.style.top=e.clientY+'px';
      burst.classList.remove('go');void burst.offsetWidth;burst.classList.add('go');
      ts=1.45;setTimeout(function(){ts=1},220);
    });
    document.addEventListener('pointerover',function(e){ring.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,.card')))});
  }

  /* particle sphere (home page only) */
  var cv=document.getElementById('sphere');
  if(cv){
    var ctx=cv.getContext('2d'),W,H,dpr=Math.min(window.devicePixelRatio||1,1.5);
    var N=innerWidth<768?900:1500,P=[];
    for(var i=0;i<N;i++){var phi=Math.acos(-1+2*i/N);P.push({phi:phi,theta:Math.sqrt(N*Math.PI)*phi})}
    var rx2=0,ry2=0,running=true;
    var size=function(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
    addEventListener('resize',size);size();
    var draw=function(){
      ctx.clearRect(0,0,W,H);
      var t=reduce?1:Date.now()*.0012;
      if(!reduce){rx2+=.0015;ry2+=.0025}
      var cx=W/2,cy=H/2,R=Math.min(W,H)*.38,stack=[];
      var cY=Math.cos(ry2),sY=Math.sin(ry2),cX=Math.cos(rx2),sX=Math.sin(rx2),fov=Math.max(W,H)*.9;
      for(var k=0;k<P.length;k++){
        var p=P[k];
        var w1=Math.sin(p.theta*4+t*1.8)*Math.cos(p.phi*3+t*1.4),w2=Math.sin(p.theta*8-t*2.2)*.35,w3=Math.cos(p.phi*6+t*1.1)*.25;
        var def=(w1+w2+w3)*R*.16,cr=R+def;
        var x=cr*Math.sin(p.phi)*Math.cos(p.theta),y=cr*Math.sin(p.phi)*Math.sin(p.theta),z=cr*Math.cos(p.phi);
        var x1=x*cY-z*sY,z1=x*sY+z*cY,y2=y*cX-z1*sX,z2=y*sX+z1*cX;
        var per=fov/(fov+z2),sx=x1*per+cx,sy=y2*per+cy;
        var m=Math.max(0,Math.min(1,((y2/cr+1)/2)*.4+((def+R*.16)/(R*.32))*.6));
        var r=Math.floor(160*(1-m)),g=Math.floor(40*(1-m)+240*m),b=255;
        var a=Math.max(.1,(z2+R*1.5)/(R*3))*per*.8,s=Math.max(.5,(z2+R*1.5)/R)*1.2;
        stack.push({x:sx,y:sy,z:z2,s:s,c:'rgba('+r+','+g+','+b+','+a+')'});
      }
      stack.sort(function(a,b){return b.z-a.z});
      for(var j=0;j<stack.length;j++){var q=stack[j];ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.s,0,6.2832);ctx.fill()}
      if(!reduce&&running)requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange',function(){running=!document.hidden;if(running&&!reduce)requestAnimationFrame(draw)});
    draw();
  }
})();
