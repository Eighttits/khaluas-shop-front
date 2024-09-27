// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabsNavigator from "./src/routes/BottomTabsNavigator";
import { MenuProvider } from 'react-native-popup-menu';
import { LogBox } from'react-native';

LogBox.ignoreAllLogs(true); 
ErrorUtils.setGlobalHandler(() => {});


const App = () => {
  return (
    <MenuProvider>
      <NavigationContainer>
        <BottomTabsNavigator />
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
