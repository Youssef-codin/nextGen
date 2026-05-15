import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function RegisterScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900 mb-2">Create Account</Text>
      <Text className="text-base text-gray-500 mb-8">Join TradeBot today</Text>
      <View className="w-full space-y-4">
        <View className="h-12 bg-gray-100 rounded-lg px-4 justify-center">
          <Text className="text-gray-400">Name</Text>
        </View>
        <View className="h-12 bg-gray-100 rounded-lg px-4 justify-center">
          <Text className="text-gray-400">Email</Text>
        </View>
        <View className="h-12 bg-gray-100 rounded-lg px-4 justify-center">
          <Text className="text-gray-400">Password</Text>
        </View>
      </View>
      <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center mt-6">
        <Text className="text-white font-semibold text-base">Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={() => router.replace('/(auth)/login')}>
        <Text className="text-blue-600 text-sm">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}
