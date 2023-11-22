import {
  PaperProps,
  Paper,
  styled,
  Theme,
  ContainerProps,
  Container,
} from '@mui/material';

const getValueFromArrayProperty = (
  prop: [number, number?, number?, number?],
  theme: Theme
) =>
  prop.map((item) => `${item !== undefined && theme.spacing(item)}`).join(' ');

interface StyledPaperProps extends PaperProps {
  margin?: [number, number?, number?, number?];
  padding?: [number, number?, number?, number?];
}

export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'margin' && prop !== 'padding',
})<StyledPaperProps>(({ margin, padding, theme }) => {
  const marginValue: string | number | undefined = Array.isArray(margin)
    ? getValueFromArrayProperty(margin, theme)
    : margin;
  const paddingValue: string | number | undefined = Array.isArray(padding)
    ? getValueFromArrayProperty(padding, theme)
    : padding;

  return {
    position: 'relative',
    margin: marginValue || theme.spacing(3, 0),
    padding: paddingValue || theme.spacing(2),
    [theme.breakpoints.up(600)]: {
      margin: marginValue || theme.spacing(6, 0),
      padding: paddingValue || theme.spacing(3),
    },
  };
});

interface StyledContainerProps extends ContainerProps {
  padding?: [number, number?, number?, number?];
}

export const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'margin' && prop !== 'padding',
})<StyledContainerProps>(({ padding, theme }) => {
  const paddingValue: string | number | undefined = Array.isArray(padding)
    ? getValueFromArrayProperty(padding, theme)
    : padding;

  return {
    padding: paddingValue || theme.spacing(4, 0),
  };
});
