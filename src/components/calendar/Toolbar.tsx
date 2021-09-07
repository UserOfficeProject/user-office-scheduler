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

import { Equipment } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialEquipment } from 'hooks/equipment/useEquipments';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';

const useStyles = makeStyles((theme) => ({
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

export type ToolbarAdditionalProps = {
  instruments: PartialInstrument[];
  instrumentsLoading: boolean;
  equipments: PartialEquipment[];
  equipmentsLoading: boolean;
};

export default function Toolbar({
  localizer: { messages },
  label,
  onNavigate,
  onView,
  views,
  view,
  instruments,
  instrumentsLoading,
  equipments,
  equipmentsLoading,
}: ToolbarProps & ToolbarAdditionalProps) {
  const classes = useStyles();
  const history = useHistory();

  const query = useQuery();

  const [queryEquipment, setQueryEquipment] = useState<number[]>([]);

  const queryInstrument = query.get('instrument');

  useEffect(() => {
    setQueryEquipment(
      query
        .get('equipment')
        ?.split(',')
        .map((num) => parseInt(num)) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [queryValueInitialized, setQueryValueInitialized] = useState(
    !queryInstrument // if the link has query instrument query value when rendering this component
  );

  const [selectedInstrument, setSelectedInstrument] =
    useState<PartialInstrument | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<
    Pick<Equipment, 'id' | 'name'>[] | undefined
  >([]);

  useEffect(() => {
    if (
      selectedEquipment?.length === 0 &&
      !(queryEquipment.length === 0) &&
      equipments
    ) {
      setSelectedEquipment(
        equipments.filter((eq) => queryEquipment.includes(eq.id))
      );
    }
  }, [equipments, queryEquipment, selectedEquipment]);

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

  const onInstrumentSelect = (selectedInstrument: PartialInstrument | null) => {
    setSelectedInstrument(selectedInstrument);
  };

  const viewNamesGroup = (messages: Messages) => {
    if (!Array.isArray(views)) {
      return null;
    }

    return views.map((name) => (
      <MenuItem key={name} value={name}>
        {messages[name]}
      </MenuItem>
    ));
  };

  return (
    <div className={classes.tooltip}>
      <Grid container>
        <Grid item sm={4} xs={12} className={classes.buttonGrp}>
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
            onChange={(e) => onChangeView(e.target.value as View)}
            data-cy="select-active-view"
          >
            {viewNamesGroup(messages)}
          </Select>
        </Grid>
        <Grid
          item
          sm={2}
          xs={12}
          className={clsx(classes.flex, classes.centered)}
          data-cy="content-calendar-toolbar"
        >
          {label}
        </Grid>
        <Grid
          item
          sm={4}
          xs={12}
          className={clsx(classes.flex, classes.centered)}
          data-cy="content-calendar-toolbar-equipment"
        >
          <Autocomplete
            multiple
            loading={equipmentsLoading}
            disabled={equipmentsLoading}
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
                placeholder="Equipment"
                disabled={equipmentsLoading}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {equipmentsLoading ? (
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
                  `${newValue?.map((eq) => eq.id).join(',')}`
                );
              }
              setSelectedEquipment(newValue);
              history.push(`?${query}`);
            }}
          />
        </Grid>
        <Grid
          item
          sm={2}
          xs={12}
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
            fullWidth
            handleHomeEndKeys
            options={instruments}
            getOptionLabel={(instrument) => instrument.name}
            data-cy="input-instrument-select"
            id="input-instrument-select"
            renderInput={(params) => (
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
              newValue: PartialInstrument | null
            ) => {
              onInstrumentSelect(newValue);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
