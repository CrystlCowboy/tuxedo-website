'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frozenFrameRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

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
    let scrubSeekToken = 0;
    let pendingScrubTime: number | null = null;
    let isScrubSeekInFlight = false;

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

    const cancelScrubSeek = () => {
      scrubSeekToken += 1;
      pendingScrubTime = null;
      isScrubSeekInFlight = false;
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

      cancelScrubSeek();
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

    const scheduleScrubSeek = (targetTime: number) => {
      if (!Number.isFinite(targetTime)) return;

      pendingScrubTime = targetTime;
      if (isScrubSeekInFlight) return;

      const applyPendingSeek = () => {
        const nextTime = pendingScrubTime;
        pendingScrubTime = null;

        if (nextTime === null) {
          isScrubSeekInFlight = false;
          return;
        }

        if (Math.abs(video.currentTime - nextTime) <= 0.015) {
          isScrubSeekInFlight = false;
          if (pendingScrubTime !== null) {
            window.requestAnimationFrame(applyPendingSeek);
          }
          return;
        }

        isScrubSeekInFlight = true;
        const token = scrubSeekToken + 1;
        scrubSeekToken = token;

        const finishSeek = () => {
          video.removeEventListener('seeked', finishSeek);
          window.clearTimeout(seekTimeoutId);

          if (token !== scrubSeekToken) return;

          if (pendingScrubTime !== null && Math.abs(video.currentTime - pendingScrubTime) > 0.015) {
            window.requestAnimationFrame(applyPendingSeek);
            return;
          }

          isScrubSeekInFlight = false;
        };

        video.addEventListener('seeked', finishSeek);
        const seekTimeoutId = window.setTimeout(finishSeek, 120);
        video.currentTime = nextTime;
      };

      applyPendingSeek();
    };

    const handleLoadedData = () => {
      syncToScroll();
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
      const isMobileHero = window.matchMedia('(max-width: 767px)').matches;
      const isTabletHero = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
      const subjectScaleRange = isMobileHero ? 0.04 : isTabletHero ? 0.05 : 0.06;
      const subjectDriftRange = isMobileHero ? 8 : isTabletHero ? 11 : 15;
      const threadDriftRange = isMobileHero ? 5 : isTabletHero ? 7 : 10;

      container.style.setProperty('--hero-scroll-progress', `${progress}`);
      container.style.setProperty('--hero-scroll-eased', `${easedProgress}`);
      container.style.setProperty('--hero-subject-scale', `${1 + easedProgress * subjectScaleRange}`);
      container.style.setProperty('--hero-subject-drift', `${easedProgress * subjectDriftRange}px`);
      container.style.setProperty('--hero-thread-drift', `${easedProgress * threadDriftRange}px`);
      container.dataset.heroActive = progress > 0.002 && progress < 0.998 ? 'true' : 'false';

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
        progressBarRef.current.dataset.complete = String(isScrollComplete);
      }

      if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        const endTime = getFinalHoldTime();
        const visualProgress = progress;
        const targetTime = visualProgress >= 1 ? endTime : visualProgress * endTime;

        if (visualProgress < 1) {
          if (isEndFrameFrozen || isPreparingEndFrame) {
            hideFrozenFrame();
          }

          scheduleScrubSeek(targetTime);
        } else {
          freezeEndFrame(endTime);
        }
      }

      if (headlineRef.current) {
        const parallaxDistance = isMobileHero ? 14 : 28;
        const parallaxScale = isMobileHero ? 0.006 : 0.012;
        headlineRef.current.style.setProperty('--headline-parallax-y', `${-easedProgress * parallaxDistance}px`);
        headlineRef.current.style.setProperty('--headline-parallax-scale', `${1 + easedProgress * parallaxScale}`);
      }

      if (isMobileHero && scrollPromptRef.current) {
        const promptOpacity = progress <= 0.8 ? 1 : Math.max(0, (1 - progress) / 0.2);
        scrollPromptRef.current.style.opacity = promptOpacity.toFixed(3);
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
    video.addEventListener('loadedmetadata', handleLoadedData);
    video.addEventListener('loadeddata', handleLoadedData);
    video.load();
    rafId = requestAnimationFrame(tick);
    window.addEventListener('scroll', syncToScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      freezeToken += 1;
      cancelScrubSeek();
      clearFreezeTimeout();
      video.removeEventListener('loadedmetadata', handleLoadedData);
      video.removeEventListener('loadeddata', handleLoadedData);
      window.removeEventListener('scroll', syncToScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="video-scroll-shell h-[400vh] md:h-[700vh]">
      {/* Sticky frame releases naturally when the container is scrolled past */}
      <div className="hero-frame sticky flex flex-col overflow-hidden md:flex-row">
        <div className="hero-diagonal-panel pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true" />
        <div className="hero-diagonal-accent pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true" />
        <div className="thread-sweep pointer-events-none absolute inset-0 z-[1]" />
        <div ref={scrollPromptRef} className="mobile-scroll-prompt md:hidden" aria-hidden="true">
          <span>Scroll</span>
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Left panel: headline on the diagonal navy overlay */}
        <div className="hero-copy-panel z-10 flex w-full shrink-0 select-none flex-col px-6 pb-3 pt-5 sm:px-8 md:h-auto md:w-[45%] md:justify-center md:px-16 md:py-0">
          <div className="hero-copy-content">
            <span className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-[var(--stitch-gold)] md:mb-6 md:text-[11px] md:tracking-[0.45em]">
              Batesville & Versailles
            </span>

            <h1
              ref={headlineRef}
              className="headline-parallax brand-heading text-[2.35rem] font-normal leading-[0.92] text-white sm:text-5xl md:text-[56px] md:leading-[0.95] lg:text-[68px] xl:text-[78px]"
            >
              Tuxedo
              <br />
              <span className="text-[var(--stitch-gold)]">Shop</span>
            </h1>

            <p className="mt-7 hidden max-w-[28rem] text-base font-light leading-relaxed text-white/68 md:block">
              Alterations, embroidery, custom sewing, and formalwear fittings handled with a careful hand.
            </p>

            <div className="mt-8 hidden flex-wrap items-center gap-3 md:flex">
              <a className="brand-button brand-button-primary" href="#appointments">
                Schedule a fitting
              </a>
              <a className="brand-button brand-button-secondary" href="#services">
                View services
              </a>
            </div>

            <div className="mt-8 hidden flex-col items-start gap-2 opacity-45 md:mt-10 md:flex">
              <span className="text-[10px] uppercase tracking-[0.35em] text-white">Scroll</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white animate-bounce">
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Studio backdrop and raw video subject */}
        <div className="video-stage relative m-0 min-h-0 w-full flex-1 overflow-hidden md:mx-0 md:h-auto md:max-h-none md:min-h-0 md:w-auto md:flex-1">
          <video
            ref={videoRef}
            className="hero-subject-media hero-video-element absolute left-1/2 top-1/2 z-10 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center md:inset-y-0 md:left-auto md:right-0 md:top-auto md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:object-right"
            src="/Clean%20360%20Tuxedo%20Animation.mp4"
            muted
            playsInline
            preload="auto"
          />
          <canvas
            ref={frozenFrameRef}
            aria-hidden="true"
            className="hero-subject-media pointer-events-none absolute left-1/2 top-1/2 z-[15] h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-contain object-center opacity-0 md:inset-y-0 md:left-auto md:right-0 md:top-auto md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:object-right"
          />

        </div>

        <div className="hero-timeline-card absolute bottom-8 right-8 z-[60] hidden max-w-[15rem] border border-[color:rgba(215,166,32,0.28)] bg-[rgba(6,17,38,0.78)] p-5 text-white shadow-2xl xl:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--stitch-gold)]">
            Anytime Tuxedos
          </p>
          <p className="mt-3 text-sm font-light leading-relaxed text-white/72">
            Suit and tux rental support for weddings, proms, and special events.
          </p>
        </div>

        {/* Scroll progress bar spanning the full width */}
        <div className="absolute bottom-0 left-0 right-0 z-[70] h-[3px] overflow-hidden bg-white/15 md:h-px md:bg-white/10">
          <div ref={progressBarRef} className="progress-fill h-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}
