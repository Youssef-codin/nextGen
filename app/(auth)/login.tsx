import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
      <Text className="text-base text-gray-500 mb-8">Sign in to your account</Text>
      <View className="w-full space-y-4">
        <View className="h-12 bg-gray-100 rounded-lg px-4 justify-center">
          <Text className="text-gray-400">Email</Text>
        </View>
        <View className="h-12 bg-gray-100 rounded-lg px-4 justify-center">
          <Text className="text-gray-400">Password</Text>
        </View>
      </View>
      <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center mt-6">
        <Text className="text-white font-semibold text-base">Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={() => router.replace('/(auth)/register')}>
        <Text className="text-blue-600 text-sm">Don&apos;t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}
