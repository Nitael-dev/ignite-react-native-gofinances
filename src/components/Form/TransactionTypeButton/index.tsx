import React from "react";
import { 
  Container,
  Icon,
  Title,
} from "./styles";
import { TouchableOpacityProps } from 'react-native';

const ICONS = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

interface Props extends TouchableOpacityProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

export const TransactionTypeButton = ({title, type, isActive, ...rest}: Props) => {
  return (
    <Container {...rest} type={type} isActive={isActive}>
      <Icon 
        type={type}
        name={ICONS[type]}
      />
      <Title>
        {title}
      </Title>
    </Container>
  );
}