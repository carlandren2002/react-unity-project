// hooks/useProgress.ts
import { useState } from 'react';

/**
 * A hook to manage a progress bar.
 *
 * The progress is given as a number between 0 and 100, and is
 * automatically clamped to that range.
 *
 * @returns An object with two properties. The first is the current
 * progress, and the second is a function which can be called to
 * update the progress.
 */
const useProgress = () => {
  const [progress, setProgress] = useState(0);

  const updateProgress = (newProgress: number) => {
    setProgress(Math.min(Math.max(newProgress, 0), 100));
  };

  return { progress, setProgress: updateProgress };
};

export default useProgress;