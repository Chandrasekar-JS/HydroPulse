import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Defs, ClipPath, LinearGradient, Stop } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const WaveCircle = ({ fillPercent = 0, size = 200 }) => {
  const clampedFill = Math.min(Math.max(fillPercent, 0), 100);
  const yOffset = ((100 - clampedFill) / 100) * size;
  const fillHeight = size - yOffset;
  const r = size / 2 - 5;
  const center = size / 2;

  // Simple wave animation
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id="circleClip">
            <Circle cx={center} cy={center} r={r} />
          </ClipPath>
          <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#2563eb" stopOpacity="0.95" />
          </LinearGradient>
        </Defs>

        {/* Outer ring */}
        <Circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#e0efff"
          strokeWidth={2.5}
        />

        {/* Water fill */}
        <Rect
          clipPath="url(#circleClip)"
          x={0}
          y={yOffset}
          width={size}
          height={fillHeight + 5}
          fill="url(#waterGrad)"
        />

        {/* Subtle wave overlay */}
        {clampedFill > 2 && (
          <Path
            clipPath="url(#circleClip)"
            d={`M0 ${yOffset + 6} Q${size * 0.25} ${yOffset} ${size * 0.5} ${yOffset + 6} T${size} ${yOffset + 6} V${size} H0 Z`}
            fill="rgba(255,255,255,0.12)"
          />
        )}
      </Svg>
    </View>
  );
};

export default WaveCircle;
