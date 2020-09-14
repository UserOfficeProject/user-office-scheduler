import { useState, useEffect } from 'react';

import { useUnauthorizedApi } from './useDataApi';

export default function useServerMessage() {
  const [loading, setLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState<{} | null>(null);

  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    setLoading(true);
    unauthorizedApi()
      .serverHealthCheck()
      .then(data => {
        if (data.healthCheck) {
          setServerMessage(data.healthCheck);
        }

        setLoading(false);
      });
  }, [unauthorizedApi]);

  return { loading, serverMessage } as const;
}
