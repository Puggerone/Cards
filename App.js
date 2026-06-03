import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, StatusBar, Platform, Alert, PermissionsAndroid
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';
import CARDS from './src/cards';
import SHADOW from './src/shadowing';

const APP_VERSION = '1.5';

const TAG_COLORS = {
  a2:           { text:'#4ff7a0', bg:'rgba(79,247,160,0.15)',  border:'rgba(79,247,160,0.3)' },
  b1:           { text:'#4f8ef7', bg:'rgba(79,142,247,0.15)', border:'rgba(79,142,247,0.3)' },
  b2:           { text:'#f7934f', bg:'rgba(247,147,79,0.15)',  border:'rgba(247,147,79,0.3)' },
  'phrasal-b1': { text:'#f7c94f', bg:'rgba(247,201,79,0.15)', border:'rgba(247,201,79,0.3)' },
  'phrasal-b2': { text:'#e879f9', bg:'rgba(232,121,249,0.15)',border:'rgba(232,121,249,0.3)' },
};
const TAG_LABELS = { a2:'A2', b1:'B1', b2:'B2', 'phrasal-b1':'Phrasal B1', 'phrasal-b2':'Phrasal B2' };

// ── Mappa statica require() per tutti i 300 MP3 ──────────────────────────────
const AUDIO_FILES = {
  1: require('./assets/audio/shadow_001.mp3'),
  2: require('./assets/audio/shadow_002.mp3'),
  3: require('./assets/audio/shadow_003.mp3'),
  4: require('./assets/audio/shadow_004.mp3'),
  5: require('./assets/audio/shadow_005.mp3'),
  6: require('./assets/audio/shadow_006.mp3'),
  7: require('./assets/audio/shadow_007.mp3'),
  8: require('./assets/audio/shadow_008.mp3'),
  9: require('./assets/audio/shadow_009.mp3'),
  10: require('./assets/audio/shadow_010.mp3'),
  11: require('./assets/audio/shadow_011.mp3'),
  12: require('./assets/audio/shadow_012.mp3'),
  13: require('./assets/audio/shadow_013.mp3'),
  14: require('./assets/audio/shadow_014.mp3'),
  15: require('./assets/audio/shadow_015.mp3'),
  16: require('./assets/audio/shadow_016.mp3'),
  17: require('./assets/audio/shadow_017.mp3'),
  18: require('./assets/audio/shadow_018.mp3'),
  19: require('./assets/audio/shadow_019.mp3'),
  20: require('./assets/audio/shadow_020.mp3'),
  21: require('./assets/audio/shadow_021.mp3'),
  22: require('./assets/audio/shadow_022.mp3'),
  23: require('./assets/audio/shadow_023.mp3'),
  24: require('./assets/audio/shadow_024.mp3'),
  25: require('./assets/audio/shadow_025.mp3'),
  26: require('./assets/audio/shadow_026.mp3'),
  27: require('./assets/audio/shadow_027.mp3'),
  28: require('./assets/audio/shadow_028.mp3'),
  29: require('./assets/audio/shadow_029.mp3'),
  30: require('./assets/audio/shadow_030.mp3'),
  31: require('./assets/audio/shadow_031.mp3'),
  32: require('./assets/audio/shadow_032.mp3'),
  33: require('./assets/audio/shadow_033.mp3'),
  34: require('./assets/audio/shadow_034.mp3'),
  35: require('./assets/audio/shadow_035.mp3'),
  36: require('./assets/audio/shadow_036.mp3'),
  37: require('./assets/audio/shadow_037.mp3'),
  38: require('./assets/audio/shadow_038.mp3'),
  39: require('./assets/audio/shadow_039.mp3'),
  40: require('./assets/audio/shadow_040.mp3'),
  41: require('./assets/audio/shadow_041.mp3'),
  42: require('./assets/audio/shadow_042.mp3'),
  43: require('./assets/audio/shadow_043.mp3'),
  44: require('./assets/audio/shadow_044.mp3'),
  45: require('./assets/audio/shadow_045.mp3'),
  46: require('./assets/audio/shadow_046.mp3'),
  47: require('./assets/audio/shadow_047.mp3'),
  48: require('./assets/audio/shadow_048.mp3'),
  49: require('./assets/audio/shadow_049.mp3'),
  50: require('./assets/audio/shadow_050.mp3'),
  51: require('./assets/audio/shadow_051.mp3'),
  52: require('./assets/audio/shadow_052.mp3'),
  53: require('./assets/audio/shadow_053.mp3'),
  54: require('./assets/audio/shadow_054.mp3'),
  55: require('./assets/audio/shadow_055.mp3'),
  56: require('./assets/audio/shadow_056.mp3'),
  57: require('./assets/audio/shadow_057.mp3'),
  58: require('./assets/audio/shadow_058.mp3'),
  59: require('./assets/audio/shadow_059.mp3'),
  60: require('./assets/audio/shadow_060.mp3'),
  61: require('./assets/audio/shadow_061.mp3'),
  62: require('./assets/audio/shadow_062.mp3'),
  63: require('./assets/audio/shadow_063.mp3'),
  64: require('./assets/audio/shadow_064.mp3'),
  65: require('./assets/audio/shadow_065.mp3'),
  66: require('./assets/audio/shadow_066.mp3'),
  67: require('./assets/audio/shadow_067.mp3'),
  68: require('./assets/audio/shadow_068.mp3'),
  69: require('./assets/audio/shadow_069.mp3'),
  70: require('./assets/audio/shadow_070.mp3'),
  71: require('./assets/audio/shadow_071.mp3'),
  72: require('./assets/audio/shadow_072.mp3'),
  73: require('./assets/audio/shadow_073.mp3'),
  74: require('./assets/audio/shadow_074.mp3'),
  75: require('./assets/audio/shadow_075.mp3'),
  76: require('./assets/audio/shadow_076.mp3'),
  77: require('./assets/audio/shadow_077.mp3'),
  78: require('./assets/audio/shadow_078.mp3'),
  79: require('./assets/audio/shadow_079.mp3'),
  80: require('./assets/audio/shadow_080.mp3'),
  81: require('./assets/audio/shadow_081.mp3'),
  82: require('./assets/audio/shadow_082.mp3'),
  83: require('./assets/audio/shadow_083.mp3'),
  84: require('./assets/audio/shadow_084.mp3'),
  85: require('./assets/audio/shadow_085.mp3'),
  86: require('./assets/audio/shadow_086.mp3'),
  87: require('./assets/audio/shadow_087.mp3'),
  88: require('./assets/audio/shadow_088.mp3'),
  89: require('./assets/audio/shadow_089.mp3'),
  90: require('./assets/audio/shadow_090.mp3'),
  91: require('./assets/audio/shadow_091.mp3'),
  92: require('./assets/audio/shadow_092.mp3'),
  93: require('./assets/audio/shadow_093.mp3'),
  94: require('./assets/audio/shadow_094.mp3'),
  95: require('./assets/audio/shadow_095.mp3'),
  96: require('./assets/audio/shadow_096.mp3'),
  97: require('./assets/audio/shadow_097.mp3'),
  98: require('./assets/audio/shadow_098.mp3'),
  99: require('./assets/audio/shadow_099.mp3'),
  100: require('./assets/audio/shadow_100.mp3'),
  101: require('./assets/audio/shadow_101.mp3'),
  102: require('./assets/audio/shadow_102.mp3'),
  103: require('./assets/audio/shadow_103.mp3'),
  104: require('./assets/audio/shadow_104.mp3'),
  105: require('./assets/audio/shadow_105.mp3'),
  106: require('./assets/audio/shadow_106.mp3'),
  107: require('./assets/audio/shadow_107.mp3'),
  108: require('./assets/audio/shadow_108.mp3'),
  109: require('./assets/audio/shadow_109.mp3'),
  110: require('./assets/audio/shadow_110.mp3'),
  111: require('./assets/audio/shadow_111.mp3'),
  112: require('./assets/audio/shadow_112.mp3'),
  113: require('./assets/audio/shadow_113.mp3'),
  114: require('./assets/audio/shadow_114.mp3'),
  115: require('./assets/audio/shadow_115.mp3'),
  116: require('./assets/audio/shadow_116.mp3'),
  117: require('./assets/audio/shadow_117.mp3'),
  118: require('./assets/audio/shadow_118.mp3'),
  119: require('./assets/audio/shadow_119.mp3'),
  120: require('./assets/audio/shadow_120.mp3'),
  121: require('./assets/audio/shadow_121.mp3'),
  122: require('./assets/audio/shadow_122.mp3'),
  123: require('./assets/audio/shadow_123.mp3'),
  124: require('./assets/audio/shadow_124.mp3'),
  125: require('./assets/audio/shadow_125.mp3'),
  126: require('./assets/audio/shadow_126.mp3'),
  127: require('./assets/audio/shadow_127.mp3'),
  128: require('./assets/audio/shadow_128.mp3'),
  129: require('./assets/audio/shadow_129.mp3'),
  130: require('./assets/audio/shadow_130.mp3'),
  131: require('./assets/audio/shadow_131.mp3'),
  132: require('./assets/audio/shadow_132.mp3'),
  133: require('./assets/audio/shadow_133.mp3'),
  134: require('./assets/audio/shadow_134.mp3'),
  135: require('./assets/audio/shadow_135.mp3'),
  136: require('./assets/audio/shadow_136.mp3'),
  137: require('./assets/audio/shadow_137.mp3'),
  138: require('./assets/audio/shadow_138.mp3'),
  139: require('./assets/audio/shadow_139.mp3'),
  140: require('./assets/audio/shadow_140.mp3'),
  141: require('./assets/audio/shadow_141.mp3'),
  142: require('./assets/audio/shadow_142.mp3'),
  143: require('./assets/audio/shadow_143.mp3'),
  144: require('./assets/audio/shadow_144.mp3'),
  145: require('./assets/audio/shadow_145.mp3'),
  146: require('./assets/audio/shadow_146.mp3'),
  147: require('./assets/audio/shadow_147.mp3'),
  148: require('./assets/audio/shadow_148.mp3'),
  149: require('./assets/audio/shadow_149.mp3'),
  150: require('./assets/audio/shadow_150.mp3'),
  151: require('./assets/audio/shadow_151.mp3'),
  152: require('./assets/audio/shadow_152.mp3'),
  153: require('./assets/audio/shadow_153.mp3'),
  154: require('./assets/audio/shadow_154.mp3'),
  155: require('./assets/audio/shadow_155.mp3'),
  156: require('./assets/audio/shadow_156.mp3'),
  157: require('./assets/audio/shadow_157.mp3'),
  158: require('./assets/audio/shadow_158.mp3'),
  159: require('./assets/audio/shadow_159.mp3'),
  160: require('./assets/audio/shadow_160.mp3'),
  161: require('./assets/audio/shadow_161.mp3'),
  162: require('./assets/audio/shadow_162.mp3'),
  163: require('./assets/audio/shadow_163.mp3'),
  164: require('./assets/audio/shadow_164.mp3'),
  165: require('./assets/audio/shadow_165.mp3'),
  166: require('./assets/audio/shadow_166.mp3'),
  167: require('./assets/audio/shadow_167.mp3'),
  168: require('./assets/audio/shadow_168.mp3'),
  169: require('./assets/audio/shadow_169.mp3'),
  170: require('./assets/audio/shadow_170.mp3'),
  171: require('./assets/audio/shadow_171.mp3'),
  172: require('./assets/audio/shadow_172.mp3'),
  173: require('./assets/audio/shadow_173.mp3'),
  174: require('./assets/audio/shadow_174.mp3'),
  175: require('./assets/audio/shadow_175.mp3'),
  176: require('./assets/audio/shadow_176.mp3'),
  177: require('./assets/audio/shadow_177.mp3'),
  178: require('./assets/audio/shadow_178.mp3'),
  179: require('./assets/audio/shadow_179.mp3'),
  180: require('./assets/audio/shadow_180.mp3'),
  181: require('./assets/audio/shadow_181.mp3'),
  182: require('./assets/audio/shadow_182.mp3'),
  183: require('./assets/audio/shadow_183.mp3'),
  184: require('./assets/audio/shadow_184.mp3'),
  185: require('./assets/audio/shadow_185.mp3'),
  186: require('./assets/audio/shadow_186.mp3'),
  187: require('./assets/audio/shadow_187.mp3'),
  188: require('./assets/audio/shadow_188.mp3'),
  189: require('./assets/audio/shadow_189.mp3'),
  190: require('./assets/audio/shadow_190.mp3'),
  191: require('./assets/audio/shadow_191.mp3'),
  192: require('./assets/audio/shadow_192.mp3'),
  193: require('./assets/audio/shadow_193.mp3'),
  194: require('./assets/audio/shadow_194.mp3'),
  195: require('./assets/audio/shadow_195.mp3'),
  196: require('./assets/audio/shadow_196.mp3'),
  197: require('./assets/audio/shadow_197.mp3'),
  198: require('./assets/audio/shadow_198.mp3'),
  199: require('./assets/audio/shadow_199.mp3'),
  200: require('./assets/audio/shadow_200.mp3'),
  201: require('./assets/audio/shadow_201.mp3'),
  202: require('./assets/audio/shadow_202.mp3'),
  203: require('./assets/audio/shadow_203.mp3'),
  204: require('./assets/audio/shadow_204.mp3'),
  205: require('./assets/audio/shadow_205.mp3'),
  206: require('./assets/audio/shadow_206.mp3'),
  207: require('./assets/audio/shadow_207.mp3'),
  208: require('./assets/audio/shadow_208.mp3'),
  209: require('./assets/audio/shadow_209.mp3'),
  210: require('./assets/audio/shadow_210.mp3'),
  211: require('./assets/audio/shadow_211.mp3'),
  212: require('./assets/audio/shadow_212.mp3'),
  213: require('./assets/audio/shadow_213.mp3'),
  214: require('./assets/audio/shadow_214.mp3'),
  215: require('./assets/audio/shadow_215.mp3'),
  216: require('./assets/audio/shadow_216.mp3'),
  217: require('./assets/audio/shadow_217.mp3'),
  218: require('./assets/audio/shadow_218.mp3'),
  219: require('./assets/audio/shadow_219.mp3'),
  220: require('./assets/audio/shadow_220.mp3'),
  221: require('./assets/audio/shadow_221.mp3'),
  222: require('./assets/audio/shadow_222.mp3'),
  223: require('./assets/audio/shadow_223.mp3'),
  224: require('./assets/audio/shadow_224.mp3'),
  225: require('./assets/audio/shadow_225.mp3'),
  226: require('./assets/audio/shadow_226.mp3'),
  227: require('./assets/audio/shadow_227.mp3'),
  228: require('./assets/audio/shadow_228.mp3'),
  229: require('./assets/audio/shadow_229.mp3'),
  230: require('./assets/audio/shadow_230.mp3'),
  231: require('./assets/audio/shadow_231.mp3'),
  232: require('./assets/audio/shadow_232.mp3'),
  233: require('./assets/audio/shadow_233.mp3'),
  234: require('./assets/audio/shadow_234.mp3'),
  235: require('./assets/audio/shadow_235.mp3'),
  236: require('./assets/audio/shadow_236.mp3'),
  237: require('./assets/audio/shadow_237.mp3'),
  238: require('./assets/audio/shadow_238.mp3'),
  239: require('./assets/audio/shadow_239.mp3'),
  240: require('./assets/audio/shadow_240.mp3'),
  241: require('./assets/audio/shadow_241.mp3'),
  242: require('./assets/audio/shadow_242.mp3'),
  243: require('./assets/audio/shadow_243.mp3'),
  244: require('./assets/audio/shadow_244.mp3'),
  245: require('./assets/audio/shadow_245.mp3'),
  246: require('./assets/audio/shadow_246.mp3'),
  247: require('./assets/audio/shadow_247.mp3'),
  248: require('./assets/audio/shadow_248.mp3'),
  249: require('./assets/audio/shadow_249.mp3'),
  250: require('./assets/audio/shadow_250.mp3'),
  251: require('./assets/audio/shadow_251.mp3'),
  252: require('./assets/audio/shadow_252.mp3'),
  253: require('./assets/audio/shadow_253.mp3'),
  254: require('./assets/audio/shadow_254.mp3'),
  255: require('./assets/audio/shadow_255.mp3'),
  256: require('./assets/audio/shadow_256.mp3'),
  257: require('./assets/audio/shadow_257.mp3'),
  258: require('./assets/audio/shadow_258.mp3'),
  259: require('./assets/audio/shadow_259.mp3'),
  260: require('./assets/audio/shadow_260.mp3'),
  261: require('./assets/audio/shadow_261.mp3'),
  262: require('./assets/audio/shadow_262.mp3'),
  263: require('./assets/audio/shadow_263.mp3'),
  264: require('./assets/audio/shadow_264.mp3'),
  265: require('./assets/audio/shadow_265.mp3'),
  266: require('./assets/audio/shadow_266.mp3'),
  267: require('./assets/audio/shadow_267.mp3'),
  268: require('./assets/audio/shadow_268.mp3'),
  269: require('./assets/audio/shadow_269.mp3'),
  270: require('./assets/audio/shadow_270.mp3'),
  271: require('./assets/audio/shadow_271.mp3'),
  272: require('./assets/audio/shadow_272.mp3'),
  273: require('./assets/audio/shadow_273.mp3'),
  274: require('./assets/audio/shadow_274.mp3'),
  275: require('./assets/audio/shadow_275.mp3'),
  276: require('./assets/audio/shadow_276.mp3'),
  277: require('./assets/audio/shadow_277.mp3'),
  278: require('./assets/audio/shadow_278.mp3'),
  279: require('./assets/audio/shadow_279.mp3'),
  280: require('./assets/audio/shadow_280.mp3'),
  281: require('./assets/audio/shadow_281.mp3'),
  282: require('./assets/audio/shadow_282.mp3'),
  283: require('./assets/audio/shadow_283.mp3'),
  284: require('./assets/audio/shadow_284.mp3'),
  285: require('./assets/audio/shadow_285.mp3'),
  286: require('./assets/audio/shadow_286.mp3'),
  287: require('./assets/audio/shadow_287.mp3'),
  288: require('./assets/audio/shadow_288.mp3'),
  289: require('./assets/audio/shadow_289.mp3'),
  290: require('./assets/audio/shadow_290.mp3'),
  291: require('./assets/audio/shadow_291.mp3'),
  292: require('./assets/audio/shadow_292.mp3'),
  293: require('./assets/audio/shadow_293.mp3'),
  294: require('./assets/audio/shadow_294.mp3'),
  295: require('./assets/audio/shadow_295.mp3'),
  296: require('./assets/audio/shadow_296.mp3'),
  297: require('./assets/audio/shadow_297.mp3'),
  298: require('./assets/audio/shadow_298.mp3'),
  299: require('./assets/audio/shadow_299.mp3'),
  300: require('./assets/audio/shadow_300.mp3'),
};

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
  const soundRef = useRef(null);

  // ── Setup Audio come podcast player ──────────────────────────────
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          // Questo è il flag chiave per comportarsi come podcast/musica
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
        });
      } catch (e) {}
    };
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // ── Permesso microfono ────────────────────────────────────────────
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

  // ── Voice recognition ─────────────────────────────────────────────
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

  const stopSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {}
      soundRef.current = null;
    }
  }, []);

  const stopAll = useCallback(() => {
    cancelledRef.current = true;
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    clearTimeout(voiceTimerRef.current);
    clearTimeout(listenTimeoutRef.current);
    clearTimeout(shadowTimerRef.current);
    try { Voice.cancel(); } catch (e) {}
    Speech.stop();
    stopSound();
    stopPulse();
  }, [stopSound]);

  const startReadCard = useCallback(() => {
    clearTimeout(revealRef.current);
    clearInterval(countdownRef.current);
    setShown(false); setCountdown(3); setVoicePhase('idle'); setVoiceFeedback(null); setHeardText('');
    countdownRef.current = setInterval(() => {
      setCountdown(p => { if (p <= 1) { clearInterval(countdownRef.current); return 0; } return p - 1; });
    }, 1000);
    revealRef.current = setTimeout(() => setShown(true), 3000);
  }, []);

  // ── Shadow mode con expo-av MP3 — comportamento podcast ──────────
  const startShadowCard = useCallback(async (sentence) => {
    if (cancelledRef.current || pausedRef.current) return;
    cancelledRef.current = false;
    clearTimeout(shadowTimerRef.current);

    const audioSource = AUDIO_FILES[sentence.id];
    if (!audioSource) {
      setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
      return;
    }

    try {
      await stopSound();
      setShadowPhase('speaking');

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, volume: 1.0 }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          if (cancelledRef.current || pausedRef.current) return;
          setShadowPhase('waiting');
          shadowTimerRef.current = setTimeout(async () => {
            if (cancelledRef.current || pausedRef.current) return;
            setShadowPhase('repeating');
            try {
              await stopSound();
              const { sound: sound2 } = await Audio.Sound.createAsync(
                audioSource,
                { shouldPlay: true, volume: 1.0 }
              );
              soundRef.current = sound2;
              sound2.setOnPlaybackStatusUpdate((s2) => {
                if (!s2.isLoaded) return;
                if (s2.didJustFinish) {
                  if (cancelledRef.current || pausedRef.current) return;
                  shadowTimerRef.current = setTimeout(() => {
                    if (cancelledRef.current || pausedRef.current) return;
                    setShadowPhase('idle');
                    setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
                  }, 2000);
                }
              });
            } catch (e) {
              setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
            }
          }, 5000);
        }
      });
    } catch (e) {
      setShadowIdx(p => p < shadowDeck.length - 1 ? p + 1 : p);
    }
  }, [shadowDeck, stopSound]);

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
