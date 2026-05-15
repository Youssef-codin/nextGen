export const colors = {
  primary: '#00D0B4',
  primaryDark: '#00BFA5',
  accent: '#6C5CE7',
  background: '#0B0F17',
  surface: '#1E1B3A',
  text: '#F5F7FA',
  textSecondary: '#8892A4',
  border: '#2D2B4E',
  card: '#1E1B3A',
  muted: '#2A2848',
  success: '#00D0B4',
  danger: '#FF4757',
  warning: '#FFA502',
  info: '#6C5CE7',
  signalBuy: '#00D0B4',
  signalSell: '#FF4757',
  signalHold: '#FFA502',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, fontFamily: 'Poppins_700Bold' },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28, fontFamily: 'Poppins_600SemiBold' },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24, fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22, fontFamily: 'Poppins_400Regular' },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18, fontFamily: 'Poppins_400Regular' },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20, fontFamily: 'Poppins_500Medium' },
}
