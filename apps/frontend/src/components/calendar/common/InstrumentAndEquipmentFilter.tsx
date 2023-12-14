import {
  AutocompleteGetTagProps,
  Box,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import { InstrumentAndEquipmentContext } from 'context/InstrumentAndEquipmentContext';
import { BasicUserDetailsFragment, Equipment } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { getArrayOfIdsFromQuery } from 'utils/common';
import { getFullUserName } from 'utils/user';

const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

export default function InstrumentAndEquipmentFilter({
  multipleInstruments,
}: {
  multipleInstruments?: boolean;
}) {
  const { classes } = useStyles();
  const history = useHistory();
  const query = useQuery();

  const {
    instruments,
    loadingInstruments,
    equipments,
    loadingEquipments,
    localContacts,
    loadingLocalContacts,
  } = useContext(InstrumentAndEquipmentContext);
  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');
  const queryLocalContacts = query.get('localContact');

  const [selectedInstrument, setSelectedInstrument] = useState<
    PartialInstrument | PartialInstrument[] | null
  >(multipleInstruments ? [] : null);

  const [selectedEquipment, setSelectedEquipment] = useState<
    Pick<Equipment, 'id' | 'name'>[] | undefined
  >([]);

  const [selectedLocalContacts, setSelectedLocalContacts] = useState<
    | Pick<BasicUserDetailsFragment, 'id' | 'firstname' | 'lastname'>[]
    | undefined
  >([]);

  useEffect(() => {
    const equipmentIds = getArrayOfIdsFromQuery(queryEquipment);

    if (!loadingEquipments && equipmentIds.length && equipments.length) {
      const queryFilteredEquipments = equipments.filter((eq) =>
        equipmentIds.includes(eq.id)
      );

      setSelectedEquipment(queryFilteredEquipments);
    }
  }, [loadingEquipments, equipments, queryEquipment]);

  useEffect(() => {
    const queryInstrumentIds = getArrayOfIdsFromQuery(queryInstrument);

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

  useEffect(() => {
    const localContactIds = getArrayOfIdsFromQuery(queryLocalContacts);

    if (!loadingLocalContacts && localContactIds.length) {
      const queryFilteredLocalContacts = localContacts.filter((eq) =>
        localContactIds.includes(eq.id)
      );

      setSelectedLocalContacts(queryFilteredLocalContacts);
    }
  }, [loadingLocalContacts, localContacts, queryLocalContacts]);

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

  const onLocalContactChange = (
    event: React.ChangeEvent<unknown>,
    newSelectedLocalContacts:
      | Pick<BasicUserDetailsFragment, 'id' | 'firstname' | 'lastname'>[]
      | undefined
  ) => {
    if (
      newSelectedLocalContacts === undefined ||
      newSelectedLocalContacts.length === 0
    ) {
      query.delete('localContact');
    } else if (
      JSON.stringify(newSelectedLocalContacts) !==
      JSON.stringify(selectedLocalContacts)
    ) {
      query.set(
        'localContact',
        `${newSelectedLocalContacts?.map((lc) => lc.id).join(',')}`
      );
    }

    setSelectedLocalContacts(newSelectedLocalContacts);
    history.push(`?${query}`);
  };

  const sortEquipments = (
    equipments: Equipment[],
    selectedInstrument: PartialInstrument | PartialInstrument[] | null
  ) => {
    if (!selectedInstrument) {
      return equipments;
    }
    const selectedInstruments = new Set(
      (selectedInstrument as PartialInstrument[]).map(
        (inst: PartialInstrument) => inst.name
      )
    );

    const sortedEquipments = [...equipments].sort((a, b) => {
      const aContains = a.equipmentInstruments?.some(
        (inst: PartialInstrument) => selectedInstruments.has(inst.name)
      );
      const bContains = b.equipmentInstruments?.some(
        (inst: PartialInstrument) => selectedInstruments.has(inst.name)
      );

      if (aContains === bContains) return 0;
      if (aContains) return -1;

      return 1;
    });

    return sortedEquipments;
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
    const itemsInsideTheLimit = value.slice(0, limitTags);
    const itemsOutsideTheLimit = value.slice(limitTags);

    return (
      <>
        {itemsInsideTheLimit.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={index}
            label={option.name}
            title={option.name}
          />
        ))}

        <Box
          title={itemsOutsideTheLimit.map((item) => item.name).join(', ')}
          component="span"
        >
          {numTags > limitTags && ` +${numTags - limitTags}`}
        </Box>
      </>
    );
  };

  return (
    <Grid
      container
      alignItems="center"
      className={`${classes.root}`}
      spacing={2}
    >
      <Grid item sm={4} xs={12} data-cy="calendar-toolbar-instrument-select">
        <Autocomplete
          multiple={multipleInstruments}
          renderTags={(value, getTagProps) =>
            renderLimitedTags({ value, getTagProps, limitTags: 4 })
          }
          loading={loadingInstruments}
          disabled={loadingInstruments}
          selectOnFocus
          clearOnBlur
          fullWidth
          handleHomeEndKeys
          options={instruments}
          getOptionLabel={(instrument) => instrument.name}
          disableCloseOnSelect
          data-cy="input-instrument-select"
          id="input-instrument-select"
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ height: 34 }}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Instrument"
              placeholder="Instrument"
              margin="dense"
              variant="standard"
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
      <Grid item sm={4} xs={12} data-cy="calendar-toolbar-equipment-select">
        <Autocomplete
          multiple
          renderTags={(value, getTagProps) =>
            renderLimitedTags({ value, getTagProps, limitTags: 4 })
          }
          loading={loadingEquipments}
          disabled={loadingEquipments}
          selectOnFocus
          clearOnBlur
          fullWidth
          handleHomeEndKeys
          options={sortEquipments(
            equipments as Equipment[],
            selectedInstrument
          )}
          getOptionLabel={(equipment) => equipment.name}
          disableCloseOnSelect
          data-cy="input-equipment-select"
          id="input-equipment-select"
          renderOption={(props, option, { selected }) => {
            const relatedInstruments = (
              option as Equipment
            ).equipmentInstruments?.map((instrument) => instrument.name);

            return (
              <>
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  <div>
                    <div>{option.name}</div>
                    {relatedInstruments && relatedInstruments?.length > 0 && (
                      <div
                        style={{
                          fontSize: '12px',
                        }}
                      >
                        Instrument: {relatedInstruments?.join(',')}
                      </div>
                    )}
                    {}
                  </div>
                </li>
              </>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Equipment"
              placeholder="Equipment"
              margin="dense"
              variant="standard"
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
      <Grid item sm={4} xs={12} data-cy="calendar-toolbar-equipment-select">
        <Autocomplete
          multiple
          renderTags={(value, getTagProps) =>
            renderLimitedTags({
              value: value.map((item) => ({
                id: item.id,
                name: getFullUserName(item),
              })),
              getTagProps,
              limitTags: 2,
            })
          }
          loading={loadingLocalContacts}
          disabled={loadingLocalContacts}
          selectOnFocus
          clearOnBlur
          fullWidth
          handleHomeEndKeys
          options={localContacts}
          getOptionLabel={(localContact) =>
            `${localContact.firstname} ${localContact.lastname}`
          }
          disableCloseOnSelect
          data-cy="input-local-contact-select"
          id="input-local-contact-select"
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ height: 34 }}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {`${option.firstname} ${option.lastname}`}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Local contact"
              placeholder="Local contact"
              margin="dense"
              variant="standard"
              disabled={loadingLocalContacts}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingLocalContacts ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={selectedLocalContacts}
          onChange={onLocalContactChange}
        />
      </Grid>
    </Grid>
  );
}
