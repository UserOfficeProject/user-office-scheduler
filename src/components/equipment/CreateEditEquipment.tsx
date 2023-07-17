import { Save as SaveIcon } from '@mui/icons-material';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Grid,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Button,
  CircularProgress,
  Box,
  useTheme,
  TextField as MuiTextField,
  TextFieldProps,
  MenuItem,
} from '@mui/material';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import { equipmentValidationSchema } from '@user-office-software/duo-validation';
import { Formik, Form, Field } from 'formik';
import { TextField, CheckboxWithLabel, Autocomplete, Select } from 'formik-mui';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, generatePath } from 'react-router';

import FormikColorPicker from 'components/common/FormikColorPicker';
import FormikDateTimeRangePicker from 'components/common/FormikDateTimeRangePicker';
import Loader from 'components/common/Loader';
import { PATH_VIEW_EQUIPMENT } from 'components/paths';
import { UserContext } from 'context/UserContext';
import {
  BasicUserDetailsFragment,
  Equipment,
  EquipmentInput,
  UserRole,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useEquipment from 'hooks/equipment/useEquipment';
import useUserInstruments, {
  PartialInstrument,
} from 'hooks/instrument/useUserInstruments';
import { useUsersData } from 'hooks/user/useUsersData';
import { StyledContainer, StyledPaper } from 'styles/StyledComponents';
import {
  toTzLessDateTime,
  parseTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
  TZ_LESS_DATE_TIME_LOW_PREC_MASK,
} from 'utils/date';
import {
  isEquipmentOwner,
  isEquipmentResponsiblePerson,
} from 'utils/permissions';
import { getFullUserName } from 'utils/user';

export default function CreateEditEquipment() {
  const history = useHistory();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);
  const { id } = useParams<{ id?: string }>();
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [indefiniteMaintenance, setIndefiniteMaintenance] = useState('1');
  const { instruments, loading: loadingInstruments } = useUserInstruments();
  const { user: loggedInUser, currentRole } = useContext(UserContext);
  // NOTE: We can't limit loaded users to INSTRUMENT_SCIENTIST only because equipment owner can be USER_OFFICER also
  const { usersData: allUsers } = useUsersData({});
  // NOTE: Here we load only instrument scientists for responsible people
  const {
    usersData: instrumentScientists,
    loadingUsersData: loadingInstrumentScientists,
  } = useUsersData({ userRole: UserRole.INSTRUMENT_SCIENTIST });

  const api = useDataApi();
  const { loading, equipment } = useEquipment(parseInt(id ?? '0'));

  useEffect(() => {
    if (loading) {
      return;
    }

    const maintenanceStartsAt = equipment?.maintenanceStartsAt
      ? parseTzLessDateTime(equipment.maintenanceStartsAt)
      : null;
    const maintenanceEndsAt = equipment?.maintenanceEndsAt
      ? parseTzLessDateTime(equipment.maintenanceEndsAt)
      : null;

    if (maintenanceStartsAt) {
      if (!maintenanceEndsAt) {
        setUnderMaintenance(true);
      } else if (
        maintenanceEndsAt &&
        maintenanceEndsAt.diff(moment(), 'second') >= 0
      ) {
        setUnderMaintenance(true);
        setIndefiniteMaintenance('0');
      }
    }
  }, [loading, equipment]);

  const enqueueError = (error: ResourceId) =>
    enqueueSnackbar(getTranslation(error), { variant: 'error' });

  if (loading) {
    return <Loader container />;
  }

  const hasEditAccess =
    currentRole === UserRole.USER_OFFICER ||
    isEquipmentResponsiblePerson(equipment, loggedInUser, currentRole) ||
    isEquipmentOwner(equipment, loggedInUser);

  if (id && !hasEditAccess) {
    history.goBack();

    return null;
  }

  const initialValues = equipment
    ? {
        name: equipment.name,
        description: equipment.description || '',
        instruments: equipment.equipmentInstruments || [],
        maintenanceStartsEndsAt: [
          equipment.maintenanceStartsAt
            ? parseTzLessDateTime(equipment.maintenanceStartsAt)
            : null,
          equipment.maintenanceEndsAt
            ? parseTzLessDateTime(equipment.maintenanceEndsAt)
            : null,
        ],
        equipmentResponsible: equipment.equipmentResponsible || [],
        ownerUserId: equipment.owner?.id || '',
        autoAccept: equipment.autoAccept,
        color: equipment.color || '#7cb5ec',
      }
    : {
        name: '',
        description: '',
        instruments: [],
        maintenanceStartsEndsAt: [moment(), moment()],
        equipmentResponsible: [],
        ownerUserId: user?.id || '',
        autoAccept: false,
        color: '#7cb5ec',
      };

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            <Formik
              initialValues={initialValues}
              validationSchema={equipmentValidationSchema}
              onSubmit={async (values, helper): Promise<void> => {
                const [maintenanceStartsAt, maintenanceEndsAt] =
                  values.maintenanceStartsEndsAt;

                if (underMaintenance && indefiniteMaintenance === '0') {
                  if (!maintenanceStartsAt || !maintenanceEndsAt) {
                    !maintenanceStartsAt &&
                      helper.setFieldError(
                        'maintenanceStartsEndsAt',
                        'Required'
                      );
                    !maintenanceEndsAt &&
                      helper.setFieldError(
                        'maintenanceStartsEndsAt',
                        'Required'
                      );

                    return;
                  }
                }

                const input: EquipmentInput = {
                  autoAccept: values.autoAccept,
                  name: values.name,
                  description: values.description || '',
                  instrumentIds: values.instruments?.map(
                    (instrument) => instrument.id
                  ),
                  maintenanceStartsAt: null,
                  maintenanceEndsAt: null,
                  color: values.color,
                  equipmentResponsible: values.equipmentResponsible.map(
                    (user) => user.id
                  ),
                  ownerUserId: +values.ownerUserId,
                };

                if (!underMaintenance) {
                  // set maintenance fields to null explicitly
                  // we it's not under maintenance
                  input.maintenanceStartsAt = null;
                  input.maintenanceEndsAt = null;
                } else if (indefiniteMaintenance === '1') {
                  // when the maintenance takes indefinitely
                  //  only set the start time
                  input.maintenanceStartsAt = toTzLessDateTime(moment());
                  input.maintenanceEndsAt = null;
                } else {
                  input.maintenanceStartsAt = toTzLessDateTime(
                    maintenanceStartsAt as Moment
                  );
                  input.maintenanceEndsAt = toTzLessDateTime(
                    maintenanceEndsAt as Moment
                  );
                }

                if (id) {
                  const {
                    updateEquipment: { error },
                  } = await api().updateEquipment({
                    id: parseInt(id),
                    updateEquipmentInput: input,
                  });

                  if (error) {
                    enqueueError(error as ResourceId);
                    helper.resetForm();
                  } else {
                    enqueueSnackbar('Equipment updated successfully', {
                      variant: 'success',
                    });
                    history.push(generatePath(PATH_VIEW_EQUIPMENT, { id }));
                  }
                } else {
                  const {
                    createEquipment: { error, equipment },
                  } = await api().createEquipment({
                    newEquipmentInput: input,
                  });

                  if (error) {
                    enqueueError(error as ResourceId);
                  } else {
                    enqueueSnackbar('Equipment created successfully', {
                      variant: 'success',
                    });
                    history.push(
                      generatePath(PATH_VIEW_EQUIPMENT, {
                        id: (equipment as Equipment).id,
                      })
                    );
                  }
                }
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item sm={6} xs={12}>
                        <Field
                          component={TextField}
                          name="name"
                          label="Equipment name"
                          margin="normal"
                          variant="standard"
                          fullWidth
                          data-cy="name"
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Field
                          component={Select}
                          formControl={{
                            fullWidth: true,
                            variant: 'standard',
                            required: true,
                            margin: 'normal',
                          }}
                          inputLabel={{
                            variant: 'standard',
                          }}
                          name="ownerUserId"
                          label="Equipment owner"
                          data-cy="equipment-owner"
                        >
                          {allUsers.users.map((user, i) => (
                            <MenuItem value={user.id} key={i}>
                              {getFullUserName(user)}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                    </Grid>

                    <Field
                      component={TextField}
                      name="description"
                      label="Equipment description"
                      margin="normal"
                      variant="standard"
                      fullWidth
                      multiline
                      minRows="3"
                      maxRows="16"
                      data-cy="description"
                    />

                    <Grid container spacing={1} alignItems="center">
                      <Grid item sm={6} xs={12}>
                        <Field
                          component={Autocomplete}
                          multiple
                          options={instruments}
                          noOptionsText="No instruments"
                          name="instruments"
                          isOptionEqualToValue={(
                            option: PartialInstrument,
                            value: PartialInstrument
                          ) => option.id === value.id}
                          label="Equipment instruments"
                          loading={loadingInstruments}
                          fullWidth
                          data-cy="equipment-instruments"
                          getOptionLabel={(option: PartialInstrument) =>
                            option.name
                          }
                          renderInput={(params: TextFieldProps) => (
                            <MuiTextField
                              {...params}
                              label="Equipment instruments"
                              margin="normal"
                              variant="standard"
                              placeholder="Equipment instruments"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Field
                          component={Autocomplete}
                          multiple
                          options={instrumentScientists.users}
                          noOptionsText="No instrument scientists"
                          name="equipmentResponsible"
                          isOptionEqualToValue={(
                            option: BasicUserDetailsFragment,
                            value: BasicUserDetailsFragment
                          ) => option.id === value.id}
                          label="Equipment responsible people"
                          loading={loadingInstrumentScientists}
                          fullWidth
                          data-cy="equipment-responsible-people-select"
                          getOptionLabel={(option: BasicUserDetailsFragment) =>
                            getFullUserName(option)
                          }
                          renderInput={(params: TextFieldProps) => (
                            <MuiTextField
                              {...params}
                              label="Equipment responsible people"
                              margin="normal"
                              variant="standard"
                              placeholder="Equipment responsible people"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item sm={4} xs={12}>
                        <Field
                          component={CheckboxWithLabel}
                          name="autoAccept"
                          type="checkbox"
                          Label={{
                            label: 'Auto accept equipment requests',
                            margin: 'normal',
                          }}
                          data-cy="autoAccept"
                        />
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <FormGroup row>
                          <FormControlLabel
                            disabled={isSubmitting}
                            control={
                              <MuiCheckbox
                                name="underMaintenance"
                                checked={underMaintenance}
                                onChange={(_, newValue) => {
                                  setUnderMaintenance(newValue);
                                }}
                              />
                            }
                            label="Under maintenance"
                            data-cy="underMaintenance"
                          />
                        </FormGroup>

                        {underMaintenance && (
                          <>
                            <FormGroup row>
                              <FormControl
                                component="fieldset"
                                margin="normal"
                                disabled={isSubmitting}
                              >
                                <FormLabel component="legend">
                                  Maintenance time
                                </FormLabel>
                                <RadioGroup
                                  aria-label="maintenance time"
                                  name="maintenanceTime"
                                  value={indefiniteMaintenance}
                                  onChange={(_, newValue) => {
                                    setIndefiniteMaintenance(newValue);
                                  }}
                                >
                                  <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="Indefinite"
                                    data-cy="maintenanceTime-indefinite"
                                  />
                                  <FormControlLabel
                                    value="0"
                                    control={<Radio />}
                                    label="Defined"
                                    data-cy="maintenanceTime-defined"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormGroup>
                            {indefiniteMaintenance === '0' && (
                              <FormGroup row>
                                <FormControl margin="normal">
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <Field
                                      component={FormikDateTimeRangePicker}
                                      desktopModeMediaQuery={theme.breakpoints.up(
                                        'sm'
                                      )}
                                      orientation="portrait"
                                      name="maintenanceStartsEndsAt"
                                      startText="Starts at"
                                      helperText="test test"
                                      endText="Ends at"
                                      label="Starts at"
                                      data-cy="equipment-maintanance-time-range"
                                      textField={{
                                        variant: 'standard',
                                        margin: 'normal',
                                      }}
                                      inputFormat={
                                        TZ_LESS_DATE_TIME_LOW_PREC_FORMAT
                                      }
                                      mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
                                      ampm={false}
                                      minutesStep={60}
                                    />
                                  </LocalizationProvider>
                                </FormControl>
                              </FormGroup>
                            )}
                          </>
                        )}
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Field
                          component={FormikColorPicker}
                          name="color"
                          label="Equipment color"
                          data-cy="color"
                          required
                        />
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={isSubmitting}
                        data-cy="btn-save-equipment"
                      >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
