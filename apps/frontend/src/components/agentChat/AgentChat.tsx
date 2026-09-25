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
  const isEnabled =
    !!webhookUrl && currentRole === UserRole.INSTRUMENT_SCIENTIST;

  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!isEnabled || !webhookUrl) {
      return;
    }

    // The chat widget keeps these objects and serialises them on every request,
    // so the getters forward the latest (renewed) token to the agent.
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
      initialMessages: [
        'Hi! I can book experiment time, set local contacts and approve visits. Which proposal and user should I help with?',
      ],
      i18n: {
        en: {
          title: 'Scheduler Assistant',
          subtitle:
            'Book experiment time, set local contacts and approve visits.',
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
      // Start a fresh conversation (and agent memory) for the next user or role.
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
