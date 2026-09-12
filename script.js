(function () {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const current = window.scrollY;
    if (current > 24) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
    if (current > lastScroll && current > 120) nav.classList.add('nav-hidden');
    else nav.classList.remove('nav-hidden');
    lastScroll = current;
  }, { passive: true });

  const revealItems = document.querySelectorAll('.section-kicker, .two-col, .quote-card, .method-card, .benchmark-intro, .benchmark-visual, .track-grid, .results-head, .metric-card, .results-table-wrap, .case-grid, .resource-card, .editable-note');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(function (item) { item.classList.add('observe'); observer.observe(item); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.setAttribute('tabindex', '-1');
    });
  });
})();
