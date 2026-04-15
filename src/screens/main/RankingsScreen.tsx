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
import { styles } from "../../styles/globalStyles";

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
