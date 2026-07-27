/* fx:data-nav-spotlight */
  document.querySelectorAll('[data-nav-spotlight]').forEach(function(nav){
    var links=nav.querySelectorAll('a'); if(!links.length)return;
    var ind=document.createElement('div');ind.className='nav-ind';nav.appendChild(ind);
    function moveTo(el){if(!el)return;var nr=nav.getBoundingClientRect(),r=el.getBoundingClientRect();ind.style.left=(r.left-nr.left)+'px';ind.style.width=r.width+'px';}
    nav.addEventListener('mousemove',function(e){var r=nav.getBoundingClientRect();nav.style.setProperty('--nspx',(e.clientX-r.left)+'px');});
    links.forEach(function(a){a.addEventListener('mouseenter',function(){moveTo(a);});});
    nav.addEventListener('mouseleave',function(){nav.style.setProperty('--nspx','-999px');moveTo(nav.querySelector('a.active')||links[0]);});
    setTimeout(function(){moveTo(nav.querySelector('a.active')||links[0]);},80);
  });
