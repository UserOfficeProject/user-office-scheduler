import React from 'react';

import { BasicUserDetailsFragment, UserRole } from 'generated/sdk';
import useEquipments, { PartialEquipment } from 'hooks/equipment/useEquipments';
import useUserInstruments, {
  PartialInstrument,
} from 'hooks/instrument/useUserInstruments';
import { useUsersData } from 'hooks/user/useUsersData';

interface InstrumentAndEquipmentContextData {
  readonly instruments: PartialInstrument[];
  readonly loadingInstruments: boolean;
  readonly equipments: PartialEquipment[];
  readonly loadingEquipments: boolean;
  readonly localContacts: BasicUserDetailsFragment[];
  readonly loadingLocalContacts: boolean;
}

const initialInstrumentAndEquipmentData: InstrumentAndEquipmentContextData = {
  instruments: [],
  loadingInstruments: false,
  equipments: [],
  loadingEquipments: false,
  localContacts: [],
  loadingLocalContacts: false,
};

export const InstrumentAndEquipmentContext =
  React.createContext<InstrumentAndEquipmentContextData>(
    initialInstrumentAndEquipmentData
  );

export const InstrumentAndEquipmentContextProvider: React.FC = (props) => {
  const { instruments, loading: loadingInstruments } = useUserInstruments();
  const { equipments, loading: loadingEquipments } = useEquipments();
  const { usersData, loadingUsersData } = useUsersData({
    userRole: UserRole.INSTRUMENT_SCIENTIST,
  });

  return (
    <InstrumentAndEquipmentContext.Provider
      value={{
        instruments,
        loadingInstruments,
        equipments,
        loadingEquipments,
        localContacts: usersData.users,
        loadingLocalContacts: loadingUsersData,
      }}
    >
      {props.children}
    </InstrumentAndEquipmentContext.Provider>
  );
};
