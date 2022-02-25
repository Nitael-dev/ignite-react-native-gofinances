import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { useAuth } from '../../hooks/AuthContext';
import { categories } from '../../utils/categories';

import { 
  Container,
  Content,
  Header,
  Title,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';

interface TransactionsData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  key: string;
  percent: string;
}

export const Resume = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [totalByCategories, setTotalByCategories] = React.useState<CategoryData[]>([]);

  const handleDateChange = (action: 'next' | 'prev') => {
    setIsLoading(true);
    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  const loadData = async () => {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionsData) =>  {
        return (
          expensive.type === 'negative' &&
          new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
          new Date (expensive.date).getFullYear() === selectedDate.getFullYear()  
        )
      });

    const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionsData) => {
      return acumullator + Number(expensive.amount);
    }, 0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionsData) => {
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      })
      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          key: category.key,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        })
      }
    })
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(React.useCallback(() => {
    loadData();
  },[selectedDate]))
  return (
    <Container>
          <Header>
            <Title>Resumo por categoria</Title>

          </Header>
        {

          isLoading ? 
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size='large'/>
          </LoadContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: useBottomTabBarHeight(),
              paddingHorizontal: 24
            }}
          >

            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <MonthSelectIcon name='chevron-left'/>
              </MonthSelectButton>

              <Month>
                {
                  format(selectedDate, 'MMMM, yyyy', {locale: ptBR})
                }
              </Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name='chevron-right'/>
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                colorScale={totalByCategories.map(item => item.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape,
                  }
                }}
                labelRadius={50}
                data={totalByCategories}
                x='percent'
                y='total'
              />
            </ChartContainer>
            {
              totalByCategories.map((item) => {
                return (<HistoryCard
                  key={item.key}
                  title={item.name}
                  color={item.color}
                  amount={item.totalFormatted}
                />)
              })
            } 
        </Content>
      }
    </Container>
  );
}