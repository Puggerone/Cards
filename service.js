import TrackPlayer, { Event } from 'react-native-track-player';

// ── PlaybackService ───────────────────────────────────────────────────────────
// Gestisce i controlli remoti: volante Bluetooth, notifica, lockscreen
// Chiamato automaticamente da RNTP in background

export async function PlaybackService() {

  // Play / Pausa dal volante o dalla notifica
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  // Traccia successiva (skip) dal volante
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext().catch(() => {});
  });

  // Traccia precedente dal volante
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious().catch(() => {});
  });

  // Stop
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // Duck audio (abbassa volume quando arriva chiamata)
  TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
    if (e.paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
}
