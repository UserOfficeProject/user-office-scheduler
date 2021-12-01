import { Paper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} position="relative" minHeight={200}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

type FullWidthTabsProps = {
  children: React.ReactNode[];
  tab?: number;
  tabNames: string[];
};

const FullWidthTabs: React.FC<FullWidthTabsProps> = ({
  tabNames,
  children,
  tab,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(tab || 0);

  useEffect(() => {
    setValue(tab || 0);
  }, [tab]);

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          textColor="primary"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="full width tabs example"
          indicatorColor="primary"
        >
          {tabNames.map((tabName, i) => (
            <Tab key={i} label={tabName} {...a11yProps(i)} />
          ))}
        </Tabs>
      </AppBar>

      {children.map((tabContent, i) => (
        <TabPanel key={i} value={value} index={i} dir={theme.direction}>
          {tabContent}
        </TabPanel>
      ))}
    </Paper>
  );
};

export default FullWidthTabs;
