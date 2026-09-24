import { useCallback, useRef, useState } from 'react';

export function useAsyncAction() {
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);

  const run = useCallback(
    async (action: () => Promise<void>): Promise<boolean> => {
      if (runningRef.current) return false;
      runningRef.current = true;
      setIsRunning(true);
      try {
        await action();
        return true;
      } catch {
        return false;
      } finally {
        runningRef.current = false;
        setIsRunning(false);
      }
    },
    [],
  );

  return { isRunning, run };
}
