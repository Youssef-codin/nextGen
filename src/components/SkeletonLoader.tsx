import { View } from 'react-native'

export function SkeletonLoader() {
  return (
    <View className="p-4 space-y-3">
      <View className="h-4 bg-gray-200 rounded w-3/4" />
      <View className="h-4 bg-gray-200 rounded w-1/2" />
      <View className="h-4 bg-gray-200 rounded w-5/6" />
    </View>
  )
}
