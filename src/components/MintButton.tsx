import React from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
}

const MintButton: React.FC<Props> = ({ 
    children,
    onClick
  }) => {

  return (
    <Button
      onClick={onClick}
    >
    {children}
    </Button>
  );
}

export default MintButton;