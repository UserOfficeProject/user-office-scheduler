import {
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import Autocomplete, {
  AutocompleteGetTagProps,
} from '@material-ui/lab/Autocomplete';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { InstrumentAndEquipmentContext } from 'context/InstrumentAndEquipmentContext';
import { Equipment } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';

import {
  getEquipmentIdsFromQuery,
  getInstrumentIdsFromQuery,
} from './Calendar';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    marginBottom: theme.spacing(1),
  },
}));

export default function InstrumentAndEquipmentFilter({
  multipleInstruments,
}: {
  multipleInstruments?: boolean;
}) {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();

  const { instruments, loadingInstruments, equipments, loadingEquipments } =
    useContext(InstrumentAndEquipmentContext);
  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');

  const [selectedInstrument, setSelectedInstrument] = useState<
    PartialInstrument | PartialInstrument[] | null
  >(multipleInstruments ? [] : null);

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
    const queryInstrumentIds = getInstrumentIdsFromQuery(queryInstrument);

    if (!loadingInstruments && queryInstrumentIds.length) {
      const queryFoundInstruments = instruments.filter((item) =>
        queryInstrumentIds.includes(item.id)
      );

      queryFoundInstruments.length &&
        setSelectedInstrument(
          multipleInstruments ? queryFoundInstruments : queryFoundInstruments[0]
        );
    }
  }, [loadingInstruments, instruments, queryInstrument, multipleInstruments]);

  const handleMultipleInstrumentsSelectionChange = (
    newSelectedInstruments: PartialInstrument[]
  ) => {
    if (newSelectedInstruments.length === 0) {
      query.delete('instrument');
    } else {
      query.set(
        'instrument',
        `${newSelectedInstruments
          ?.map((instrument) => instrument.id)
          .join(',')}`
      );
    }

    setSelectedInstrument(newSelectedInstruments);
    history.push(`?${query}`);
  };

  const handleSingleInstrumentSelectionChange = (
    newSelectedInstrument: PartialInstrument | null
  ) => {
    if (!newSelectedInstrument) {
      query.delete('instrument');
    } else if (
      newSelectedInstrument &&
      queryInstrument !== `${newSelectedInstrument.id}`
    ) {
      query.set('instrument', `${newSelectedInstrument.id}`);
    } else {
      return;
    }

    setSelectedInstrument(newSelectedInstrument);
    history.push(`?${query}`);
  };

  const onInstrumentChange = (
    event: React.ChangeEvent<unknown>,
    instrumentSelection: PartialInstrument | PartialInstrument[] | null
  ) => {
    if (Array.isArray(instrumentSelection)) {
      handleMultipleInstrumentsSelectionChange(instrumentSelection);
    } else {
      handleSingleInstrumentSelectionChange(instrumentSelection);
    }
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

  // NOTE: Limited tags rendering to save some space and it looks a bit ugly when too many items are selected on the autocomplete.
  const renderLimitedTags = ({
    value,
    getTagProps,
    limitTags,
  }: {
    value: PartialInstrument[] | Pick<Equipment, 'id' | 'name'>[];
    getTagProps: AutocompleteGetTagProps;
    limitTags: number;
  }) => {
    const numTags = value.length;

    return (
      <>
        {value.slice(0, limitTags).map((option, index) => (
          <Chip {...getTagProps({ index })} key={index} label={option.name} />
        ))}

        {numTags > limitTags && ` +${numTags - limitTags}`}
      </>
    );
  };

  return (
    <Grid
      container
      alignItems="center"
      className={`${classes.tooltip}`}
      spacing={2}
    >
      <Grid item sm={6} xs={12} data-cy="calendar-toolbar-instrument-select">
        <Autocomplete
          multiple={multipleInstruments}
          renderTags={(value, getTagProps) =>
            renderLimitedTags({ value, getTagProps, limitTags: 2 })
          }
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
              placeholder="Instrument"
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
          renderTags={(value, getTagProps) =>
            renderLimitedTags({ value, getTagProps, limitTags: 1 })
          }
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
              placeholder="Equipment"
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
