// ===================================================================
// ABDUL RAUF PORTFOLIO — interactions & scroll-triggered animations
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-photo-col, .about-content-col, .mv-card, .view-work-row, ' +
    '.exp-card, .edu-card, .proj-card, .skill-cat, .cert-card, .achv-card, ' +
    '.contact-form-col, .contact-info-col'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  // Random subtle rotation for certification cards (cards-on-a-table feel)
  document.querySelectorAll('.cert-card').forEach(card => {
    const rot = (Math.random() * 4 - 2).toFixed(2);
    card.style.setProperty('--rot', rot + 'deg');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Trigger skill bars when their category card becomes visible
        if (entry.target.classList.contains('skill-cat')) {
          animateBars(entry.target);
        }
        // Trigger stat counters when achievements section is visible
        if (entry.target.id === 'statRow') {
          animateCounters();
        }

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => io.observe(el));
  document.querySelectorAll('.skill-cat').forEach(el => io.observe(el));

  /* ---------- Skill progress bars ---------- */
  function animateBars(categoryEl) {
    const rows = categoryEl.querySelectorAll('.skill-bar-row');
    rows.forEach((row, i) => {
      const pct = parseInt(row.getAttribute('data-pct'), 10) || 0;
      const fill = row.querySelector('.bar-fill');
      const label = row.querySelector('.bar-pct');
      setTimeout(() => {
        if (fill) fill.style.width = pct + '%';
        if (label) animateCount(label, pct, 1000);
      }, i * 90);
    });
  }

  function animateCount(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const val = Math.round(eased * target);
      el.textContent = val + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Stat counters (Achievements section) ---------- */
  const statRow = document.querySelector('.stat-row');
  if (statRow) {
    statRow.id = 'statRow';
    io.observe(statRow);
  }

  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const start = performance.now();
      const duration = 1200;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Mouse-follow tilt on certification cards ---------- */
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotate(0deg) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Contact form: mailto handoff + pulse ---------- */
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  // Gentle one-time pulse once the form has rendered in view
  const contactSection = document.getElementById('contact');
  if (contactSection && sendBtn) {
    const pulseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => sendBtn.classList.add('pulse-once'), 500);
          pulseObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    pulseObserver.observe(contactSection);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fname').value.trim();
      const email = document.getElementById('femail').value.trim();
      const subject = document.getElementById('fsubject').value.trim();
      const message = document.getElementById('fmessage').value.trim();

      const mailSubject = encodeURIComponent(subject || `Portfolio inquiry from ${name}`);
      const mailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:ar4638@rit.edu?subject=${mailSubject}&body=${mailBody}`;

      // Clear the form after handing off to the email client
      setTimeout(() => {
        form.reset();
      }, 300);
    });
  }

});
