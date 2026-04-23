import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchQuizQuestions,
  answerQuestion,
  moveToNextQuestion,
  moveToPreviousQuestion,
  submitQuizResult,
  startQuiz,
  Question,
} from '../../redux/slices/quizSlice';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "../../styles/globalStyles";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizTaking'>;

export default function QuizTakingScreen({ route, navigation }: Props) {
  const { packageId } = route.params;
  const dispatch = useAppDispatch();
  const { currentQuiz, allPackages, loading } = useAppSelector(
    (state) => state.quiz
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [startTime] = useState(Date.now());

  const quiz = currentQuiz;
  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  const selectedAnswer = quiz.Options[currentQuestion?.id];
  const pkg = quiz.package;
  console.log(currentQuestion)
  useEffect(() => {
    dispatch(startQuiz(pkg));
    dispatch(fetchQuizQuestions(packageId));
  }, []);

  useEffect(() => {
    // Timer
    const interval = setInterval(() => {
      if (quiz.startTime) {
        setTimeLeft(Math.floor((Date.now() - quiz.startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz.startTime]);
  const handleAnswerSelect = (answerId: string) => {
    dispatch(answerQuestion({ questionId: currentQuestion.id, answerId }));
  };

  const handleNext = () => {
    if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
      dispatch(moveToNextQuestion());
      setShowExplanation(false);
    } else {
      // Quiz completed
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    dispatch(moveToPreviousQuestion());
    setShowExplanation(false);
  };

  const submitQuiz = async () => {
    Alert.alert('Submit Quiz', 'Are you sure you want to submit?', [
      { text: 'Cancel' },
      {
        text: 'Submit',
        onPress: () => {
          // Calculate score
          let correctAnswers = 0;
          quiz.questions.forEach((q) => {
            if (quiz.Options[q.id] === q.Options.find((opt) => opt.is_correct)?.Id) {
              correctAnswers++;
            }
          });

          const score = Math.round(
            (correctAnswers / quiz.questions.length) * 100
          );
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);

          const answersList = quiz.questions.map((q) => ({
            questionId: q.id,
            answerId: quiz.Options[q.id] || '',
          }));

          dispatch(
            submitQuizResult({
              packageId,
              score,
              totalQuestions: quiz.questions.length,
              timeSpent,
              answers: answersList,
            })
          ).then((result) => {
            if (submitQuizResult.fulfilled.match(result)) {
              navigation.navigate('QuizResults', {
                packageId,
                resultId: result.payload.id,
              });
            }
          });
        },
      },
    ]);
  };

  const handleSkipQuestion = () => {
    if (!selectedAnswer) {
      dispatch(answerQuestion({
        questionId: currentQuestion.id,
        answerId: 'skipped',
      }));
    }
    handleNext();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress =
    ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (loading || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {pkg?.Title}
            </Text>
            <Text style={styles.headerSubtitle}>
              {quiz.currentQuestionIndex + 1} / {quiz.questions.length}
            </Text>
          </View>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question Section */}
          <View style={styles.questionSection}>
            {currentQuestion.question_image_url && (
              <Image
                source={{ uri: currentQuestion?.question_image_url }}
                style={styles.questionImage}
              />
            )}
            <Text style={styles.questionText}>{currentQuestion?.question_text}</Text>
          </View>

          {/* Answers Section */}
          <View style={styles.answersSection}>
            <Text style={styles.answersTitle}>Select your answer:</Text>
            {currentQuestion.Options.map((option) => {
              const isSelected = selectedAnswer === option.Id;
              const isCorrect = option.is_correct;
              const showCorrect = showExplanation && isCorrect;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={option.Id}
                  style={[
                    styles.answerButton,
                    isSelected && styles.answerButtonSelected,
                    showCorrect && styles.answerButtonCorrect,
                    showIncorrect && styles.answerButtonIncorrect,
                  ]}
                  onPress={() => !showExplanation && handleAnswerSelect(option.Id)}
                  disabled={showExplanation}
                >
                  <View
                    style={[
                      styles.answerIndicator,
                      isSelected && styles.answerIndicatorSelected,
                      showCorrect && styles.answerIndicatorCorrect,
                      showIncorrect && styles.answerIndicatorIncorrect,
                    ]}
                  >
                    {isSelected && !showExplanation && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                    {showCorrect && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                    {showIncorrect && (
                      <Ionicons name="close" size={16} color="#ffffff" />
                    )}
                  </View>
                  {option.option_image_url && (
                    <Image
                      source={{ uri: option.option_image_url }}
                      style={styles.answerImage}
                    />
                  )}
                  <View style={styles.answerContent}>
                    <Text style={styles.answerText} numberOfLines={3}>
                      {option.option_text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation Section */}
          {showExplanation && (
            <View style={styles.explanationSection}>
              <View style={styles.explanationHeader}>
                <Ionicons name="information-circle" size={20} color="#0284c7" />
                <Text style={styles.explanationTitle}>Explanation</Text>
              </View>
              <Text style={styles.explanationText}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!showExplanation && !selectedAnswer && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipQuestion}
              >
                <Text style={styles.skipButtonText}>Skip Question</Text>
              </TouchableOpacity>
            )}

            {selectedAnswer && !showExplanation && (
              <TouchableOpacity
                style={styles.submitAnswerButton}
                onPress={() => setShowExplanation(true)}
              >
                <Text style={styles.submitAnswerButtonText}>
                  Show Explanation
                </Text>
              </TouchableOpacity>
            )}

            {showExplanation && (
              <TouchableOpacity
                style={styles.submitAnswerButton}
                onPress={handleNext}
              >
                <Text style={styles.submitAnswerButtonText}>
                  {quiz.currentQuestionIndex === quiz.questions.length - 1
                    ? 'Submit Quiz'
                    : 'Next Question'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={[
              styles.navButton,
              quiz.currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={quiz.currentQuestionIndex === 0}
          >
            <Ionicons name="chevron-back" size={24} color="#6366f1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              quiz.currentQuestionIndex === quiz.questions.length - 1 &&
              styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={quiz.currentQuestionIndex === quiz.questions.length - 1}
          >
            <Ionicons name="chevron-forward" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
