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

      // Home banner slider
      (function () {
        const banner = document.getElementById('home-banner');
        if (!banner) return;

        const slides = Array.from(banner.querySelectorAll('[data-home-slide]'));
        const dots = Array.from(banner.querySelectorAll('[data-home-slide-to]'));
        const prevButton = banner.querySelector('[data-home-prev]');
        const nextButton = banner.querySelector('[data-home-next]');
        const progressBar = banner.querySelector('.home-slider-progress span');
        const AUTOPLAY_DELAY = 6000;

        if (!slides.length) return;

        let currentSlide = 0;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchStartY = 0;

        const resetProgress = () => {
          if (!progressBar) return;
          progressBar.style.transition = 'none';
          progressBar.style.width = '0%';
          progressBar.getBoundingClientRect();
          progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
          progressBar.style.width = '100%';
        };

        const goToSlide = index => {
          currentSlide = (index + slides.length) % slides.length;

          slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
          });

          dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentSlide;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', String(isActive));
          });

          resetProgress();
        };

        const stopAutoplay = () => {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
          if (progressBar) progressBar.style.transition = 'none';
        };

        const startAutoplay = () => {
          stopAutoplay();
          resetProgress();
          autoplayTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
          }, AUTOPLAY_DELAY);
        };

        const moveSlide = step => {
          goToSlide(currentSlide + step);
          startAutoplay();
        };

        prevButton?.addEventListener('click', () => moveSlide(-1));
        nextButton?.addEventListener('click', () => moveSlide(1));

        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            const index = Number(dot.dataset.homeSlideTo);
            if (Number.isNaN(index)) return;
            goToSlide(index);
            startAutoplay();
          });
        });

        banner.addEventListener('keydown', event => {
          if (event.key === 'ArrowLeft') moveSlide(-1);
          if (event.key === 'ArrowRight') moveSlide(1);
        });

        banner.addEventListener('mouseenter', stopAutoplay);
        banner.addEventListener('mouseleave', startAutoplay);
        banner.addEventListener('focusin', stopAutoplay);
        banner.addEventListener('focusout', () => {
          setTimeout(() => {
            if (!banner.contains(document.activeElement)) startAutoplay();
          }, 0);
        });

        banner.addEventListener('touchstart', event => {
          const touch = event.changedTouches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        }, { passive: true });

        banner.addEventListener('touchend', event => {
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - touchStartX;
          const deltaY = touch.clientY - touchStartY;

          if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
          moveSlide(deltaX > 0 ? -1 : 1);
        }, { passive: true });

        goToSlide(0);
        startAutoplay();
      })();

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

      // FAQ accordion and expandable loader
      (function () {
        const faqList = document.getElementById('faq-list');
        const faqTemplate = document.getElementById('faq-item-template');
        const loadMoreButton = document.getElementById('faq-load-more');
        const loadMoreWrapper = document.getElementById('faq-load-more-wrapper');
        const backButton = document.getElementById('faq-back');
        const backWrapper = document.getElementById('faq-back-wrapper');
        const status = document.getElementById('faq-load-more-status');
        if (!faqList || !faqTemplate || !loadMoreButton || !loadMoreWrapper || !backButton || !backWrapper) return;

        const BATCH_SIZE = 10;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let loadedCount = 0;

        const additionalFaqs = [
          {
            question: 'When is the best time to trek in Nepal?',
            answer: 'Spring and autumn are popular trekking seasons because they generally offer clearer views and more stable conditions. The best time still depends on your chosen route.',
          },
          {
            question: 'How difficult is the Everest Base Camp trek?',
            answer: 'The trek is physically demanding because of the altitude and multiple walking days, but it does not require technical climbing skills. Good preparation and a steady pace are important.',
          },
          {
            question: 'Do I need previous trekking experience?',
            answer: 'Previous trekking experience is helpful but not essential for many routes. Regular walking, hill training, and an honest assessment of your fitness will help you prepare.',
          },
          {
            question: 'What trekking permits do I need?',
            answer: 'Permit requirements depend on your destination and route. Confirm the current requirements before departure so the correct documents can be arranged for your trek.',
          },
          {
            question: 'What should I pack for a Himalayan trek?',
            answer: 'Pack layered clothing, comfortable broken-in boots, rain protection, sun protection, a warm sleeping bag, reusable water bottles, and your personal essentials.',
          },
          {
            question: 'Is drinking water available on the trail?',
            answer: 'Water is available in villages and teahouses. Use a refillable bottle and follow your guide\'s advice for boiling, filtering, or treating water before drinking.',
          },
          {
            question: 'What accommodation is available during a trek?',
            answer: 'Popular trekking routes usually have locally run teahouses. Rooms are generally simple and comfortable, while facilities become more basic at higher elevations.',
          },
          {
            question: 'Can I charge my phone and use Wi-Fi?',
            answer: 'Many teahouses offer charging and internet access for an additional fee, but service can be limited in remote areas. Carrying a power bank is recommended.',
          },
          {
            question: 'Should I hire a guide or porter?',
            answer: 'A guide provides local knowledge and logistical support, while a porter can reduce the weight you carry. Both can make a high-altitude trek more comfortable.',
          },
          {
            question: 'How do I reduce the risk of altitude sickness?',
            answer: 'Ascend gradually, use acclimatization days, stay hydrated, avoid rushing, and tell your guide immediately if you feel unwell. Never ignore worsening symptoms.',
          },
          {
            question: 'How far do trekkers usually walk each day?',
            answer: 'Daily walking distance varies by route, altitude, and acclimatization needs. Most itineraries balance steady progress with enough time to rest and enjoy the trail.',
          },
          {
            question: 'Are vegetarian meals available during a trek?',
            answer: 'Vegetarian meals are widely available on popular routes. Tell your trekking team about dietary preferences or allergies before departure so they can guide your meal choices.',
          },
          {
            question: 'Should I carry cash while trekking?',
            answer: 'Yes. ATMs and card payments are unreliable outside major towns. Carry enough Nepali rupees for snacks, drinks, showers, charging, Wi-Fi, and tips.',
          },
          {
            question: 'Can flights to Lukla be delayed?',
            answer: 'Yes. Mountain weather can delay or cancel flights. Keep buffer days in your itinerary and avoid tight international connections immediately after the trek.',
          },
          {
            question: 'Can my trekking itinerary be customized?',
            answer: 'Yes. Your itinerary can be adjusted around your available time, fitness level, preferred pace, acclimatization needs, and the places you want to visit.',
          },
          {
            question: 'How should I train before my trek?',
            answer: 'Build endurance with regular walks, hills or stairs, and longer weekend hikes. Add strength training and gradually practice carrying your daypack.',
          },
          {
            question: 'Are hot showers available on the trail?',
            answer: 'Many teahouses offer hot showers for an additional fee. Availability becomes less reliable at higher elevations, so carry basic personal hygiene supplies.',
          },
          {
            question: 'Can I rent trekking equipment in Kathmandu?',
            answer: 'Many trekking items can be rented or purchased in Kathmandu. Bring personal-fit essentials such as well-tested boots when possible and inspect rental gear carefully.',
          },
          {
            question: 'Can I store extra luggage in Kathmandu?',
            answer: 'Usually, yes. Travelers commonly leave non-trekking luggage securely at their hotel or with their trekking operator while they are on the trail.',
          },
          {
            question: 'Is tipping expected after a trek?',
            answer: 'Tipping is customary when you are happy with the service. The amount is personal and can reflect the trek length, group size, and support provided.',
          },
        ];

        const closeAllFaqs = () => {
          faqList.querySelectorAll('.faq-content').forEach(content => {
            content.style.maxHeight = '0px';
            content.style.paddingBottom = '0';
            content.setAttribute('aria-hidden', 'true');
          });

          faqList.querySelectorAll('.faq-btn').forEach(button => {
            button.setAttribute('aria-expanded', 'false');
          });
        };

        const prepareFaq = (button, index) => {
          const content = button.nextElementSibling;
          if (!content) return;

          const id = String(index + 1).padStart(2, '0');
          button.type = 'button';
          button.id = `faq-question-${id}`;
          button.setAttribute('aria-controls', `faq-answer-${id}`);
          button.setAttribute('aria-expanded', 'false');
          content.id = `faq-answer-${id}`;
          content.setAttribute('role', 'region');
          content.setAttribute('aria-labelledby', button.id);
          content.setAttribute('aria-hidden', 'true');
        };

        const prepareAllFaqs = () => {
          faqList.querySelectorAll('.faq-btn').forEach(prepareFaq);
        };

        faqList.addEventListener('click', event => {
          const button = event.target.closest('.faq-btn');
          if (!button || !faqList.contains(button)) return;

          const content = button.nextElementSibling;
          if (!content) return;

          const isOpen = button.getAttribute('aria-expanded') === 'true';
          closeAllFaqs();

          if (!isOpen) {
            button.setAttribute('aria-expanded', 'true');
            content.setAttribute('aria-hidden', 'false');
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.paddingBottom = '20px';
          }
        });

        loadMoreButton.addEventListener('click', () => {
          const nextFaqs = additionalFaqs.slice(loadedCount, loadedCount + BATCH_SIZE);
          const fragment = document.createDocumentFragment();
          const addedItems = [];

          nextFaqs.forEach((faq, index) => {
            const item = faqTemplate.content.firstElementChild.cloneNode(true);
            item.querySelector('.faq-question').textContent = faq.question;
            item.querySelector('.faq-answer').textContent = faq.answer;
            item.style.animationDelay = prefersReducedMotion ? '0ms' : `${index * 45}ms`;
            fragment.appendChild(item);
            addedItems.push(item);
          });

          loadMoreWrapper.before(fragment);
          loadedCount += addedItems.length;
          backWrapper.hidden = false;
          prepareAllFaqs();
          window.lucide?.createIcons();

          if (status) {
            status.textContent = `${addedItems.length} additional FAQs displayed.`;
          }

          if (loadedCount >= additionalFaqs.length) {
            loadMoreWrapper.hidden = true;
          }

          window.setTimeout(() => {
            addedItems[0]?.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }, prefersReducedMotion ? 0 : 100);
        });

        backButton.addEventListener('click', () => {
          closeAllFaqs();
          faqList.querySelectorAll('.faq-added-item').forEach(item => item.remove());
          loadedCount = 0;
          loadMoreWrapper.hidden = false;
          backWrapper.hidden = true;

          if (status) {
            status.textContent = 'Additional FAQs hidden. Showing the initial FAQs.';
          }

          document.getElementById('faq')?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        });

        prepareAllFaqs();
      })();


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
  
  
