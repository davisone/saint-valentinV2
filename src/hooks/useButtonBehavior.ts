import { useCallback, useEffect, useRef } from 'react';
import { ButtonAI } from '../systems/ButtonAI';
import { useButtonStore } from '../store/useButtonStore';
import { useGameStore } from '../store/useGameStore';
import { UNIVERSES } from '../config/universes';
import { MouseState } from './useMousePhysics';

export function useButtonBehavior(mouse: MouseState) {
  const aiRef = useRef<ButtonAI | null>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const lastEscapeCountRef = useRef<number>(0);

  const currentUniverse = useGameStore((s) => s.currentUniverse);
  const setPosition = useButtonStore((s) => s.setPosition);
  const setVisible = useButtonStore((s) => s.setVisible);
  const setBehavior = useButtonStore((s) => s.setBehavior);
  const updateEmotion = useButtonStore((s) => s.updateEmotion);
  const setComfortRadius = useButtonStore((s) => s.setComfortRadius);
  const incrementEscape = useButtonStore((s) => s.incrementEscape);

  // Initialize AI for current universe
  useEffect(() => {
    const config = UNIVERSES[currentUniverse];
    aiRef.current = new ButtonAI(
      config.index,
      config.buttonComfortRadius,
      config.buttonBehaviors,
      config.buttonTrust,
    );
    setComfortRadius(config.buttonComfortRadius);
    lastEscapeCountRef.current = 0;
  }, [currentUniverse, setComfortRadius]);

  // Animation loop
  useEffect(() => {
    const tick = () => {
      const ai = aiRef.current;
      if (!ai) return;

      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const state = ai.update(mouse.x, mouse.y, dt);

      setPosition(state.position);
      setVisible(state.isVisible);
      setBehavior(state.behavior);
      updateEmotion(state.emotional);

      // Sync escape count from AI to store
      if (state.escapeCount > lastEscapeCountRef.current) {
        const diff = state.escapeCount - lastEscapeCountRef.current;
        for (let i = 0; i < diff; i++) {
          incrementEscape();
        }
        lastEscapeCountRef.current = state.escapeCount;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mouse.x, mouse.y, setPosition, setVisible, setBehavior, updateEmotion, incrementEscape]);

  const getAI = useCallback(() => aiRef.current, []);

  return { getAI };
}
