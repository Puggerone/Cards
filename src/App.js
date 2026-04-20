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
  for (let i=a.length-1; i>0; i--) {
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function checkAnswer(heard, expected) {
  const clean = s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();
  const h=clean(heard), e=clean(expected);
  if (h===e) return true;
  const words=e.split(' ').filter(w=>w.length>2);
  return words.some(w=>h.includes(w));
}

export default function App() {
  const [mode, setMode] = useState('read');       // 'read' | 'voice' | 'shadow'
  const [useMic, setUseMic] = useState(true);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [shadowFilter, setShadowFilter] = useState('all'); // 'all'|'phrasal-a2'|'phrasal-b1'|'phrasal-b2'
  const [shadowDeck, setShadowDeck] = useState(SHADOW);
  const [shadowIdx, setShadowIdx] = useState(0);
  const [shadowPhase, setShadowPhase] = useState('idle'); // 'idle'|'speaking'|'waiting'|'repeating'|'paused'
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

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef(null);
  const revealRef = useRef(null);
  const voiceTimerRef = useRef(null);
  const listenTimeoutRef = useRef(null);
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const shadowTimerRef = useRef(null);

  // ── Permesso microfono ────────────────────────────────────────────
  useEffect(() => {
    const requestMic = async () => {
      if (Platform.OS==='android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          { title:'Microfono', message:'VoiceCards usa il microfono per la modalità Voice.' }
        );
        setMicPermission(granted===PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setMicPermission(true);
      }
    };
    requestMic();
  }, []);

  // ── Voice recognition ─────────────────────────────────────────────
  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      if (cancelledRef.current || pausedRef.current) return;
      const heard = e.value?.[0] || '';
      setHeardText(heard);
      clearTimeout(listenTimeoutRef.current);
      Voice.stop();
    };
    Voice.onSpeechError = (e) => {
      if (cancelledRef.current || pausedRef.current) return;
      // Se errore durante ascolto, riprova una volta automaticamente
      if (voicePhase === 'listening') {
        setTimeout(()=>{
          if (cancelledRef.current || pausedRef.current) return;
          try { Voice.start('en-US'); } catch(err) {
            setHeardText('');
          }
        }, 600);
      } else {
        setHeardText('');
      }
    };
    return () => { Voice.destroy().then(Voice.removeAllListeners); };
  }, []);

  // ── Build deck ────────────────────────────────────────────────────
  const buildDeck = useCallback((f, sh, nrList=[]) => {
    let d;
    if (f==='all') d=CARDS;
    else if (f==='review') d=nrList.map(i=>CARDS[i]).filter(Boolean);
    else d=CARDS.filter(c=>c.tag===f);
    if (sh) d=shuffle(d);
    return d.length ? d : CARDS;
  }, []);

  // ── Persistenza ───────────────────────────────────────────────────
  const isReadyRef = useRef(false); // evita salvataggio prematuro idx=0 all'avvio

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
            Alert.alert(
              'Bentornato!',
              `Vuoi riprendere dalla carta ${idxSaved+1}?`,
              [
                { text:'Ricomincia', style:'destructive', onPress: async ()=>{
                    await AsyncStorage.removeItem('position');
                    isReadyRef.current = true;
                  }
                },
                { text:'Riprendi', onPress:()=>{
                    const restoredDeck = buildDeck(filterSaved, shuffledSaved || false, parsedNR);
                    setFilter(filterSaved);
                    setIsShuffled(shuffledSaved || false);
                    setDeck(restoredDeck);
                    setIdx(Math.min(idxSaved, restoredDeck.length - 1));
                    isReadyRef.current = true;
                  }
                },
              ]
            );
            return;
          }
        }
      } catch(e) {}
      isReadyRef.current = true;
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('nr_list', JSON.stringify(notRemembered)).catch(()=>{});
  }, [notRemembered]);

  useEffect(() => {
    if (!isReadyRef.current) return;
    AsyncStorage.setItem('position', JSON.stringify({ filterSaved:filter, idxSaved:idx, shuffledSaved:isShuffled })).catch(()=>{});
  }, [idx, filter, isShuffled]);

  const applyFilter = (f) => {
    setFilter(f); setDeck(buildDeck(f,isShuffled,notRemembered)); setIdx(0);
  };

  // ── Animazioni ────────────────────────────────────────────────────
  const animateOut = (cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue:0, duration:150, useNativeDriver:true }),
      Animated.timing(scaleAnim, { toValue:0.95, duration:150, useNativeDriver:true }),
    ]).start(() => {
      cb();
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue:1, duration:200, useNativeDriver:true }),
        Animated.timing(scaleAnim, { toValue:1, duration:200, useNativeDriver:true }),
      ]).start();
    });
  };

  const startPulse = () => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.3, duration:500, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1, duration:500, useNativeDriver:true }),
    ])).start();
  };
  const stopPulse = () => { pulseAnim.stopAnimation(); pulseAnim.setValue(1); };

  // ── Pausa/Riprendi ────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    cancelledRef.current = true;
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    clearTimeout(voiceTimerRef.current);
    clearTimeout(listenTimeoutRef.current);
    clearTimeout(shadowTimerRef.current);
    try { Voice.cancel(); } catch(e) {}
    Speech.stop();
    stopPulse();
  }, []);

  const togglePause = useCallback(() => {
    const newPaused = !pausedRef.current;
    pausedRef.current = newPaused;
    setPaused(newPaused);
    if (newPaused) {
      // Metti in pausa
      stopAll();
      setVoicePhase('paused');
    } else {
      // Riprendi — riavvia la card corrente
      cancelledRef.current = false;
      const card = deck[idx];
      if (card) startVoiceCard(card);
    }
  }, [deck, idx]); // eslint-disable-line

  // ── Logica READ ───────────────────────────────────────────────────
  const startReadCard = useCallback(() => {
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    setShown(false); setCountdown(3); setVoicePhase('idle'); setVoiceFeedback(null); setHeardText('');
    countdownRef.current = setInterval(()=>{
      setCountdown(p=>{ if(p<=1){ clearInterval(countdownRef.current); return 0; } return p-1; });
    }, 1000);
    revealRef.current = setTimeout(()=>setShown(true), 3000);
  }, []);

  // ── Logica SHADOW ─────────────────────────────────────────────────
  const startShadowCard = useCallback((sentence) => {
    cancelledRef.current = false;
    clearTimeout(shadowTimerRef.current);
    setShadowPhase('speaking');
    Speech.stop();
    // 1. Legge la frase in inglese
    Speech.speak(sentence.en, {
      language:'en-US', rate:0.82,
      onDone:()=>{
        if (cancelledRef.current || pausedRef.current) return;
        // 2. Pausa 5 secondi — l'utente ripete
        setShadowPhase('waiting');
        shadowTimerRef.current = setTimeout(()=>{
          if (cancelledRef.current || pausedRef.current) return;
          // 3. Ripete la frase
          setShadowPhase('repeating');
          Speech.speak(sentence.en, {
            language:'en-US', rate:0.82,
            onDone:()=>{
              if (cancelledRef.current || pausedRef.current) return;
              // 4. Pausa 2 secondi poi prossima carta
              shadowTimerRef.current = setTimeout(()=>{
                if (cancelledRef.current || pausedRef.current) return;
                setShadowPhase('idle');
                setShadowIdx(p => p < shadowDeck.length-1 ? p+1 : p);
              }, 2000);
            },
            onError:()=>{ setShadowIdx(p => p < shadowDeck.length-1 ? p+1 : p); }
          });
        }, 5000);
      },
      onError:()=>{
        if (cancelledRef.current || pausedRef.current) return;
        setShadowIdx(p => p < shadowDeck.length-1 ? p+1 : p);
      }
    });
  }, [shadowDeck]);
  const goNext = useCallback(() => {
    animateOut(()=>setIdx(prev=>prev+1<deck.length?prev+1:prev));
  }, [deck.length]); // eslint-disable-line

  const goPrev = useCallback(() => {
    if (idx>0) animateOut(()=>setIdx(prev=>prev-1));
  }, [idx]); // eslint-disable-line

  // ── Gestisci risposta ─────────────────────────────────────────────
  const handleAnswer = useCallback((heard, card) => {
    if (cancelledRef.current || pausedRef.current) return;
    stopPulse();
    const ok = heard ? checkAnswer(heard, card.en) : false;
    setVoiceFeedback(ok?'correct':'wrong');
    setVoicePhase(ok?'result-ok':'result-fail');
    setShown(true);
    Speech.speak(card.en, {
      language:'en-US', rate:0.85,
      onDone:()=>{
        if (cancelledRef.current || pausedRef.current) return;
        voiceTimerRef.current = setTimeout(()=>{
          if (cancelledRef.current || pausedRef.current) return;
          setVoiceFeedback(null); setVoicePhase('idle');
          goNext();
        }, 2000);
      },
      onError:()=>{
        if (cancelledRef.current || pausedRef.current) return;
        voiceTimerRef.current = setTimeout(()=>goNext(), 2000);
      }
    });
  }, [goNext]);

  // ── Logica VOICE ──────────────────────────────────────────────────
  const startVoiceCard = useCallback((card) => {
    cancelledRef.current = false;
    clearTimeout(voiceTimerRef.current);
    clearTimeout(listenTimeoutRef.current);
    try { Voice.cancel(); } catch(e) {}
    Speech.stop();
    setShown(false); setVoicePhase('idle'); setVoiceFeedback(null); setHeardText('');
    stopPulse();

    voiceTimerRef.current = setTimeout(async ()=>{
      if (cancelledRef.current || pausedRef.current) return;
      setVoicePhase('speaking-it');
      await Speech.speak(card.it.replace(/[/()]/g,' '), {
        language:'it-IT', rate:0.85,
        onDone:()=>{
          if (cancelledRef.current || pausedRef.current) return;
          if (useMic && micPermission) {
            // Attendi 500ms che il sistema audio rilasci completamente il TTS
            setVoicePhase('listening');
            startPulse();
            const startSTT = (attempt=0) => {
              setTimeout(()=>{
                if (cancelledRef.current || pausedRef.current) return;
                try {
                  Voice.start('en-US');
                } catch(e) {
                  // Retry una volta se fallisce al primo tentativo
                  if (attempt===0) startSTT(1);
                }
              }, attempt===0 ? 500 : 800);
            };
            startSTT();
            listenTimeoutRef.current = setTimeout(()=>{
              if (cancelledRef.current || pausedRef.current) return;
              try { Voice.stop(); } catch(e) {}
              stopPulse();
              handleAnswer('', card);
            }, 6000);
          } else {
            // Senza microfono — pausa 2.5s poi risposta
            setVoicePhase('waiting');
            voiceTimerRef.current = setTimeout(()=>{
              if (cancelledRef.current || pausedRef.current) return;
              setShown(true);
              setVoicePhase('speaking-en');
              Speech.speak(card.en, {
                language:'en-US', rate:0.85,
                onDone:()=>{
                  if (cancelledRef.current || pausedRef.current) return;
                  voiceTimerRef.current = setTimeout(()=>{
                    if (cancelledRef.current || pausedRef.current) return;
                    setVoicePhase('idle');
                    goNext();
                  }, 2000);
                },
                onError:()=>{ voiceTimerRef.current = setTimeout(()=>goNext(), 2000); }
              });
            }, 2500);
          }
        },
        onError:()=>{
          if (cancelledRef.current || pausedRef.current) return;
          voiceTimerRef.current = setTimeout(()=>{
            if (cancelledRef.current || pausedRef.current) return;
            setShown(true); setVoicePhase('idle');
            voiceTimerRef.current = setTimeout(()=>goNext(), 2000);
          }, 2500);
        }
      });
    }, 400);
  }, [useMic, micPermission, handleAnswer, goNext]); // eslint-disable-line

  // Quando STT restituisce risultato
  useEffect(()=>{
    if (voicePhase!=='listening') return;
    if (!heardText) return;
    clearTimeout(listenTimeoutRef.current);
    stopPulse();
    const card = deck[idx];
    if (card) handleAnswer(heardText, card);
  }, [heardText]); // eslint-disable-line

  // ── useEffect principale ──────────────────────────────────────────
  useEffect(()=>{
    if (mode !== 'shadow') return;
    if (pausedRef.current) return;
    cancelledRef.current = false;
    stopAll();
    const sentence = shadowDeck[shadowIdx];
    if (sentence) startShadowCard(sentence);
    return ()=>{ stopAll(); };
  }, [shadowIdx, shadowDeck]); // eslint-disable-line
  useEffect(()=>{
    if (pausedRef.current) return; // non riavviare se in pausa
    cancelledRef.current = false;
    stopAll();
    const card = deck[idx];
    if (!card) return;
    if (mode==='read') startReadCard();
    else startVoiceCard(card);
    return ()=>{ stopAll(); };
  }, [idx, deck, mode]); // eslint-disable-line

  // ── Switch mode ───────────────────────────────────────────────────
  const switchMode = (m) => {
    if (m==='voice' && useMic && !micPermission) {
      Alert.alert('Microfono', 'Permesso microfono non concesso. Puoi usare Voice senza microfono disattivando il mic.');
    }
    stopAll();
    pausedRef.current = false;
    setPaused(false);
    cancelledRef.current = false;
    setShadowPhase('idle');
    setMode(m);
    if (m==='shadow') {
      const sentence = shadowDeck[shadowIdx];
      if (sentence) setTimeout(()=>startShadowCard(sentence), 300);
    } else {
      setIdx(i=>i);
    }
  };

  const card = deck[idx]||CARDS[0];
  const tc = TAG_COLORS[card.tag]||TAG_COLORS.a2;
  const isNR = notRemembered.includes(CARDS.indexOf(card));
  const pct = ((idx+1)/deck.length)*100;
  const filters = ['all','a2','b1','b2','phrasal-b1','phrasal-b2'];
  const filterLabels = { all:'Tutte', a2:'A2', b1:'B1', b2:'B2', 'phrasal-b1':'Phrasal B1', 'phrasal-b2':'Phrasal B2' };

  const voiceBadgeInfo = {
    'speaking-it': { text:'🔊 Ascolta...', color:'#e879f9' },
    'listening':   { text:'🎤 Parla...', color:'#4ade80' },
    'waiting':     { text:'💭 Pensa...', color:'#f7c94f' },
    'result-ok':   { text:'✓ Corretto!', color:'#4ade80' },
    'result-fail': { text:'✗ Riprova', color:'#f87171' },
    'speaking-en': { text:'🔊 Risposta', color:'#4ade80' },
    'paused':      { text:'⏸ In pausa', color:'#6b7a9e' },
  }[voicePhase]||null;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b14" />

      {/* HEADER */}
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title}>Oxford 3000 <Text style={s.accent}>A2→B2</Text></Text>
          <Text style={s.version}>v{APP_VERSION}</Text>
        </View>
        <Text style={s.subtitle}>{CARDS.length} parole & phrasal verbs</Text>
        <View style={s.modeRow}>
          {['read','voice','shadow'].map(m=>(
            <TouchableOpacity key={m} onPress={()=>switchMode(m)}
              style={[s.modeBtn, mode===m && { backgroundColor:m==='voice'?'#9333ea':m==='shadow'?'#0891b2':'#2563eb' }]}>
              <Text style={[s.modeTxt, mode===m && { color:'#fff' }]}>
                {m==='read'?'📖 Read':m==='voice'?'🎤 Voice':'🗣 Shadow'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opzioni Voice */}
        {mode==='voice' && (
          <View style={s.voiceOpts}>
            <TouchableOpacity onPress={()=>setUseMic(v=>!v)}
              style={[s.optBtn, useMic && { borderColor:'#4ade80', backgroundColor:'rgba(74,222,128,0.1)' }]}>
              <Text style={[s.optTxt, useMic && { color:'#4ade80' }]}>
                {useMic?'🎤 Mic ON':'🔇 Mic OFF'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePause}
              style={[s.optBtn, paused && { borderColor:'#f7c94f', backgroundColor:'rgba(247,201,79,0.1)' }]}>
              <Text style={[s.optTxt, paused && { color:'#f7c94f' }]}>
                {paused?'▶ Riprendi':'⏸ Pausa'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Opzioni Shadow */}
        {mode==='shadow' && (
          <View style={s.voiceOpts}>
            {['all','phrasal-a2','phrasal-b1','phrasal-b2'].map(f=>(
              <TouchableOpacity key={f} onPress={()=>{
                const filtered = f==='all' ? SHADOW : SHADOW.filter(s=>s.tag===f);
                setShadowDeck(filtered); setShadowIdx(0);
                setShadowFilter(f);
              }} style={[s.optBtn, shadowFilter===f && { borderColor:'#0891b2', backgroundColor:'rgba(8,145,178,0.1)' }]}>
                <Text style={[s.optTxt, shadowFilter===f && { color:'#0891b2' }]}>
                  {f==='all'?'Tutte':f==='phrasal-a2'?'A2':f==='phrasal-b1'?'B1':'B2'}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={()
