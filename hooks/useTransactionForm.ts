import { router } from 'expo-router';
import { useCallback, useReducer } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useTransactions } from '../contexts/TransactionContext';
import { Category, TransactionItem } from '../types';

// Define a "forma" do estado do nosso formulário
interface FormState {
  type: 'saida' | 'entrada';
  description: string;
  amount: string;
  category: Category | null;
  date: Date;
  notes: string;
  items: TransactionItem[] | null;
  errors: { [key: string]: string | null };
  isLoading: boolean;
}

// Ações que podemos usar para atualizar o estado
type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; payload: any }
  | { type: 'SET_ERRORS'; payload: { [key: string]: string | null } }
  | { type: 'RESET_FORM' };

// O estado inicial do formulário, quando a tela é aberta ou limpa
const initialState: FormState = {
  type: 'saida',
  description: '',
  amount: '',
  category: null,
  date: new Date(),
  notes: '',
  items: null,
  errors: {},
  isLoading: false,
};

// A função que gerencia todas as alterações de estado
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      if (action.field === 'type') {
        return { ...state, [action.field]: action.payload, category: null, errors: { ...state.errors, category: null } };
      }
      return { ...state, [action.field]: action.payload, errors: { ...state.errors, [action.field]: null } };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export const useTransactionForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // MUDANÇA: Corrigimos o nome da função importada do contexto
  const { addTransaction } = useTransactions();

  // Função auxiliar para atualizar um campo do formulário
  const setField = useCallback((field: keyof FormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, payload: value });
  }, []);

  // Função para validar todos os campos antes de enviar
  const validate = useCallback(() => {
    const newErrors: { [key: string]: string | null } = {};
    if (!state.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!state.amount) newErrors.amount = 'Valor é obrigatório';
    else if (parseFloat(state.amount.replace(',', '.')) <= 0) newErrors.amount = 'Valor deve ser positivo';
    if (!state.category) newErrors.category = 'Categoria é obrigatória';

    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    return Object.values(newErrors).every(error => !error);
  }, [state.description, state.amount, state.category]);

  // Função principal para salvar a transação
  const saveTransaction = useCallback(async () => {
    Keyboard.dismiss();
    if (!validate()) {
      Alert.alert('Formulário Inválido', 'Por favor, corrija os campos destacados.');
      return;
    }

    setField('isLoading', true);
    try {
      const payload = {
        description: state.description.trim(),
        amount: parseFloat(state.amount.replace(',', '.')),
        type: state.type === 'entrada' ? 'income' : 'expense',
        category: state.category!,
        date: state.date,
        notes: state.notes.trim(),
        items: state.items,
      };
      
      // MUDANÇA: Usamos o nome correto da função aqui
      await addTransaction(payload);
      
      Alert.alert('Sucesso!', 'Transação salva localmente e sincronizando.', [
          { text: 'Adicionar Outra', onPress: () => dispatch({ type: 'RESET_FORM' }) },
          { text: 'OK', onPress: () => { if (router.canGoBack()) router.back() } },
      ]);

    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar a transação.');
    } finally {
      setField('isLoading', false);
    }
  }, [state, validate, addTransaction]);

  return { state, setField, saveTransaction, resetForm: () => dispatch({ type: 'RESET_FORM' }) };
};