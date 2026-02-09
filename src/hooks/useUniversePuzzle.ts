import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { UniverseIndex, PuzzleState } from '../types/universe';

export function useUniversePuzzle(universeIndex: UniverseIndex) {
  const puzzleState = useGameStore(
    (s) => s.universeStates[universeIndex]?.puzzle,
  );
  const updatePuzzle = useGameStore((s) => s.updatePuzzle);
  const advanceToNextUniverse = useGameStore((s) => s.advanceToNextUniverse);

  const startPuzzle = useCallback(() => {
    updatePuzzle(universeIndex, { isActive: true });
  }, [universeIndex, updatePuzzle]);

  const attempt = useCallback(() => {
    const current = puzzleState;
    updatePuzzle(universeIndex, { attempts: (current?.attempts ?? 0) + 1 });
  }, [universeIndex, puzzleState, updatePuzzle]);

  const solve = useCallback(() => {
    updatePuzzle(universeIndex, { isSolved: true, isActive: false });
  }, [universeIndex, updatePuzzle]);

  const updateData = useCallback(
    (data: Partial<PuzzleState['data']>) => {
      updatePuzzle(universeIndex, {
        data: { ...puzzleState?.data, ...data },
      });
    },
    [universeIndex, puzzleState, updatePuzzle],
  );

  const complete = useCallback(() => {
    solve();
    // Small delay before transition
    setTimeout(() => {
      advanceToNextUniverse();
    }, 1500);
  }, [solve, advanceToNextUniverse]);

  return {
    puzzle: puzzleState ?? { isActive: false, isSolved: false, attempts: 0, data: {} },
    startPuzzle,
    attempt,
    solve,
    updateData,
    complete,
  };
}
