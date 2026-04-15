import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../../redux/hooks';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-svg-charts';
import { styles } from "../../styles/globalStyles";

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResults'>;

const { width } = Dimensions.get('window');

export default function QuizResultsScreen({ route, navigation }: Props) {
  const { packageId, resultId } = route.params;
  const results = useAppSelector((state) => state.quiz.results);
  const result = results.find((r) => r.id === resultId);
  const pkg = useAppSelector((state) =>
    state.quiz.allPackages.find((p) => p.Id === packageId)
  );

  const correctAnswers = result?.score
    ? Math.round((result.score / 100) * result.totalQuestions)
    : 0;
  const wrongAnswers = (result?.totalQuestions || 0) - correctAnswers;

  const scorePercentage = result?.score || 0;
  const getScoreRating = () => {
    if (scorePercentage >= 90) return 'Excellent!';
    if (scorePercentage >= 70) return 'Good!';
    if (scorePercentage >= 50) return 'Fair';
    return 'Need Practice';
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return '#16a34a';
    if (scorePercentage >= 70) return '#2563eb';
    if (scorePercentage >= 50) return '#f59e0b';
    return '#dc2626';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const data = [
    {
      value: correctAnswers,
      svg: { fill: '#16a34a' },
      key: 'correct',
    },
    {
      value: wrongAnswers,
      svg: { fill: '#dc2626' },
      key: 'wrong',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz Results</Text>
          <Text style={styles.packageTitle}>{pkg?.Title}</Text>
        </View>

        {/* Score Circle */}
        <View style={styles.scoreCard}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: getScoreColor() },
            ]}
          >
            <Text style={[styles.scorePercentage, { color: getScoreColor() }]}>
              {scorePercentage}%
            </Text>
          </View>
          <Text style={[styles.scoreRating, { color: getScoreColor() }]}>
            {getScoreRating()}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={32} color="#16a34a" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="close-circle" size={32} color="#dc2626" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{wrongAnswers}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={32} color="#6366f1" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                {formatTime(result?.timeSpent || 0)}
              </Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Total Questions</Text>
              <Text style={styles.detailValue}>
                {result?.totalQuestions}
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Passing Score</Text>
              <Text style={styles.detailValue}>70%</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Your Score</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: getScoreColor() },
                ]}
              >
                {result?.score}%
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color:
                      scorePercentage >= 70
                        ? '#16a34a'
                        : '#dc2626',
                  },
                ]}
              >
                {scorePercentage >= 70 ? 'Passed' : 'Failed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackContainer}>
          <View
            style={[
              styles.feedbackCard,
              {
                backgroundColor:
                  scorePercentage >= 70
                    ? '#dcfce7'
                    : '#fee2e2',
              },
            ]}
          >
            <Ionicons
              name={
                scorePercentage >= 70
                  ? 'checkmark-circle'
                  : 'alert-circle'
              }
              size={32}
              color={
                scorePercentage >= 70
                  ? '#16a34a'
                  : '#dc2626'
              }
            />
            <View style={styles.feedbackContent}>
              <Text
                style={[
                  styles.feedbackTitle,
                  {
                    color:
                      scorePercentage >= 70
                        ? '#166534'
                        : '#991b1b',
                  },
                ]}
              >
                {scorePercentage >= 70
                  ? 'Congratulations!'
                  : 'Keep Practicing!'}
              </Text>
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      scorePercentage >= 70
                        ? '#166534'
                        : '#991b1b',
                  },
                ]}
              >
                {scorePercentage >= 90
                  ? 'You have mastered this quiz!'
                  : scorePercentage >= 70
                    ? 'Good job! You passed this quiz.'
                    : 'Try again to improve your score.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            navigation.navigate('Main' as any, {
              screen: 'MyQuizzes',
            });
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#6366f1" />
          <Text style={styles.secondaryButtonText}>Back to Quizzes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            navigation.navigate('Main' as any, {
              screen: 'Rankings',
            });
          }}
        >
          <Text style={styles.primaryButtonText}>View Rankings</Text>
          <Ionicons name="trophy" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
