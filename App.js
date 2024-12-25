import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Font from 'expo-font';
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./global.css";
import AppNavigator from "./src/router/AppNavigator";

const queryClient = new QueryClient();

export default function App() {

  useEffect(() => {
    const loadFonts = async () => {
      const loadedFonts = await Font.loadAsync({
        'Poppins-Regular': require('./assets/font/poppins/Poppins-Regular.ttf'),
        'Go': require('./assets/font/got/go3v2.ttf'),
      });
      // console.log('Fonts loaded:', loadedFonts);
    };
    
    loadFonts();
  }, []);
  
  

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar backgroundColor="#121212" style="light" />
      <AppNavigator />
    </QueryClientProvider>
  );
}
