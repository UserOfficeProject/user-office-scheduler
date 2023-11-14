import React, { PropsWithChildren } from 'react';
import { makeStyles } from 'tss-react/mui';

import { ButtonContainer } from 'styles/StyledComponents';

export function ActionButtonContainer(
  props: PropsWithChildren<Record<string, unknown>>
) {
  const { classes } = makeStyles()((theme) => ({
    buttonContainer: {
      justifyItems: 'flex-end',
      marginTop: theme.spacing(3),
      '& > :not(:first-of-type)': {
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
