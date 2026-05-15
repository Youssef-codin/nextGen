import { View, Text } from 'react-native'

export default function LeaderboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold text-gray-900">Leaderboard</Text>
      <Text className="text-sm text-gray-500 mt-2">Top traders and agents</Text>
    </View>
  )
}
