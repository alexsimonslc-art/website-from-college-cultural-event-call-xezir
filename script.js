/* fx:data-nav-spotlight */
document.querySelectorAll('[data-nav-spotlight]').forEach(function(nav){
  var links=nav.querySelectorAll('.nav-links a'); if(!links.length) return;
  var ind=document.createElement('div');ind.className='nav-ind';nav.appendChild(ind);
  function moveTo(el){if(!el)return;var nr=nav.getBoundingClientRect(),r=el.getBoundingClientRect();ind.style.left=(r.left-nr.left)+'px';ind.style.width=r.width+'px';}
  nav.addEventListener('mousemove',function(e){var r=nav.getBoundingClientRect();nav.style.setProperty('--nspx',(e.clientX-r.left)+'px');});
  links.forEach(function(a){a.addEventListener('mouseenter',function(){moveTo(a);});});
  nav.addEventListener('mouseleave',function(){nav.style.setProperty('--nspx','-999px');moveTo(nav.querySelector('a.active')||links[0]);});
  setTimeout(function(){moveTo(nav.querySelector('a.active')||links[0]);},80);
});

// Mobile Burger Toggling
document.querySelectorAll('[data-burger]').forEach(function(burger) {
  burger.addEventListener('click', function() {
    var navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.toggle('active');
      burger.classList.toggle('open');
    }
  });
});

// Countdown Timer logic
document.querySelectorAll('[data-countdown]').forEach(function(el) {
  var targetDate = new Date(el.getAttribute('data-countdown')).getTime();
  var daysEl = el.querySelector('[data-cd="days"]');
  var hoursEl = el.querySelector('[data-cd="hours"]');
  var minsEl = el.querySelector('[data-cd="mins"]');
  var secsEl = el.querySelector('[data-cd="secs"]');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    var now = new Date().getTime();
    var diff = targetDate - now;
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
});

// Starry background generator for [data-stars]
document.querySelectorAll('[data-stars]').forEach(function(container) {
  var starsCount = 50;
  for (var i = 0; i < starsCount; i++) {
    var star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = (Math.random() * 2 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.background = '#fff';
    star.style.borderRadius = '50%';
    star.style.opacity = Math.random() * 0.6 + 0.3;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '1';
    container.appendChild(star);
  }
});
