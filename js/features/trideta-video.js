// ==========================================
// FEATURE: TRIDETA INTRO VIDEO
// ==========================================
// Behaviour
//   • Autoplays muted (lazy: the file is only requested when the video is about to scroll into view).
//   • Desktop (>= 768px): hovering the video unmutes it, leaving it mutes it again.
//   • Mobile  (<  768px): starts muted; the speaker button toggles sound on / off.
//   • The speaker icon always mirrors the real muted state of the <video> (via `volumechange`).
//
// Performance notes
//   • No timers, no requestAnimationFrame loops, no scroll / mousemove / timeupdate listeners.
//     The only listeners are mouseenter / mouseleave / click / volumechange, which fire once per
//     user action, plus one IntersectionObserver.
//   • Muting / unmuting only flips `video.muted` – it never calls load(), never seeks, never restarts.
//   • The video is paused while it is off-screen or its screen is hidden, so it does not keep decoding
//     (or playing sound) in the background, and resumes from the same position when visible again.
//   • Every listener hangs off one AbortController, so destroy() removes them all.
//
// Autoplay policy
//   Browsers refuse to unmute a video before the visitor has interacted with the page – Chrome/Edge even
//   PAUSE the video ("Unmuting failed and the element was paused instead…"). Merely moving the mouse does
//   not count as interaction, so on desktop we only unmute on hover once the visitor has clicked / pressed
//   a key somewhere on the page. Until then the video keeps playing muted; the moment they first interact
//   while the cursor is over the video, sound is enabled.
const TridetaVideo = {
  instance: null,

  init() {
    if (TridetaVideo.instance) return TridetaVideo.instance;

    const container = document.getElementById('trideta-video-container');
    const video = document.getElementById('trideta-video');
    if (!container || !video) return null;

    const soundToggle = document.getElementById('mobile-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const isDesktop = window.matchMedia('(min-width: 768px)');   // same breakpoint as Tailwind `md:`

    const abort = new AbortController();
    const listen = (target, type, handler, options = {}) =>
      target.addEventListener(type, handler, { ...options, signal: abort.signal });

    let sourcesLoaded = false;
    let inView = false;
    let hovering = false;
    let userInteracted = false;   // fallback for browsers without navigator.userActivation

    const canUnmute = () =>
      navigator.userActivation ? navigator.userActivation.hasBeenActive : userInteracted;

    // play() that never leaves the video stuck: if the browser refuses sound, carry on muted.
    const play = () => {
      const result = video.play();
      if (result && result.catch) {
        result.catch(err => {
          if (err && err.name === 'NotAllowedError' && !video.muted) {
            video.muted = true;
            video.play().catch(() => {});
          }
          // AbortError etc. just mean a pause()/load() interrupted the request – nothing to do.
        });
      }
    };

    const setMuted = (muted) => {
      if (video.muted === muted) return;   // nothing to change -> no work
      video.muted = muted;                 // does not reload, seek or restart playback
      if (!muted && video.paused && inView) play();
    };

    // --- Speaker icon mirrors the real state ---
    const syncIcon = () => {
      if (!soundIcon) return;
      soundIcon.classList.toggle('fa-volume-xmark', video.muted);
      soundIcon.classList.toggle('fa-volume-high', !video.muted);
    };
    listen(video, 'volumechange', syncIcon);

    // --- Desktop: hover to hear, leave to mute ---
    listen(container, 'mouseenter', () => {
      hovering = true;
      if (isDesktop.matches && canUnmute()) setMuted(false);
    });
    listen(container, 'mouseleave', () => {
      hovering = false;
      if (isDesktop.matches) setMuted(true);
    });

    // First real interaction (click / key press). If the cursor is already over the video, enable sound now.
    const onFirstInteraction = () => {
      userInteracted = true;
      if (hovering && isDesktop.matches) setMuted(false);
    };
    ['pointerdown', 'keydown'].forEach(type =>
      listen(window, type, onFirstInteraction, { once: true, capture: true, passive: true }));

    // --- Mobile: speaker button toggles sound (a tap is a user gesture, so sound is allowed) ---
    if (soundToggle) {
      listen(soundToggle, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        video.muted = !video.muted;
        if (!video.muted && video.paused) play();   // e.g. autoplay was blocked on this device
      });
    }

    // --- Lazy load + autoplay + pause when not visible ---
    const loadSources = () => {
      video.querySelectorAll('source[data-src]').forEach(source => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });
      video.load();
      sourcesLoaded = true;
    };

    const onVisibilityChange = (isVisible) => {
      inView = isVisible;
      if (isVisible) {
        if (!sourcesLoaded) loadSources();
        if (video.paused) play();
      } else if (sourcesLoaded && !video.paused) {
        video.pause();
      }
    };

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => onVisibilityChange(entries[entries.length - 1].isIntersecting),
        { rootMargin: '0px 0px 300px 0px' }
      );
      observer.observe(video);
    } else {
      onVisibilityChange(true);
    }

    TridetaVideo.instance = {
      destroy() {
        abort.abort();
        if (observer) observer.disconnect();
        TridetaVideo.instance = null;
      }
    };
    return TridetaVideo.instance;
  }
};
