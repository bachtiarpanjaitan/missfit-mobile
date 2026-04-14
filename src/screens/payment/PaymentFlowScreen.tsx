import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  initiatePayment,
  verifyPayment,
  resetPayment,
} from '../../redux/slices/paymentSlice';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { formatToRupiah } from '../../../lib/utils';

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

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  useEffect(() => {
    return () => {
      dispatch(resetPayment());
    };
  }, []);

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 20,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  successText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  packageImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  summaryDetails: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  methodsSection: {
    gap: 12,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  methodButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  methodButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f4ff',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconText: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  methodRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  methodRadioSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  termsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    lineHeight: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    flex: 1,
    lineHeight: 16,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  paymentButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
