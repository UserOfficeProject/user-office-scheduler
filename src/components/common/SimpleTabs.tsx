import { Add as AddIcon } from '@mui/icons-material';
import { Button, CircularProgress, Paper, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    width: 'auto',
    flexShrink: 2,
    backgroundColor: theme.palette.grey['100'],
    boxShadow: theme.shadows[1],
  },
  tabsNoItems: {
    minWidth: '150px',
  },
  tabsRightBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  addButton: {
    minWidth: 'auto',
    padding: theme.spacing(1),

    '&.Mui-disabled': {
      pointerEvents: 'all',
    },
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
  const [value, setValue] = useState(tab || 0);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const noItems = children.length === 0;

  // NOTE: If screen is mobile use horizontal orientation for space optimization
  if (isMobile) {
    orientation = 'horizontal';
  }

  const isVerticalOrientation = orientation === 'vertical';

  useEffect(() => {
    setValue(tab || 0);
  }, [tab]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  const handleAddNew = async () => {
    setIsAddingNewItem(true);
    // NOTE: We have a check for this in the code and handleAddNew button is not visible if handleAdd is not defined.
    await handleAdd?.();
    setIsAddingNewItem(false);
  };

  const tabsClasses = `${classes.tabs} ${
    isVerticalOrientation && classes.tabsRightBorder
  } ${noItems && classes.tabsNoItems}`;

  return (
    <Paper elevation={3} className={isVerticalOrientation ? classes.root : ''}>
      <Tabs
        value={value}
        textColor="primary"
        variant="scrollable"
        scrollButtons={isMobile ? true : 'auto'}
        onChange={handleChange}
        aria-label={`${orientation} tabs example`}
        indicatorColor="primary"
        orientation={orientation}
        className={tabsClasses}
      >
        {tabNames.map((tabName, i) => (
          <Tab key={i} label={tabName} {...a11yProps(i, orientation)} />
        ))}
        {!!handleAdd && (
          <Tab
            className={classes.addButton}
            disabled
            label={
              <Button
                variant="outlined"
                color="primary"
                component="span"
                onClick={handleAddNew}
                disabled={isAddingNewItem}
                startIcon={
                  isAddingNewItem ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                data-cy="add-new-timeslot"
              >
                Add time
              </Button>
            }
          />
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
