import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useSignals } from "@/src/hooks/useSignals";
import { SignalCard } from "@/src/components/SignalCard";
import type { Signal } from "@/src/components/SignalCard";

// Seeded pseudo-random so values are stable across renders
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function mockSparkline(
  seed: number,
  trend: 'up' | 'down' | 'flat' = 'flat'
): { index: number; value: number }[] {
  const rand = seededRand(seed);
  const n = 40;
  const trendStep = trend === 'up' ? 0.4 : trend === 'down' ? -0.4 : 0;
  let v = 100;
  return Array.from({ length: n }, (_, i) => {
    // spike: occasional sharp moves
    const spike = rand() < 0.25 ? (rand() - 0.5) * 12 : 0;
    v += trendStep + (rand() - 0.48) * 4 + spike;
    return { index: i, value: Math.round(v * 10) / 10 };
  });
}

const FALLBACK_SIGNALS: Signal[] = [
  {
    id: "1",
    ticker: "AAPL",
    action: "BUY",
    confidence: 0.82,
    sparklineData: mockSparkline(3, 'up'),
  },
  {
    id: "2",
    ticker: "EGX30",
    action: "HOLD",
    confidence: 0.56,
    sparklineData: mockSparkline(7, 'flat'),
  },
  {
    id: "3",
    ticker: "TSLA",
    action: "SELL",
    confidence: 0.41,
    sparklineData: mockSparkline(11, 'down'),
  },
];

export default function HomeScreen() {
  const { data, isLoading } = useSignals();

  const signals: Signal[] = (data as Signal[] | undefined)?.length
    ? (data as Signal[]).map((s, i) => ({
        ...s,
        sparklineData: s.sparklineData ?? mockSparkline(i * 3 + 2),
      }))
    : FALLBACK_SIGNALS;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-6 pb-6">
          <Text className="text-foreground font-poppins-bold text-3xl">
            Home
          </Text>
          <Text className="text-foreground font-poppins-semibold text-xl mt-1">
            Welcome back!
          </Text>
          <Text className="text-muted-foreground text-sm mt-1">
            {"Here are today's top signals"}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#00D0B4" size="large" />
        ) : (
          signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
