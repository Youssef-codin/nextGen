import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/src/context/AuthContext'
import { View, ActivityIndicator } from 'react-native'
import 'react-native-reanimated'
import '../global.css'

const queryClient = new QueryClient()

function RootLayout() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </QueryClientProvider>
  )
}
