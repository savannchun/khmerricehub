import { useEffect, useState } from "react";

// Loads async data (e.g. from the Firestore-backed services layer).
// Returns [data, setData, loading]. `initial` is shown first so the
// page renders instantly, then live data replaces it when available.
export function useAsyncData(loader, initial, deps = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loader()
      .then((result) => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [data, setData, loading];
}
