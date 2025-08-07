import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';

function App(): JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <RootNavigator />
    </>
  );
}

export default App;