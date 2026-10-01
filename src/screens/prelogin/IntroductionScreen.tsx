import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import { LanguageContext } from "../../localization/LanguageContext";

interface MobileIntroductionScreenProps {
  onComplete: () => void;
}

interface Slide {
  icon: string;
  title: string;
  description: string;
  accent: string;
  gradient: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MobileIntroductionScreen: React.FC<
  MobileIntroductionScreenProps
> = ({ onComplete }) => {
  const languageContext = useContext(LanguageContext);

  const translations = languageContext?.translations;
//   const language = languageContext?.language || "en";
  const language = languageContext?.language || "en";
  const isRTL = language === "ar";

  const t = (key: string, fallback: string): string => {
    try {
      if (!translations) {
        return fallback;
      }

      const keys = key.split(".");
      let value: unknown = translations;

      for (const k of keys) {
        if (
          typeof value === "object" &&
          value !== null &&
          k in value
        ) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return fallback;
        }
      }

      return typeof value === "string" ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const slides: Slide[] = [
    {
      icon: "shield-checkmark-outline",
      title: t("intro.slide1Title", "Secure Banking"),
      description: t(
        "intro.slide1Desc",
        "Enterprise-grade encryption protects every transaction. Your financial data stays safe with multi-layer security."
      ),
      accent: "#12A89F",
      gradient: ["#12A89F", "#0A7A71", "#065750"],
    },
    {
      icon: "phone-portrait-outline",
      title: t("intro.slide2Title", "Bank Anywhere"),
      description: t(
        "intro.slide2Desc",
        "Transfer funds, pay bills, and manage accounts on the go. Full banking power in your pocket."
      ),
      accent: "#0E8C83",
      gradient: ["#0E8C83", "#0A7A71", "#065750"],
    },
    {
      icon: "globe-outline",
      title: t("intro.slide3Title", "Global Reach"),
      description: t(
        "intro.slide3Desc",
        "Send money worldwide with competitive rates. Multi-currency support and real-time exchange tracking."
      ),
      accent: "#0D9488",
      gradient: ["#0D9488", "#0A7A71", "#065E55"],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef(0);

  // ---------------------------------------------
  // Animations
  // ---------------------------------------------

  const iconScale = useRef(
    new Animated.Value(0.4)
  ).current;

  const iconOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const iconRotation = useRef(
    new Animated.Value(-15)
  ).current;

  const textTranslateY = useRef(
    new Animated.Value(24)
  ).current;

  const textOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const pulseScale = useRef(
    new Animated.Value(1)
  ).current;

  const pulseOpacity = useRef(
    new Animated.Value(0.3)
  ).current;

  // ---------------------------------------------
  // Slide entrance animation
  // ---------------------------------------------

  const animateSlide = useCallback(() => {
    iconScale.setValue(0.4);
    iconOpacity.setValue(0);
    iconRotation.setValue(-15);

    textTranslateY.setValue(24);
    textOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),

      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.timing(iconRotation, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),

      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    iconScale,
    iconOpacity,
    iconRotation,
    textTranslateY,
    textOpacity,
  ]);

  useEffect(() => {
    animateSlide();
  }, [activeIndex, animateSlide]);

  // ---------------------------------------------
  // Pulse animation
  // ---------------------------------------------

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.12,
            duration: 1250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(pulseOpacity, {
            toValue: 0.08,
            duration: 1250,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(pulseOpacity, {
            toValue: 0.3,
            duration: 1250,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseScale, pulseOpacity]);

  // ---------------------------------------------
  // Navigation
  // ---------------------------------------------

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) {
        return;
      }

      setActiveIndex(index);
    },
    [slides.length]
  );

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      onComplete();
      return;
    }

    goToSlide(activeIndex + 1);
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1);
    }
  };

  // ---------------------------------------------
  // Swipe handling
  // ---------------------------------------------

  const handleTouchStart = (x: number) => {
    touchStartX.current = x;
  };

  const handleTouchEnd = (x: number) => {
    const deltaX = x - touchStartX.current;
    const threshold = 50;

    // Reverse swipe behavior for RTL.
    const direction = isRTL ? -1 : 1;

    if (deltaX * direction < -threshold) {
      // Swipe left
      if (activeIndex < slides.length - 1) {
        goToSlide(activeIndex + 1);
      } else {
        onComplete();
      }
    } else if (deltaX * direction > threshold) {
      // Swipe right
      if (activeIndex > 0) {
        goToSlide(activeIndex - 1);
      }
    }
  };

  // ---------------------------------------------
  // Current slide
  // ---------------------------------------------

  const currentSlide = slides[activeIndex];
  const isLastSlide =
    activeIndex === slides.length - 1;

  const iconRotationInterpolation =
    iconRotation.interpolate({
      inputRange: [-15, 0],
      outputRange: ["-15deg", "0deg"],
    });

  return (
    <View
      style={styles.container}
      onTouchStart={(event) => {
        handleTouchStart(
          event.nativeEvent.pageX
        );
      }}
      onTouchEnd={(event) => {
        handleTouchEnd(
          event.nativeEvent.pageX
        );
      }}
    >
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <View style={styles.hero}>
        <LinearGradient
          colors={currentSlide.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative circles */}

        <View
          pointerEvents="none"
          style={[
            styles.decorativeCircle,
            styles.circleOne,
          ]}
        />

        <View
          pointerEvents="none"
          style={[
            styles.decorativeCircle,
            styles.circleTwo,
          ]}
        />

        <View
          pointerEvents="none"
          style={[
            styles.decorativeCircle,
            styles.circleThree,
          ]}
        />

        {/* Floating particles */}

        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        >
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.particle,
                {
                  width:
                    4 + (index % 3) * 3,
                  height:
                    4 + (index % 3) * 3,
                  top: `${15 + index * 13}%`,
                  left: `${10 + index * 14}%`,
                },
              ]}
            />
          ))}
        </View>

        {/* ================================================= */}
        {/* SKIP */}
        {/* ================================================= */}

        <View
          style={[
            styles.skipContainer,
            isRTL
              ? styles.skipContainerRTL
              : styles.skipContainerLTR,
          ]}
        >
          <Pressable
            onPress={onComplete}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.skipText}>
              {t("intro.skip", "Skip")}
            </Text>
          </Pressable>
        </View>

        {/* ================================================= */}
        {/* ICON */}
        {/* ================================================= */}

        <View style={styles.heroCenter}>
          {/* Pulse ring */}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              {
                opacity: pulseOpacity,
                transform: [
                  {
                    scale: pulseScale,
                  },
                ],
              },
            ]}
          />

          {/* Icon */}

          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: iconOpacity,
                transform: [
                  {
                    scale: iconScale,
                  },
                  {
                    rotate:
                      iconRotationInterpolation,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name={currentSlide.icon}
              size={56}
              color="#FFFFFF"
            />
          </Animated.View>

          {/* Step indicator */}

          <Text style={styles.stepText}>
            {activeIndex + 1} / {slides.length}
          </Text>
        </View>

        {/* ================================================= */}
        {/* CURVE */}
        {/* ================================================= */}

        <View
          pointerEvents="none"
          style={styles.bottomCurve}
        >
          <View style={styles.curveShape} />
        </View>
      </View>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <View style={styles.content}>
        {/* Text */}

        <Animated.View
          style={[
            styles.textContent,
            {
              opacity: textOpacity,
              transform: [
                {
                  translateY: textTranslateY,
                },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              isRTL && styles.rtlText,
            ]}
          >
            {currentSlide.title}
          </Text>

          <Text
            style={[
              styles.description,
              isRTL && styles.rtlText,
            ]}
          >
            {currentSlide.description}
          </Text>
        </Animated.View>

        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <View style={styles.controls}>
          {/* Dots */}

          <View style={styles.dotsContainer}>
            {slides.map((slide, index) => {
              const isActive =
                index === activeIndex;

              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    goToSlide(index)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Go to slide ${
                    index + 1
                  }`}
                  style={[
                    styles.dot,
                    {
                      width: isActive ? 32 : 8,
                      backgroundColor: isActive
                        ? slide.accent
                        : "#D5D5D5",
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Navigation */}

          <View
            style={[
              styles.navigation,
              isRTL && styles.navigationRTL,
            ]}
          >
            {/* Previous */}

            <Pressable
              onPress={handlePrevious}
              disabled={activeIndex === 0}
              accessibilityRole="button"
              accessibilityLabel="Previous slide"
              style={({ pressed }) => [
                styles.sideButton,
                activeIndex === 0 &&
                  styles.hiddenButton,
                pressed && styles.buttonPressed,
              ]}
            >
              {isRTL ? (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#666666"
                />
              ) : (
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#666666"
                />
              )}
            </Pressable>

            {/* Next */}

            <Pressable
              onPress={handleNext}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.nextButton,
                {
                  backgroundColor:
                    currentSlide.accent,
                },
                pressed &&
                  styles.nextButtonPressed,
              ]}
            >
              <Text style={styles.nextText}>
                {isLastSlide
                  ? t(
                      "intro.getStarted",
                      "Get Started"
                    )
                  : t("intro.next", "Next")}
              </Text>

              <Ionicons
                name={
                  isRTL
                    ? "arrow-back"
                    : "arrow-forward"
                }
                size={18}
                color="#FFFFFF"
              />
            </Pressable>

            {/* Spacer */}

            <View style={styles.sideButton} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ===================================================
  // Container
  // ===================================================

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ===================================================
  // Hero
  // ===================================================

  hero: {
    flex: 1.2,
    position: "relative",
    overflow: "hidden",
  },

  // ===================================================
  // Decorative circles
  // ===================================================

  decorativeCircle: {
    position: "absolute",
    borderRadius: 999,
  },

  circleOne: {
    width: 280,
    height: 280,
    top: -70,
    right: -60,
    backgroundColor:
      "rgba(255,255,255,0.06)",
  },

  circleTwo: {
    width: 180,
    height: 180,
    top: 60,
    left: -50,
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  circleThree: {
    width: 120,
    height: 120,
    bottom: 80,
    right: 30,
    backgroundColor:
      "rgba(255,255,255,0.03)",
  },

  // ===================================================
  // Particles
  // ===================================================

  particle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  // ===================================================
  // Skip
  // ===================================================

  skipContainer: {
    position: "relative",
    zIndex: 20,
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  skipContainerLTR: {
    alignItems: "flex-end",
  },

  skipContainerRTL: {
    alignItems: "flex-start",
  },

  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.15)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.20)",
  },

  skipText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },

  // ===================================================
  // Hero center
  // ===================================================

  heroCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ===================================================
  // Icon
  // ===================================================

  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 32,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.15)",

    borderWidth: 1.5,
    borderColor:
      "rgba(255,255,255,0.25)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,

    elevation: 8,
  },

  pulseRing: {
    position: "absolute",

    width: 140,
    height: 140,

    borderRadius: 36,

    borderWidth: 2,
    borderColor:
      "rgba(255,255,255,0.10)",
  },

  stepText: {
    marginTop: 24,

    color: "rgba(255,255,255,0.5)",

    fontSize: 12,
    fontWeight: "600",

    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  // ===================================================
  // Bottom curve
  // ===================================================

  bottomCurve: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1,
    height: 50,
    overflow: "hidden",
  },

  curveShape: {
    position: "absolute",
    left: -SCREEN_WIDTH * 0.15,
    width: SCREEN_WIDTH * 1.3,
    height: 100,
    bottom: -62,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",
  },

  // ===================================================
  // Content
  // ===================================================

  content: {
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },

  textContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginBottom: 12,

    color: "#111111",

    fontSize: 26,
    lineHeight: 32,

    fontWeight: "700",

    textAlign: "center",
  },

  description: {
    maxWidth: 380,

    color: "#666666",

    fontSize: 16,
    lineHeight: 25,

    textAlign: "center",
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "center",
  },

  // ===================================================
  // Controls
  // ===================================================

  controls: {
    paddingBottom: 40,
  },

  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    marginBottom: 32,
  },

  dot: {
    height: 8,
    borderRadius: 999,
  },

  // ===================================================
  // Navigation
  // ===================================================

  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  navigationRTL: {
    flexDirection: "row-reverse",
  },

  sideButton: {
    width: 48,
    height: 48,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F5F5F5",

    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  hiddenButton: {
    opacity: 0,
  },

  nextButton: {
    flex: 1,

    minHeight: 52,

    borderRadius: 999,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    shadowColor: "#0D9488",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 5,
  },

  nextText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "600",
  },

  // ===================================================
  // Press states
  // ===================================================

  buttonPressed: {
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  nextButtonPressed: {
    transform: [
      {
        scale: 0.97,
      },
    ],

    opacity: 0.9,
  },
});

export default MobileIntroductionScreen;
