import { View, Text } from 'react-native'

export function MetricsRow() {
  return (
    <View className="flex-row justify-between px-4 py-3">
      <Text className="text-sm text-gray-600">Metric</Text>
      <Text className="text-sm font-semibold text-gray-900">Value</Text>
    </View>
  )
}
