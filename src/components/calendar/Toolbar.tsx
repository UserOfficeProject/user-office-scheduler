import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import {
  Messages,
  NavigateAction,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import { useHistory } from 'react-router';

import { Instrument, Equipment } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import useEquipments from 'hooks/equipment/useEquipments';
import useUserInstruments from 'hooks/instrument/useUserInstruments';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
  },
  tooltip: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  verticalCenter: {
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarViewSelect: {
    minWidth: 120,
  },
  instrumentSelect: {
    width: 300,
  },
  buttonGrp: {
    '& > *:first-child': {
      marginLeft: 0,
    },
    '& > *:last-child': {
      marginRight: 0,
    },
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Toolbar({
  localizer: { messages },
  label,
  onNavigate,
  onView,
  views,
  view,
}: ToolbarProps) {
  const classes = useStyles();
  const history = useHistory();
  const { loading: instrumentsLoading, instruments } = useUserInstruments();
  const { loading: equipmentLoading, equipments } = useEquipments();

  const query = useQuery();

  const queryInstrument = query.get('instrument');

  const [queryValueInitialized, setQueryValueInitialized] = useState(
    !queryInstrument // if the link has query instrument query value when rendering this component
  );

  const [selectedInstrument, setSelectedInstrument] = useState<Pick<
    Instrument,
    'id' | 'name'
  > | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<
    Pick<Equipment, 'id' | 'name'>[] | undefined
  >([]);

  useEffect(() => {
    if (!instrumentsLoading && queryInstrument) {
      const found = instruments.find(({ id }) => `${id}` === queryInstrument);

      found && setSelectedInstrument(found);
      setQueryValueInitialized(true);
    }
  }, [instrumentsLoading, instruments, queryInstrument, setSelectedInstrument]);

  useEffect(() => {
    if (
      instrumentsLoading ||
      !queryValueInitialized ||
      (!selectedInstrument && !queryInstrument)
    ) {
      return;
    }

    if (!selectedInstrument && queryInstrument) {
      query.delete('instrument');
    } else if (
      selectedInstrument &&
      queryInstrument !== `${selectedInstrument.id}`
    ) {
      query.set('instrument', `${selectedInstrument.id}`);
    } else {
      return;
    }

    history.push(`?${query}`);
  }, [
    queryValueInitialized,
    instrumentsLoading,
    selectedInstrument,
    queryInstrument,
    query,
    history,
  ]);

  const onNav = (navAction: NavigateAction) => () => onNavigate(navAction);

  const onChangeView = (view: View) => onView(view);

  const onInstrumentSelect = (
    selectedInstrument: Pick<Instrument, 'id' | 'name'> | null
  ) => {
    setSelectedInstrument(selectedInstrument);
  };

  const viewNamesGroup = (messages: Messages) => {
    if (!Array.isArray(views)) {
      return null;
    }

    return views.map(name => (
      <MenuItem key={name} value={name}>
        {messages[name]}
      </MenuItem>
    ));
  };

  return (
    <div className={classes.tooltip}>
      <Grid container>
        <Grid item xs={5} className={classes.buttonGrp}>
          <Button
            variant="contained"
            onClick={onNav('TODAY')}
            data-cy="btn-view-today"
          >
            Today
          </Button>
          <Button
            variant="contained"
            onClick={onNav('PREV')}
            data-cy="btn-view-prev"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onNav('NEXT')}
            data-cy="btn-view-next"
          >
            Next
          </Button>
          <Select
            className={classes.calendarViewSelect}
            value={view}
            onChange={e => onChangeView(e.target.value as View)}
            data-cy="select-active-view"
          >
            {viewNamesGroup(messages)}
          </Select>
        </Grid>
        <Grid
          item
          xs={2}
          className={clsx(classes.flex, classes.centered)}
          data-cy="content-calendar-toolbar"
        >
          {label}
        </Grid>
        <Grid
          item
          xs={3}
          className={clsx(classes.flex, classes.centered)}
          data-cy="content-calendar-toolbar-equipment"
        >
          <Autocomplete
            multiple
            loading={equipmentLoading}
            disabled={equipmentLoading}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            className={classes.instrumentSelect}
            options={equipments}
            getOptionLabel={equipment => equipment.name}
            data-cy="input-equipment-select"
            id="input-equipment-select"
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Equipment"
                disabled={equipmentLoading}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {equipmentLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            value={selectedEquipment}
            onChange={(
              event: React.ChangeEvent<unknown>,
              newValue: Pick<Equipment, 'id' | 'name'>[] | undefined
            ) => {
              if (newValue === undefined || newValue.length === 0) {
                query.delete('equipment');
              } else {
                query.set(
                  'equipment',
                  `${newValue?.map(eq => eq.id).join(',')}`
                );
              }
              setSelectedEquipment(newValue);
              history.push(`?${query}`);
            }}
          />
        </Grid>
        <Grid
          item
          xs={2}
          className={clsx(
            classes.flex,
            classes.justifyContentFlexEnd,
            classes.buttonGrp,
            classes.verticalCenter
          )}
        >
          <Autocomplete
            loading={instrumentsLoading}
            disabled={instrumentsLoading}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            className={classes.instrumentSelect}
            options={instruments}
            getOptionLabel={instrument => instrument.name}
            data-cy="input-instrument-select"
            id="input-instrument-select"
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Instrument"
                disabled={instrumentsLoading}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {instrumentsLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            value={selectedInstrument}
            onChange={(
              event: React.ChangeEvent<unknown>,
              newValue: Pick<Instrument, 'id' | 'name'> | null
            ) => {
              onInstrumentSelect(newValue);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
