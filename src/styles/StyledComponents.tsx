import { Container, Paper, styled, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';

const getValueFromArrayProperty = (prop: number[], theme: Theme) =>
  prop.map((item) => `${theme.spacing(item)}px`).join(' ');

export const StyledPaper = styled(({ ...other }) => <Paper {...other} />)(
  ({ theme, ...props }: { theme: Theme } & CSSProperties) => {
    const margin: string | number | undefined = Array.isArray(props.margin)
      ? getValueFromArrayProperty(props.margin, theme)
      : props.margin;
    const padding: string | number | undefined = Array.isArray(props.padding)
      ? getValueFromArrayProperty(props.padding, theme)
      : props.padding;

    return {
      margin: margin || theme.spacing(3, 0),
      padding: padding || theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        margin: margin || theme.spacing(6, 0),
        padding: padding || theme.spacing(3),
      },
    };
  }
);

export const ContentContainer = styled(({ maxWidth = false, ...other }) => (
  <Container maxWidth={maxWidth} {...other} />
))(({ theme, ...props }: { theme: Theme } & CSSProperties) => {
  const padding: string | number | undefined = Array.isArray(props.padding)
    ? getValueFromArrayProperty(props.padding, theme)
    : props.padding;

  return {
    padding: padding || theme.spacing(2, 2),
  };
});

export const ButtonContainer = styled(({ ...other }) => <div {...other} />)({
  display: 'flex',
  justifyContent: 'flex-end',
});
