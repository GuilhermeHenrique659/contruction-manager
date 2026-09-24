import { useCallback, useRef, useState } from 'react';

type FormValues = Record<string, string>;

export function useForm<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const initialValuesRef = useRef(initialValues);

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
  }, []);

  return { values, setField, reset };
}
