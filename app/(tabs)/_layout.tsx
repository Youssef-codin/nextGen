import { Tabs } from 'expo-router'
import { Home, TrendingUp, Activity, Beaker, Trophy } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="signals"
        options={{
          title: 'Signals',
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="simulator"
        options={{
          title: 'Simulator',
          tabBarIcon: ({ color, size }) => <Beaker color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
