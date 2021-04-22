import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React, { useRef, useState } from 'react';

type SplitButtonOption<T> = {
  label: string;
  key: T;
};

type SplitButtonProps<T> = {
  options: SplitButtonOption<T>[];
  label: string;
  disabled?: boolean;
  dropdownDisabled?: boolean;
  onClick?: (selectedKey: T) => void;
};

export default function SplitButton<T extends string>({
  options,
  label,
  disabled,
  dropdownDisabled,
  onClick,
}: SplitButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = useState<T>(options[0]?.key ?? '');

  const handleClick = () => {
    onClick?.(selectedKey);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    key: T
  ) => {
    setSelectedKey(key);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant={disabled ? 'outlined' : 'contained'}
        color="primary"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button disabled={disabled} onClick={handleClick}>
          {options.find(({ key }) => key === selectedKey)?.label}
        </Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label={label}
          aria-haspopup="menu"
          onClick={handleToggle}
          disabled={dropdownDisabled}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 10 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map(option => (
                    <MenuItem
                      key={option.key}
                      selected={option.key === selectedKey}
                      onClick={event => handleMenuItemClick(event, option.key)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
