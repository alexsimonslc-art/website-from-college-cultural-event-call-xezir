// Combat 2026 Interactive Suite & Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Mobile Burger Toggle
  const burger = document.querySelector('[data-burger]');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      burger.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove('open');
        navLinks.classList.remove('active');
      }
    });

    // Close menu when selecting a navigation link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  // Spotlight navigation effect and active link indicator
  const spotlightNav = document.querySelector('[data-nav-spotlight]');
  if (spotlightNav) {
    // Underline Indicator creation
    const links = spotlightNav.querySelectorAll('.nav-links a');
    let indicator = spotlightNav.querySelector('.nav-ind');
    if (!indicator && links.length > 0) {
      indicator = document.createElement('div');
      indicator.className = 'nav-ind';
      spotlightNav.appendChild(indicator);
    }

    function updateIndicator(el) {
      if (!indicator || !el) return;
      const rect = el.getBoundingClientRect();
      const navRect = spotlightNav.getBoundingClientRect();
      indicator.style.width = `${rect.width}px`;
      indicator.style.left = `${rect.left - navRect.left}px`;
      indicator.style.opacity = '1';
    }

    const activeLink = spotlightNav.querySelector('.nav-links a.active');
    if (activeLink) {
      setTimeout(() => updateIndicator(activeLink), 150);
    }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => updateIndicator(link));
    });

    spotlightNav.addEventListener('mouseleave', () => {
      const currentActive = spotlightNav.querySelector('.nav-links a.active');
      if (currentActive) {
        updateIndicator(currentActive);
      } else if (indicator) {
        indicator.style.opacity = '0';
      }
    });

    // Cursor spotlight glow position update
    spotlightNav.addEventListener('mousemove', (e) => {
      const rect = spotlightNav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      spotlightNav.style.setProperty('--nspx', `${x}px`);
    });

    window.addEventListener('resize', () => {
      const currentActive = spotlightNav.querySelector('.nav-links a.active');
      if (currentActive) updateIndicator(currentActive);
    });
  }

  // Countdown clock module
  const countdownEl = document.querySelector('[data-countdown]');
  if (countdownEl) {
    const targetDate = new Date(countdownEl.dataset.countdown).getTime();
    
    function updateCountdown() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<div class="cd-unit" style="width:100%"><span style="font-size:1.8rem">THE COMBAT HAS BEGUN!</span></div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = countdownEl.querySelector('[data-cd="days"]');
      const hoursEl = countdownEl.querySelector('[data-cd="hours"]');
      const minsEl = countdownEl.querySelector('[data-cd="mins"]');
      const secsEl = countdownEl.querySelector('[data-cd="secs"]');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Starfield & shooting stars canvas backdrop
  const starsContainer = document.querySelector('[data-stars]');
  if (starsContainer) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    starsContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = starsContainer.offsetWidth;
    let height = canvas.height = starsContainer.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = starsContainer.offsetWidth;
      height = canvas.height = starsContainer.offsetHeight;
    });

    const stars = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
      speed: 0.01 + Math.random() * 0.015
    }));

    const meteors = [];

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Render starry night
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn meteors dynamically
      if (Math.random() < 0.01 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * width,
          y: -20,
          len: 30 + Math.random() * 40,
          speed: 6 + Math.random() * 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.1
        });
      }

      // Draw and clean meteors
      meteors.forEach((m, idx) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        ctx.strokeStyle = 'rgba(255, 106, 61, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.stroke();

        if (m.y > height + 100 || m.x < -100 || m.x > width + 100) {
          meteors.splice(idx, 1);
        }
      });

      requestAnimationFrame(draw);
    }
    draw();
  }
});
