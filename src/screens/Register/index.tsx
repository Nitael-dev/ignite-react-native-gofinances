import React from 'react';
import { Modal } from 'react-native';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
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

export const Register = () => {
  const [category, setCategory] = React.useState({
    key: 'Category',
    name: 'Categoria',
  })
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState('');

  const handleTransactionType = (type: 'up' | 'down') => {
    setTransactionType(type)
  }
  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  }
  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  }
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input placeholder='Nome'/>
          <Input placeholder='Preço'/>
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
        <Button title='Enviar'/>
      </Form>
      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          closeSelectCategory={handleCloseSelectCategoryModal}
          setCategory={setCategory}
        />
      </Modal>
    </Container>
  );
}