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
  Alert,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchMyQuizPackages,
  fetchQuizResults,
  QuizPackage,
  QuizResult,
} from '../../redux/slices/quizSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = BottomTabScreenProps<MainTabParamList, 'MyQuizzes'>;

export default function MyQuizzesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { myPackages, loading } = useAppSelector((state) => state.quiz);
  const results = useAppSelector((state) => state.quiz.results);

  useEffect(() => {
    dispatch(fetchMyQuizPackages());
    dispatch(fetchQuizResults());
  }, []);

  const handleStartQuiz = (packageId: string) => {
    const pkg = myPackages.find((p) => p.Id === packageId);
    if (!pkg) return;

    // Check if max attempts exceeded
    if (pkg.TotalAttempts !== undefined && pkg.MaxAttempts) {
      if (pkg.TotalAttempts >= pkg.MaxAttempts) {
        Alert.alert(
          'Maximum Attempts Exceeded',
          `You have reached the maximum of ${pkg.MaxAttempts} attempts for this quiz`
        );
        return;
      }
    }

    // Navigate to quiz taking screen
    (navigation as any).navigate('QuizTaking', { packageId });
  };

  const getPackageStats = (packageId: string) => {
    const packageResults = results.filter((r) => r.packageId === packageId);
    return {
      completed: packageResults.length,
      avgScore:
        packageResults.length > 0
          ? Math.round(
            packageResults.reduce((sum, r) => sum + r.score, 0) /
            packageResults.length
          )
          : 0,
      bestScore:
        packageResults.length > 0
          ? Math.max(...packageResults.map((r) => r.score))
          : 0,
    };
  };

  const renderQuizCard = (item: QuizPackage) => {
    const stats = getPackageStats(item.Id);
    const canAttempt =
      !item.MaxAttempts || (item.TotalAttempts || 0) < item.MaxAttempts;

    return (
      <View key={item.Id} style={styles.quizCard}>
        {item.ThumbnailUrl && (
          <Image source={{ uri: item.ThumbnailUrl }} style={styles.quizImage} />
        )}
        <View style={styles.quizContent}>
          <View style={styles.quizHeader}>
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle} numberOfLines={2}>
                {item.Title}
              </Text>
              <Text style={styles.quizCategory}>{item.Category}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text
                style={[
                  styles.difficultyText,
                  item.DifficultyLevel === 'easy' && styles.easyBg,
                  item.DifficultyLevel === 'medium' && styles.mediumBg,
                  item.DifficultyLevel === 'hard' && styles.hardBg,
                ]}
              >
                {item.DifficultyLevel.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{stats.completed}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Best Score</Text>
              <Text style={styles.statValue}>{stats.bestScore}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Score</Text>
              <Text style={styles.statValue}>{stats.avgScore}%</Text>
            </View>
          </View>

          {item.MaxAttempts && (
            <View style={styles.attemptsBar}>
              <Text style={styles.attemptsText}>
                Attempts: {item.TotalAttempts || 0}/{item.MaxAttempts}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((item.TotalAttempts || 0) / item.MaxAttempts) * 100
                        }%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              !canAttempt && styles.disabledButton,
            ]}
            onPress={() => handleStartQuiz(item.Id)}
            disabled={!canAttempt}
          >
            <Text style={styles.startButtonText}>
              {canAttempt ? 'Start Quiz' : 'Max Attempts Reached'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>My Quizzes</Text>
          <Text style={styles.headerSubtitle}>
            {myPackages.length} purchased
          </Text>
        </View>

        {myPackages.length > 0 ? (
          <FlatList
            data={myPackages}
            renderItem={({ item }) => renderQuizCard(item)}
            keyExtractor={(item) => item.Id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkbox-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No quizzes purchased yet</Text>
            <Text style={styles.emptySubtext}>
              Explore packages and start learning
            </Text>
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
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
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
    fontWeight: '600',
    color: '#1f2937',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  quizCard: {
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
  quizImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  quizContent: {
    padding: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  quizCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  difficultyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  easyBg: {
    color: '#166534',
  },
  mediumBg: {
    color: '#92400e',
  },
  hardBg: {
    color: '#991b1b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  attemptsBar: {
    marginBottom: 12,
  },
  attemptsText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
