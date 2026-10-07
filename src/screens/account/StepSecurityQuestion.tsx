import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SecurityQA {
  question: string;
  answer: string;
}

type StepSecurityQuestionProps = {
  onNext?: () => void;
};

const StepSecurityQuestion = ({
  onNext,
}: StepSecurityQuestionProps) => {
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQA[]
  >([
    {
      question: 'What is your mother’s maiden name?',
      answer: '',
    },
    {
      question: 'What was the name of your first school?',
      answer: '',
    },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateAnswer = (
    index: number,
    value: string,
  ) => {
    setSecurityQuestions(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        answer: value,
      };
      return copy;
    });
  };

  const handleProceed = () => {
    setSubmitted(true);

    const invalid = securityQuestions.some(
      question => !question.answer.trim(),
    );

    if (invalid) {
      return;
    }

    onNext?.();
  };

  return (
    <View style={styles.container}>
      {/* Security Icon */}
      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            style={styles.loader}
          />

          <Text style={styles.loadingText}>
            Loading security questions...
          </Text>
        </View>
      )}

      {/* Questions List */}
      {!isLoading &&
        securityQuestions.map((item, index) => {
          const hasError =
            submitted && !item.answer.trim();

          return (
            <View
              key={index}
              style={styles.questionContainer}
            >
              {/* Question */}
              <Text style={styles.question}>
                {item.question}
              </Text>

              {/* Answer */}
              <TextInput
                value={item.answer}
                onChangeText={value =>
                  updateAnswer(index, value)
                }
                placeholder="Enter your answer"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
                style={[
                  styles.input,
                  hasError && styles.inputError,
                ]}
              />

              {/* Validation */}
              {hasError && (
                <Text style={styles.errorText}>
                  Answer is required
                </Text>
              )}
            </View>
          );
        })}

      {/* Proceed Button */}
      {securityQuestions.length > 0 && !isLoading && (
        <TouchableOpacity
          style={[
            styles.proceedButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleProceed}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedText}>
            Next
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  loader: {
    marginBottom: 8,
  },

  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },

  questionContainer: {
    marginBottom: 12,
  },

  question: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#0D9488',
  },

  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#1F2937',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },

  proceedButton: {
    width: '100%',
    height: 48,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3EC6BC',
  },

  proceedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});

export default StepSecurityQuestion;

