import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  QuizTaking: {
    packageId: string;
  };
  PaymentFlow: {
    packageId: string;
    amount: number;
  };
  FreePaymentFlow: {
    packageId: string;
  };
  QuizResults: {
    packageId: string;
    resultId: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Packages: undefined;
  MyQuizzes: undefined;
  Rankings: undefined;
  Profile: undefined;
};
