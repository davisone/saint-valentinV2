import { ButtonBehaviorType } from '../types/universe';
import { ButtonEmotionalState, ButtonPosition } from '../types/button';
import { distance, angle, randomInRange, clamp, lerp } from '../utils/math';
import { clampToViewport, getViewportSize } from '../utils/dom';

export interface ButtonAIState {
  position: ButtonPosition;
  isVisible: boolean;
  behavior: ButtonBehaviorType;
  emotional: ButtonEmotionalState;
  comfortRadius: number;
  escapeCount: number;
}

export class ButtonAI {
  private state: ButtonAIState;
  private behaviors: ButtonBehaviorType[];
  private universeIndex: number;
  private lastFleeTime = 0;
  private feintDirection: number | null = null;

  constructor(
    universeIndex: number,
    comfortRadius: number,
    behaviors: ButtonBehaviorType[],
    initialTrust: number,
  ) {
    this.universeIndex = universeIndex;
    this.behaviors = behaviors;
    const { width, height } = getViewportSize();
    this.state = {
      position: { x: width / 2, y: height / 2 },
      isVisible: true,
      behavior: behaviors[0] || 'flee',
      emotional: {
        trust: initialTrust,
        curiosity: clamp(50 + universeIndex * 5, 0, 100),
        courage: clamp(20 + universeIndex * 8, 0, 100),
        playfulness: clamp(80 - universeIndex * 5, 0, 100),
        fatigue: 0,
      },
      comfortRadius,
      escapeCount: 0,
    };
  }

  getState(): ButtonAIState {
    return { ...this.state };
  }

  update(mouseX: number, mouseY: number, deltaTime: number): ButtonAIState {
    const dist = distance(
      mouseX, mouseY,
      this.state.position.x, this.state.position.y,
    );

    // Update fatigue
    if (this.state.emotional.fatigue < 100) {
      this.state.emotional.fatigue = clamp(
        this.state.emotional.fatigue + deltaTime * 0.5,
        0,
        100,
      );
    }

    // Choose behavior based on distance and emotional state
    if (dist < this.state.comfortRadius) {
      this.executeBehavior(mouseX, mouseY, dist, deltaTime);
    } else {
      // Idle animation — gentle drift
      this.idle(deltaTime);
    }

    return this.getState();
  }

  private executeBehavior(
    mouseX: number,
    mouseY: number,
    dist: number,
    _deltaTime: number,
  ): void {
    const behavior = this.selectBehavior(dist);
    this.state.behavior = behavior;

    switch (behavior) {
      case 'flee':
        this.flee(mouseX, mouseY, dist);
        break;
      case 'feint':
        this.feint(mouseX, mouseY);
        break;
      case 'hesitate':
        this.hesitate(mouseX, mouseY, dist);
        break;
      case 'hide':
        this.hide();
        break;
      case 'disguise':
        // Handled by universe component
        break;
      case 'reflection':
        // Button exists only in reflections — handled by universe component
        break;
      case 'serene':
        this.serene(mouseX, mouseY);
        break;
      case 'flicker':
        this.flicker();
        break;
      case 'waxSeal':
        // Handled by U08 component
        break;
      case 'still':
        // Do nothing — the button is still
        break;
      case 'vulnerable':
        // Do nothing — the button is vulnerable and waiting
        break;
      case 'appear':
        this.state.isVisible = true;
        break;
      case 'trustGrow':
        this.state.emotional.trust = clamp(
          this.state.emotional.trust + 0.1,
          0,
          100,
        );
        break;
    }
  }

  private selectBehavior(dist: number): ButtonBehaviorType {
    const { trust, fatigue, playfulness } = this.state.emotional;

    // High trust = less fleeing
    if (trust > 80) {
      return this.behaviors.includes('trustGrow') ? 'trustGrow' : this.behaviors[this.behaviors.length - 1];
    }

    // Tired = hesitate more
    if (fatigue > 70 && this.behaviors.includes('hesitate')) {
      return 'hesitate';
    }

    // Close and playful = feint
    if (dist < this.state.comfortRadius * 0.5 && playfulness > 50 && this.behaviors.includes('feint')) {
      return 'feint';
    }

    // Default to primary behavior
    return this.behaviors[0];
  }

  private flee(mouseX: number, mouseY: number, dist: number): void {
    const now = Date.now();
    // Throttle: wait at least 600ms between flee jumps so user can attempt to click
    if (now - this.lastFleeTime < 600) return;
    this.lastFleeTime = now;

    const fleeAngle = angle(mouseX, mouseY, this.state.position.x, this.state.position.y);
    const fleeDistance = randomInRange(50, 100) * (1 - this.state.emotional.fatigue / 200);
    const jitter = randomInRange(-0.5, 0.5);

    const newX = this.state.position.x + Math.cos(fleeAngle + jitter) * fleeDistance;
    const newY = this.state.position.y + Math.sin(fleeAngle + jitter) * fleeDistance;

    const clamped = clampToViewport(newX, newY, 60);
    this.state.position = clamped;
    this.state.escapeCount++;
  }

  private feint(mouseX: number, mouseY: number): void {
    // Move toward cursor briefly, then flee
    if (this.feintDirection === null) {
      this.feintDirection = 1; // toward
      setTimeout(() => {
        this.feintDirection = -1; // away
        setTimeout(() => {
          this.feintDirection = null;
        }, 200);
      }, 150);
    }

    const a = angle(
      this.state.position.x,
      this.state.position.y,
      mouseX,
      mouseY,
    );
    const step = 30 * (this.feintDirection ?? -1);
    const newX = this.state.position.x + Math.cos(a) * step;
    const newY = this.state.position.y + Math.sin(a) * step;

    const clamped = clampToViewport(newX, newY, 60);
    this.state.position = clamped;
  }

  private hesitate(mouseX: number, mouseY: number, dist: number): void {
    // Tremble in place with slight drift away
    const a = angle(mouseX, mouseY, this.state.position.x, this.state.position.y);
    const trembleX = randomInRange(-3, 3);
    const trembleY = randomInRange(-3, 3);
    const driftFactor = dist < this.state.comfortRadius * 0.3 ? 5 : 1;

    this.state.position = clampToViewport(
      this.state.position.x + trembleX + Math.cos(a) * driftFactor,
      this.state.position.y + trembleY + Math.sin(a) * driftFactor,
      60,
    );
  }

  private hide(): void {
    this.state.isVisible = false;
    // Reappear after a delay
    setTimeout(() => {
      const { width, height } = getViewportSize();
      this.state.position = clampToViewport(
        randomInRange(100, width - 100),
        randomInRange(100, height - 100),
        60,
      );
      this.state.isVisible = true;
    }, 1500);
  }

  private serene(mouseX: number, mouseY: number): void {
    // Gentle drift — doesn't flee, just floats slightly
    const a = angle(mouseX, mouseY, this.state.position.x, this.state.position.y);
    const drift = 2;
    this.state.position = clampToViewport(
      this.state.position.x + Math.cos(a) * drift + randomInRange(-1, 1),
      this.state.position.y + Math.sin(a) * drift + randomInRange(-1, 1),
      60,
    );
  }

  private flicker(): void {
    // Flicker visibility like a candle
    if (Math.random() < 0.05) {
      this.state.isVisible = false;
      setTimeout(() => {
        this.state.isVisible = true;
      }, randomInRange(50, 200));
    }
  }

  private idle(deltaTime: number): void {
    // Gentle floating motion
    const time = Date.now() / 1000;
    this.state.position = {
      x: this.state.position.x + Math.sin(time * 0.5) * 0.3,
      y: this.state.position.y + Math.cos(time * 0.7) * 0.3,
    };

    // Recover fatigue while idle
    this.state.emotional.fatigue = clamp(
      this.state.emotional.fatigue - deltaTime * 2,
      0,
      100,
    );
  }

  setPosition(pos: ButtonPosition): void {
    this.state.position = pos;
  }

  setVisible(v: boolean): void {
    this.state.isVisible = v;
  }

  getEscapeCount(): number {
    return this.state.escapeCount;
  }

  shouldTransition(): boolean {
    // In U00, transition after ~8 escape attempts
    if (this.universeIndex === 0) {
      return this.state.escapeCount >= 8;
    }
    return false;
  }
}
