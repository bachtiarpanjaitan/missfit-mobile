import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllQuizPackages, QuizPackage } from '../../redux/slices/quizSlice';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { formatToRupiah } from '../../../lib/utils';
import { styles } from "../../styles/globalStyles";
import { useFocusEffect } from '@react-navigation/native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Packages'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function PackagesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { allPackages, loading } = useAppSelector((state) => state.quiz);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchText, setSearchText] = useState('');
  const packages = allPackages;

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchAllQuizPackages());
    }, [dispatch])
  );

  const getFilteredPackages = () => {
    let filtered = packages;

    if (filter === 'free') {
      filtered = filtered.filter((pkg) => pkg.IsFree);
    } else if (filter === 'paid') {
      filtered = filtered.filter((pkg) => !pkg.IsFree);
    }

    if (searchText) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.Title.toLowerCase().includes(searchText.toLowerCase()) ||
          pkg.Category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPackages = getFilteredPackages();

  const renderPackageCard = (item: QuizPackage) => (
    <TouchableOpacity
      key={item.Id}
      style={styles.packageCard}
      disabled
    >
      {item.ThumbnailUrl && (
        <Image
          source={{ uri: item.ThumbnailUrl }}
          style={styles.packageImage}
        />
      )}
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.packageTitle} numberOfLines={2}>
              {item.Title}
            </Text>
            <View style={styles.difficultyBadge}>
              <Text
                style={[
                  styles.difficultyText,
                  item.DifficultyLevel === 'easy' && styles.difficultyEasy,
                  item.DifficultyLevel === 'medium' && styles.difficultyMedium,
                  item.DifficultyLevel === 'hard' && styles.difficultyHard,
                ]}
              >
                {item.DifficultyLevel.charAt(0).toUpperCase() +
                  item.DifficultyLevel.slice(1)}
              </Text>
            </View>
          </View>
          {!item.IsFree && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                {formatToRupiah(item.Price, item.Currency)}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.packageDescription} numberOfLines={2}>
          {item.Description}
        </Text>
        <View style={styles.packageMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle-outline" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.TotalQuestions} Q</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.DurationMinutes}m</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.metaText}>{item.Rating.toFixed(1)}</Text>
          </View>
          {item.IsPurchased && (
            <View style={styles.purchasedBadge}>
              <Text style={styles.purchasedText}>Dibeli</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (item.IsPurchased && !item.IsFree) {
              // Start quiz
              navigation.navigate('MyQuizzes');
            }
            else if (item.IsFree && !item.IsPurchased) {
              // Start quiz
              navigation.navigate('FreePaymentFlow', {
                packageId: item.Id,
              });
            }
            else {
              // Navigate to payment
              navigation.navigate('PaymentFlow', {
                packageId: item.Id,
                amount: item.Price,
              });
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {item.IsPurchased && !item.IsFree ? 'Mulai Kuis' : item.IsFree && !item.IsPurchased ? 'Dapatkan Gratis' : 'Beli Sekarang'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Paket Kuis</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Kuis"
            placeholderTextColor="#d1d5db"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.filterTabs}>
          {(['all', 'free', 'paid'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                filter === tab && styles.filterTabActive,
              ]}
              onPress={() => setFilter(tab)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tab && styles.filterTabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : filteredPackages.length > 0 ? (
          <FlatList
            data={filteredPackages}
            renderItem={({ item }) => renderPackageCard(item)}
            keyExtractor={(item) => item.Id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Tidak ada kuis ditemukan</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
