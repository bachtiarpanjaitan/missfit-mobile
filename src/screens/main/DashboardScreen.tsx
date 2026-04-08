import React, { useEffect } from 'react';
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
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchQuizPackages,
  fetchQuizResults,
  QuizPackage,
} from '../../redux/slices/quizSlice';
import { fetchGlobalRankings, RankingUser } from '../../redux/slices/rankingSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

const formatToRupiah = (amount: number) => {
  // Ensure input is a valid number
  if (isNaN(amount)) {
    console.error("Invalid input: The input should be a valid number.");
    return ""; // Or throw an error as appropriate
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // IDR typically has no decimal places
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { packages, loading } = useAppSelector((state) => state.quiz);
  const { globalRankings } = useAppSelector((state) => state.ranking);

  useEffect(() => {
    dispatch(fetchQuizPackages());
    dispatch(fetchGlobalRankings(10));
    dispatch(fetchQuizResults());
  }, []);

  const latestPackages = packages.slice(0, 5);
  const freePackages = packages.filter((pkg) => pkg.isFree).slice(0, 5);
  const topRankings = globalRankings.slice(0, 10);

  const renderPackageCard = (item: QuizPackage) => (
    <TouchableOpacity
      key={item.id}
      style={styles.packageCard}
      onPress={() =>
        navigation.navigate('Packages' as never, {
          screen: 'PackageDetail',
          params: { packageId: item.id },
        } as never)
      }
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.packageImage}
        />
      )}
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {!item.isFree && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                {formatToRupiah(item.price)}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.packageDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.packageMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.questionCount}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.duration}m</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.metaText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRankingItem = (item: RankingUser) => (
    <View key={item.userId} style={styles.rankingItem}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>
      {item.userAvatar && (
        <Image
          source={{ uri: item.userAvatar }}
          style={styles.userAvatar}
        />
      )}
      <View style={styles.rankingContent}>
        <Text style={styles.rankingName} numberOfLines={1}>
          {item.userName}
        </Text>
        <Text style={styles.rankingPoints}>{item.points} points</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#fbbf24" />
              <Text style={styles.statValue}>{user?.points || 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkbox" size={20} color="#6366f1" />
              <Text style={styles.statValue}>
                {user?.totalQuizzesTaken || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Latest Packages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Quizzes</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Packages' as never)
              }
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={latestPackages}
            renderItem={({ item }) => renderPackageCard(item)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            gap={12}
          />
        </View>

        {/* Free Packages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Free Quizzes</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Packages' as never)
              }
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={freePackages}
            renderItem={({ item }) => renderPackageCard(item)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            gap={12}
          />
        </View>

        {/* Top Rankings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top 10 Global Rankings</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Rankings' as never)
              }
            >
              <Text style={styles.viewAll}>View More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rankingsList}>
            {topRankings.map((item) => renderRankingItem(item))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  userStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  viewAll: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  packageImage: {
    width: '100%',
    height: 150,
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
  packageTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
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
  },
  packageMeta: {
    flexDirection: 'row',
    gap: 12,
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
  rankingsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  rankingContent: {
    flex: 1,
  },
  rankingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  rankingPoints: {
    fontSize: 12,
    color: '#6b7280',
  },
});
