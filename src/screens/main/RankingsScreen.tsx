import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchGlobalRankings,
  fetchPackageRankings,
  RankingUser,
} from '../../redux/slices/rankingSlice';
import { fetchQuizPackages } from '../../redux/slices/quizSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = BottomTabScreenProps<MainTabParamList, 'Rankings'>;

export default function RankingsScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { globalRankings, userRank, loading } = useAppSelector(
    (state) => state.ranking
  );
  const { myPackages } = useAppSelector((state) => state.quiz);
  const [activeTab, setActiveTab] = useState<'global' | 'package'>('global');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGlobalRankings(50));
    dispatch(fetchQuizPackages());
  }, []);

  const packageRankings =
    selectedPackageId &&
    (useAppSelector((state) => state.ranking.packageRankings[selectedPackageId]) || []);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    dispatch(fetchPackageRankings(packageId));
  };

  const renderRankingUser = (item: RankingUser, index: number) => {
    const isCurrentUser = userRank && item.userId === userRank.userId;

    return (
      <View
        key={`${item.userId}-${index}`}
        style={[
          styles.rankingItem,
          isCurrentUser && styles.currentUserItem,
        ]}
      >
        <View style={styles.rankContainer}>
          <View
            style={[
              styles.rankBadge,
              item.rank <= 3 && styles.topRankBadge,
            ]}
          >
            <Text
              style={[
                styles.rankText,
                item.rank === 1 && styles.rank1,
                item.rank === 2 && styles.rank2,
                item.rank === 3 && styles.rank3,
              ]}
            >
              {item.rank === 1 && '🥇'}
              {item.rank === 2 && '🥈'}
              {item.rank === 3 && '🥉'}
              {item.rank > 3 && `#${item.rank}`}
            </Text>
          </View>
        </View>

        {item.userAvatar ? (
          <Image
            source={{ uri: item.userAvatar }}
            style={styles.userAvatar}
          />
        ) : (
          <View style={styles.userAvatarPlaceholder}>
            <Ionicons name="person" size={24} color="#9ca3af" />
          </View>
        )}

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.userName}
          </Text>
          <Text style={styles.quizzesText}>
            {item.quizzesTaken} quizzes
          </Text>
        </View>

        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>

        {isCurrentUser && (
          <View style={styles.youBadge}>
            <Text style={styles.youBadgeText}>YOU</Text>
          </View>
        )}
      </View>
    );
  };

  const displayRankings =
    activeTab === 'global'
      ? globalRankings
      : selectedPackageId
        ? packageRankings
        : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rankings</Text>
        </View>

        {/* User's Current Rank */}
        {userRank && (
          <View style={styles.userRankCard}>
            <View style={styles.userRankContent}>
              <View style={styles.userRankBadge}>
                <Text style={styles.userRankNumber}>#{userRank.rank}</Text>
              </View>
              <View style={styles.userRankInfo}>
                <Text style={styles.userRankName}>{userRank.userName}</Text>
                <Text style={styles.userRankPoints}>
                  {userRank.points} points
                </Text>
              </View>
            </View>
            <View style={styles.userRankMedal}>
              <Ionicons name="trophy" size={24} color="#fbbf24" />
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'global' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('global')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'global' && styles.activeTabText,
              ]}
            >
              Global
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'package' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('package')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'package' && styles.activeTabText,
              ]}
            >
              By Package
            </Text>
          </TouchableOpacity>
        </View>

        {/* Package Filter */}
        {activeTab === 'package' && myPackages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.packageFilter}
            contentContainerStyle={styles.packageFilterContent}
          >
            {myPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.Id}
                style={[
                  styles.packageFilterButton,
                  selectedPackageId === pkg.Id &&
                  styles.packageFilterButtonActive,
                ]}
                onPress={() => handlePackageSelect(pkg.Id)}
              >
                <Text
                  style={[
                    styles.packageFilterButtonText,
                    selectedPackageId === pkg.Id &&
                    styles.packageFilterButtonTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {pkg.Title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Rankings List */}
        {displayRankings.length > 0 ? (
          <FlatList
            data={displayRankings}
            renderItem={({ item, index }) =>
              renderRankingUser(item, index)
            }
            keyExtractor={(item) => `${item.userId}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No rankings available</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
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
  userRankCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userRankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284c7',
  },
  userRankInfo: {
    gap: 2,
  },
  userRankName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  userRankPoints: {
    fontSize: 12,
    color: '#6b7280',
  },
  userRankMedal: {
    marginLeft: 'auto',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#6366f1',
  },
  packageFilter: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  packageFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  packageFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  packageFilterButtonActive: {
    backgroundColor: '#6366f1',
  },
  packageFilterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  packageFilterButtonTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  currentUserItem: {
    backgroundColor: '#f0f4ff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRankBadge: {
    backgroundColor: '#fef3c7',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
  },
  rank1: {
    color: '#b45309',
  },
  rank2: {
    color: '#4b5563',
  },
  rank3: {
    color: '#a16207',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  quizzesText: {
    fontSize: 12,
    color: '#6b7280',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#dcfce7',
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
});
