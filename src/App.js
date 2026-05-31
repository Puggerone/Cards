import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, StatusBar, Platform, Alert, PermissionsAndroid
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Voice from '@react-native-voice/voice';
import CARDS from './cards';
import SHADOW from './shadowing';

const APP_VERSION = '1.5';

const TAG_COLORS = {
  a2:           { text:'#4ff7a0', bg:'rgba(79,247,160,0.15)',  border:'rgba(79,247,160,0.3)' },
  b1:           { text:'#4f8ef7', bg:'rgba(79,142,247,0.15)', border:'rgba(79,142,247,0.3)' },
  b2:           { text:'#f7934f', bg:'rgba(247,147,79,0.15)',  border:'rgba(247,147,79,0.3)' },
  'phrasal-b1': { text:'#f7c94f', bg:'rgba(247,201,79,0.15)', border:'rgba(247,201,79,0.3)' },
  'phrasal-b2': { text:'#e879f9', bg:'rgba(232,121,249,0.15)',border:'rgba(232,121,249,0.3)' },
};
const TAG_LABELS = { a2:'A2', b1:'B1', b2:'B2', 'phrasal-b1':'Phrasal B1', 'phrasal-b2':'Phrasal B2' };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkAnswer(heard, expected) {
  const clean = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const h = clean(heard), e = clean(expected);
  if (h === e) return true;
  const words = e.split(' ').filter(w => w.length > 2);
  return words.some(w => h.includes(w));
}

export default function App() {
  const [mode, setMode] = useState('read');
  const [useMic, setUseMic] = useState(true);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [deck, setDeck] = useState(CARDS);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);
  const [notRemembered, setNotRemembered] = useState([]);
  const [showNR, setShowNR] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [voicePhase, setVoicePhase] = useState('idle');
  const [voiceFeedback, setVoiceFeedback] = useState(null);
  const [heardText, setHeardText] = useState('');
  const [micPermission, setMicPermission] = useState(false);
  const [shadowFilter, setShadowFilter] = useState('all');
  const [shadowDeck, setShadowDeck] = useState(SHADOW);
  const [shadowIdx, setShadowIdx] = useState(0);
  const [shadowPhase, setShadowPhase] = useState('idle');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef(null);
  const revealRef = useRef(null);
  const voiceTimerRef = useRef(null);
  const listenTimeoutRef = useRef(null);
  const shadowTimerRef = useRef(null);
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const requestMic = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          { title: 'Microfono', message: 'Cards usa il microfono per la modalità Voice.' }
        );
        setMicPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setMicPermission(true);
      }
    };
    requestMic();
  }, []);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      if (cancelledRef.current || pausedRef.current) return;
      const heard = e.value?.[0] || '';
      setHeardText(heard);
      clearTimeout(listenTimeoutRef.current);
      Voice.stop();
    };
    Voice.onSpeechError = () => {
      if (cancelledRef.current || pausedRef.current) return;
      if (voicePhase === 'listening') {
        setTimeout(() => {
          if (cancelledRef.current || pausedRef.current) return;
          try { Voice.start('en-US'); } catch (err) { setHeardText(''); }
        }, 600);
      } else {
        setHeardText('');
      }
    };
    return () => { Voice.destroy().then(Voice.removeAllListeners); };
  }, []);

  const buildDeck = useCallback((f, sh, nrList = []) => {
    let d;
    if (f === 'all') d = CARDS;
    else if (f === 'review') d = nrList.map(i => CARDS[i]).filter(Boolean);
    else d = CARDS.filter(c => c.tag === f);
    if (sh) d = shuffle(d);
    return d.length ? d : CARDS;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('nr_list');
        const parsedNR = saved ? JSON.parse(saved) : [];
        if (saved) setNotRemembered(parsedNR);
        const pos = await AsyncStorage.getItem('position');
        if (pos) {
          const { filterSaved, idxSaved, shuffledSaved } = JSON.parse(pos);
          if (idxSaved > 0 || filterSaved !== 'all' || shuffledSaved) {
            Alert.alert('Bentornato!', `Vuoi riprendere dalla carta ${idxSaved + 1}?`, [
              { text: 'Ricomincia', style: 'destructive', onPress: async () => { await AsyncStorage.removeItem('position'); isReadyRef.current = true; } },
              { text: 'Riprendi', onPress: () => { const restoredDeck = buildDeck(filterSaved, shuffledSaved || false, parsedNR); setFilter(filterSaved); setIsShuffled(shuffledSaved || false); setDeck(restoredDeck); setIdx(Math.min(idxSaved, restoredDeck.length - 1)); isReadyRef.current = true; } },
            ]);
            return;
          }
        }
      } catch (e) {}
      isReadyRef.current = true;
    };
    load();
  }, []);

  useEffect(() => { AsyncStorage.setItem('nr_list', JSON.stringify(notRemembered)).catch(() => {}); }, [notRemembered]);
  useEffect(() => {
    if (!isReadyRef.current) return;
    AsyncStorage.setItem('position', JSON.stringify({ filterSaved: filter, idxSaved: idx, shuffledSaved: isShuffled })).catch(() => {});
  }, [idx, filter, isShuffled]);

  const applyFilter = (f) => { setFilter(f); setDeck(buildDeck(f, isShuffled, notRemembered)); setIdx(0); };

  const animateOut = (cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      cb();
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const startPulse = () => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ])).start();
  };
  const stopPulse = () => { pulseAnim.stopAnimation(); pulseAnim.setValue(1); };

  const stopAll = useCallback(() => {
    cancelledRef.current = true;
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    clearTimeout(voiceTimerRef.current);
    clearTimeout(listenTimeoutRef.current);
    clearTimeout(shadowTimerRef.current);
    try { Voice.cancel(); } catch (e) {}
    Speech.stop();
    stopPulse();
  }, []);

  const startReadCard = useCallback(() => {
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    setShown(false); setCountdown(3); setVoicePhase('idle'); setVoiceFeedback(null); setHeardText('');
    countdownRef.current = setInterval(() => {
      setCountdown(p => { if (p <= 1) { clearInterval(countdownRef.current); return 0; } return p - 1; });
    }, 1000);
    revealRef.current = setTimeout(() => setShown(true), 3000);
  }, []);

  const startShadowCard = useCallback((sentence) => {
    cancelledRef.current = false;
    clearTimeout(shadowTimerRef.current);
    setShadowPhase('speaking');
    Speech.stop();
    Speech.speak(sentence.en, {
      language: 'en-US', rate: 0.82,
      onDone: () => {
        if (cancelledRef.current || pausedRef.current) return;
        setShadowPhase('waiting');
        shadowTimerRef.current = setTimeout(() => {
          if (cancelledRef.current || pausedRef.current) return;
          setShadowPhase('repeating');
          Speech.speak(sentence.en, {
            language: 'en-US', rate: 0.82,
            onDone: () => {
              if (cancelledRef.current || pausedRef.current) return;
              shadowTimerRef.current = setTimeout(() => {
                if (cancelledRef.current || pausedRef.current) return;
                setShadowPhase('idle');
                setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
              }, 2000);
            },
            onError: () => { setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p); }
          });
        }, 5000);
      },
      onError: () => {
        if (cancelledRef.current || pausedRef.current) return;
        setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
      }
    });
  }, [shadowDeck]);

  const goNext = useCallback(() => {
    animateOut(() => setIdx(prev => prev + 1 < deck.length ? prev + 1 : prev));
  }, [deck.length]); // eslint-disable-line

  const goPrev = useCallback(() => {
    if (idx > 0) animateOut(() => setIdx(prev => prev - 1));
  }, [idx]); // eslint-disable-line

  const handleAnswer = useCallback((heard, card) => {
    if (cancelledRef.current || pausedRef.current) return;
    stopPulse();
    const ok = heard ? checkAnswer(heard, card.en) : false;
    setVoiceFeedback(ok ? 'correct' : 'wrong');
    setVoicePhase(ok ? 'result-ok' : 'result-fail');
    setShown(true);
    Speech.speak(card.en, {
      language: 'en-US', rate: 0.85,
      onDone: () => {
        if (cancelledRef.current || pausedRef.current) return;
        voiceTimerRef.current = setTimeout(() => {
          if (cancelledRef.current || pausedRef.current) return;
          setVoiceFeedback(null); setVoicePhase('idle');
          goNext();
        }, 2000);
      },
      onError: () => { if (cancelledRef.current || pausedRef.current) return; voiceTimerRef.current = setTimeout(() => goNext(), 2000); }
    });
  }, [goNext]);

  const startVoiceCard = useCallback((card) => {
    cancelledRef.current = false;
    clearTimeout(voiceTimerRef.current);
    clearTimeout(listenTimeoutRef.current);
    try { Voice.cancel(); } catch (e) {}
    Speech.stop();
    setShown(false); setVoicePhase('idle'); setVoiceFeedback(null); setHeardText('');
    stopPulse();
    voiceTimerRef.current = setTimeout(async () => {
      if (cancelledRef.current || pausedRef.current) return;
      setVoicePhase('speaking-it');
      await Speech.speak(card.it.replace(/[/()]/g, ' '), {
        language: 'it-IT', rate: 0.85,
        onDone: () => {
          if (cancelledRef.current || pausedRef.current) return;
          if (useMic && micPermission) {
            setVoicePhase('listening');
            startPulse();
            const startSTT = (attempt = 0) => {
              setTimeout(() => {
                if (cancelledRef.current || pausedRef.current) return;
                try { Voice.start('en-US'); } catch (e) { if (attempt === 0) startSTT(1); }
              }, attempt === 0 ? 500 : 800);
            };
            startSTT();
            listenTimeoutRef.current = setTimeout(() => {
              if (cancelledRef.current || pausedRef.current) return;
              try { Voice.stop(); } catch (e) {}
              stopPulse();
              handleAnswer('', card);
            }, 6000);
          } else {
            setVoicePhase('waiting');
            voiceTimerRef.current = setTimeout(() => {
              if (cancelledRef.current || pausedRef.current) return;
              setShown(true);
              setVoicePhase('speaking-en');
              Speech.speak(card.en, {
                language: 'en-US', rate: 0.85,
                onDone: () => {
                  if (cancelledRef.current || pausedRef.current) return;
                  voiceTimerRef.current = setTimeout(() => { if (cancelledRef.current || pausedRef.current) return; setVoicePhase('idle'); goNext(); }, 2000);
                },
                onError: () => { voiceTimerRef.current = setTimeout(() => goNext(), 2000); }
              });
            }, 2500);
          }
        },
        onError: () => {
          if (cancelledRef.current || pausedRef.current) return;
          voiceTimerRef.current = setTimeout(() => {
            if (cancelledRef.current || pausedRef.current) return;
            setShown(true); setVoicePhase('idle');
            voiceTimerRef.current = setTimeout(() => goNext(), 2000);
          }, 2500);
        }
      });
    }, 400);
  }, [useMic, micPermission, handleAnswer, goNext]); // eslint-disable-line

  useEffect(() => {
    if (voicePhase !== 'listening') return;
    if (!heardText) return;
    clearTimeout(listenTimeoutRef.current);
    stopPulse();
    const card = deck[idx];
    if (card) handleAnswer(heardText, card);
  }, [heardText]); // eslint-disable-line

  const togglePause = useCallback(() => {
    const newPaused = !pausedRef.current;
    pausedRef.current = newPaused;
    setPaused(newPaused);
    if (newPaused) { stopAll(); setVoicePhase('paused'); }
    else { cancelledRef.current = false; const card = deck[idx]; if (card) startVoiceCard(card); }
  }, [deck, idx]); // eslint-disable-line

  useEffect(() => {
    if (mode !== 'shadow') return;
    if (pausedRef.current) return;
    cancelledRef.current = false;
    const sentence = shadowDeck[shadowIdx];
    if (sentence) startShadowCard(sentence);
    return () => { stopAll(); };
  }, [shadowIdx, shadowDeck]); // eslint-disable-line

  useEffect(() => {
    if (mode === 'shadow') return;
    if (pausedRef.current) return;
    cancelledRef.current = false;
    stopAll();
    const card = deck[idx];
    if (!card) return;
    if (mode === 'read') startReadCard();
    else startVoiceCard(card);
    return () => { stopAll(); };
  }, [idx, deck, mode]); // eslint-disable-line

  const switchMode = (m) => {
    if (m === 'voice' && useMic && !micPermission) Alert.alert('Microfono', 'Permesso microfono non concesso.');
    stopAll();
    pausedRef.current = false; setPaused(false); cancelledRef.current = false;
    setShadowPhase('idle'); setMode(m);
    if (m === 'shadow') setShadowIdx(0);
    else setIdx(i => i);
  };

  const card = deck[idx] || CARDS[0];
  const tc = TAG_COLORS[card.tag] || TAG_COLORS.a2;
  const isNR = notRemembered.includes(CARDS.indexOf(card));
  const filters = ['all', 'a2', 'b1', 'b2', 'phrasal-b1', 'phrasal-b2'];
  const filterLabels = { all: 'Tutte', a2: 'A2', b1: 'B1', b2: 'B2', 'phrasal-b1': 'Phrasal B1', 'phrasal-b2': 'Phrasal B2' };

  const voiceBadgeInfo = {
    'speaking-it': { text: '🔊 Ascolta...', color: '#e879f9' },
    'listening':   { text: '🎤 Parla...',   color: '#4ade80' },
    'waiting':     { text: '💭 Pensa...',   color: '#f7c94f' },
    'result-ok':   { text: '✓ Corretto!',   color: '#4ade80' },
    'result-fail': { text: '✗ Riprova',     color: '#f87171' },
    'speaking-en': { text: '🔊 Risposta',   color: '#4ade80' },
    'paused':      { text: '⏸ In pausa',   color: '#6b7a9e' },
  }[voicePhase] || null;

  const shadowBadgeInfo = {
    speaking:  { text: '🔊 Ascolta...', color: '#0891b2' },
    waiting:   { text: '🗣 Ripeti!',    color: '#4ade80' },
    repeating: { text: '🔊 Ripetizione',color: '#f7c94f' },
    paused:    { text: '⏸ In pausa',   color: '#6b7a9e' },
    idle:      { text: '💭 Pronto',     color: '#6b7a9e' },
  }[shadowPhase] || { text: '', color: '#6b7a9e' };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b14" />
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title}>Oxford 3000 <Text style={s.accent}>A2→B2</Text></Text>
          <Text style={s.version}>v{APP_VERSION}</Text>
        </View>
        <Text style={s.subtitle}>{CARDS.length} parole & phrasal verbs</Text>
        <View style={s.modeRow}>
          {['read', 'voice', 'shadow'].map(m => (
            <TouchableOpacity key={m} onPress={() => switchMode(m)}
              style={[s.modeBtn, mode === m && { backgroundColor: m === 'voice' ? '#9333ea' : m === 'shadow' ? '#0891b2' : '#2563eb' }]}>
              <Text style={[s.modeTxt, mode === m && { color: '#fff' }]}>
                {m === 'read' ? '📖 Read' : m === 'voice' ? '🎤 Voice' : '🗣 Shadow'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {mode === 'voice' && (
          <View style={s.voiceOpts}>
            <TouchableOpacity onPress={() => setUseMic(v => !v)} style={[s.optBtn, useMic && { borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)' }]}>
              <Text style={[s.optTxt, useMic && { color: '#4ade80' }]}>{useMic ? '🎤 Mic ON' : '🔇 Mic OFF'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePause} style={[s.optBtn, paused && { borderColor: '#f7c94f', backgroundColor: 'rgba(247,201,79,0.1)' }]}>
              <Text style={[s.optTxt, paused && { color: '#f7c94f' }]}>{paused ? '▶ Riprendi' : '⏸ Pausa'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {mode === 'shadow' && (
          <View style={s.voiceOpts}>
            {['all', 'phrasal-a2', 'phrasal-b1', 'phrasal-b2'].map(f => (
              <TouchableOpacity key={f} onPress={() => {
                const filtered = f === 'all' ? SHADOW : SHADOW.filter(x => x.tag === f);
                stopAll(); cancelledRef.current = false;
                setShadowDeck(filtered); setShadowFilter(f); setShadowIdx(0);
              }} style={[s.optBtn, shadowFilter === f && { borderColor: '#0891b2', backgroundColor: 'rgba(8,145,178,0.1)' }]}>
                <Text style={[s.optTxt, shadowFilter === f && { color: '#0891b2' }]}>
                  {f === 'all' ? 'Tutte' : f === 'phrasal-a2' ? 'A2' : f === 'phrasal-b1' ? 'B1' : 'B2'}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => {
              const np = !pausedRef.current;
              pausedRef.current = np; setPaused(np);
              if (np) { stopAll(); setShadowPhase('paused'); }
              else { cancelledRef.current = false; const sentence = shadowDeck[shadowIdx]; if (sentence) startShadowCard(sentence); }
            }} style={[s.optBtn, paused && { borderColor: '#f7c94f', backgroundColor: 'rgba(247,201,79,0.1)' }]}>
              <Text style={[s.optTxt, paused && { color: '#f7c94f' }]}>{paused ? '▶ Riprendi' : '⏸ Pausa'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {mode !== 'shadow' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersRow}
          contentContainerStyle={{ gap: 6, alignItems: 'center', paddingRight: 16 }}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => applyFilter(f)} style={[s.fBtn, filter === f && s.fBtnOn]}>
              <Text style={[s.fTxt, filter === f && { color: '#4f8ef7' }]}>
                {filterLabels[f]} ({f === 'all' ? CARDS.length : CARDS.filter(c => c.tag === f).length})
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => { setIsShuffled(v => { const n = !v; setDeck(buildDeck(filter, n, notRemembered)); setIdx(0); return n; }); }} style={[s.fBtn, isShuffled && { borderColor: '#f7c94f' }]}>
            <Text style={[s.fTxt, isShuffled && { color: '#f7c94f' }]}>🔀 Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowNR(p => !p)} style={[s.fBtn, showNR && { borderColor: 'rgba(239,68,68,0.5)' }]}>
            <Text style={[s.fTxt, showNR && { color: '#f87171' }]}>❌ Non ricordo ({notRemembered.length})</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <View style={s.progRow}>
        <View style={s.progBg}>
          <View style={[s.progFill, {
            width: mode === 'shadow' ? `${((shadowIdx + 1) / shadowDeck.length) * 100}%` : `${((idx + 1) / deck.length) * 100}%`,
            backgroundColor: mode === 'shadow' ? '#0891b2' : '#4f8ef7'
          }]} />
        </View>
        <Text style={s.progTxt}>{mode === 'shadow' ? `${shadowIdx + 1} / ${shadowDeck.length}` : `${idx + 1} / ${deck.length}`}</Text>
      </View>

      {mode === 'shadow' && (
        <Animated.View style={[s.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#001f2d', '#000d14']} style={s.cardTop}>
            <View style={[s.vBadge, { borderColor: shadowBadgeInfo.color + '80', backgroundColor: shadowBadgeInfo.color + '20' }]}>
              <Text style={[s.vBadgeTxt, { color: shadowBadgeInfo.color }]}>{shadowBadgeInfo.text}</Text>
            </View>
            <Text style={s.emoji}>🗣</Text>
            <Text style={[s.wordEN, { textAlign: 'center', fontSize: 20, lineHeight: 28, color: '#e0f7ff' }]}>
              {shadowPhase === 'waiting' ? '· · ·' : (shadowDeck[shadowIdx]?.en || '')}
            </Text>
            <View style={[s.tag, { backgroundColor: 'rgba(8,145,178,0.15)', borderColor: 'rgba(8,145,178,0.3)' }]}>
              <Text style={[s.tagTxt, { color: '#0891b2' }]}>
                {shadowDeck[shadowIdx]?.tag === 'phrasal-a2' ? 'A2' : shadowDeck[shadowIdx]?.tag === 'phrasal-b1' ? 'B1' : 'B2'}
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={['#111827', '#080b14']} style={[s.cardBot, { justifyContent: 'center', alignItems: 'center' }]}>
            {shadowPhase === 'waiting' ? <Text style={{ fontSize: 48 }}>🎙</Text> : <Text style={s.dots}>···</Text>}
          </LinearGradient>
        </Animated.View>
      )}

      {mode !== 'shadow' && (
        <Animated.View style={[s.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#0f1e3d', '#0b1428']} style={s.cardTop}>
            {voiceBadgeInfo && (
              <View style={[s.vBadge, { borderColor: voiceBadgeInfo.color + '80', backgroundColor: voiceBadgeInfo.color + '20' }]}>
                <Text style={[s.vBadgeTxt, { color: voiceBadgeInfo.color }]}>{voiceBadgeInfo.text}</Text>
              </View>
            )}
            {mode === 'read' && !shown && (
              <View style={s.cdBadge}><Text style={s.cdTxt}>{countdown > 0 ? countdown : ''}</Text></View>
            )}
            {voicePhase === 'listening' && (
              <Animated.View style={[s.micRing, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={{ fontSize: 24 }}>🎤</Text>
              </Animated.View>
            )}
            <Text style={s.emoji}>{card.emoji}</Text>
            <View style={s.wordRow}>
              {card.pos && card.pos !== 'phrasal' && <Text style={s.pos}>{card.pos}</Text>}
              <Text style={s.wordIT}>
                {card.it.replace(/\s*\(.*?\)/g, '')}
                {card.it.includes('(') && (<Text style={s.wordITsub}>{' '}{card.it.match(/\(.*?\)/)?.[0]}</Text>)}
              </Text>
            </View>
            <View style={[s.tag, { backgroundColor: tc.bg, borderColor: tc.border }]}>
              <Text style={[s.tagTxt, { color: tc.text }]}>{TAG_LABELS[card.tag] || card.tag}</Text>
            </View>
          </LinearGradient>
          <LinearGradient colors={['#111827', '#080b14']} style={s.cardBot}>
            {shown ? (
              <View style={s.ansWrap}>
                {voiceFeedback && (
                  <View style={[s.fbBadge, { backgroundColor: voiceFeedback === 'correct' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)' }]}>
                    <Text style={[s.fbTxt, { color: voiceFeedback === 'correct' ? '#4ade80' : '#f87171' }]}>
                      {voiceFeedback === 'correct' ? '✓ Corretto!' : heardText ? `✗ Hai detto: "${heardText}"` : '✗ Non sentito'}
                    </Text>
                  </View>
                )}
                <View style={s.wordENRow}>
                  <Text style={s.wordEN}>{card.en}</Text>
                  <TouchableOpacity onPress={() => { Speech.stop(); Speech.speak(card.en, { language: 'en-US', rate: 0.85 }); }} style={s.speakBtn}>
                    <Text style={s.speakBtnTxt}>🔊</Text>
                  </TouchableOpacity>
                </View>
                {card.syn && (<Text style={s.syn}>sinonimo: <Text style={{ color: 'rgba(238,242,255,0.65)' }}>{card.syn}</Text></Text>)}
                {card.ex ? <View style={s.exWrap}><Text style={s.exTxt}>{card.ex}</Text></View> : null}
                <TouchableOpacity onPress={() => { const gi = CARDS.indexOf(card); setNotRemembered(prev => prev.includes(gi) ? prev.filter(x => x !== gi) : [...prev, gi]); }} style={[s.nrBtn, isNR && s.nrBtnOn]}>
                  <Text style={s.nrTxt}>{isNR ? '✓ Salvata' : '❌ Non ricordo'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={s.dots}>
                {mode === 'voice' ? (voicePhase === 'speaking-it' ? '🔊' : voicePhase === 'listening' ? '👂' : voicePhase === 'paused' ? '⏸' : '💭') : '···'}
              </Text>
            )}
          </LinearGradient>
        </Animated.View>
      )}

      <View style={s.ctrlRow}>
        {mode === 'shadow' ? (
          <>
            <TouchableOpacity onPress={() => { stopAll(); cancelledRef.current = false; setShadowIdx(p => Math.max(0, p - 1)); }} style={s.navBtn}>
              <Text style={s.navTxt}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { stopAll(); cancelledRef.current = false; setShadowIdx(p => Math.min(shadowDeck.length - 1, p + 1)); }} style={s.navBtn}>
              <Text style={s.navTxt}>→ Salta</Text>
            </TouchableOpacity>
          </>
        ) : mode === 'read' ? (
          <>
            <TouchableOpacity onPress={goPrev} disabled={idx === 0} style={[s.navBtn, idx === 0 && s.dis]}><Text style={s.navTxt}>←</Text></TouchableOpacity>
            <TouchableOpacity onPress={goNext} disabled={idx === deck.length - 1} style={[s.navMain, idx === deck.length - 1 && s.dis]}><Text style={s.navMainTxt}>→</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => { stopAll(); pausedRef.current = false; setPaused(false); cancelledRef.current = false; animateOut(() => setIdx(p => Math.max(0, p - 1))); }} style={s.navBtn}><Text style={s.navTxt}>←</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { stopAll(); pausedRef.current = false; setPaused(false); cancelledRef.current = false; animateOut(() => setIdx(p => Math.min(deck.length - 1, p + 1))); }} style={s.navBtn}><Text style={s.navTxt}>→ Salta</Text></TouchableOpacity>
          </>
        )}
      </View>

      {showNR && (
        <View style={s.nrPanel}>
          <View style={s.nrHead}>
            <Text style={s.nrTitle}>❌ Da ripassare ({notRemembered.length})</Text>
            {notRemembered.length > 0 && (
              <TouchableOpacity onPress={() => { applyFilter('review'); setShowNR(false); }} style={s.nrRip}>
                <Text style={s.nrRipTxt}>▶ Ripassa</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={{ maxHeight: 100 }}>
            {notRemembered.length === 0 ? <Text style={s.nrEmpty}>Nessuna parola salvata.</Text> : (
              <View style={s.nrList}>
                {notRemembered.map(gi => {
                  const c = CARDS[gi]; if (!c) return null;
                  return (
                    <TouchableOpacity key={gi} onPress={() => setNotRemembered(p => p.filter(x => x !== gi))} style={s.nrChip}>
                      <Text style={s.nrChipTxt}>{c.it} → {c.en} ✕</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex:1, backgroundColor:'#080b14', paddingTop:Platform.OS==='android'?40:50, paddingHorizontal:16 },
  header:      { alignItems:'center', marginBottom:10 },
  titleRow:    { flexDirection:'row', alignItems:'center', gap:8 },
  title:       { fontSize:22, fontWeight:'700', color:'#eef2ff' },
  accent:      { color:'#4f8ef7' },
  version:     { fontSize:11, color:'#6b7a9e', fontFamily:Platform.OS==='ios'?'Courier':'monospace' },
  subtitle:    { fontSize:11, color:'#6b7a9e', marginTop:2, textTransform:'uppercase', letterSpacing:1 },
  modeRow:     { flexDirection:'row', marginTop:10, borderRadius:20, overflow:'hidden', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  modeBtn:     { paddingVertical:7, paddingHorizontal:16, backgroundColor:'#0f1624' },
  modeTxt:     { fontSize:11, color:'#6b7a9e', fontWeight:'600', textTransform:'uppercase', letterSpacing:1 },
  voiceOpts:   { flexDirection:'row', gap:6, marginTop:8, flexWrap:'wrap', justifyContent:'center' },
  optBtn:      { paddingVertical:5, paddingHorizontal:12, borderRadius:20, backgroundColor:'#0f1624', borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  optTxt:      { fontSize:11, color:'#6b7a9e', fontWeight:'600' },
  filtersRow:  { maxHeight:44, marginBottom:8 },
  fBtn:        { paddingVertical:5, paddingHorizontal:12, borderRadius:20, backgroundColor:'#0f1624', borderWidth:1, borderColor:'rgba(255,255,255,0.07)' },
  fBtnOn:      { borderColor:'#4f8ef7', backgroundColor:'rgba(79,142,247,0.15)' },
  fTxt:        { fontSize:11, color:'#6b7a9e', textTransform:'uppercase', letterSpacing:0.8 },
  progRow:     { flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 },
  progBg:      { flex:1, height:3, backgroundColor:'rgba(255,255,255,0.07)', borderRadius:10, overflow:'hidden' },
  progFill:    { height:'100%', borderRadius:10 },
  progTxt:     { fontSize:12, color:'#6b7a9e' },
  card:        { flex:1, borderRadius:24, overflow:'hidden', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', marginBottom:10 },
  cardTop:     { flex:1.4, padding:28, alignItems:'center', justifyContent:'center', gap:12, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.07)' },
  vBadge:      { position:'absolute', top:14, left:14, borderRadius:20, paddingVertical:3, paddingHorizontal:12, borderWidth:1 },
  vBadgeTxt:   { fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:1 },
  cdBadge:     { position:'absolute', top:14, right:14, width:32, height:32, borderRadius:16, backgroundColor:'rgba(79,142,247,0.2)', borderWidth:1, borderColor:'rgba(79,142,247,0.4)', alignItems:'center', justifyContent:'center' },
  cdTxt:       { fontSize:13, fontWeight:'700', color:'#4f8ef7' },
  micRing:     { position:'absolute', top:10, right:10, width:48, height:48, borderRadius:24, backgroundColor:'rgba(74,222,128,0.15)', borderWidth:2, borderColor:'rgba(74,222,128,0.5)', alignItems:'center', justifyContent:'center' },
  emoji:       { fontSize:52 },
  wordRow:     { flexDirection:'row', alignItems:'baseline', gap:8 },
  pos:         { fontSize:14, color:'rgba(238,242,255,0.4)', fontStyle:'italic' },
  wordIT:      { fontSize:30, fontWeight:'700', color:'#eef2ff', textAlign:'center' },
  wordITsub:   { fontSize:16, fontWeight:'400', color:'rgba(238,242,255,0.45)', fontStyle:'italic' },
  tag:         { borderRadius:20, paddingVertical:3, paddingHorizontal:12, borderWidth:1 },
  tagTxt:      { fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:1.2 },
  cardBot:     { flex:1, padding:24, alignItems:'center', justifyContent:'center' },
  ansWrap:     { alignItems:'center', gap:10, width:'100%' },
  fbBadge:     { paddingVertical:6, paddingHorizontal:16, borderRadius:20, marginBottom:4 },
  fbTxt:       { fontSize:13, fontWeight:'700' },
  wordENRow:   { flexDirection:'row', alignItems:'center', gap:10 },
  wordEN:      { fontSize:28, fontWeight:'700', color:'#f7c94f' },
  speakBtn:    { width:36, height:36, borderRadius:18, backgroundColor:'rgba(247,201,79,0.15)', borderWidth:1, borderColor:'rgba(247,201,79,0.35)', alignItems:'center', justifyContent:'center' },
  speakBtnTxt: { fontSize:16 },
  syn:         { fontSize:12, color:'rgba(238,242,255,0.4)', fontStyle:'italic' },
  exWrap:      { borderLeftWidth:2, borderLeftColor:'rgba(247,201,79,0.3)', paddingLeft:12, marginTop:4 },
  exTxt:       { fontSize:13, color:'rgba(238,242,255,0.55)', fontStyle:'italic', lineHeight:20 },
  dots:        { fontSize:28, color:'rgba(238,242,255,0.2)' },
  nrBtn:       { marginTop:8, paddingVertical:6, paddingHorizontal:20, borderRadius:20, backgroundColor:'rgba(239,68,68,0.08)', borderWidth:1, borderColor:'rgba(239,68,68,0.25)' },
   nrBtnOn:     { backgroundColor:'rgba(239,68,68,0.2)', borderColor:'rgba(239,68,68,0.6)' },
  nrTxt:       { fontSize:12, color:'#f87171', fontWeight:'600' },
  ctrlRow:     { flexDirection:'row', justifyContent:'center', alignItems:'center', gap:16, marginBottom:10 },
  navBtn:      { width:52, height:52, borderRadius:26, backgroundColor:'#0f1624', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  navMain:     { width:64, height:64, borderRadius:32, backgroundColor:'#2563eb', alignItems:'center', justifyContent:'center' },
  dis:         { opacity:0.3 },
  navTxt:      { color:'#eef2ff', fontSize:18 },
  navMainTxt:  { color:'#fff', fontSize:22 },
  nrPanel:     { backgroundColor:'#0f1624', borderRadius:20, padding:16, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', marginBottom:8 },
  nrHead:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  nrTitle:     { fontSize:11, color:'#6b7a9e', textTransform:'uppercase', fontWeight:'600', letterSpacing:1 },
  nrRip:       { paddingVertical:4, paddingHorizontal:12, borderRadius:20, backgroundColor:'rgba(239,68,68,0.15)', borderWidth:1, borderColor:'rgba(239,68,68,0.4)' },
  nrRipTxt:    { fontSize:11, color:'#f87171', fontWeight:'600' },
  nrEmpty:     { fontSize:12, color:'#6b7a9e', fontStyle:'italic' },
  nrList:      { flexDirection:'row', flexWrap:'wrap', gap:6 },
  nrChip:      { paddingVertical:4, paddingHorizontal:10, borderRadius:20, backgroundColor:'rgba(239,68,68,0.08)', borderWidth:1, borderColor:'rgba(239,68,68,0.2)' },
  nrChipTxt:   { fontSize:11, color:'#f87171' },
});
