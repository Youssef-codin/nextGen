import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/src/context/AuthContext'
import { PortalHost } from '@rn-primitives/portal'
import { View, ActivityIndicator } from 'react-native'
import { useFonts } from 'expo-font'
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular'
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold'
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

function RootLayout() {
  const { token, isLoading } = useAuth()
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00D0B4" />
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
      <StatusBar style="light" />
      <PortalHost />
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
