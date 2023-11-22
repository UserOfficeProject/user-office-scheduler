import { FormControlLabel, Input, InputLabel } from '@mui/material';
import { FormikHelpers, FormikValues } from 'formik';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';

const handleColorChange = debounce(
  (
    setColorValue: React.Dispatch<React.SetStateAction<string>>,
    form: FormikHelpers<FormikValues>,
    fieldName: string,
    value: string
  ) => {
    setColorValue(value);
    form.setFieldValue(fieldName, value);
  },
  500
);

const useStyles = makeStyles()((theme) => ({
  formControlLabel: {
    margin: 0,
    width: '100%',
    transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
  },
  input: {
    minWidth: '30px',
    marginRight: theme.spacing(1),
    '&:before': {
      border: 'none !important',
    },
    '& input': {
      cursor: 'pointer',
    },
  },
}));

const FormikColorPicker = ({
  field,
  label,
  form,
  ...rest
}: {
  field: { name: string; value: string };
  label: string;
  form: FormikHelpers<FormikValues>;
  'data-cy'?: string;
}) => {
  const { classes } = useStyles();
  const [colorValue, setColorValue] = useState(field.value);

  return (
    <>
      <InputLabel htmlFor={field.name} shrink>
        {label}
      </InputLabel>
      <FormControlLabel
        data-cy={rest['data-cy']}
        className={classes.formControlLabel}
        control={
          <Input
            aria-label={label}
            className={classes.input}
            {...field}
            value={colorValue}
            type="color"
            // NOTE: Using onInput instead of onChage because for some reason cypress is not triggering the change event properly: https://github.com/cypress-io/cypress/issues/1570
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleColorChange(
                setColorValue,
                form,
                field.name,
                event.target.value
              );
            }}
          />
        }
        label={colorValue}
      />
    </>
  );
};

export default FormikColorPicker;
