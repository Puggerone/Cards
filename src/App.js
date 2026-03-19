import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, StatusBar, Dimensions, Platform, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import CARDS from './cards';

const { width } = Dimensions.get('window');

const TAG_COLORS = {
  a2:           { text: '#4ff7a0', bg: 'rgba(79,247,160,0.15)',  border: 'rgba(79,247,160,0.3)' },
  b1:           { text: '#4f8ef7', bg: 'rgba(79,142,247,0.15)', border: 'rgba(79,142,247,0.3)' },
  b2:           { text: '#f7934f', bg: 'rgba(247,147,79,0.15)',  border: 'rgba(247,147,79,0.3)' },
  'phrasal-b1': { text: '#f7c94f', bg: 'rgba(247,201,79,0.15)', border: 'rgba(247,201,79,0.3)' },
  'phrasal-b2': { text: '#e879f9', bg: 'rgba(232,121,249,0.15)',border: 'rgba(232,121,249,0.3)' },
};

const TAG_LABELS = {
  a2: 'A2', b1: 'B1', b2: 'B2',
  'phrasal-b1': 'Phrasal B1', 'phrasal-b2': 'Phrasal B2',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [mode, setMode] = useState('read');
  const [filter, setFilter] = useState('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [deck, setDeck] = useState(CARDS);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);
  const [notRemembered, setNotRemembered] = useState([]);
  const [showNR, setShowNR] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [voicePhase, setVoicePhase] = useState('idle');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef(null);
  const revealRef = useRef(null);
  const voiceTimerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('nr_list');
        if (saved) setNotRemembered(JSON.parse(saved));
        const pos = await AsyncStorage.getItem('position');
        if (pos) {
          const { filterSaved, idxSaved } = JSON.parse(pos);
          Alert.alert(
            'Bentornato!',
            `Riprendi dalla carta ${idxSaved + 1}?`,
            [
              { text: 'Ricomincia', onPress: () => {} },
              { text: 'Riprendi', onPress: () => {
                setFilter(filterSaved);
                setIdx(idxSaved);
              }}
            ]
          );
        }
      } catch (e) {}
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('nr_list', JSON.stringify(notRemembered)).catch(() => {});
  }, [notRemembered]);

  useEffect(() => {
    AsyncStorage.setItem('position', JSON.stringify({ filterSaved: filter, idxSaved: idx })).catch(() => {});
  }, [idx, filter]);

  const buildDeck = useCallback((f, sh, nrList = []) => {
    let d;
    if (f === 'all') d = CARDS;
    else if (f === 'review') d = nrList.map(i => CARDS[i]).filter(Boolean);
    else d = CARDS.filter(c => c.tag === f);
    if (sh) d = shuffle(d);
    return d.length ? d : CARDS;
  }, []);

  const applyFilter = (f) => {
    setFilter(f);
    setDeck(buildDeck(f, isShuffled, notRemembered));
    setIdx(0);
  };

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

  const startReadCard = useCallback(() => {
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    setShown(false);
    setCountdown(3);
    setVoicePhase('idle');
    countdownRef.current = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(countdownRef.current); return 0; }
        return p - 1;
      });
    }, 1000);
    revealRef.current = setTimeout(() => setShown(true), 3000);
  }, []);

  const startVoiceCard = useCallback((card) => {
    clearTimeout(voiceTimerRef.current);
    Speech.stop();
    setShown(false);
    setVoicePhase('idle');
    voiceTimerRef.current = setTimeout(() => {
      setVoicePhase('speaking-it');
      Speech.speak(card.it.replace(/[/()]/g, ' '), {
        language: 'it-IT',
        rate: 0.85,
        onDone: () => {
          setVoicePhase('waiting');
          voiceTimerRef.current = setTimeout(() => {
            setShown(true);
            setVoicePhase('speaking-en');
            Speech.speak(card.en, {
              language: 'en-US',
              rate: 0.85,
              onDone: () => {
                setVoicePhase('done');
                voiceTimerRef.current = setTimeout(() => goNext(), 2000);
              },
              onError: () => {
                setVoicePhase('done');
                voiceTimerRef.current = setTimeout(() => goNext(), 2000);
              }
            });
          }, 2500);
        },
        onError: () => {
          setVoicePhase('waiting');
          voiceTimerRef.current = setTimeout(() => {
            setShown(true);
            setVoicePhase('done');
            voiceTimerRef.current = setTimeout(() => goNext(), 2000);
          }, 2500);
        }
      });
    }, 400);
  }, []); // eslint-disable-line

  const goNext = useCallback(() => {
    animateOut(() => setIdx(prev => prev + 1 < deck.length ? prev + 1 : prev));
  }, [deck.length]); // eslint-disable-line

  const goPrev = useCallback(() => {
    if (idx > 0) animateOut(() => setIdx(prev => prev - 1));
  }, [idx]); // eslint-disable-line

  useEffect(() => {
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    clearTimeout(voiceTimerRef.current);
    Speech.stop();
    const card = deck[idx];
    if (!card) return;
    if (mode === 'read') startReadCard();
    else startVoiceCard(card);
    return () => {
      clearTimeout(revealRef.current);
      clearInterval(countdownRef.current);
      clearTimeout(voiceTimerRef.current);
      Speech.stop();
    };
  }, [idx, deck, mode]); // eslint-disable-line

  const switchMode = (m) => {
    Speech.stop();
    clearTimeout(voiceTimerRef.current);
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    setMode(m);
    setIdx(i => i);
  };

  const card = deck[idx] || CARDS[0];
  const tc = TAG_COLORS[card.tag] || TAG_COLORS.a2;
  const isNR = notRemembered.includes(CARDS.indexOf(card));
  const pct = ((idx + 1) / deck.length) * 100;
  const filters = ['all', 'a2', 'b1', 'b2', 'phrasal-b1', 'phrasal-b2'];
  const filterLabels = { all: 'Tutte', a2: 'A2', b1: 'B1', b2: 'B2', 'phrasal-b1': 'Phrasal B1', 'phrasal-b2': 'Phrasal B2' };
  const voiceBadge = { 'speaking-it': '🔊 Ascolta...', 'waiting': '💭 Pensa...', 'speaking-en': '🔊 Risposta', 'done': '✓' }[voicePhase] || '';
  const voiceColor = { 'speaking-it': '#e879f9', 'waiting': '#f7c94f', 'speaking-en': '#4ade80', 'done': '#4ade80' }[voicePhase] || '#4f8ef7';

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b14" />
      <View style={s.header}>
        <Text style={s.title}>Oxford 3000 <Text style={s.accent}>A2→B2</Text></Text>
        <Text style={s.subtitle}>{CARDS.length} parole & phrasal verbs</Text>
        <View style={s.modeRow}>
          {['read', 'voice'].map(m => (
            <TouchableOpacity key={m} onPress={() => switchMode(m)}
              style={[s.modeBtn, mode === m && { backgroundColor: m === 'voice' ? '#9333ea' : '#2563eb' }]}>
              <Text style={[s.modeTxt, mode === m && { color: '#fff' }]}>{m === 'read' ? '📖 Read' : '🎤 Voice'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersRow} contentContainerStyle={{ gap: 6, alignItems: 'center', paddingRight: 16 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => applyFilter(f)} style={[s.fBtn, filter === f && s.fBtnOn]}>
            <Text style={[s.fTxt, filter === f && { color: '#4f8ef7' }]}>
              {filterLabels[f]} ({f === 'all' ? CARDS.length : CARDS.filter(c => c.tag === f).length})
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => { setIsShuffled(v => { const n = !v; setDeck(buildDeck(filter, n, notRemembered)); setIdx(0); return n; }); }}
          style={[s.fBtn, isShuffled && { borderColor: '#f7c94f' }]}>
          <Text style={[s.fTxt, isShuffled && { color: '#f7c94f' }]}>🔀 Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowNR(p => !p)} style={[s.fBtn, showNR && { borderColor: 'rgba(239,68,68,0.5)' }]}>
          <Text style={[s.fTxt, showNR && { color: '#f87171' }]}>❌ Non ricordo ({notRemembered.length})</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={s.progRow}>
        <View style={s.progBg}><View style={[s.progFill, { width: `${pct}%` }]} /></View>
        <Text style={s.progTxt}>{idx + 1} / {deck.length}</Text>
      </View>

      <Animated.View style={[s.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient colors={['#0f1e3d', '#0b1428']} style={s.cardTop}>
          {mode === 'voice' && voiceBadge !== '' && (
            <View style={[s.vBadge, { borderColor: voiceColor + '80', backgroundColor: voiceColor + '20' }]}>
              <Text style={[s.vBadgeTxt, { color: voiceColor }]}>{voiceBadge}</Text>
            </View>
          )}
          {mode === 'read' && !shown && (
            <View style={s.cdBadge}><Text style={s.cdTxt}>{countdown > 0 ? countdown : ''}</Text></View>
          )}
          <Text style={s.emoji}>{card.emoji}</Text>
          <View style={s.wordRow}>
            {card.pos && card.pos !== 'phrasal' && <Text style={s.pos}>{card.pos}</Text>}
            <Text style={s.wordIT}>{card.it}</Text>
          </View>
          <View style={[s.tag, { backgroundColor: tc.bg, borderColor: tc.border }]}>
            <Text style={[s.tagTxt, { color: tc.text }]}>{TAG_LABELS[card.tag] || card.tag}</Text>
          </View>
        </LinearGradient>

        <LinearGradient colors={['#111827', '#080b14']} style={s.cardBot}>
          {shown ? (
            <View style={s.ansWrap}>
              <Text style={s.wordEN}>{card.en}</Text>
              {card.syn && <Text style={s.syn}>sinonimo: <Text style={{ color: 'rgba(238,242,255,0.65)' }}>{card.syn}</Text></Text>}
              {card.ex ? <View style={s.exWrap}><Text style={s.exTxt}>{card.ex}</Text></View> : null}
              <TouchableOpacity onPress={() => {
                const gi = CARDS.indexOf(card);
                setNotRemembered(prev => prev.includes(gi) ? prev.filter(x => x !== gi) : [...prev, gi]);
              }} style={[s.nrBtn, isNR && s.nrBtnOn]}>
                <Text style={s.nrTxt}>{isNR ? '✓ Salvata' : '❌ Non ricordo'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={s.dots}>{mode === 'voice' ? (voicePhase === 'speaking-it' ? '🔊' : '💭') : '···'}</Text>
          )}
        </LinearGradient>
      </Animated.View>

      <View style={s.ctrlRow}>
        {mode === 'read' ? (
          <>
            <TouchableOpacity onPress={goPrev} disabled={idx === 0} style={[s.navBtn, idx === 0 && s.dis]}><Text style={s.navTxt}>←</Text></TouchableOpacity>
            <TouchableOpacity onPress={goNext} disabled={idx === deck.length - 1} style={[s.navMain, idx === deck.length - 1 && s.dis]}><Text style={s.navMainTxt}>→</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => { clearTimeout(voiceTimerRef.current); Speech.stop(); animateOut(() => setIdx(p => Math.max(0, p - 1))); }} style={s.navBtn}><Text style={s.navTxt}>←</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { clearTimeout(voiceTimerRef.current); Speech.stop(); animateOut(() => setIdx(p => Math.min(deck.length - 1, p + 1))); }} style={s.navBtn}><Text style={s.navTxt}>→ Salta</Text></TouchableOpacity>
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
            {notRemembered.length === 0
              ? <Text style={s.nrEmpty}>Nessuna parola salvata.</Text>
              : <View style={s.nrList}>
                  {notRemembered.map(gi => {
                    const c = CARDS[gi]; if (!c) return null;
                    return (
                      <TouchableOpacity key={gi} onPress={() => setNotRemembered(p => p.filter(x => x !== gi))} style={s.nrChip}>
                        <Text style={s.nrChipTxt}>{c.it} → {c.en} ✕</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
            }
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080b14', paddingTop: Platform.OS === 'android' ? 40 : 50, paddingHorizontal: 16 },
  header: { alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#eef2ff' },
  accent: { color: '#4f8ef7' },
  subtitle: { fontSize: 11, color: '#6b7a9e', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  modeRow: { flexDirection: 'row', marginTop: 12, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modeBtn: { paddingVertical: 7, paddingHorizontal: 20, backgroundColor: '#0f1624' },
  modeTxt: { fontSize: 12, color: '#6b7a9e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  filtersRow: { maxHeight: 44, marginBottom: 8 },
  fBtn: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#0f1624', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  fBtnOn: { borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.15)' },
  fTxt: { fontSize: 11, color: '#6b7a9e', textTransform: 'uppercase', letterSpacing: 0.8 },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progBg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: '#4f8ef7', borderRadius: 10 },
  progTxt: { fontSize: 12, color: '#6b7a9e' },
  card: { flex: 1, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 12 },
  cardTop: { flex: 1.4, padding: 28, alignItems: 'center', justifyContent: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  vBadge: { position: 'absolute', top: 14, left: 14, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 12, borderWidth: 1 },
  vBadgeTxt: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  cdBadge: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(79,142,247,0.2)', borderWidth: 1, borderColor: 'rgba(79,142,247,0.4)', alignItems: 'center', justifyContent: 'center' },
  cdTxt: { fontSize: 13, fontWeight: '700', color: '#4f8ef7' },
  emoji: { fontSize: 52 },
  wordRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  pos: { fontSize: 14, color: 'rgba(238,242,255,0.4)', fontStyle: 'italic' },
  wordIT: { fontSize: 30, fontWeight: '700', color: '#eef2ff', textAlign: 'center' },
  tag: { borderRadius: 20, paddingVertical: 3, paddingHorizontal: 12, borderWidth: 1 },
  tagTxt: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2 },
  cardBot: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  ansWrap: { alignItems: 'center', gap: 10, width: '100%' },
  wordEN: { fontSize: 28, fontWeight: '700', color: '#f7c94f' },
  syn: { fontSize: 12, color: 'rgba(238,242,255,0.4)', fontStyle: 'italic' },
  exWrap: { borderLeftWidth: 2, borderLeftColor: 'rgba(247,201,79,0.3)', paddingLeft: 12, marginTop: 4 },
  exTxt: { fontSize: 13, color: 'rgba(238,242,255,0.55)', fontStyle: 'italic', lineHeight: 20 },
  dots: { fontSize: 28, color: 'rgba(238,242,255,0.2)' },
  nrBtn: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' },
  nrBtnOn: { backgroundColor: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.6)' },
  nrTxt: { fontSize: 12, color: '#f87171', fontWeight: '600' },
  ctrlRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 },
  navBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0f1624', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  navMain: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  dis: { opacity: 0.3 },
  navTxt: { color: '#eef2ff', fontSize: 18 },
  navMainTxt: { color: '#fff', fontSize: 22 },
  nrPanel: { backgroundColor: '#0f1624', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 8 },
  nrHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  nrTitle: { fontSize: 11, color: '#6b7a9e', textTransform: 'uppercase', fontWeight: '600', letterSpacing: 1 },
  nrRip: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)' },
  nrRipTxt: { fontSize: 11, color: '#f87171', fontWeight: '600' },
  nrEmpty: { fontSize: 12, color: '#6b7a9e', fontStyle: 'italic' },
  nrList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  nrChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  nrChipTxt: { fontSize: 11, color: '#f87171' },
