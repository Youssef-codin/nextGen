import { View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@/src/context/AuthContext'
import { useSignals } from '@/src/hooks/useSignals'

export default function HomeScreen() {
  const { logout } = useAuth()
  const { data: signals, isLoading } = useSignals()

  return (
    <View className="flex-1 bg-white px-4 pt-16">
      <Text className="text-2xl font-bold text-gray-900 mb-1">TradeBot</Text>
      <Text className="text-base text-gray-500 mb-6">AI-Powered Trading Signals</Text>
      {isLoading ? (
        <Text className="text-gray-400">Loading signals…</Text>
      ) : (
        <Text className="text-gray-600 mb-4">
          {signals ? `${signals.length ?? 0} signals available` : 'No signals'}
        </Text>
      )}
      <TouchableOpacity
        onPress={logout}
        className="mt-auto mb-8 h-12 bg-red-500 rounded-lg items-center justify-center"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
