import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { ActivityIndicator, View } from 'react-native';

// Screens
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import QuizTakingScreen from '../screens/quiz/QuizTakingScreen';
import PaymentFlowScreen from '../screens/payment/PaymentFlowScreen';
import QuizResultsScreen from '../screens/quiz/QuizResultsScreen';
import FreePaymentFlowScreen from '../screens/payment/FreePaymentFlowScreen';

// Types
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animation: 'default',
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="QuizTaking"
                component={QuizTakingScreen}
                options={{
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="PaymentFlow"
                component={PaymentFlowScreen}
                options={{
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="FreePaymentFlow"
                component={FreePaymentFlowScreen}
                options={{
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="QuizResults"
                component={QuizResultsScreen}
                options={{
                  animation: 'none',
                }}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
