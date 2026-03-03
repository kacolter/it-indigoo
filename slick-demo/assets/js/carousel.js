/**
 * carousel.js — Accessible, touch-friendly vanilla JS carousel
 *
 * Accessibility features:
 *  - aria-live region announces active slide to screen readers
 *  - aria-hidden toggled on inactive slides
 *  - Roving tabindex on dot/tab controls (arrow-key navigation)
 *  - Autoplay pauses on focus-within (keyboard users) and on hover
 *  - Autoplay pauses when Page Visibility API detects hidden tab
 *  - Respects prefers-reduced-motion (no autoplay if motion reduced)
 *  - Keyboard: ArrowLeft/Right navigate; Home/End jump to first/last
 *
 * Touch features:
 *  - Touch swipe (touchstart / touchend)
 *  - Mouse drag swipe (mousedown / mouseup)
 *  - 44 × 44 px minimum touch targets enforced in CSS
 *  - touch-action: manipulation on buttons (no 300 ms tap delay)
 */

(function () {
  'use strict';

  // ─── Config ────────────────────────────────────────────────
  const AUTOPLAY_DELAY   = 5000;  // ms between auto-advances
  const SWIPE_THRESHOLD  = 50;    // px drag required to register swipe
  const ANIMATION_DURATION = 700; // ms — matches CSS transition length

  // ─── Elements ──────────────────────────────────────────────
  const section      = document.querySelector('.carousel-section');
  const track        = document.getElementById('carouselTrack');
  const slides       = Array.from(track.querySelectorAll('.slide'));
  const dots         = Array.from(document.getElementById('dotList').querySelectorAll('.dot'));
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const autoplayBtn  = document.getElementById('autoplayBtn');
  const progressFill = document.getElementById('progressFill');
  const announcer    = document.getElementById('slideAnnouncer');

  const total = slides.length;

  // ─── State ─────────────────────────────────────────────────
  let currentIndex  = 0;
  let isAnimating   = false;
  let autoplayTimer = null;
  let isPlaying     = true;

  // Drag / swipe tracking
  let dragStartX  = 0;
  let isDragging  = false;

  // Detect reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Core: go to a slide ───────────────────────────────────
  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    const previous    = currentIndex;
    currentIndex      = (index + total) % total;

    // ── Update slides ──
    slides[previous].classList.add('exit');
    slides[previous].classList.remove('active');
    slides[previous].setAttribute('aria-hidden', 'true');

    slides[currentIndex].classList.add('active');
    slides[currentIndex].removeAttribute('aria-hidden');

    // ── Update dots (roving tabindex) ──
    dots[previous].classList.remove('active');
    dots[previous].setAttribute('aria-selected', 'false');
    dots[previous].setAttribute('tabindex', '-1');

    dots[currentIndex].classList.add('active');
    dots[currentIndex].setAttribute('aria-selected', 'true');
    dots[currentIndex].setAttribute('tabindex', '0');

    // ── Update progress bar ──
    progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;

    // ── Announce to screen readers ──
    // Small timeout lets AT finish reading the button label before announcing
    setTimeout(function () {
      const slideLabel = slides[currentIndex].getAttribute('aria-label') || '';
      announcer.textContent = slideLabel;
    }, 100);

    // ── Cleanup after transition ──
    const exiting = slides[previous];

    function cleanup() {
      exiting.classList.remove('exit');
      isAnimating = false;
    }

    exiting.addEventListener('transitionend', function onEnd() {
      exiting.removeEventListener('transitionend', onEnd);
      cleanup();
    }, { once: true });

    // Safety fallback (in case transitionend never fires)
    setTimeout(cleanup, ANIMATION_DURATION + 50);

    resetAutoplay();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // ─── Autoplay ──────────────────────────────────────────────
  function startAutoplay() {
    if (!isPlaying) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function resetAutoplay() {
    if (isPlaying) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function toggleAutoplay() {
    isPlaying = !isPlaying;
    autoplayBtn.setAttribute('aria-pressed', String(isPlaying));
    autoplayBtn.setAttribute(
      'aria-label',
      isPlaying ? 'Pause auto-rotation' : 'Start auto-rotation'
    );
    isPlaying ? startAutoplay() : stopAutoplay();
  }

  // ─── Button events ─────────────────────────────────────────
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  autoplayBtn.addEventListener('click', toggleAutoplay);

  // ─── Dot / tab events ──────────────────────────────────────
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(this.dataset.index, 10));
    });
  });

  // Roving tabindex: arrow keys move focus between dots
  document.getElementById('dotList').addEventListener('keydown', function (e) {
    const focused = document.activeElement;
    if (!dots.includes(focused)) return;

    let targetIndex = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = total - 1;
    }

    if (targetIndex !== null) {
      goTo(targetIndex);
      dots[targetIndex].focus();
    }
  });

  // ─── Global keyboard navigation ────────────────────────────
  // Only fires when focus is NOT inside the dot list (handled above)
  document.addEventListener('keydown', function (e) {
    const inDotList = document.getElementById('dotList').contains(document.activeElement);
    if (inDotList) return;

    if      (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    else if (e.key === 'Home')       { e.preventDefault(); goTo(0); }
    else if (e.key === 'End')        { e.preventDefault(); goTo(total - 1); }
  });

  // ─── Touch swipe ───────────────────────────────────────────
  const trackWrapper = document.querySelector('.carousel-track-wrapper');

  trackWrapper.addEventListener('touchstart', function (e) {
    dragStartX = e.touches[0].clientX;
  }, { passive: true });

  trackWrapper.addEventListener('touchend', function (e) {
    const delta = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? next() : prev();
    }
  }, { passive: true });

  // ─── Mouse drag swipe ──────────────────────────────────────
  trackWrapper.addEventListener('mousedown', function (e) {
    dragStartX = e.clientX;
    isDragging = true;
    trackWrapper.style.cursor = 'grabbing';
    // Prevent image dragging from hijacking the gesture
    e.preventDefault();
  });

  document.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    trackWrapper.style.cursor = '';
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? next() : prev();
    }
  });

  // ─── Pause on hover ────────────────────────────────────────
  section.addEventListener('mouseenter', stopAutoplay);
  section.addEventListener('mouseleave', function () {
    if (isPlaying) startAutoplay();
  });

  // ─── Pause on focus-within (keyboard users) ────────────────
  // When a keyboard user tabs into the carousel, autoplay stops
  // so they aren't surprised by sudden slide changes.
  section.addEventListener('focusin',  stopAutoplay);
  section.addEventListener('focusout', function (e) {
    // Only restart if focus leaves the entire carousel section
    if (!section.contains(e.relatedTarget)) {
      if (isPlaying) startAutoplay();
    }
  });

  // ─── Page Visibility API ───────────────────────────────────
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stopAutoplay() : (isPlaying && startAutoplay());
  });

  // ─── Init ──────────────────────────────────────────────────
  // Ensure correct initial aria state
  slides.forEach(function (slide, i) {
    if (i !== 0) slide.setAttribute('aria-hidden', 'true');
  });

  progressFill.style.width = `${(1 / total) * 100}%`;

  // If the user prefers reduced motion, don't autoplay by default
  if (prefersReducedMotion) {
    isPlaying = false;
    autoplayBtn.setAttribute('aria-pressed', 'false');
    autoplayBtn.setAttribute('aria-label', 'Start auto-rotation');
  } else {
    startAutoplay();
  }

}());
