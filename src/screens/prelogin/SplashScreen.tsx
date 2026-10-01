import React, { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// import { getAppLogo } from '../../../utils/applyBuildConfig';

interface MobileSplashScreenProps {
    onFinish: () => void;
}

type SplashPhase = 'enter' | 'idle' | 'exit';

const MobileSplashScreen: React.FC<MobileSplashScreenProps> = ({
    onFinish,
}) => {
    const getAppLogo = () => { }
    const [phase, setPhase] = useState<SplashPhase>('enter');
    const [sideBarLogo] = useState('');
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        const enterTimer = setTimeout(() => {
            setPhase('idle');
        }, 600);

        return () => clearTimeout(enterTimer);
    }, []);

    const handleTap = () => {
        if (phase === 'exit') {
            return;
        }

        setPhase('exit');

        setTimeout(() => {
            onFinish();
        }, 400);
    };

    const isEntering = phase === 'enter';
    const isExiting = phase === 'exit';

    return (
        <SafeAreaView style={styles.safeArea}>
            <Pressable
                style={[
                    styles.container,
                    isExiting && styles.containerExit,
                ]}
                onPress={handleTap}
            >
                {/* Pulsing ring */}
                <View style={styles.pulsingRing} />

                {/* Logo + bank information */}
                <View
                    style={[
                        styles.logoContent,
                        isEntering && styles.logoContentEnter,
                        isExiting && styles.logoContentExit,
                    ]}
                >
                    {/* Logo container */}
                    <View style={styles.logoContainer}>
                        {sideBarLogo && !logoError ? (
                            <Image
                                source={{ uri: sideBarLogo }}
                                style={styles.logo}
                                resizeMode="contain"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <Text style={styles.fallbackLogo}>MB</Text>
                        )}
                    </View>

                    {/* Bank name */}
                    <Text style={styles.bankName}>Miracle Bank</Text>

                    {/* Tagline */}
                    <Text
                        style={[
                            styles.tagline,
                            isEntering && styles.taglineEnter,
                        ]}
                    >
                        BANKING MADE SIMPLE
                    </Text>
                </View>

                {/* Bottom loader dots */}
                <View style={styles.loaderContainer}>
                    <View style={styles.loaderDot} />
                    <View style={styles.loaderDot} />
                    <View style={styles.loaderDot} />
                </View>

                {/* Skip hint */}
                <Text style={styles.skipText}>Tap to skip</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default MobileSplashScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#087F76',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#087F76',
    },

    containerExit: {
        opacity: 0,
    },

    /*
     * Pulsing ring
     *
     * React Native doesn't support CSS @keyframes directly.
     * This is the static equivalent of your web ring.
     */
    pulsingRing: {
        position: 'absolute',

        width: 220,
        height: 220,

        borderRadius: 110,

        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.15)',
    },

    logoContent: {
        alignItems: 'center',
        zIndex: 10,

        transform: [{ scale: 1 }],
        opacity: 1,
    },

    logoContentEnter: {
        transform: [{ scale: 0.7 }],
        opacity: 0,
    },

    logoContentExit: {
        opacity: 0,
    },

    logoContainer: {
        width: 96,
        height: 96,

        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 24,

        backgroundColor: 'rgba(255,255,255,0.15)',

        // Android shadow
        elevation: 10,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },

    logo: {
        width: 64,
        height: 64,
    },

    fallbackLogo: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },

    bankName: {
        color: '#FFFFFF',

        fontSize: 24,
        fontWeight: '700',

        letterSpacing: 1,

        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 12,
    },

    tagline: {
        marginTop: 8,

        color: 'rgba(255,255,255,0.7)',

        fontSize: 14,
        fontWeight: '500',

        letterSpacing: 2,
    },

    taglineEnter: {
        opacity: 0,
        transform: [{ translateY: 12 }],
    },

    loaderContainer: {
        position: 'absolute',
        bottom: 64,

        flexDirection: 'row',
        gap: 8,
    },

    loaderDot: {
        width: 8,
        height: 8,

        borderRadius: 4,

        backgroundColor: 'rgba(255,255,255,0.4)',
    },

    skipText: {
        position: 'absolute',
        bottom: 32,

        color: 'rgba(255,255,255,0.3)',

        fontSize: 12,
    },
});