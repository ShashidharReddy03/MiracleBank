import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import MobileSplashScreen from './SplashScreen';
import MobileIntroductionScreen from './IntroductionScreen';
import MobileWelcomeScreen from './WelcomeScreen';

type PreLoginStep = 'splash' | 'introduction' | 'welcome';

const INTRO_SEEN_KEY = 'miracle_intro_seen';

const PreLoginFlow: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<PreLoginStep>('splash');
	const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
	const [isIntroChecked, setIsIntroChecked] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		const checkIntroStatus = async () => {
			try {
				const hasSeenIntro = await AsyncStorage.getItem(INTRO_SEEN_KEY);
				setIsFirstTimeUser(!hasSeenIntro);
			} catch (error) {
				console.error('Failed to check intro status:', error);
			} finally {
				setIsIntroChecked(true);
			}
		};

		void checkIntroStatus();
	}, []);

	const finishSplash = () => {
		if (isFirstTimeUser) {
			setCurrentStep('introduction');
		} else {
			navigation.reset({
				index: 0,
				routes: [{ name: 'MFLogin' as never }],
			});
		}
	};

	useEffect(() => {
		if (currentStep !== 'splash' || !isIntroChecked) {
			return;
		}

		const timer = setTimeout(finishSplash, 2800);
		return () => clearTimeout(timer);
	}, [currentStep, isFirstTimeUser, isIntroChecked]);

	const handleIntroComplete = async () => {
		try {
			await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
		} catch (error) {
			console.error('Failed to save intro status:', error);
		}
		setCurrentStep('welcome');
	};

	const handleLogin = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'MFLogin' as never }],
		});
	};

	return (
		<View style={styles.root}>
			{currentStep === 'splash' && (
				<MobileSplashScreen onFinish={finishSplash} />
			)}
			{currentStep === 'introduction' && (
				<MobileIntroductionScreen onComplete={handleIntroComplete} />
			)}
			{currentStep === 'welcome' && (
				<MobileWelcomeScreen onLogin={handleLogin} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});

export default PreLoginFlow;
