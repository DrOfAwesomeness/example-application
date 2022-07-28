import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button/Button'

const ButtonWithComponent: React.FC = <C extends React.ElementType>(props: ButtonProps<C, { component?: C }>) => {
  return <Button {...props} />;
}

export default ButtonWithComponent;