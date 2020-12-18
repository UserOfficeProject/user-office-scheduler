import React, { createContext, useState } from 'react';

import AlertDialog, {
  AlertOptionalOptions,
} from 'components/common/AlertDialog';
import ConfirmationDialog, {
  ConfirmationOptionalOptions,
} from 'components/common/ConfirmationDialog';
import Loader from 'components/common/Loader';

type DialogMessage = React.ReactNode | string;

type ConfirmationParams = {
  message: DialogMessage;
  cb: () => void;
} & ConfirmationOptionalOptions;

type AlertParams = {
  message: DialogMessage;
} & AlertOptionalOptions;

export type AppContextProps = {
  showConfirmation: (params: ConfirmationParams) => void;
  showAlert: (params: AlertParams) => void;
  showLoader: (show: boolean) => void;
};

export const AppContext = createContext<AppContextProps>({
  showConfirmation: () => {},
  showAlert: () => {},
  showLoader: () => {},
});

type AppContextProviderProps = {
  children?: React.ReactNode;
};

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [
    activeConfirmation,
    setActiveConfirmation,
  ] = useState<ConfirmationParams | null>(null);
  const [activeAlert, setActiveAlert] = useState<AlertParams | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const handleShowConfirmation = (params: ConfirmationParams) => {
    setActiveConfirmation({ ...params });
  };

  const handleShowAlert = (params: AlertParams) => {
    setActiveAlert({ ...params });
  };

  const handleConfirmationClose = (confirmed: boolean) => {
    setActiveConfirmation(null);

    if (confirmed) {
      activeConfirmation?.cb();
    }
  };

  const handleAlertClose = () => setActiveAlert(null);

  const handleShowLoader = (showLoader: boolean) => {
    setShowLoader(showLoader);
  };

  return (
    <AppContext.Provider
      value={{
        showConfirmation: handleShowConfirmation,
        showAlert: handleShowAlert,
        showLoader: handleShowLoader,
      }}
    >
      <ConfirmationDialog
        {...{
          ...activeConfirmation,
          open: activeConfirmation !== null,
          message: activeConfirmation?.message ?? '',
          onClose: handleConfirmationClose,
        }}
      />
      <AlertDialog
        {...{
          ...activeAlert,
          open: activeAlert !== null,
          message: activeAlert?.message ?? '',
          onClose: handleAlertClose,
        }}
      />
      {showLoader && <Loader />}
      {children}
    </AppContext.Provider>
  );
}
