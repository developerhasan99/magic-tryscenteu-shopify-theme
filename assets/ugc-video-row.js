(() => {
  if (window.ugcVideoRowReady) return;
  window.ugcVideoRowReady = true;

  // Preview timings measured on the theessencevault.co.uk row: the sequence
  // starts 2s after the row is half on screen, each clip plays muted for 3s
  // from the start, then the next one, and after the last a 5s pause before
  // it goes round again. One clip at a time.
  const START_DELAY = 2000;
  const CLIP_TIME = 3000;
  const LOOP_DELAY = 5000;
  // A clip that has not produced a frame in this long is skipped, so a slow
  // or broken file cannot stall the rest of the row.
  const START_GUARD = 4000;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // The poster image over the clip comes off exactly when the clip has put a
  // real frame on screen (iOS Safari drops the poster attribute on play and
  // has nothing decoded yet). It never goes back: a clip reset to its start
  // shows frame 0, which is the poster.
  const holdPoster = (tile, video) => {
    if (!tile.querySelector('.ugc-row__poster')) return;
    const started = () => tile.classList.add('ugc-row__tile--started');
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(started);
      return;
    }
    const onFrame = () => {
      if (video.readyState < 2) return;
      video.removeEventListener('playing', onFrame);
      video.removeEventListener('timeupdate', onFrame);
      started();
    };
    video.addEventListener('playing', onFrame);
    video.addEventListener('timeupdate', onFrame);
  };

  const initRow = (root) => {
    if (root.dataset.ugcInit === 'true') return;
    root.dataset.ugcInit = 'true';

    const tiles = [...root.querySelectorAll('[data-ugc-tile]')];
    const videos = tiles.map((tile) => tile.querySelector('video.ugc-row__video'));
    const dialog = root.querySelector('dialog.ugc-player');
    const player = dialog ? dialog.querySelector('.ugc-player__video') : null;
    const pills = dialog ? [...dialog.querySelectorAll('.ugc-player__pill')] : [];
    const autoplay = root.dataset.autoplay === 'true';

    tiles.forEach((tile, i) => holdPoster(tile, videos[i]));

    let visible = false;
    let running = false;
    // Set when the browser refuses a muted start (iOS Low Power Mode, data
    // saver): the row then stays on its posters for good instead of retrying.
    let blocked = false;
    let timer = null;
    let current = -1;
    let onPlaying = null;
    let opener = null;

    const canPreview = () =>
      autoplay && !blocked && !reduced.matches && visible && !document.hidden && !(dialog && dialog.open) && root.isConnected;

    const clearTimer = () => {
      clearTimeout(timer);
      timer = null;
    };

    const resetClip = (video) => {
      if (!video) return;
      if (onPlaying) video.removeEventListener('playing', onPlaying);
      video.pause();
      try {
        video.currentTime = 0;
      } catch (error) {
        // A clip that cannot seek yet just stays where it is.
      }
    };

    // Only the clip that plays next is asked to buffer, so the row never
    // pulls four files at once on a phone.
    const warm = (video) => {
      if (video && video.preload === 'none') video.preload = 'auto';
    };

    const stop = () => {
      running = false;
      clearTimer();
      if (current >= 0) resetClip(videos[current]);
      current = -1;
    };

    const playAt = (i) => {
      if (!running) return;
      if (!canPreview()) {
        stop();
        return;
      }
      const video = videos[i];
      current = i;
      warm(videos[i + 1]);

      let advanced = false;
      const advance = () => {
        if (advanced) return;
        advanced = true;
        clearTimer();
        resetClip(video);
        if (!running) return;
        if (i + 1 < videos.length) {
          playAt(i + 1);
        } else {
          current = -1;
          timer = setTimeout(() => playAt(0), LOOP_DELAY);
        }
      };

      // The 3s count starts when the clip really plays, not when it was
      // asked to: on a slow line the fetch would otherwise eat the preview.
      onPlaying = () => {
        clearTimer();
        timer = setTimeout(advance, CLIP_TIME);
      };
      video.addEventListener('playing', onPlaying, { once: true });
      timer = setTimeout(advance, START_GUARD);

      video.muted = true;
      const attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch((error) => {
          if (error && error.name === 'NotAllowedError') {
            blocked = true;
            stop();
          }
          // AbortError is our own pause() landing before the start; nothing to do.
        });
      }
    };

    const start = () => {
      if (running || !videos.length || !canPreview()) return;
      running = true;
      warm(videos[0]);
      timer = setTimeout(() => playAt(0), START_DELAY);
    };

    const refresh = () => (canPreview() ? start() : stop());

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.intersectionRatio >= 0.5;
          });
          refresh();
        },
        { threshold: [0, 0.5] }
      ).observe(root.querySelector('.ugc-row__grid') || root);
    }
    document.addEventListener('visibilitychange', refresh);
    if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', refresh);

    if (!dialog || !player) return;

    const open = (i, button) => {
      if (dialog.open) return;
      stop();
      opener = button;

      const tileVideo = videos[i];
      const source = tileVideo.querySelector('source');
      const src = source ? source.src : tileVideo.currentSrc;
      const slot = tiles[i].dataset.slot;

      let withPill = false;
      pills.forEach((pill) => {
        const match = pill.dataset.slot === slot;
        pill.hidden = !match;
        if (match) withPill = true;
      });
      dialog.classList.toggle('ugc-player--with-pill', withPill);

      // The same file the tile plays, which the preview has usually buffered
      // already, so the player starts at once.
      if (player.src !== src) {
        player.src = src;
      } else {
        try {
          player.currentTime = 0;
        } catch (error) {
          // Not seekable yet; it starts from the beginning anyway.
        }
      }
      player.poster = tileVideo.getAttribute('poster') || '';
      player.muted = false;

      dialog.showModal();
      document.documentElement.classList.add('ugc-player-open');

      // Inside the tap, so the browser lets the sound through. If it still
      // refuses, the controls are there to start it.
      const attempt = player.play();
      if (attempt && attempt.catch) attempt.catch(() => {});
    };

    tiles.forEach((tile, i) => {
      const button = tile.querySelector('[data-ugc-open]');
      if (button) button.addEventListener('click', () => open(i, button));
    });

    const close = () => {
      if (dialog.open) dialog.close();
    };

    dialog.querySelectorAll('[data-ugc-close]').forEach((button) => button.addEventListener('click', close));

    // The dialog itself is the dark area around the clip: a click that lands
    // on it, not on the clip or the pill, closes the player.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });

    // Escape, the close button and the backdrop all end here.
    dialog.addEventListener('close', () => {
      player.pause();
      document.documentElement.classList.remove('ugc-player-open');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
      refresh();
    });
  };

  const initAll = () => document.querySelectorAll('[data-ugc-row]').forEach(initRow);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Theme editor: a re-rendered section brings fresh, unstamped rows, and
  // selecting the block in the sidebar scrolls its row into view.
  document.addEventListener('shopify:section:load', initAll);
  document.addEventListener('shopify:block:select', (event) => {
    const id = event.detail && event.detail.blockId;
    if (!id) return;
    const root = document.querySelector(`[data-ugc-row][data-block-id="${id}"]`);
    if (root) root.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
})();
