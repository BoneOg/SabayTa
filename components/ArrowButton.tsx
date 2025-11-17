import { AntDesign } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const OUTER_SIZE = 90;
const OUTER_STROKE = 7;
const OUTER_RADIUS = (OUTER_SIZE - OUTER_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;

type ArrowButtonProps = {
  onPress: () => void;
  children?: ReactNode;
  ringProgress?: number;
};

export default function ArrowButton({ onPress, children, ringProgress = 1 }: ArrowButtonProps) {
  const clampedProgress = Math.min(Math.max(ringProgress, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.outerCircle}>
        <Svg width={OUTER_SIZE} height={OUTER_SIZE} style={styles.progressRing}>
          <Circle
            cx={OUTER_SIZE / 2}
            cy={OUTER_SIZE / 2}
            r={OUTER_RADIUS}
            stroke="#F9D7F0"
            strokeWidth={OUTER_STROKE}
            fill="none"
            strokeLinecap="round"
          />
          <Circle
            cx={OUTER_SIZE / 2}
            cy={OUTER_SIZE / 2}
            r={OUTER_RADIUS}
            stroke="#534889"
            strokeWidth={OUTER_STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${OUTER_SIZE / 2}, ${OUTER_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.middleCircle}>
          <View style={styles.innerCircle}>
            {children ?? <AntDesign name="arrow-right" size={24} color="#fff" />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
  },
  middleCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#534889',
    alignItems: 'center',
    justifyContent: 'center',
  },
});