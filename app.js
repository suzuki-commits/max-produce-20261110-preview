'use strict';

(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileQuery = window.matchMedia('(max-width: 900px)');

  const closeMenu = (restoreFocus = false) => {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'メニューを開く');
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle.hidden = false;
  closeMenu();
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
  });
  mobileNav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header') && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  mobileQuery.addEventListener('change', () => closeMenu());

  // Native details remain available even if JavaScript is unavailable.
  const openService = (id) => {
    const details = document.getElementById(id);
    if (details instanceof HTMLDetailsElement) details.open = true;
  };
  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => openService(link.dataset.service));
  });
  window.addEventListener('hashchange', () => openService(location.hash.slice(1)));
  openService(location.hash.slice(1));

  const dialog = document.getElementById('contact-dialog');
  const form = document.getElementById('contact-form');
  const topic = document.getElementById('contact-topic');
  const status = document.getElementById('form-status');
  let dialogOpener = null;

  document.querySelectorAll('[data-contact]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      closeMenu();
      dialogOpener = link;
      form.reset();
      status.textContent = '';
      if (link.dataset.topic) topic.value = link.dataset.topic;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      topic.focus();
    });
  });

  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    form.reset();
    status.textContent = '';
    if (dialogOpener) dialogOpener.focus({ preventScroll: true });
  });

  const confirmPreview = () => {
    if (!form.reportValidity()) return;
    status.textContent = '入力内容を確認しました。これはプレビューのため、送信・保存は行っていません。';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    confirmPreview();
  });
  document.querySelector('.form-confirm').addEventListener('click', confirmPreview);
  form.addEventListener('input', () => { status.textContent = ''; });
  // No network requests, analytics, storage, or logging of form values.

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }
})();
