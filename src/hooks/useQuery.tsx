import { jobService } from '@/services/jobService';
import type { UseQueryResult } from '@/types';
import { useState, useEffect, useRef } from 'react';



const useQueryWithDebounce = (param?: string, delay: number = 300): UseQueryResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (param === undefined) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set loading state only after delay
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await jobService.filterJob(param);
        setData(result);
      } catch (err: any) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [param, delay]);

  return { data, loading, error };
};

export default useQueryWithDebounce;