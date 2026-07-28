document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Dropdown Toggle
  const burger = document.querySelector('[data-burger]');
  const navLinks = document.querySelector('.nav-links');
  
  if (burger && navLinks) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = burger.classList.contains('open');
      if (isOpen) {
        burger.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        burger.classList.add('open');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling when full menu open
      }
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Countdown Clock Timer
  const countdownEl = document.querySelector('[data-countdown]');
  if (countdownEl) {
    const targetDateStr = countdownEl.getAttribute('data-countdown');
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<div class="cd-unit" style="min-width: 100%"><span style="font-size:2rem;color:var(--accent)">THE ARENA IS OPEN!</span></div>';
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
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // Header Nav Hover Spotlight & Underline indicator
  const spotlightNav = document.querySelector('[data-nav-spotlight]');
  if (spotlightNav) {
    const links = spotlightNav.querySelectorAll('.nav-links a');
    const activeLink = spotlightNav.querySelector('.nav-links a.active');
    
    // Create and append the dynamic underline indicator if it doesn't exist
    let ind = spotlightNav.querySelector('.nav-ind');
    if (!ind) {
      ind = document.createElement('div');
      ind.className = 'nav-ind';
      spotlightNav.appendChild(ind);
    }

    const setIndicator = (el) => {
      if (el && window.innerWidth > 992) {
        const rect = el.getBoundingClientRect();
        const navRect = spotlightNav.getBoundingClientRect();
        ind.style.left = (rect.left - navRect.left) + 'px';
        ind.style.width = rect.width + 'px';
        ind.style.opacity = '1';
      } else {
        ind.style.opacity = '0';
      }
    };

    // Initial position
    if (activeLink) {
      setTimeout(() => setIndicator(activeLink), 150);
    }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => setIndicator(link));
    });

    spotlightNav.addEventListener('mouseleave', () => {
      if (activeLink) {
        setIndicator(activeLink);
      } else {
        ind.style.opacity = '0';
      }
    });

    // Spotlight cursor follow light effect
    spotlightNav.addEventListener('mousemove', (e) => {
      const rect = spotlightNav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      spotlightNav.style.setProperty('--nspx', `${x}px`);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 992) {
        ind.style.opacity = '0';
      } else if (activeLink) {
        setIndicator(activeLink);
      }
    });
  }

  // Starry Canvas Dynamic Background Effect (Optimized)
  const starContainers = document.querySelectorAll('[data-stars]');
  starContainers.forEach(container => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    container.style.position = 'relative';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = container.offsetWidth;
    let height = canvas.height = container.offsetHeight;

    // Create stars with depth layers
    const stars = [];
    const count = Math.min(Math.floor((width * height) / 9000), 100);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        d: Math.random() * 360,
        speed: Math.random() * 0.05 + 0.02,
        twinkle: Math.random() * 0.5 + 0.5,
        depth: Math.random() * 35 + 10 // layered 3D depth factor
      });
    }

    // Hover 3D coordinate tracking
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      // Calculate cursor deviation from center of container (from -0.5 to 0.5)
      targetMouseX = ((e.clientX - rect.left) / width) - 0.5;
      targetMouseY = ((e.clientY - rect.top) / height) - 0.5;
    });

    container.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });

    // Meteors
    const meteors = [];
    const isMeteorEnabled = container.classList.contains('fx-meteors');

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smoothly ease mouse offsets
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;
      
      // Draw stars with hovering 3D parallax offsets
      stars.forEach(s => {
        s.twinkle += s.speed;
        const opacity = Math.abs(Math.sin(s.twinkle));
        
        // Apply 3D parallax displacement relative to depth
        const drawX = s.x + (mouseX * s.depth);
        const drawY = s.y + (mouseY * s.depth);

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update meteors
      if (isMeteorEnabled) {
        if (Math.random() < 0.015 && meteors.length < 3) {
          meteors.push({
            x: Math.random() * width * 1.2 - width * 0.2,
            y: 0,
            len: Math.random() * 80 + 40,
            speed: Math.random() * 4 + 4,
            angle: Math.PI / 4, // 45 degrees fall
            opacity: 1
          });
        }

        meteors.forEach((m, idx) => {
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.opacity -= 0.015;

          if (m.opacity <= 0 || m.x > width || m.y > height) {
            meteors.splice(idx, 1);
            return;
          }

          const grad = ctx.createLinearGradient(
            m.x, m.y, 
            m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len
          );
          grad.addColorStop(0, `rgba(255, 106, 61, ${m.opacity})`);
          grad.addColorStop(0.3, `rgba(192, 38, 211, ${m.opacity * 0.5})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
          ctx.stroke();
        });
      }

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    });
  });
});
