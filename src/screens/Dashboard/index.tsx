import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
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
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const getLastTransactionDate = (
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) => {
  const lastTransaction = new Date(Math
  .max
  .apply(Math, collection
  .filter((transaction) => transaction.type === type)
  .map((transaction) => new Date(transaction.date).getTime())));
  return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
    month: 'long',
  })}`;
}

export const Dashboard = () => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = React.useState<HighlightData>({} as HighlightData);

  const loadTransactions = async () => {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions?.map((item: DataListProps) => {
      if(item.type === 'positive') {
        entriesTotal += Number(item.amount)
      } else {
        expensiveTotal += Number(item.amount)
      }
      
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));
      
      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })

    
    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensive}`
    
    const total = entriesTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensive
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }
      ),
      lastTransaction: totalInterval
    }
    })
    setTransactions(transactionsFormatted);
    setIsLoading(false);
  }
  
  React.useEffect(() => {
    loadTransactions();
  },[])

  useFocusEffect(React.useCallback(() => {
    loadTransactions();
  },[]))
  
  return (
    <Container>
      {
          isLoading ? 
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size='large'/>
          </LoadContainer> 
          :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{uri: "https://github.com/Nitael-dev.png"}}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Nitael</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard 
              type='up'
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={`Última entrada dia ${highlightData.expensives.lastTransaction}`}
            />
            <HighlightCard 
              type='down'
              title="Saída"
              amount={highlightData.expensives.amount}
              lastTransaction={`Última saída dia ${highlightData.expensives.lastTransaction}`}
            />
            <HighlightCard 
              type='total'
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              keyExtractor={(item) => item.id}
              data={transactions}
              renderItem={({item}) => {return <TransectionCard data={item}/>}} 
            />
          </Transactions>
        </>
      }
    </Container>
  )
} 