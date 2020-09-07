import { useState, useEffect } from 'react';

import { useUnauthorizedApi } from './useDataApi';

export default function useServerMessage() {
  const [loading, setLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState('');

  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    setLoading(true);
    unauthorizedApi()
      .getServerMessage()
      .then(data => {
        if (data.serverMessage) {
          setServerMessage(data.serverMessage);
        }

        setLoading(false);
      });
  }, [unauthorizedApi]);

  return { loading, serverMessage } as const;
}
