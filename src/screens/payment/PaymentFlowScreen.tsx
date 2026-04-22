import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  initiatePayment,
  verifyPayment,
  resetPayment,
  clearError
} from '../../redux/slices/paymentSlice';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { formatToRupiah } from '../../../lib/utils';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "../../styles/globalStyles";

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentFlow'>;

type PaymentMethod = 'dana' | 'gopay' | 'ovo' | 'linkaja' | 'card';

const PAYMENT_METHODS: { id: PaymentMethod; name: string; icon: string }[] = [
  { id: 'dana', name: 'Dana', icon: '💰' },
  { id: 'gopay', name: 'GoPay', icon: '🏦' },
  { id: 'ovo', name: 'OVO', icon: '💳' },
  { id: 'linkaja', name: 'LinkAja', icon: '📱' },
  { id: 'card', name: 'Card', icon: '💳' },
];

export default function PaymentFlowScreen({ route, navigation }: Props) {
  const { packageId, amount } = route.params;
  const dispatch = useAppDispatch();
  const { loading, currentPayment, error, successMessage } = useAppSelector(
    (state) => state.payment
  );
  const pkg = useAppSelector((state) =>
    state.quiz.allPackages.find((p) => p.Id === packageId)
  );
  useEffect(() => {
    dispatch(clearError());
    dispatch(resetPayment());
  }, [dispatch]);


  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setStep('processing');

    const result = await dispatch(
      initiatePayment({
        packageId,
        method: selectedMethod,
      })
    );

    if (initiatePayment.fulfilled.match(result)) {
      // Simulate payment processing delay
      setTimeout(() => {
        const verified = Math.random() > 0.2; // 80% success rate

        if (verified) {
          dispatch(
            verifyPayment(result.payload.transactionId)
          ).then((verifyResult) => {
            if (verifyPayment.fulfilled.match(verifyResult)) {
              setStep('success');
              setTimeout(() => {
                navigation.navigate('Main' as any, {
                  screen: 'MyQuizzes',
                });
              }, 2000);
            }
          });
        } else {
          Alert.alert(
            'Payment Failed',
            'Your payment could not be processed. Please try again.'
          );
          setStep('method');
        }
      }, 2000);
    } else {
      Alert.alert('Error', error || 'Failed to initiate payment');
      setStep('method');
    }
  };

  if (step === 'processing') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.processingText}>
            Processing your payment...
          </Text>
          <Text style={styles.processingSubtext}>
            Please don't close this screen
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#16a34a" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>
            You can now access {pkg?.Title}
          </Text>
          <Text style={styles.successSubtext}>
            Redirecting to your quizzes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
            </View>

            {pkg?.ThumbnailUrl && (
              <Image
                source={{ uri: pkg.ThumbnailUrl }}
                style={styles.packageImage}
              />
            )}

            <View style={styles.summaryDetails}>
              <View style={styles.summaryRow}>
                <Text style={styles.detailLabel}>{pkg?.Title}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.detailLabel}>Questions:</Text>
                <Text style={styles.detailValue}>{pkg?.TotalQuestions}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{pkg?.DurationMinutes} minutes</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>
                  {formatToRupiah(amount, pkg?.Currency)}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.methodsSection}>
            <Text style={styles.methodsTitle}>Select Payment Method</Text>

            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodButton,
                  selectedMethod === method.id && styles.methodButtonSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodIcon}>
                  <Text style={styles.methodIconText}>{method.icon}</Text>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>
                    {method.id === 'dana' && 'Fast and secure payment'}
                    {method.id === 'gopay' && 'Pay with your GoPay balance'}
                    {method.id === 'ovo' && 'Instant payment'}
                    {method.id === 'linkaja' && 'Mobile money wallet'}
                    {method.id === 'card' && 'Credit or debit card'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.methodRadio,
                    selectedMethod === method.id &&
                    styles.methodRadioSelected,
                  ]}
                >
                  {selectedMethod === method.id && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#ffffff"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Ionicons name="lock-closed" size={16} color="#6b7280" />
            <Text style={styles.termsText}>
              Your payment information is secure and encrypted
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Payment Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              (!selectedMethod || loading) && styles.disabledButton,
            ]}
            onPress={handlePayment}
            disabled={!selectedMethod || loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="card" size={20} color="#ffffff" />
                <Text style={styles.paymentButtonText}>
                  Pay for {formatToRupiah(amount, pkg?.Currency)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}