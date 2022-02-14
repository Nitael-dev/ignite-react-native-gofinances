import React, { useEffect } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo').required('O valor é obrigatório'),
})

type NavigationProps = {
  navigate: (screen: string) => void;
}

export const Register = () => {
  const dataKey = '@gofinances:transactions';
  const [category, setCategory] = React.useState({
    key: 'Category',
    name: 'Categoria',
  });
  const { 
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState('');

  const navigation = useNavigation<NavigationProps>();

  const handleTransactionType = (type: 'up' | 'down') => {
    setTransactionType(type)
  }
  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  }
  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  }
  const handleRegister = async (form: FieldValues) => {
    if(!transactionType)
      return Alert.alert('Selecione o tipo de transação');
    if(category.key === 'Category')
      return Alert.alert('Selecione a categoria');
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }
    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      })
      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar')
    }
  }
  useEffect(() => {
    const loadData = async() => {
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));
    }
    // const removeAll = async () => {
    //   await AsyncStorage.removeItem(dataKey);
    // }
    // removeAll();
    loadData();
  },[])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              placeholder='Nome'
              name='name'
              control={control}
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              placeholder='Preço'
              name='amount'
              control={control}
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type='up'
                title='Income'
                onPress={() => handleTransactionType('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                title='Outcome'
                type='down'
                onPress={() => handleTransactionType('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionsTypes>

            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button onPress={handleSubmit(handleRegister)} title='Enviar'/>
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            closeSelectCategory={handleCloseSelectCategoryModal}
            setCategory={setCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}