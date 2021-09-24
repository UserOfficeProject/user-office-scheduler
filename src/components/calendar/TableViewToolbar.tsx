import MomentUtils from '@date-io/moment';
import { MTableToolbar, Options } from '@material-table/core';
import {
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import clsx from 'clsx';
import moment, { Moment } from 'moment';
import React, { Dispatch, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Equipment, ScheduledEventFilter } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialEquipment } from 'hooks/equipment/useEquipments';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { toTzLessDateTime } from 'utils/date';

import { CalendarScheduledEvent } from './Event';
import { ToolbarAdditionalProps } from './Toolbar';

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
  smaller: {
    fontSize: '0.875rem',
    marginBottom: theme.spacing(1),
  },
}));

type TableViewToolbarProps = {
  onDateRangeChange: (startDate: Moment | null, endDate: Moment | null) => void;
  startsAtDate: string;
  endsAtDate: string;
};

function TableViewToolbar({
  onDateRangeChange,
  startsAtDate,
  endsAtDate,
  instruments,
  instrumentsLoading,
  equipments,
  equipmentsLoading,
}: TableViewToolbarProps & ToolbarAdditionalProps) {
  const query = useQuery();
  const classes = useStyles();
  const history = useHistory();
  const queryStartsAt = query.get('startsAt');
  const queryEndsAt = query.get('endsAt');

  const [startsAt, setStartsAt] = useState<Moment | null>(
    moment(queryStartsAt || startsAtDate)
  );
  const [endsAt, setEndsAt] = useState<Moment | null>(
    moment(queryEndsAt || endsAtDate)
  );
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

  useEffect(() => {
    // NOTE: If the initial start/end date is different than current start/end date then we should call onDateRangeChange
    if (
      moment(startsAtDate).diff(startsAt, 'hour') ||
      moment(endsAtDate).diff(endsAt, 'hour')
    ) {
      onDateRangeChange(startsAt, endsAt);
      query.set('startsAt', `${startsAt}`);
      query.set('endsAt', `${endsAt}`);

      history.push(`?${query}`);
    }
  }, [
    startsAt,
    startsAtDate,
    endsAt,
    endsAtDate,
    onDateRangeChange,
    history,
    query,
  ]);

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
      queryEquipment.length !== 0 &&
      equipments
    ) {
      setSelectedEquipment(
        equipments.filter((eq) => queryEquipment.includes(eq.id))
      );
    }
  }, [equipments, queryEquipment, selectedEquipment]);

  useEffect(() => {
    if (queryInstrument) {
      const found = instruments.find(({ id }) => `${id}` === queryInstrument);

      found && setSelectedInstrument(found);
      setQueryValueInitialized(true);
    }
  }, [instruments, queryInstrument, setSelectedInstrument]);

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

  const onInstrumentSelect = (selectedInstrument: PartialInstrument | null) => {
    setSelectedInstrument(selectedInstrument);
  };

  return (
    <div className={classes.tooltip}>
      <Grid container>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item sm={4} xs={12}>
            <KeyboardDatePicker
              required
              label="From date"
              name={`startsAt`}
              margin="none"
              size="small"
              format={'yyyy-MM-DD'}
              fullWidth
              data-cy="table-toolbar-startsAt"
              InputProps={{
                className: classes.smaller,
              }}
              value={startsAt}
              onChange={(newValue) => setStartsAt(newValue)}
            />
            <KeyboardDatePicker
              required
              label="To date"
              name={`endsAt`}
              margin="none"
              size="small"
              format={'yyyy-MM-DD'}
              fullWidth
              data-cy="table-toolbar-endsAt"
              InputProps={{
                className: classes.smaller,
              }}
              value={endsAt}
              onChange={(newValue) => setEndsAt(newValue)}
            />
          </Grid>
        </MuiPickersUtilsProvider>
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
            data-cy="table-toolbar-equipment-select"
            id="table-toolbar-equipment-select"
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
          sm={4}
          xs={12}
          className={clsx(
            classes.flex,
            classes.justifyContentFlexEnd,
            classes.verticalCenter
          )}
        >
          <Autocomplete
            loading={instrumentsLoading}
            disabled={instrumentsLoading}
            selectOnFocus
            fullWidth
            clearOnBlur
            handleHomeEndKeys
            options={instruments}
            getOptionLabel={(instrument) => instrument.name}
            data-cy="table-toolbar-instrument-select"
            id="table-toolbar-instrument-select"
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

const TableToolbar = (
  data: Options<CalendarScheduledEvent>,
  filter: ScheduledEventFilter,
  setFilter: Dispatch<ScheduledEventFilter>,
  instruments: PartialInstrument[],
  instrumentsLoading: boolean,
  equipments: PartialEquipment[],
  equipmentsLoading: boolean
): JSX.Element => {
  const onDateRangeChange = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    if (startDate && endDate) {
      setFilter({
        ...filter,
        startsAt: toTzLessDateTime(startDate),
        endsAt: toTzLessDateTime(endDate),
      });
    }
  };

  return (
    <>
      <TableViewToolbar
        onDateRangeChange={onDateRangeChange}
        startsAtDate={filter.startsAt}
        endsAtDate={filter.endsAt}
        instruments={instruments}
        instrumentsLoading={instrumentsLoading}
        equipments={equipments}
        equipmentsLoading={equipmentsLoading}
      />
      <MTableToolbar {...data} />
    </>
  );
};

export default TableToolbar;
