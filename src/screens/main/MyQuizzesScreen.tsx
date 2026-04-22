import React, { useEffect } from 'react';
import {
  View,
  Text,
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
} from '../../redux/slices/quizSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "../../styles/globalStyles";
import { useFocusEffect } from '@react-navigation/native';

type Props = BottomTabScreenProps<MainTabParamList, 'MyQuizzes'>;

export default function MyQuizzesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { myPackages, loading } = useAppSelector((state) => state.quiz);
  const results = useAppSelector((state) => state.quiz.results);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchMyQuizPackages());
      dispatch(fetchQuizResults());
    }, [dispatch])
  );

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

  const renderQuizCard = (qp: any) => {
    const item: QuizPackage = qp.QuizPackage;
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
                {item.DifficultyLevel.toUpperCase()}
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