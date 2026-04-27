import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../src/context/AppContext';
import { t, UI_LANG_OPTIONS, type UILang } from '../src/i18n';
import C from '../src/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, register, uiLang, setUiLang } = useApp();
  const s = t(uiLang);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!username.trim() || !password.trim()) { setError(s.formError); return; }
    setLoading(true);
    try {
      if (mode === 'login') await login(username.trim(), password);
      else await register(username.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#fff', C.bg2]} style={[styles.inner, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}>
        {/* logo */}
        <View style={styles.logo}>
          <LinearGradient colors={[C.accent, '#FF8C42']} style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🍜</Text>
          </LinearGradient>
          <Text style={styles.appName}>SeeMenu</Text>
          <Text style={styles.appSub}>{s.appTagline}</Text>
        </View>

        <View style={styles.tabs}>
          <Pressable onPress={() => { setMode('login'); setError(''); }} style={[styles.tab, mode === 'login' && styles.tabActive]}>
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>{s.loginTab}</Text>
          </Pressable>
          <Pressable onPress={() => { setMode('register'); setError(''); }} style={[styles.tab, mode === 'register' && styles.tabActive]}>
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>{s.registerTab}</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{s.username}</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername}
              placeholder={s.usernamePlaceholder} placeholderTextColor={C.muted}
              autoCapitalize="none" autoCorrect={false} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>{s.password}</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword}
              placeholder={mode === 'register' ? s.passwordHint : s.passwordPlaceholder}
              placeholderTextColor={C.muted} secureTextEntry />
          </View>

          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>{s.uiLanguage}</Text>
              <View style={styles.langRow}>
                {UI_LANG_OPTIONS.map(opt => (
                  <Pressable
                    key={opt.code}
                    onPress={() => setUiLang(opt.code)}
                    style={[styles.langPill, uiLang === opt.code && styles.langPillActive]}
                  >
                    <Text style={[styles.langPillText, uiLang === opt.code && styles.langPillTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={submit} disabled={loading} style={[styles.btn, loading && { opacity: 0.7 }]}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{mode === 'login' ? s.loginBtn : s.registerBtn}</Text>
            }
          </Pressable>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, paddingHorizontal: 28 },
  logo: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 28, fontWeight: '800', color: C.ink, letterSpacing: -0.5 },
  appSub: { fontSize: 13, color: C.muted, marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: C.bg2, borderRadius: 12, padding: 3, marginBottom: 28 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 14, fontWeight: '500', color: C.muted },
  tabTextActive: { color: C.ink, fontWeight: '700' },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: C.ink2 },
  input: { height: 48, backgroundColor: C.bg2, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: C.ink },
  error: { fontSize: 13, color: '#E53935', textAlign: 'center', marginTop: -4 },
  btn: { height: 52, backgroundColor: C.accent, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  langRow: { flexDirection: 'row', gap: 10 },
  langPill: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: C.bg2, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  langPillActive: { borderColor: C.accent, backgroundColor: '#fff' },
  langPillText: { fontSize: 14, fontWeight: '500', color: C.muted },
  langPillTextActive: { color: C.accent, fontWeight: '700' },
});
