import { Tabs } from 'expo-router'
import { Home, TrendingUp, Activity, Beaker, MoreHorizontal } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0F17',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#8892A4',
        tabBarLabelStyle: { fontSize: 10 },
        tabBarItemStyle: { flex: 1 },
      }}
    >
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
          title: 'More',
          tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
