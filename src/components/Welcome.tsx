import { View, Text } from 'react-native';
import React from 'react';

interface IWelcome {
  title: string;
}

const Welcome = ({title}: IWelcome) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default Welcome;
