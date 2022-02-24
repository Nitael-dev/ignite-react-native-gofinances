import '@react-navigation/stack';
import { StackHeaderMode } from '@react-navigation/stack/src/types'

declare module '@react-navigation/stack' {
  type headerMode = '';

  export interface StackHeaderMode extends headerMode {};
};
