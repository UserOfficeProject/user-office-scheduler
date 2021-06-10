import { Container, Paper, styled } from '@material-ui/core';
import React from 'react';
import { getTheme } from 'theme';

const getSpacing = (
  userValue: [number, number, number, number],
  defaultValue: [number, (number | string)?, number?, number?]
): string => {
  // eslint-disable-next-line prefer-spread
  return getTheme().spacing.apply(getTheme(), userValue || defaultValue);
};

export const StyledPaper = styled(({ style, ...other }) => (
  <Paper {...other} style={{ position: 'relative', ...style }} />
))({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  margin: (props: any) => getSpacing(props.margin, [3, 0]),
  padding: (props) => getSpacing(props.padding, [2]),
  [getTheme().breakpoints.up(600 + getTheme().spacing(3) * 2)]: {
    margin: (props) => getSpacing(props.margin, [6, 0]),
    padding: (props) => getSpacing(props.padding, [3]),
  },
});

export const ContentContainer = styled(({ ...other }) => (
  <Container maxWidth="lg" {...other} />
))({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  margin: (props: any) => getSpacing(props.margin, [0, 'auto']),
  padding: (props) => getSpacing(props.padding, [4, 0]),
});

export const ButtonContainer = styled(({ ...other }) => <div {...other} />)({
  display: 'flex',
  justifyContent: 'flex-end',
});
