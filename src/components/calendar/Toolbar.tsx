import {
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { InstrumentAndEquipmentContext } from 'context/InstrumentAndEquipmentContext';
import { Equipment } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';

import { getEquipmentIdsFromQuery } from './Calendar';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    marginBottom: theme.spacing(1),
  },
  tooltipMobile: {
    marginTop: theme.spacing(2),
  },
}));

// TODO: Make this toolbar accept multiple instrument or single one depending on the needs
export default function Toolbar() {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();
  const isMobile = useMediaQuery('(max-width: 648px)');

  const { instruments, loadingInstruments, equipments, loadingEquipments } =
    useContext(InstrumentAndEquipmentContext);
  const queryInstrumentId = query.get('instrument');
  const queryEquipment = query.get('equipment');

  const [selectedInstrument, setSelectedInstrument] =
    useState<PartialInstrument | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<
    Pick<Equipment, 'id' | 'name'>[] | undefined
  >([]);

  useEffect(() => {
    const equipmentIds = getEquipmentIdsFromQuery(queryEquipment);

    if (!loadingEquipments && equipmentIds.length && equipments.length) {
      const queryFilteredEquipments = equipments.filter((eq) =>
        equipmentIds.includes(eq.id)
      );

      setSelectedEquipment(queryFilteredEquipments);
    }
  }, [loadingEquipments, equipments, queryEquipment]);

  useEffect(() => {
    if (!loadingInstruments && queryInstrumentId) {
      const queryFoundInstrument = instruments.find(
        ({ id }) => `${id}` === queryInstrumentId
      );

      queryFoundInstrument && setSelectedInstrument(queryFoundInstrument);
    }
  }, [loadingInstruments, instruments, queryInstrumentId]);

  const onInstrumentChange = (
    event: React.ChangeEvent<unknown>,
    selectedInstrument: PartialInstrument | null
  ) => {
    if (!selectedInstrument) {
      query.delete('instrument');
    } else if (
      selectedInstrument &&
      queryInstrumentId !== `${selectedInstrument.id}`
    ) {
      query.set('instrument', `${selectedInstrument.id}`);
    } else {
      return;
    }

    setSelectedInstrument(selectedInstrument);
    history.push(`?${query}`);
  };

  const onEquipmentChange = (
    event: React.ChangeEvent<unknown>,
    newSelectedEquipment: Pick<Equipment, 'id' | 'name'>[] | undefined
  ) => {
    if (
      newSelectedEquipment === undefined ||
      newSelectedEquipment.length === 0
    ) {
      query.delete('equipment');
    } else if (
      JSON.stringify(newSelectedEquipment) !== JSON.stringify(selectedEquipment)
    ) {
      query.set(
        'equipment',
        `${newSelectedEquipment?.map((eq) => eq.id).join(',')}`
      );
    }

    setSelectedEquipment(newSelectedEquipment);
    history.push(`?${query}`);
  };

  return (
    <Grid
      container
      alignItems="center"
      className={`${classes.tooltip} ${isMobile && classes.tooltipMobile}`}
      spacing={1}
    >
      <Grid item sm={6} xs={12} data-cy="calendar-toolbar-instrument-select">
        <Autocomplete
          loading={loadingInstruments}
          disabled={loadingInstruments}
          selectOnFocus
          clearOnBlur
          fullWidth
          handleHomeEndKeys
          options={instruments}
          getOptionLabel={(instrument) => instrument.name}
          data-cy="input-instrument-select"
          id="input-instrument-select"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Instrument"
              margin="dense"
              disabled={loadingInstruments}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingInstruments ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={selectedInstrument}
          onChange={onInstrumentChange}
        />
      </Grid>
      <Grid item sm={6} xs={12} data-cy="calendar-toolbar-equipment-select">
        <Autocomplete
          multiple
          loading={loadingEquipments}
          disabled={loadingEquipments}
          selectOnFocus
          clearOnBlur
          fullWidth
          handleHomeEndKeys
          options={equipments}
          getOptionLabel={(equipment) => equipment.name}
          data-cy="input-equipment-select"
          id="input-equipment-select"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Equipment"
              margin="dense"
              disabled={loadingEquipments}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingEquipments ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={selectedEquipment}
          onChange={onEquipmentChange}
        />
      </Grid>
    </Grid>
  );
}
