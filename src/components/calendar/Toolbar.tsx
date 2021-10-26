import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  tooltip: {
    marginBottom: theme.spacing(1),
  },
  label: {
    fontWeight: 'bold',
    fontSize: '90%',
    border: '1px solid #DDD',
    borderWidth: '1px 1px 0 1px',
  },
  tooltipMobile: {
    marginTop: theme.spacing(2),
  },
  centered: {
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
  const isMobile = useMediaQuery('(max-width: 648px)');

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

  const onChangeView = (view: View) => {
    query.set('viewPeriod', view);
    history.push(`?${query}`);
    onView(view);
  };

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
    <>
      <Grid
        container
        alignItems="center"
        className={`${classes.tooltip} ${isMobile && classes.tooltipMobile}`}
        spacing={1}
      >
        <Grid item sm={6} xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={4} xs={12}>
              <Button
                variant="contained"
                onClick={onNav('PREV')}
                data-cy="btn-view-prev"
                fullWidth
              >
                Back
              </Button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button
                variant="contained"
                onClick={onNav('TODAY')}
                data-cy="btn-view-today"
                fullWidth
              >
                Today
              </Button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button
                variant="contained"
                onClick={onNav('NEXT')}
                data-cy="btn-view-next"
                fullWidth
              >
                Next
              </Button>
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense">
            <InputLabel id="calendar-view-label">Calendar view</InputLabel>
            <Select
              className={classes.calendarViewSelect}
              value={view}
              label="Calendar view"
              labelId="calendar-view-label"
              margin="dense"
              onChange={(e) => onChangeView(e.target.value as View)}
              data-cy="select-active-view"
            >
              {viewNamesGroup(messages)}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
          data-cy="content-calendar-toolbar-instrument-equipment"
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
                label="Instrument"
                margin="dense"
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
                label="Equipment"
                margin="dense"
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
      </Grid>
      <Grid
        container
        justifyContent="center"
        className={classes.label}
        data-cy="content-calendar-toolbar-label"
      >
        {label}
      </Grid>
    </>
  );
}
