import { Button, Paper, useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useEffect } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  orientation: 'horizontal' | 'vertical';
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, orientation, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`${orientation}-tab-${index}`}
      aria-labelledby={`${orientation}-tabpanel-${index}`}
      width="100%"
      className="tinyScroll"
      overflow="auto"
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Box>
  );
}

const a11yProps = (index: number, orientation: 'horizontal' | 'vertical') => ({
  id: `${orientation}-tab-${index}`,
  'aria-controls': `${orientation}-tabpanel-${index}`,
});

type SimpleTabsProps = {
  children: React.ReactNode[];
  tab?: number;
  tabNames: string[];
  orientation?: 'horizontal' | 'vertical';
  handleAdd?: () => Promise<void>;
  noItemsText?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  rootHeightLimit: {
    height: '500px', // NOTE: When orientation is vertical we limit the height to have better user experience
  },
  tabs: {
    width: 'auto',
    flexShrink: 2,
    backgroundColor: theme.palette.grey['100'],
    boxShadow: theme.shadows[1],
  },
  tabsRightBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  addButton: {
    minWidth: '190px',
    padding: theme.spacing(1),
  },
}));

const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabNames,
  children,
  tab,
  orientation = 'horizontal',
  handleAdd,
  noItemsText,
}) => {
  const isMobile = useMediaQuery('(max-width: 500px)');
  const classes = useStyles();
  const [value, setValue] = React.useState(tab || 0);
  const isExtraLargeScreen = useMediaQuery('(min-height: 1200px)');

  // NOTE: If screen is mobile use horizontal orientation for space optimization
  if (isMobile) {
    orientation = 'horizontal';
  }

  const isVerticalOrientation = orientation === 'vertical';

  useEffect(() => {
    setValue(tab || 0);
  }, [tab]);

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  // NOTE: If screen is extra large do not limit the tabs height for space optimization
  const rootClasses = isExtraLargeScreen
    ? classes.root
    : `${classes.root} ${classes.rootHeightLimit}`;

  const noItems = children.length === 0;

  return (
    <Paper elevation={3} className={isVerticalOrientation ? rootClasses : ''}>
      <Tabs
        value={value}
        textColor="primary"
        variant="scrollable"
        scrollButtons={isMobile ? 'on' : 'auto'}
        onChange={handleChange}
        aria-label={`${orientation} tabs example`}
        indicatorColor="primary"
        orientation={orientation}
        className={`${classes.tabs} ${
          isVerticalOrientation ? classes.tabsRightBorder : ''
        }`}
      >
        {tabNames.map((tabName, i) => (
          <Tab key={i} label={tabName} {...a11yProps(i, orientation)} />
        ))}
        {!!handleAdd && (
          <div className={`MuiTab-root ${noItems && classes.addButton}`}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              data-cy="add-new-timeslot"
            >
              Add time
            </Button>
          </div>
        )}
      </Tabs>

      {noItems ? (
        <Box
          display="flex"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          {noItemsText}
        </Box>
      ) : (
        children.map((tabContent, i) => (
          <TabPanel key={i} value={value} index={i} orientation={orientation}>
            {tabContent}
          </TabPanel>
        ))
      )}
    </Paper>
  );
};

export default SimpleTabs;
