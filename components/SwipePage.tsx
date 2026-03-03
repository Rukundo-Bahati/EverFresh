import { useRef, type ReactNode } from "react";
import { PanResponder, View } from "react-native";
import { useRouter } from "expo-router";

type PageKey = "home" | "containers" | "batches" | "settings";

type SwipePageProps = {
  page: PageKey;
  children: ReactNode;
};

const pages: { key: PageKey; route: "/dashboard" | "/dashboard/containers" | "/dashboard/batches" | "/dashboard/settings" }[] = [
  { key: "home", route: "/dashboard" },
  { key: "containers", route: "/dashboard/containers" },
  { key: "batches", route: "/dashboard/batches" },
  { key: "settings", route: "/dashboard/settings" },
];

export default function SwipePage({ page, children }: SwipePageProps) {
  const router = useRouter();
  const isNavigating = useRef(false);

  const currentIndex = pages.findIndex((item) => item.key === page);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return horizontal && Math.abs(gestureState.dx) > 14;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isNavigating.current) {
          return;
        }

        const distanceThreshold = 24;
        const fastSwipe = Math.abs(gestureState.vx) > 0.35;
        const goNext = gestureState.dx < -distanceThreshold || (fastSwipe && gestureState.vx < 0);
        const goPrev = gestureState.dx > distanceThreshold || (fastSwipe && gestureState.vx > 0);

        if (goNext && currentIndex < pages.length - 1) {
          isNavigating.current = true;
          router.replace(pages[currentIndex + 1].route);
          setTimeout(() => {
            isNavigating.current = false;
          }, 80);
          return;
        }

        if (goPrev && currentIndex > 0) {
          isNavigating.current = true;
          router.replace(pages[currentIndex - 1].route);
          setTimeout(() => {
            isNavigating.current = false;
          }, 80);
        }
      },
    }),
  ).current;

  return (
    <View className="flex-1" {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
