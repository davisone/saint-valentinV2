import gsap from 'gsap';
import { UniverseIndex } from '../types/universe';

export type TransitionType =
  | 'fadeBlack'
  | 'dissolveWaves'
  | 'glassBurst'
  | 'lightFlood'
  | 'particleMorph';

interface TransitionConfig {
  from: UniverseIndex;
  to: UniverseIndex;
  type: TransitionType;
  duration: number;
}

const TRANSITION_MAP: TransitionConfig[] = [
  { from: 0, to: 1, type: 'fadeBlack', duration: 3 },
  { from: 1, to: 2, type: 'dissolveWaves', duration: 4 },
  { from: 2, to: 3, type: 'fadeBlack', duration: 3.5 },
  { from: 3, to: 4, type: 'fadeBlack', duration: 3.5 },
  { from: 4, to: 5, type: 'fadeBlack', duration: 3.5 },
  { from: 5, to: 6, type: 'glassBurst', duration: 4 },
  { from: 6, to: 7, type: 'fadeBlack', duration: 3.5 },
  { from: 7, to: 8, type: 'fadeBlack', duration: 3 },
  { from: 8, to: 9, type: 'lightFlood', duration: 5 },
];

export class TransitionOrchestrator {
  private overlayElement: HTMLElement | null = null;

  setOverlay(element: HTMLElement): void {
    this.overlayElement = element;
  }

  getConfig(from: UniverseIndex, to: UniverseIndex): TransitionConfig {
    return (
      TRANSITION_MAP.find((t) => t.from === from && t.to === to) ?? {
        from,
        to,
        type: 'fadeBlack' as TransitionType,
        duration: 3,
      }
    );
  }

  async execute(
    from: UniverseIndex,
    to: UniverseIndex,
    onMidpoint: () => void,
  ): Promise<void> {
    const config = this.getConfig(from, to);
    const overlay = this.overlayElement;
    if (!overlay) {
      onMidpoint();
      return;
    }

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      switch (config.type) {
        case 'fadeBlack':
          this.fadeBlack(tl, overlay, config.duration, onMidpoint);
          break;
        case 'dissolveWaves':
          this.dissolveWaves(tl, overlay, config.duration, onMidpoint);
          break;
        case 'glassBurst':
          this.glassBurst(tl, overlay, config.duration, onMidpoint);
          break;
        case 'lightFlood':
          this.lightFlood(tl, overlay, config.duration, onMidpoint);
          break;
        case 'particleMorph':
          this.fadeBlack(tl, overlay, config.duration, onMidpoint);
          break;
      }
    });
  }

  private fadeBlack(
    tl: gsap.core.Timeline,
    overlay: HTMLElement,
    duration: number,
    onMidpoint: () => void,
  ): void {
    const half = duration / 2;
    tl.set(overlay, {
      display: 'block',
      opacity: 0,
      background: 'black',
    })
      .to(overlay, { opacity: 1, duration: half, ease: 'power2.in' })
      .call(onMidpoint)
      .to(overlay, { opacity: 0, duration: half, ease: 'power2.out' })
      .set(overlay, { display: 'none' });
  }

  private dissolveWaves(
    tl: gsap.core.Timeline,
    overlay: HTMLElement,
    duration: number,
    onMidpoint: () => void,
  ): void {
    const half = duration / 2;
    tl.set(overlay, {
      display: 'block',
      opacity: 0,
      background: 'linear-gradient(180deg, #0a1f0a 0%, #0a0a2f 100%)',
    })
      .to(overlay, {
        opacity: 1,
        duration: half,
        ease: 'sine.inOut',
      })
      .call(onMidpoint)
      .to(overlay, {
        opacity: 0,
        duration: half,
        ease: 'sine.inOut',
      })
      .set(overlay, { display: 'none' });
  }

  private glassBurst(
    tl: gsap.core.Timeline,
    overlay: HTMLElement,
    duration: number,
    onMidpoint: () => void,
  ): void {
    const half = duration / 2;
    tl.set(overlay, {
      display: 'block',
      opacity: 0,
      background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)',
    })
      .to(overlay, {
        opacity: 1,
        scale: 3,
        duration: half,
        ease: 'power3.in',
      })
      .call(onMidpoint)
      .to(overlay, {
        opacity: 0,
        scale: 1,
        duration: half,
        ease: 'power3.out',
      })
      .set(overlay, { display: 'none' });
  }

  private lightFlood(
    tl: gsap.core.Timeline,
    overlay: HTMLElement,
    duration: number,
    onMidpoint: () => void,
  ): void {
    const half = duration / 2;
    tl.set(overlay, {
      display: 'block',
      opacity: 0,
      background: 'radial-gradient(circle at 50% 100%, #ffd700 0%, #fff8dc 50%, white 100%)',
    })
      .to(overlay, {
        opacity: 1,
        duration: half * 1.5,
        ease: 'power1.in',
      })
      .call(onMidpoint)
      .to(overlay, {
        opacity: 0,
        duration: half * 0.5,
        ease: 'power4.out',
      })
      .set(overlay, { display: 'none' });
  }
}

export const transitionOrchestrator = new TransitionOrchestrator();
