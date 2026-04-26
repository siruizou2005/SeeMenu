import Svg, { Path, Circle, Rect } from 'react-native-svg';

const Ico = {
  back: (c = '#000', s = 20) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  camera: (c = '#fff', s = 22) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke={c} strokeWidth="1.7" />
      <Circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.7" />
    </Svg>
  ),
  flash: (c = '#fff', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={c} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  ),
  album: (c = '#fff', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="1.7" />
      <Circle cx="9" cy="9" r="1.5" fill={c} />
      <Path d="M3 16l5-5 5 5 3-3 5 5" stroke={c} strokeWidth="1.7" strokeLinejoin="round" />
    </Svg>
  ),
  plus: (c = '#fff', s = 16) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  ),
  minus: (c = '#fff', s = 16) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  ),
  cart: (c = '#000', s = 20) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M3 5h2l2.5 11a2 2 0 002 1.5h7a2 2 0 002-1.5L20 8H6" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="9" cy="20" r="1.3" fill={c} />
      <Circle cx="17" cy="20" r="1.3" fill={c} />
    </Svg>
  ),
  users: (c = '#000', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.7" />
      <Path d="M3 19c0-3 3-5 6-5s6 2 6 5" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <Circle cx="17" cy="9" r="2.5" stroke={c} strokeWidth="1.7" />
      <Path d="M16 14c2.5 0 5 1.5 5 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
  share: (c = '#000', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v12M12 3l-4 4M12 3l4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  globe: (c = '#fff', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" />
      <Path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke={c} strokeWidth="1.7" />
    </Svg>
  ),
  sparkle: (c = '#fff', s = 16) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" fill={c} />
    </Svg>
  ),
  search: (c = '#999', s = 16) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="6" stroke={c} strokeWidth="1.7" />
      <Path d="M16 16l4 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
  scan: (c = '#fff', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9V6a2 2 0 012-2h3M20 9V6a2 2 0 00-2-2h-3M4 15v3a2 2 0 002 2h3M20 15v3a2 2 0 01-2 2h-3" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <Path d="M3 12h18" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
  close: (c = '#000', s = 16) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  gear: (c = '#000', s = 18) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.7" />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
  clock: (c = '#000', s = 14) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" />
      <Path d="M12 7v5l3 2" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
  heart: (c = '#000', s = 14, filled = false) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke={c} strokeWidth="1.7" fill={filled ? c : 'none'} strokeLinejoin="round" />
    </Svg>
  ),
  alert: (c = '#000', s = 14) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4l10 17H2L12 4z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" />
      <Path d="M12 11v4M12 18v.5" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  ),
};

export default Ico;
