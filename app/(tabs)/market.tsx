import { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Info } from "lucide-react-native";
import Svg, { Rect, Line, G } from "react-native-svg";
import { useMarket } from "@/src/hooks/useMarket";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketData {
  ticker: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePct: number;
  indicators: { rsi14: number; macd: number };
  candles: CandleData[];
}

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

const RANGE_COUNT: Record<TimeRange, number> = {
  "1D": 40,
  "1W": 35,
  "1M": 30,
  "3M": 45,
  "1Y": 52,
  "5Y": 60,
};

const CARD_BG = "#141C2D";
const BULLISH = "#00D0B4";
const BEARISH = "#FF4757";

// ─── Mock data ────────────────────────────────────────────────────────────────

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMockCandles(count: number, startPrice: number): CandleData[] {
  const rand = seededRand(42);
  const candles: CandleData[] = [];
  let price = startPrice;
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const change = (rand() - 0.47) * 5;
    const range = rand() * 4 + 1;
    const open = price;
    const close = Math.max(open * 0.95, open + change);
    const high = Math.max(open, close) + rand() * range;
    const low = Math.min(open, close) - rand() * range;
    const volume = Math.floor(rand() * 5_000_000 + 500_000);
    candles.push({
      date: new Date(now - (count - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    });
    price = close;
  }
  return candles;
}

const ALL_CANDLES = generateMockCandles(365, 160);

const MOCK_DATA: MarketData = {
  ticker: "AAPL",
  name: "Apple Inc.",
  exchange: "NASDAQ",
  price: 189.84,
  change: 2.46,
  changePct: 1.31,
  indicators: { rsi14: 63.21, macd: 2.14 },
  candles: ALL_CANDLES,
};

// ─── CandlestickChart ─────────────────────────────────────────────────────────

const MAIN_CHART_H = 200;
const VOL_CHART_H = 48;
const VOL_GAP = 8;
const TOTAL_H = MAIN_CHART_H + VOL_GAP + VOL_CHART_H;
const V_PAD = 8;

function CandlestickChart({
  candles,
  width,
}: {
  candles: CandleData[];
  width: number;
}) {
  if (!candles.length) return null;

  const allHighs = candles.map((c) => c.high);
  const allLows = candles.map((c) => c.low);
  const priceMax = Math.max(...allHighs);
  const priceMin = Math.min(...allLows);
  const priceRange = priceMax - priceMin || 1;

  const maxVol = Math.max(...candles.map((c) => c.volume));

  const slotW = width / candles.length;
  const bodyW = Math.max(2, slotW * 0.6);
  const bodyOffset = (slotW - bodyW) / 2;

  const toMainY = (price: number) =>
    V_PAD + (1 - (price - priceMin) / priceRange) * (MAIN_CHART_H - V_PAD * 2);

  const toVolY = (vol: number) =>
    MAIN_CHART_H + VOL_GAP + (1 - vol / maxVol) * VOL_CHART_H;

  return (
    <Svg width={width} height={TOTAL_H}>
      {candles.map((c, i) => {
        const x = i * slotW;
        const cx = x + slotW / 2;
        const bullish = c.close >= c.open;
        const color = bullish ? BULLISH : BEARISH;

        const bodyTop = toMainY(Math.max(c.open, c.close));
        const bodyBottom = toMainY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBottom - bodyTop);

        const wickTop = toMainY(c.high);
        const wickBottom = toMainY(c.low);

        const volTop = toVolY(c.volume);
        const volH = Math.max(1, MAIN_CHART_H + VOL_GAP + VOL_CHART_H - volTop);

        return (
          <G key={i}>
            <Line
              x1={cx}
              y1={wickTop}
              x2={cx}
              y2={bodyTop}
              stroke={color}
              strokeWidth={1}
            />
            <Line
              x1={cx}
              y1={bodyBottom}
              x2={cx}
              y2={wickBottom}
              stroke={color}
              strokeWidth={1}
            />
            <Rect
              x={x + bodyOffset}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={color}
              rx={1}
            />
            <Rect
              x={x + bodyOffset}
              y={volTop}
              width={bodyW}
              height={volH}
              fill={color}
              opacity={0.5}
              rx={1}
            />
          </G>
        );
      })}
    </Svg>
  );
}

// ─── MarketScreen ─────────────────────────────────────────────────────────────

export default function MarketScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y");
  const { width: screenWidth } = useWindowDimensions();

  const { data: rawData } = useMarket("AAPL");
  const marketData: MarketData = (rawData as MarketData | undefined) ?? MOCK_DATA;

  const candles = useMemo(() => {
    const count = RANGE_COUNT[selectedRange];
    return marketData.candles.slice(-count);
  }, [marketData.candles, selectedRange]);

  const isPositive = marketData.change >= 0;
  const changeColor = isPositive ? BULLISH : BEARISH;
  const changeSign = isPositive ? "+" : "";

  // card has px-4 (screenPad=16) and inner p-4 (chartPad=16) on each side
  const chartWidth = screenWidth - 16 * 2 - 16 * 2;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-6 pb-4 flex-row justify-between items-center">
          <Text className="text-foreground font-poppins-bold text-3xl">
            Market
          </Text>
          <View className="w-10 h-10 rounded-full border border-border items-center justify-center">
            <Info size={18} color="#8892A4" />
          </View>
        </View>

        {/* Company name + exchange */}
        <Text className="text-muted-foreground font-poppins text-sm mb-1">
          {marketData.name} · {marketData.exchange}
        </Text>

        {/* Price */}
        <Text className="text-foreground font-poppins-bold mb-1" style={{ fontSize: 44, lineHeight: 52 }}>
          {marketData.price.toFixed(2)}
        </Text>

        {/* Change */}
        <Text
          className="font-poppins-medium text-base mb-5"
          style={{ color: changeColor }}
        >
          {changeSign}
          {marketData.change.toFixed(2)} ({changeSign}
          {marketData.changePct.toFixed(2)}%)
        </Text>

        {/* Time range selector */}
        <View
          className="flex-row rounded-xl p-1 mb-4"
          style={{ backgroundColor: "#1A2236" }}
        >
          {TIME_RANGES.map((range) => {
            const active = range === selectedRange;
            return (
              <TouchableOpacity
                key={range}
                onPress={() => setSelectedRange(range)}
                className="flex-1 items-center py-1.5 rounded-lg"
                style={active ? { backgroundColor: "#2D3A52" } : undefined}
              >
                <Text
                  className="text-xs font-poppins-medium"
                  style={{ color: active ? "#F5F7FA" : "#8892A4" }}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart card */}
        <View
          className="rounded-2xl p-4 mb-4 border border-border"
          style={{ backgroundColor: CARD_BG }}
        >
          <CandlestickChart candles={candles} width={chartWidth} />
          <Text className="text-muted-foreground font-poppins text-xs mt-1">
            Volume
          </Text>
        </View>

        {/* Indicators card */}
        <View
          className="rounded-2xl border border-border"
          style={{ backgroundColor: CARD_BG }}
        >
          <Text className="text-foreground font-poppins-semibold text-base px-4 pt-4 pb-3">
            Indicators
          </Text>

          <View className="h-px bg-border" />

          <View className="flex-row justify-between items-center px-4 py-4">
            <Text className="text-foreground font-poppins text-sm">
              RSI (14)
            </Text>
            <Text className="text-foreground font-poppins-semibold text-sm">
              {marketData.indicators.rsi14.toFixed(2)}
            </Text>
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row justify-between items-center px-4 py-4">
            <Text className="text-foreground font-poppins text-sm">MACD</Text>
            <Text className="text-foreground font-poppins-semibold text-sm">
              {marketData.indicators.macd.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
