import { View, Text } from 'react-native'

export function SentimentBadge() {
  return (
    <View className="px-2 py-1 rounded-full bg-gray-100">
      <Text className="text-xs font-medium text-gray-700">Neutral</Text>
    </View>
  )
}
