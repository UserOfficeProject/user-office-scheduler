import {
  createTheme,
  Theme,
  responsiveFontSizes,
} from '@material-ui/core/styles';

const createSchedulerTheme = (): Theme =>
  responsiveFontSizes(
    createTheme({
      palette: {
        primary: {
          dark: '#0081b0',
          main: '#0094ca',
          light: '#00a6e3',
        },
        secondary: {
          dark: '#85a600',
          main: '#99bf00',
          light: '#b8e600',
        },
        error: {
          main: '#f44336',
        },
      },
    })
  );

const createSchedulerDevelopTheme = (): Theme =>
  responsiveFontSizes(
    createTheme({
      palette: {
        primary: {
          dark: '#b33739',
          main: '#FF4E50',
          light: '#FC913A',
        },
        secondary: {
          dark: '#F9D423',
          main: '#F9D423',
          light: '#E1F5C4',
        },
        error: {
          main: '#f44336',
        },
        action: {},
      },
    })
  );

const developHosts: Record<string, boolean> = {
  localhost: true,
  '127.0.0.1': true,
  'scheduler.useroffice-test.esss.lu.se': true,
};

const isDevelop = (): boolean => {
  return developHosts[window.location.hostname];
};

export function getTheme(): Theme {
  return isDevelop() ? createSchedulerDevelopTheme() : createSchedulerTheme();
}
