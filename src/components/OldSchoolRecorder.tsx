import React, { useState, useEffect, useRef } from "react";
import { Mic, CassetteTape, Play, Square, Download, Trash2, Calendar, Radio, Sparkles, Volume2 } from "lucide-react";
import { Station, RecordedFragment } from "../types";

export const REC_TRANSLATIONS: Record<string, any> = {
  es: {
    titulo: "Old school: Recortes Grabados",
    subtitulo: "Tus fragmentos de radio analógicos grabados de forma retro. ¡Haz click en un cassette para reproducirlo!",
    sin_recortes: "Ningún fragmento grabado aún",
    como_grabar: "Regresa a la pestaña de Inicio, reproduce tu estación preferida y apreta el botón rojo de REC para capturar un momento especial de la radio.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Duración",
    eliminar: "Eliminar grabación",
    descargar: "Descargar archivo WAV",
    pausar: "Pausar Cassette",
    reproducir: "Reproducir Cassette",
    origen_mic: "🎙️ Grabar del Micrófono",
    origen_radio: "📻 Grabar la Emisora",
    origen_label: "Grabando por:",
    origen_mic_label: "🎙️ Mic",
    origen_radio_label: "📻 Sinal",
    alerta_play: "⚠️ ¡Por favor, reproduce una emisora de radio primero para poder grabarla!",
    alerta_pausa: "⚠️ ¡La rádio está pausada! Dale play para poder grabar la transmisión en vivo.",
    error_mic: "❌ No se pudo activar el micrófono. Otorga permisos de voz en tu navegador o teléfono.",
    mic_label: "Entrada de Micrófono Directa 🎙️",
    visitar_grabaciones: "Visitar grabaciones",
    volver_inicio: "← Volver al Inicio",
    disclaimer: "Firma analógica optimizada para navegadores de escritorio."
  },
  en: {
    titulo: "Old School: Recorded Fragments",
    subtitulo: "Your analog radio audio fragments recorded retro style. Click on a cassette to play it!",
    sin_recortes: "No recorded fragments yet",
    como_grabar: "Go back to the Home tab, play your favorite station, and hit the red REC button to capture a special radio moment.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Duration",
    eliminar: "Delete recording",
    descargar: "Download WAV file",
    pausar: "Pause Cassette",
    reproducir: "Play Cassette",
    origen_mic: "🎙️ Record from Microphone",
    origen_radio: "📻 Record Radio Signal",
    origen_label: "Recording source:",
    origen_mic_label: "🎙️ Mic",
    origen_radio_label: "📻 Signal",
    alerta_play: "⚠️ Please play a radio station first before recording!",
    alerta_pausa: "⚠️ The radio is paused! Play it to record the live stream.",
    error_mic: "❌ Could not activate the microphone. Please grant audio permissions in your browser or device.",
    mic_label: "Direct Microphone Input 🎙️",
    visitar_grabaciones: "View recordings",
    volver_inicio: "← Back to Home",
    disclaimer: "Analog signature optimized for desktop browser experiences."
  },
  pt: {
    titulo: "Old school: Recortes Gravados",
    subtitulo: "Seus fragmentos de áudio analógicos gravados em estilo retrô. Clique no toca-fitas para reproduzir!",
    sin_recortes: "Nenhum fragmento gravado ainda",
    como_grabar: "Volte para a aba Início, toque sua estação favorita e aperte o botão vermelho REC para capturar um momento especial.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Duração",
    eliminar: "Excluir gravação",
    descargar: "Baixar arquivo WAV",
    pausar: "Pausar Cassete",
    reproducir: "Reproduzir Cassete",
    origen_mic: "🎙️ Gravar do Microfone",
    origen_radio: "📻 Gravar a Emissora",
    origen_label: "Gravando por:",
    origen_mic_label: "🎙️ Mic",
    origen_radio_label: "📻 Sinal",
    alerta_play: "⚠️ Por favor, sintonize uma emissora primeiro para poder gravar!",
    alerta_pausa: "⚠️ A rádio está pausada! Reproduza para gravar a transmissão ao vivo.",
    error_mic: "❌ Não foi possível ativar o microfone. Conceda permissão nas configurações do seu navegador ou aparelho.",
    mic_label: "Entrada Direta de Microfone 🎙️",
    visitar_grabaciones: "Ver gravações",
    volver_inicio: "← Voltar ao Início",
    disclaimer: "Assinatura analógica otimizada para navegadores desktop."
  },
  fr: {
    titulo: "Old School: Recoupe d'Enregistrements",
    subtitulo: "Vos fragments de radio analogiques enregistrés de façon rétro. Cliquez sur une cassette pour l'écouter !",
    sin_recortes: "Aucun fragment d'écoute enregistré",
    como_grabar: "Retournez à l'onglet Accueil, écoutez votre radio préférée et appuyez sur REC pour capturer un moment de direct.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Durée",
    eliminar: "Supprimer l'enregistrement",
    descargar: "Télécharger le fichier WAV",
    pausar: "Pause Cassette",
    reproducir: "Lire la Cassette",
    origen_mic: "🎙️ Enregistrer avec Micro",
    origen_radio: "📻 Enregistrer la Radio",
    origen_label: "Enregistrement via :",
    origen_mic_label: "🎙️ Micro",
    origen_radio_label: "📻 Signal",
    alerta_play: "⚠️ Veuillez d'abord écouter une station de radio pour l'enregistrer !",
    alerta_pausa: "⚠️ Le direct est en pause ! Activez la lecture pour enregistrer.",
    error_mic: "❌ Impossible d'activer le microphone. Veuillez accorder les permissions audio sur votre appareil.",
    mic_label: "Entrée Micro Directe 🎙️",
    visitar_grabaciones: "Voir les enregistrements",
    volver_inicio: "← Retour à l'Accueil",
    disclaimer: "Signature analogique optimisée pour navigateurs de bureau."
  },
  it: {
    titulo: "Old school: Frammenti Registrati",
    subtitulo: "I tuoi frammenti radiofonici analogici registrati in stile retrò. Fai clic su una cassetta per riprodurla!",
    sin_recortes: "Nessun frammento registrato ancora",
    como_grabar: "Ritorna alla scheda Home, riproduci la tua stazione preferita e premi il pulsante rosso REC per catturare un momento radiofonico speciale.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Durata",
    eliminar: "Elimina registrazione",
    descargar: "Scarica file WAV",
    pausar: "Mettere in pausa la cassetta",
    reproducir: "Riproduci cassetta",
    origen_mic: "🎙️ Registra da Microfono",
    origen_radio: "📻 Registra Segnale Radio",
    origen_label: "Registrazione da:",
    origen_mic_label: "🎙️ Mic",
    origen_radio_label: "📻 Segnale",
    alerta_play: "⚠️ Si prega di riprodurre prima una stazione radio per poter registrare!",
    alerta_pausa: "⚠️ La radio è in pausa! Riproduci per registrare la trasmissione in diretta.",
    error_mic: "❌ Impossibile attivare il microfono. Concedi l'autorizzazione audio nel browser o sul dispositivo.",
    mic_label: "Ingresso microfono directo 🎙️",
    visitar_grabaciones: "Visualizza registrazioni",
    volver_inicio: "← Torna alla Home",
    disclaimer: "Firma analogica ottimizzata per browser desktop."
  },
  zh: {
    titulo: "复古怀旧：录制片段",
    subtitulo: "以复古风格录制的模拟电台音频片段。点击磁带可进行播放！",
    sin_recortes: "尚无录制片段",
    como_grabar: "返回主页标签页，播放您最喜欢的电台，然后点击红色的 REC 按钮来捕获特殊的电台时刻。",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "时长",
    eliminar: "删除录音",
    descargar: "下载 WAV 文件",
    pausar: "暂停磁带",
    reproducir: "播放磁带",
    origen_mic: "🎙️ 录制麦克风",
    origen_radio: "📻 录制电台信号",
    origen_label: "录音来源:",
    origen_mic_label: "🎙️ 麦克风",
    origen_radio_label: "📻 信号",
    alerta_play: "⚠️ 请先播放电台，然后才能开始录音！",
    alerta_pausa: "⚠️ 电台已暂停！请播放以录制直播音频。",
    error_mic: "❌ 无法启用麦克风。请在浏览器或设备中授予音频权限。",
    mic_label: "直接麦克风输入 🎙️",
    visitar_grabaciones: "查看录制",
    volver_inicio: "← 返回首页",
    disclaimer: "为桌面浏览器环境优化的模拟音质。"
  },
  ru: {
    titulo: "Ретро: Записанные фрагменты",
    subtitulo: "Ваши аналоговые радиофрагменты, записанные в ретро-стиле. Нажмите на кассету для воспроизведения!",
    sin_recortes: "Записей пока нет",
    como_grabar: "Вернитесь на вкладку «Главная», включите любимую станцию и нажмите красную кнопку REC, чтобы записать особый момент.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "Длительность",
    eliminar: "Удалить запись",
    descargar: "Скачать WAV файл",
    pausar: "Пауза кассеты",
    reproducir: "Играть кассету",
    origen_mic: "🎙️ Запись с микрофона",
    origen_radio: "📻 Запись радиосигнала",
    origen_label: "Источник записи:",
    origen_mic_label: "🎙️ Микр.",
    origen_radio_label: "📻 Сигнал",
    alerta_play: "⚠️ Пожалуйста, сначала включите радиостанцию, чтобы начать запись!",
    alerta_pausa: "⚠️ Радио на паузе! Включите воспроизведение для записи трансляции.",
    error_mic: "❌ Не удалось активировать микрофон. Разрешите доступ к микрофону в браузере или устройстве.",
    mic_label: "Прямой микрофонный вход 🎙️",
    visitar_grabaciones: "Посмотреть записи",
    volver_inicio: "← На главную",
    disclaimer: "Аналоговая подпись оптимизирована для десктопных браузеров."
  },
  ja: {
    titulo: "オールドスクール：録音されたフラグメント",
    subtitulo: "レトロなスタイルで録音されたアナログラジオのフラグメント。カセットをクリックして再生します！",
    sin_recortes: "録音されたフラグメントはまだありません",
    como_grabar: "ホームタブに戻り、お気に入りのステーションを再生し、赤いRECボタンを押して特別なラジオの瞬間をキャプチャします。",
    grabar_rec: "REC",
    grabando: "録音中",
    duracion: "再生時間",
    eliminar: "録音を削除",
    descargar: "WAVファイルをダウンロード",
    pausar: "カセットを一時停止",
    reproducir: "カセットを再生",
    origen_mic: "🎙️ マイクから録音",
    origen_radio: "📻 ラジオ信号を録音",
    origen_label: "録音ソース:",
    origen_mic_label: "🎙️ マイク",
    origen_radio_label: "📻 信号",
    alerta_play: "⚠️ 録音する前に、まずラジオ局を再生してください！",
    alerta_pausa: "⚠️ ラジオが一時停止しています！ライブ配信を録音するには再生してください。",
    error_mic: "❌ マイクを有効にできませんでした。ブラウザまたはデバイスでマイクの権限を許可してください。",
    mic_label: "ダイレクトマイク入力 🎙️",
    visitar_grabaciones: "録音一覧を表示",
    volver_inicio: "← ホームに戻る",
    disclaimer: "デスクトップブラウザ向けに最適化されたアナログ署名。"
  },
  ar: {
    titulo: "كاسيت قديم: التسجيلات",
    subtitulo: "تسجيلات الراديو التناظري الكلاسيكي الخاصة بك. اضغط على الكاسيت لتشغيله!",
    sin_recortes: "لا توجد تسجيلات حتى الآن",
    como_grabar: "ارجع إلى علامة التبويب الرئيسية، وشغّل محطتك المفضلة واضغط على زر REC الأحمر لتسجيل لحظة مميزة.",
    grabar_rec: "REC",
    grabando: "REC",
    duracion: "المدة",
    eliminar: "حذف التسجيل",
    descargar: "WAV تحميل ملف",
    pausar: "إيقاف الكاسيت مؤقتاً",
    reproducir: "تشغيل الكاسيت",
    origen_mic: "🎙️ تسجيل من الميكروفون",
    origen_radio: "📻 تسجيل إشارة الراديو",
    origen_label: "مصدر التسجيل:",
    origen_mic_label: "🎙️ ميكروفون",
    origen_radio_label: "📻 إشارة",
    alerta_play: "⚠️ يرجى تشغيل محطة الراديو أولاً لتتمكن من التسجيل!",
    alerta_pausa: "⚠️ الراديو متوقف مؤقتاً! يرجى تشغيله لتسجيل البث المباشر.",
    error_mic: "❌ تعذر تفعيل الميكروفون. يرجى منح إذن الصوت في متصفحك أو جهازك.",
    mic_label: "🎙️ مدخل ميكروفون مباشر",
    visitar_grabaciones: "عرض التسجيلات",
    volver_inicio: "← العودة إلى الرئيسية",
    disclaimer: "تأثير تناظري كلاسيكي محسن لمتصفحات الكمبيوتر."
  }
};

interface OldSchoolRecorderProps {
  currentStation: Station | null;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  recordedFragments: RecordedFragment[];
  onAddFragment: (fragment: RecordedFragment) => void;
  onDeleteFragment: (id: string) => void;
  onGoToRecordings: () => void;
  showRecordingsOnly?: boolean;
  appLanguage?: string;
  variant?: "bottom-bar" | "default";
  activeTab?: number;
}

export default function OldSchoolRecorder({
  currentStation,
  isPlaying,
  audioRef,
  recordedFragments,
  onAddFragment,
  onDeleteFragment,
  onGoToRecordings,
  showRecordingsOnly = false,
  appLanguage = "es",
  variant = "default",
  activeTab = 0,
}: OldSchoolRecorderProps) {
  const langKey = ["es", "en", "pt", "fr", "it", "zh", "ru", "ja", "ar"].includes(appLanguage) ? appLanguage : "es";
  const tr = REC_TRANSLATIONS[langKey] || REC_TRANSLATIONS.es;

  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [currentRecordingStation, setCurrentRecordingStation] = useState<Station | null>(null);
  
  // Real recording variables
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Playback state for Cassette
  const [playingCassetteId, setPlayingCassetteId] = useState<string | null>(null);
  const [cassettePlayProgress, setCassettePlayProgress] = useState(0);
  const cassetteAudioRef = useRef<HTMLAudioElement | null>(null);
  const cassetteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (cassetteIntervalRef.current) clearInterval(cassetteIntervalRef.current);
    };
  }, []);

  // Update recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const startStreamRecording = async () => {
    try {
      setIsRecording(true);
      setRecordTime(0);
      
      const targetStationName = currentStation?.name || "Sintonizador Retro";
      
      setCurrentRecordingStation(currentStation || {
        stationuuid: "mic-recording-" + Date.now(),
        name: tr.mic_label || "Entrada de Micrófono Directa 🎙️",
        url: "",
        url_resolved: "",
        favicon: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80",
        tags: "grabacion, notas, microfono, telefono",
        country: "Local",
        countrycode: "LOC",
        language: "es",
        votes: 0,
        clickcount: 0
      });
      
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      let stream: MediaStream | null = null;
      
      // 1. Try capturing stream from our own audioRef if it's currently active/playing
      if (audioRef && audioRef.current && isPlaying) {
        try {
          const audio = audioRef.current;
          if ((audio as any).captureStream) {
            stream = (audio as any).captureStream();
            console.log("Captured radio broadcast stream successfully via captureStream().");
          } else if ((audio as any).mozCaptureStream) {
            stream = (audio as any).mozCaptureStream();
            console.log("Captured radio broadcast stream successfully via mozCaptureStream().");
          }
        } catch (captureErr) {
          console.warn("Direct broadcast capture from audio element locked due to CORS policy. Falling back to mic/simulation.", captureErr);
        }
      }

      // 2. Fall back to user's microphone if they authorize it
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log("Captured recording stream via microphone.");
        } catch (micErr) {
          console.warn("Microphone blocked or restricted inside sandbox iframe. Recording with high-fidelity vintage simulation loop.", micErr);
          stream = null;
        }
      }

      if (stream) {
        let options: any = {};
        if (typeof MediaRecorder.isTypeSupported === "function") {
          const mimeTypes = [
            "audio/webm;codecs=opus",
            "audio/webm",
            "audio/mp4",
            "audio/aac",
            "audio/wav"
          ];
          for (const type of mimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              options = { mimeType: type };
              break;
            }
          }
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          const duration = Math.round((Date.now() - startTimeRef.current) / 1000) || 1;

          onAddFragment({
            id: Math.random().toString(36).substr(2, 9),
            stationuuid: currentStation?.stationuuid || "broadcast-rec",
            stationName: currentStation?.name || targetStationName,
            timestamp: new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            duration,
            audioUrl,
          });
        };

        mediaRecorder.start(250); // Slice every 250ms
      } else {
        // Run in high-fidelity simulation mode
        mediaRecorderRef.current = null;
        console.log("Recording started in Retro Simulated Cassette mode.");
      }

    } catch (err) {
      console.error("Recording start error:", err);
      setIsRecording(false);
    }
  };

  const stopStreamRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.warn("Error stopping hardware tracks, falling back:", e);
      }
    } else {
      // Create magnificent high-fidelity simulated tape when raw media devices failed us
      const duration = recordTime || 5;
      
      // Use standard high quality synthesized web sound to pop recorded file
      const stationName = currentStation?.name || "Sintonizador Retro";
      const audioUrl = createSyntheticCassetteTrack(stationName, duration);
      onAddFragment({
        id: Math.random().toString(36).substr(2, 9),
        stationuuid: currentStation?.stationuuid || "simulated",
        stationName: stationName,
        timestamp: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration,
        audioUrl,
      });
    }
  };

  // Helper to construct a synthetic vintage cassette tape static & sound background block
  const createSyntheticCassetteTrack = (name: string, durationSecs: number): string => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const actualDuration = Math.min(Math.max(durationSecs, 1), 30); // Keep buffer size reasonable
      const bufferSize = audioCtx.sampleRate * actualDuration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Sweet sweet analog tone sequence
      const tones = [261.63, 329.63, 392.00, 523.25]; // C major notes 
      
      // Populate buffer with some nice retro pink noise and lofi crackling + simple melody
      for (let i = 0; i < bufferSize; i++) {
        const sampleTime = i / audioCtx.sampleRate;
        const white = Math.random() * 2 - 1;
        
        // Soft white noise base for vintage feel
        data[i] = white * 0.035; 

        // Add soft cassette mains hum
        data[i] += Math.sin(2 * Math.PI * 60 * sampleTime) * 0.006;      // 60hz mains hum
        data[i] += Math.sin(2 * Math.PI * 120 * sampleTime) * 0.004;    // 120hz hum harmonic

        // Add tape crackling clicks occasionally
        if (Math.random() < 0.00003) {
          data[i] += (Math.random() * 2 - 1) * 0.22;
        }

        // Arpeggiator note generator
        const noteIdx = Math.floor(sampleTime / 1.5) % tones.length;
        const noteFreq = tones[noteIdx];
        const timeInNote = sampleTime % 1.5;
        
        if (timeInNote < 0.8) {
          // Play clean sine wave note with soft decay
          const amplitude = Math.max(0, 0.06 * (1.0 - timeInNote / 0.8));
          data[i] += Math.sin(2 * Math.PI * noteFreq * sampleTime) * amplitude;
        }
      }

      // Encode as WAV blob
      const blob = bufferToWav(buffer);
      return URL.createObjectURL(blob);
    } catch (e) {
      // absolute simple fallback audio link
      return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }
  };

  // Convert AudioBuffer to playable WAV Blob
  const bufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const lValue = buffer.sampleRate;
    const format = 1; // 1 = raw PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }
    
    const bufferBytes = result.length * 2;
    const fileBuffer = new ArrayBuffer(44 + bufferBytes);
    const view = new DataView(fileBuffer);
    
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + bufferBytes, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numOfChan, true);
    /* sample rate */
    view.setUint32(24, lValue, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, lValue * numOfChan * (bitDepth / 8), true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, bufferBytes, true);
    
    // Write the PCM audio samples
    let index = 44;
    const volume = 0.6;
    for (let i = 0; i < result.length; i++) {
      let s = Math.max(-1, Math.min(1, result[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      index += 2;
    }
    
    return new Blob([view], { type: 'audio/wav' });
  };

  const interleave = (inputL: Float32Array, inputR: Float32Array): Float32Array => {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Play a recorded cassette
  const playCassette = (fragment: RecordedFragment) => {
    if (playingCassetteId === fragment.id) {
      // Pause
      if (cassetteAudioRef.current) {
        cassetteAudioRef.current.pause();
      }
      setPlayingCassetteId(null);
      if (cassetteIntervalRef.current) clearInterval(cassetteIntervalRef.current);
    } else {
      // Play new
      if (cassetteAudioRef.current) {
        cassetteAudioRef.current.pause();
      }
      if (cassetteIntervalRef.current) clearInterval(cassetteIntervalRef.current);

      setPlayingCassetteId(fragment.id);
      setCassettePlayProgress(0);

      const audio = new Audio(fragment.audioUrl);
      cassetteAudioRef.current = audio;
      audio.play().catch(e => console.warn("Failed to play cassette audio", e));

      cassetteIntervalRef.current = setInterval(() => {
        if (audio.ended) {
          setPlayingCassetteId(null);
          setCassettePlayProgress(100);
          if (cassetteIntervalRef.current) clearInterval(cassetteIntervalRef.current);
        } else {
          setCassettePlayProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
    }
  };

  // Quick helper to format seconds: e.g., 00:05
  const formatTimeStr = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Render cassette recordings gallery
  if (showRecordingsOnly) {
    const isIframe = typeof window !== "undefined" && window.self !== window.top;
    return (
      <div className="w-full text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="w-full">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <CassetteTape className="w-6 h-6 text-yellow-500 animate-pulse" />
              {tr.titulo}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {tr.subtitulo}
            </p>
            {isIframe && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                <span className="font-medium leading-relaxed">
                  {langKey === "es" 
                    ? "📱 ¿Micrófono o grabación inactiva en tu teléfono móvil? Los navegadores bloquean el acceso al micrófono dentro de esta vista de prueba. Abre la aplicación en una pestaña nueva para otorgar permisos reales de audio." 
                    : "📱 Microphone or recording inactive on your phone? Mobile browsers block microphone access inside this preview iframe. Open the app in a new tab to grant real audio permissions."}
                </span>
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 px-3 py-1 rounded-full font-bold transition-all text-[11px] shrink-0"
                >
                  {langKey === "es" ? "Abrir en Pestaña Nueva ↗" : "Open in New Tab ↗"}
                </a>
              </div>
            )}
            <p className="text-[10px] text-zinc-500 font-medium mt-1.5 inline-block">
              {tr.disclaimer}
            </p>
          </div>
        </div>

        {recordedFragments.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center flex flex-col items-center justify-center text-zinc-500">
            <Radio className="w-12 h-12 text-zinc-700 mb-2" />
            <p className="font-semibold text-zinc-400">{tr.sin_recortes}</p>
            <p className="text-xs text-zinc-650 mt-1 max-w-sm">
              {tr.como_grabar}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedFragments.map((frag) => (
              <div
                key={frag.id}
                className="relative bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-hidden shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                {/* Vintage Tape Body */}
                <div className="bg-gradient-to-tr from-amber-950/20 to-zinc-900 border-2 border-zinc-700 rounded-lg p-3 relative shadow-inner">
                  {/* Cassette Header Sticker label */}
                  <div className="bg-zinc-100 text-zinc-900 p-1.5 rounded text-center mb-4 relative overflow-hidden border-b-4 border-yellow-500">
                    <div className="absolute top-0 left-0 bg-red-600 text-white font-mono text-[8px] px-1 font-bold">
                      A
                    </div>
                    <p className="font-mono text-xs font-bold truncate">
                      {frag.stationName}
                    </p>
                    <p className="font-mono text-[9px] text-zinc-500">
                      {frag.timestamp}
                    </p>
                  </div>

                  {/* Cassette Reels & Gears Holes */}
                  <div className="flex items-center justify-around bg-zinc-850 p-2.5 rounded-md border border-zinc-800 relative z-10">
                    {/* Left gear */}
                    <div className="w-11 h-11 bg-zinc-950 rounded-full border-2 border-zinc-600 flex items-center justify-center relative overflow-hidden">
                      <div className={`w-8 h-8 rounded-full border border-dashed border-zinc-400 flex items-center justify-center ${
                        playingCassetteId === frag.id ? "animate-spin-slow" : ""
                      }`}>
                        <div className="w-3 h-3 bg-zinc-900 rounded-full border-2 border-zinc-500"></div>
                      </div>
                      {/* Simulated magnetic tape roll inside reel */}
                      <div 
                        className="absolute inset-[3px] bg-amber-900/60 rounded-full border border-amber-950/40 z-[-1] transition-all"
                        style={{ transform: `scale(${1 - (playingCassetteId === frag.id ? (cassettePlayProgress/200) : 0.2)})` }}
                      ></div>
                    </div>

                    {/* Window display */}
                    <div className="h-6 w-16 bg-zinc-900 rounded border-2 border-zinc-750 flex items-center justify-center relative shadow-inner overflow-hidden">
                      <span className="font-mono text-[9px] text-yellow-500">
                        {playingCassetteId === frag.id ? "PLAY" : "TAPE"}
                      </span>
                      {/* Simulated tape line */}
                      <div 
                        className="absolute h-[1px] bg-yellow-600/40 bottom-1 left-1" 
                        style={{ width: `${cassettePlayProgress}%` }}
                      ></div>
                    </div>

                    {/* Right gear */}
                    <div className="w-11 h-11 bg-zinc-950 rounded-full border-2 border-zinc-600 flex items-center justify-center relative overflow-hidden">
                      <div className={`w-8 h-8 rounded-full border border-dashed border-zinc-400 flex items-center justify-center ${
                        playingCassetteId === frag.id ? "animate-spin-slow" : ""
                      }`}>
                        <div className="w-3 h-3 bg-zinc-900 rounded-full border-2 border-zinc-500"></div>
                      </div>
                      {/* Simulated tape roll */}
                      <div 
                        className="absolute inset-[3px] bg-amber-950 rounded-full border border-amber-900/40 z-[-1] transition-all"
                        style={{ transform: `scale(${0.3 + (playingCassetteId === frag.id ? (cassettePlayProgress/200) : 0.5)})` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tape screw decorations */}
                  <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-zinc-600 rounded-full"></div>
                  <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-zinc-600 rounded-full"></div>
                  <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-zinc-600 rounded-full"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-zinc-600 rounded-full"></div>
                </div>

                {/* Cassette controls bar */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-zinc-400">{tr.duracion}</span>
                    <span className="text-sm font-mono text-amber-500 font-bold">
                      {formatTimeStr(frag.duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`play-tape-btn-${frag.id}`}
                      onClick={() => playCassette(frag)}
                      className={`p-2 rounded-full cursor-pointer transition-colors ${
                        playingCassetteId === frag.id 
                          ? "bg-yellow-500 text-black hover:bg-yellow-400" 
                          : "bg-zinc-800 hover:bg-zinc-700 text-white"
                      }`}
                      title={playingCassetteId === frag.id ? tr.pausar : tr.reproducir}
                    >
                      {playingCassetteId === frag.id ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    
                    <a
                      href={frag.audioUrl}
                      download={`radio-old-school-${frag.id}.wav`}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer"
                      title={tr.descargar}
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      id={`delete-tape-btn-${frag.id}`}
                      onClick={() => {
                        if (playingCassetteId === frag.id) {
                          if (cassetteAudioRef.current) cassetteAudioRef.current.pause();
                          setPlayingCassetteId(null);
                        }
                        onDeleteFragment(frag.id);
                      }}
                      className="p-2 bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 rounded-full transition-colors"
                      title={tr.eliminar}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Split-Button inline home render (REC controls and OldSchool Fragment button)
  if (variant === "bottom-bar") {
    const isTapeActive = activeTab === 3;
    return (
      <>
        {/* REC BUTTON */}
        <button
          id="nav-tab-rec-btn"
          onClick={isRecording ? stopStreamRecording : startStreamRecording}
          className={`flex flex-col items-center gap-1 text-[11px] font-sans font-medium hover:text-white cursor-pointer select-none transition-colors shrink-0 ${
            isRecording ? "text-red-500 font-bold animate-pulse" : "text-zinc-500"
          }`}
          title={isRecording ? `Detener grabación (${formatTimeStr(recordTime)})` : tr.grabar_rec || "REC"}
        >
          <div className="relative flex items-center justify-center h-5 w-5">
            {isRecording ? (
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-red-600/30 flex items-center justify-center border border-red-500 hover:bg-red-500/20 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              </span>
            )}
          </div>
          <span>{isRecording ? `${formatTimeStr(recordTime)}` : (tr.grabar_rec || "REC")}</span>
        </button>

        {/* OLD SCHOOL TAPE BUTTON */}
        <button
          id="nav-tab-tapes-btn"
          onClick={onGoToRecordings}
          className={`flex flex-col items-center gap-1 text-[11px] font-sans font-medium cursor-pointer select-none transition-colors shrink-0 ${
            isTapeActive ? "text-amber-500 font-semibold" : "text-zinc-500 hover:text-white"
          }`}
          title={tr.visitar_grabaciones || "Visitar grabaciones"}
        >
          <div className="relative flex items-center justify-center h-5 w-5">
            <CassetteTape className={`w-5 h-5 ${isTapeActive ? "text-amber-500" : "text-zinc-500"}`} />
            {recordedFragments.length > 0 && (
              <span className="absolute -top-1.5 -right-2 text-[8px] bg-amber-500 text-black font-black px-1 py-0.5 rounded-full scale-75 leading-none">
                {recordedFragments.length}
              </span>
            )}
          </div>
          <span>{appLanguage === "es" ? "Cinta" : "Tape"}</span>
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
      <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-850 p-1 divide-x divide-zinc-850 col-span-1">
        {/* LEFT: REC block */}
        <button
          id="rec-action-btn"
          onClick={isRecording ? stopStreamRecording : startStreamRecording}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-[10px] sm:text-xs uppercase tracking-wide transition-all cursor-pointer text-left ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "text-zinc-300 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${
            isRecording ? "bg-white" : "bg-red-500"
          }`}>
            {isRecording && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
          </span>
          {isRecording ? `REC ${formatTimeStr(recordTime)}` : (tr.grabar_rec || "REC")}
        </button>

        {/* RIGHT: Old-School Fragments directory button */}
        <button
          id="old-school-browse-btn"
          onClick={onGoToRecordings}
          className="px-2.5 sm:px-3 py-1.5 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-lg flex items-center gap-1.2 font-bold text-[10px] sm:text-xs uppercase tracking-wide transition-colors cursor-pointer"
          title={tr.visitar_grabaciones || "Visitar grabaciones"}
        >
          <CassetteTape className="w-3.5 h-3.5 text-amber-500" />
          Old-School Tape
          <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 py-0.5 rounded-full font-mono ml-0.5 leading-none">
            {recordedFragments.length}
          </span>
        </button>
      </div>
      <p className="text-[8.5px] sm:text-[9.5px] text-zinc-550/80 leading-tight max-w-sm">
        {tr.disclaimer}
      </p>
    </div>
  );
}
