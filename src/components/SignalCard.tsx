import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import Svg, { Polyline } from "react-native-svg";

export type SignalAction = "BUY" | "SELL" | "HOLD";

export interface Signal {
  id: string;
  ticker: string;
  action: SignalAction;
  confidence: number;
  sparklineData: { index: number; value: number }[];
}

const ACTION_COLOR: Record<SignalAction, string> = {
  BUY: "#00D0B4",
  SELL: "#FF4757",
  HOLD: "#FFA502",
};

const BADGE_BG: Record<SignalAction, string> = {
  BUY: "rgba(0, 208, 180, 0.15)",
  SELL: "rgba(255, 71, 87, 0.15)",
  HOLD: "rgba(255, 165, 2, 0.15)",
};

const CARD_BG = "#141C2D";
// scroll px-4 (16) + card p-4 (16), each side = 64 total
const H_INSET = 64;
// data col takes 38%, chart col takes 62%
const DATA_RATIO = 0.38;
const CHART_H = 90;
const PAD = 4;

function toPoints(
  data: { index: number; value: number }[],
  w: number,
  h: number,
): string {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  return data
    .map((d, i) => {
      const x = PAD + (i / (data.length - 1)) * (w - PAD * 2);
      const y = PAD + (1 - (d.value - min) / range) * (h - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return "High Confidence";
  if (confidence >= 0.55) return "Medium Confidence";
  return "Low Confidence";
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="rounded-2xl p-4 mb-4 border border-border"
      style={{ backgroundColor: CARD_BG }}
    >
      {children}
    </View>
  );
}

function BadgeRow({ ticker, action }: { ticker: string; action: SignalAction }) {
  const color = ACTION_COLOR[action];
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-foreground font-poppins-semibold text-base">
        {ticker}
      </Text>
      <View
        className="px-3 py-1 rounded-md"
        style={{ backgroundColor: BADGE_BG[action] }}
      >
        <Text style={{ color }} className="font-poppins-semibold text-xs">
          {action}
        </Text>
      </View>
    </View>
  );
}

export function SignalCard({
  signal,
  compact = false,
}: {
  signal: Signal;
  compact?: boolean;
}) {
  const { ticker, action, confidence, sparklineData } = signal;
  const color = ACTION_COLOR[action];
  const label = confidenceLabel(confidence);

  const { width: screenWidth } = useWindowDimensions();
  const cardContentWidth = screenWidth - H_INSET;
  const dataColWidth = Math.floor(cardContentWidth * DATA_RATIO);
  const chartColWidth = cardContentWidth - dataColWidth;

  if (compact) {
    return (
      <CardShell>
        <BadgeRow ticker={ticker} action={action} />
        <Text style={{ color }} className="font-poppins-semibold text-3xl mb-1">
          {confidence.toFixed(2)}
        </Text>
        <Text style={{ color }} className="font-poppins text-xs">
          {label}
        </Text>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <BadgeRow ticker={ticker} action={action} />

      {/* Row 2: data column (left) + chart column (right) */}
      <View className="flex-row mb-2">
        <View style={{ width: dataColWidth }}>
          <Text style={{ color }} className="font-poppins-medium text-sm mb-1">
            {action}
          </Text>
          <Text className="text-foreground font-poppins-semibold text-3xl">
            {confidence.toFixed(2)}
          </Text>
        </View>

        <Svg width={chartColWidth} height={CHART_H}>
          <Polyline
            points={toPoints(sparklineData, chartColWidth, CHART_H)}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={{ color }} className="font-poppins text-xs self-start">
        {label}
      </Text>
    </CardShell>
  );
}
