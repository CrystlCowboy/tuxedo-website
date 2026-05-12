'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frozenFrameRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let containerTop = 0;
    let rafId: number;
    let freezeToken = 0;
    let freezeTimeoutId: number | undefined;
    let isEndFrameFrozen = false;
    let isPreparingEndFrame = false;
    let isScrollComplete = false;
    let latestProgress = 0;

    const getEndTime = () => {
      if (!Number.isFinite(video.duration)) return 0;

      const seekableEnd = video.seekable.length ? video.seekable.end(video.seekable.length - 1) : video.duration;
      return Math.max(0, Math.min(video.duration, seekableEnd));
    };

    const getFinalHoldTime = () => {
      const endTime = getEndTime();
      const oneFrameGuard = 1 / 30;
      return Math.max(0, endTime - oneFrameGuard);
    };

    const getCompletionEpsilon = () => Math.max(2, 1 / window.devicePixelRatio);
    const getReleaseEpsilon = () => Math.max(28, window.innerHeight * 0.025);

    const setFreezeState = (state: 'live' | 'preparing' | 'frozen') => {
      if (frozenFrameRef.current) {
        frozenFrameRef.current.dataset.freezeState = state;
      }
    };

    const clearFreezeTimeout = () => {
      if (freezeTimeoutId !== undefined) {
        window.clearTimeout(freezeTimeoutId);
        freezeTimeoutId = undefined;
      }
    };

    const drawFrozenFrame = () => {
      const canvas = frozenFrameRef.current;
      if (!canvas || !video.videoWidth || !video.videoHeight) return false;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const context = canvas.getContext('2d');
      if (!context) return false;

      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch {
        return false;
      }

      canvas.style.opacity = '1';
      return true;
    };

    const hideFrozenFrame = () => {
      freezeToken += 1;
      clearFreezeTimeout();
      isEndFrameFrozen = false;
      isPreparingEndFrame = false;
      setFreezeState('live');

      if (frozenFrameRef.current) {
        frozenFrameRef.current.style.opacity = '0';
      }
    };

    const freezeEndFrame = (endTime: number) => {
      if (isEndFrameFrozen || isPreparingEndFrame) return;

      const token = freezeToken + 1;
      freezeToken = token;
      isPreparingEndFrame = true;
      setFreezeState('preparing');
      video.pause();

      const afterPresentedFrame = (callback: () => void) => {
        if ('requestVideoFrameCallback' in video) {
          video.requestVideoFrameCallback(() => callback());
          return;
        }

        window.requestAnimationFrame(callback);
      };

      const finishFreeze = () => {
        if (token !== freezeToken) return;

        if (Math.abs(video.currentTime - endTime) > 0.015) {
          video.currentTime = endTime;
          clearFreezeTimeout();
          freezeTimeoutId = window.setTimeout(finishFreeze, 60);
          return;
        }

        if (drawFrozenFrame()) {
          clearFreezeTimeout();
          isPreparingEndFrame = false;
          isEndFrameFrozen = true;
          setFreezeState('frozen');
          return;
        }

        clearFreezeTimeout();
        freezeTimeoutId = window.setTimeout(finishFreeze, 60);
      };

      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        afterPresentedFrame(finishFreeze);
      };

      video.addEventListener('seeked', handleSeeked);
      clearFreezeTimeout();
      freezeTimeoutId = window.setTimeout(() => {
        video.removeEventListener('seeked', handleSeeked);
        finishFreeze();
      }, 160);

      if (Math.abs(video.currentTime - endTime) > 0.005) {
        video.currentTime = endTime;
      } else {
        afterPresentedFrame(finishFreeze);
      }
    };

    const handleLoadedData = () => {
      if (latestProgress >= 1 && video.duration) {
        freezeEndFrame(getFinalHoldTime());
      }
    };

    const cacheContainerTop = () => {
      containerTop = container.getBoundingClientRect().top + window.scrollY;
    };

    // Keep the video and progress rule aligned whether scrolling is gradual or a jump.
    const syncToScroll = () => {
      const scrollable = Math.max(1, container.offsetHeight - window.innerHeight);
      const scrollEnd = containerTop + scrollable;
      const remainingScroll = scrollEnd - window.scrollY;
      const rawProgress = Math.max(0, Math.min(1, (window.scrollY - containerTop) / scrollable));

      if (remainingScroll <= getCompletionEpsilon()) {
        isScrollComplete = true;
      } else if (remainingScroll > getReleaseEpsilon()) {
        isScrollComplete = false;
      }

      const progress = isScrollComplete ? 1 : rawProgress;
      latestProgress = progress;
      const easedProgress = progress * progress * (3 - 2 * progress);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
        progressBarRef.current.dataset.complete = String(isScrollComplete);
      }

      if (video.readyState >= 2 && video.duration) {
        const endTime = getFinalHoldTime();
        const visualProgress = progress;
        const targetTime = visualProgress >= 1 ? endTime : visualProgress * endTime;

        if (visualProgress < 1) {
          if (isEndFrameFrozen || isPreparingEndFrame) {
            hideFrozenFrame();
          }

          if (Math.abs(video.currentTime - targetTime) > 0.015) {
            video.currentTime = targetTime;
          }
        } else {
          freezeEndFrame(endTime);
        }
      }

      if (headlineRef.current) {
        headlineRef.current.style.setProperty('--headline-parallax-y', `${-easedProgress * 28}px`);
        headlineRef.current.style.setProperty('--headline-parallax-scale', `${1 + easedProgress * 0.012}`);
      }
    };

    const tick = () => {
      syncToScroll();
      rafId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      cacheContainerTop();
      syncToScroll();
    };

    cacheContainerTop();
    syncToScroll();
    video.addEventListener('loadeddata', handleLoadedData);
    video.load();
    rafId = requestAnimationFrame(tick);
    window.addEventListener('scroll', syncToScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      freezeToken += 1;
      clearFreezeTimeout();
      video.removeEventListener('loadeddata', handleLoadedData);
      window.removeEventListener('scroll', syncToScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '700vh' }}>
      {/* Sticky frame releases naturally when the container is scrolled past */}
      <div
        className="hero-frame sticky flex flex-col overflow-hidden md:flex-row"
        style={{
          top: 'calc(var(--site-nav-height) + var(--hero-nav-gap))',
          height: 'calc(100vh - var(--site-nav-height) - var(--hero-nav-gap))',
        }}
      >
        <div className="thread-sweep pointer-events-none absolute inset-0 z-[1]" />

        {/* Left panel: headline against the page gradient */}
        <div className="z-10 flex h-[56vh] w-full shrink-0 select-none flex-col justify-end px-8 pb-8 pt-20 sm:px-12 md:h-auto md:w-[45%] md:justify-center md:px-16 md:py-0">
          <span className="mb-6 text-[11px] font-semibold uppercase tracking-[0.45em] text-[var(--stitch-gold)]">
            Batesville & Brookville
          </span>

          <h1
            ref={headlineRef}
            className="headline-parallax brand-heading text-4xl font-normal leading-[0.95] text-white sm:text-6xl md:text-[56px] lg:text-[68px] xl:text-[78px]"
          >
            The
            <br />
            <span className="text-[var(--stitch-gold)]">Stitchery</span>
          </h1>

          <p className="mt-7 max-w-[28rem] text-base font-light leading-relaxed text-white/68">
            Alterations, embroidery, custom sewing, and formalwear fittings handled with a careful hand.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="brand-button brand-button-primary" href="#appointments">
              Schedule a fitting
            </a>
            <a className="brand-button brand-button-secondary" href="#services">
              View services
            </a>
          </div>

          <div className="mt-8 hidden flex-col items-start gap-2 opacity-45 sm:flex md:mt-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-white">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white animate-bounce">
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right panel: video, sized to fill its column exactly */}
        <div className="video-stage relative min-h-0 flex-1 overflow-hidden">
          {/* Feather the left edge so the video blends into the gradient */}
          <div className="video-left-vignette absolute inset-0 pointer-events-none z-10" />

          <video
            ref={videoRef}
            className="absolute inset-y-0 right-0 z-10 h-full w-full object-contain object-right"
            src="/Clean%20360%20Tuxedo%20Animation.mp4"
            muted
            playsInline
            preload="auto"
          />
          <canvas
            ref={frozenFrameRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-[15] h-full w-full object-contain object-right opacity-0"
          />

          <div className="absolute bottom-8 right-8 z-30 hidden max-w-[15rem] border border-white/15 bg-[rgba(3,8,23,0.62)] p-5 text-white shadow-2xl backdrop-blur-md lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--stitch-gold)]">
              Timeline Tux
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed text-white/72">
              Suit and tux rental support for weddings, proms, and special events.
            </p>
          </div>
        </div>

        {/* Scroll progress bar spanning the full width */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-px overflow-hidden bg-white/10">
          <div ref={progressBarRef} className="progress-fill h-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}
