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
  const search = header.querySelector('.header-search');
  const searchToggle = search?.querySelector('.header-search-trigger');
  const searchPanel = search?.querySelector('.header-search-panel');
  const searchInput = search?.querySelector('.header-search-input');
  const searchSuggestions = [
    { title: 'Everest Base Camp Trek', category: 'Trek', href: 'trekdetails.html' },
    { title: 'Annapurna Base Camp Trek', category: 'Trek', href: 'index.html#featured-destinations' },
    { title: 'Manaslu Circuit Trek', category: 'Trek', href: 'index.html#featured-destinations' },
    { title: 'Langtang Valley Trek', category: 'Trek', href: 'index.html#featured-destinations' },
    { title: 'Gosaikunda Holy Lake Trek', category: 'Trek', href: 'index.html#featured-destinations' },
    { title: 'Upper Mustang Trek', category: 'Trek', href: 'index.html#featured-destinations' },
    { title: 'Everest Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Annapurna Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Langtang Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Manaslu Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Kanchanjunga Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Ganesh Himal Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Dhulagiri Region', category: 'Trekking Region', href: 'index.html#featured-destinations' },
    { title: 'Yala Peak Climbing', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Island Peak Climbing with Everest Base Camp', category: 'Peak Climbing', href: 'trekdetails.html' },
    { title: 'Pokalade Peak Climbing', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Lobuche Peak Climbing', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Mardi Himal Climbing', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Chulu West Peak', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Dhampus Peak Climbing', category: 'Peak Climbing', href: 'index.html#featured-destinations' },
    { title: 'Kathmandu Heritage Tour', category: 'Day Tour', href: 'index.html#contact' },
    { title: 'Bhaktapur & Patan Tour', category: 'Day Tour', href: 'index.html#contact' },
    { title: 'Nagarkot Sunrise Hike', category: 'Day Tour', href: 'index.html#contact' },
    { title: 'Pokhara Sightseeing', category: 'Day Tour', href: 'index.html#contact' },
  ].map(item => ({
    ...item,
    normalizedSearchText: `${item.title} ${item.category}`.toLocaleLowerCase(),
  }));

  let suggestionList = null;
  let visibleSuggestions = [];
  let activeSuggestionIndex = -1;
  let lastRenderedQuery = null;

  const setSuggestionVisibility = visible => {
    suggestionList?.classList.toggle('is-visible', visible);
    suggestionList?.setAttribute('aria-hidden', String(!visible));
    searchInput?.setAttribute('aria-expanded', String(visible));

    if (!visible) {
      activeSuggestionIndex = -1;
      searchInput?.removeAttribute('aria-activedescendant');
    }
  };

  const setActiveSuggestion = index => {
    if (!suggestionList || !visibleSuggestions.length) return;

    activeSuggestionIndex = (index + visibleSuggestions.length) % visibleSuggestions.length;
    suggestionList.querySelectorAll('[role="option"]').forEach((option, optionIndex) => {
      const isActive = optionIndex === activeSuggestionIndex;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-selected', String(isActive));

      if (isActive) {
        searchInput?.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const createHighlightedText = (title, query) => {
    const fragment = document.createDocumentFragment();
    const normalizedTitle = title.toLocaleLowerCase();
    let cursor = 0;
    let matchIndex = normalizedTitle.indexOf(query, cursor);

    while (matchIndex !== -1) {
      fragment.append(document.createTextNode(title.slice(cursor, matchIndex)));

      const mark = document.createElement('mark');
      mark.textContent = title.slice(matchIndex, matchIndex + query.length);
      fragment.append(mark);

      cursor = matchIndex + query.length;
      matchIndex = normalizedTitle.indexOf(query, cursor);
    }

    fragment.append(document.createTextNode(title.slice(cursor)));
    return fragment;
  };

  const renderSearchSuggestions = () => {
    if (!suggestionList || !searchInput) return;

    const query = searchInput.value.trim().toLocaleLowerCase();

    if (!query) {
      if (lastRenderedQuery !== '') suggestionList.replaceChildren();
      visibleSuggestions = [];
      lastRenderedQuery = '';
      setSuggestionVisibility(false);
      return;
    }

    if (query !== lastRenderedQuery) {
      visibleSuggestions = searchSuggestions
        .filter(item => item.normalizedSearchText.includes(query))
        .slice(0, 8);

      const fragment = document.createDocumentFragment();

      if (!visibleSuggestions.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'header-search-empty';
        emptyState.textContent = 'No results found';
        fragment.append(emptyState);
      } else {
        visibleSuggestions.forEach((item, index) => {
          const link = document.createElement('a');
          link.id = `header-search-option-${index}`;
          link.className = 'header-search-suggestion';
          link.href = item.href;
          link.setAttribute('role', 'option');
          link.setAttribute('aria-selected', 'false');

          const dot = document.createElement('span');
          dot.className = 'header-search-suggestion-dot';
          dot.setAttribute('aria-hidden', 'true');

          const content = document.createElement('span');
          content.className = 'header-search-suggestion-content';

          const title = document.createElement('span');
          title.className = 'header-search-suggestion-title';
          title.append(createHighlightedText(item.title, query));

          const category = document.createElement('span');
          category.className = 'header-search-suggestion-category';
          category.append(createHighlightedText(item.category, query));

          const arrow = document.createElement('span');
          arrow.className = 'header-search-suggestion-arrow';
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = '>';

          content.append(title, category);
          link.append(dot, content, arrow);
          link.addEventListener('mouseenter', () => setActiveSuggestion(index));
          link.addEventListener('focus', () => setActiveSuggestion(index));
          link.addEventListener('pointerdown', event => event.preventDefault());
          link.addEventListener('click', () => setSearchState(false));
          fragment.append(link);
        });
      }

      suggestionList.replaceChildren(fragment);
      activeSuggestionIndex = -1;
      searchInput.removeAttribute('aria-activedescendant');
      lastRenderedQuery = query;
    }

    setSuggestionVisibility(document.activeElement === searchInput);
  };

  if (searchPanel && searchInput) {
    if (!document.getElementById('header-search-suggestion-styles')) {
      const suggestionStyles = document.createElement('style');
      suggestionStyles.id = 'header-search-suggestion-styles';
      suggestionStyles.textContent = `
              .header-search-suggestions {
                max-height: 0;
                margin-top: 0;
                overflow: hidden;
                border: 1px solid transparent;
                border-radius: 12px;
                background: #fff;
                box-shadow: 0 0 0 rgba(15, 23, 42, 0);
                opacity: 0;
                transform: translateY(-6px);
                transition: max-height 220ms ease, margin-top 180ms ease, opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
                visibility: hidden;
              }

              .header-search-suggestions.is-visible {
                max-height: min(56vh, 348px);
                margin-top: 8px;
                overflow-y: auto;
                border-color: rgba(226, 232, 240, 0.95);
                box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
                opacity: 1;
                transform: translateY(0);
                visibility: visible;
              }

              .header-search-suggestion {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 4px;
                border-radius: 9px;
                padding: 10px;
                color: #0f172a;
                text-decoration: none;
                transition: background-color 160ms ease, color 160ms ease, transform 160ms ease;
              }

              .header-search-suggestion:hover,
              .header-search-suggestion:focus-visible,
              .header-search-suggestion.is-active {
                background: #eff6ff;
                color: #1d4ed8;
                outline: none;
                transform: translateX(2px);
              }

              .header-search-suggestion-dot {
                width: 8px;
                height: 8px;
                flex: 0 0 8px;
                border-radius: 999px;
                background: #60a5fa;
                box-shadow: 0 0 0 4px rgba(219, 234, 254, 0.8);
              }

              .header-search-suggestion-content {
                display: grid;
                min-width: 0;
                gap: 2px;
              }

              .header-search-suggestion-title {
                overflow: hidden;
                color: inherit;
                font-size: 13px;
                font-weight: 700;
                line-height: 1.25;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .header-search-suggestion-title mark {
                border-radius: 3px;
                background: #fef08a;
                color: #0f172a;
                padding: 0 1px;
              }

              .header-search-suggestion-category mark {
                border-radius: 3px;
                background: #fef08a;
                color: #475569;
                padding: 0 1px;
              }

              .header-search-suggestion-category {
                color: #64748b;
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 0.11em;
                line-height: 1.2;
                text-transform: uppercase;
              }

              .header-search-suggestion-arrow {
                margin-left: auto;
                color: #94a3b8;
                font-size: 14px;
                font-weight: 800;
              }

              .header-search-empty {
                margin: 4px;
                border-radius: 9px;
                background: #f8fafc;
                padding: 14px 12px;
                color: #64748b;
                font-size: 13px;
                font-weight: 700;
                text-align: center;
              }

              @media (max-width: 639px) {
                .header-search-suggestions.is-visible {
                  max-height: min(52vh, 320px);
                }

                .header-search-suggestion {
                  padding: 11px 10px;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .header-search-suggestions,
                .header-search-suggestion {
                  transition: none;
                }
              }
            `;
      document.head.append(suggestionStyles);
    }

    suggestionList = document.createElement('div');
    suggestionList.id = 'header-search-suggestions';
    suggestionList.className = 'header-search-suggestions';
    suggestionList.setAttribute('role', 'listbox');
    suggestionList.setAttribute('aria-label', 'Search suggestions');
    suggestionList.setAttribute('aria-hidden', 'true');
    searchPanel.append(suggestionList);

    searchInput.setAttribute('role', 'combobox');
    searchInput.setAttribute('aria-autocomplete', 'list');
    searchInput.setAttribute('aria-controls', suggestionList.id);
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.addEventListener('input', renderSearchSuggestions);
    searchInput.addEventListener('focus', renderSearchSuggestions);
    searchInput.addEventListener('blur', () => setSuggestionVisibility(false));
    searchPanel.addEventListener('focusout', event => {
      if (event.relatedTarget && searchPanel.contains(event.relatedTarget)) return;

      window.setTimeout(() => {
        if (!searchPanel.contains(document.activeElement)) {
          setSuggestionVisibility(false);
        }
      }, 0);
    });
    document.addEventListener('focusin', event => {
      if (!searchPanel.contains(event.target)) {
        setSuggestionVisibility(false);
      }
    });
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' && visibleSuggestions.length) {
        event.preventDefault();
        setActiveSuggestion(activeSuggestionIndex + 1);
      } else if (event.key === 'ArrowUp' && visibleSuggestions.length) {
        event.preventDefault();
        setActiveSuggestion(activeSuggestionIndex - 1);
      } else if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
        event.preventDefault();
        window.location.href = visibleSuggestions[activeSuggestionIndex].href;
      } else if (event.key === 'Escape') {
        setSuggestionVisibility(false);
      } else if (event.key === 'Tab') {
        setSuggestionVisibility(false);
      }
    });
  }

  const setSearchState = open => {
    search?.classList.toggle('open', open);
    searchToggle?.setAttribute('aria-expanded', String(open));
    searchToggle?.setAttribute('aria-label', open ? 'Close search' : 'Open search');
    searchPanel?.classList.toggle('invisible', !open);
    searchPanel?.classList.toggle('pointer-events-none', !open);
    searchPanel?.classList.toggle('opacity-0', !open);
    searchPanel?.classList.toggle('-translate-y-1.5', !open);
    searchPanel?.classList.toggle('visible', open);
    searchPanel?.classList.toggle('pointer-events-auto', open);
    searchPanel?.classList.toggle('opacity-100', open);
    searchPanel?.classList.toggle('translate-y-0', open);

    if (open) {
      window.setTimeout(() => searchInput?.focus(), 0);
    } else {
      setSuggestionVisibility(false);
    }
  };

  const closeSearch = () => setSearchState(false);

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
      if (window.innerWidth >= 1024) {
        closeSearch();
        closeDesktopDropdowns(dropdown);
      }
    });

    dropdown.addEventListener('focusin', () => {
      if (window.innerWidth >= 1024) {
        closeSearch();
        closeDesktopDropdowns(dropdown);
      }
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
    link.addEventListener('mouseenter', () => {
      closeSearch();
      closeDesktopDropdowns();
    });
    link.addEventListener('focusin', () => {
      closeSearch();
      closeDesktopDropdowns();
    });
    link.addEventListener('click', () => {
      closeSearch();
      closeDesktopDropdowns();
    });
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

  searchToggle?.addEventListener('click', () => {
    const willOpen = !search?.classList.contains('open');
    closeDesktopDropdowns();
    closeMobileMenu();
    setSearchState(willOpen);
  });

  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.header-search')) {
      setSuggestionVisibility(false);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) {
      closeDesktopDropdowns();
    }
    if (!event.target.closest('.header-search')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeDesktopDropdowns();
    closeMobileMenu();
    closeSearch();
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      closeSearch();
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

// WhatsApp trip booking form
(function () {
  const bookingForm = document.getElementById('trip-booking-form');
  const whatsappNumber = '9848532201';

  const formatTravelDate = value => {
    if (!value) return '';

    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const buildWhatsAppUrl = details => {
    const bookingDetails = [
      ['Trip Name', details.tripName],
      ['Travel Date', formatTravelDate(details.travelDate)],
      ['Number of Travelers', details.travelers],
      ['Name', details.name],
      ['Email', details.email],
      ['Phone', details.phone],
      ['Message', details.message],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);

    const whatsappMessage = [
      'Hello, I would like to book a trip.',
      '',
      ...bookingDetails,
      '',
      'Please provide me with the booking details and next steps.',
    ].join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  };

  document.querySelectorAll('[data-whatsapp-booking]').forEach(link => {
    link.addEventListener('click', () => {
      const sourceFormSelector = link.dataset.bookingForm;
      const sourceForm = sourceFormSelector ? document.querySelector(sourceFormSelector) : null;
      const formData = sourceForm ? new FormData(sourceForm) : null;

      link.href = buildWhatsAppUrl({
        tripName: link.dataset.tripName,
        travelDate: formData?.get('travelDate'),
        travelers: formData?.get('travelers'),
      });
    });
  });

  if (!bookingForm) return;

  const travelDateInput = bookingForm.querySelector('#travel-date');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  if (travelDateInput) {
    travelDateInput.min = localToday;
  }

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const formData = new FormData(bookingForm);

    window.location.href = buildWhatsAppUrl({
      tripName: 'Everest Base Camp Trek',
      travelDate: formData.get('travelDate'),
      travelers: formData.get('travelers'),
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      message: formData.get('message').trim(),
    });
  });
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
  const AUTOPLAY_DURATION = 4500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  const thumbs = Array.from(slider.querySelectorAll('.thumb'));
  const progressBar = document.getElementById('progress-bar');
  const counter = document.getElementById('counter');
  const arrowLeft = document.getElementById('arrow-left');
  const arrowRight = document.getElementById('arrow-right');

  if (!slides.length || !thumbs.length || !progressBar) return;

  const slideActiveClasses = ['z-[2]', 'scale-100', 'opacity-100'];
  const slideInactiveClasses = ['z-0', 'scale-105', 'opacity-0', 'pointer-events-none'];
  const thumbActiveClasses = [
    'active',
    'border-white',
    'opacity-100',
    'shadow-[0_18px_45px_rgba(15,23,42,0.40)]',
    'ring-2',
    'ring-white/70',
  ];
  const thumbInactiveClasses = [
    'border-white/25',
    'opacity-70',
    'shadow-none',
    'ring-0',
    'ring-transparent',
  ];

  let current = slides.findIndex(slide => slide.classList.contains('active'));
  if (current < 0) current = 0;

  let autoplayTimer = null;

  function swapClasses(element, addClasses, removeClasses) {
    element.classList.remove(...removeClasses);
    element.classList.add(...addClasses);
  }

  function setSlideState(slide, isActive) {
    slide.classList.toggle('active', isActive);
    swapClasses(
      slide,
      isActive ? slideActiveClasses : slideInactiveClasses,
      isActive ? slideInactiveClasses : slideActiveClasses
    );
    slide.setAttribute('aria-hidden', String(!isActive));
  }

  function setThumbState(thumb, isActive) {
    swapClasses(
      thumb,
      isActive ? thumbActiveClasses : thumbInactiveClasses,
      isActive ? thumbInactiveClasses : thumbActiveClasses
    );
    thumb.setAttribute('aria-selected', String(isActive));
  }

  function updateControls() {
    slides.forEach((slide, index) => setSlideState(slide, index === current));
    thumbs.forEach((thumb, index) => setThumbState(thumb, index === current));
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  /* ── Core transition ─────────────────────────────────── */
  function goTo(index) {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;

    current = next;
    updateControls();
    restartProgress();
  }

  /* ── Progress bar ────────────────────────────────────── */
  function restartProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    if (reduceMotion.matches) return;

    progressBar.getBoundingClientRect();
    progressBar.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  /* ── Autoplay ────────────────────────────────────────── */
  function startAutoplay() {
    stopAutoplay();
    restartProgress();
    if (reduceMotion.matches) return;
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DURATION);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    progressBar.style.transition = 'none';
  }

  function moveSlide(step) {
    goTo(current + step);
    startAutoplay();
  }

  /* ── Event listeners ─────────────────────────────────── */
  arrowLeft?.addEventListener('click', () => moveSlide(-1));
  arrowRight?.addEventListener('click', () => moveSlide(1));

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => { goTo(i); startAutoplay(); });
    // Keyboard accessibility
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(i);
        startAutoplay();
      }
    });
  });

  // Pause on hover/focus, resume on leave
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!slider.contains(document.activeElement)) startAutoplay();
    }, 0);
  });

  // Keyboard arrow navigation on the section itself
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
  });

  /* ── Init ────────────────────────────────────────────── */
  updateControls();
  startAutoplay();
})();

//subnavigation
(function () {
  const subnav = document.getElementById('subnav');
  const subnavSpacer = document.getElementById('subnav-spacer');
  const header = document.querySelector('.sticky-header');
  const banner = document.getElementById('hero-slider');

  if (!subnav || !banner) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const links = Array.from(subnav.querySelectorAll('a[href^="#"]'));
  const navItems = links.map(link => {
    const targetId = link.getAttribute('href').slice(1);
    const section = document.getElementById(targetId);
    return section ? { link, section, targetId } : null;
  }).filter(Boolean);
  const sections = navItems.map(item => item.section);

  if (!navItems.length) return;

  let activeId = '';
  let subnavVisible = false;
  let scrollTicking = false;
  let resizeTimer = null;
  let programmaticScroll = false;
  let programmaticScrollTimer = null;
  let programmaticScrollFrame = null;

  function getHeaderHeight() {
    return Math.ceil(header?.getBoundingClientRect().height || 0);
  }

  function getSubnavHeight() {
    return Math.ceil(subnav.getBoundingClientRect().height || 52);
  }

  function getStickyOffset(extra = 16) {
    return getSubnavHeight() + extra;
  }

  function syncMeasurements() {
    const headerHeight = getHeaderHeight();
    const subnavHeight = getSubnavHeight();

    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    document.documentElement.style.setProperty('--subnav-height', subnavHeight + 'px');

    sections.forEach(section => {
      section.style.scrollMarginTop = getStickyOffset(18) + 'px';
    });
  }

  function shouldShowSubnav() {
    return banner.getBoundingClientRect().bottom <= 1;
  }

  function setSubnavVisible(visible) {
    if (visible === subnavVisible) return;

    subnavVisible = visible;
    subnav.classList.toggle('subnav-visible', visible);
    subnavSpacer?.classList.toggle('subnav-spacer-visible', visible);
    document.body.classList.toggle('subnav-is-visible', visible);
    subnav.setAttribute('aria-hidden', String(!visible));
    syncMeasurements();

    if (visible && activeId) {
      const activeItem = navItems.find(item => item.targetId === activeId);
      if (activeItem) centerNavLink(activeItem.link);
    }
  }

  function setActiveLink(sectionId, shouldCenter = true) {
    if (!sectionId || sectionId === activeId) return;

    activeId = sectionId;

    navItems.forEach(({ link, targetId }) => {
      const isActive = targetId === sectionId;
      link.classList.toggle('active', isActive);

      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    if (shouldCenter && subnavVisible) {
      const activeItem = navItems.find(item => item.targetId === sectionId);
      if (activeItem) centerNavLink(activeItem.link);
    }
  }

  function getCurrentSection() {
    const offset = getStickyOffset(24);
    let current = sections[0];

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset) {
        current = section;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }

    return current;
  }

  function updateActiveFromScroll() {
    if (programmaticScroll) return;

    const current = getCurrentSection();
    if (current) setActiveLink(current.id);
  }

  function centerNavLink(link) {
    const scrollContainer = subnav.querySelector('.subnav-scroll');
    if (!scrollContainer) return;

    const linkRect = link.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const isClipped = linkRect.left < containerRect.left + 8 || linkRect.right > containerRect.right - 8;

    if (isClipped || window.innerWidth < 1024) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + (linkRect.left - containerRect.left) - ((containerRect.width - linkRect.width) / 2),
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    }
  }

  function scrollToSection(section, smooth = true) {
    syncMeasurements();
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - getStickyOffset(14);

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto'
    });
  }

  function releaseProgrammaticScroll(targetSection = null, maxDelay = 2400) {
    clearTimeout(programmaticScrollTimer);

    if (programmaticScrollFrame) {
      cancelAnimationFrame(programmaticScrollFrame);
      programmaticScrollFrame = null;
    }

    const finish = () => {
      clearTimeout(programmaticScrollTimer);
      if (programmaticScrollFrame) {
        cancelAnimationFrame(programmaticScrollFrame);
        programmaticScrollFrame = null;
      }
      programmaticScroll = false;
      updateActiveFromScroll();
    };

    if (reduceMotion.matches || !targetSection) {
      programmaticScrollTimer = window.setTimeout(finish, 80);
      return;
    }

    const startedAt = performance.now();
    const watchTarget = () => {
      const distance = Math.abs(targetSection.getBoundingClientRect().top - getStickyOffset(14));

      if (distance <= 4 || performance.now() - startedAt >= maxDelay) {
        finish();
        return;
      }

      programmaticScrollFrame = requestAnimationFrame(watchTarget);
    };

    programmaticScrollFrame = requestAnimationFrame(watchTarget);
  }

  function handleLinkClick(event) {
    const item = navItems.find(({ link }) => link === event.currentTarget);
    if (!item) return;

    event.preventDefault();

    programmaticScroll = true;
    setSubnavVisible(true);
    setActiveLink(item.targetId);
    centerNavLink(item.link);
    scrollToSection(item.section);

    try {
      history.pushState(null, '', '#' + item.targetId);
    } catch (error) {
      // Hash updates can fail in unusual local-file contexts; scrolling still works.
    }

    releaseProgrammaticScroll(item.section);
  }

  function onScroll() {
    if (scrollTicking) return;

    scrollTicking = true;
    requestAnimationFrame(() => {
      setSubnavVisible(shouldShowSubnav());
      updateActiveFromScroll();
      scrollTicking = false;
    });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncMeasurements();
      setSubnavVisible(shouldShowSubnav());
      updateActiveFromScroll();
    }, 120);
  }

  links.forEach(link => {
    link.addEventListener('click', handleLinkClick);
    link.addEventListener('focus', () => {
      if (subnavVisible) centerNavLink(link);
    });
  });

  syncMeasurements();
  setSubnavVisible(shouldShowSubnav());

  const initialHash = window.location.hash.slice(1);
  const initialItem = navItems.find(item => item.targetId === initialHash);

  if (initialItem) {
    setActiveLink(initialItem.targetId, false);
    requestAnimationFrame(() => {
      setSubnavVisible(true);
      scrollToSection(initialItem.section, false);
      centerNavLink(initialItem.link);
    });
  } else {
    setActiveLink(getCurrentSection()?.id || navItems[0].targetId, false);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
})();


// (function () {
//   const subnav = document.getElementById('subnav');
//   const header = document.querySelector('.sticky-header');
//   const banner = document.getElementById('hero-slider');
//   const links = Array.from(document.querySelectorAll('.nig-single-subnav-link'));
//   const sections = links.map(link => {
//     const href = link.getAttribute('href');
//     return href ? document.getElementById(href.slice(1)) : null;
//   }).filter(Boolean);

//   if (!subnav || !banner) {
//     console.error('Required elements not found');
//     return;
//   }

//   let activeId = '';
//   let isClickScrolling = false;

//   // Get header height dynamically
//   function getHeaderHeight() {
//     return header ? header.offsetHeight : 72;
//   }

//   // Get subnav height (when visible)
//   function getSubnavHeight() {
//     return subnav.offsetHeight || 60;
//   }

//   // Update scroll margins for all sections
//   function updateScrollMargins() {
//     const headerHeight = getHeaderHeight();
//     const subnavHeight = subnav.classList.contains('subnav-visible') ? getSubnavHeight() : 0;
//     const scrollMargin = headerHeight + subnavHeight + 24;

//     sections.forEach(section => {
//       if (section) {
//         section.style.scrollMarginTop = scrollMargin + 'px';
//       }
//     });
//   }

//   // Show/hide subnav based on banner scroll position
//   function updateSubnavVisibility() {
//     const headerHeight = getHeaderHeight();
//     const bannerRect = banner.getBoundingClientRect();
//     const bannerBottom = bannerRect.bottom;

//     // Show subnav when banner bottom is above or at header bottom
//     const shouldBeVisible = bannerBottom <= headerHeight;

//     if (shouldBeVisible) {
//       if (!subnav.classList.contains('subnav-visible')) {
//         subnav.classList.add('subnav-visible');
//         updateScrollMargins();
//       }
//     } else {
//       if (subnav.classList.contains('subnav-visible')) {
//         subnav.classList.remove('subnav-visible');
//         updateScrollMargins();
//       }
//     }
//   }

//   // Set active link based on current scroll position
//   function updateActiveLinkOnScroll() {
//     if (isClickScrolling) return;

//     const headerHeight = getHeaderHeight();
//     const subnavHeight = subnav.classList.contains('subnav-visible') ? getSubnavHeight() : 0;
//     const offset = headerHeight + subnavHeight + 30;

//     let currentSection = null;
//     let closestDistance = Infinity;

//     // Find which section is currently in view
//     for (let i = 0; i < sections.length; i++) {
//       const section = sections[i];
//       const rect = section.getBoundingClientRect();
//       const distance = Math.abs(rect.top - offset);

//       // If section is near the top and within reasonable range
//       if (rect.top <= offset + 150 && rect.bottom >= offset - 150) {
//         if (distance < closestDistance) {
//           closestDistance = distance;
//           currentSection = section;
//         }
//       }
//     }

//     // Fallback: find section closest to the offset
//     if (!currentSection) {
//       for (let i = 0; i < sections.length; i++) {
//         const section = sections[i];
//         const rect = section.getBoundingClientRect();
//         const distance = Math.abs(rect.top - offset);
//         if (distance < closestDistance) {
//           closestDistance = distance;
//           currentSection = section;
//         }
//       }
//     }

//     // Update active class on links
//     if (currentSection && currentSection.id !== activeId) {
//       activeId = currentSection.id;

//       links.forEach(link => {
//         const href = link.getAttribute('href');
//         const sectionId = href ? href.slice(1) : '';

//         if (sectionId === activeId) {
//           link.classList.add('active');
//           link.setAttribute('aria-current', 'location');
//         } else {
//           link.classList.remove('active');
//           link.removeAttribute('aria-current');
//         }
//       });
//     }
//   }

//   // Center the active link in the horizontal scroll view (mobile/tablet)
//   function centerActiveLink() {
//     const scrollContainer = subnav.querySelector('.subnav-scroll');
//     if (!scrollContainer) return;

//     const activeLink = subnav.querySelector('.nig-single-subnav-link.active');
//     if (!activeLink) return;

//     const containerRect = scrollContainer.getBoundingClientRect();
//     const linkRect = activeLink.getBoundingClientRect();

//     const isLeftClipped = linkRect.left < containerRect.left;
//     const isRightClipped = linkRect.right > containerRect.right;

//     if (isLeftClipped || isRightClipped) {
//       const scrollLeft = scrollContainer.scrollLeft + (linkRect.left - containerRect.left) - (containerRect.width / 2) + (linkRect.width / 2);
//       scrollContainer.scrollTo({
//         left: Math.max(0, scrollLeft),
//         behavior: 'smooth'
//       });
//     }
//   }

//   // Smooth scroll to section when link is clicked
//   function handleLinkClick(e) {
//     const link = e.currentTarget;
//     const targetId = link.getAttribute('href').slice(1);
//     const targetSection = document.getElementById(targetId);

//     if (!targetSection) return;

//     e.preventDefault();
//     isClickScrolling = true;

//     // Ensure subnav is visible before scrolling
//     if (!subnav.classList.contains('subnav-visible')) {
//       subnav.classList.add('subnav-visible');
//       updateScrollMargins();
//     }

//     // Calculate scroll position
//     const headerHeight = getHeaderHeight();
//     const subnavHeight = getSubnavHeight();
//     const offset = headerHeight + subnavHeight + 20;
//     const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;

//     window.scrollTo({
//       top: Math.max(0, targetPosition),
//       behavior: 'smooth'
//     });

//     // Update active link immediately
//     activeId = targetId;
//     links.forEach(linkItem => {
//       const href = linkItem.getAttribute('href');
//       const sectionId = href ? href.slice(1) : '';

//       if (sectionId === targetId) {
//         linkItem.classList.add('active');
//         linkItem.setAttribute('aria-current', 'location');
//       } else {
//         linkItem.classList.remove('active');
//         linkItem.removeAttribute('aria-current');
//       }
//     });

//     // Update URL without causing jump
//     history.pushState(null, '', link.getAttribute('href'));

//     // Re-enable scroll detection after animation
//     setTimeout(() => {
//       isClickScrolling = false;
//       centerActiveLink();
//     }, 800);
//   }

//   // Attach click handlers to all subnav links
//   links.forEach(link => {
//     link.addEventListener('click', handleLinkClick);
//   });

//   // Throttled scroll handler for performance
//   let scrollTimeout;
//   function onScroll() {
//     if (scrollTimeout) clearTimeout(scrollTimeout);
//     scrollTimeout = setTimeout(() => {
//       updateSubnavVisibility();
//       updateActiveLinkOnScroll();
//     }, 10);
//   }

//   // Handle window resize
//   function onResize() {
//     updateScrollMargins();
//     updateSubnavVisibility();
//     updateActiveLinkOnScroll();
//     centerActiveLink();
//   }

//   // Initialize everything
//   function init() {
//     updateScrollMargins();
//     updateSubnavVisibility();
//     updateActiveLinkOnScroll();

//     // Set initial active link based on URL hash or first section
//     if (window.location.hash) {
//       const hashId = window.location.hash.slice(1);
//       const hashSection = document.getElementById(hashId);
//       if (hashSection && sections.includes(hashSection)) {
//         activeId = hashId;
//         links.forEach(link => {
//           const href = link.getAttribute('href');
//           if (href === window.location.hash) {
//             link.classList.add('active');
//             link.setAttribute('aria-current', 'location');
//           }
//         });
//       }
//     } else if (sections.length > 0 && !activeId) {
//       activeId = sections[0].id;
//       const firstLink = links.find(l => l.getAttribute('href') === '#' + activeId);
//       if (firstLink) {
//         firstLink.classList.add('active');
//         firstLink.setAttribute('aria-current', 'location');
//       }
//     }

//     // Center active link after a short delay
//     setTimeout(centerActiveLink, 100);
//   }

//   // Set up event listeners
//   window.addEventListener('scroll', onScroll, { passive: true });
//   window.addEventListener('resize', onResize);

//   // Run initialization
//   init();
// })();





// pax counter
const paxPlus = document.getElementById('pax-plus');
const paxMinus = document.getElementById('pax-minus');
const paxCount = document.getElementById('pax-count');

if (paxPlus && paxMinus && paxCount) {
  let pax = 1;
  paxPlus.addEventListener('click', () => { pax++; paxCount.textContent = pax; });
  paxMinus.addEventListener('click', () => { if (pax > 1) { pax--; paxCount.textContent = pax; } });
}


