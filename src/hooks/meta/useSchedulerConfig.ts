import { useState, useEffect } from 'react';

import { SchedulerConfig } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

let cachedConfig: SchedulerConfig | null = null;

export default function useSchedulerConfig() {
  const [config, setConfig] = useState<SchedulerConfig | null>(cachedConfig);
  const [loading, setIsLoading] = useState<boolean>(cachedConfig === null);
  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    let unmount = false;
    if (config !== null) {
      return;
    }

    setIsLoading(true);
    unauthorizedApi()
      .getSchedulerConfig()
      .then(conf => {
        cachedConfig = conf.schedulerConfig;

        if (unmount) {
          return;
        }

        setConfig(conf.schedulerConfig);
        setIsLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [config, unauthorizedApi]);

  return { config, loading } as const;
}
