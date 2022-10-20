import React, { useContext, useEffect } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

import { SettingsContext } from 'context/SettingsContextProvider';
import { UserContext } from 'context/UserContext';
import { SettingsId } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

const ExternalAuthQueryParams = {
  code: StringParam,
};

function ExternalAuth() {
  const [urlQueryParams] = useQueryParams(ExternalAuthQueryParams);

  const unauthorizedApi = useUnauthorizedApi();
  const { settings } = useContext(SettingsContext);
  const { handleNewToken } = useContext(UserContext);
  const [statusMessage, setStatusMessage] = React.useState('Loading...');

  useEffect(() => {
    const handleCode = (code: string) => {
      setStatusMessage('Logging in...');
      const { protocol, host, pathname } = window.location;
      const redirectUri = [protocol, '//', host, pathname].join('');

      unauthorizedApi()
        .externalTokenLogin({
          externalToken: code,
          redirectUri: redirectUri,
        })
        .then(({ externalTokenLogin }) => {
          if (externalTokenLogin.token) {
            handleNewToken(externalTokenLogin.token);
            window.location.assign('/');
          } else {
            setStatusMessage(
              externalTokenLogin.rejection?.reason ?? 'Login failed.'
            );
          }
        });
    };

    const handleNoCode = () => {
      const externalAuthLoginUrl = settings.get(
        SettingsId.EXTERNAL_AUTH_LOGIN_URL
      )?.settingsValue;
      if (!externalAuthLoginUrl) {
        setStatusMessage('System configuration error');

        return;
      }
      const url = new URL(externalAuthLoginUrl);
      url.searchParams.set('redirect_uri', window.location.href);
      window.location.href = url.toString();
      setStatusMessage('Redirecting to auth page...');
    };

    const code = urlQueryParams.code;
    if (code) {
      handleCode(code);
    } else {
      handleNoCode();
    }
  }, [settings, unauthorizedApi, urlQueryParams.code, handleNewToken]);

  return <span>{statusMessage}</span>;
}

export default ExternalAuth;
