/**
 * AICTE Grievance Intelligence System
 * Globally Responsive Navigation & Glassmorphism Drawer Controller
 */
(function () {
  'use strict';

  function initSidebarController() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');
    const sidebar = document.getElementById('app-sidebar');

    if (!sidebar) return;

    const navLinks = sidebar.querySelectorAll('nav a');

    function isMobile() {
      return window.innerWidth < 1024;
    }

    function isDrawerOpen() {
      return document.body.classList.contains('sidebar-open');
    }

    function openDrawer() {
      if (!isMobile()) return;
      document.body.classList.add('sidebar-open');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
      sidebar.setAttribute('aria-modal', 'true');
      sidebar.setAttribute('aria-hidden', 'false');

      // Shift focus to close button or first interactive element inside drawer
      if (closeBtn && isElementVisible(closeBtn)) {
        closeBtn.focus();
      } else if (navLinks.length > 0) {
        navLinks[0].focus();
      }
    }

    function closeDrawer(restoreFocus = true) {
      if (!isDrawerOpen()) return;
      document.body.classList.remove('sidebar-open');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (restoreFocus && isElementVisible(toggleBtn)) {
          toggleBtn.focus();
        }
      }
      sidebar.removeAttribute('aria-modal');
      if (isMobile()) {
        sidebar.setAttribute('aria-hidden', 'true');
      } else {
        sidebar.setAttribute('aria-hidden', 'false');
      }
    }

    function isElementVisible(el) {
      return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    // Toggle button listener
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (isDrawerOpen()) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    // Close button listener
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      });
    }

    // Backdrop click listener
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
      });
    }

    // Nav links click listener: close drawer upon selection and allow navigation
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMobile()) {
          closeDrawer(false);
        }
      });
    });

    // Keyboard ESC listener
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isDrawerOpen()) {
        e.preventDefault();
        closeDrawer();
      }
    });

    // Auto-close on viewport resize to desktop
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!isMobile()) {
          if (isDrawerOpen()) {
            closeDrawer(false);
          }
          sidebar.setAttribute('aria-hidden', 'false');
        } else if (!isDrawerOpen()) {
          sidebar.setAttribute('aria-hidden', 'true');
        }
      }, 100);
    });

    // Set initial ARIA state
    if (isMobile()) {
      sidebar.setAttribute('aria-hidden', 'true');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      sidebar.setAttribute('aria-hidden', 'false');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarController);
  } else {
    initSidebarController();
  }
})();
