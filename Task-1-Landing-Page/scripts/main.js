/* ==========================================================================
   NEXORA — Mobile navigation
   Accessible, keyboard-friendly mobile menu with ARIA attributes,
   focus management, focus trapping, and resize handling.
   ========================================================================== */
(function () {
  'use strict';

  var toggle = document.querySelector('.mobile-menu-toggle');
  var nav = document.querySelector('.mobile-nav');
  var closeBtn = document.querySelector('.mobile-nav-close');
  var links = nav ? nav.querySelectorAll('a') : [];
  var focusableSelectors = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
  var previousFocus = null;

  if (!toggle || !nav) {
    return;
  }

  function getFocusableElements() {
    return Array.from(nav.querySelectorAll(focusableSelectors)).filter(function (el) {
      return !el.hasAttribute('disabled') && el.offsetParent !== null;
    });
  }

  function trapFocus(event) {
    if (!nav.classList.contains('open')) {
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    var focusable = getFocusableElements();
    if (focusable.length === 0) {
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first || document.activeElement === toggle) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function setOpen(open) {
    if (open) {
      previousFocus = document.activeElement;
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      document.body.classList.add('no-scroll');

      // Move focus into the menu
      var focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        closeBtn.focus();
      }
    } else {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('no-scroll');

      // Restore focus to the element that opened the menu
      if (previousFocus) {
        previousFocus.focus();
      } else {
        toggle.focus();
      }
      previousFocus = null;
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  closeBtn.addEventListener('click', function () {
    setOpen(false);
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
    trapFocus(event);
  });

  // Close the menu and restore scroll when crossing into the desktop breakpoint
  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 768px)').matches && nav.classList.contains('open')) {
      setOpen(false);
    }
  });
})();