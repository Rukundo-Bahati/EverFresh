import { useCallback, useRef, type ReactNode } from "react";
import { Animated, Easing } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

type ScreenMotionProps = {
  children: ReactNode;
};

export default function ScreenMotion({ children }: ScreenMotionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      translateX.setValue(30);

      const animation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      animation.start();
      return () => animation.stop();
    }, [opacity, translateX]),
  );

  return (
    <Animated.View style={{ flex: 1, opacity, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}
