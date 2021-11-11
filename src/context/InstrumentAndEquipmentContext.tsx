import React from 'react';

import useEquipments, { PartialEquipment } from 'hooks/equipment/useEquipments';
import useUserInstruments, {
  PartialInstrument,
} from 'hooks/instrument/useUserInstruments';

interface InstrumentAndEquipmentContextData {
  readonly instruments: PartialInstrument[];
  readonly loadingInstruments: boolean;
  readonly equipments: PartialEquipment[];
  readonly loadingEquipments: boolean;
}

const initialInstrumentAndEquipmentData: InstrumentAndEquipmentContextData = {
  instruments: [],
  loadingInstruments: false,
  equipments: [],
  loadingEquipments: false,
};

export const InstrumentAndEquipmentContext =
  React.createContext<InstrumentAndEquipmentContextData>(
    initialInstrumentAndEquipmentData
  );

export const InstrumentAndEquipmentContextProvider: React.FC = (props) => {
  const { instruments, loading: loadingInstruments } = useUserInstruments();
  const { equipments, loading: loadingEquipments } = useEquipments();

  return (
    <InstrumentAndEquipmentContext.Provider
      value={{ instruments, loadingInstruments, equipments, loadingEquipments }}
    >
      {props.children}
    </InstrumentAndEquipmentContext.Provider>
  );
};
