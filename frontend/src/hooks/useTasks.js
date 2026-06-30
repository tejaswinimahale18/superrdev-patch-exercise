import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const delayDebounce = setTimeout(() => {
      fetchTasks({ query, status, page, pageSize })
        .then((data) => {
          if (isMounted) {
            setTasks(data.items || []);
            setTotal(data.total || 0);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            setLoading(false);
          }
        });
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounce);
    };
  }, [query, status, page, pageSize]);

  return { tasks, total, loading, error };
}
