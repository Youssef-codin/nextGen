import { View, Text } from 'react-native'

export default function MarketScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold text-gray-900">Market</Text>
      <Text className="text-sm text-gray-500 mt-2">Real-time market data</Text>
    </View>
  )
}
