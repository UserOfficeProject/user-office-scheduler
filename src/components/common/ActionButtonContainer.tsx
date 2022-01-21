import makeStyles from '@mui/styles/makeStyles';
import React, { PropsWithChildren } from 'react';

import { ButtonContainer } from 'styles/StyledComponents';

export function ActionButtonContainer(
  props: PropsWithChildren<Record<string, unknown>>
) {
  const classes = makeStyles((theme) => ({
    buttonContainer: {
      justifyItems: 'flex-end',
      marginTop: theme.spacing(3),
      '& > :not(:first-child)': {
        marginLeft: theme.spacing(2),
      },
    },
  }))();

  return (
    <ButtonContainer className={classes.buttonContainer}>
      {props.children}
    </ButtonContainer>
  );
}
