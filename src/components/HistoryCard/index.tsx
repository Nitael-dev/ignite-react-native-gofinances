import React from 'react';

import { 
  Container,
  Title,
  Amount,
} from './styles';

interface Props {
  title: string;
  amount: string;
  color: string;
}

export const HistoryCard = ({
  title,
  color,
  amount,
}: Props) => {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
