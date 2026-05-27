      if (window.lucide) {
        lucide.createIcons();
      }

      // Banner navigation

      // const slides = document.querySelectorAll('.banner-slide');
      // const dots = document.querySelectorAll('.banner-dot');
      // let currentSlide = 0;
      // let autoSlideTimer;

      // // Fnctions
      // function goToSlide(index) {
      //   slides[currentSlide].classList.remove('opacity-100');
      //   slides[currentSlide].classList.add('opacity-0');
      //   dots[currentSlides].classList.remove('opacity-100');
      //   dots[currentSlide].classList.add('opacity-40'); 
      
      //   currentSlide = (index + slides.length) % slides.length;
      
      //   slides[currentSlide].classList.remove('opacity-0');
      //   slides[currentSlide].classList.add('opacity-100');
      //   dots[currentSlide].classList.remove('opacity-40');
      //   dots[currentSlide].classList.add('opacity-100');
      // }

      // function startAutoSlide(){
      //   autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
      // }

      // function resetAutoSlide(){
      //   clearInterval(autoSliderTimer);
      //   startAutoSlide();
      // }

      // document.getElementById('banner').addEventListener('mouseenter', () => {  
      //   goToSlide(currentSlide - 1);
      //   resetAutoSlide();
      // });

      // document.getElementById('banner').addEventListener('click', () => {
      //   goToSlide(currentSlide + 1);
      //   resrtAutoSlide();
      // });

      // dots.forEach((dot, index) => {
      //   dot.addEventListener('click', () => {
      //     goToSlide(index);
      //     resetAutoSlide();
      //   });
      // });

      // startAutoSlide();


      // Header navigation
      (function () {
        const header = document.querySelector('.sticky-header');
        if (!header) return;

        const desktopDropdowns = Array.from(header.querySelectorAll('nav > ul > .nav-dropdown'));
        const desktopNavLinks = Array.from(header.querySelectorAll('nav .nav-link'));
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');

        const getPrimaryTrigger = dropdown =>
          Array.from(dropdown.children).find(child => child.classList.contains('nav-dropdown-trigger'));

        const closeDesktopDropdowns = (except = null) => {
          desktopDropdowns.forEach(dropdown => {
            if (dropdown === except) return;
            dropdown.classList.remove('open');
            if (dropdown.contains(document.activeElement)) {
              document.activeElement.blur();
            }
            const trigger = getPrimaryTrigger(dropdown);
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          });
        };

        desktopDropdowns.forEach(dropdown => {
          const button = getPrimaryTrigger(dropdown);
          if (!button) return;

          dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) closeDesktopDropdowns(dropdown);
          });

          dropdown.addEventListener('focusin', () => {
            if (window.innerWidth >= 1024) closeDesktopDropdowns(dropdown);
          });

          button.addEventListener('click', event => {
            if (window.innerWidth < 1024) return;
            event.preventDefault();

            const willOpen = !dropdown.classList.contains('open');
            closeDesktopDropdowns(dropdown);
            dropdown.classList.toggle('open', willOpen);
            button.setAttribute('aria-expanded', String(willOpen));
          });
        });

        desktopNavLinks.forEach(link => {
          link.addEventListener('mouseenter', () => closeDesktopDropdowns());
          link.addEventListener('focusin', () => closeDesktopDropdowns());
          link.addEventListener('click', () => closeDesktopDropdowns());
        });

        const setMobileNestedState = (dropdown, open) => {
          const trigger = dropdown.querySelector('.mobile-nested-trigger');
          const submenu = dropdown.querySelector('.mobile-nested-submenu');

          dropdown.classList.toggle('open', open);
          if (trigger) trigger.setAttribute('aria-expanded', String(open));
          if (submenu) submenu.classList.toggle('hidden', !open);
        };

        const closeMobileDropdowns = () => {
          document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
            const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          });

          document.querySelectorAll('.mobile-nested-dropdown').forEach(dropdown => {
            setMobileNestedState(dropdown, false);
          });
        };

        const closeMobileMenu = () => {
          if (!mobileMenu || !hamburger) return;
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
          closeMobileDropdowns();
        };

        document.addEventListener('click', event => {
          if (!event.target.closest('.nav-dropdown')) {
            closeDesktopDropdowns();
          }
        });

        document.addEventListener('keydown', event => {
          if (event.key !== 'Escape') return;
          closeDesktopDropdowns();
          closeMobileMenu();
        });

        if (hamburger && mobileMenu) {
          hamburger.addEventListener('click', () => {
            const willOpen = !mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open', willOpen);
            hamburger.classList.toggle('is-open', willOpen);
            hamburger.setAttribute('aria-expanded', String(willOpen));
            if (!willOpen) closeMobileDropdowns();
          });
        }

        document.querySelectorAll('.mobile-dropdown-trigger').forEach(button => {
          button.addEventListener('click', () => {
            const dropdown = button.closest('.mobile-dropdown');
            if (!dropdown) return;

            const willOpen = !dropdown.classList.contains('open');
            document.querySelectorAll('.mobile-dropdown').forEach(item => {
              if (item === dropdown) return;
              item.classList.remove('open');
              const trigger = item.querySelector('.mobile-dropdown-trigger');
              if (trigger) trigger.setAttribute('aria-expanded', 'false');
              item.querySelectorAll('.mobile-nested-dropdown').forEach(nestedDropdown => {
                setMobileNestedState(nestedDropdown, false);
              });
            });

            dropdown.classList.toggle('open', willOpen);
            button.setAttribute('aria-expanded', String(willOpen));
            if (!willOpen) {
              dropdown.querySelectorAll('.mobile-nested-dropdown').forEach(nestedDropdown => {
                setMobileNestedState(nestedDropdown, false);
              });
            }
          });
        });

        document.querySelectorAll('.mobile-nested-trigger').forEach(button => {
          button.addEventListener('click', () => {
            const dropdown = button.closest('.mobile-nested-dropdown');
            if (!dropdown) return;

            const willOpen = !dropdown.classList.contains('open');
            if (willOpen) {
              const group = dropdown.closest('.mobile-submenu');
              group?.querySelectorAll('.mobile-nested-dropdown').forEach(item => {
                if (item !== dropdown) setMobileNestedState(item, false);
              });
            }

            setMobileNestedState(dropdown, willOpen);
          });
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
          link.addEventListener('click', closeMobileMenu);
        });
      })();

      // FAQ accordion
      document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const content = btn.nextElementSibling;
          const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
          document.querySelectorAll('.faq-content').forEach(c => {
            c.style.maxHeight = '0px';
            c.style.paddingBottom = '0';
          });
          if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.paddingBottom = '20px';
          }
        });
      });


    // Legacy nested desktop dropdowns used by trekdetails.html
    const setupLegacyNestedDropdown = (triggerSelector, menuId) => {
      document.querySelectorAll(triggerSelector).forEach(trigger => {
        trigger.addEventListener('click', event => {
          event.preventDefault();
          const menu = document.getElementById(menuId);
          if (!menu) return;

          const willOpen = menu.classList.contains('hidden');
          menu.classList.toggle('hidden', !willOpen);
          menu.classList.toggle('block', willOpen);
          menu.toggleAttribute('open', willOpen);
          trigger.setAttribute('aria-expanded', String(willOpen));
        });
      });
    };

    setupLegacyNestedDropdown('.trekking-menu-trigger', 'trekking-menu');
    setupLegacyNestedDropdown('.peak-menu-trigger', 'peak-menu');

      // trekkingdetails
      // banner section
(function () {
  const AUTOPLAY_DURATION = 2000; // ms per slide

  const slider      = document.getElementById('hero-slider');
  if (!slider) return;

  const slides      = Array.from(slider.querySelectorAll('.slide'));
  const thumbs      = Array.from(slider.querySelectorAll('.thumb'));
  const progressBar = document.getElementById('progress-bar');
  const counter     = document.getElementById('counter');
  const arrowLeft   = document.getElementById('arrow-left');
  const arrowRight  = document.getElementById('arrow-right');

  if (!slides.length || !thumbs.length || !progressBar) return;

  let current    = 0;
  let autoplayTimer   = null;
  let progressTimer   = null;

  /* ── Core transition ─────────────────────────────────── */
  function goTo(n) {
    const prev = current;
    current = (n + slides.length) % slides.length;

    if (prev === current) return;

    const direction = n >= prev ? 'exit-left' : 'exit-right';

    // Outgoing slide
    slides[prev].classList.remove('active');
    slides[prev].classList.add(direction);
    thumbs[prev].classList.remove('active');
    thumbs[prev].setAttribute('aria-selected', 'false');

    // Clean up exit class after transition ends
    slides[prev].addEventListener('transitionend', () => {
      slides[prev].classList.remove('exit-left', 'exit-right');
    }, { once: true });

    // Incoming slide
    slides[current].classList.add('active');
    thumbs[current].classList.add('active');
    thumbs[current].setAttribute('aria-selected', 'true');

    // Update counter
    if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;

    // Restart progress bar
    restartProgress();
  }

  /* ── Progress bar ────────────────────────────────────── */
  function restartProgress() {
    // Reset
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    // Force reflow so the reset is visible before animating
    progressBar.getBoundingClientRect();

    // Animate to 100% over AUTOPLAY_DURATION
    progressBar.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  /* ── Autoplay ────────────────────────────────────────── */
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DURATION);
    restartProgress();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    clearTimeout(progressTimer);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }

  /* ── Event listeners ─────────────────────────────────── */
  arrowLeft?.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  arrowRight?.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => { goTo(i); startAutoplay(); });
    // Keyboard accessibility
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); startAutoplay(); }
    });
  });

  // Pause on hover/focus, resume on leave
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin',    stopAutoplay);
  slider.addEventListener('focusout',   startAutoplay);

  // Keyboard arrow navigation on the section itself
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAutoplay(); }
  });

  /* ── Init ────────────────────────────────────────────── */
  startAutoplay();
})();

//sub navigation
(function () {
  const subnav = document.getElementById('subnav');
  const placeholder = document.getElementById('subnav-placeholder');
  const banner = document.getElementById('hero-slider');

  if (!subnav || !placeholder || !banner) return;

  /* ---- measure & store subnav height ---- */
  function getSubnavHeight() {
    return subnav.offsetHeight;
  }

  function updateCSSVars() {
    document.documentElement.style.setProperty('--subnav-height', getSubnavHeight() + 'px');
  }
  updateCSSVars();
  window.addEventListener('resize', updateCSSVars);

  /* ---- sticky logic ---- */
  function onScroll() {
    const bannerBottom = banner.getBoundingClientRect().bottom;

    if (bannerBottom <= 0) {
      // Banner has scrolled out — make subnav sticky
      if (!subnav.classList.contains('is-sticky')) {
        placeholder.style.height = getSubnavHeight() + 'px';
        subnav.classList.add('is-sticky');
      }
    } else {
      // Banner still visible — subnav stays in normal flow
      if (subnav.classList.contains('is-sticky')) {
        subnav.classList.remove('is-sticky');
        placeholder.style.height = '0px';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---- smooth scroll on link click ---- */
  const links = subnav.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const offset = subnav.classList.contains('is-sticky') ? getSubnavHeight() + 16 : 16;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      links.forEach((l) => {
        l.classList.remove('active');
        l.setAttribute('aria-current', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-current', 'true');
    });
  });

  /* ---- active link highlight on scroll ---- */
  const sectionIds = [...links].map((l) => l.getAttribute('href').slice(1));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const activeId = visible[0].target.id;
        links.forEach((link) => {
          const isActive = link.getAttribute('href') === '#' + activeId;
          link.classList.toggle('active', isActive);
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
      }
    },
    {
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0,
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
})();

// pax counter
 const paxPlus = document.getElementById('pax-plus');
 const paxMinus = document.getElementById('pax-minus');
 const paxCount = document.getElementById('pax-count');

 if (paxPlus && paxMinus && paxCount) {
  let pax = 1;
  paxPlus.addEventListener('click', () => { pax++; paxCount.textContent = pax; });
  paxMinus.addEventListener('click', () => { if (pax > 1) { pax--; paxCount.textContent = pax; } });
 }
  
  
