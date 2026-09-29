import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Menu = ({
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 6H20M4 12H20M4 18H20"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const ChevronDown = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6 9L12 15L18 9"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronRight = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9 6L15 12L9 18"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Eye = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M2.5 12C4.5 7.8 8 5.5 12 5.5S19.5 7.8 21.5 12C19.5 16.2 16 18.5 12 18.5S4.5 16.2 2.5 12Z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export const EyeOff = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 3L21 21"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />

    <Path
      d="M10.5 5.8C11 5.6 11.5 5.5 12 5.5C16 5.5 19.5 7.8 21.5 12C20.7 13.7 19.6 15.1 18.2 16.2"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M6.1 6.1C4.6 7.2 3.4 9 2.5 12C4.5 16.2 8 18.5 12 18.5C13.4 18.5 14.7 18.2 15.8 17.7"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Globe = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    <Path
      d="M3 12H21M12 3C14.5 5.5 15.5 8.5 15.5 12S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const Lock = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect
      x="5"
      y="10"
      width="14"
      height="10"
      rx="2"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    <Path
      d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5S16 5.3 16 7.5V10"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const Phone = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6.5 3.5L9.2 3C9.8 2.9 10.4 3.2 10.7 3.8L12 6.8C12.2 7.3 12.1 7.9 11.7 8.3L10.1 9.9C11.2 12.1 12.9 13.8 15.1 14.9L16.7 13.3C17.1 12.9 17.7 12.8 18.2 13L21.2 14.3C21.8 14.6 22.1 15.2 22 15.8L21.5 18.5C21.3 19.5 20.4 20.2 19.4 20.1C10.6 19.3 4.7 13.4 3.9 4.6C3.8 3.6 4.5 2.7 5.5 2.5Z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Building2 = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 21V5C4 4.4 4.4 4 5 4H14C14.6 4 15 4.4 15 5V21"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    <Path
      d="M15 10H19C19.6 10 20 10.4 20 11V21"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    <Path
      d="M8 8H11M8 12H11M8 16H11M17 14H18M17 17H18M2 21H22"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const Keyboard = ({
  size = 24,
  color = '#555555',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />

    <Path
      d="M6 10H6.01M9 10H9.01M12 10H12.01M15 10H15.01M18 10H18.01M6 14H6.01M9 14H15M18 14H18.01"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
