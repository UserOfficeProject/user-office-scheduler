import SvgIcon from '@mui/material/SvgIcon';
import React from 'react';

// NOTE: The icon is taken from: https://materialdesignicons.com/
const IdentifierIcon: React.FC = (props) => {
  return (
    <SvgIcon {...props}>
      <path
        fill="currentColor"
        d="M10 7V9H9V15H10V17H6V15H7V9H6V7H10M16 7C17.11 7 18 7.9 18 9V15C18 16.11 17.11 17 16 17H12V7M16 9H14V15H16V9Z"
      />
    </SvgIcon>
  );
};

export default IdentifierIcon;
