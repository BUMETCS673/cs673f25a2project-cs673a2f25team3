import React from 'react';
import {
  Home,
  Clock,
  Settings,
  BarChart,
  Gamepad2
} from 'lucide-react-native';

export const ICON_DEFAULTS = {
  color: '#E67E22',
  size: 46,
  strokeWidth: 2.4,
};

const ICON_MAP = {
  home: Home,
  clock: Clock,
  stats: BarChart,
  game: Gamepad2,
  settings: Settings,
};

export default function AppIcon({
  name = 'home',
  color = ICON_DEFAULTS.color,
  size = ICON_DEFAULTS.size,
  strokeWidth = ICON_DEFAULTS.strokeWidth,
}) {
  const IconComponent = ICON_MAP[name] || Home;
  return <IconComponent color={color} size={size} strokeWidth={strokeWidth} />;
}
