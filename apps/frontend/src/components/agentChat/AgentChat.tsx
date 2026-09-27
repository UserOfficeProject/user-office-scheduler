import '@n8n/chat/style.css';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useTheme } from '@mui/material/styles';
import { createChat } from '@n8n/chat';
import React, { useContext, useEffect, useRef } from 'react';

import { SettingsContext } from 'context/SettingsContextProvider';
import { UserContext } from 'context/UserContext';
import { SettingsId, UserRole } from 'generated/sdk';

const CHAT_TARGET_ID = 'n8n-chat';
const CHAT_SESSION_STORAGE_KEY = 'n8n-chat/sessionId';

const AgentChat = () => {
  const theme = useTheme();
  const { token, user, currentRole } = useContext(UserContext);
  const { settings } = useContext(SettingsContext);

  const webhookUrl = settings.get(
    SettingsId.N8N_CHAT_WEBHOOK_URL
  )?.settingsValue;
  const isEnabled = !!webhookUrl && currentRole === UserRole.USER_OFFICER;

  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!isEnabled || !webhookUrl) {
      return;
    }

    const metadata = {
      get token() {
        return tokenRef.current;
      },
    };
    const headers = {
      get Authorization() {
        return `Bearer ${tokenRef.current}`;
      },
    };

    const chat = createChat({
      webhookUrl,
      webhookConfig: { method: 'POST', headers },
      metadata,
      target: `#${CHAT_TARGET_ID}`,
      mode: 'window',
      loadPreviousSession: false,
      showWelcomeScreen: false,
      initialMessages: ['Hi! How can I help you today?'],
      i18n: {
        en: {
          title: 'Assistant',
          subtitle: 'Ask me anything about your work in the Scheduler.',
          footer: '',
          getStarted: 'New conversation',
          inputPlaceholder: 'Type your question...',
          closeButtonTooltip: 'Close chat',
        },
      },
    });

    return () => {
      chat.unmount();
      document.getElementById(CHAT_TARGET_ID)?.remove();
      localStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
    };
  }, [isEnabled, webhookUrl, user.id]);

  if (!isEnabled) {
    return null;
  }

  return (
    <GlobalStyles
      styles={{
        ':root': {
          '--chat--color--primary': theme.palette.primary.main,
          '--chat--color--primary-shade-50': theme.palette.primary.dark,
          '--chat--color--primary--shade-100': theme.palette.primary.dark,
          '--chat--color--secondary': theme.palette.secondary.main,
          '--chat--color-secondary-shade-50': theme.palette.secondary.dark,
          '--chat--font-family': theme.typography.fontFamily,
          '--chat--window--z-index': theme.zIndex.modal,
        },
      }}
    />
  );
};

export default AgentChat;
