import { useState, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { SignalCard } from "@/src/components/SignalCard";
import type { Signal, SignalAction } from "@/src/components/SignalCard";
import { useSignals } from "@/src/hooks/useSignals";

type FilterType = "All" | SignalAction;

const FILTERS: FilterType[] = ["All", "BUY", "SELL", "HOLD"];
const FILTER_LABELS: Record<FilterType, string> = {
  All: "All",
  BUY: "Buy",
  SELL: "Sell",
  HOLD: "Hold",
};

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function mockSparkline(seed: number): { index: number; value: number }[] {
  const rand = seededRand(seed);
  let v = 100;
  return Array.from({ length: 40 }, (_, i) => {
    v += (rand() - 0.48) * 4;
    return { index: i, value: Math.round(v * 10) / 10 };
  });
}

const FALLBACK_SIGNALS: Signal[] = [
  { id: "1", ticker: "AAPL", action: "BUY", confidence: 0.82, sparklineData: mockSparkline(3) },
  { id: "2", ticker: "EGX30", action: "HOLD", confidence: 0.56, sparklineData: mockSparkline(7) },
  { id: "3", ticker: "COMI", action: "SELL", confidence: 0.41, sparklineData: mockSparkline(11) },
  { id: "4", ticker: "CIB", action: "BUY", confidence: 0.76, sparklineData: mockSparkline(15) },
];

export default function SignalsScreen() {
  const [filter, setFilter] = useState<FilterType>("All");
  const { data, isLoading } = useSignals();

  const signals: Signal[] = (data as Signal[] | undefined)?.length
    ? (data as Signal[]).map((s, i) => ({
        ...s,
        sparklineData: s.sparklineData ?? mockSparkline(i * 3 + 2),
      }))
    : FALLBACK_SIGNALS;

  const filtered = useMemo(
    () => (filter === "All" ? signals : signals.filter((s) => s.action === filter)),
    [signals, filter],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-6 pb-4">
          <Text className="text-foreground font-poppins-bold text-3xl">Signals</Text>
        </View>

        {/* Filter chips */}
        <View className="flex-row gap-2 mb-5">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full border"
                style={{
                  backgroundColor: active ? "#6C5CE7" : "transparent",
                  borderColor: active ? "#6C5CE7" : "#2D3A52",
                }}
              >
                <Text
                  className="text-sm font-poppins-medium"
                  style={{ color: active ? "#FFFFFF" : "#8892A4" }}
                >
                  {FILTER_LABELS[f]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isLoading ? (
          <ActivityIndicator color="#00D0B4" size="large" />
        ) : (
          filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} compact />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
