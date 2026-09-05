'use strict';

(() => {
  const menu = document.getElementById('menu-dialog');
  const booking = document.getElementById('booking-dialog');
  const menuToggle = document.querySelector('.menu-toggle');
  const openDialog = dialog => {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    if (dialog === menu) menuToggle.setAttribute('aria-expanded', 'true');
  };

  menuToggle.addEventListener('click', () => openDialog(menu));
  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.close).close());
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
      if (dialog === menu) menuToggle.setAttribute('aria-expanded', 'false');
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.close();
      const section = document.getElementById(link.hash.slice(1));
      if (section) {
        section.setAttribute('tabindex', '-1');
        section.focus({preventScroll:true});
        section.addEventListener('blur', () => section.removeAttribute('tabindex'), {once:true});
      }
    });
  });

  const configuredBookingUrl = String(window.NUNA_CONFIG?.bookingUrl || '').trim();
  let bookingUrl = null;
  if (configuredBookingUrl) {
    try {
      const url = new URL(configuredBookingUrl);
      if (url.protocol === 'https:' && !url.username && !url.password) bookingUrl = url.href;
    } catch { /* An unset or invalid address keeps the honest availability notice. */ }
  }
  document.querySelectorAll('[data-booking]').forEach(button => {
    button.addEventListener('click', () => {
      if (bookingUrl) window.location.assign(bookingUrl);
      else openDialog(booking);
    });
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
