import MomentUtils from '@date-io/moment';
import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  TYPE_ERR_INVALID_DATE,
  atOrLaterThanMsg,
} from '@esss-swap/duo-validation/lib/util';
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
} from '@material-ui/core';
import { Save as SaveIcon } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Formik, Form, Field } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory, generatePath } from 'react-router';
import * as Yup from 'yup';

import Loader from 'components/common/Loader';
import { PATH_VIEW_EQUIPMENT } from 'components/paths';
import { Equipment, EquipmentInput } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useEquipment from 'hooks/equipment/useEquipment';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';
import {
  toTzLessDateTime,
  parseTzLessDateTime,
  TZ_LESS_DATE_TIME_FORMAT,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';

export const equipmentValidationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(100).required(),

  maintenanceStartsAt: Yup.date()
    .nullable()
    .typeError(TYPE_ERR_INVALID_DATE)
    .notRequired(),

  maintenanceEndsAt: Yup.date()
    .nullable()
    .typeError(TYPE_ERR_INVALID_DATE)
    .when(
      'maintenanceStartsAt',
      (
        maintenanceStartsAt: Date,
        schema: Yup.DateSchema<Date | null | undefined>
      ) => {
        if (!maintenanceStartsAt) {
          return schema;
        }

        const min = moment(maintenanceStartsAt).add(1, 'minute');

        if (!min.isValid()) {
          return schema;
        }

        return schema
          .nullable()
          .typeError(TYPE_ERR_INVALID_DATE)
          .min(
            min.toDate(),
            atOrLaterThanMsg(min.format(TZ_LESS_DATE_TIME_FORMAT))
          )
          .notRequired();
      }
    )
    .notRequired(),
});

export default function CreateEditEquipment() {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id?: string }>();
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [indefiniteMaintenance, setIndefiniteMaintenance] = useState('1');

  const api = useDataApi();
  const { loading, equipment } = useEquipment(id ? parseInt(id) : 0);

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

  const initialValues = equipment
    ? {
        name: equipment.name,
        maintenanceStartsAt: equipment.maintenanceStartsAt
          ? parseTzLessDateTime(equipment.maintenanceStartsAt)
          : null,
        maintenanceEndsAt: equipment.maintenanceEndsAt
          ? parseTzLessDateTime(equipment.maintenanceEndsAt)
          : null,
        autoAccept: equipment.autoAccept,
      }
    : {
        name: '',
        maintenanceStartsAt: null,
        maintenanceEndsAt: null,
        autoAccept: false,
      };

  return (
    <ContentContainer maxWidth={false}>
      <Grid container>
        <Grid item xs={12}>
          <StyledPaper margin={[0, 1]}>
            <Formik
              initialValues={initialValues}
              validationSchema={equipmentValidationSchema}
              onSubmit={async (values, helper): Promise<void> => {
                if (underMaintenance && indefiniteMaintenance === '0') {
                  if (
                    !values.maintenanceStartsAt ||
                    !values.maintenanceEndsAt
                  ) {
                    !values.maintenanceStartsAt &&
                      helper.setFieldError('maintenanceStartsAt', 'Required');
                    !values.maintenanceEndsAt &&
                      helper.setFieldError('maintenanceEndsAt', 'Required');

                    return;
                  }
                }

                const input: EquipmentInput = {
                  autoAccept: values.autoAccept,
                  name: values.name,
                  maintenanceStartsAt: null,
                  maintenanceEndsAt: null,
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
                    values.maintenanceStartsAt as Moment
                  );
                  input.maintenanceEndsAt = toTzLessDateTime(
                    values.maintenanceEndsAt as Moment
                  );
                }

                if (id) {
                  const {
                    updateEquipment: { error },
                  } = await api().updateEquipment({
                    id: parseInt(id),
                    updateEquipmentInput: input,
                  });

                  error
                    ? enqueueError(error as ResourceId)
                    : history.push(generatePath(PATH_VIEW_EQUIPMENT, { id }));
                } else {
                  const {
                    createEquipment: { error, equipment },
                  } = await api().createEquipment({
                    newEquipmentInput: input,
                  });

                  error
                    ? enqueueError(error as ResourceId)
                    : history.push(
                        generatePath(PATH_VIEW_EQUIPMENT, {
                          id: (equipment as Equipment).id,
                        })
                      );
                }
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <Field
                      component={TextField}
                      name="name"
                      label="Equipment name"
                      margin="normal"
                      fullWidth
                      data-cy="name"
                    />

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
                              <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Field
                                  component={KeyboardDateTimePicker}
                                  name="maintenanceStartsAt"
                                  margin="normal"
                                  label="Starts at"
                                  format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
                                  ampm={false}
                                  minutesStep={60}
                                  fullWidth
                                  data-cy="maintenanceStartsAt"
                                />
                                <Field
                                  component={KeyboardDateTimePicker}
                                  name="maintenanceEndsAt"
                                  margin="normal"
                                  label="Ends at"
                                  format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
                                  ampm={false}
                                  minutesStep={60}
                                  fullWidth
                                  data-cy="maintenanceEndsAt"
                                />
                              </MuiPickersUtilsProvider>
                            </FormControl>
                          </FormGroup>
                        )}
                      </>
                    )}

                    <Box display="flex" justifyContent="flex-end">
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
    </ContentContainer>
  );
}
