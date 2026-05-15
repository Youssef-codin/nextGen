import { type ReactNode, useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { ChevronDown, Calendar, Check } from "lucide-react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Line } from "react-native-svg";
import { useAgents } from "@/src/hooks/useAgents";
import { useSimulator } from "@/src/hooks/useSimulator";

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_BG = "#141C2D";
const PURPLE = "#6C5CE7";
const TEAL = "#00D0B4";
const CHART_H = 160;
const V_PAD = 8;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
}

interface DateRange {
  label: string;
  start: string;
  end: string;
}

// ─── Mock/fallback data ───────────────────────────────────────────────────────

const FALLBACK_AGENTS: Agent[] = [
  { id: "ppo", name: "PPO Ensemble" },
  { id: "a2c", name: "A2C Strategy" },
  { id: "dqn", name: "DQN Classic" },
  { id: "sac", name: "SAC Adaptive" },
];

const DATE_RANGES: DateRange[] = [
  { label: "2023", start: "01/01/2023", end: "01/01/2024" },
  { label: "2022–2023", start: "01/01/2022", end: "01/01/2023" },
  { label: "2021–2022", start: "01/01/2021", end: "01/01/2022" },
  { label: "2020–2021", start: "01/01/2020", end: "01/01/2021" },
];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateEquityCurve(seed: number, n = 60): number[] {
  const rand = seededRand(seed);
  let v = 100_000;
  return Array.from({ length: n }, () => {
    v *= 1 + (rand() - 0.43) * 0.04;
    return v;
  });
}

const INITIAL_EQUITY = generateEquityCurve(42);

// ─── EquityChart ─────────────────────────────────────────────────────────────

const H_GRID_LINES = 4;
const V_GRID_LINES = 5;

function EquityChart({ data, width }: { data: number[]; width: number }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const toX = (i: number) => (i / (data.length - 1)) * width;
  const toY = (v: number) =>
    V_PAD + (1 - (v - min) / range) * (CHART_H - V_PAD * 2);

  const pts: [number, number][] = data.map((v, i) => [toX(i), toY(v)]);

  const linePath = pts.reduce(
    (acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`),
    "",
  );
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${CHART_H} L ${pts[0][0]} ${CHART_H} Z`;

  const hLines = Array.from({ length: H_GRID_LINES }, (_, i) => {
    const t = i / (H_GRID_LINES - 1);
    return V_PAD + t * (CHART_H - V_PAD * 2);
  });

  const vLines = Array.from({ length: V_GRID_LINES }, (_, i) =>
    (i / (V_GRID_LINES - 1)) * width,
  );

  return (
    <Svg width={width} height={CHART_H}>
      <Defs>
        <LinearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={TEAL} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {/* Horizontal grid lines */}
      {hLines.map((y, i) => (
        <Line
          key={`h${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#ffffff"
          strokeOpacity={0.06}
          strokeWidth={1}
        />
      ))}

      {/* Vertical grid lines */}
      {vLines.map((x, i) => (
        <Line
          key={`v${i}`}
          x1={x}
          y1={V_PAD}
          x2={x}
          y2={CHART_H - V_PAD}
          stroke="#ffffff"
          strokeOpacity={0.06}
          strokeWidth={1}
        />
      ))}

      <Path d={areaPath} fill="url(#eqFill)" />
      <Path
        d={linePath}
        fill="none"
        stroke={TEAL}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Shared field layout components ──────────────────────────────────────────

function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="text-muted-foreground font-poppins text-xs mb-1.5">
      {label}
    </Text>
  );
}

function FieldCard({ children }: { children: ReactNode }) {
  return (
    <View
      className="rounded-xl border border-border px-4 py-3.5"
      style={{ backgroundColor: CARD_BG }}
    >
      {children}
    </View>
  );
}

// ─── BottomSheet modal ────────────────────────────────────────────────────────

function PickerModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/60 justify-end"
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            className="rounded-t-2xl border-t border-border pb-10 pt-2"
            style={{ backgroundColor: "#141C2D" }}
          >
            <View className="self-center w-10 h-1 rounded-full bg-border mb-4" />
            <Text className="text-foreground font-poppins-semibold text-base px-6 mb-2">
              {title}
            </Text>
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── SimulatorScreen ──────────────────────────────────────────────────────────

export default function SimulatorScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 16 * 2 - 16 * 2;

  // Agents
  const { data: agentsRaw } = useAgents();
  const agents: Agent[] = (agentsRaw as Agent[] | undefined)?.length
    ? (agentsRaw as Agent[])
    : FALLBACK_AGENTS;
  const [selectedAgent, setSelectedAgent] = useState<Agent>(FALLBACK_AGENTS[0]);
  const [agentOpen, setAgentOpen] = useState(false);

  // Capital
  const [capital, setCapital] = useState("100,000");

  // Date range
  const [dateRange, setDateRange] = useState<DateRange>(DATE_RANGES[0]);
  const [dateOpen, setDateOpen] = useState(false);

  // Simulation
  const { mutate, isPending, data: resultData } = useSimulator();

  const equityCurve = useMemo<number[]>(() => {
    const r = resultData as { equity?: number[] } | undefined;
    return Array.isArray(r?.equity) && r.equity.length > 1
      ? r.equity
      : INITIAL_EQUITY;
  }, [resultData]);

  const handleRun = useCallback(() => {
    mutate({
      agentId: selectedAgent.id,
      symbol: "AAPL",
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
  }, [mutate, selectedAgent, dateRange]);

  const handleCapitalChange = useCallback((t: string) => {
    const digits = t.replace(/[^0-9]/g, "");
    setCapital(digits.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-4 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="pt-6 pb-5">
            <Text className="text-foreground font-poppins-bold text-3xl">
              Simulator
            </Text>
          </View>

          <Text className="text-foreground font-poppins-semibold text-lg mb-5">
            Backtest Your Strategy
          </Text>

          {/* Select Agent */}
          <View className="mb-4">
            <FieldLabel label="Select Agent" />
            <TouchableOpacity
              onPress={() => setAgentOpen(true)}
              activeOpacity={0.8}
            >
              <FieldCard>
                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground font-poppins-medium text-base">
                    {selectedAgent.name}
                  </Text>
                  <ChevronDown size={18} color="#8892A4" />
                </View>
              </FieldCard>
            </TouchableOpacity>
          </View>

          {/* Starting Capital */}
          <View className="mb-4">
            <FieldLabel label="Starting Capital" />
            <FieldCard>
              <View className="flex-row justify-between items-center">
                <TextInput
                  value={capital}
                  onChangeText={handleCapitalChange}
                  keyboardType="numeric"
                  returnKeyType="done"
                  style={{
                    flex: 1,
                    color: "#F5F7FA",
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    padding: 0,
                  }}
                  placeholderTextColor="#8892A4"
                />
                <Text className="text-muted-foreground font-poppins-medium text-sm ml-3">
                  USD
                </Text>
              </View>
            </FieldCard>
          </View>

          {/* Date Range */}
          <View className="mb-6">
            <FieldLabel label="Date Range" />
            <TouchableOpacity
              onPress={() => setDateOpen(true)}
              activeOpacity={0.8}
            >
              <FieldCard>
                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground font-poppins-medium text-base">
                    {dateRange.start} - {dateRange.end}
                  </Text>
                  <Calendar size={18} color="#8892A4" />
                </View>
              </FieldCard>
            </TouchableOpacity>
          </View>

          {/* Run Simulation */}
          <TouchableOpacity
            onPress={handleRun}
            disabled={isPending}
            activeOpacity={0.85}
            className="rounded-xl py-4 items-center mb-8"
            style={{ backgroundColor: PURPLE, opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-poppins-semibold text-base">
                Run Simulation
              </Text>
            )}
          </TouchableOpacity>

          {/* Results Preview */}
          <Text className="text-foreground font-poppins-semibold text-lg mb-4">
            Results Preview
          </Text>
          <View
            className="rounded-2xl p-4 border border-border"
            style={{ backgroundColor: CARD_BG }}
          >
            <EquityChart data={equityCurve} width={chartWidth} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Agent picker bottom sheet */}
      <PickerModal
        visible={agentOpen}
        title="Select Agent"
        onClose={() => setAgentOpen(false)}
      >
        {agents.map((a) => (
          <TouchableOpacity
            key={a.id}
            onPress={() => {
              setSelectedAgent(a);
              setAgentOpen(false);
            }}
            className="flex-row items-center justify-between px-6 py-4 border-b border-border"
          >
            <Text className="text-foreground font-poppins-medium text-base">
              {a.name}
            </Text>
            {selectedAgent.id === a.id && <Check size={18} color={PURPLE} />}
          </TouchableOpacity>
        ))}
      </PickerModal>

      {/* Date range picker bottom sheet */}
      <PickerModal
        visible={dateOpen}
        title="Select Date Range"
        onClose={() => setDateOpen(false)}
      >
        {DATE_RANGES.map((dr) => (
          <TouchableOpacity
            key={dr.label}
            onPress={() => {
              setDateRange(dr);
              setDateOpen(false);
            }}
            className="flex-row items-center justify-between px-6 py-4 border-b border-border"
          >
            <Text className="text-foreground font-poppins-medium text-base">
              {dr.start} – {dr.end}
            </Text>
            {dateRange.label === dr.label && (
              <Check size={18} color={PURPLE} />
            )}
          </TouchableOpacity>
        ))}
      </PickerModal>
    </SafeAreaView>
  );
}
