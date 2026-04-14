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
  SafeAreaView,
  TextInput
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAllQuizPackages, QuizPackage } from '../../redux/slices/quizSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { formatToRupiah } from '../../../lib/utils';

type Props = BottomTabScreenProps<MainTabParamList, 'Packages'>;

export default function PackagesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { allPackages, loading } = useAppSelector((state) => state.quiz);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchText, setSearchText] = useState('');
  const packages = allPackages;
  useEffect(() => {
    dispatch(fetchAllQuizPackages());
  }, []);

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
      onPress={() => {
        // Navigate to quiz detail or start quiz
        navigation.navigate('MyQuizzes' as never);
      }}
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
              <Text style={styles.purchasedText}>Purchased</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (item.IsPurchased) {
              // Start quiz
              navigation.navigate('MyQuizzes' as never);
            } else {
              // Navigate to payment
              navigation.navigate('Packages' as never, {
                screen: 'PaymentScreen',
                params: { packageId: item.Id },
              } as never);
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {item.IsPurchased ? 'Start Quiz' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Packages</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search quizzes..."
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
          <Text style={styles.emptyText}>No quizzes found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  filterTabActive: {
    backgroundColor: '#6366f1',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  packageImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e5e7eb',
  },
  packageContent: {
    padding: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    gap: 8,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  difficultyEasy: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  difficultyMedium: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  difficultyHard: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  priceBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '600',
  },
  packageDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  packageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  purchasedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  purchasedText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
