import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
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
import { formatToRupiah } from '../../../lib/utils';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "../../styles/globalStyles";
import { useFocusEffect } from '@react-navigation/native';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { latestPackages, paidPackages, freePackages, loading } = useAppSelector((state) => state.quiz);
  const { globalRankings } = useAppSelector((state) => state.ranking);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchQuizPackages());
      dispatch(fetchGlobalRankings(10));
      dispatch(fetchQuizResults());
    }, [dispatch])
  );

  const topRankings = globalRankings;

  const renderPackageCard = (item: QuizPackage) => (
    <TouchableOpacity
      key={item.Id}
      style={styles.packageCard}
      onPress={() =>
        navigation.navigate('Packages' as never, {
          screen: 'PackageDetail',
          params: { packageId: item.Id },
        } as never)
      }
    >
      {item.ThumbnailUrl && (
        <Image
          source={{ uri: item.ThumbnailUrl }}
          style={styles.packageImage}
        />
      )}
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageTitle} numberOfLines={2}>
            {item.Title}
          </Text>
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
            <Ionicons name="help-circle" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.TotalQuestions}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.DurationMinutes}m</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="albums-outline" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.Category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.metaText}>{item.Rating.toFixed(1)}</Text>
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
        <Text style={styles.rankingPoints}>{item.points} poin</Text>
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View>
              <Text style={styles.welcomeText}>Selamat Datang Kembali!</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={20} color="#fbbf24" />
                <Text style={styles.statValue}>{user?.points || 0}</Text>
                <Text style={styles.statLabel}>Poin</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkbox" size={20} color="#6366f1" />
                <Text style={styles.statValue}>
                  {user?.totalQuizzesTaken || 0}
                </Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
            </View>
          </View>

          {/* Latest Packages */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kuis Terbaru</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Packages' as never)
                }
              >
                <Text style={styles.viewAll}>Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={latestPackages}
              renderItem={({ item }) => renderPackageCard(item)}
              keyExtractor={(item) => item.Id}
              scrollEnabled={false}
            />
          </View>

          {/* Free Packages */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kuis Gratis</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Packages' as never)
                }
              >
                <Text style={styles.viewAll}>Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={freePackages}
              renderItem={({ item }) => renderPackageCard(item)}
              keyExtractor={(item) => item.Id}
              scrollEnabled={false}
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
                <Text style={styles.viewAll}>Selengkapnya</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rankingsList}>
              {topRankings.map((item) => renderRankingItem(item))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
