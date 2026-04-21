import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import {
    initiateFreePayment,
} from '../../redux/slices/paymentSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "../../styles/globalStyles";

type Props = NativeStackScreenProps<RootStackParamList, 'FreePaymentFlow'>;
export default function FreePaymentFlowScreen({ route, navigation }: Props) {
    const { packageId } = route.params;
    const dispatch = useAppDispatch();
    const { loading, currentPayment, error, successMessage } = useAppSelector(
        (state) => state.payment
    );
    const pkg = useAppSelector((state) =>
        state.quiz.allPackages.find((p) => p.Id === packageId)
    );

    const handlePayment = async () => {
        // Alert.alert('Payment', 'Payment successful');
        const result = await dispatch(
            initiateFreePayment({
                packageId
            })
        );

        if (initiateFreePayment.fulfilled.match(result)) {
            navigation.navigate('Main' as any, {
                screen: 'MyQuizzes',
            });
        } else {
            Alert.alert('Error', error || 'Failed to get free package');
        }
    };

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
                            <Text style={styles.summaryTitle}>Package Details</Text>
                        </View>

                        {pkg?.ThumbnailUrl && (
                            <Image
                                source={{ uri: pkg.ThumbnailUrl }}
                                style={styles.packageImage}
                            />
                        )}

                        <View style={styles.summaryDetails}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabelTitle}>{pkg?.Title}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>{pkg?.Description}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>Category:</Text>
                                <Text style={styles.detailValue}>{pkg?.Category}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>Questions:</Text>
                                <Text style={styles.detailValue}>{pkg?.TotalQuestions}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>Difficulty:</Text>
                                <Text style={styles.detailLabel}>{pkg?.DifficultyLevel.toUpperCase()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>Duration:</Text>
                                <Text style={styles.detailValue}>{pkg?.DurationMinutes} minutes</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.detailLabel}>Max Attempts:</Text>
                                <Text style={styles.detailValue}>{pkg?.MaxAttempts}</Text>
                            </View>
                        </View>
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
                            styles.paymentButton
                        ]}
                        onPress={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <>
                                <Ionicons name="card" size={20} color="#ffffff" />
                                <Text style={styles.paymentButtonText}>
                                    Get Free Package
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
