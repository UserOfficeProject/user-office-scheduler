declare module '@n8n/chat' {
  export interface ChatOptions {
    webhookUrl: string;
    webhookConfig?: {
      method?: 'GET' | 'POST';
      headers?: Record<string, string>;
    };
    target?: string | Element;
    mode?: 'window' | 'fullscreen';
    showWindowCloseButton?: boolean;
    showWelcomeScreen?: boolean;
    loadPreviousSession?: boolean;
    sessionId?: string;
    initialMessages?: string[];
    metadata?: Record<string, unknown>;
    i18n?: Record<
      string,
      {
        title: string;
        subtitle: string;
        footer: string;
        getStarted: string;
        inputPlaceholder: string;
        closeButtonTooltip: string;
        [message: string]: string;
      }
    >;
    enableStreaming?: boolean;
  }

  export function createChat(options?: Partial<ChatOptions>): {
    unmount(): void;
  };
}
