import React from 'react';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCardProps, TransectionCard } from '../../components/TransectionCard';
import {
  Container,
  Header,
  UserInfo,
  User,
  Photo,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards, 
  Transactions,
  Title,
  TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export const Dashboard = () => {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de site',
      amount: 'R$ 12.000,00',
      category: {
        name: 'Vendas',
        icon: 'dollar-sign',
      },
      date: '13/04/2020',
    },
    {
      id: '2',
      type: 'negative',
      title: 'Hamburgeria Pizzy',
      amount: 'R$ 59,00',
      category: {
        name: 'Alimentação',
        icon: 'coffee',
      },
      date: '10/04/2020',
    },
    {
      id: '3',
      type: 'negative',
      title: 'Aluguel do apartamento',
      amount: 'R$ 1.200,00',
      category: {
        name: 'Casa',
        icon: 'shopping-bag',
      },
      date: '23/03/2020',
    },
  ]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{uri: "https://github.com/Nitael-dev.png"}}/>
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Nitael</UserName>
            </User>
          </UserInfo>
          <Icon name="power"/>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          type='up'
          title="Entradas"
          amount='R$ 17.400,00'
          lastTransaction='Última entrada dia 13 de abril'
        />
        <HighlightCard 
          type='down'
          title="Saída"
          amount='R$ 1.259,00'
          lastTransaction='Última saída dia 03 de abril'
        />
        <HighlightCard 
          type='total'
          title="Total"
          amount='R$ 16.141,00'
          lastTransaction='01 à 16 de abril'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          keyExtractor={(item) => item.id}
          data={data} 
          renderItem={({item}) => 
            <TransectionCard data={item}/>} 
        />
      </Transactions>
    </Container>
  )
} 