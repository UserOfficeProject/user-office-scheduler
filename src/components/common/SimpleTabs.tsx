import { Paper } from '@material-ui/core';
// import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
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
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      width="100%"
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

type VerticalTabsProps = {
  children: React.ReactNode[];
  tab?: number;
  tabNames: string[];
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 'auto',
    flexShrink: 2,
  },
}));

// TODO: Work a bit on the mobile view because the tab controls are not visible when screen is too small.
// Maybe it will be good to show controls on top when mobile or somehow make it a bit better when it comes to responsiveness
const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabNames,
  children,
  tab,
}) => {
  const classes = useStyles();
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
    <Paper elevation={3} className={classes.root}>
      {/* <AppBar position="static" color="default" > */}
      <Tabs
        value={value}
        textColor="primary"
        variant="scrollable"
        onChange={handleChange}
        aria-label="Vertical tabs example"
        indicatorColor="primary"
        orientation="vertical"
        className={classes.tabs}
      >
        {tabNames.map((tabName, i) => (
          <Tab key={i} label={tabName} {...a11yProps(i)} />
        ))}
      </Tabs>
      {/* </AppBar> */}

      {children.map((tabContent, i) => (
        <TabPanel key={i} value={value} index={i}>
          {tabContent}
        </TabPanel>
      ))}
    </Paper>
  );
};

export default VerticalTabs;
