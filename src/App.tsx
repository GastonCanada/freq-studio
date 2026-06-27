import React, { useState, useEffect, useRef, useMemo, useId } from "react";
import {
  Home as HomeIcon,
  Search,
  Languages,
  Heart,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  Radio,
  MapPin,
  Sparkles,
  Music,
  Globe,
  Sliders,
  X,
  Disc,
  FolderHeart,
  Share2,
  Settings,
  RotateCcw,
  RotateCw,
  ExternalLink,
  Loader2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Tv,
  Youtube,
  Mic,
} from "lucide-react";
import PlaylistsModal from "./components/PlaylistsModal";
import OldSchoolRecorder from "./components/OldSchoolRecorder";
import LiveTranslator from "./components/LiveTranslator";
import ShareModal from "./components/ShareModal";
import BooksPodcastsSintonizador, { getSpotifyLink } from "./components/BooksPodcastsSintonizador";
import { Station, Playlist, RecordedFragment, PlayHistoryItem } from "./types";

interface IdentifiedSong {
  songName: string;
  artist: string;
  album: string;
  releaseYear: string;
  story: string;
  spotifySearchQuery: string;
  artworkUrl?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  genre?: string;
}

function TruncatedTags({ tags, maxLength = 36 }: { tags?: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  if (!tags) return <span className="text-zinc-500">Global</span>;
  
  const cleanTags = tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (cleanTags.length === 0) return <span className="text-zinc-500">Global</span>;

  const joinedText = cleanTags.join(", ");
  
  if (joinedText.length <= maxLength) {
    return <span className="text-zinc-400">{joinedText}</span>;
  }

  const COLLAPSED_CAP = maxLength;
  const EXPANDED_CAP = 95;

  if (expanded) {
    const showText = joinedText.substring(0, EXPANDED_CAP);
    const hasMoreBeyondCap = joinedText.length > EXPANDED_CAP;
    
    return (
      <span className="text-zinc-300">
        {showText}
        {hasMoreBeyondCap && "..."}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          className="text-[#1DB954] hover:text-[#1ed760] font-bold ml-1.5 focus:outline-none cursor-pointer text-[10px] inline-block"
        >
          - menos
        </button>
      </span>
    );
  } else {
    const showText = joinedText.substring(0, COLLAPSED_CAP);
    return (
      <span className="text-zinc-400">
        {showText}...
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="text-[#1DB954] hover:text-[#1ed760] font-bold ml-1.5 focus:outline-none cursor-pointer text-[10px] inline-block"
        >
          + más
        </button>
      </span>
    );
  }
}

const StationCover = ({ 
  station, 
  className = "w-full aspect-square rounded-xl object-cover shadow-lg",
  forceSpinnerOnPlaying = false,
  isPlaying = false,
}: { 
  station: Station; 
  className?: string; 
  forceSpinnerOnPlaying?: boolean;
  isPlaying?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  // Sync state if station changes to avoid caching previous errors
  useEffect(() => {
    setImageError(false);
  }, [station.stationuuid, station.favicon]);

  const getFallbackGradient = (uuid: string) => {
    const gradients = [
      "from-rose-500/20 to-orange-500/30",
      "from-blue-600/20 to-cyan-500/30",
      "from-emerald-500/20 to-teal-500/30",
      "from-purple-600/20 to-pink-500/30",
      "from-indigo-600/20 to-violet-500/30",
      "from-amber-500/20 to-red-500/30",
      "from-fuchsia-600/20 to-pink-500/30",
      "from-sky-500/20 to-blue-700/30"
    ];
    let hash = 0;
    const str = uuid || "default-uuid";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const getBorderColor = (uuid: string) => {
    const borders = [
      "border-rose-500/30",
      "border-blue-500/30",
      "border-emerald-500/30",
      "border-purple-500/30",
      "border-indigo-500/30",
      "border-amber-500/30",
      "border-fuchsia-500/30",
      "border-sky-500/30"
    ];
    let hash = 0;
    const str = uuid || "default-uuid";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % borders.length;
    return borders[index];
  };

  const getInitials = (name: string) => {
    if (!name) return "FM";
    const clean = name.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || "FM";
  };

  const initials = getInitials(station.name);
  const fallbackBgGradient = getFallbackGradient(station.stationuuid);
  const borderCol = getBorderColor(station.stationuuid);

  if (station.favicon && !imageError) {
    return (
      <img
        src={station.favicon}
        alt={station.name}
        onError={() => setImageError(true)}
        className={`${className} bg-zinc-900 border border-zinc-800/80`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`relative aspect-square w-full rounded-xl bg-zinc-950 border ${borderCol} flex flex-col justify-between p-3 overflow-hidden shadow-lg group select-none`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackBgGradient} opacity-40 mix-blend-screen transition-transform duration-700 group-hover:scale-110`} />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />

      {/* Rotating Vinyl Overlay */}
      <div className={`absolute right-[-15%] bottom-[-15%] w-3/5 h-3/5 rounded-full border border-white/5 bg-zinc-900/60 flex items-center justify-center opacity-30 shadow-inner group-hover:rotate-90 duration-1000 transition-all ${isPlaying && forceSpinnerOnPlaying ? "animate-spin-slow" : ""}`}>
        <div className="w-4/5 h-4/5 rounded-full border border-white/5 flex items-center justify-center">
          <div className="w-[1px] h-[1px] bg-white rounded-full" />
        </div>
      </div>

      {/* Card Header */}
      <div className="flex items-center justify-between z-10 w-full relative">
        <span className="flex items-center gap-1 bg-white/5 border border-white/10 text-white/80 text-[8px] tracking-wider font-extrabold uppercase px-1.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
          FM LIVE
        </span>
        <Radio className="w-3.5 h-3.5 text-zinc-500 opacity-70 group-hover:text-[#1DB954] group-hover:scale-110 transition-all duration-300" />
      </div>

      {/* Monogram / Logo Center */}
      <div className="flex flex-col items-center justify-center z-10 flex-grow relative py-2 mb-1">
        <span className="text-xl sm:text-2xl font-black tracking-tighter text-white select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter opacity-90 font-display">
          {initials}
        </span>
      </div>

      {/* Card Footer */}
      <div className="z-10 w-full text-left relative mt-auto border-t border-white/5 pt-1.5">
        <p className="text-[9px] font-bold text-zinc-400 leading-none truncate uppercase tracking-widest font-mono">
          {station.country || "Mundo"}
        </p>
      </div>
    </div>
  );
};

// App i18n Translation Dictionary table
const LANGUAGES = {
  es: {
    inicio: "Inicio",
    buscar: "Buscar",
    traducir: "Traducir",
    grabaciones: "Grabaciones",
    senal_en_vivo: "Señal en Vivo",
    senal_caida: "Señal caída temporalmente.",
    sintonizando_senal: "Sintonizando...",
    sintonizando: "Sintonizando señales mundiales...",
    recomienda: "Estaciones Recomendadas para Ti",
    recientes: "Recientemente Incorporadas",
    historial: "Historial de Escucha",
    favoritos: "Tus Radios Favoritas",
    buscar_placeholder: "Buscar radios por nombre o etiqueta...",
    sin_historial: "Las emisoras que escuches se guardarán automáticamente aquí.",
    sin_favoritos: "¿Te gusta una radio? Presiona el corazón en el reproductor para agregarla a tus favoritos.",
    volumen: "Volumen",
    silenciar: "Silenciar",
    compartir: "Compartir",
    playlist: "Agregar a mi Playlist",
    configurar_idioma: "Idioma de la App",
    idioma_cambiado: "Idioma de la aplicación cambiado con éxito",
    premium: "Premium",
    inspirado: "",
    usuario_premium: "",
    desconectado: "Modo Offline / Sintonizador apagar",
    borrar_historial: "Borrar Historial",
    crear_playlist: "Crear Nueva Playlist",
    reproduciendo: "Escuchando en Vivo",
    paises: "Lista de Países",
    generos: "Explorar todos los géneros y estilos",
    buscador_podcasts: "Buscador Global de Podcasts iTunes",
    buscador_podcasts_sub: "Busca millones de episodios en todo el mundo. Teclea palabras clave como Dolina, Rock, Blues o un tema, y sintoniza al instante.",
    buscador_input_placeholder: "Buscar por título, autor, género (ej. Dolina, Blues, Noticias)...",
    buscar_btn: "Buscar",
    buscando_btn: "Buscando...",
    categoria: "Categoría",
    noticias_charlas: "Noticias y Charlas",
    geografia: "Geografía",
    directorio_az: "Directorio A - Z",
    directorio_az_completo: "Directorio de Países de la A a la Z",
    musica: "Música",
    estilos_directos: "Estilos y Directos",
    podcast: "Podcast",
    proximidad: "Proximidad",
    cerca_mio: "Cerca Mío",
    sintonia_local: "Sintonía Local",
    estilo: "Estilo",
    explorar_generos_estilos: "Explorar todos los géneros / Estilos",
    armando_playlists: "Armando mis Playlists",
    recientemente_escuchadas: "Recientemente Escuchadas",
    volver_inicio: "← Volver al Inicio",
    resultados_busqueda: "Resultados de Búsqueda",
    filtrando_pais: "Filtrando por código de país: ",
    ningun_resultado: "Ningún resultado para tu búsqueda. Prueba con otros criterios de búsqueda.",
    buscar_mas: "Buscar +",
    buscando_mas: "Buscando más...",
    identificar_cancion: "Identificar canción",
    identificando: "Escuchando onda sonora...",
    analizando_huella: "Analizando huella acústica con Gemini IA...",
    escuchar_spotify: "Escuchar en Spotify",
    cancion_identificada: "Canción Identificada",
    album: "Álbum",
    ano: "Año",
    historia_cancion: "Historia / Curiosidades",
    cerrar: "Cerrar",
    no_signal: "No hay ninguna radio activa. ¡Sintoniza una estación primero!",
    mas_escuchadas_titulo: "Estaciones más Escuchadas del Mundo",
    mas_escuchadas_sub: "Sintoniza las leyendas radiales globales con diseño premium y portadas de alta definición.",
    reconocimiento_titulo: "Sintonizadores con Reconocimiento en Vivo",
    reconocimiento_sub: "Emisoras equipadas con metadatos ICY continuas en tiempo real. ¡Activa el Traductor IA para escanear sus canciones!",
    porque_escuchaste: "Porque escuchaste ",
    te_podria_gustar: ", te podría gustar:",
    como_elegiste: "Como elegiste ",
    te_recomendamos: ", te recomendamos:",
  },
  en: {
    inicio: "Home",
    buscar: "Search",
    traducir: "Translate",
    grabaciones: "Recordings",
    senal_en_vivo: "Live Stream",
    senal_caida: "Signal currently offline.",
    sintonizando_senal: "Tuning in...",
    sintonizando: "Tuning in to worldwide signals...",
    recomienda: "Recommended Stations for You",
    recientes: "Recently Added Stations",
    historial: "Listening History",
    favoritos: "Your Favorite Radios",
    buscar_placeholder: "Search radios by name or tag...",
    sin_historial: "The stations you listen to will be automatically saved here.",
    sin_favoritos: "Do you like a radio? Press the heart in the player to save it to your favorites.",
    volumen: "Volume",
    silenciar: "Mute",
    compartir: "Share",
    playlist: "Add to Playlist",
    configurar_idioma: "App Language",
    idioma_cambiado: "Application language changed successfully",
    premium: "Premium",
    inspirado: "",
    usuario_premium: "",
    desconectado: "Offline Mode / Turn tuner off",
    borrar_historial: "Clear History",
    crear_playlist: "Create New Playlist",
    reproduciendo: "Listening Live",
    paises: "Countries List",
    generos: "Explore All Genres and Styles",
    buscador_podcasts: "Global iTunes Podcasts Search",
    buscador_podcasts_sub: "Search millions of episodes worldwide. Type keywords like Dolina, Rock, Blues or any topic, and tune in instantly.",
    buscador_input_placeholder: "Search by title, author, genre (e.g., Dolina, Blues, News)...",
    buscar_btn: "Search",
    buscando_btn: "Searching...",
    categoria: "Category",
    noticias_charlas: "News and Talks",
    geografia: "Geography",
    directorio_az: "A - Z Directory",
    directorio_az_completo: "A to Z Countries Directory",
    musica: "Music",
    estilos_directos: "Styles and Live",
    podcast: "Podcast",
    proximidad: "Proximity",
    cerca_mio: "Near Me",
    sintonia_local: "Local Tuning",
    estilo: "Style",
    explorar_generos_estilos: "Explore all genres / Styles",
    armando_playlists: "Assembling my Playlists",
    recientemente_escuchadas: "Recently Played/Listened",
    volver_inicio: "← Back to Home",
    resultados_busqueda: "Search Results",
    filtrando_pais: "Filtering by country code: ",
    ningun_resultado: "No results for your search. Try specifying other keywords.",
    buscar_mas: "Search +",
    buscando_mas: "Searching more...",
    identificar_cancion: "Identify song",
    identificando: "Listening to soundwave...",
    analizando_huella: "Analyzing footprint with Gemini AI...",
    escuchar_spotify: "Listen on Spotify",
    cancion_identificada: "Song Identified",
    album: "Album",
    ano: "Year",
    historia_cancion: "Song History / Trivia",
    cerrar: "Close",
    no_signal: "No active radio playing. Tune in to a station first!",
    mas_escuchadas_titulo: "Most Popular Radio Stations Worldwide",
    mas_escuchadas_sub: "Tune in to global radio legends with premium audio and high-definition cover designs.",
    reconocimiento_titulo: "Real-Time Song Recognition Streams",
    reconocimiento_sub: "Top-tier stations carrying live ICY metadata. Connect our AI Translator to scan and fetch tracks!",
    porque_escuchaste: "Because you listened to ",
    te_podria_gustar: ", you might like:",
    como_elegiste: "Since you chose ",
    te_recomendamos: ", we recommend:",
  },
  pt: {
    inicio: "Início",
    buscar: "Buscar",
    traducir: "Traduzir",
    grabaciones: "Gravações",
    senal_en_vivo: "Sinal ao Vivo",
    senal_caida: "Sinal temporariamente fora do ar.",
    sintonizando_senal: "Sintonizando...",
    sintonizando: "Sintonizando sinais mundiais...",
    recomienda: "Estações Recomendadas para Você",
    recientes: "Adicionadas Recentemente",
    historial: "Histórico de Escuta",
    favoritos: "Suas Rádios Favoritas",
    buscar_placeholder: "Buscar rádios por nome ou etiqueta...",
    sin_historial: "As emissoras que você ouvir serão salvas automaticamente aqui.",
    sin_favoritos: "Gostou de uma rádio? Pressione o coração no player para adicioná-la aos favoritos.",
    volumen: "Volume",
    silenciar: "Mutar",
    compartir: "Compartilhar",
    playlist: "Adicionar à Playlist",
    configurar_idioma: "Idioma do App",
    idioma_cambiado: "Idioma do aplicativo alterado com sucesso",
    premium: "Premium",
    inspirado: "",
    usuario_premium: "",
    desconectado: "Modo Offline / Desligar sintonizador",
    borrar_historial: "Limpar Histórico",
    crear_playlist: "Criar Nova Playlist",
    reproduciendo: "Ouvindo ao Vivo",
    paises: "Lista de Países",
    generos: "Explorar todos os gêneros e estilos",
    buscador_podcasts: "Buscador Global de Podcasts iTunes",
    buscador_podcasts_sub: "Pesquise milhões de episódios em todo o mundo. Digite palavras-chave como Dolina, Rock, Blues ou qualquer assunto, e sintonize instantaneamente.",
    buscador_input_placeholder: "Buscar por título, autor, gênero (ex. Dolina, Blues, Notícias)...",
    buscar_btn: "Buscar",
    buscando_btn: "Buscando...",
    categoria: "Categoria",
    noticias_charlas: "Notícias e Palestras",
    geografia: "Geografia",
    directorio_az: "Diretório A - Z",
    directorio_az_completo: "Diretório de Países de A a Z",
    musica: "Música",
    estilos_directos: "Estilos e Ao Vivo",
    podcast: "Podcast",
    proximidad: "Proximidade",
    cerca_mio: "Perto de Mim",
    sintonia_local: "Sintonia Local",
    estilo: "Estilo",
    explorar_generos_estilos: "Explorar todos os gêneros / Estilos",
    armando_playlists: "Montando minhas Playlists",
    recientemente_escuchadas: "Ouvidas Recentemente",
    volver_inicio: "← Voltar ao Início",
    resultados_busqueda: "Resultados da Busca",
    filtrando_pais: "Filtrando por código de país: ",
    ningun_resultado: "Nenhum resultado para a sua busca. Tente com outros critérios.",
    buscar_mas: "Buscar +",
    buscando_mas: "Buscando mais...",
    identificar_cancion: "Identificar música",
    identificando: "Escutando onda sonora...",
    analizando_huella: "Analisando pegada com Gemini IA...",
    escuchar_spotify: "Ouvir no Spotify",
    cancion_identificada: "Música Identificada",
    album: "Álbum",
    ano: "Ano",
    historia_cancion: "História / Curiosidades",
    cerrar: "Fechar",
    no_signal: "Não há nenhuma rádio tocando. Sintonize uma estação primeiro!",
    mas_escuchadas_titulo: "Rádios mais Ouvidas do Mundo",
    mas_escuchadas_sub: "Sintonize lendas do rádio global com capas de alto impacto estilo Spotify.",
    reconocimiento_titulo: "Emissoras com Reconhecimento em Tempo Real",
    reconocimiento_sub: "Estações dotadas de metadados ICY contínuos. Ative o Tradutor IA para capturar suas faixas!",
    porque_escuchaste: "Porque você ouviu ",
    te_podria_gustar: ", você pode gostar:",
    como_elegiste: "Como você escolheu ",
    te_recomendamos: ", recomendamos:",
  },
  fr: {
    inicio: "Accueil",
    buscar: "Rechercher",
    traducir: "Traduire",
    grabaciones: "Enregistrements",
    senal_en_vivo: "Direct / Stream",
    senal_caida: "Signal temporairement indisponible.",
    sintonizando_senal: "Ajuste en cours...",
    sintonizando: "Syntonisation des signaux mondiaux...",
    recomienda: "Stations Recommandées pour Vous",
    recientes: "Récemment Ajoutées",
    historial: "Historique d'Écoute",
    favoritos: "Vos Radios Préférées",
    buscar_placeholder: "Rechercher des radios par nom ou tag...",
    sin_historial: "Les stations que vous écoutez seront automatiquement enregistrées ici.",
    sin_favoritos: "Vous aimez une radio ? Appuyez sur le cœur du lecteur pour l'ajouter à vos favoris.",
    volumen: "Volume",
    silenciar: "Muet",
    compartir: "Partager",
    playlist: "Ajouter à la Playlist",
    configurar_idioma: "Langue de l'app",
    idioma_cambiado: "Langue de l'application modifiée avec succès",
    premium: "Premium",
    inspirado: "",
    usuario_premium: "",
    desconectado: "Mode Hors-ligne / Éteindre le tuner",
    borrar_historial: "Effacer l'historique",
    crear_playlist: "Créer une Playlist",
    reproduciendo: "Écoute en Direct",
    paises: "Liste des Pays",
    generos: "Explorer tous les genres et styles",
    buscador_podcasts: "Recherche Globale de Podcasts iTunes",
    buscador_podcasts_sub: "Recherchez parmi des millions d'épisodes dans le monde entier. Tapez des mots-clés comme Dolina, Rock, Blues ou n'importe quel sujet, et écoutez instantanément.",
    buscador_input_placeholder: "Rechercher par titre, auteur, genre (ex. Dolina, Blues, Actualités)...",
    buscar_btn: "Rechercher",
    buscando_btn: "Recherche...",
    categoria: "Catégorie",
    noticias_charlas: "Actualités et Discussions",
    geografia: "Géographie",
    directorio_az: "Annuaire A - Z",
    directorio_az_completo: "Annuaire des Pays de A à Z",
    musica: "Musique",
    estilos_directos: "Styles et Live",
    podcast: "Podcast",
    proximidad: "Proximité",
    cerca_mio: "Près de Moi",
    sintonia_local: "Syntonisation Locale",
    estilo: "Style",
    explorar_generos_estilos: "Explorer tous les genres et styles",
    armando_playlists: "Organiser mes Playlists",
    recientemente_escuchadas: "Récemment Écoutées",
    volver_inicio: "← Retour à l'Accueil",
    resultados_busqueda: "Résultats de Recherche",
    filtrando_pais: "Filtrage par code de pays: ",
    ningun_resultado: "Aucun résultat pour votre recherche. Essayez d'autres critères.",
    buscar_mas: "Rechercher +",
    buscando_mas: "Recherche en cours...",
    identificar_cancion: "Identifier la chanson",
    identificando: "Écoute de l'onde sonore...",
    analizando_huella: "Analyse acoustique avec Gemini IA...",
    escuchar_spotify: "Écouter sur Spotify",
    cancion_identificada: "Chanson Identifiée",
    album: "Album",
    ano: "Année",
    historia_cancion: "Histoire / Anecdotes",
    cerrar: "Fermer",
    no_signal: "Aucune radio active pour identifier. Écoutez une station d'abord !",
    mas_escuchadas_titulo: "Radios les plus Écoutées du Monde",
    mas_escuchadas_sub: "Écoutez les légendes mondiales avec des pochettes exclusives haute définition.",
    reconocimiento_titulo: "Stations avec Reconnaissance de Titres",
    reconocimiento_sub: "Émissions équipées de métadonnées ICY. Activez le Traducteur IA pour capturer leurs chansons !",
    porque_escuchaste: "Parce que vous avez écouté ",
    te_podria_gustar: ", vous pourriez aimer :",
    como_elegiste: "Comme vous avez choisi ",
    te_recomendamos: ", nous vous recommandons :",
  },
  zh: {
    inicio: "首页",
    buscar: "搜索",
    traducir: "翻译",
    grabaciones: "录音",
    senal_en_vivo: "直播信号",
    senal_caida: "信号暂时掉线。",
    sintonizando_senal: "正在调谐中...",
    sintonizando: "正在载入全球电台...",
    recomienda: "为你推荐的电台",
    recientes: "最近新增",
    historial: "播放历史列表",
    favoritos: "我的最爱电台",
    buscar_placeholder: "通过电台名称或标签搜索...",
    sin_historial: "您听过的电台将自动保存在这里。",
    sin_favoritos: "喜欢该电台吗？点击播放器上的心形图标将其添加到收藏中。",
    volumen: "音量",
    silenciar: "静音",
    compartir: "分享",
    playlist: "添加到我的播放列表",
    configurar_idioma: "应用语言设置",
    idioma_cambiado: "应用程序语言更改成功",
    premium: "高级会员",
    inspirado: "受 Spotify 启发",
    usuario_premium: "尊贵用户",
    desconectado: "离线模式 / 关闭解调器",
    borrar_historial: "清除历史记录",
    crear_playlist: "创建新播放列表",
    reproduciendo: "正在直播",
    paises: "国家列表",
    generos: "探索所有流派与风格",
    buscador_podcasts: "iTunes 全球播客搜索",
    buscador_podcasts_sub: "搜索全球数百万个播客单集。输入 Dolina、摇滚、蓝调或任何主题，即可立即播放。",
    buscador_input_placeholder: "通过标题、作者、类型搜索（如 Dolina、蓝调、新闻）...",
    buscar_btn: "搜索",
    buscando_btn: "搜索中...",
    categoria: "分类",
    noticias_charlas: "新闻与脱口秀",
    geografia: "地理位置",
    directorio_az: "A - Z 索引",
    directorio_az_completo: "A 到 Z 国家电台目录",
    musica: "音乐",
    estilos_directos: "直达样式与电台",
    podcast: "播客",
    proximidad: "附近电台",
    cerca_mio: "我身边的电台",
    sintonia_local: "本地频道",
    estilo: "风格",
    explorar_generos_estilos: "浏览所有流派和风格",
    armando_playlists: "整理我的播放列表",
    recientemente_escuchadas: "最近收听",
    volver_inicio: "← 返回主页",
    resultados_busqueda: "搜索结果",
    filtrando_pais: "按国家代码过滤: ",
    ningun_resultado: "未找到符合您搜索目标的电台。请尝试其他搜索词。",
    buscar_mas: "搜索更多",
    buscando_mas: "正在搜索更多...",
    identificar_cancion: "识别歌曲名称",
    identificando: "正在聆听声波...",
    analizando_huella: "正在使用 Gemini AI 分析音频指纹...",
    escuchar_spotify: "在 Spotify 上收听",
    cancion_identificada: "歌曲已成功识别",
    album: "专辑",
    ano: "年份",
    historia_cancion: "歌曲背景故事 / 趣闻",
    cerrar: "关闭",
    no_signal: "没有正在播放的电台。请先选择一个频道！",
    mas_escuchadas_titulo: "全球最受欢迎高收听电台",
    mas_escuchadas_sub: "收听全球广播传奇，提供高水平音质与高清封面设计。",
    reconocimiento_titulo: "实时支持歌曲识别的频道",
    reconocimiento_sub: "这些电台配备持续的实时 ICY 元数据。启动 AI 翻译器来扫描和捕捉曲目！",
    porque_escuchaste: "因为你听过 ",
    te_podria_gustar: "，你可能也会喜欢：",
    como_elegiste: "因为你选择了 ",
    te_recomendamos: "，我们为你推荐：",
  },
  ru: {
    inicio: "Главная",
    buscar: "Поиск",
    traducir: "Перевести",
    grabaciones: "Записи",
    senal_en_vivo: "Прямой эфир",
    senal_caida: "Сигнал временно отключен.",
    sintonizando_senal: "Настройка...",
    sintonizando: "Настройка на мировые сигналы...",
    recomienda: "Рекомендуемые станции для вас",
    recientes: "Недавно добавленные",
    historial: "История прослушивания",
    favoritos: "Ваши любимые радиостанции",
    buscar_placeholder: "Поиск радио по названию или тегу...",
    sin_historial: "Слушаемые вами станции будут автоматически сохраняться здесь.",
    sin_favoritos: "Нравится радио? Нажмите сердечко в плеере, чтобы добавить его в избранное.",
    volumen: "Громкость",
    silenciar: "Без звука",
    compartir: "Поделиться",
    playlist: "Добавить в плейлист",
    configurar_idioma: "Язык приложения",
    idioma_cambiado: "Язык приложения успешно изменен",
    premium: "Премиум",
    inspirado: "Вдохновлено Spotify",
    usuario_premium: "Премиум-пользователь",
    desconectado: "Офлайн-режим / Выключить тюнер",
    borrar_historial: "Очистить историю",
    crear_playlist: "Создать новый плейлист",
    reproduciendo: "Сейчас в эфире",
    paises: "Список стран",
    generos: "Обзор всех жанров и стилей",
    buscador_podcasts: "Глобальный поиск подкастов iTunes",
    buscador_podcasts_sub: "Ищите среди миллионов эпизодов по всему миру. Введите ключевые слова, такие как Dolina, Rock, Blues или любую тему, и слушайте мгновенно.",
    buscador_input_placeholder: "Поиск по названию, автору, жанру (например, Rock, Blues, Новости)...",
    buscar_btn: "Найти",
    buscando_btn: "Поиск...",
    categoria: "Категория",
    noticias_charlas: "Новости и разговоры",
    geografia: "География",
    directorio_az: "Каталог А - Я",
    directorio_az_completo: "Каталог стран от А до Я",
    musica: "Музыка",
    estilos_directos: "Стили и трансляции",
    podcast: "Подкаст",
    proximidad: "Рядом со мной",
    cerca_mio: "Рядом со мной",
    sintonia_local: "Местная настройка",
    estilo: "Стиль",
    explorar_generos_estilos: "Посмотреть все жанры / Стили",
    armando_playlists: "Мои плейлисты",
    recientemente_escuchadas: "Недавно прослушанные",
    volver_inicio: "← На главную",
    resultados_busqueda: "Результаты поиска",
    filtrando_pais: "Фильтрация по коду страны: ",
    ningun_resultado: "По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.",
    buscar_mas: "Найти еще",
    buscando_mas: "Поиск...",
    identificar_cancion: "Определить трек",
    identificando: "Прослушивание звуковой волны...",
    analizando_huella: "Анализ звукового отпечатка с помощью Gemini AI...",
    escuchar_spotify: "Слушать на Spotify",
    cancion_identificada: "Песня распознана",
    album: "Альбом",
    ano: "Год",
    historia_cancion: "История песни / Факты",
    cerrar: "Закрыть",
    no_signal: "Нет активного вещания. Сначала настройтесь на станцию!",
    mas_escuchadas_titulo: "Самые популярные радиостанции мира",
    mas_escuchadas_sub: "Слушайте легендарные вещательные станции с премиум качеством звука и HD обложками.",
    reconocimiento_titulo: "Станции с распознаванием треков в реальном времени",
    reconocimiento_sub: "Вещатели, укомплектованные непрерывными метаданными ICY в эфире. Включите AI-переводчик для сканирования песен!",
    porque_escuchaste: "Так как вы слушали ",
    te_podria_gustar: ", вам может понравиться:",
    como_elegiste: "Так как вы выбрали ",
    te_recomendamos: ", рекомендуем:",
  },
};

const SIMULATED_TRACKS: Record<string, string[]> = {
  rock: [
    "AC/DC - Back In Black",
    "Queen - Bohemian Rhapsody",
    "Guns N' Roses - Sweet Child O' Mine",
    "Pink Floyd - Another Brick In the Wall",
    "Nirvana - Smells Like Teen Spirit",
    "Soda Stereo - De Música Ligera",
    "The Rolling Stones - Paint It Black"
  ],
  pop: [
    "The Weeknd - Blinding Lights",
    "Dua Lipa - Levitating",
    "Harry Styles - As It Was",
    "Michael Jackson - Billie Jean",
    "Taylor Swift - Anti-Hero",
    "Billie Eilish - Bad Guy",
    "Coldplay - Viva La Vida"
  ],
  jazz: [
    "Miles Davis - So What",
    "John Coltrane - My Favorite Things",
    "Dave Brubeck - Take Five",
    "Louis Armstrong - What A Wonderful World",
    "Ella Fitzgerald - Summertime"
  ],
  salsa: [
    "Hector Lavoe - El Cantante",
    "Marc Anthony - Vivir Mi Vida",
    "Celia Cruz - La Vida Es Un Carnaval",
    "Joe Arroyo - Rebelión",
    "Rubén Blades - Pedro Navaja"
  ],
  blues: [
    "B.B. King - The Thrill Is Gone",
    "Muddy Waters - Hoochie Coochie Man",
    "Stevie Ray Vaughan - Pride and Joy",
    "Robert Johnson - Crossroads",
    "Etta James - At Last"
  ],
  reggae: [
    "Bob Marley - No Woman, No Cry",
    "Bob Marley - Three Little Birds",
    "Inner Circle - Sweat (A La La La La Long)",
    "UB40 - Red Red Wine",
    "Peter Tosh - Legalize It"
  ],
  news: [
    "BBC World Service - Live Global News Bulletin",
    "CNN Radio - Breaking News Reports",
    "NPR News - Morning Edition Update",
    "RFI Monde - Dernières Nouvelles à l'écoute"
  ]
};

const MOODS_DATA = [
  {
    id: "euforia",
    emoji: "🔥",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
    title: {
      es: "Euforia (Rock, Metal)",
      en: "Euphoria (Rock, Metal)",
      pt: "Euforia (Rock, Metal)",
      fr: "Euphorie (Rock, Metal)",
      zh: "狂欢亢奋 (摇滚, 金属)",
      ru: "Эйфория (Рок, Метал)"
    },
    desc: {
      es: "Adrenalina pura y distorsión para liberar toda tu energía.",
      en: "Pure adrenaline and distortion to release all your energy.",
      pt: "Adrenalina pura e distorção para liberar toda a sua energia.",
      fr: "Adrénaline pure et distorsion pour libérer toute votre énergie.",
      zh: "释放所有活力与激情的纯粹摇滚与金属音乐。",
      ru: "Чистый адреналин и дисторшн, чтобы выплеснуть всю энергию."
    }
  },
  {
    id: "zen",
    emoji: "🧘",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    title: {
      es: "Zona Zen (Relax, Calma)",
      en: "Zen Zone (Relax, Calm)",
      pt: "Zona Zen (Relax, Calma)",
      fr: "Zone Zen (Relax, Calme)",
      zh: "禅意空间 (放松, 静心)",
      ru: "Зона Дзен (Релакс, Спокойствие)"
    },
    desc: {
      es: "Melodías suaves, ambient y chillout para desconectar y pausar tu mente.",
      en: "Soft melodies, ambient and chillout to disconnect and pause your mind.",
      pt: "Melodias suaves, ambient e chillout para desconectar e acalmar sua mente.",
      fr: "Mélodies douces, ambient et chillout pour déconnecter et apaiser l'esprit.",
      zh: "舒缓的旋律、氛围乐与放克电音，帮您放松并静下心来。",
      ru: "Мягкие мелодии, эмбиент и чиллаут, чтобы отключить заботы и успокоить разум."
    }
  },
  {
    id: "azul",
    emoji: "🎷",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    title: {
      es: "Melancólicamente azul (Blues)",
      en: "Melancholy Blue (Blues)",
      pt: "Melancolicamente azul (Blues)",
      fr: "Mélancolie bleue (Blues)",
      zh: "忧郁深蓝 (蓝调)",
      ru: "Меланхоличный синий (Блюз)"
    },
    desc: {
      es: "Acordes melancólicos de guitarra que tocan el fondo del alma.",
      en: "Melancholic guitar chords that touch the bottom of your soul.",
      pt: "Acordes melancólicos de guitarra que tocam o fundo da alma.",
      fr: "Des accords de guitare mélancoliques qui touchent le fond de l'âme.",
      zh: "直击灵魂深处的忧郁吉他旋律与蓝调音符。",
      ru: "Меланхоличные гитарные аккорды, затрагивающие самые глубины души."
    }
  },
  {
    id: "latina",
    emoji: "💃",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80",
    title: {
      es: "Moviendo el cuerpo (Energía Latina)",
      en: "Shaking the Body (Latin Energy)",
      pt: "Movendo o corpo (Energia Latina)",
      fr: "Dynamiser le corps (Énergie Latine)",
      zh: "舞动奇迹 (拉丁能量)",
      ru: "В движении (Латиноамериканская энергия)"
    },
    desc: {
      es: "Ritmo explosivo caribeño con la mejor salsa, merengue y cumbia para bailar.",
      en: "Explosive Caribbean rhythm featuring top salsa, merengue, and cumbia to make you dance.",
      pt: "Ritmo caribenho explosivo com o melhor da salsa, merengue e cumbia para dançar.",
      fr: "Rythme caribéen explosif avec la meilleure salsa, merengue et cumbia pour danser.",
      zh: "热烈动感的加勒比萨尔萨、梅伦格与库姆比亚舞曲，带您翩翩起舞。",
      ru: "Взрывной карибский ритм с лучшей сальсой, меренге и кумбией для танцев."
    }
  },
  {
    id: "lluvia",
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&w=600&q=80",
    title: {
      es: "Días de lluvia con café en mano (Jazz)",
      en: "Rainy Days with Coffee (Jazz)",
      pt: "Dias de chuva com café na mão (Jazz)",
      fr: "Jours de pluie avec café (Jazz)",
      zh: "雨天咖啡馆 (爵士乐)",
      ru: "Дождливые дни с кофе в руке (Джаз)"
    },
    desc: {
      es: "El calor sofisticado del jazz tradicional y smooth jazz para tardes acogedoras.",
      en: "The sophisticated warmth of traditional and smooth jazz for cozy afternoons.",
      pt: "O calor sofisticado do jazz tradicional e smooth jazz para tardes aconchegantes.",
      fr: "La chaleur sophistiquée du jazz traditionnel et smooth jazz pour des après-midis chaleureux.",
      zh: "经典爵士与轻爵士的精致温暖，陪伴您享受惬意温馨的午后时光。",
      ru: "Изысканное тепло традиционного и гладкого джаза для уютных вечеров."
    }
  }
];

const CURIOUS_SECTION_I18N = {
  es: {
    title: "Radios del Mundo para Mentes Curiosas",
    desc: "¡Sintoniza las charlas más brillantes, humor inteligente, debates vibrantes del pensamiento y psicología profunda del planeta! Radio del más alto nivel para mentes curiosas.",
    top10Title: "⭐ El Top 10 Alrededor del Mundo",
    allCountriesTitle: "🌍 Explorar por Países",
    connecting: "Sintonizando señal satelital...",
    notFound: "Faro de transmisión fuera de cobertura. Reintentando más tarde.",
    searchError: "Error de sintonización. Inténtalo de nuevo.",
    selectionCombo: "Una selección inteligente de ideas, conversación relajada, psicología, humor y debate intelectual."
  },
  en: {
    title: "World Radios for Curious Minds",
    desc: "Tune in to the planet's sharpest talks, brilliant humor, vibrant debates, and deep psychology! High-clarity radio for curious minds that never stop exploring.",
    top10Title: "⭐ The Top 10 Around the World",
    allCountriesTitle: "🌍 Explore by Countries",
    connecting: "Tuning in satellite signal...",
    notFound: "Broadcast beacon out of sweep range. Retrying later.",
    searchError: "Tuning error. Please try again.",
    selectionCombo: "A smart selection of ideas, relaxed conversation, psychology, humor and intellectual debate."
  },
  pt: {
    title: "Rádios do Mundo para Mentes Curiosas",
    desc: "Sintonize as conversas mais brilhantes, humor inteligente e debates instigantes do planeta! Rádio de alto nível para mentes curiosas.",
    top10Title: "⭐ O Top 10 Ao Redor do Mundo",
    allCountriesTitle: "🌍 Explorar por Países",
    connecting: "Sintonizando sinal de satélite...",
    notFound: "Sinal de transmissão indisponível no momento. Tente mais tarde.",
    searchError: "Erro de sintonização. Tente de novo.",
    selectionCombo: "Uma seleção inteligente de ideias, conversa descontraída, psicologia, humor e debate intelectual."
  },
  fr: {
    title: "Radios du Monde pour Esprits Curieux",
    desc: "Brillantes discussions, humour fin, psychologie profonde et débats captivants à travers le monde ! Des ondes enrichissantes pour nourrir votre curiosité.",
    top10Title: "⭐ Le Top 10 à travers le Monde",
    allCountriesTitle: "🌍 Explorer par Pays",
    connecting: "Accord du signal satellite en cours...",
    notFound: "Balise d'émission hors de portée. Réessayez plus tard.",
    searchError: "Erreur de sintonisation. Veuillez réessayer.",
    selectionCombo: "Une sélection intelligente d'idées, de conversations détendues, de psychologie, d'humour et de débats intellectuels."
  },
  zh: {
    title: "好奇心灵的世界电台",
    desc: "汇集全球智慧的精彩访谈、睿智幽默与深度心理学讨论！专为拒绝平庸、不断探索的好奇心灵打造的高维声音电台。",
    top10Title: "⭐ 全球 10 大精选组合",
    allCountriesTitle: "🌍 按国家探索",
    connecting: "正在调谐卫星信号...",
    notFound: "广播信号超出接收范围，点击其它频道试试。",
    searchError: "调谐解析遇到错误，请重试。",
    selectionCombo: "融合卓越创意、轻松交谈、心理探讨、幽默感与知识碰撞的智慧电台之选。"
  },
  ru: {
    title: "Мировые радиостанции для любознательных умов",
    desc: "Настройтесь на самые яркие темы, тонкий юмор и глубокую психологию на планете! Высокочастотное радио для любознательных умов.",
    top10Title: "⭐ Топ-10 Радиостанций Мира",
    allCountriesTitle: "🌍 Поиск по Странам",
    connecting: "Настройка спутникового сигнала...",
    notFound: "Сигнал вещания вне зоны покрытия. Попробуйте позже.",
    searchError: "Ошибка настройки. Попробуйте еще раз.",
    selectionCombo: "Умный выбор идей, непринужденных разговоров, психологии, юмора и интеллектуальных дискуссий."
  }
};

const CURIOUS_COUNTRIES_DATA = [
  {
    country: "Argentina", 
    flag: "🇦🇷",
    stations: [
      { name: "Urbana Play", searchQuery: "Urbana Play 104.4", desc: "El pulso urbano, humor inteligente, charlas y actualidad." },
      { name: "Vorterix", searchQuery: "Vorterix", desc: "Cultura rock, tecnología, humor sin filtros y transmisiones potentes." },
      { name: "Radio Con Vos", searchQuery: "Radio Con Vos 89.9", desc: "Periodismo riguroso combinado con humor ácido y conversaciones descontracturadas." },
      { name: "Futurock", searchQuery: "Futurock", desc: "Voz joven alternativa, debate cultural y humor disonante." },
      { name: "Aspen FM", searchQuery: "Aspen 102.3", desc: "Refinado espacio musical con microconversaciones clásicas y elegantes." }
    ]
  },
  {
    country: "Uruguay",
    flag: "🇺🇾",
    stations: [
      { name: "En Perspectiva", searchQuery: "En Perspectiva", desc: "Análisis político de altísimo vuelo y entrevistas culturales profundas." },
      { name: "Radiomundo", searchQuery: "Radiomundo 1170", desc: "Espacio para mentes inquietas, debates y crónicas internacionales." },
      { name: "El Espectador", searchQuery: "El Espectador 810", desc: "La radio histórica uruguaya con debates clave e información calificada." }
    ]
  },
  {
    country: "España",
    flag: "🇪🇸",
    stations: [
      { name: "Cadena SER", searchQuery: "Cadena SER", desc: "La radio más escuchada de España. Humor brillante, psicología y debate nacional." },
      { name: "Onda Cero", searchQuery: "Onda Cero", desc: "La gran ventana de la cultura y la opinión española con entrevistas de autor." },
      { name: "RNE Radio Nacional", searchQuery: "Radio Nacional de Espana", desc: "Informativos profundos, transmisiones culturales y documentales sonoros exquisitos." },
      { name: "RAC1", searchQuery: "RAC1", desc: "El dinamismo catalán, info activa y entretenimiento de gran cercanía." },
      { name: "Catalunya Ràdio", searchQuery: "Catalunya Radio", desc: "Servicio público, debates, cultura catalana y entrevistas minuciosas." }
    ]
  },
  {
    country: "Canadá",
    flag: "🇨🇦",
    stations: [
      { name: "CBC Radio One", searchQuery: "CBC Radio One", desc: "El estándar de oro en periodismo de interés humano y documentales sociológicos." },
      { name: "Radio-Canada Première", searchQuery: "Radio-Canada Premiere", desc: "La sofisticada alternativa francófona de CBC con maravillosos espacios de debate." },
      { name: "ICI Première Montréal", searchQuery: "ICI Premiere Montreal", desc: "Voz central de la cultura quebequense, arte y conversaciones agudas." }
    ]
  },
  {
    country: "Francia",
    flag: "🇫🇷",
    stations: [
      { name: "France Inter", searchQuery: "France Inter", desc: "La referencia absoluta: humor irreverente, cultura pop, ecología y entrevistas de fondo." },
      { name: "France Culture", searchQuery: "France Culture", desc: "El templo intelectual donde la ciencia, la filosofía y el arte se explican paso a paso." },
      { name: "RTL France", searchQuery: "RTL", desc: "La radio privada líder, con entretenimiento clásico, actualidad y humor ágil." },
      { name: "Europe 1", searchQuery: "Europe 1", desc: "Grandes reportajes, crónicas políticas y mesas de debate incisivas." }
    ]
  },
  {
    country: "Bélgica",
    flag: "🇧🇪",
    stations: [
      { name: "La Première", searchQuery: "RTBF La Premiere", desc: "Análisis europeo detallado, cultura belga y debates reposados." },
      { name: "RTBF Vivacité", searchQuery: "RTBF Vivacite", desc: "Radio de gran pulso comunitario, conversación alegre y noticias cotidianas." }
    ]
  },
  {
    country: "Suiza",
    flag: "🇨🇭",
    stations: [
      { name: "RTS La Première", searchQuery: "RTS La Premiere", desc: "Rigurosidad helvética, reportajes de investigación e interés global." },
      { name: "RTS Espace 2", searchQuery: "RTS Espace 2", desc: "El refugio de la música clásica de alto nivel, la literatura y el pensamiento contemporáneo." }
    ]
  },
  {
    country: "Reino Unido",
    flag: "🇬🇧",
    stations: [
      { name: "BBC Radio 4", searchQuery: "BBC Radio 4", desc: "Cuna de la radio de autor: comedia estelar, ciencia, drama sonoro e información impecable." },
      { name: "BBC Radio 5 Live", searchQuery: "BBC Radio 5 Live", desc: "Actualidad en vivo, deportes y llamadas telefónicas con la audiencia para tomar el pulso social." },
      { name: "LBC", searchQuery: "LBC", desc: "Debates telefónicos apasionantes y confrontación de ideas sobre política británica." },
      { name: "Times Radio", searchQuery: "Times Radio", desc: "La voz inteligente del periódico The Times. Entrevistas calmadas de peso pesado." }
    ]
  },
  {
    country: "Estados Unidos",
    flag: "🇺🇸",
    stations: [
      { name: "NPR", searchQuery: "NPR News", desc: "National Public Radio: el hogar de los amantes del podcast, narración impecable e interés humano." },
      { name: "WNYC", searchQuery: "WNYC", desc: "La radio pública de Nueva York. Arte vibrante, política metropolitana y debates comunitarios." },
      { name: "KCRW", searchQuery: "KCRW", desc: "La vanguardia de Los Ángeles: fusión perfecta de indie musical, cine e ideas audaces." },
      { name: "WBUR", searchQuery: "WBUR", desc: "El faro académico de Boston con explicaciones de ciencia, sociedad e ideas pioneras." }
    ]
  },
  {
    country: "Brasil",
    flag: "🇧🇷",
    stations: [
      { name: "CBN", searchQuery: "Radio CBN", desc: "A rádio que toca notícia. Análisis político de primer nivel las 24 horas." },
      { name: "BandNews FM", searchQuery: "BandNews FM", desc: "Información al instante en formato de píldoras veloces y opiniones contundentes." },
      { name: "Jovem Pan News", searchQuery: "Jovem Pan News", desc: "Actualidad brasileña ferviente, debates acalorados y noticias políticas continuas." },
      { name: "Rádio Cultura Brasil", searchQuery: "Radio Cultura Brasil", desc: "El oasis cultural de São Paulo. Música de calidad, literatura y debates profundos." }
    ]
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    stations: [
      { name: "Observador", searchQuery: "Radio Observador", desc: "Un medio nativo digital convertido en radio de debate sensacional y entrevistas agudas." },
      { name: "Antena 1", searchQuery: "Antena 1 RTP", desc: "La radio pública portuguesa por excelencia, dedicada a la cultura y actualidad nacional." },
      { name: "TSF", searchQuery: "TSF Radio Noticias", desc: "Información de fondo muy cuidada y transmisiones parlamentarias de referencia." }
    ]
  },
  {
    country: "Italia",
    flag: "🇮🇹",
    stations: [
      { name: "Radio24", searchQuery: "Radio 24", desc: "La emblemática emisora de economía, política y charlas existenciales con gran carácter." },
      { name: "Rai Radio 1", searchQuery: "Rai Radio 1", desc: "El gran diario hablado italiano con transmisiones de actualidad y debate continuo." },
      { name: "Rai Radio 3", searchQuery: "Rai Radio 3", desc: "El canal cultural donde reinan el cine, la crítica literaria y el debate intelectual." }
    ]
  },
  {
    country: "Alemania",
    flag: "🇩🇪",
    stations: [
      { name: "Deutschlandfunk", searchQuery: "Deutschlandfunk", desc: "Rigurosidad alemana en análisis político europeo de máxima profundidad." },
      { name: "Deutschlandfunk Kultur", searchQuery: "Deutschlandfunk Kultur", desc: "Cultura, psicología, sociología y reportajes mundiales excelentemente documentados." },
      { name: "WDR 5", searchQuery: "WDR 5", desc: "Charlas reposadas, entrevistas largas con mentes brillantes y debates sociológicos." }
    ]
  },
  {
    country: "Países Bajos",
    flag: "🇳🇱",
    stations: [
      { name: "NPO Radio 1", searchQuery: "NPO Radio 1", desc: "Canal público de debate neerlandés, coberturas de actualidad e investigación." },
      { name: "BNR Nieuwsradio", searchQuery: "BNR Nieuwsradio", desc: "La radio de negocios con análisis macroeconómico, opinión y actualidad tecnológica." }
    ]
  },
  {
    country: "Suecia",
    flag: "🇸🇪",
    stations: [
      { name: "Sveriges Radio P1", searchQuery: "Sveriges Radio P1", desc: "El legendario canal 'socio' sueco con documentales de renombre y debate calmado." }
    ]
  },
  {
    country: "Noruega",
    flag: "🇳🇴",
    stations: [
      { name: "NRK P2", searchQuery: "NRK P2", desc: "Filosofía, arte escandinavo y reflexiones reposadas sobre la vida moderna." }
    ]
  },
  {
    country: "Finlandia",
    flag: "🇫🇮",
    stations: [
      { name: "Yle Radio 1", searchQuery: "Yle Radio 1", desc: "Cultura finlandesa clásica, literatura y programas reflexivos de gran calidad." }
    ]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    stations: [
      { name: "ABC Radio National", searchQuery: "ABC Radio National", desc: "La cumbre del intelecto australiano: debates filosóficos, ciencia de frontera e ideas globales." },
      { name: "ABC RN", searchQuery: "ABC RN", desc: "Fórmula ágil de ideas, reseñas bibliográficas y entrevistas sobre el futuro del debate." }
    ]
  },
  {
    country: "Nueva Zelanda",
    flag: "🇳🇿",
    stations: [
      { name: "RNZ National", searchQuery: "RNZ National", desc: "Crónicas comunitarias pacíficas, entrevistas en profundidad y excelente radio de interés humano." }
    ]
  },
  {
    country: "Irlanda",
    flag: "🇮🇪",
    stations: [
      { name: "RTÉ Radio 1", searchQuery: "RTE Radio 1", desc: "Periodismo premiado, rica narrativa irlandesa de historias de vida y tertulias tradicionales." }
    ]
  },
  {
    country: "Singapur",
    flag: "🇸🇬",
    stations: [
      { name: "CNA938", searchQuery: "CNA938", desc: "La radio de Channel NewsAsia con noticias financieras del Pacífico y resúmenes de vanguardia." }
    ]
  },
  {
    country: "Japón",
    flag: "🇯🇵",
    stations: [
      { name: "NHK World Radio Japan", searchQuery: "NHK World", desc: "La ventana oficial del pensamiento nipón emitida globalmente en inglés." }
    ]
  }
];

const CURIOUS_TOP_10 = [
  { name: "France Inter", flag: "🇫🇷", searchQuery: "France Inter", country: "Francia" },
  { name: "Radio-Canada Première", flag: "🇨🇦", searchQuery: "Radio-Canada Premiere", country: "Canadá" },
  { name: "NPR", flag: "🇺🇸", searchQuery: "NPR News", country: "Estados Unidos" },
  { name: "BBC Radio 4", flag: "🇬🇧", searchQuery: "BBC Radio 4", country: "Reino Unido" },
  { name: "CBC Radio One", flag: "🇨🇦", searchQuery: "CBC Radio One", country: "Canadá" },
  { name: "Observador", flag: "🇵🇹", searchQuery: "Radio Observador", country: "Portugal" },
  { name: "Radio24", flag: "🇮🇹", searchQuery: "Radio 24", country: "Italia" },
  { name: "Cadena SER", flag: "🇪🇸", searchQuery: "Cadena SER", country: "España" },
  { name: "Deutschlandfunk Kultur", flag: "🇩🇪", searchQuery: "Deutschlandfunk Kultur", country: "Alemania" },
  { name: "ABC Radio National", flag: "🇦🇺", searchQuery: "ABC Radio National", country: "Australia" }
];

const getTranslatedCountryName = (country: string, lang: string) => {
  const dictionary: Record<string, Record<string, string>> = {
    "Argentina": { es: "Argentina", en: "Argentina", pt: "Argentina", fr: "Argentine", zh: "阿根廷", ru: "Аргентина" },
    "Venezuela": { es: "Venezuela", en: "Venezuela", pt: "Venezuela", fr: "Venezuela", zh: "委内瑞拉", ru: "Венесуэла" },
    "Uruguay": { es: "Uruguay", en: "Uruguay", pt: "Uruguai", fr: "Uruguay", zh: "乌拉圭", ru: "Уругвай" },
    "España": { es: "España", en: "Spain", pt: "Espanha", fr: "Espagne", zh: "西班牙", ru: "Испания" },
    "Francia": { es: "Francia", en: "France", pt: "França", fr: "France", zh: "法国", ru: "Франция" },
    "Canadá": { es: "Canadá", en: "Canada", pt: "Canadá", fr: "Canada", zh: "加拿大", ru: "Канада" },
    "Bélgica": { es: "Bélgica", en: "Belgium", pt: "Bélgica", fr: "Belgique", zh: "比利时", ru: "Бельгия" },
    "Suiza": { es: "Suiza", en: "Switzerland", pt: "Suíça", fr: "Suisse", zh: "瑞士", ru: "Швейцария" },
    "Reino Unido": { es: "Reino Unido", en: "United Kingdom", pt: "Reino Unido", fr: "Royaume-Uni", zh: "英国", ru: "Великобритания" },
    "Estados Unidos": { es: "Estados Unidos", en: "United States", pt: "Estados Unidos", fr: "États-Unis", zh: "美国", ru: "США" },
    "Brasil": { es: "Brasil", en: "Brazil", pt: "Brasil", fr: "Brésil", zh: "巴西", ru: "Бразилия" },
    "Portugal": { es: "Portugal", en: "Portugal", pt: "Portugal", fr: "Portugal", zh: "葡萄牙", ru: "Португалия" },
    "Italia": { es: "Italia", en: "Italy", pt: "Itália", fr: "Italie", zh: "意大利", ru: "Италия" },
    "Alemania": { es: "Alemania", en: "Germany", pt: "Alemanha", fr: "Allemagne", zh: "Германия", ru: "Германия" },
    "Países Bajos": { es: "Países Bajos", en: "Netherlands", pt: "Países Baixos", fr: "Pays-Bas", zh: "荷兰", ru: "Нидерланды" },
    "Suecia": { es: "Suecia", en: "Sweden", pt: "Suécia", fr: "Suède", zh: "瑞典", ru: "Швеция" },
    "Noruega": { es: "Noruega", en: "Norway", pt: "Noruega", fr: "Norvège", zh: "Норвегия", ru: "Норвегия" },
    "Finlandia": { es: "Finlandia", en: "Finland", pt: "Finlândia", fr: "Finlande", zh: "Финландя", ru: "Финляндия" },
    "Australia": { es: "Australia", en: "Australia", pt: "Austrália", fr: "Australie", zh: "澳大利亚", ru: "Австралия" },
    "Nueva Zelanda": { es: "Nueva Zelanda", en: "New Zealand", pt: "Nova Zelândia", fr: "Nouvelle-Zélande", zh: "新西兰", ru: "Новая Зеландия" },
    "Irlanda": { es: "Irlanda", en: "Ireland", pt: "Irlanda", fr: "Irlande", zh: "爱尔兰", ru: "Ирландия" },
    "Singapur": { es: "Singapur", en: "Singapore", pt: "Singapura", fr: "Singapour", zh: "新加坡", ru: "Сингапур" },
    "Japón": { es: "Japón", en: "Japan", pt: "Japão", fr: "Japon", zh: "日本", ru: "Япония" }
  };
  return dictionary[country]?.[lang] || country;
};

const CURATED_PODCASTS: Station[] = [
  {
    stationuuid: "podcast-venganza-sera-terrible",
    name: "La Venganza Será Terrible (Dolina, AM 750)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    favicon: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, dolina, la venganza sera terrible, humor, argentina, cultura, literatura, teatro",
    country: "Argentina",
    countrycode: "AR",
    language: "es",
    votes: 95000,
    clickcount: 7850,
    spotifyId: "06P7u8R7EGrE3x85CByCgL"
  },
  {
    stationuuid: "podcast-game-theory",
    name: "The Game Theory Podcast",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    favicon: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, game theory, gaming, debate, news, tech, video games, matpat",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 62000,
    clickcount: 5200,
    spotifyId: "4O7xL0kXUaIasl1EuxP1x3"
  },
  {
    stationuuid: "podcast-greeking-out",
    name: "National Geographic Kids - Greeking Out",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    favicon: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, greeking out, mythology, greece, history, stories, kids, nat geo",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 49000,
    clickcount: 4100,
    spotifyId: "3S7vInqic5qA6U1pAtY6aO"
  },
  {
    stationuuid: "podcast-stuff-you-should-know",
    name: "Stuff You Should Know",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    favicon: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, science, culture, history, educational, stuff you should know, sysk",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 81000,
    clickcount: 6300,
    spotifyId: "07v6Vz0a8mZcX4p8EclR6s"
  },
  {
    stationuuid: "podcast-la-cruda",
    name: "La Cruda (Migue Granados)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    favicon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, la cruda, entrevistas, migue granados, humor, argentina, sociedad",
    country: "Argentina",
    countrycode: "AR",
    language: "es",
    votes: 74000,
    clickcount: 5800,
    spotifyId: "5h6N6n9U8p6EclS3zLscY6"
  },
  {
    stationuuid: "podcast-ted-talks-daily",
    name: "TED Talks Daily",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    favicon: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, ted talks, ideas, design, business, technology, inspiration",
    country: "Canada",
    countrycode: "CA",
    language: "en",
    votes: 91000,
    clickcount: 8200,
    spotifyId: "1Ym7rXfX97A0ZgBySscYe6"
  },
  {
    stationuuid: "podcast-nadie-sabe-nada",
    name: "Nadie Sabe Nada (Buenafuente y Berto)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    favicon: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, nadiesabenada, humor, comedia, espana, improvisacion, buenafuente, berto romero",
    country: "España",
    countrycode: "ES",
    language: "es",
    votes: 85000,
    clickcount: 7300,
    spotifyId: "1k3A9gUu1QYlV7jVByRsc9"
  },
  {
    stationuuid: "podcast-radio-ambulante",
    name: "Radio Ambulante (NPR)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    url_resolved: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    favicon: "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=150&q=80",
    tags: "podcast, radio ambulante, npr, cronica, periodismo, historias, latinoamerica",
    country: "Latin America",
    countrycode: "US",
    language: "es",
    votes: 68000,
    clickcount: 6100,
    spotifyId: "4X1Nof20D32o6D4o7L8d7D"
  }
];

const MOST_LISTENED_STATIONS: Station[] = [
  // --- ESTADOS UNIDOS (US) ---
  {
    stationuuid: "top-world-jazz-groove",
    name: "The Jazz Groove",
    url: "https://west-mp3-128.smoothstreams.ca.jazzgroove.org/stream",
    url_resolved: "https://west-mp3-128.smoothstreams.ca.jazzgroove.org/stream",
    favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, smooth jazz, cool, lounge",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 210000,
    clickcount: 14200
  },
  {
    stationuuid: "top-world-kexp",
    name: "KEXP 90.3 FM",
    url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    url_resolved: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    favicon: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=600&q=80",
    tags: "alternative, rock, indie, live sessions",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 180000,
    clickcount: 9800
  },
  {
    stationuuid: "reco-somafm",
    name: "SomaFM Groove Salad",
    url: "http://ice1.somafm.com/groovesalad-128-mp3",
    url_resolved: "http://ice1.somafm.com/groovesalad-128-mp3",
    favicon: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=600&q=80",
    tags: "ambient, downtempo, chillout",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 55000,
    clickcount: 9140
  },

  // --- REINO UNIDO (GB) ---
  {
    stationuuid: "top-world-bbc-1",
    name: "BBC Radio 1",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
    url_resolved: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
    favicon: "https://images.unsplash.com/photo-1513829096999-4978602297f7?auto=format&fit=crop&w=600&q=80",
    tags: "pop, rock, dance, hits",
    country: "United Kingdom",
    countrycode: "GB",
    language: "en",
    votes: 450000,
    clickcount: 24500
  },
  {
    stationuuid: "top-world-classic-fm",
    name: "Classic FM",
    url: "https://stream-ice.geosg.co/ClassicFM",
    url_resolved: "https://stream-ice.geosg.co/ClassicFM",
    favicon: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    tags: "classical, symphony, opera, instruments",
    country: "United Kingdom",
    countrycode: "GB",
    language: "en",
    votes: 290000,
    clickcount: 15300
  },

  // --- ESPAÑA (ES) ---
  {
    stationuuid: "top-world-ibiza",
    name: "Ibiza Global Radio",
    url: "https://ibizaglobalradio.sc.llnwi.net:443/ibizaglobalradio.mp3",
    url_resolved: "https://ibizaglobalradio.sc.llnwi.net:443/ibizaglobalradio.mp3",
    favicon: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=600&q=80",
    tags: "house, electronic, deep house, ambient",
    country: "Spain",
    countrycode: "ES",
    language: "es",
    votes: 320000,
    clickcount: 18900
  },
  {
    stationuuid: "top-world-los40",
    name: "LOS40 España",
    url: "https://25613.live.streamtheworld.com/LOS40_SC",
    url_resolved: "https://25613.live.streamtheworld.com/LOS40_SC",
    favicon: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    tags: "pop, hits, latin, dance",
    country: "Spain",
    countrycode: "ES",
    language: "es",
    votes: 195000,
    clickcount: 11200
  },

  // --- ARGENTINA (AR) ---
  {
    stationuuid: "top-world-la100",
    name: "La 100 FM 99.9",
    url: "https://directo.cienradios.com.ar/La_100.mp3",
    url_resolved: "https://directo.cienradios.com.ar/La_100.mp3",
    favicon: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=600&q=80",
    tags: "pop, rock, radio, hits",
    country: "Argentina",
    countrycode: "AR",
    language: "es",
    votes: 215000,
    clickcount: 17400
  },
  {
    stationuuid: "top-world-mitre",
    name: "Radio Mitre",
    url: "https://directo.cienradios.com.ar/Mitre_AM790.mp3",
    url_resolved: "https://directo.cienradios.com.ar/Mitre_AM790.mp3",
    favicon: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    tags: "news, talk, politics, actual",
    country: "Argentina",
    countrycode: "AR",
    language: "es",
    votes: 110000,
    clickcount: 8900
  },

  // --- BRASIL (BR) ---
  {
    stationuuid: "top-world-antena1",
    name: "Antena 1 São Paulo",
    url: "https://stream.antena1.com.br/stream/1/",
    url_resolved: "https://stream.antena1.com.br/stream/1/",
    favicon: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    tags: "love songs, pop, flashbacks, soft",
    country: "Brazil",
    countrycode: "BR",
    language: "pt",
    votes: 195000,
    clickcount: 15400
  },
  {
    stationuuid: "top-world-alpha",
    name: "Alpha FM 101.7",
    url: "https://painel.fabricahost.com.br/8240/stream",
    url_resolved: "https://painel.fabricahost.com.br/8240/stream",
    favicon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, soul, mpb, bossa, international",
    country: "Brazil",
    countrycode: "BR",
    language: "pt",
    votes: 125000,
    clickcount: 9800
  },

  // --- MÉXICO (MX) ---
  {
    stationuuid: "top-world-los40mx",
    name: "LOS40 México",
    url: "https://25513.live.streamtheworld.com/LOS40_MEXICO_SC",
    url_resolved: "https://25513.live.streamtheworld.com/LOS40_MEXICO_SC",
    favicon: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    tags: "hits, reggaeton, pop, latin",
    country: "Mexico",
    countrycode: "MX",
    language: "es",
    votes: 180000,
    clickcount: 11400
  },
  {
    stationuuid: "top-world-exa",
    name: "Exa FM México",
    url: "https://20853.live.streamtheworld.com/EXAFM_SC",
    url_resolved: "https://20853.live.streamtheworld.com/EXAFM_SC",
    favicon: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    tags: "urban, pop, rock, electronic",
    country: "Mexico",
    countrycode: "MX",
    language: "es",
    votes: 160000,
    clickcount: 10400
  },
  // --- VENEZUELA (VE) ---
  {
    stationuuid: "top-world-lamega-ve",
    name: "La Mega 107.3 FM Caracas",
    url: "http://s9.voscast.com:7198/;stream.mp3",
    url_resolved: "http://s9.voscast.com:7198/;stream.mp3",
    favicon: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
    tags: "pop, rock, hits, entertainment, talk",
    country: "Venezuela",
    countrycode: "VE",
    language: "es",
    votes: 175000,
    clickcount: 11400
  },
  {
    stationuuid: "top-world-exitos-ve",
    name: "Éxitos 99.7 FM",
    url: "http://s10.voscast.com:9446/;stream.mp3",
    url_resolved: "http://s10.voscast.com:9446/;stream.mp3",
    favicon: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    tags: "pop, hits, talk, classics",
    country: "Venezuela",
    countrycode: "VE",
    language: "es",
    votes: 125000,
    clickcount: 8900
  },
  {
    stationuuid: "top-world-romantica-ve",
    name: "La Romántica 88.9 FM",
    url: "http://s9.voscast.com:7472/;stream.mp3",
    url_resolved: "http://s9.voscast.com:7472/;stream.mp3",
    favicon: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    tags: "love songs, romantic, pop, ballad",
    country: "Venezuela",
    countrycode: "VE",
    language: "es",
    votes: 95000,
    clickcount: 7200
  }
];

const RECOGNITION_STATIONS: Station[] = [
  {
    stationuuid: "reco-fip",
    name: "FIP Radio Paris",
    url: "https://stream.radiofrance.fr/fip/fip.mp3",
    url_resolved: "https://stream.radiofrance.fr/fip/fip.mp3",
    favicon: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80",
    tags: "eclectic, jazz, vocal, french",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 38000,
    clickcount: 5120
  },
  {
    stationuuid: "reco-fip-jazz",
    name: "FIP Jazz Paris",
    url: "https://stream.radiofrance.fr/fipjazz/fipjazz.mp3",
    url_resolved: "https://stream.radiofrance.fr/fipjazz/fipjazz.mp3",
    favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, swing, bebop, acoustic",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 24500,
    clickcount: 3890
  },
  {
    stationuuid: "reco-fip-rock",
    name: "FIP Rock",
    url: "https://stream.radiofrance.fr/fiprock/fiprock.mp3",
    url_resolved: "https://stream.radiofrance.fr/fiprock/fiprock.mp3",
    favicon: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
    tags: "rock, indie, classic rock, alternative",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 21900,
    clickcount: 3120
  },
  {
    stationuuid: "reco-fip-pop",
    name: "FIP Pop",
    url: "https://stream.radiofrance.fr/fippop/fippop.mp3",
    url_resolved: "https://stream.radiofrance.fr/fippop/fippop.mp3",
    favicon: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    tags: "pop, synthpop, indie pop, hits",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 19800,
    clickcount: 2850
  },
  {
    stationuuid: "reco-fip-groove",
    name: "FIP Groove",
    url: "https://stream.radiofrance.fr/fipgroove/fipgroove.mp3",
    url_resolved: "https://stream.radiofrance.fr/fipgroove/fipgroove.mp3",
    favicon: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    tags: "funk, soul, r&b, groove, disco",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 18400,
    clickcount: 2610
  },
  {
    stationuuid: "reco-fip-reggae",
    name: "FIP Reggae",
    url: "https://stream.radiofrance.fr/fipreggae/fipreggae.mp3",
    url_resolved: "https://stream.radiofrance.fr/fipreggae/fipreggae.mp3",
    favicon: "https://images.unsplash.com/photo-1548438289-53696fb350a4?auto=format&fit=crop&w=600&q=80",
    tags: "reggae, dub, ska, roots",
    country: "France",
    countrycode: "FR",
    language: "fr",
    votes: 15400,
    clickcount: 2010
  },
  {
    stationuuid: "reco-kexp",
    name: "KEXP Seattle Live",
    url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    url_resolved: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    favicon: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    tags: "alternative, rock, punk, americana",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 62000,
    clickcount: 8520
  },
  {
    stationuuid: "reco-rp-main",
    name: "Radio Paradise Main Mix",
    url: "https://stream.radioparadise.com/mp3-128",
    url_resolved: "https://stream.radioparadise.com/mp3-128",
    favicon: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    tags: "rock, indie, alternative, eclectic",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 49000,
    clickcount: 6500
  },
  {
    stationuuid: "reco-rp-rock",
    name: "Radio Paradise Rock Mix",
    url: "http://stream.radioparadise.com/rock-128",
    url_resolved: "http://stream.radioparadise.com/rock-128",
    favicon: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=600&q=80",
    tags: "classic rock, metal, modern rock",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 31000,
    clickcount: 4200
  },
  {
    stationuuid: "reco-rp-eclectic",
    name: "Radio Paradise Eclectic Mix",
    url: "http://stream.radioparadise.com/eclectic-128",
    url_resolved: "http://stream.radioparadise.com/eclectic-128",
    favicon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    tags: "eclectic, world, ambient, fusion",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 28055,
    clickcount: 3660
  },
  {
    stationuuid: "reco-rp-mellow",
    name: "Radio Paradise Mellow Mix",
    url: "http://stream.radioparadise.com/mellow-128",
    url_resolved: "http://stream.radioparadise.com/mellow-128",
    favicon: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
    tags: "mellow, folk, singer songwriter, acoustic",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 45000,
    clickcount: 6210
  },
  {
    stationuuid: "reco-rp-world",
    name: "Radio Paradise World Mix",
    url: "http://stream.radioparadise.com/world-128",
    url_resolved: "http://stream.radioparadise.com/world-128",
    favicon: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    tags: "world, ethnic, folk, global beats",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 18700,
    clickcount: 2470
  },
  {
    stationuuid: "reco-kcrw",
    name: "KCRW 89.9 FM Los Angeles",
    url: "https://kcrw.streamguys1.com/kcrw_128k_mp3_on_air",
    url_resolved: "https://kcrw.streamguys1.com/kcrw_128k_mp3_on_air",
    favicon: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=600&q=80",
    tags: "eclectic, public news, talking, live",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 34000,
    clickcount: 5100
  },
  {
    stationuuid: "reco-somafm-salad",
    name: "SomaFM Groove Salad",
    url: "http://ice1.somafm.com/groovesalad-128-mp3",
    url_resolved: "http://ice1.somafm.com/groovesalad-128-mp3",
    favicon: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=600&q=80",
    tags: "ambient, downtempo, chillout",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 55000,
    clickcount: 9140
  },
  {
    stationuuid: "reco-somafm-indie",
    name: "SomaFM Indie Pop Rocks!",
    url: "http://ice1.somafm.com/indiepop-128-mp3",
    url_resolved: "http://ice1.somafm.com/indiepop-128-mp3",
    favicon: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=600&q=80",
    tags: "indie pop, indie rock, alternative",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 27000,
    clickcount: 4800
  },
  {
    stationuuid: "reco-somafm-secret",
    name: "SomaFM Secret Agent",
    url: "http://ice1.somafm.com/secretagent-128-mp3",
    url_resolved: "http://ice1.somafm.com/secretagent-128-mp3",
    favicon: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
    tags: "lounge, cinematic, spy, soundtrack",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 19000,
    clickcount: 3100
  },
  {
    stationuuid: "reco-somafm-poptron",
    name: "SomaFM PopTron",
    url: "http://ice1.somafm.com/poptron-128-mp3",
    url_resolved: "http://ice1.somafm.com/poptron-128-mp3",
    favicon: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    tags: "synthpop, indie pop, alternative 80s",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 18100,
    clickcount: 2950
  },
  {
    stationuuid: "reco-somafm-dubstep",
    name: "SomaFM Dub Step Beyond",
    url: "http://ice1.somafm.com/dubstep-128-mp3",
    url_resolved: "http://ice1.somafm.com/dubstep-128-mp3",
    favicon: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    tags: "dubstep, bass music, electronic, grime",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 12400,
    clickcount: 1850
  },
  {
    stationuuid: "reco-somafm-lush",
    name: "SomaFM Lush",
    url: "http://ice1.somafm.com/lush-128-mp3",
    url_resolved: "http://ice1.somafm.com/lush-128-mp3",
    favicon: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    tags: "ambient pop, dream pop, female vocals",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 21500,
    clickcount: 3220
  },
  {
    stationuuid: "reco-somafm-bootliquor",
    name: "SomaFM Boot Liquor",
    url: "http://ice1.somafm.com/bootliquor-128-mp3",
    url_resolved: "http://ice1.somafm.com/bootliquor-128-mp3",
    favicon: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    tags: "americana, roots, classic country",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 14700,
    clickcount: 1990
  },
  {
    stationuuid: "reco-somafm-spacestation",
    name: "SomaFM Space Station Soma",
    url: "http://ice1.somafm.com/spacestation-128-mp3",
    url_resolved: "http://ice1.somafm.com/spacestation-128-mp3",
    favicon: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    tags: "ambient, spacerock, electronics",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 16900,
    clickcount: 2280
  },
  {
    stationuuid: "reco-somafm-u80s",
    name: "SomaFM Underground 80s",
    url: "http://ice1.somafm.com/u80s-128-mp3",
    url_resolved: "http://ice1.somafm.com/u80s-128-mp3",
    favicon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    tags: "80s, synthpop, new wave, underground",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 25400,
    clickcount: 4120
  },
  {
    stationuuid: "reco-somafm-covers",
    name: "SomaFM Covers",
    url: "http://ice1.somafm.com/covers-128-mp3",
    url_resolved: "http://ice1.somafm.com/covers-128-mp3",
    favicon: "https://images.unsplash.com/photo-1482822683622-00effad5052e?auto=format&fit=crop&w=600&q=80",
    tags: "covers, alternative, tributes",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 13900,
    clickcount: 1810
  },
  {
    stationuuid: "reco-somafm-sonicuniverse",
    name: "SomaFM Sonic Universe",
    url: "http://ice1.somafm.com/sonicuniverse-128-mp3",
    url_resolved: "http://ice1.somafm.com/sonicuniverse-128-mp3",
    favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, avant-garde, modern jazz",
    country: "United States",
    countrycode: "US",
    language: "en",
    votes: 11200,
    clickcount: 1450
  },
  {
    stationuuid: "reco-venice-classic",
    name: "Venice Classic Radio",
    url: "http://174.36.1.92:9490/stream",
    url_resolved: "http://174.36.1.92:9490/stream",
    favicon: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    tags: "classical, symphony, opera, italia",
    country: "Italy",
    countrycode: "IT",
    language: "it",
    votes: 15400,
    clickcount: 2450
  },
  {
    stationuuid: "reco-swiss-jazz",
    name: "Radio Swiss Jazz",
    url: "http://stream.srg-ssr.ch/m/rsj/mp3_128",
    url_resolved: "http://stream.srg-ssr.ch/m/rsj/mp3_128",
    favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, smooth jazz, instrumental",
    country: "Switzerland",
    countrycode: "CH",
    language: "de",
    votes: 21300,
    clickcount: 3100
  },
  {
    stationuuid: "reco-swiss-pop",
    name: "Radio Swiss Pop",
    url: "http://stream.srg-ssr.ch/m/rsp/mp3_128",
    url_resolved: "http://stream.srg-ssr.ch/m/rsp/mp3_128",
    favicon: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    tags: "pop, hits, english, soft pop",
    country: "Switzerland",
    countrycode: "CH",
    language: "de",
    votes: 23100,
    clickcount: 3500
  },
  {
    stationuuid: "reco-swiss-classic",
    name: "Radio Swiss Classic",
    url: "http://stream.srg-ssr.ch/m/rsc_fr/mp3_128",
    url_resolved: "http://stream.srg-ssr.ch/m/rsc_fr/mp3_128",
    favicon: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    tags: "classical, symphony, chamber",
    country: "Switzerland",
    countrycode: "CH",
    language: "fr",
    votes: 18900,
    clickcount: 2650
  },
  {
    stationuuid: "reco-linn-jazz",
    name: "Linn Jazz UK",
    url: "http://89.16.185.174:8000/stream",
    url_resolved: "http://89.16.185.174:8000/stream",
    favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    tags: "jazz, vocal jazz, standards",
    country: "United Kingdom",
    countrycode: "GB",
    language: "en",
    votes: 14200,
    clickcount: 2010
  },
  {
    stationuuid: "reco-linn-classical",
    name: "Linn Classical UK",
    url: "http://89.16.185.174:8004/stream",
    url_resolved: "http://89.16.185.174:8004/stream",
    favicon: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    tags: "classical, symphony, orchestral",
    country: "United Kingdom",
    countrycode: "GB",
    language: "en",
    votes: 11900,
    clickcount: 1650
  },
  {
    stationuuid: "reco-bbc6",
    name: "BBC Radio 6 Music",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music",
    url_resolved: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music",
    favicon: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    tags: "alternative, curation, rock, talking",
    country: "United Kingdom",
    countrycode: "GB",
    language: "en",
    votes: 28000,
    clickcount: 4320
  },
  {
    stationuuid: "reco-bytefm",
    name: "ByteFM Germany",
    url: "http://www.byte.fm/stream/bytefm.mp3",
    url_resolved: "http://www.byte.fm/stream/bytefm.mp3",
    favicon: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    tags: "indie, electro, journalism",
    country: "Germany",
    countrycode: "DE",
    language: "de",
    votes: 12000,
    clickcount: 2190
  }
];

function formatSeconds(secs: number): string {
  if (isNaN(secs) || !isFinite(secs)) return "00:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const sStr = s < 10 ? `0${s}` : `${s}`;
  return `${mStr}:${sStr}`;
}

function isRealSong(title: string): boolean {
  if (!title) return false;
  const t = title.toLowerCase();
  return (
    t !== "sintonizando..." &&
    t !== "tuning in..." &&
    t !== "señal en vivo" &&
    t !== "live stream" &&
    t !== "transmitiendo episodio" &&
    t !== "streaming episode" &&
    !t.includes("reproduciendo vía") &&
    t.trim().length > 0
  );
}



export default function App() {
  // Navigation tabs (0 = Inicio, 1 = Buscar, 2 = Traducir, 3 = Sub-pestaña Grabaciones)
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isInsideIframe, setIsInsideIframe] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsInsideIframe(window.self !== window.top);
    }
  }, []);

  // States
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // States for Synesthesia
  const [synesthesiaImage, setSynesthesiaImage] = useState<string | null>(null);
  const [synesthesiaMimeType, setSynesthesiaMimeType] = useState<string | null>(null);
  const [synesthesiaFileName, setSynesthesiaFileName] = useState<string>("");
  const [synesthesiaUserDescription, setSynesthesiaUserDescription] = useState<string>("");
  const [activeSynesthesiaFile, setActiveSynesthesiaFile] = useState<File | null>(null);
  const [synesthesiaLoading, setSynesthesiaLoading] = useState<boolean>(false);
  const [synesthesiaResult, setSynesthesiaResult] = useState<{
    explanation_es: string;
    explanation_en: string;
    explanation_pt: string;
    explanation_fr: string;
    recommended_query: string;
    stations: Station[];
  } | null>(null);
  const [synesthesiaError, setSynesthesiaError] = useState<string | null>(null);
  const [synesthesiaStep, setSynesthesiaStep] = useState<string>("idle"); // idle, uploading, analyzing_colors, feeling_mood, curating_music, done
  const [synesthesiaDragging, setSynesthesiaDragging] = useState<boolean>(false);

  // States for Radios del Mundo para Mentes Curiosas
  const [curiousSintonizing, setCuriousSintonizing] = useState<string | null>(null);
  const [curiousSubTab, setCuriousSubTab] = useState<"top10" | "all">("top10");
  const [curiousCountrySelected, setCuriousCountrySelected] = useState<string>("all");
  const [curiousFilterText, setCuriousFilterText] = useState<string>("");

  // Refs and smooth-scrolling utilities for Curious Minds Section
  const curiousTop10ScrollRef = useRef<HTMLDivElement>(null);
  const curiousAllCountriesScrollRef = useRef<HTMLDivElement>(null);

  const scrollCuriousTop10 = (direction: "left" | "right") => {
    if (curiousTop10ScrollRef.current) {
      const { scrollLeft } = curiousTop10ScrollRef.current;
      const offset = direction === "left" ? -280 : 280;
      curiousTop10ScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  const scrollCuriousAll = (direction: "left" | "right") => {
    if (curiousAllCountriesScrollRef.current) {
      const { scrollLeft } = curiousAllCountriesScrollRef.current;
      const offset = direction === "left" ? -320 : 320;
      curiousAllCountriesScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  // States for smart self-healing stream recovery and alternatives
  const [stationAlternatives, setStationAlternatives] = useState<Station[]>([]);
  const [alternativeIndex, setAlternativeIndex] = useState<number>(0);
  const [isSearchingAlternatives, setIsSearchingAlternatives] = useState<boolean>(false);

  // Persistence States initialized from localStorage
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_playlists");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playHistory, setPlayHistory] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recognitionStations, setRecognitionStations] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_dynamic_recognition");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return RECOGNITION_STATIONS;
  });

  const [recordedFragments, setRecordedFragments] = useState<RecordedFragment[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_recordings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Radio Browser lists
  const [recommendedStations, setRecommendedStations] = useState<Station[]>([]);
  const [recentlyAddedStations, setRecentlyAddedStations] = useState<Station[]>([]);
  const [grooveStations, setGrooveStations] = useState<Station[]>([]);
  const [scienceStations, setScienceStations] = useState<Station[]>([]);
  const [worldHitsStations, setWorldHitsStations] = useState<Station[]>([]);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Mood selector states
  const [selectedMood, setSelectedMood] = useState<string>("euforia");
  const [moodStations, setMoodStations] = useState<Station[]>([]);
  const [loadingMood, setLoadingMood] = useState<boolean>(false);

  // Custom Tailored Podcasts states
  const [customPodcastLang, setCustomPodcastLang] = useState<"es" | "en" | "fr">("es");
  const [customPodcastTopic, setCustomPodcastTopic] = useState<"comedia" | "psicologia" | "economia">("comedia");
  const [customPodcasts, setCustomPodcasts] = useState<any[]>([]);
  const [loadingCustomPodcasts, setLoadingCustomPodcasts] = useState<boolean>(false);

  // Modal logic
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [showLiveChat, setShowLiveChat] = useState<boolean>(false);

  // Localized app language states
  const [appLanguage, setAppLanguage] = useState<"es" | "en" | "pt" | "fr" | "zh" | "ru">(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_app_lang");
      return (saved as any) || "es";
    } catch {
      return "es";
    }
  });
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string>("Sintonizando...");

  // Song Recognition & Popups systems states
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("ALL");
  const [showTrackToast, setShowTrackToast] = useState<boolean>(false);
  const [toastTrackTitle, setToastTrackTitle] = useState<string>("Sintonizado");
  const [toastStationName, setToastStationName] = useState<string>("");
  const [songDetailModalOpen, setSongDetailModalOpen] = useState<boolean>(false);
  const [identifyingSong, setIdentifyingSong] = useState<boolean>(false);
  const [identifiedSong, setIdentifiedSong] = useState<IdentifiedSong | null>(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const demoAudioRef = useRef<HTMLAudioElement | null>(null);

  // Synesthesia Helper Handlers
  const handleSynesthesiaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSynesthesiaFile(file);
  };

  const processSynesthesiaFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setSynesthesiaError(
        appLanguage === "es"
          ? "Por favor, sube un archivo de imagen válido."
          : "Please upload a valid image file."
      );
      return;
    }

    setSynesthesiaError(null);
    setSynesthesiaResult(null);
    setSynesthesiaStep("idle");
    setSynesthesiaFileName(file.name);
    setActiveSynesthesiaFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSynesthesiaImage(base64);
      setSynesthesiaMimeType(file.type);
      
      // Trigger instant automatic analysis on upload! No extra clicks required!
      startSynesthesiaAnalysis(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const startSynesthesiaAnalysis = async (
    directImage?: string,
    directMimeType?: string,
    directFileName?: string
  ) => {
    const imageToUse = directImage || synesthesiaImage;
    const mimeToUse = directMimeType || synesthesiaMimeType;
    const nameToUse = directFileName || synesthesiaFileName;

    if (!imageToUse) return;

    setSynesthesiaLoading(true);
    setSynesthesiaError(null);
    setSynesthesiaResult(null);
    setSynesthesiaStep("uploading");

    try {
      setSynesthesiaStep("analyzing_colors");
      await new Promise((r) => setTimeout(r, 800));
      setSynesthesiaStep("feeling_mood");
      await new Promise((r) => setTimeout(r, 800));
      setSynesthesiaStep("curating_music");

      const response = await fetch("/api/synesthesia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageToUse,
          mimeType: mimeToUse,
          fileName: nameToUse,
          userDescription: "", // Handled automatically by our advanced AI!
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to analyze image";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errorMsg = errData.error || errorMsg;
          } else {
            const text = await response.text();
            if (text && text.length < 150) {
              errorMsg = text;
            } else {
              errorMsg = `Server error code ${response.status}`;
            }
          }
        } catch (e) {
          errorMsg = `Server error: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setSynesthesiaResult(data);
      setSynesthesiaStep("done");
    } catch (err: any) {
      console.error("Synesthesia error:", err);
      setSynesthesiaError(err.message || "Error analyzing image");
      setSynesthesiaStep("idle");
    } finally {
      setSynesthesiaLoading(false);
    }
  };

  const handleSynesthesiaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setSynesthesiaDragging(true);
  };

  const handleSynesthesiaDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setSynesthesiaDragging(false);
  };

  const handleSynesthesiaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setSynesthesiaDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSynesthesiaFile(file);
    }
  };

  const t = LANGUAGES[appLanguage];

  // Podcast Seek / Progress States
  const [podcastCurrentTime, setPodcastCurrentTime] = useState<number>(0);
  const [podcastDuration, setPodcastDuration] = useState<number>(0);

  // --- Live Time-Shift (Pause/Rewind) Buffer ---
  const [isTimeShifted, setIsTimeShifted] = useState<boolean>(false);
  const [timeShiftTime, setTimeShiftTime] = useState<number>(0); // Actual playhead position in seconds relative to recording start
  const [timeShiftDuration, setTimeShiftDuration] = useState<number>(0); // Total accumulated live recording duration in seconds
  const [isTimeShiftPaused, setIsTimeShiftPaused] = useState<boolean>(false);

  const bgRecorderRef = useRef<MediaRecorder | null>(null);
  const bgChunksRef = useRef<Blob[]>([]);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgRecorderTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start background sintonizer recording for time-shift buffering
  const startBgRecording = () => {
    // Reset background recorder state
    if (bgRecorderTimerRef.current) {
      clearInterval(bgRecorderTimerRef.current);
      bgRecorderTimerRef.current = null;
    }
    if (bgRecorderRef.current && bgRecorderRef.current.state !== "inactive") {
      try {
        bgRecorderRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    bgRecorderRef.current = null;
    bgChunksRef.current = [];
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current = null;
    }
    
    setIsTimeShifted(false);
    setTimeShiftTime(0);
    setTimeShiftDuration(0);
    setIsTimeShiftPaused(false);

    if (!audioRef.current || !currentStation || currentStation.isPodcast || currentStation.spotifyId) return;

    // Start tracking duration virtual timer (seconds)
    bgRecorderTimerRef.current = setInterval(() => {
      setTimeShiftDuration(prev => prev + 1);
      if (isTimeShifted && bgAudioRef.current && !bgAudioRef.current.paused) {
        setTimeShiftTime(Math.round(bgAudioRef.current.currentTime));
      }
    }, 1000);

    // Give audio element a moment to load and sintonize, then capture stream
    setTimeout(() => {
      if (!audioRef.current || bgRecorderRef.current) return;
      try {
        let stream: MediaStream | null = null;
        const audio = audioRef.current;
        if ((audio as any).captureStream) {
          stream = (audio as any).captureStream();
        } else if ((audio as any).mozCaptureStream) {
          stream = (audio as any).mozCaptureStream();
        }

        if (stream) {
          let options: any = {};
          if (typeof MediaRecorder.isTypeSupported === "function") {
            const types = [
              "audio/webm;codecs=opus",
              "audio/webm",
              "audio/mp4",
              "audio/aac",
              "audio/wav"
            ];
            for (const t of types) {
              if (MediaRecorder.isTypeSupported(t)) {
                options = { mimeType: t };
                break;
              }
            }
          }

          const bgRecorder = new MediaRecorder(stream, options);
          bgRecorderRef.current = bgRecorder;

          bgRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              bgChunksRef.current.push(event.data);
            }
          };

          bgRecorder.start(1000); // 1s slice
          console.log("Time-Shift buffer sintonized successfully.");
        }
      } catch (err) {
        console.warn("Unable to capture audio stream for Time-Shift. Sintonizing with virtual pause buffer instead.", err);
      }
    }, 2000);
  };

  const stopBgRecording = () => {
    if (bgRecorderTimerRef.current) {
      clearInterval(bgRecorderTimerRef.current);
      bgRecorderTimerRef.current = null;
    }
    if (bgRecorderRef.current && bgRecorderRef.current.state !== "inactive") {
      try {
        bgRecorderRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    bgRecorderRef.current = null;
    bgChunksRef.current = [];
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current = null;
    }
    setIsTimeShifted(false);
  };

  const playTimeShiftBuffer = (startTimeSecs: number) => {
    if (bgChunksRef.current.length === 0) {
      // Fallback: If recorder is unavailable, keep live sintonization
      setIsTimeShifted(false);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(e => console.warn(e));
      }
      return;
    }

    try {
      let selectedMimeType = "audio/webm";
      if (bgRecorderRef.current) {
        selectedMimeType = bgRecorderRef.current.mimeType;
      }
      
      const blob = new Blob(bgChunksRef.current, { type: selectedMimeType });
      const blobUrl = URL.createObjectURL(blob);

      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }

      const tsAudio = new Audio(blobUrl);
      bgAudioRef.current = tsAudio;
      tsAudio.volume = isMuted ? 0 : volume;
      
      // Seek playing position inside the recorded stream
      tsAudio.currentTime = Math.min(startTimeSecs, timeShiftDuration - 1);
      tsAudio.play()
        .then(() => {
          // Keep live audio playing silently so it maintains active TCP buffering
          if (audioRef.current) {
            audioRef.current.volume = 0;
          }
        })
        .catch(err => {
          console.warn("Time-shift audio playback failed, sintonizing live:", err);
          setIsTimeShifted(false);
          if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
          }
        });

      tsAudio.addEventListener("timeupdate", () => {
        setTimeShiftTime(Math.round(tsAudio.currentTime));
      });

      tsAudio.addEventListener("ended", () => {
        handleGoToLive();
      });

    } catch (e) {
      console.error("Error setting up time-shift playback:", e);
      handleGoToLive();
    }
  };

  const handleGoToLive = () => {
    setIsTimeShifted(false);
    setIsTimeShiftPaused(false);
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(e => console.warn(e));
    }
    setIsPlaying(true);
  };

  const skipTime = (seconds: number) => {
    if (currentStation?.isPodcast) {
      if (audioRef.current) {
        try {
          let newTime = audioRef.current.currentTime + seconds;
          if (newTime < 0) newTime = 0;
          if (audioRef.current.duration && isFinite(audioRef.current.duration) && newTime > audioRef.current.duration) {
            newTime = audioRef.current.duration;
          }
          audioRef.current.currentTime = newTime;
          setPodcastCurrentTime(newTime);
        } catch (err) {
          console.warn(err);
        }
      }
      return;
    }

    // Live Radio Time-Shifting seek!
    if (seconds < 0) {
      // Seek backwards
      const targetTime = Math.max(0, (isTimeShifted ? timeShiftTime : timeShiftDuration) + seconds);
      setIsTimeShifted(true);
      setTimeShiftTime(targetTime);
      setIsPlaying(true);
      playTimeShiftBuffer(targetTime);
    } else {
      // Seek forwards
      if (isTimeShifted) {
        const targetTime = timeShiftTime + seconds;
        if (targetTime >= timeShiftDuration - 2) {
          // Reached Live head, sintonize Live
          handleGoToLive();
        } else {
          setTimeShiftTime(targetTime);
          setIsPlaying(true);
          playTimeShiftBuffer(targetTime);
        }
      }
    }
  };

  // Save language preference
  useEffect(() => {
    localStorage.setItem("spotify_radio_app_lang", appLanguage);
  }, [appLanguage]);

  // Auto-notification Toast when a track changes (for ICY metadata / real changes)
  useEffect(() => {
    if (currentTrackTitle && isRealSong(currentTrackTitle) && currentStation) {
      setToastTrackTitle(currentTrackTitle);
      setToastStationName(currentStation.name);
      setShowTrackToast(true);
      
      const timer = setTimeout(() => {
        setShowTrackToast(false);
      }, 7500);
      
      return () => clearTimeout(timer);
    }
  }, [currentTrackTitle, currentStation?.stationuuid]);

  const identifyCurrentSong = async (customTitle?: string) => {
    const titleToUse = customTitle || currentTrackTitle;
    if (!currentStation || !titleToUse || titleToUse === "Sintonizando...") return;

    setSongDetailModalOpen(true);
    setIdentifyingSong(true);
    setIdentifiedSong(null);
    setIsDemoPlaying(false);
    if (demoAudioRef.current) {
      demoAudioRef.current.pause();
    }

    try {
      const response = await fetch("/api/identify-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTitle: titleToUse,
          stationName: currentStation.name,
          stationLanguage: currentStation.language || "es",
          tags: currentStation.tags || "",
          country: currentStation.country || "",
          appLanguage: appLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIdentifiedSong(data);
      } else {
        throw new Error("Failed to identify");
      }
    } catch (err) {
      console.error("Error identifying song:", err);
      let guessedSong = "Canción Especial";
      let guessedArtist = "Artista Destacado";
      if (titleToUse.includes(" - ")) {
        const parts = titleToUse.split(" - ");
        guessedArtist = parts[0].trim();
        guessedSong = parts[1].trim();
      }
      setIdentifiedSong({
        songName: guessedSong,
        artist: guessedArtist,
        album: "Sintonía de Éxitos",
        releaseYear: "2024",
        story: appLanguage === "es" 
          ? "Un tema espectacular que está sonando con fuerza en la señal radial. ¡Disfruta del mejor ritmo live!"
          : "An amazing track streaming live on the airwaves. Enjoy the ultimate soundscape!",
        artworkUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80",
        genre: currentStation.tags ? currentStation.tags.split(",")[0].trim() : "Pop / Hits",
        previewUrl: "",
        spotifySearchQuery: `${guessedArtist} ${guessedSong}`
      });
    } finally {
      setIdentifyingSong(false);
    }
  };

  const toggleDemoPlay = () => {
    if (!identifiedSong || !identifiedSong.previewUrl) return;

    if (!demoAudioRef.current) {
      demoAudioRef.current = new Audio(identifiedSong.previewUrl);
      demoAudioRef.current.crossOrigin = "anonymous";
    } else if (demoAudioRef.current.src !== identifiedSong.previewUrl) {
      demoAudioRef.current.pause();
      demoAudioRef.current = new Audio(identifiedSong.previewUrl);
      demoAudioRef.current.crossOrigin = "anonymous";
    }

    if (isDemoPlaying) {
      demoAudioRef.current.pause();
      setIsDemoPlaying(false);
    } else {
      if (isPlaying) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      }
      demoAudioRef.current.play()
        .then(() => setIsDemoPlaying(true))
        .catch(err => console.warn("Demo play fail:", err));

      demoAudioRef.current.onended = () => {
        setIsDemoPlaying(false);
      };
    }
  };

  // Search filter options
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const isVoiceSearchActiveRef = useRef<boolean>(false);

  // Voice Search states
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceAssistantFeedback, setVoiceAssistantFeedback] = useState<{ es: string; en: string } | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceShowToast, setVoiceShowToast] = useState<boolean>(false);

  // Pagination states for infinite-like search results
  const [searchType, setSearchType] = useState<"typed" | "genre" | "country" | "georadio">("typed");
  const [searchParam, setSearchParam] = useState<string>("");
  const [searchOffset, setSearchOffset] = useState<number>(0);
  const [hasMoreSearch, setHasMoreSearch] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // Grid option actions
  const [countrySelectorOpen, setCountrySelectorOpen] = useState<boolean>(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // States for Spotify custom input
  const [spotifyInputUrl, setSpotifyInputUrl] = useState<string>("");
  const [spotifyInputError, setSpotifyInputError] = useState<string>("");
  const [customSpotifyStations, setCustomSpotifyStations] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem("spotify_radio_custom_spotify");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("spotify_radio_custom_spotify", JSON.stringify(customSpotifyStations));
  }, [customSpotifyStations]);

  // Audio elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // HTML IDs
  const searchInputId = useId();

  // Save states to localStorage on change
  useEffect(() => {
    localStorage.setItem("spotify_radio_playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("spotify_radio_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("spotify_radio_history", JSON.stringify(playHistory));
  }, [playHistory]);

  useEffect(() => {
    localStorage.setItem("spotify_radio_recordings", JSON.stringify(recordedFragments));
  }, [recordedFragments]);

  // Load initial content from Proxy server
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingInitial(true);
        // Fetch top rated click count stations for recommendations (increased limit to 45)
        const recResponse = await fetch("/api/radio/topclick?limit=45");
        if (recResponse.ok) {
          const data = await recResponse.json();
          setRecommendedStations(data);
        }

        // Fetch last changes for "recently incorporated" (increased limit to 45)
        const lastResponse = await fetch("/api/radio/lastchange?limit=45");
        if (lastResponse.ok) {
          const data = await lastResponse.json();
          setRecentlyAddedStations(data);
        }

        // Fetch Funk/Groove stations
        try {
          const grooveRes = await fetch("/api/radio/search?tag=funk&limit=25");
          if (grooveRes.ok) {
            const data = await grooveRes.json();
            setGrooveStations(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error(e);
        }

        // Fetch Science stations
        try {
          const scienceRes = await fetch("/api/radio/search?tag=science&limit=25");
          if (scienceRes.ok) {
            const data = await scienceRes.json();
            setScienceStations(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error(e);
        }

        // Fetch World Hits stations
        try {
          const hitsRes = await fetch("/api/radio/search?tag=hits&limit=25");
          if (hitsRes.ok) {
            const data = await hitsRes.json();
            setWorldHitsStations(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error(e);
        }

        // Fetch list of countries from A to Z
        const countriesResponse = await fetch("/api/radio/countries");
        if (countriesResponse.ok) {
          const data = await countriesResponse.json();
          // Sort alphabetically A-Z
          const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
          setCountriesList(sorted);
        }
      } catch (error) {
        console.error("Error loading initial radio browser data:", error);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadInitialData();
  }, []);

  // Load stations by mood
  useEffect(() => {
    async function fetchMoodStations(mood: string) {
      setLoadingMood(true);
      try {
        let list: any[] = [];
        if (mood === "euforia") {
          const [res1, res2] = await Promise.all([
            fetch("/api/radio/search?tag=rock&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=metal&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...res1, ...res2];
        } else if (mood === "zen") {
          const [res1, res2] = await Promise.all([
            fetch("/api/radio/search?tag=relax&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=ambient&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...res1, ...res2];
        } else if (mood === "azul") {
          list = await fetch("/api/radio/search?tag=blues&limit=25").then((r) => (r.ok ? r.json() : [])).catch(() => []);
        } else if (mood === "latina") {
          const [res1, res2] = await Promise.all([
            fetch("/api/radio/search?tag=salsa&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=merengue&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...res1, ...res2];
        } else if (mood === "lluvia") {
          const [res1, res2] = await Promise.all([
            fetch("/api/radio/search?tag=jazz&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=smooth%20jazz&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...res1, ...res2];
        } else if (mood === "teatro") {
          list = await fetch("/api/radio/search?tag=classical&limit=25").then((r) => (r.ok ? r.json() : [])).catch(() => []);
        } else if (mood === "retro") {
          const [res1, res2] = await Promise.all([
            fetch("/api/radio/search?tag=disco&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=retro&limit=15").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...res1, ...res2];
        } else if (mood === "noticias") {
          const [es, fr, zh, it, pt] = await Promise.all([
            fetch("/api/radio/search?tag=news&language=spanish&limit=5").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=news&language=french&limit=5").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=news&language=chinese&limit=5").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=news&language=italian&limit=5").then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch("/api/radio/search?tag=news&language=portuguese&limit=5").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          ]);
          list = [...es, ...fr, ...zh, ...it, ...pt];
        }

        const seen = new Set();
        const cleanList = list.filter((item) => {
          if (!item || !item.stationuuid) return false;
          if (seen.has(item.stationuuid)) return false;
          seen.add(item.stationuuid);
          return true;
        });

        cleanList.sort((a, b) => Number(b.clickcount || 0) - Number(a.clickcount || 0));
        setMoodStations(cleanList.slice(0, 18));
      } catch (err) {
        console.error("Error loading mood stations:", err);
      } finally {
        setLoadingMood(false);
      }
    }

    fetchMoodStations(selectedMood);
  }, [selectedMood]);

  // Load custom tailored podcasts
  useEffect(() => {
    async function fetchCustomPodcasts(lang: "es" | "en" | "fr", topic: "comedia" | "psicologia" | "economia") {
      setLoadingCustomPodcasts(true);
      try {
        let term = "";
        if (lang === "es") {
          if (topic === "comedia") term = "comedia humor";
          else if (topic === "psicologia") term = "psicologia salud mental";
          else if (topic === "economia") term = "economia finanzas";
        } else if (lang === "en") {
          if (topic === "comedia") term = "comedy";
          else if (topic === "psicologia") term = "psychology";
          else if (topic === "economia") term = "economics business";
        } else if (lang === "fr") {
          if (topic === "comedia") term = "comedie humour";
          else if (topic === "psicologia") term = "psychologie";
          else if (topic === "economia") term = "economie entreprise";
        }

        const response = await fetch(`/api/podcasts/search?term=${encodeURIComponent(term)}&limit=15`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.results) {
            setCustomPodcasts(data.results.slice(0, 12));
          } else {
            setCustomPodcasts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching custom podcasts:", err);
      } finally {
        setLoadingCustomPodcasts(false);
      }
    }

    fetchCustomPodcasts(customPodcastLang, customPodcastTopic);
  }, [customPodcastLang, customPodcastTopic]);

  // Sincronizar compartidos por URL (estaciones individuales o favoritos grupales)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stationId = params.get("station");
    const favsCsv = params.get("favorites");
    const plName = params.get("playlistName");
    const plStationsCsv = params.get("playlistStations");

    if (stationId) {
      fetch(`/api/radio/byuuid?uuids=${encodeURIComponent(stationId)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("No se pudo obtener la emisora del enlace compartido.");
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            playStation(data[0]);
          }
        })
        .catch((err) => console.error(err));
    } else if (favsCsv) {
      fetch(`/api/radio/byuuid?uuids=${encodeURIComponent(favsCsv)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("No se pudo importar las emisoras compartidas.");
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setFavorites((existing) => {
              const existingIds = new Set(existing.map((s) => s.stationuuid));
              const uniqueNew = data.filter((s: Station) => !existingIds.has(s.stationuuid));
              return [...existing, ...uniqueNew];
            });
            alert("🎯 ¡Se han sincronizado e importado las emisoras compartidas en tus Favoritos!");
          }
        })
        .catch((err) => console.error(err));
    } else if (plName && plStationsCsv) {
      fetch(`/api/radio/byuuid?uuids=${encodeURIComponent(plStationsCsv)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("No se pudo importar la playlist compartida.");
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPlaylists((existing) => {
              const containsName = existing.some((p) => p.name.toLowerCase() === plName.toLowerCase());
              const nameToUse = containsName ? `${plName} (Importada)` : plName;
              const newPl: Playlist = {
                id: Math.random().toString(36).substring(2, 9),
                name: nameToUse,
                stations: data,
              };
              return [...existing, newPl];
            });
            alert(`🎯 ¡Se ha importado con éxito la playlist compartida "${plName}"!`);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Helper to allow mouse drag scrolling for horizontal elements (PCs/Mice) without interfering with touch on phones
  const handleDragScroll = (e: React.MouseEvent<HTMLElement>) => {
    const container = e.currentTarget;
    if (e.button !== 0) return; // Only process left-clicks
    
    // Ignore drags that originate on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("select") || target.closest("textarea") || target.closest("audio")) {
      return;
    }

    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
    container.style.scrollBehavior = "auto"; // Disable smooth scroll temporarily so drag keeps pace/velocity with cursor

    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;
    let isDown = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDown) return;
      moveEvent.preventDefault();
      const x = moveEvent.pageX - container.offsetLeft;
      const walkX = (x - startX) * 1.5; // velocity multiplier
      container.scrollLeft = scrollLeft - walkX;
    };

    const handleMouseUpOrLeave = () => {
      isDown = false;
      container.style.cursor = "";
      container.style.userSelect = "";
      container.style.scrollBehavior = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUpOrLeave);
      document.removeEventListener("mouseleave", handleMouseUpOrLeave);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUpOrLeave);
    document.addEventListener("mouseleave", handleMouseUpOrLeave);
  };

  const fetchRealMetadata = async (streamUrl: string) => {
    if (!streamUrl) return;
    try {
      const response = await fetch(`/api/radio/live-metadata?url=${encodeURIComponent(streamUrl)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.title && data.title.trim().length > 0) {
          const cleanTitle = data.title.trim();
          setCurrentTrackTitle(cleanTitle);

          // If the station actually communicates a real song, dynamically insert it to the recognition list
          if (isRealSong(cleanTitle) && currentStation) {
            setRecognitionStations((prev) => {
              const alreadyExists = prev.some((item) => item.stationuuid === currentStation.stationuuid);
              if (!alreadyExists) {
                const updated = [...prev, currentStation];
                try {
                  localStorage.setItem("spotify_radio_dynamic_recognition", JSON.stringify(updated));
                } catch (e) {
                  console.error("Failed storing dynamic recognition stations:", e);
                }
                return updated;
              }
              return prev;
            });
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Failed fetching live metadata:", err);
    }
    // Set to static alive message if stream does not convey song title in its headers
    setCurrentTrackTitle(t.senal_en_vivo);
  };

  // Set up audio element stream URL changes
  useEffect(() => {
    if (currentStation) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Stop previous audio completely
      audioRef.current.pause();

      if (currentStation.spotifyId) {
        // If it plays via Spotify Embed, pause the standard stream audio.
        // We set standard audio reference to empty/paused, but keep visual indicators.
        setCurrentTrackTitle("Reproduciendo vía Spotify Player Widget");
        return;
      }

      // Use stream proxy URL to guarantee CORS satisfaction during Web Audio and recordings
      const rawUrl = currentStation.url_resolved && currentStation.url_resolved.startsWith("http")
        ? currentStation.url_resolved
        : (currentStation.url && currentStation.url.startsWith("http") ? currentStation.url : "");

      if (!rawUrl) {
        console.warn("No valid stream URL found for station:", currentStation.name);
        return;
      }

      // Direct-stream play for HTTPS to connect instantly, falling back to proxy only for HTTP URLs to prevent browser mixed-content blocks
      const targetUrl = rawUrl.startsWith("https")
        ? rawUrl
        : `/api/radio/stream-proxy?url=${encodeURIComponent(rawUrl)}`;

      // Bind dynamic auto-reconnecting stream recovery listeners
      const handleAudioError = async () => {
        console.warn("Stream offline detected. Auto-recovering using alternatives...");
        if (stationAlternatives.length > 0 && alternativeIndex < stationAlternatives.length) {
          const nextAlt = stationAlternatives[alternativeIndex];
          setAlternativeIndex(prev => prev + 1);
          setCurrentTrackTitle(
            appLanguage === "es"
              ? `Frecuencia inestable. Re-conectando señal ${alternativeIndex + 1}...`
              : `Weak signal. Tuning alternative channel ${alternativeIndex + 1}...`
          );
          if (audioRef.current && nextAlt) {
            const rawUrl = nextAlt.url_resolved || nextAlt.url;
            const targetUrl = rawUrl.startsWith("https")
              ? rawUrl
              : `/api/radio/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
            audioRef.current.src = targetUrl;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.warn(e));
          }
        } else {
          setCurrentTrackTitle(
            appLanguage === "es"
              ? "Buscando frecuencia alterna en vivo..."
              : "Locating live alternate frequency..."
          );
          try {
            const cleanName = currentStation.name.split("(")[0].split("-")[0].trim();
            const res = await fetch(`/api/radio/search?name=${encodeURIComponent(cleanName)}&limit=15`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 1) {
                const candidates = data.filter((s: Station) => s.stationuuid !== currentStation.stationuuid && (s.url_resolved || s.url));
                if (candidates.length > 0) {
                  setStationAlternatives(candidates);
                  setAlternativeIndex(1);
                  const firstAlt = candidates[0];
                  if (audioRef.current && firstAlt) {
                    const rawUrl = firstAlt.url_resolved || firstAlt.url;
                    const targetUrl = rawUrl.startsWith("https")
                      ? rawUrl
                      : `/api/radio/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
                    audioRef.current.src = targetUrl;
                    audioRef.current.load();
                    audioRef.current.play().catch(e => console.warn(e));
                    return;
                  }
                }
              }
            }
          } catch (e) {
            console.error("Auto recovery search failed:", e);
          }
          setCurrentTrackTitle(t.senal_caida);
        }
      };

      audioRef.current.addEventListener("error", handleAudioError);

      audioRef.current.src = targetUrl;
      audioRef.current.preload = "auto";
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.volume = isMuted ? 0 : volume;

      if (currentStation.isPodcast) {
        setCurrentTrackTitle(appLanguage === "es" ? "Transmitiendo Episodio" : appLanguage === "pt" ? "Transmitindo Episódio" : appLanguage === "fr" ? "Diffusion de l'Épisode" : "Streaming Episode");
      } else {
        // Initiate metadata query immediately
        setCurrentTrackTitle(t.sintonizando_senal);
        fetchRealMetadata(rawUrl);
      }

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay was blocked or stream error:", err);
          setIsPlaying(false);
        });
      }

      startBgRecording();

      const audioInst = audioRef.current;
      return () => {
        if (audioInst) {
          audioInst.removeEventListener("error", handleAudioError);
        }
        stopBgRecording();
      };
    }
  }, [currentStation?.stationuuid]);

  // Periodic metadata scraper (every 12s) while playing
  useEffect(() => {
    if (isPlaying && currentStation && !currentStation.isPodcast && !currentStation.spotifyId) {
      const rawUrl = currentStation.url_resolved || currentStation.url;
      if (rawUrl) {
        const interval = setInterval(() => {
          fetchRealMetadata(rawUrl);
        }, 12000);
        return () => clearInterval(interval);
      }
    }
  }, [isPlaying, currentStation?.stationuuid]);

  // Synchronize audio element's live metrics for podcast progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (currentStation?.isPodcast) {
        setPodcastCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (currentStation?.isPodcast) {
        setPodcastDuration(audio.duration || 0);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);

    // Initial check
    if (currentStation?.isPodcast) {
      setPodcastCurrentTime(audio.currentTime);
      setPodcastDuration(audio.duration || 0);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
    };
  }, [currentStation?.stationuuid, isPlaying]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!currentStation) return;
    
    if (currentStation.spotifyId) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (currentStation.isPodcast) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(e => console.warn(e));
          setIsPlaying(true);
        }
      }
      return;
    }

    // Live radio with seamless Time-Shift buffer pause/resume
    if (audioRef.current) {
      if (isPlaying) {
        // Pausing:
        // Set main audio to 0 volume so it keeps downloading/buffering smoothly in background, preventing network cutoffs
        audioRef.current.volume = 0;
        setIsPlaying(false);
        
        setIsTimeShifted(true);
        setIsTimeShiftPaused(true);
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
        } else {
          setTimeShiftTime(timeShiftDuration);
        }
      } else {
        // Resuming:
        if (isTimeShifted) {
          setIsTimeShiftPaused(false);
          setIsPlaying(true);
          playTimeShiftBuffer(timeShiftTime);
        } else {
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.play().catch(e => console.warn(e));
          setIsPlaying(true);
        }
      }
    } else {
      setIsPlaying(true);
    }
  };

  // Handle Stop
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopBgRecording();
    setIsPlaying(false);
  };

  // Handle stream volume adjustment
  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (audioRef.current && !isTimeShifted) {
      audioRef.current.volume = isMuted ? 0 : newVal;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : newVal;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current && !isTimeShifted) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  // Background pre-fetch for alternate streams of the same name to support fail-proof streaming fallback
  const fetchAlternatives = async (name: string, currentUuid: string) => {
    try {
      setIsSearchingAlternatives(true);
      // Clean name for broader search if contains details
      const cleanName = name.split("(")[0].split("-")[0].trim();
      const res = await fetch(`/api/radio/search?name=${encodeURIComponent(cleanName)}&limit=15`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Keep other stations with distinct stream urls or station uuids
          const filtered = data.filter((st: Station) => st.stationuuid !== currentUuid && (st.url_resolved || st.url));
          setStationAlternatives(filtered);
        }
      }
    } catch (e) {
      console.warn("Failed to pre-fetch alternatives:", e);
    } finally {
      setIsSearchingAlternatives(false);
    }
  };

  // Switch to another alternative active signal if currently sintonized stream fails
  const handleForceAlternative = async () => {
    if (!currentStation) return;
    
    setIsSearchingAlternatives(true);
    setCurrentTrackTitle(
      appLanguage === "es"
        ? "Buscando frecuencia alternativa..."
        : "Seeking alternative frequency..."
    );
    
    let candidates = stationAlternatives;
    let nextIdx = alternativeIndex;
    
    if (candidates.length === 0) {
      try {
        const cleanName = currentStation.name.split("(")[0].split("-")[0].trim();
        const res = await fetch(`/api/radio/search?name=${encodeURIComponent(cleanName)}&limit=15`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            candidates = data.filter((s: Station) => s.stationuuid !== currentStation.stationuuid && (s.url_resolved || s.url));
            setStationAlternatives(candidates);
            nextIdx = 0;
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    
    if (candidates.length > 0 && nextIdx < candidates.length) {
      const nextAlt = candidates[nextIdx];
      setAlternativeIndex(prev => prev + 1);
      
      setCurrentTrackTitle(
        appLanguage === "es"
          ? `Sintonizando canal alterno: ${nextAlt.name}...`
          : `Tuning alternative channel: ${nextAlt.name}...`
      );
      
      if (audioRef.current && nextAlt) {
        const rawUrl = nextAlt.url_resolved || nextAlt.url;
        if (rawUrl) {
          const targetUrl = rawUrl.startsWith("https")
            ? rawUrl
            : `/api/radio/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
          
          audioRef.current.src = targetUrl;
          audioRef.current.load();
          audioRef.current.play().catch(e => console.warn(e));
        }
      }
    } else {
      // Loop back to index 0 if reached end of alternative pool
      if (candidates.length > 0) {
        setAlternativeIndex(0);
        setCurrentTrackTitle(
          appLanguage === "es"
            ? "Explorando primer servidor alternativo..."
            : "Recycling alternate stream server..."
        );
        const nextAlt = candidates[0];
        if (audioRef.current && nextAlt) {
          const rawUrl = nextAlt.url_resolved || nextAlt.url;
          if (rawUrl) {
            const targetUrl = rawUrl.startsWith("https")
              ? rawUrl
              : `/api/radio/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
            audioRef.current.src = targetUrl;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.warn(e));
          }
        }
      } else {
        setCurrentTrackTitle(
          appLanguage === "es"
            ? "No se hallaron servidores vivos alternos."
            : appLanguage === "pt"
            ? "Servidores alternativos não encontrados."
            : appLanguage === "fr"
            ? "Aucun serveur alternatif trouvé."
            : "No active alternate servers found."
        );
        setTimeout(() => {
          setCurrentTrackTitle(t.senal_en_vivo);
        }, 3000);
      }
    }
    setIsSearchingAlternatives(false);
  };

  // Play a radio station
  const playStation = (station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);

    // Reset and search for alternative stream servers for fail-proof scaling
    setStationAlternatives([]);
    setAlternativeIndex(0);
    if (!station.isPodcast && !station.spotifyId) {
      fetchAlternatives(station.name, station.stationuuid);
    }

    // Add to history matching uniqueness condition:
    // "tener en cuenta que cuando se reproduce una o 2 veces es lo mismo, solo se agrega una vez"
    setPlayHistory((prev) => {
      // Remove previous duplicates
      const filtered = prev.filter((item) => item.stationuuid !== station.stationuuid);
      // Put at start
      return [station, ...filtered];
    });
  };

  // Check if a station is favorite
  const isFavorite = (stationUuid: string) => {
    return favorites.some((item) => item.stationuuid === stationUuid);
  };

  // Toggle favorite
  const toggleFavorite = (station: Station) => {
    setFavorites((prev) => {
      if (isFavorite(station.stationuuid)) {
        return prev.filter((item) => item.stationuuid !== station.stationuuid);
      } else {
        return [station, ...prev];
      }
    });
  };

  // Click handler to search and instantly stream a curious world radio station
  const handleCuriousRadioClick = async (radioName: string, query: string) => {
    if (curiousSintonizing) return;
    setCuriousSintonizing(radioName);
    
    setCurrentTrackTitle(
      appLanguage === "es" 
        ? `Sintonizando: ${radioName}...` 
        : `Tuning to: ${radioName}...`
    );

    try {
      const searchUrl = `/api/radio/search?name=${encodeURIComponent(query)}&limit=10`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const exactMatch = data.find((st: Station) => 
            st.name.toLowerCase().includes(radioName.toLowerCase()) || 
            radioName.toLowerCase().includes(st.name.toLowerCase())
          ) || data[0];
          playStation(exactMatch);
        } else {
          // Fallback search with the exact clean radio name
          const fallbackUrl = `/api/radio/search?name=${encodeURIComponent(radioName)}&limit=5`;
          const fbRes = await fetch(fallbackUrl);
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            if (fbData && fbData.length > 0) {
              playStation(fbData[0]);
              setCuriousSintonizing(null);
              return;
            }
          }
          setCurrentTrackTitle(
            appLanguage === "es" 
              ? `Fuera de Cobertura: ${radioName}` 
              : appLanguage === "pt"
              ? `Fora de Cobertura: ${radioName}`
              : appLanguage === "fr"
              ? `Hors de Portée : ${radioName}`
              : `Out of Coverage: ${radioName}`
          );
          setTimeout(() => {
            if (currentStation) {
              setCurrentTrackTitle(t.senal_en_vivo);
            } else {
              setCurrentTrackTitle(appLanguage === "es" ? "Apagado" : appLanguage === "pt" ? "Desconectado" : appLanguage === "fr" ? "Éteint" : "Offline");
            }
          }, 3500);
        }
      }
    } catch (e) {
      console.error("Error searching in curious radios:", e);
    } finally {
      setCuriousSintonizing(null);
    }
  };

  // Playlist Management Functions passed to Modal
  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      stations: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRenamePlaylist = (playlistId: string, newName: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p))
    );
  };

  const handleAddStationToPlaylist = (playlistId: string, station: Station) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          // Prevent duplicates in same playlist
          if (p.stations.some((s) => s.stationuuid === station.stationuuid)) {
            return p;
          }
          return { ...p, stations: [...p.stations, station] };
        }
        return p;
      })
    );
  };

  const handleRemoveStationFromPlaylist = (playlistId: string, stationUuid: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return {
            ...p,
            stations: p.stations.filter((s) => s.stationuuid !== stationUuid),
          };
        }
        return p;
      })
    );
  };

  // Search Logic (Real-time typed with no ACCEPT button!)
  // "no debe haber un boton de aceptar la busqueda se busca automaticamente a medida que se escribe."
  useEffect(() => {
    if (isVoiceSearchActiveRef.current) {
      isVoiceSearchActiveRef.current = false;
      return;
    }
    const delayDebounce = setTimeout(async () => {
      const cleanQuery = searchQuery.trim();
      if (cleanQuery.length > 1) {
        setSearchLoading(true);
        setSearchOffset(0);
        setHasMoreSearch(true);
        setSearchType("typed");
        setSearchParam(cleanQuery);
        try {
          let url = `/api/radio/search?name=${encodeURIComponent(cleanQuery)}&limit=30&offset=0`;
          if (selectedCountryCode) {
            url += `&countrycode=${selectedCountryCode}`;
          }
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            // Find any match in curated podcasts
            const q = cleanQuery.toLowerCase();
            const matchingPodcasts = CURATED_PODCASTS.filter((p) => 
              p.name.toLowerCase().includes(q) || 
              (p.tags && p.tags.toLowerCase().includes(q)) ||
              (p.country && p.country.toLowerCase().includes(q))
            );

            // Avoid listing duplicate objects in results
            const filteredData = data.filter((item: Station) => 
              !matchingPodcasts.some((p) => p.stationuuid === item.stationuuid)
            );

            setSearchResults([...matchingPodcasts, ...filteredData]);
            if (data.length === 0) {
              setHasMoreSearch(false);
            }
          }
        } catch (error) {
          console.error("Error searching stations:", error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        // Only empty searchResults if user has actually typed empty / short queries
        // and we aren't displaying clicked category results
        if (cleanQuery.length === 0 && searchType === "typed") {
          setSearchResults([]);
          setHasMoreSearch(false);
        }
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCountryCode]);

  // Voice Search recognition trigger using Web Speech API
  const startVoiceRecognition = () => {
    setVoiceError(null);
    setVoiceAssistantFeedback(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const errorMsg = appLanguage === "es" 
        ? "El reconocimiento de voz no está soportado en este navegador. Intenta con Google Chrome o Safari." 
        : "Voice recognition is not supported in this browser. Please try using Google Chrome or Safari.";
      setVoiceError(errorMsg);
      setVoiceShowToast(true);
      setTimeout(() => setVoiceShowToast(false), 5000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = appLanguage === "es" ? "es-ES" : appLanguage === "pt" ? "pt-BR" : appLanguage === "fr" ? "fr-FR" : "en-US";

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        const isIframe = window.self !== window.top;
        if (event.error === "not-allowed") {
          setVoiceError(appLanguage === "es" 
            ? `Permiso de micrófono denegado. ${isIframe ? "Abre la aplicación en una pestaña nueva con el botón superior para otorgar permisos." : ""}` 
            : `Microphone permission denied. ${isIframe ? "Open the app in a new tab using the top button to grant permissions." : ""}`
          );
        } else {
          setVoiceError(appLanguage === "es" 
            ? "Error al escuchar. Por favor, asegúrate de hablar claro e inténtalo de nuevo." 
            : "Error listening. Please speak clearly and try again."
          );
        }
        setIsVoiceListening(false);
        setVoiceShowToast(true);
        setTimeout(() => setVoiceShowToast(false), 8000);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript || !transcript.trim()) return;

        setSearchLoading(true);
        setVoiceAssistantFeedback({
          es: `Procesando comando: "${transcript}"...`,
          en: `Processing command: "${transcript}"...`
        });
        setVoiceShowToast(true);

        try {
          const res = await fetch("/api/voice-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: transcript })
          });

          if (!res.ok) {
            throw new Error("Failed to process voice request");
          }

          const data = await res.json();
          
          isVoiceSearchActiveRef.current = true;
          setSearchQuery(data.searchParam);
          setSearchResults(data.stations);
          setSearchType("typed");
          
          if (data.countryCode) {
            setSelectedCountryCode(data.countryCode);
          }

          setVoiceAssistantFeedback({
            es: data.feedback_es,
            en: data.feedback_en
          });

          if (Array.isArray(data.stations) && data.stations.length > 0) {
            playStation(data.stations[0]);
          }

          // Hide toast after 8 seconds
          setTimeout(() => {
            setVoiceShowToast(false);
          }, 8000);
        } catch (err: any) {
          console.error("Voice action processing error:", err);
          setVoiceError(appLanguage === "es" ? "Error al procesar el comando de voz." : "Error processing voice command.");
          setTimeout(() => setVoiceShowToast(false), 4000);
        } finally {
          setSearchLoading(false);
        }
      };

      recognition.start();
    } catch (e: any) {
      console.error(e);
      setVoiceError(e.message || "Error starting speech recognition");
      setVoiceShowToast(true);
    }
  };

  // Handler for Geolocation search "Cerca mío"
  const handleGeoSearch = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }

    setSearchLoading(true);
    setActiveTab(1); // switch to Search Tab
    setSearchQuery("Cargando radios cerca mío...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const locale = navigator.language; // e.g. "es-AR", "es-ES", "en-US"
          const countryCode = locale.split("-")[1] || "ES"; 
          
          setSelectedCountryCode(countryCode);
          setSearchQuery(""); // clear text
          setSearchOffset(0);
          setHasMoreSearch(true);
          setSearchType("georadio");
          setSearchParam(countryCode);
          
          // Fetch local country radios
          const url = `/api/radio/search?countrycode=${countryCode}&limit=30&offset=0`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
              setHasMoreSearch(false);
            }
          }
        } catch (e) {
          console.error("Geo lookup failed", e);
        } finally {
          setSearchLoading(false);
        }
      },
      (error) => {
        alert("No se pudo obtener tu ubicación. Por favor acepta los permisos.");
        setSearchLoading(false);
        setSearchQuery("");
      }
    );
  };

  // Podcast state and handlers
  const [podcastSearchQuery, setPodcastSearchQuery] = useState<string>("");
  const [podcastSearchResults, setPodcastSearchResults] = useState<any[]>([]);
  const [podcastSearchLoading, setPodcastSearchLoading] = useState<boolean>(false);
  const [selectedPodcast, setSelectedPodcast] = useState<any | null>(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState<any[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState<boolean>(false);
  const [loadingMoreEpisodes, setLoadingMoreEpisodes] = useState<boolean>(false);
  const [episodesLimit, setEpisodesLimit] = useState<number>(35);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState<boolean>(true);

  const handleSearchPodcasts = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!podcastSearchQuery.trim()) return;

    setPodcastSearchLoading(true);
    setPodcastSearchResults([]);
    setSelectedPodcast(null);
    try {
      const response = await fetch(`/api/podcasts/search?term=${encodeURIComponent(podcastSearchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          setPodcastSearchResults(data.results);
        }
      }
    } catch (err) {
      console.error("Error searching podcasts:", err);
    } finally {
      setPodcastSearchLoading(false);
    }
  };

  const fetchEpisodes = async (id: string) => {
    setEpisodesLoading(true);
    setPodcastEpisodes([]);
    setEpisodesLimit(35);
    setHasMoreEpisodes(true);
    try {
      const response = await fetch(`/api/podcasts/episodes?id=${encodeURIComponent(id)}&limit=35`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const eps = data.results.slice(1);
          setPodcastEpisodes(eps);
          if (data.results.length < 35) {
            setHasMoreEpisodes(false);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching episodes:", err);
    } finally {
      setEpisodesLoading(false);
    }
  };

  const loadMoreEpisodes = async () => {
    if (!selectedPodcast || loadingMoreEpisodes) return;
    setLoadingMoreEpisodes(true);
    const newLimit = episodesLimit + 50;
    setEpisodesLimit(newLimit);
    try {
      const response = await fetch(`/api/podcasts/episodes?id=${encodeURIComponent(selectedPodcast.collectionId)}&limit=${newLimit}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const eps = data.results.slice(1);
          setPodcastEpisodes(eps);
          if (data.results.length < newLimit) {
            setHasMoreEpisodes(false);
          } else {
            setHasMoreEpisodes(true);
          }
        } else {
          setHasMoreEpisodes(false);
        }
      }
    } catch (err) {
      console.error("Error loading more episodes:", err);
    } finally {
      setLoadingMoreEpisodes(false);
    }
  };

  const loadAllEpisodes = async () => {
    if (!selectedPodcast || loadingMoreEpisodes) return;
    setLoadingMoreEpisodes(true);
    const extremeLimit = 400;
    setEpisodesLimit(extremeLimit);
    try {
      const response = await fetch(`/api/podcasts/episodes?id=${encodeURIComponent(selectedPodcast.collectionId)}&limit=${extremeLimit}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const eps = data.results.slice(1);
          setPodcastEpisodes(eps);
          setHasMoreEpisodes(false);
        }
      }
    } catch (err) {
      console.error("Error loading all episodes:", err);
    } finally {
      setLoadingMoreEpisodes(false);
    }
  };

  const handlePodcastClick = (podcast: any) => {
    const curatedIds: Record<string, string> = {
      "podcast-venganza-sera-terrible": "1272807965",
      "podcast-game-theory": "1579298275",
      "podcast-greeking-out": "1483256515",
      "podcast-stuff-you-should-know": "278981407",
      "podcast-la-cruda": "1512068860",
      "podcast-ted-talks-daily": "160904630",
      "podcast-nadie-sabe-nada": "665143133",
      "podcast-radio-ambulante": "527614348",
    };

    const itunesId = podcast.collectionId || curatedIds[podcast.stationuuid];
    if (itunesId) {
      setSelectedPodcast({
        collectionId: itunesId,
        collectionName: podcast.name || podcast.collectionName,
        artistName: podcast.country || podcast.author || podcast.artistName || "Podcast",
        artworkUrl100: podcast.favicon || podcast.artworkUrl100 || podcast.artworkUrl600,
      });
      fetchEpisodes(itunesId.toString());
    } else {
      playStation(podcast);
    }
  };

  const playEpisode = (episode: any, podcast: any) => {
    const audioUrl = episode.episodeUrl || episode.enclosureUrl || "";
    const stationObject: Station = {
      stationuuid: audioUrl || `episode-${episode.trackId || Math.random()}`,
      name: episode.trackName || "Episodio sin título",
      url: audioUrl,
      url_resolved: audioUrl,
      favicon: episode.artworkUrl60 || podcast.artworkUrl100 || podcast.artworkUrl600 || "",
      tags: `Podcast | ${podcast.collectionName || "iTunes"}`,
      country: podcast.artistName || "Podcaster",
      language: "es",
      isPodcast: true,
    };
    playStation(stationObject);
  };

  // Preset Searches
  const handleGenreCardClick = async (tag: string) => {
    setSearchQuery(tag);
    setActiveTab(1);
    setSearchLoading(true);
    setSearchOffset(0);
    setHasMoreSearch(true);
    setSearchType("genre");
    setSearchParam(tag);
    try {
      const response = await fetch(`/api/radio/search?tag=${encodeURIComponent(tag)}&limit=30&offset=0`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        if (data.length === 0) {
          setHasMoreSearch(false);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  // Paginated "cargar más" fetcher
  const loadMoreSearchResults = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    const nextOffset = searchOffset + 30;
    let url = `/api/radio/search?limit=30&offset=${nextOffset}`;

    if (searchType === "typed") {
      url += `&name=${encodeURIComponent(searchParam)}`;
      if (selectedCountryCode) {
        url += `&countrycode=${selectedCountryCode}`;
      }
    } else if (searchType === "genre") {
      url += `&tag=${encodeURIComponent(searchParam)}`;
    } else if (searchType === "country") {
      url += `&country=${encodeURIComponent(searchParam)}`;
    } else if (searchType === "georadio") {
      url += `&countrycode=${searchParam}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setSearchResults((prev) => {
            const existingUuids = new Set(prev.map((s) => s.stationuuid));
            const uniqueNew = data.filter((s: Station) => !existingUuids.has(s.stationuuid));
            return [...prev, ...uniqueNew];
          });
          setSearchOffset(nextOffset);
          if (data.length === 0) {
            setHasMoreSearch(false);
          }
        } else {
          setHasMoreSearch(false);
        }
      } else {
        setHasMoreSearch(false);
      }
    } catch (e) {
      console.error("Error loading more search results:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  // Genre list with custom colors designed following Golden Ratio and cover images on the right
  const genresList = [
    { name: "Rock", color: "from-red-950/80 to-amber-900 border-red-500/10", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=150&q=80" },
    { name: "Blues", color: "from-blue-950/80 to-slate-900 border-blue-500/10", image: "https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&w=150&q=80" },
    { name: "Jazz", color: "from-amber-950/80 to-yellow-900 border-amber-500/10", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=150&q=80" },
    { name: "Pop", color: "from-pink-950/80 to-rose-900 border-pink-500/10", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" },
    { name: "K-pop", color: "from-indigo-950/80 to-purple-900 border-indigo-500/10", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=150&q=80" },
    { name: "Tango", color: "from-red-950 to-orange-950 border-orange-500/10", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=150&q=80" },
    { name: "Salsa", color: "from-yellow-950 to-amber-900 border-yellow-500/10", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80" },
    { name: "Latin Music", color: "from-emerald-950 to-teal-900 border-emerald-500/10", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=150&q=80" },
    { name: "Country", color: "from-amber-950 to-zinc-900 border-amber-550/10", image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=150&q=80" },
    { name: "News", color: "from-zinc-900 to-neutral-900 border-zinc-700/10", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80" },
    { name: "Talk", color: "from-teal-950 to-emerald-900 border-teal-500/10", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80" },
    { name: "Classic", color: "from-stone-900 to-zinc-900 border-stone-500/10", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=150&q=80" },
  ];

  // Dynamic recommendations: matching current tags or played country
  const dynamicRecommendations = useMemo(() => {
    // If no history, just show standard recommended stations
    if (playHistory.length === 0 || !playHistory[0]?.station) {
      return recommendedStations.slice(0, 12);
    }
    // Filter out stations that have been played to keep recommendations fresh
    const playedUuids = new Set(playHistory.map(h => h.station?.stationuuid).filter(Boolean));
    const freshRecs = recommendedStations.filter(st => !playedUuids.has(st.stationuuid));
    return freshRecs.length > 0 ? freshRecs.slice(0, 12) : recommendedStations.slice(0, 12);
  }, [playHistory, recommendedStations]);

  // Deep personalized historical matching recommendations (divided in multiple cols/carousels)
  const customHistoryBasedRecommendations = useMemo(() => {
    if (!playHistory || playHistory.length === 0) return [];

    // Extract up to 3 distinct station history entries to build recommendation columns
    const uniqueHistoryStations: Station[] = [];
    const seenUuids = new Set<string>();
    for (const item of playHistory) {
      if (item.station && item.station.stationuuid && !seenUuids.has(item.station.stationuuid)) {
        seenUuids.add(item.station.stationuuid);
        uniqueHistoryStations.push(item.station);
        if (uniqueHistoryStations.length >= 3) break;
      }
    }

    // Combine pool of available stations safely
    const poolMap = new Map<string, Station>();
    [...(recommendedStations || []), ...(recentlyAddedStations || []), ...(grooveStations || []), ...(MOST_LISTENED_STATIONS || [])].forEach(s => {
      if (s && s.stationuuid) {
        poolMap.set(s.stationuuid, s);
      }
    });
    const pool = Array.from(poolMap.values());

    return uniqueHistoryStations.map((histStation) => {
      const histTags = (histStation.tags || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
      const histCountry = (histStation.countrycode || "").toUpperCase();
      const histLang = (histStation.language || "").toLowerCase();

      // Score and match each station from pool
      const scored = pool
        .map((st) => {
          if (st.stationuuid === histStation.stationuuid) return { station: st, score: -1 };
          let score = 0;

          // 1. Tag overlap matching (News, deportes, rock, classic etc)
          const stTags = (st.tags || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
          const commonTags = stTags.filter(t => histTags.includes(t));
          score += commonTags.length * 5;

          // 2. Same country matching
          if (st.countrycode && st.countrycode.toUpperCase() === histCountry) {
            score += 4;
          }

          // 3. Same language matching
          if (st.language && st.language.toLowerCase() === histLang) {
            score += 3;
          }

          // 4. Custom hand-crafted associations (e.g., Radio Rivadavia <-> Radio Mitre)
          const name1 = histStation.name.toLowerCase();
          const name2 = st.name.toLowerCase();
          if (
            (name1.includes("rivadavia") && name2.includes("mitre")) ||
            (name1.includes("mitre") && name2.includes("rivadavia")) ||
            (name1.includes("la red") && name2.includes("mitre")) ||
            (name1.includes("rivadavia") && name2.includes("la red"))
          ) {
            score += 25; // extremely high preference for similar legendary Argentine AM Talk/News radios
          }

          if (
            (name1.includes("del plata") && name2.includes("rivadavia")) ||
            (name1.includes("continental") && name2.includes("mitre"))
          ) {
            score += 20;
          }

          // Music style matches
          if (
            (name1.includes("rock") && name2.includes("rock")) ||
            (name1.includes("jazz") && name2.includes("jazz")) ||
            (name1.includes("pop") && name2.includes("pop"))
          ) {
            score += 15;
          }

          return { station: st, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const topRecs = scored.slice(0, 10).map(x => {
        // Mark as "new" if they are in the recentlyAddedStations
        const isNewRadio = recentlyAddedStations.some(r => r.stationuuid === x.station.stationuuid);
        return {
          ...x.station,
          isNew: isNewRadio
        };
      });

      return {
        sourceStation: histStation,
        recommendations: topRecs
      };
    }).filter(item => item.recommendations.length > 0);
  }, [playHistory, recommendedStations, recentlyAddedStations, grooveStations]);

  // Deep personalized favorites-based recommendations (rendered below favorites)
  const favoritesRecommendations = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];

    // Combine pool of available stations safely
    const poolMap = new Map<string, Station>();
    [
      ...(recommendedStations || []),
      ...(recentlyAddedStations || []),
      ...(grooveStations || []),
      ...(MOST_LISTENED_STATIONS || [])
    ].forEach(s => {
      if (s && s.stationuuid) {
        poolMap.set(s.stationuuid, s);
      }
    });

    const favUuids = new Set(favorites.map(f => f.stationuuid));
    const pool = Array.from(poolMap.values()).filter(st => !favUuids.has(st.stationuuid));

    return favorites.map((favStation) => {
      const favTags = (favStation.tags || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
      const favCountry = (favStation.countrycode || "").toUpperCase();
      const favLang = (favStation.language || "").toLowerCase();

      // Score and match each station from pool
      const scored = pool
        .map((st) => {
          let score = 0;

          // 1. Tag overlap matching (News, deportes, rock, classic etc)
          const stTags = (st.tags || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
          const commonTags = stTags.filter(t => favTags.includes(t));
          score += commonTags.length * 6;

          // 2. Same country matching
          if (st.countrycode && st.countrycode.toUpperCase() === favCountry) {
            score += 4;
          }

          // 3. Same language matching
          if (st.language && st.language.toLowerCase() === favLang) {
            score += 3;
          }

          // 4. Custom hand-crafted associations (e.g., Urbana Play <-> Rock & Pop, Metro, etc.)
          const name1 = favStation.name.toLowerCase();
          const name2 = st.name.toLowerCase();
          if (
            (name1.includes("urbana") && name2.includes("metro")) ||
            (name1.includes("metro") && name2.includes("urbana")) ||
            (name1.includes("urbana") && name2.includes("rock & pop")) ||
            (name1.includes("rock & pop") && name2.includes("urbana")) ||
            (name1.includes("metro") && name2.includes("rock & pop")) ||
            (name1.includes("rock & pop") && name2.includes("metro")) ||
            (name1.includes("urbana") && name2.includes("aspen")) ||
            (name1.includes("aspen") && name2.includes("urbana")) ||
            (name1.includes("blue") && name2.includes("urbana")) ||
            (name1.includes("urbana") && name2.includes("blue"))
          ) {
            score += 40; // High correlation for Urbana, Metro, Rock & Pop, Blue, Aspen
          }

          if (
            (name1.includes("rivadavia") && name2.includes("mitre")) ||
            (name1.includes("mitre") && name2.includes("rivadavia")) ||
            (name1.includes("la red") && name2.includes("mitre")) ||
            (name1.includes("mitre") && name2.includes("la red")) ||
            (name1.includes("la red") && name2.includes("rivadavia")) ||
            (name1.includes("rivadavia") && name2.includes("la red"))
          ) {
            score += 30; // High correlation for Argentine legendary AM
          }

          // Music style matches
          if (
            (name1.includes("rock") && name2.includes("rock")) ||
            (name1.includes("jazz") && name2.includes("jazz")) ||
            (name1.includes("pop") && name2.includes("pop"))
          ) {
            score += 15;
          }

          return { station: st, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const topRecs = scored.slice(0, 10).map(x => x.station);

      return {
        favStation,
        recommendations: topRecs
      };
    }).filter(item => item.recommendations.length >= 2);
  }, [favorites, recommendedStations, recentlyAddedStations, grooveStations]);

  const getPremiumGradient = (uuid: string) => {
    const gradients = [
      "linear-gradient(45deg, #ff5f6d, #ffc371)",
      "linear-gradient(45deg, #2193b0, #6dd5ed)",
      "linear-gradient(45deg, #ee9ca7, #ffdde1)",
      "linear-gradient(45deg, #43cea2, #185a9d)",
      "linear-gradient(45deg, #ba8baf, #185a9d)",
      "linear-gradient(45deg, #1f4037, #99f2c8)",
      "linear-gradient(45deg, #f85032, #e73827)",
      "linear-gradient(45deg, #8e2de2, #4a00e0)",
      "linear-gradient(45deg, #00c6ff, #0072ff)"
    ];
    let hash = 0;
    const str = uuid || "default-uuid";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-neutral-200 flex flex-col justify-between pb-16">
      {/* Top Warning banner for iframe microphone restriction */}
      {isInsideIframe && (
        <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-red-950 border-b border-red-500/25 text-center py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 relative z-50">
          <span className="text-[11px] sm:text-xs text-red-400 font-bold flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            {appLanguage === "es" 
              ? "📱 ¿Usando móvil? Abre la app en una pestaña nueva para otorgar permisos reales de micrófono/grabación y activar el buscador por voz." 
              : "📱 On mobile? Open the app in a new tab to grant real microphone/recording permissions and activate voice search."}
          </span>
          <a 
            href={window.location.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[11px] sm:text-xs bg-[#1DB954] text-black font-extrabold px-3 py-1 rounded-full hover:bg-[#1ed760] transition-colors inline-flex items-center gap-1 shrink-0"
          >
            {appLanguage === "es" ? "Abrir en Pestaña Nueva ⚡" : "Open in New Tab ⚡"}
          </a>
        </div>
      )}

      {/* Top Premium Navbar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6 py-3.5 md:py-4.5 border-b border-[#282828] bg-[#121212]/95 sticky top-0 z-40 backdrop-blur-md shadow-lg shadow-black/40">
        <div className="flex items-center gap-2 justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl hover:scale-105 hover:border-zinc-700 transition-all duration-300 shrink-0 group">
              {/* Outer ring pulsing */}
              <div className="absolute inset-0.5 rounded-lg bg-[#1DB954]/5 border border-[#1DB954]/25 animate-pulse"></div>
              {/* Monogram / Icon shape */}
              <svg className="w-6 h-6 md:w-7 md:h-7 text-[#1DB954]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                <path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6" />
                <path d="M12 22a10 10 0 0 1-10-10M12 18a6 6 0 0 1-6-6" className="opacity-80" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm md:text-base font-display font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Frecuencia <span className="text-[#1DB954] font-mono text-[10px] bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 font-extrabold tracking-widest uppercase">Ultimate</span>
              </h1>
              {t.inspirado && <p className="text-[9.5px] md:text-[11px] text-zinc-400 font-medium tracking-wide mt-0.5">{t.inspirado}</p>}
            </div>
          </div>
        </div>

        {/* COMPACT FLOATING PLAYER AT TOP */}
        {currentStation && (
          <div className="flex items-center gap-2 bg-zinc-900/95 border border-zinc-800 px-3 py-1.5 rounded-full shadow-lg max-w-full overflow-hidden shrink-0">
            {/* Favicon & Name */}
            <div className="flex items-center gap-2 border-r border-[#282828] pr-2.5 max-w-[150px] sm:max-w-[250px] shrink-0">
              <div className="w-5 h-5 shrink-0 rounded-full overflow-hidden border border-zinc-700/50">
                <StationCover 
                  station={currentStation} 
                  className={`w-full h-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`} 
                  isPlaying={isPlaying} 
                  forceSpinnerOnPlaying={false} 
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] md:text-[10.5px] font-bold text-white truncate max-w-[70px] sm:max-w-[150px]">
                  {currentStation.name}
                </span>
                {currentTrackTitle && (
                  <span 
                    className={`text-[8px] truncate max-w-[70px] sm:max-w-[150px] leading-tight select-none transition-all ${
                      isRealSong(currentTrackTitle) 
                        ? "animate-vibrate-subtle text-emerald-400 font-mono font-medium" 
                        : "text-zinc-500 font-sans"
                    }`}
                    title={currentTrackTitle}
                  >
                    {currentTrackTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Play controls */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Heart Favorite button */}
              <button
                id="player-fav-btn"
                onClick={() => toggleFavorite(currentStation)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-md ${
                  isFavorite(currentStation.stationuuid)
                    ? "bg-[#1DB954]/15 border-[#1DB954] text-[#1DB954]"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white hover:bg-zinc-850"
                }`}
                title="Favorito"
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorite(currentStation.stationuuid) ? "fill-current" : ""}`} />
              </button>

              {/* Skip backward button (hidden on vertical key mobile, visible on tablet/desktop) */}
              <button
                onClick={() => skipTime(-15)}
                className="hidden md:flex w-12 h-12 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-full transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 active:scale-95 shadow-md group"
                title="Retroceder 15s (según buffer)"
              >
                <RotateCcw className="w-[22px] h-[22px] text-amber-500 group-hover:scale-105 transition-transform" />
                <span className="text-[8.5px] font-bold font-mono text-zinc-500 group-hover:text-zinc-300 mt-0.5 leading-none">-15s</span>
              </button>

              {/* Play / Pause Toggle */}
              <button
                id="player-play-pause-btn"
                onClick={togglePlay}
                className="w-12 h-12 sm:w-15 sm:h-15 bg-white hover:bg-zinc-200 text-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center cursor-pointer shrink-0"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7.5 sm:h-7.5 fill-black text-black animate-scale-in" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7.5 sm:h-7.5 fill-black text-black ml-0.5 animate-scale-in" />
                )}
              </button>

              {/* Skip forward button (hidden on vertical mobile, visible on tablet/desktop) */}
              <button
                onClick={() => skipTime(15)}
                className="hidden md:flex w-12 h-12 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-full transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 active:scale-95 shadow-md group"
                title="Adelantar 15s"
              >
                <RotateCw className="w-[22px] h-[22px] text-[#1DB954]" />
                <span className="text-[8.5px] font-bold font-mono text-zinc-500 group-hover:text-zinc-300 mt-0.5 leading-none">+15s</span>
              </button>

              {/* STOP Button */}
              <button
                id="player-stop-btn"
                onClick={handleStop}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 text-red-500 hover:text-red-400 rounded-full transition-all hover:scale-105 shadow-md flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
                title="Stop / Apagar"
              >
                <Square className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Playlist Plus */}
              <button
                id="player-add-playlist-btn"
                onClick={() => setIsPlaylistModalOpen(true)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md shrink-0"
                title="Agregar a playlist"
              >
                <Plus className="w-5.5 h-5.5" />
              </button>

              {/* Share */}
              <button
                id="player-share-modal-btn"
                onClick={() => setIsShareModalOpen(true)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-850 text-zinc-400 hover:text-[#1DB954] rounded-full transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-md shrink-0"
                title="Compartir"
              >
                <Share2 className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Podcast Duration & Seek Bar */}
            {currentStation.isPodcast && (
              <div className="flex items-center gap-1.5 border-l border-[#282828] pl-2 shrink-0">
                <span className="text-[9px] text-zinc-400 font-mono">
                  {formatSeconds(podcastCurrentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={podcastDuration || 100}
                  value={podcastCurrentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.currentTime = val;
                      setPodcastCurrentTime(val);
                    }
                  }}
                  className="w-10 sm:w-16 accent-[#1DB954] h-1 bg-zinc-800 rounded-lg cursor-pointer transition-all"
                  title="Buscar tiempo"
                />
                <span className="text-[9px] text-zinc-500 font-mono">
                  {podcastDuration ? formatSeconds(podcastDuration) : "--:--"}
                </span>
              </div>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-1 border-l border-[#282828] pl-1.5 shrink-0">
              <button
                id="player-mute-btn"
                onClick={toggleMute}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-8 sm:w-12 accent-[#1DB954] h-0.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* User personalized metadata display */}
        <div className="flex items-center gap-3 relative justify-end">
          {/* Settings language picker cog wheel */}
          <div className="relative">
            <button
              id="app-language-settings-btn"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="p-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#1DB954] hover:bg-zinc-850 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
              title="Idioma / Language Settings"
            >
              <Settings className={`w-5.5 h-5.5 transition-transform duration-700 ${isLanguageDropdownOpen ? "rotate-90 text-[#1DB954]" : "hover:rotate-45"}`} />
            </button>
            {isLanguageDropdownOpen && (
              <div
                id="language-settings-dropdown"
                className="absolute right-0 mt-2.5 w-48 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 p-1 text-left"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-500 border-b border-[#282828] mb-1 font-mono">
                  {t.configurar_idioma}
                </div>
                {(["es", "en", "pt", "fr", "zh", "ru"] as const).map((lang) => (
                  <button
                    key={lang}
                    id={`language-option-${lang}`}
                    onClick={() => {
                      setAppLanguage(lang);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      appLanguage === lang
                        ? "bg-[#1DB954]/10 text-[#1DB954]"
                        : "text-zinc-300 hover:bg-zinc-850"
                    }`}
                  >
                    <span>
                      {lang === "es" && "Español (ES)"}
                      {lang === "en" && "English (EN)"}
                      {lang === "pt" && "Português (PT)"}
                      {lang === "fr" && "Français (FR)"}
                      {lang === "zh" && "中文 (ZH)"}
                      {lang === "ru" && "Русский (RU)"}
                    </span>
                    {appLanguage === lang && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main viewport Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* Loading Initial Data overlay */}
        {loadingInitial && (
          <div className="py-24 text-center flex flex-col items-center justify-center text-zinc-400 gap-3">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin"></div>
            </div>
            <p className="text-sm font-semibold animate-pulse">Sintonizando señales mundiales...</p>
          </div>
        )}

        {!loadingInitial && (
          <>
            {/* STUNNING ACTIVE LIVE SONG TRACKING & AI RECOGNITION WIDGET */}
            {currentStation && (
              <div className="w-full bg-[#121212]/90 border border-[#282828]/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 shadow-2xl relative overflow-hidden group select-none animate-fade-in">
                {/* Glowing decorative indicator */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-[#1DB954] to-emerald-600"></div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {isPlaying ? (
                      <div className="flex items-end gap-1 h-6">
                        <span className="w-1 bg-[#1DB954] h-3 rounded animate-bounce [animation-delay:0.1s]"></span>
                        <span className="w-1 bg-[#1DB954] h-5 rounded animate-bounce [animation-delay:0.3s]"></span>
                        <span className="w-1 bg-[#1DB954] h-2 rounded animate-bounce [animation-delay:0.2s]"></span>
                      </div>
                    ) : (
                      <Music className="w-6 h-6 text-[#1DB954]" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {isTimeShifted ? (
                        <button
                          onClick={handleGoToLive}
                          className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/20 leading-none flex items-center gap-1.5 cursor-pointer animate-pulse"
                          title={appLanguage === "es" ? "Haz clic para volver a la señal en vivo instantánea" : "Click to sync back to live airwaves"}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {appLanguage === "es" ? `Búfer: -${timeShiftDuration - timeShiftTime}s (Ir al Vivo ⚡)` : `Buffer: -${timeShiftDuration - timeShiftTime}s (Go Live ⚡)`}
                        </button>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#1DB954]/10 text-[#1DB954] px-2.5 py-0.5 rounded-full border border-[#1DB954]/20 leading-none">
                          ● {t.reproduciendo || "Reproduciendo en vivo"}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400 font-bold truncate max-w-[150px] sm:max-w-xs">
                        📻 {currentStation.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 
                        className={`text-sm sm:text-base font-bold truncate leading-tight tracking-tight pr-4 transition-all duration-300 ${
                          isRealSong(currentTrackTitle) 
                            ? "animate-vibrate-subtle text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]" 
                            : "text-white"
                        }`} 
                        title={currentTrackTitle}
                      >
                        {currentTrackTitle || "Sintonizando señal..."}
                      </h4>
                      {isRealSong(currentTrackTitle) && isPlaying && (
                        <span className="flex items-center gap-0.5 h-3 shrink-0 px-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] text-emerald-400 font-bold font-mono">
                          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                          <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                          <span className="w-0.5 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span>ICY</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end md:justify-start border-t border-zinc-800/60 md:border-t-0 pt-3 md:pt-0 shrink-0">
                  {/* COMPARTIR EMISORA BUTTON (Highly visible and optimized for vertical phone viewports) */}
                  <button
                    id="mobile-frequent-share-btn"
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex-1 md:flex-none px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-[#1DB954] font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shrink-0"
                    title={appLanguage === "es" ? "Compartir señal / código QR" : "Share broadcast / QR code"}
                  >
                    <Share2 className="w-4 h-4 text-[#1DB954]" />
                    <span>{appLanguage === "es" ? "Compartir" : "Share"}</span>
                  </button>
                  {isRealSong(currentTrackTitle) ? (
                    <button
                      onClick={() => identifyCurrentSong()}
                      disabled={identifyingSong}
                      className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#1DB954] hover:from-emerald-400 hover:to-emerald-500 disabled:from-zinc-800 disabled:to-zinc-850 disabled:text-zinc-500 text-black font-bold text-xs rounded-xl transition-all shadow-lg active:scale-95 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 fill-black text-black animate-pulse" />
                      {t.identificar_cancion || "Ver Detalles"}
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider select-none cursor-not-allowed">
                      📻 {t.senal_en_vivo}
                    </span>
                  )}

                  {/* ALTERNATIVE STREAM FORCING MECHANISM */}
                  {!currentStation.isPodcast && !currentStation.spotifyId && (
                    <button
                      onClick={handleForceAlternative}
                      disabled={isSearchingAlternatives}
                      className="flex-1 md:flex-none px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      title={appLanguage === "es" ? "Si la radio se detiene o no sintoniza, presiona para buscar otra frecuencia activa" : "If radio drops, tune another live stream server"}
                    >
                      <RotateCw className={`w-4 h-4 ${isSearchingAlternatives ? "animate-spin text-[#1DB954]" : "text-[#1DB954]"}`} />
                      <span>{appLanguage === "es" ? "Frecuencia Alterna" : "Alt Stream"}</span>
                    </button>
                  )}

                </div>
              </div>
            )}

            {/* TAB I: INICIO */}
            {activeTab === 0 && (
              <div className="space-y-8 animate-fade-in text-left">

                {/* STUNNING PREMIUM HERO BANNER */}
                <div className="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                  {/* Neon atmospheric glow */}
                  <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#1DB954]/5 rounded-full filter blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

                  <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-gradient-to-r from-emerald-950 to-zinc-900 border border-emerald-500/20 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {appLanguage === "es" ? "Sintonía de Precisión Global" : "Global Precision Sintonization"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight">
                      {appLanguage === "es" ? "Explora el éter del mundo en vivo" : "Explore the world's live airwaves"}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                      {appLanguage === "es" 
                        ? "Sintoniza al instante miles de frecuencias de radio, música de todo tipo, podcasts inteligentes, noticias globales y traducciones automáticas asistidas por IA." 
                        : "Tune in instantly to thousands of radio frequencies, multi-genre music, smart podcasts, global news, and real-time AI-powered translations."}
                    </p>
                  </div>

                  {/* Micro stats banner */}
                  <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto min-w-[240px] relative z-10">
                    <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex flex-col justify-center text-center backdrop-blur-sm hover:border-zinc-800 transition-colors">
                      <span className="text-xl font-mono font-black text-emerald-400">30,000+</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                        {appLanguage === "es" ? "Emisoras" : "Stations"}
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex flex-col justify-center text-center backdrop-blur-sm hover:border-zinc-800 transition-colors">
                      <span className="text-xl font-mono font-black text-indigo-400">180+</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                        {appLanguage === "es" ? "Países" : "Countries"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Scroll 1: Historico Recientes (Played unique history) */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    {t.recientemente_escuchadas}
                  </h3>
                  {playHistory.length === 0 ? (
                    <div className="bg-zinc-900/25 border border-zinc-900 rounded-xl p-6 text-center text-zinc-500 text-xs italic">
                      {t.sin_historial}
                    </div>
                  ) : (
                    <div 
                      className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                      onMouseDown={handleDragScroll}
                    >
                      {playHistory.map((station) => (
                        <div
                          key={station.stationuuid + "-history"}
                          className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center"
                          onClick={() => playStation(station)}
                        >
                          <div className="radio-img overflow-hidden">
                            <StationCover 
                              station={station} 
                              className="w-full h-full object-cover object-center" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                          </div>
                          <h4 className="radio-name text-left w-full">
                            {station.name}
                          </h4>
                          <p className="radio-sub text-left w-full">
                            {station.country || "Mundo"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Horizontal Scroll 2: Mis Estaciones Favoritas */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    {t.favoritos}
                  </h3>
                  {favorites.length === 0 ? (
                    <div className="bg-zinc-900/25 border border-zinc-900 p-8 rounded-xl text-center text-zinc-500 text-xs text-pretty">
                      {t.sin_favoritos}
                    </div>
                  ) : (
                    <div 
                      className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                      onMouseDown={handleDragScroll}
                    >
                      {favorites.map((station) => (
                        <div
                          key={station.stationuuid + "-fav"}
                          className="flex-shrink-0 snap-start cursor-pointer flex flex-col items-center w-[160px] min-w-[160px] max-w-[160px] bg-[#181818] p-4 rounded-xl transition-all duration-300 hover:bg-[#282828] hover:-translate-y-1 relative border border-zinc-900/50 hover:border-zinc-850"
                          onClick={() => playStation(station)}
                        >
                          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl">
                            <StationCover 
                              station={station} 
                              className="w-full h-full object-cover object-center mb-0" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                            <button
                              id={`fav-remove-icon-btn-${station.stationuuid}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(station);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 px-1.5 bg-black/60 rounded-full text-[#1DB954] hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <h4 className="radio-name text-left w-full font-bold text-white truncate text-sm">
                            {station.name}
                          </h4>
                          <div className="radio-sub text-left w-full text-xs text-zinc-500 truncate mt-0.5">
                            <TruncatedTags tags={station.tags} maxLength={15} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamically open carousels for favorites recommendations */}
                {favoritesRecommendations.map((item, index) => (
                  <div key={`fav-recs-carousel-${item.favStation.stationuuid}-${index}`} className="animate-fade-in space-y-3">
                    <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                      <span>
                        {t.como_elegiste || "Como elegiste "}
                        <span className="text-emerald-400 font-extrabold">{item.favStation.name}</span>
                        {t.te_recomendamos || ", te recomendamos:"}
                      </span>
                    </h3>
                    <div 
                      className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                      onMouseDown={handleDragScroll}
                    >
                      {item.recommendations.map((station) => (
                        <div
                          key={station.stationuuid + "-fav-rec-" + item.favStation.stationuuid}
                          className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center"
                          onClick={() => playStation(station)}
                        >
                          <div className="radio-img overflow-hidden">
                            <StationCover 
                              station={station} 
                              className="w-full h-full object-cover object-center" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                          </div>
                          <h4 className="radio-name text-left w-full text-sm font-semibold truncate leading-normal">
                            {station.name}
                          </h4>
                          <p className="radio-sub text-left w-full text-xs text-zinc-500 truncate mt-0.5">
                            {station.country || "Mundo"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Horizontal Scroll for Cult Podcasts requested by user */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <Radio className="w-5 h-5 text-[#1DB954]" />
                    {{
                      es: "Podcasts Exclusivos & Shows Populares",
                      en: "Exclusive Podcasts & Popular Shows",
                      pt: "Podcasts Exclusivos & Shows Populares",
                      fr: "Podcasts Exclusifs & Émissions Populaires"
                    }[appLanguage] || "Exclusive Podcasts & Popular Shows"}
                  </h3>
                  <div 
                    className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {CURATED_PODCASTS.map((station) => (
                      <div
                        key={station.stationuuid + "-curated-podcast"}
                        className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center group relative border border-[#282828]/20 hover:border-[#1DB954]/20 transition-all rounded-xl"
                        onClick={() => handlePodcastClick(station)}
                      >
                        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl">
                           <StationCover 
                              station={station} 
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mb-0" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                          <span className="absolute top-2 left-2 bg-[#1DB954] text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shadow z-10">
                            PODCAST
                          </span>
                        </div>
                        <h4 className="radio-name text-left w-full font-semibold group-hover:text-[#1DB954] transition-colors">
                          {station.name}
                        </h4>
                        <p className="radio-sub text-left w-full text-zinc-400">
                          {station.country || "Mundo"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. PODCAST A MEDIDA */}
                <div className="bg-[#181818] border border-[#282828]/60 p-6 rounded-2xl text-left space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#282828] pb-3">
                    <div>
                      <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#1DB954]" />
                        {{
                          es: "Podcast a medida",
                          en: "Tailored Podcast",
                          pt: "Podcasts sob medida",
                          fr: "Podcasts sur mesure",
                          zh: "定制播客",
                          ru: "Подкасты на заказ"
                        }[appLanguage] || "Tailored Podcast"}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {{
                          es: "Descubre producciones globales seleccionadas por idioma y tus temas de interés.",
                          en: "Discover global productions filtered by language and topics of interest.",
                          pt: "Descubra produções globais filtradas por idioma e tópicos de interesse.",
                          fr: "Découvrez des productions mondiales filtrées par langue et sujets d'intérêt.",
                          zh: "发现根据语言和您感兴趣的话题筛选出来的全球播客制作。",
                          ru: "Слушайте мировые подкасты, отсортированные по языку и интересующим вас темам."
                        }[appLanguage]}
                      </p>
                    </div>

                    {/* Language & Genre Controls */}
                    <div className="flex flex-wrap gap-2">
                      {/* Language buttons */}
                      <div className="bg-[#121212] p-1 rounded-xl flex gap-1 border border-zinc-805">
                        {(["es", "en", "fr"] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setCustomPodcastLang(lang)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              customPodcastLang === lang
                                ? "bg-[#1DB954] text-black"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {lang === "es" && "ES"}
                            {lang === "en" && "EN"}
                            {lang === "fr" && "FR"}
                          </button>
                        ))}
                      </div>

                      {/* Genre buttons */}
                      <div className="bg-[#121212] p-1 rounded-xl flex gap-1 border border-zinc-805">
                        {(["comedia", "psicologia", "economia"] as const).map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setCustomPodcastTopic(topic)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                              customPodcastTopic === topic
                                ? "bg-[#1DB954] text-black"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {topic === "comedia" && (
                              { es: "Comedia", en: "Comedy", fr: "Comédie", pt: "Comédia", zh: "喜剧", ru: "Комедия" }[appLanguage] || "Comedy"
                            )}
                            {topic === "psicologia" && (
                              { es: "Psicología", en: "Psychology", fr: "Psychologie", pt: "Psicologia", zh: "心理学", ru: "Психология" }[appLanguage] || "Psychology"
                            )}
                            {topic === "economia" && (
                              { es: "Economía", en: "Economics", fr: "Économie", pt: "Economia", zh: "经济学", ru: "Экономика" }[appLanguage] || "Economics"
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic podcast search output list */}
                  {loadingCustomPodcasts ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 py-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-[#121212] p-3 rounded-xl h-[170px] flex flex-col gap-2">
                          <div className="aspect-square bg-zinc-850 rounded-lg w-full"></div>
                          <div className="h-3 bg-zinc-850 rounded w-4/5"></div>
                          <div className="h-2 bg-zinc-850 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : customPodcasts.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      No se encontraron resultados. Por favor, selecciona otro tema o idioma.
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none">
                      {customPodcasts.map((podcast: any) => (
                        <div
                          key={podcast.collectionId + "-custom-podcast"}
                          className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center group relative border border-[#282828]/20 hover:border-[#1DB954]/20 transition-all rounded-xl"
                          onClick={() => handlePodcastClick(podcast)}
                        >
                          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl animate-fade-inBg">
                            <img
                              src={podcast.artworkUrl100}
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=128&q=80`;
                              }}
                              className="radio-img w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mb-0"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-2 left-2 bg-[#1DB954] text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shadow z-10">
                              PODCAST
                            </span>
                          </div>
                          <h4 className="radio-name text-left w-full font-semibold group-hover:text-[#1DB954] transition-colors truncate">
                            {podcast.collectionName}
                          </h4>
                          <p className="radio-sub text-left w-full text-zinc-400 truncate">
                            {podcast.artistName || "Podcast"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BUSCADOR DE PODCASTS DE ITUNES */}
                <div className="bg-[#181818] border border-[#282828]/60 p-6 rounded-2xl text-left space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#282828] pb-3">
                    <div>
                      <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                        <Radio className="w-5 h-5 text-[#1DB954]" />
                        {t.buscador_podcasts || "Buscador Global de Podcasts iTunes"}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {t.buscador_podcasts_sub || "Busca millones de episodios en todo el mundo. Teclea palabras clave como Dolina, Rock, Blues o un tema, y sintoniza al instante."}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSearchPodcasts} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={podcastSearchQuery}
                        onChange={(e) => setPodcastSearchQuery(e.target.value)}
                        placeholder={t.buscador_input_placeholder || "Buscar por título, autor, género (ej. Dolina, Blues, Noticias)..."}
                        className="w-full bg-[#121212] border border-[#282828] text-white rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954] transition-all"
                      />
                      <Search className="absolute left-3.5 top-3 text-zinc-500 w-4 h-4" />
                    </div>
                    <button
                      type="submit"
                      disabled={podcastSearchLoading}
                      className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      {podcastSearchLoading ? (t.buscando_btn || "Buscando...") : (t.buscar_btn || "Buscar")}
                    </button>
                  </form>

                  {/* Search Results Grid */}
                  {podcastSearchResults.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400">
                          {appLanguage === "en" ? "Results found:" : appLanguage === "pt" ? "Resultados encontrados:" : appLanguage === "fr" ? "Résultats trouvés :" : "Resultados encontrados:"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPodcastSearchResults([])}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold uppercase font-mono tracking-wider cursor-pointer"
                        >
                          {appLanguage === "en" ? "Clear" : appLanguage === "pt" ? "Limpar" : appLanguage === "fr" ? "Effacer" : "Limpiar"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                        {podcastSearchResults.map((podcast: any) => (
                          <div
                            key={podcast.collectionId}
                            onClick={() => handlePodcastClick(podcast)}
                            className="bg-[#121212] hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-750 p-2.5 rounded-xl cursor-pointer flex items-center gap-3 transition-all group"
                          >
                            <img
                              src={podcast.artworkUrl100}
                              alt={podcast.collectionName}
                              className="w-12 h-12 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=128&q=80`;
                              }}
                              referrerPolicy="no-referrer"
                            />
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">
                                {podcast.collectionName}
                              </h4>
                              <p className="text-[10px] text-zinc-400 truncate mb-0.5">
                                {podcast.artistName}
                              </p>
                              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold px-1 rounded uppercase inline-block">
                                {podcast.primaryGenreName || "Podcast"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {podcastSearchLoading && (
                    <div className="py-6 text-center text-xs text-zinc-500 animate-pulse font-mono">
                      {appLanguage === "en" ? "Synchronizing with Apple iTunes servers..." : appLanguage === "pt" ? "Sincronizando com servidores da Apple iTunes..." : appLanguage === "fr" ? "Synchronisation avec les serveurs Apple iTunes..." : "Sincronizando con los servidores de Apple iTunes..."}
                    </div>
                  )}
                </div>

                {/* Custom History-Based Recommendations */}
                {customHistoryBasedRecommendations.map((item, idx) => (
                  <div key={`custom-history-rec-${idx}`}>
                    <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span>
                        {t.porque_escuchaste}
                        <span className="text-emerald-400 font-extrabold">{item.sourceStation.name}</span>
                        {t.te_podria_gustar}
                      </span>
                    </h3>
                    <div 
                      className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                      onMouseDown={handleDragScroll}
                    >
                      {item.recommendations.map((station) => (
                        <div
                          key={station.stationuuid + "-hist-rec-" + idx}
                          className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center"
                          onClick={() => playStation(station)}
                        >
                          <div className="radio-img overflow-hidden">
                            <StationCover 
                              station={station} 
                              className="w-full h-full object-cover object-center" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                          </div>
                          <h4 className="radio-name text-left w-full">
                            {station.name}
                          </h4>
                          <p className="radio-sub text-left w-full">
                            {station.country || "Mundial"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Horizontal Scroll 3: Radio Recomendadas (Based on Play selection) */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    {t.recomienda}
                  </h3>
                  <div 
                    className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {dynamicRecommendations.map((station) => (
                      <div
                        key={station.stationuuid + "-rec"}
                        className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center"
                        onClick={() => playStation(station)}
                      >
                        <div className="radio-img overflow-hidden">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover object-center" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                        </div>
                        <h4 className="radio-name text-left w-full">
                          {station.name}
                        </h4>
                        <p className="radio-sub text-left w-full">
                          {station.country || "Mundial"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizontal Scroll 4: Recientemente Incorporadas */}
                <div className="pb-4">
                  <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    {t.recientes}
                  </h3>
                  <div 
                    className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {recentlyAddedStations.map((station) => (
                      <div
                        key={station.stationuuid + "-recent"}
                        className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center"
                        onClick={() => playStation(station)}
                      >
                        <div className="radio-img overflow-hidden">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover object-center" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                        </div>
                        <h4 className="radio-name text-left w-full">
                          {station.name}
                        </h4>
                        <div className="radio-sub text-left w-full text-xs">
                          <TruncatedTags tags={station.tags} maxLength={15} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizontal Scroll 5: Las Radios Más Escuchadas Del Mundo (Bigger Covers, Spotify Style with Country Filters) */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 select-none">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
                        <Globe className="w-6 h-6 text-pink-500 animate-pulse" />
                        {t.mas_escuchadas_titulo}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans leading-relaxed">
                        {t.mas_escuchadas_sub}
                      </p>
                    </div>

                    {/* Country Tabs Segmented Control */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar self-start md:self-auto max-w-full">
                      {[
                        { code: "ALL", label: "🌐 All", labelEs: "🌐 Todo" },
                        { code: "US", label: "🇺🇸 USA", labelEs: "🇺🇸 USA" },
                        { code: "GB", label: "🇬🇧 UK", labelEs: "🇬🇧 UK" },
                        { code: "ES", label: "🇪🇸 Spain", labelEs: "🇪🇸 España" },
                        { code: "BR", label: "🇧🇷 Brazil", labelEs: "🇧🇷 Brasil" },
                        { code: "AR", label: "🇦🇷 Argentina", labelEs: "🇦🇷 Argentina" },
                        { code: "VE", label: "🇻🇪 Venezuela", labelEs: "🇻🇪 Venezuela" },
                        { code: "MX", label: "🇲🇽 Mexico", labelEs: "🇲🇽 México" }
                      ].map((tab) => (
                        <button
                          key={tab.code}
                          onClick={() => setSelectedCountryFilter(tab.code)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                            selectedCountryFilter === tab.code
                              ? "bg-white border-white text-black shadow-lg"
                              : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          {appLanguage === "es" ? tab.labelEs : tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div 
                    className="flex gap-5 overflow-x-auto pt-2 pb-5 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {(selectedCountryFilter === "ALL"
                      ? MOST_LISTENED_STATIONS
                      : MOST_LISTENED_STATIONS.filter(s => s.countrycode === selectedCountryFilter)
                    ).map((station) => (
                      <div
                        key={station.stationuuid + "-topworld"}
                        className="min-w-[210px] max-w-[210px] sm:min-w-[250px] sm:max-w-[250px] p-4 bg-[#181818]/60 border border-zinc-800/40 hover:bg-[#282828]/80 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 relative group flex flex-col items-center select-none cursor-pointer shadow-lg active:scale-95"
                        onClick={() => playStation(station)}
                      >
                        <div className="relative w-full aspect-square mb-3.5 overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                          {/* Spotify-style circular green play icon */}
                          <div className="absolute bottom-3.5 right-3.5 bg-[#1DB954] text-black w-12 h-12 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-[#1ed760] active:scale-95 z-10">
                            <Play className="w-5.5 h-5.5 fill-black text-black ml-0.5 animate-none" />
                          </div>
                        </div>
                        <div className="w-full text-left px-1">
                          <h4 className="text-sm font-bold text-white truncate w-full group-hover:text-[#1DB954] transition-colors leading-tight mb-1" title={station.name}>
                            {station.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none mb-3">
                            {station.country || "GLOBALED"}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(station.tags || "").split(",").slice(0, 2).map((tg, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-zinc-950/80 text-zinc-400 px-2.5 py-0.5 rounded-md border border-zinc-900/60 leading-none">
                                {tg.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizontal Scroll 6: Radios Con Reconocimiento En Vivo (ICY Metadata, FIP, KEXP, etc.) */}
                <div>
                  <div className="flex flex-col mb-1 select-none">
                    <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
                      <Radio className="w-6 h-6 text-[#1DB954]" />
                      {t.reconocimiento_titulo}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans leading-relaxed">
                      {t.reconocimiento_sub}
                    </p>
                  </div>
                  <div 
                    className="flex gap-5 overflow-x-auto pt-3 pb-6 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {recognitionStations.map((station) => (
                      <div
                        key={station.stationuuid + "-recometadata"}
                        className="min-w-[210px] max-w-[210px] sm:min-w-[250px] sm:max-w-[250px] p-4 bg-[#181818]/60 border border-zinc-800/40 hover:bg-[#282828]/80 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 relative group flex flex-col items-center select-none cursor-pointer shadow-lg active:scale-95"
                        onClick={() => playStation(station)}
                      >
                        {/* Flashing Metadata sensor tag */}
                        <div className="absolute top-6 left-6 z-10 flex items-center gap-1 bg-black/80 backdrop-blur-md text-[#1DB954] text-[8px] font-black uppercase px-2.5 py-1 rounded-full shadow-md border border-[#1DB954]/25 tracking-wider font-mono">
                          <span className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-ping"></span>
                          <span>ICY TRACK</span>
                        </div>

                        <div className="relative w-full aspect-square mb-3.5 overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                          {/* Spotify-style circular green play icon */}
                          <div className="absolute bottom-3.5 right-3.5 bg-[#1DB954] text-black w-12 h-12 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-[#1ed760] active:scale-95 z-10">
                            <Play className="w-5.5 h-5.5 fill-black text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="w-full text-left px-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full group-hover:text-[#1DB954] transition-colors leading-tight mb-1" title={station.name}>
                            {station.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none mb-3">
                            {station.country || "RADIO ID"}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(station.tags || "").split(",").slice(0, 2).map((tg, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-zinc-950/80 text-[#1DB954]/90 px-2.5 py-0.5 rounded border border-[#1DB954]/10 leading-none">
                                {tg.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. GROOVE SELECTION */}
                <div className="space-y-4">
                  {/* Big Hero Visual Plate card */}
                  <div className="relative w-full h-[180px] sm:h-[240px] rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-black via-zinc-950/80 to-transparent group">
                    <img 
                      src="https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=1200&q=80"
                      alt="Groove Station Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-[1.02] transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-orange-950/20 to-black/80 pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-xl text-left space-y-2">
                      <span className="p-1 px-3 rounded-full bg-amber-500/15 text-amber-400 text-[9px] font-black uppercase tracking-widest border border-amber-500/25">
                        ⚡ {appLanguage === "es" ? "Sabor Retro" : "Top Atmosphere"}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tighter leading-none">
                        {appLanguage === "es" ? "Estilo Groove: Funk, Soul & Rhythms" : "The Groove Box: Funk, Soul & R&B"}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                        {appLanguage === "es" 
                          ? "Sintoniza el ritmo inconfundible de los bajos profundos, vientos dorados de los sets analógicos y toda la calidez del vinilo." 
                          : "Tune into the soul-stirring basslines, golden brass sections, and warm analog atmosphere of raw live groove feeds."}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Scroll for Groove Stations */}
                  <div 
                    className="flex gap-5 overflow-x-auto pt-2 pb-6 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {grooveStations.map((station) => (
                      <div
                        key={station.stationuuid + "-groove"}
                        className="min-w-[170px] max-w-[170px] sm:min-w-[210px] sm:max-w-[210px] p-3.5 bg-[#181818]/60 border border-zinc-800/40 hover:bg-[#282828]/80 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 relative group flex flex-col items-center select-none cursor-pointer shadow-lg active:scale-95"
                        onClick={() => playStation(station)}
                      >
                        <div className="relative w-full aspect-square mb-3.5 overflow-hidden rounded-xl shadow-lg">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                          <div className="absolute bottom-3.5 right-3.5 bg-amber-500 text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95">
                            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="w-full text-left px-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full group-hover:text-amber-400 transition-colors leading-tight mb-1" title={station.name}>
                            {station.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none">
                            {station.country || "GROOVESTATION"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SCIENCE COLLECTION */}
                <div className="space-y-4">
                  {/* Big Hero Visual Science card */}
                  <div className="relative w-full h-[180px] sm:h-[240px] rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-black via-zinc-950/80 to-transparent group">
                    <img 
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                      alt="Science Radio Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-[1.02] transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black/80 pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-xl text-left space-y-2">
                      <span className="p-1 px-3 rounded-full bg-cyan-500/15 text-cyan-400 text-[9px] font-black uppercase tracking-widest border border-cyan-500/25">
                        🔬 {appLanguage === "es" ? "Conocimiento" : "Knowledge"}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tighter leading-none">
                        {appLanguage === "es" ? "Explorador de Ciencia" : "The Science Vault: Global Broadcasts"}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                        {appLanguage === "es" 
                          ? "Sintoniza transmisiones y podcasts dedicados al espacio, astrofísica, avances científicos, documentales y sabidurías planetarias." 
                          : "Tune into broadcasts and talk streams revolving around astrophysics, space explorations, quantum discoveries, and nature journals."}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Scroll for Science Stations */}
                  <div 
                    className="flex gap-5 overflow-x-auto pt-2 pb-6 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {scienceStations.map((station) => (
                      <div
                        key={station.stationuuid + "-science"}
                        className="min-w-[170px] max-w-[170px] sm:min-w-[210px] sm:max-w-[210px] p-3.5 bg-[#181818]/60 border border-zinc-800/40 hover:bg-[#282828]/80 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 relative group flex flex-col items-center select-none cursor-pointer shadow-lg active:scale-95"
                        onClick={() => playStation(station)}
                      >
                        <div className="relative w-full aspect-square mb-3.5 overflow-hidden rounded-xl shadow-lg">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                          <div className="absolute bottom-3.5 right-3.5 bg-cyan-500 text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95">
                            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="w-full text-left px-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full group-hover:text-cyan-400 transition-colors leading-tight mb-1" title={station.name}>
                            {station.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none">
                            {station.country || "SCI-STATION"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. WORLDWIDE HITS */}
                <div className="space-y-4">
                  {/* Big Hero Visual Hits card */}
                  <div className="relative w-full h-[180px] sm:h-[240px] rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-black via-zinc-950/80 to-transparent group">
                    <img 
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                      alt="Hits Radio Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-[1.02] transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-red-950/20 to-black/80 pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-xl text-left space-y-2">
                      <span className="p-1 px-3 rounded-full bg-rose-500/15 text-rose-400 text-[9px] font-black uppercase tracking-widest border border-rose-500/25">
                        🔥 {appLanguage === "es" ? "Tendencia Mundial" : "Global Trending"}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tighter leading-none">
                        {appLanguage === "es" ? "Hits del Mundo" : "Worldwide Hits: Live Airwaves"}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                        {appLanguage === "es" 
                          ? "Las frecuencias radiales más cotizadas y populares de la actualidad. Sintoniza los charts número uno del pop, dance e indie global." 
                          : "The biggest dynamic frequencies spinning today's charts. Connect straight to top-rated Pop, Dance, and EDM hits across nations."}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Scroll for World Hits */}
                  <div 
                    className="flex gap-5 overflow-x-auto pt-2 pb-6 snap-x no-scrollbar drag-scroll-container select-none"
                    onMouseDown={handleDragScroll}
                  >
                    {worldHitsStations.map((station) => (
                      <div
                        key={station.stationuuid + "-hits"}
                        className="min-w-[170px] max-w-[170px] sm:min-w-[210px] sm:max-w-[210px] p-3.5 bg-[#181818]/60 border border-zinc-800/40 hover:bg-[#282828]/80 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 relative group flex flex-col items-center select-none cursor-pointer shadow-lg active:scale-95"
                        onClick={() => playStation(station)}
                      >
                        <div className="relative w-full aspect-square mb-3.5 overflow-hidden rounded-xl shadow-lg">
                          <StationCover 
                            station={station} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                            forceSpinnerOnPlaying 
                          />
                          <div className="absolute bottom-3.5 right-3.5 bg-rose-500 text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95">
                            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                          </div>
                        </div>
                        <div className="w-full text-left px-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full group-hover:text-rose-400 transition-colors leading-tight mb-1" title={station.name}>
                            {station.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none">
                            {station.country || "WORLDHITS"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECCIÓN MOODS: TUS RADIOS SEGÚN TU ESTADO DE ÁNIMO */}
                <div className="space-y-6 pt-4 border-t border-[#282828]/60 text-left">
                  <div className="text-left space-y-1">
                    <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                      {{
                        es: "Tus radios según tu estado de ánimo",
                        en: "Your Radios by Mood",
                        pt: "Suas rádios de acordo com o seu humor",
                        fr: "Vos radios selon votre humeur",
                        zh: "根据您的心情选择电台",
                        ru: "Ваши радиостанции под настроение"
                      }[appLanguage] || "Your Radios by Mood"}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {MOODS_DATA.find(m => m.id === selectedMood)?.desc[appLanguage] || "Sintoniza la frecuencia que encaja con lo que sientes hoy."}
                    </p>
                  </div>

                  {/* Mood Selector Buttons: horizontal scroll for convenience & style */}
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x no-scrollbar">
                    {MOODS_DATA.map((mood) => {
                      const isActive = selectedMood === mood.id;
                      return (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                            isActive
                              ? "bg-rose-500/15 border-rose-500 text-rose-400 font-bold shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                              : "bg-[#121212] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <span className="text-base">{mood.emoji}</span>
                          <span className="text-xs sm:text-sm whitespace-nowrap">{mood.title[appLanguage] || mood.title["en"]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Curated Carousel of stations for the selected mood */}
                  {loadingMood ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar drag-scroll-container select-none">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-[#181818] p-4 rounded-xl min-w-[140px] max-w-[140px] flex flex-col gap-3">
                          <div className="aspect-square bg-zinc-850 rounded-lg w-full"></div>
                          <div className="h-4 bg-zinc-850 rounded w-3/4"></div>
                          <div className="h-3 bg-zinc-850 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : moodStations.length === 0 ? (
                    <div className="bg-[#121212] border border-[#282828]/50 p-8 rounded-2xl text-center">
                      <p className="text-sm text-zinc-500">
                        {{
                          es: "No se encontraron emisoras activas para este estado de ánimo en este momento.",
                          en: "No active stations found for this mood right now.",
                          pt: "Nenhuma rádio ativa encontrada para este humor no momento.",
                          fr: "Aucune station active trouvée pour cette humeur en ce moment.",
                          zh: "当前未找到适用于该心情的活动电台。",
                          ru: "В данный момент активных радиостанций для этого настроения не найдено."
                        }[appLanguage]}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar drag-scroll-container select-none"
                      onMouseDown={handleDragScroll}
                    >
                      {moodStations.map((station) => (
                        <div
                          key={station.stationuuid + "-mood-" + selectedMood}
                          className="radio-card flex-shrink-0 snap-start cursor-pointer flex flex-col items-center group relative border border-[#282828]/20 hover:border-[#1DB954]/20 transition-all rounded-xl"
                          onClick={() => playStation(station)}
                        >
                          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl">
                            <StationCover 
                              station={station} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 mb-0" 
                              isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                              forceSpinnerOnPlaying 
                            />
                            <div className="absolute bottom-2.5 right-2.5 bg-rose-500 text-black w-8 h-8 rounded-full flex items-center justify-center opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95">
                              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                            </div>
                          </div>
                          <h4 className="radio-name text-left w-full truncate font-bold text-sm group-hover:text-rose-400 transition-colors">
                            {station.name}
                          </h4>
                          <p className="radio-sub text-left w-full text-xs text-zinc-500 truncate mt-0.5">
                            {station.country || "GLOBAL CHANNEL"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECCIÓN ADICIONAL: RADIOS DEL MUNDO PARA MENTES CURIOSAS */}
                <div id="curious-minds-radios-section" className="space-y-6 pt-8 border-t border-[#282828]/60 text-left">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="text-left space-y-2 max-w-2xl">
                      <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
                        <Compass className="w-5 h-5 text-[#1DB954] animate-pulse" />
                        {CURIOUS_SECTION_I18N[appLanguage]?.title || CURIOUS_SECTION_I18N["es"].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans pr-4">
                        {CURIOUS_SECTION_I18N[appLanguage]?.desc || CURIOUS_SECTION_I18N["es"].desc}
                      </p>
                    </div>

                    {/* Simple search bar inside Curious region */}
                    <div className="relative w-full md:w-64">
                      <input
                        id="curious-search-input"
                        type="text"
                        value={curiousFilterText}
                        onChange={(e) => setCuriousFilterText(e.target.value)}
                        placeholder={appLanguage === "es" ? "Filtrar por emisora..." : "Filter by station..."}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954] transition-all"
                      />
                      <Search className="absolute left-3 top-3 text-zinc-400 w-3.5 h-3.5" />
                      {curiousFilterText && (
                        <button
                          id="curious-search-clear-btn"
                          type="button"
                          onClick={() => setCuriousFilterText("")}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Elegant inner navigation for curated curious choices with Carousel arrows */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-900/80 gap-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        id="curious-tab-top10-btn"
                        type="button"
                        onClick={() => {
                          setCuriousSubTab("top10");
                          setCuriousFilterText("");
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          curiousSubTab === "top10"
                            ? "bg-[#1DB954] text-black shadow-[0_4px_12px_rgba(29,185,84,0.25)]"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {CURIOUS_SECTION_I18N[appLanguage]?.top10Title || CURIOUS_SECTION_I18N["es"].top10Title}
                      </button>
                      <button
                        id="curious-tab-all-btn"
                        type="button"
                        onClick={() => {
                          setCuriousSubTab("all");
                          setCuriousFilterText("");
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          curiousSubTab === "all"
                            ? "bg-[#1DB954] text-black shadow-[0_4px_12px_rgba(29,185,84,0.25)]"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {CURIOUS_SECTION_I18N[appLanguage]?.allCountriesTitle || CURIOUS_SECTION_I18N["es"].allCountriesTitle}
                      </button>
                    </div>

                    {/* Carousel Left/Right indicators in the lane header */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          if (curiousSubTab === "top10") scrollCuriousTop10("left");
                          else scrollCuriousAll("left");
                        }}
                        className="w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                        title="Scroll Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (curiousSubTab === "top10") scrollCuriousTop10("right");
                          else scrollCuriousAll("right");
                        }}
                        className="w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                        title="Scroll Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-tab I: Top 10 Curated Carousel Lane */}
                  {curiousSubTab === "top10" && (
                    <div className="space-y-4">
                      <p className="text-xs text-zinc-500 italic px-1 font-sans">
                        {CURIOUS_SECTION_I18N[appLanguage]?.selectionCombo || CURIOUS_SECTION_I18N["es"].selectionCombo}
                      </p>

                      <div
                        ref={curiousTop10ScrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-2.5 -mx-2 px-2"
                      >
                        {CURIOUS_TOP_10.filter((st) => {
                          if (!curiousFilterText) return true;
                          return (
                            st.name.toLowerCase().includes(curiousFilterText.toLowerCase()) ||
                            st.country.toLowerCase().includes(curiousFilterText.toLowerCase())
                          );
                        }).map((stationItem, idx) => {
                          const isConnectingThis = curiousSintonizing === stationItem.name;
                          const isCurrentlyPlayingThis =
                            currentStation?.name.toLowerCase().includes(stationItem.name.toLowerCase()) ||
                            stationItem.name.toLowerCase().includes(currentStation?.name.toLowerCase() || "");
                          const isActivePlaying = isCurrentlyPlayingThis && isPlaying;

                          return (
                            <div
                              id={`curious-top10-card-${idx}`}
                              key={stationItem.name + "-top10-" + idx}
                              onClick={() => handleCuriousRadioClick(stationItem.name, stationItem.searchQuery)}
                              className={`flex-shrink-0 w-64 sm:w-72 snap-start p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left select-none relative h-36 overflow-hidden shadow-lg group ${
                                isCurrentlyPlayingThis
                                  ? "bg-emerald-950/20 border-[#1DB954] text-white shadow-[#1DB954]/5 ring-1 ring-[#1DB954]/30"
                                  : "bg-zinc-900/40 border-zinc-900/60 hover:bg-zinc-900/80 hover:border-zinc-800"
                              }`}
                            >
                              {/* Background ambient radial glow depending on active status */}
                              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] pointer-events-none transition-colors duration-500 ${
                                isCurrentlyPlayingThis ? "bg-[#1DB954]/10" : "bg-purple-500/5 group-hover:bg-amber-500/10"
                              }`} />

                              {/* Top Bar inside Card */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-3xl drop-shadow-md select-none">{stationItem.flag}</span>
                                  <span className="text-[9px] bg-zinc-800/80 text-zinc-400 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                    {getTranslatedCountryName(stationItem.country, appLanguage)}
                                  </span>
                                </div>

                                <div className="shrink-0">
                                  {isConnectingThis ? (
                                    <div className="w-8 h-8 rounded-full bg-zinc-950/80 border border-zinc-850 flex items-center justify-center">
                                      <Loader2 className="w-4 h-4 text-[#1DB954] animate-spin" />
                                    </div>
                                  ) : isActivePlaying ? (
                                    <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                                      <span className="flex items-end gap-0.5 h-3">
                                        <span className="w-[1.5px] h-2 bg-black rounded-full animate-bounce" />
                                        <span className="w-[1.5px] h-3 bg-black rounded-full animate-bounce [animation-delay:0.15s]" />
                                        <span className="w-[1.5px] h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.3s]" />
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-950/50 hover:bg-[#1DB954]/90 border border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-md">
                                      <Play className="w-3.5 h-3.5 text-[#1DB954] fill-current translate-x-0.5" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Naming descriptors */}
                              <div className="space-y-1 relative z-10">
                                <h4 className={`text-sm sm:text-base font-extrabold truncate pr-2 transition-colors ${
                                  isCurrentlyPlayingThis ? "text-[#1DB954]" : "text-white group-hover:text-amber-500"
                                }`}>
                                  {stationItem.name}
                                </h4>
                                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-sans">
                                  {appLanguage === "es" ? "Sintonizador Recomendado" : "Recommended Tuner"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab II: All Countries explorer with Carousel Lane */}
                  {curiousSubTab === "all" && (
                    <div className="space-y-5">
                      {/* Horizontal list of countries as filters */}
                      <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar border-b border-zinc-900/60">
                        <button
                          id="curious-country-all-btn"
                          type="button"
                          onClick={() => setCuriousCountrySelected("all")}
                          className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            curiousCountrySelected === "all"
                              ? "bg-zinc-200 text-black font-extrabold"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          🌐 {appLanguage === "es" ? "Todos" : "All"}
                        </button>
                        {CURIOUS_COUNTRIES_DATA.map((c, cIdx) => (
                          <button
                            id={`curious-country-btn-${cIdx}`}
                            key={c.country}
                            type="button"
                            onClick={() => setCuriousCountrySelected(c.country)}
                            className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              curiousCountrySelected === c.country
                                ? "bg-zinc-200 text-black font-extrabold"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span>{getTranslatedCountryName(c.country, appLanguage)}</span>
                          </button>
                        ))}
                      </div>

                      {/* Horizontal All Countries Stations Carousel */}
                      <div
                        ref={curiousAllCountriesScrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-2.5 -mx-2 px-2"
                      >
                        {CURIOUS_COUNTRIES_DATA.filter((countryObj) => {
                          if (curiousCountrySelected === "all") return true;
                          return countryObj.country === curiousCountrySelected;
                        }).map((countryObj) => {
                          const matchingStations = countryObj.stations.filter((st) => {
                            if (!curiousFilterText) return true;
                            return (
                              st.name.toLowerCase().includes(curiousFilterText.toLowerCase()) ||
                              st.desc.toLowerCase().includes(curiousFilterText.toLowerCase())
                            );
                          });

                          return matchingStations.map((st, sIdx) => {
                            const isConnectingThisObj = curiousSintonizing === st.name;
                            const isCurrentlyPlayingThisObj =
                              currentStation?.name.toLowerCase().includes(st.name.toLowerCase()) ||
                              st.name.toLowerCase().includes(currentStation?.name.toLowerCase() || "");
                            const isActivePlayingObj = isCurrentlyPlayingThisObj && isPlaying;

                            return (
                              <div
                                id={`curious-country-card-${countryObj.country}-${sIdx}`}
                                key={st.name + "-" + countryObj.country + "-" + sIdx}
                                onClick={() => handleCuriousRadioClick(st.name, st.searchQuery)}
                                className={`flex-shrink-0 w-72 sm:w-80 snap-start p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left select-none relative h-36 overflow-hidden shadow-lg group ${
                                  isCurrentlyPlayingThisObj
                                    ? "bg-emerald-950/20 border-[#1DB954] text-white shadow-[#1DB954]/5 ring-1 ring-[#1DB954]/30"
                                    : "bg-zinc-900/40 border-zinc-900/60 hover:bg-zinc-900/80 hover:border-zinc-800"
                                }`}
                              >
                                {/* Glow reflection */}
                                <div className={`absolute -right-4 -bottom-4 w-28 h-28 rounded-full blur-[45px] pointer-events-none transition-colors duration-500 ${
                                  isCurrentlyPlayingThisObj ? "bg-[#1DB954]/10" : "bg-[#1DB954]/5 group-hover:bg-[#1DB954]/10"
                                }`} />

                                {/* Header badge + status indicator */}
                                <div className="flex items-center justify-between gap-2 relative z-10">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-2xl drop-shadow-sm select-none">{countryObj.flag}</span>
                                    <span className="text-[9px] text-[#1DB954] font-black uppercase tracking-wider font-mono">
                                      {getTranslatedCountryName(countryObj.country, appLanguage)}
                                    </span>
                                  </div>

                                  <div className="shrink-0">
                                    {isConnectingThisObj ? (
                                      <div className="w-7 h-7 rounded-full bg-zinc-950/80 border border-zinc-850 flex items-center justify-center">
                                        <Loader2 className="w-3.5 h-3.5 text-[#1DB954] animate-spin" />
                                      </div>
                                    ) : isActivePlayingObj ? (
                                      <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center shadow-md">
                                        <span className="flex items-end gap-0.5 h-2.5">
                                          <span className="w-[1.2px] h-1.5 bg-black rounded-full animate-bounce" />
                                          <span className="w-[1.2px] h-2.2 bg-black rounded-full animate-bounce [animation-delay:0.1s]" />
                                          <span className="w-[1.2px] h-1 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="w-7 h-7 rounded-full bg-zinc-950/50 hover:bg-[#1DB954]/90 border border-zinc-850 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                                        <Play className="w-3 h-3 text-[#1DB954] fill-current translate-x-0.5" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Summary details of the radio channel */}
                                <div className="mt-2 text-left relative z-10 flex-grow min-w-0 flex flex-col justify-end">
                                  <h4 className={`text-xs sm:text-sm font-extrabold truncate leading-tight transition-colors ${
                                    isCurrentlyPlayingThisObj ? "text-[#1DB954]" : "text-white group-hover:text-amber-500"
                                  }`}>
                                    {st.name}
                                  </h4>
                                  <p className="text-[10.5px] text-zinc-400 mt-1 line-clamp-2 leading-snug font-sans font-light">
                                    {st.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Exclusive Literary Tuning: Books + Radio/Podcast Recommendations Section */}
                <BooksPodcastsSintonizador
                  appLanguage={appLanguage}
                  onPlayPodcast={handlePodcastClick}
                  onSearchRadio={(query) => {
                    setSearchQuery(query);
                    setSearchType("typed");
                    setActiveTab(1);
                  }}
                />
                <div id="synesthesia-section" className="space-y-6 pt-8 border-t border-[#282828]/60 text-left">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="text-left space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
                          <Sparkles className="w-6 h-6 text-[#1DB954] animate-pulse" />
                          <span>Synesthesia</span>
                        </h3>
                        <span className="bg-gradient-to-r from-purple-600 to-[#1DB954] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow animate-pulse">
                          BETA
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1DB954] font-medium tracking-wide">
                        {appLanguage === "es" ? "Escuchá lo que ves" :
                         appLanguage === "pt" ? "Escute o que você vê" :
                         appLanguage === "fr" ? "Écoutez ce que vous voyez" :
                         "Listen to what you see"}
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-4 pt-1">
                        {appLanguage === "es" ? "Sube un dibujo, paisaje, foto, meme o ilustración. Nuestra Inteligencia Artificial analizará su estilo visual, colores, emociones y texturas para recomendarte radios en vivo perfectas que sintonicen con esa imagen." :
                         appLanguage === "pt" ? "Envie um desenho, paisagem, foto, meme ou ilustração. Nossa Inteligência Artificial analisará o estilo visual, cores, emoções e texturas para recomendar rádios perfeitas para sintonizar com essa imagem." :
                         appLanguage === "fr" ? "Téléchargez un dessin, un paysage, une photo, un même ou une illustration. Notre IA analysera le style visuel, les couleurs, les émotions et les textures pour recommander des radios en direct parfaites." :
                         "Upload a drawing, landscape, photo, meme, or illustration. Our AI will analyze its visual style, colors, emotions, and textures to recommend perfect live radio stations that match the image."}
                      </p>
                    </div>
                  </div>

                  {/* DROPZONE / FILE UPLOAD */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-4">
                      <div
                        onDragOver={handleSynesthesiaDragOver}
                        onDragLeave={handleSynesthesiaDragLeave}
                        onDrop={handleSynesthesiaDrop}
                        onClick={() => document.getElementById("synesthesia-file-input")?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] relative overflow-hidden group ${
                          synesthesiaDragging
                            ? "border-[#1DB954] bg-[#1a2c1f]/20 shadow-[0_0_20px_rgba(29,185,84,0.15)] scale-[0.99]"
                            : "border-zinc-800 hover:border-[#1DB954]/50 bg-[#121212]/50 hover:bg-[#181818]/80"
                        }`}
                      >
                        <input
                          id="synesthesia-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSynesthesiaFileChange}
                        />

                        {synesthesiaImage ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src={synesthesiaImage}
                              alt="Uploaded visual stimulus"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center p-4">
                              <Sparkles className="w-8 h-8 text-[#1DB954] mb-2 drop-shadow-md" />
                              <span className="text-white text-xs font-bold bg-black/70 px-3 py-1.5 rounded-full border border-zinc-800">
                                {appLanguage === "es" ? "Cambiar imagen" :
                                 appLanguage === "pt" ? "Mudar imagem" :
                                 appLanguage === "fr" ? "Changer d'image" :
                                 "Change image"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800 group-hover:border-[#1DB954]/30 group-hover:scale-110 transition-all">
                              <Music className="w-5 h-5 text-zinc-400 group-hover:text-[#1DB954]" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-zinc-200">
                                {appLanguage === "es" ? "Arrastra una imagen aquí o haz clic" :
                                 appLanguage === "pt" ? "Arraste uma imagem aqui ou clique" :
                                 appLanguage === "fr" ? "Faites glisser une image ici ou cliquez" :
                                 "Drag an image here or click"}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {appLanguage === "es" ? "PNG, JPG, WEBP hasta 8MB" : "PNG, JPG, WEBP up to 8MB"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CLEAR BUTTON IF IMAGE PRE-EXISTENT */}
                      {synesthesiaImage && !synesthesiaLoading && (
                        <button
                          type="button"
                          onClick={() => {
                            setSynesthesiaImage(null);
                            setSynesthesiaMimeType(null);
                            setSynesthesiaResult(null);
                            setSynesthesiaError(null);
                            setSynesthesiaStep("idle");
                            setSynesthesiaUserDescription("");
                            setSynesthesiaFileName("");
                            setActiveSynesthesiaFile(null);
                          }}
                          className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold border border-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>
                            {appLanguage === "es" ? "Limpiar todo" :
                             appLanguage === "pt" ? "Limpar tudo" :
                             appLanguage === "fr" ? "Tout effacer" :
                             "Clear all"}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* STATUS AND RESULTS PANEL */}
                    <div className="lg:col-span-7 bg-[#121212]/40 border border-zinc-900 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[220px]">
                      {synesthesiaStep === "idle" && !synesthesiaError && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 py-8">
                          <Music className="w-8 h-8 text-zinc-700" />
                          <p className="text-xs sm:text-sm font-medium">
                            {appLanguage === "es" ? "Esperando un estímulo visual..." :
                             appLanguage === "pt" ? "Aguardando um estímulo visual..." :
                             appLanguage === "fr" ? "En attente d'un stimulus visuel..." :
                             "Waiting for a visual stimulus..."}
                          </p>
                          <p className="text-[11px] text-zinc-600 max-w-sm">
                            {appLanguage === "es" ? "Sube una imagen para activar el sintetizador de sintonías" :
                             appLanguage === "pt" ? "Envie uma imagem para ativar o sintetizador de sintonia" :
                             appLanguage === "fr" ? "Téléchargez une image pour activer le synthétiseur de tuning" :
                             "Upload an image to activate the tuner synthesizer"}
                          </p>
                        </div>
                      )}

                      {/* LOADING PROCESS STAGES */}
                      {synesthesiaLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 animate-pulse">
                          <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                              {synesthesiaStep === "uploading" && (
                                appLanguage === "es" ? "Sintetizando imagen..." : "Synthesizing image..."
                              )}
                              {synesthesiaStep === "analyzing_colors" && (
                                appLanguage === "es" ? "Analizando gama de colores..." : "Analyzing color palette..."
                              )}
                              {synesthesiaStep === "feeling_mood" && (
                                appLanguage === "es" ? "Decodificando estado de ánimo..." : "Decoding emotional mood..."
                              )}
                              {synesthesiaStep === "curating_music" && (
                                appLanguage === "es" ? "Curando frecuencias de radio en vivo..." : "Curating live radio frequencies..."
                              )}
                            </p>
                            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                              {synesthesiaStep === "uploading" && (
                                appLanguage === "es" ? "Subiendo archivo temporal a memoria segura." : "Uploading temporary file to safe memory."
                              )}
                              {synesthesiaStep === "analyzing_colors" && (
                                appLanguage === "es" ? "Extrayendo longitudes de onda cromáticas e iluminación." : "Extracting chromatic wavelengths and lighting."
                              )}
                              {synesthesiaStep === "feeling_mood" && (
                                appLanguage === "es" ? "Mapeando elements artísticos a vibraciones acústicas." : "Mapping artistic elements to acoustic vibrations."
                              )}
                              {synesthesiaStep === "curating_music" && (
                                appLanguage === "es" ? "Consultando la red global de Radio Browser." : "Querying global Radio Browser network."
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ERROR STATE */}
                      {synesthesiaError && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-8 text-red-400">
                          <X className="w-8 h-8 text-red-500/80 bg-red-500/10 p-1.5 rounded-full border border-red-500/25" />
                          <p className="text-sm font-bold">
                            {appLanguage === "es" ? "No pudimos sintonizar tu imagen" : "Failed to tune your image"}
                          </p>
                          <p className="text-xs text-zinc-500 max-w-sm">
                            {synesthesiaError}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (synesthesiaImage) {
                                startSynesthesiaAnalysis();
                              } else {
                                setSynesthesiaStep("idle");
                                setSynesthesiaError(null);
                              }
                            }}
                            className="mt-2 px-4 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-lg text-xs font-bold transition-all border border-[#1DB954] cursor-pointer"
                          >
                            {appLanguage === "es" ? "Reintentar" : "Retry"}
                          </button>
                        </div>
                      )}

                      {/* SUCCESS RESULT VIEW */}
                      {synesthesiaResult && !synesthesiaLoading && (
                        <div className="space-y-4 animate-fade-in text-left">
                          {/* Poetic AI explanation */}
                          <div className="space-y-1.5 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                            <span className="text-[10px] font-mono text-[#1DB954] uppercase tracking-wider font-black flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                              <span>
                                {appLanguage === "es" ? "Análisis de Frecuencia" :
                                 appLanguage === "pt" ? "Análise de Frequência" :
                                 appLanguage === "fr" ? "Analyse de Fréquence" :
                                 "Frequency Analysis"}
                              </span>
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans italic">
                              "{
                                appLanguage === "es" ? synesthesiaResult.explanation_es :
                                appLanguage === "pt" ? synesthesiaResult.explanation_pt :
                                appLanguage === "fr" ? synesthesiaResult.explanation_fr :
                                synesthesiaResult.explanation_en || synesthesiaResult.explanation_es
                              }"
                            </p>
                          </div>

                          {/* Recommended genre / query */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">
                              {appLanguage === "es" ? "Sintonía principal:" : "Primary tuning:"}
                            </span>
                            <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-950 to-zinc-900 border border-emerald-500/20 text-emerald-400 rounded-md text-xs font-bold">
                              {synesthesiaResult.recommended_query}
                            </span>
                          </div>

                          {/* Multi-category Results or Legacy fallback results */}
                          {synesthesiaResult.categories && synesthesiaResult.categories.length > 0 ? (
                            <div className="space-y-5 pt-1">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-black block">
                                {appLanguage === "es" ? "Categorías de Sintonía Detectadas:" : "Detected Tuning Categories:"}
                              </span>
                              
                              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                                {synesthesiaResult.categories.map((cat: any) => (
                                  <div key={cat.id} className="space-y-2 bg-[#1c1c1c]/30 p-3.5 rounded-xl border border-zinc-900 text-left">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                                        {
                                          appLanguage === "es" ? cat.name_es :
                                          appLanguage === "pt" ? cat.name_pt :
                                          appLanguage === "fr" ? cat.name_fr :
                                          cat.name_en
                                        }
                                      </h4>
                                      {cat.country_code && (
                                        <span className="text-[9px] text-[#1DB954] font-mono font-bold uppercase bg-[#1DB954]/10 border border-[#1DB954]/20 px-1.5 py-0.5 rounded">
                                          {cat.country_code}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                      {
                                        appLanguage === "es" ? cat.description_es :
                                        appLanguage === "pt" ? cat.description_pt :
                                        appLanguage === "fr" ? cat.description_fr :
                                        cat.description_en
                                      }
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                      {cat.stations && cat.stations.length > 0 ? (
                                        cat.stations.map((st: any) => {
                                          const isPlayingCurrent = currentStation?.stationuuid === st.stationuuid && isPlaying;
                                          return (
                                            <div
                                              key={st.stationuuid + "-cat-" + cat.id}
                                              onClick={() => playStation(st)}
                                              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer group/item text-left select-none ${
                                                isPlayingCurrent
                                                  ? "border-[#1DB954] bg-[#1a2c1f]/20 shadow-[0_4px_12px_rgba(29,185,84,0.05)]"
                                                  : "border-zinc-850/40 bg-[#161616]/30 hover:bg-[#202020]/75 hover:border-zinc-800"
                                              }`}
                                            >
                                              <div className="w-6 h-6 rounded overflow-hidden bg-zinc-900 border border-zinc-850 flex-shrink-0 flex items-center justify-center relative shadow-sm">
                                                {st.favicon ? (
                                                  <img
                                                    src={st.favicon}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                      (e.target as HTMLImageElement).style.display = "none";
                                                    }}
                                                  />
                                                ) : null}
                                                <Radio className="w-3 text-zinc-500 group-hover/item:text-[#1DB954] transition-colors absolute" />
                                              </div>

                                              <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] font-bold truncate ${
                                                  isPlayingCurrent ? "text-[#1DB954]" : "text-zinc-300 group-hover/item:text-white"
                                                }`}>
                                                  {st.name}
                                                </p>
                                                <p className="text-[9px] text-zinc-500 truncate">
                                                  {st.country || "Global"}
                                                </p>
                                              </div>

                                              <div className="flex-shrink-0 mr-1">
                                                {isPlayingCurrent ? (
                                                  <div className="flex items-end gap-0.5 h-2">
                                                    <span className="w-[1px] h-1 bg-[#1DB954] rounded-full animate-bounce" />
                                                    <span className="w-[1px] h-2 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <span className="w-[1px] h-0.5 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                  </div>
                                                ) : (
                                                  <Play className="w-2.5 h-2.5 text-zinc-500 group-hover/item:text-[#1DB954] transition-colors" />
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <p className="text-[10px] text-zinc-500 italic py-1 col-span-2">
                                          {appLanguage === "es" ? "No se encontraron emisoras activas para esta categoría." : "No active stations found for this category."}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* Legacy flat view */
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-black block">
                                {appLanguage === "es" ? "Emisoras en Vivo Encontradas:" : "Found Live Stations:"}
                              </span>

                              {synesthesiaResult.stations && synesthesiaResult.stations.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                                  {synesthesiaResult.stations.map((st) => {
                                    const isPlayingCurrent = currentStation?.stationuuid === st.stationuuid && isPlaying;
                                    return (
                                      <div
                                        key={st.stationuuid}
                                        onClick={() => playStation(st)}
                                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer group/item text-left select-none ${
                                          isPlayingCurrent
                                            ? "border-[#1DB954] bg-[#1a2c1f]/20 shadow-[0_4px_12px_rgba(29,185,84,0.05)]"
                                            : "border-zinc-850/60 bg-[#161616]/30 hover:bg-[#202020]/75 hover:border-zinc-800"
                                        }`}
                                      >
                                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center relative shadow-sm">
                                          {st.favicon ? (
                                            <img
                                              src={st.favicon}
                                              alt=""
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                              }}
                                            />
                                          ) : null}
                                          <Radio className="w-3.5 h-3.5 text-zinc-500 group-hover/item:text-[#1DB954] transition-colors absolute" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <p className={`text-xs font-bold truncate ${
                                            isPlayingCurrent ? "text-[#1DB954]" : "text-zinc-200 group-hover/item:text-white"
                                          }`}>
                                            {st.name}
                                          </p>
                                          <p className="text-[10px] text-zinc-500 truncate">
                                            {st.country || "Global"}
                                          </p>
                                        </div>

                                        <div className="flex-shrink-0 mr-1.5">
                                          {isPlayingCurrent ? (
                                            <div className="flex items-end gap-0.5 h-2.5">
                                              <span className="w-[1.5px] h-1.5 bg-[#1DB954] rounded-full animate-bounce" />
                                              <span className="w-[1.5px] h-2.5 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.15s]" />
                                              <span className="w-[1.5px] h-1 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.3s]" />
                                            </div>
                                          ) : (
                                            <Play className="w-3 h-3 text-zinc-500 group-hover/item:text-[#1DB954] transition-colors" />
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-zinc-500 italic py-1">
                                  {appLanguage === "es" ? "No se encontraron emisoras activas bajo esta categoría. Intenta con otra imagen." :
                                   "No active stations found under this category. Try uploading another image."}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB II: BUSCAR (Custom search engine with 2x2 grid & custom genre carousel) */}
            {activeTab === 1 && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* Search Bar with Microphone Button */}
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <label htmlFor={searchInputId} className="sr-only">Buscar emisoras, países o géneros</label>
                    <input
                      id={searchInputId}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (countrySelectorOpen) setCountrySelectorOpen(false);
                      }}
                      placeholder={t.buscar_placeholder}
                      className="w-full bg-[#181818] border border-[#282828] text-white rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-4 top-3.5 text-zinc-400 w-4 h-4" />
                    {searchQuery && (
                      <button
                        id="search-clear-btn"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCountryCode(null);
                        }}
                        className="absolute right-4 top-3.5 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Red Microphone Button for Voice Search */}
                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    title={appLanguage === "es" ? "Búsqueda por voz con IA" : "AI Voice Search"}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex-shrink-0 flex items-center justify-center ${
                      isVoiceListening
                        ? "bg-red-600 border-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                        : "bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-500 hover:bg-red-500/20 shadow-md"
                    }`}
                  >
                    <Mic className={`w-5 h-5 ${isVoiceListening ? "scale-110" : ""}`} />
                  </button>
                </div>

                {/* Country filter select feedback */}
                {selectedCountryCode && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 self-start text-xs text-emerald-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t.filtrando_pais}<strong>{selectedCountryCode}</strong></span>
                    <button
                      id="clear-country-filter-btn"
                      onClick={() => setSelectedCountryCode(null)}
                      className="ml-1.5 p-0.5 hover:bg-emerald-500/20 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Search Results Block (if typed or selected) */}
                {(searchQuery.trim().length > 1 || searchResults.length > 0) ? (
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-white tracking-tight flex items-center justify-between pb-2 border-b border-zinc-900">
                      <span>{t.resultados_busqueda}</span>
                      {searchLoading && <span className="text-xs text-emerald-400 animate-pulse">{t.buscando_btn}</span>}
                    </h3>

                    {searchResults.length === 0 && !searchLoading ? (
                      <div className="bg-zinc-900/40 p-12 text-center text-zinc-500 rounded-xl">
                        {t.ningun_resultado}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {searchResults.map((station) => (
                            <div
                              key={station.stationuuid + "-search-res"}
                              className="bg-[#181818] hover:bg-[#282828] border border-white/5 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer"
                              onClick={() => playStation(station)}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-11 h-11 relative flex-shrink-0">
                                  <StationCover 
                                    station={station} 
                                    className="w-11 h-11 object-cover rounded-lg bg-zinc-750 flex-shrink-0" 
                                    isPlaying={currentStation?.stationuuid === station.stationuuid && isPlaying} 
                                    forceSpinnerOnPlaying 
                                  />
                                </div>
                                <div className="overflow-hidden text-left flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-white truncate" title={station.name}>
                                    {station.name}
                                  </h4>
                                  <p className="text-xs text-zinc-400 truncate mb-0.5">
                                    {station.country || "Mundo"} • {station.language || "S/D"}
                                  </p>
                                  {station.tags && (
                                    <div className="text-[10px] text-zinc-500 leading-tight">
                                      <TruncatedTags tags={station.tags} maxLength={30} />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                id={`fav-toggle-btn-${station.stationuuid}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(station);
                                }}
                                className="p-2 hover:bg-[#3e3e3e] rounded-full text-zinc-400 hover:text-white transition-colors"
                              >
                                <Heart
                                  className={`w-4 h-4 ${isFavorite(station.stationuuid) ? "text-[#1DB954] fill-current" : ""}`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Infinite Pagination Loader */}
                        {searchResults.length > 0 && (
                          <div className="flex justify-center pt-4 pb-2">
                            <button
                              id="search-load-more-btn"
                              onClick={loadMoreSearchResults}
                              disabled={loadingMore}
                              className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/40 text-[#1DB954] text-xs font-bold tracking-wider uppercase rounded-full hover:bg-zinc-850 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {loadingMore ? (
                                <>
                                  <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-700 border-t-[#1DB954] animate-spin inline-block"></span>
                                  <span>{t.buscando_mas}</span>
                                </>
                              ) : (
                                <span>{t.buscar_mas}</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Search Presets */
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Primary Categories Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Grid Item 1: Musica */}
                      <button
                        id="grid-search-musica"
                        onClick={() => handleGenreCardClick("Jazz")}
                        className="h-28 bg-gradient-to-r from-emerald-950/85 to-teal-900 border border-white/5 rounded-2xl flex items-stretch overflow-hidden group cursor-pointer hover:border-[#1DB954]/30 transition-all text-left shadow-xl"
                      >
                        <div className="w-1/2 p-4 flex flex-col justify-between">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{t.categoria || "Categoría"}</span>
                          <h3 className="text-base font-display font-black text-white tracking-tight leading-tight">{t.musica || "Música"}</h3>
                          <span className="text-[10px] text-zinc-400">{t.estilos_directos || "Estilos y Directos"}</span>
                        </div>
                        <div className="w-1/2 relative overflow-hidden bg-zinc-850">
                          <img 
                            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=350&q=80" 
                            alt="Música" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-transparent to-transparent"></div>
                        </div>
                      </button>

                      {/* Grid Item 2: Podcast */}
                      <button
                        id="grid-search-podcast"
                        onClick={() => handleGenreCardClick("Talk")}
                        className="h-28 bg-gradient-to-r from-indigo-950/85 to-purple-900 border border-white/5 rounded-2xl flex items-stretch overflow-hidden group cursor-pointer hover:border-[#1DB954]/30 transition-all text-left shadow-xl"
                      >
                        <div className="w-1/2 p-4 flex flex-col justify-between">
                          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{t.categoria || "Categoría"}</span>
                          <h3 className="text-base font-display font-black text-white tracking-tight leading-tight">{t.podcast || "Podcast"}</h3>
                          <span className="text-[10px] text-zinc-400">{t.noticias_charlas || "Noticias y Charlas"}</span>
                        </div>
                        <div className="w-1/2 relative overflow-hidden bg-zinc-850">
                          <img 
                            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=350&q=80" 
                            alt="Podcast" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-transparent to-transparent"></div>
                        </div>
                      </button>

                      {/* Grid Item 3: Paises (Toggles A-to-Z directory drawer) */}
                      <button
                        id="grid-search-paises"
                        onClick={() => setCountrySelectorOpen(!countrySelectorOpen)}
                        className={`h-28 border rounded-2xl flex items-stretch overflow-hidden group cursor-pointer transition-all text-left shadow-xl ${
                          countrySelectorOpen
                            ? "bg-zinc-800 border-zinc-700"
                            : "bg-gradient-to-r from-yellow-950/85 to-amber-900 border-white/5 hover:border-[#1DB954]/30"
                        }`}
                      >
                        <div className="w-1/2 p-4 flex flex-col justify-between">
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{t.geografia || "Geografía"}</span>
                          <h3 className="text-base font-display font-black text-white tracking-tight leading-tight">{t.paises || "Países"}</h3>
                          <span className="text-[10px] text-zinc-400">{t.directorio_az || "Directorio A - Z"}</span>
                        </div>
                        <div className="w-1/2 relative overflow-hidden bg-zinc-850">
                          <img 
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=350&q=80" 
                            alt="Países" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-transparent to-transparent"></div>
                        </div>
                      </button>

                      {/* Grid Item 4: Cerca mio */}
                      <button
                        id="grid-search-cerca-mio"
                        onClick={handleGeoSearch}
                        className="h-28 bg-gradient-to-r from-pink-950/85 to-rose-900 border border-white/5 rounded-2xl flex items-stretch overflow-hidden group cursor-pointer hover:border-[#1DB954]/30 transition-all text-left shadow-xl"
                      >
                        <div className="w-1/2 p-4 flex flex-col justify-between">
                          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">{t.proximidad || "Proximidad"}</span>
                          <h3 className="text-base font-display font-black text-white tracking-tight leading-tight">{t.cerca_mio || "Cerca Mío"}</h3>
                          <span className="text-[10px] text-zinc-400">{t.sintonia_local || "Sintonía Local"}</span>
                        </div>
                        <div className="w-1/2 relative overflow-hidden bg-zinc-850">
                          <img 
                            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad5?auto=format&fit=crop&w=350&q=80" 
                            alt="Cerca Mío" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-900 via-transparent to-transparent"></div>
                        </div>
                      </button>
                    </div>

                    {/* A-to-Z Country List Selector Drawer */}
                    {countrySelectorOpen && (
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4 animate-fade-in text-left">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-amber-400" />
                            {t.directorio_az_completo || "Directorio de Países de la A a la Z"}
                          </h4>
                          <button
                            id="close-country-selector-btn"
                            onClick={() => setCountrySelectorOpen(false)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div 
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto pr-2 drag-scroll-container select-none"
                          onMouseDown={handleDragScroll}
                        >
                          {countriesList.map((c: any, index) => (
                            <button
                              id={`country-select-btn-${c.name}`}
                              key={c.name + index}
                              onClick={async () => {
                                setSelectedCountryCode(c.name);
                                setCountrySelectorOpen(false);
                                setSearchLoading(true);
                                setSearchOffset(0);
                                setHasMoreSearch(true);
                                setSearchType("country");
                                setSearchParam(c.name);
                                try {
                                  const response = await fetch(`/api/radio/search?country=${encodeURIComponent(c.name)}&limit=30&offset=0`);
                                  if (response.ok) {
                                    const data = await response.json();
                                    setSearchResults(data);
                                    if (data.length === 0) {
                                      setHasMoreSearch(false);
                                    }
                                  }
                                } catch (e) {
                                  console.error(e);
                                } finally {
                                  setSearchLoading(false);
                                }
                              }}
                              className="bg-zinc-950/40 hover:bg-zinc-800 border border-zinc-850 p-2 rounded-lg text-left text-xs truncate text-zinc-300 hover:text-white transition-colors"
                            >
                              📍 {c.name} ({c.stationcount})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Genre selection list - Dynamic Flex Split Layout (right half covers) */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-widest pl-0.5">
                        {t.explorar_generos_estilos || "Explorar todos los géneros / Estilos"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {genresList.map((genre) => (
                          <button
                            id={`tag-genre-btn-${genre.name}`}
                            key={genre.name}
                            onClick={() => handleGenreCardClick(genre.name)}
                            className="h-24 bg-gradient-to-r from-zinc-900 border border-white/5 rounded-2xl flex items-stretch overflow-hidden group cursor-pointer hover:border-[#1DB954]/25 transition-all text-left shadow-lg relative"
                          >
                            <div className="w-1/2 p-4 flex flex-col justify-between">
                              <h4 className="text-sm font-display font-bold text-white tracking-tight leading-tight truncate">
                                {genre.name}
                              </h4>
                              <span className="text-[10px] text-[#1DB954] font-bold tracking-widest uppercase">
                                {t.estilo || "Estilo"}
                              </span>
                            </div>
                            <div className="w-1/2 relative overflow-hidden bg-zinc-850">
                              <img
                                src={genre.image}
                                alt={genre.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent"></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB III: TRADUCIR */}
            {activeTab === 2 && (
              <div className="animate-fade-in">
                <LiveTranslator currentStation={currentStation} currentTitle={currentTrackTitle} appLanguage={appLanguage} />
              </div>
            )}

            {/* TAB IV: VER RECORTE Cassettes (Old-School Tapes View) */}
            {activeTab === 3 && (
              <div className="animate-fade-in space-y-4">
                <button
                  id="tape-view-back-btn"
                  onClick={() => setActiveTab(0)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {t.volver_inicio}
                </button>
                <OldSchoolRecorder
                  currentStation={currentStation}
                  isPlaying={isPlaying}
                  audioRef={audioRef}
                  recordedFragments={recordedFragments}
                  onAddFragment={(frag) => setRecordedFragments((prev) => [frag, ...prev])}
                  onDeleteFragment={(id) => setRecordedFragments((p) => p.filter((x) => x.id !== id))}
                  onGoToRecordings={() => {}}
                  showRecordingsOnly={true}
                  appLanguage={appLanguage}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Custom Bottom Modern Navigation Tabs bar */}
      <nav id="bottom-tabs-nav" className="fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-[#282828] px-6 py-2.5 z-40 flex justify-around max-w-7xl mx-auto backdrop-blur-xl">
        <button
          id="nav-tab-home-btn"
          onClick={() => setActiveTab(0)}
          className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
            activeTab === 0 || activeTab === 3 ? "text-[#1DB954]" : "text-zinc-500 hover:text-white"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>{t.inicio}</span>
        </button>

        <button
          id="nav-tab-search-btn"
          onClick={() => setActiveTab(1)}
          className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
            activeTab === 1 ? "text-[#1DB954]" : "text-zinc-500 hover:text-white"
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{t.buscar}</span>
        </button>

        <button
          id="nav-tab-mic-btn"
          onClick={() => {
            setActiveTab(1);
            startVoiceRecognition();
          }}
          className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
            isVoiceListening ? "text-red-500 font-bold animate-pulse" : "text-zinc-500 hover:text-white"
          }`}
          title={appLanguage === "es" ? "Búsqueda por voz con IA" : "AI Voice Search"}
        >
          <div className="relative flex items-center justify-center h-5 w-5">
            {isVoiceListening ? (
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            ) : (
              <Mic className="w-5 h-5 text-red-500 hover:text-red-400" />
            )}
          </div>
          <span>{appLanguage === "es" ? "Voz" : "Voice"}</span>
        </button>

        <button
          id="nav-tab-playlist-btn"
          onClick={() => setIsPlaylistModalOpen(true)}
          className="flex flex-col items-center gap-1 text-xs cursor-pointer text-zinc-500 hover:text-white"
        >
          <FolderHeart className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
          <span>{appLanguage === "es" ? "Playlists" : appLanguage === "pt" ? "Playlists" : appLanguage === "fr" ? "Playlists" : "Playlists"}</span>
        </button>

        <button
          id="nav-tab-translate-btn"
          onClick={() => setActiveTab(2)}
          className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
            activeTab === 2 ? "text-[#1DB954]" : "text-zinc-500 hover:text-white"
          }`}
        >
          <Languages className="w-5 h-5" />
          <span>{t.traducir}</span>
        </button>

        <OldSchoolRecorder
          currentStation={currentStation}
          isPlaying={isPlaying}
          audioRef={audioRef}
          recordedFragments={recordedFragments}
          onAddFragment={(frag) => setRecordedFragments((prev) => [frag, ...prev])}
          onDeleteFragment={(id) => setRecordedFragments((p) => p.filter((x) => x.id !== id))}
          onGoToRecordings={() => setActiveTab(activeTab === 3 ? 0 : 3)}
          appLanguage={appLanguage}
          variant="bottom-bar"
          activeTab={activeTab}
        />
      </nav>

      {/* Playlist Custom manager Modal */}
      <PlaylistsModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        currentStation={currentStation}
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onRenamePlaylist={handleRenamePlaylist}
        onAddStationToPlaylist={handleAddStationToPlaylist}
        onRemoveStationFromPlaylist={handleRemoveStationFromPlaylist}
        onPlayStation={playStation}
        appLanguage={appLanguage}
      />

      {/* Share Modal with QR and standalone download */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentStation={currentStation}
        favorites={favorites}
        playlists={playlists}
        appLanguage={appLanguage}
      />

      {/* EPISODE LIST MODAL */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#282828] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up">
            {/* Header portion */}
            <div className="p-5 border-b border-[#282828] flex items-start gap-4">
              <img
                src={selectedPodcast.artworkUrl100}
                alt={selectedPodcast.collectionName}
                className="w-20 h-20 rounded-xl object-cover bg-zinc-850 shadow-lg flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=120&q=80`;
                }}
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[10px] bg-[#1DB954]/15 border border-[#1DB954]/35 text-[#1DB954] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Podcast Oficial
                </span>
                <h3 className="text-lg font-display font-black text-white mt-1.5 truncate shadow-sm">
                  {selectedPodcast.collectionName}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">
                  Autor: {selectedPodcast.artistName}
                </p>
                {/* Connection with Spotify (supporting variations like 'Palabra Plena, con Gabriel Rolón') */}
                {(() => {
                  const sLink = getSpotifyLink(selectedPodcast.collectionName) || `https://open.spotify.com/search/${encodeURIComponent(selectedPodcast.collectionName)}`;
                  return (
                    <a
                      href={sLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-black text-[10px] uppercase tracking-wide transition-all shrink-0 cursor-pointer shadow-lg shadow-[#1DB954]/20 hover:scale-[1.02] active:scale-[0.98]"
                      title={t.escuchar_spotify}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.135-.669.47-.745 3.85-.88 7.15-.505 9.82 1.13.295.18.387.563.207.86zm1.224-2.723c-.227.368-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.85-.107-.975-.522-.125-.413.108-.85.522-.975 3.678-1.117 8.25-.57 11.35 1.34.367.226.487.707.26 1.08zm.106-2.825C14.39 8.82 8.42 8.625 4.975 9.672c-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.97-1.205 10.56-1.025 15.11 1.7 13.9 8.25c.48.28.63.9.35 1.39-.28.48-.9.63-1.39.35z"/>
                      </svg>
                      <span>{t.escuchar_spotify || "Escuchar en Spotify"}</span>
                    </a>
                  );
                })()}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPodcast(null)}
                className="p-1 px-2.5 bg-[#282828] hover:bg-[#3e3e3e] border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Episodes area list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider text-left border-b border-zinc-900 pb-1">
                Episodios Disponibles
              </h4>

              {episodesLoading ? (
                <div className="py-20 text-center text-zinc-500 animate-pulse flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#1DB954] animate-spin"></div>
                  <span className="text-xs">Sintonizando historial de capítulos reales...</span>
                </div>
              ) : podcastEpisodes.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 text-xs italic">
                  No se encontraron episodios para este podcast.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {podcastEpisodes.map((episode: any) => {
                    const durationMins = episode.trackTimeMillis 
                      ? Math.round(episode.trackTimeMillis / 60000) 
                      : 0;
                    const dateFormatted = episode.releaseDate 
                      ? new Date(episode.releaseDate).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) 
                      : "Reciente";

                    const isCurrentPlayingEpisode = currentStation?.stationuuid === (episode.episodeUrl || episode.enclosureUrl);

                    return (
                      <div
                        key={episode.trackId || episode.trackName}
                        className={`bg-[#121212] hover:bg-[#202020] border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors text-left ${
                          isCurrentPlayingEpisode ? "border-[#1DB954]/50 bg-[#1DB954]/5" : "border-zinc-900"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isCurrentPlayingEpisode && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping flex-shrink-0"></span>
                            )}
                            <h4 className={`text-xs font-bold truncate ${isCurrentPlayingEpisode ? "text-[#1DB954]" : "text-white"}`}>
                              {episode.trackName}
                            </h4>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {episode.description?.replace(/<[^>]*>/g, "") || "Sin descripción disponible."}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] text-[#1DB954] font-mono">
                              📅 {dateFormatted}
                            </span>
                            {durationMins > 0 && (
                              <span className="text-[9px] text-zinc-500 font-mono">
                                ⏱ {durationMins} min
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Play episode */}
                          <button
                            type="button"
                            onClick={() => {
                              playEpisode(episode, selectedPodcast);
                              setSelectedPodcast(null);
                            }}
                            className={`px-3 py-1.5 rounded-full font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                              isCurrentPlayingEpisode 
                                ? "bg-[#1DB954] text-black" 
                                : "bg-white text-black hover:bg-zinc-200"
                            }`}
                          >
                            <Play className="w-3 h-3 fill-current animate-pulse" />
                            {isCurrentPlayingEpisode ? "Sintonizado" : "Sintonizar"}
                          </button>

                          {/* Add episode to Playlist */}
                          <button
                            type="button"
                            onClick={() => {
                              const audioUrl = episode.episodeUrl || episode.enclosureUrl || "";
                              const stationObject: Station = {
                                stationuuid: audioUrl || `episode-${episode.trackId || Math.random()}`,
                                name: episode.trackName || "Episodio sin título",
                                url: audioUrl,
                                url_resolved: audioUrl,
                                favicon: episode.artworkUrl60 || selectedPodcast.artworkUrl100 || "",
                                tags: `Podcast | ${selectedPodcast.collectionName || "iTunes"}`,
                                country: selectedPodcast.artistName || "Podcaster",
                                language: "es",
                                isPodcast: true,
                              };
                              setCurrentStation(stationObject);
                              setIsPlaylistModalOpen(true);
                            }}
                            className="bg-[#282828] hover:bg-[#343434] hover:text-white text-zinc-400 p-2 rounded-full cursor-pointer transition-colors"
                            title="Agregar a playlist"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Load More Controller */}
                  {hasMoreEpisodes && (
                    <div className="pt-3 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0d0d] p-3.5 rounded-xl border border-zinc-800/40 mt-3">
                      <div className="text-left">
                        <p className="text-[11px] text-zinc-400 font-bold">
                          {appLanguage === "es" && "Disponibles más capítulos antiguos"}
                          {appLanguage === "en" && "More older episodes available"}
                          {appLanguage === "pt" && "Mais episódios antigos disponíveis"}
                          {appLanguage === "fr" && "Plus d'anciens épisodes disponibles"}
                        </p>
                        <p className="text-[9px] text-zinc-500">
                          {appLanguage === "es" && `Mostrando hoy ${podcastEpisodes.length} capítulos`}
                          {appLanguage === "en" && `Showing ${podcastEpisodes.length} episodes`}
                          {appLanguage === "pt" && `Mostrando ${podcastEpisodes.length} episódios`}
                          {appLanguage === "fr" && `Affichage de ${podcastEpisodes.length} épisodes`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={loadingMoreEpisodes}
                          onClick={loadMoreEpisodes}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[#1DB954] hover:text-[#1ed760] font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {loadingMoreEpisodes ? (
                            <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 border-t-[#1DB954] animate-spin"></span>
                          ) : "⚡"}
                          {appLanguage === "es" && "Ver +50"}
                          {appLanguage === "en" && "Load +50"}
                          {appLanguage === "pt" && "Ver +50"}
                          {appLanguage === "fr" && "En voir +50"}
                        </button>
                        <button
                          type="button"
                          disabled={loadingMoreEpisodes}
                          onClick={loadAllEpisodes}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/30 text-[#1DB954] hover:text-[#1ed760] font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                          title="Cargar hasta el final"
                        >
                          {loadingMoreEpisodes ? (
                            <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 border-t-[#1DB954] animate-spin"></span>
                          ) : "🔥"}
                          {appLanguage === "es" && "Cargar todo"}
                          {appLanguage === "en" && "Load ALL"}
                          {appLanguage === "pt" && "Carregar tudo"}
                          {appLanguage === "fr" && "Tout charger"}
                        </button>
                      </div>
                    </div>
                  )}

                  {!hasMoreEpisodes && podcastEpisodes.length > 0 && (
                    <div className="py-4 text-center text-zinc-500 font-mono text-[9px] uppercase tracking-wider mt-3">
                      {appLanguage === "es" && `✓ Fin del historial real en iTunes (${podcastEpisodes.length} capítulos sintonizados)`}
                      {appLanguage === "en" && `✓ End of episode history on iTunes (${podcastEpisodes.length} episodes loaded)`}
                      {appLanguage === "pt" && `✓ Fim do histórico no iTunes (${podcastEpisodes.length} episódios carregados)`}
                      {appLanguage === "fr" && `✓ Fin de l'historique sur iTunes (${podcastEpisodes.length} épisodes chargés)`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Voice Assistant Toast */}
      {voiceShowToast && (
        <div className="fixed bottom-24 right-4 z-50 animate-scale-up max-w-sm w-[calc(100vw-32px)] bg-zinc-950/95 border border-red-500/30 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md flex flex-col p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isVoiceListening ? "animate-ping" : ""}`}></span>
              {appLanguage === "es" ? "Asistente de Voz" : "Voice Assistant"}
            </span>
            <button 
              onClick={() => setVoiceShowToast(false)}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0 text-xs animate-fade-in"
            >
              ✕
            </button>
          </div>
          
          <div className="flex gap-3 text-left items-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isVoiceListening ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-zinc-850 text-red-400"}`}>
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {isVoiceListening ? (
                  appLanguage === "es" ? "Escuchando... Di algo como 'radios de tango de Argentina', 'la mega de Venezuela' o 'jazz melancólico'" : "Listening... Say something like 'tango radios from Argentina', 'la mega from Venezuela' or 'melancholic jazz'"
                ) : voiceError ? (
                  <span className="text-red-400 block">
                    {voiceError}
                    {isInsideIframe && (
                      <span className="block mt-2">
                        <a 
                          href={window.location.href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 px-2.5 py-1 rounded-full font-bold transition-all text-[10px]"
                        >
                          {appLanguage === "es" ? "Abrir en Pestaña Nueva ↗" : "Open in New Tab ↗"}
                        </a>
                      </span>
                    )}
                  </span>
                ) : voiceAssistantFeedback ? (
                  appLanguage === "es" ? voiceAssistantFeedback.es : voiceAssistantFeedback.en
                ) : (
                  appLanguage === "es" ? "Procesando..." : "Processing..."
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Pop-up toast when song metadata is updated */}
      {showTrackToast && (
        <div className="fixed bottom-20 md:bottom-24 right-4 z-50 animate-fade-in max-w-sm w-[calc(100vw-32px)] bg-[#121212] border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md flex flex-col">
          <div className="p-3.5 flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                ⚡ ¡Nueva canción en vivo!
              </p>
              <h5 className="text-xs font-bold text-white truncate leading-snug">
                {toastTrackTitle}
              </h5>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                📻 {toastStationName}
              </p>
            </div>
            <button 
              onClick={() => setShowTrackToast(false)}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="bg-zinc-900/60 border-t border-zinc-850 px-3.5 py-2 flex items-center justify-between">
            <span className="text-[9px] text-[#1DB954] font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#1DB954] animate-ping"></span>
              ICY Metadata Sensor
            </span>
            <button
              onClick={() => {
                setShowTrackToast(false);
                identifyCurrentSong(toastTrackTitle);
              }}
              className="px-2.5 py-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
            >
              Ver Detalle con IA
            </button>
          </div>
        </div>
      )}

      {/* Premium IA Song Identification Modal Overlay */}
      {songDetailModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
          <div className="bg-[#121212] border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Header Close button */}
            <button
              onClick={() => {
                setSongDetailModalOpen(false);
                setIsDemoPlaying(false);
                if (demoAudioRef.current) {
                  demoAudioRef.current.pause();
                }
              }}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 border border-zinc-800/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer hover:bg-black/80"
            >
              ✕
            </button>

            {identifyingSong ? (
              <div className="p-10 text-center flex flex-col items-center justify-center min-h-[360px] gap-5">
                <div className="relative w-20 h-20">
                  {/* Rotating visual elements */}
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#1DB954]/30 animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-zinc-800 border-t-[#1DB954] animate-spin"></div>
                  <div className="absolute inset-5 bg-zinc-950 rounded-full flex items-center justify-center shadow-inner">
                    <Sparkles className="w-5 h-5 text-[#1DB954] animate-bounce" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2 font-display">
                    {t.identificando || "Escuchando señal..."}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto animate-pulse">
                    {t.analizando_huella || "Analizando huella acústica..."}
                  </p>
                </div>
              </div>
            ) : (
              identifiedSong && (
                <div className="flex flex-col">
                  {/* Decorative artwork header section */}
                  <div className="relative h-60 overflow-hidden bg-zinc-900 flex items-center justify-center">
                    {/* Blurred backing ambient effect */}
                    <img
                      src={identifiedSong.artworkUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80"}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                        <img
                          src={identifiedSong.artworkUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80"}
                          alt={identifiedSong.songName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Station contextual footnote */}
                      <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-3.5 flex items-center gap-1.5 leading-none">
                        <Radio className="w-3 h-3 text-[#1DB954]" />
                        Identificado en {currentStation?.name || "Live Stream"}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-8 space-y-5 text-left">
                    {/* Title and artist details */}
                    <div className="text-center">
                      <h3 className="text-xl font-display font-black text-white tracking-tight leading-tight">
                        {identifiedSong.songName}
                      </h3>
                      <p className="text-sm font-semibold text-zinc-400 mt-1">
                        {identifiedSong.artist}
                      </p>
                    </div>

                    {/* Metadata tags grid */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-900 text-center">
                      <div>
                        <span className="block text-[8px] font-black tracking-widest text-zinc-500 uppercase leading-none mb-1">
                          {t.album || "Álbum"}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-200 truncate block px-1" title={identifiedSong.album}>
                          {identifiedSong.album || "Sencillo"}
                        </span>
                      </div>
                      <div className="border-x border-zinc-900">
                        <span className="block text-[8px] font-black tracking-widest text-zinc-500 uppercase leading-none mb-1">
                          {t.ano || "Año"}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-200 block">
                          {identifiedSong.releaseYear || "---"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-black tracking-widest text-zinc-500 uppercase leading-none mb-1">
                          {t.estilo || "Estilo"}
                        </span>
                        <span className="text-[10px] font-bold text-[#1DB954] truncate block px-1" title={identifiedSong.genre}>
                          {identifiedSong.genre || "Pop/Rock"}
                        </span>
                      </div>
                    </div>

                    {/* Live Demo Strip */}
                    {identifiedSong.previewUrl && (
                      <div className="bg-[#181818] border border-zinc-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={toggleDemoPlay}
                            className="w-10 h-10 bg-[#1DB954] text-black rounded-full flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow cursor-pointer shrink-0"
                          >
                            {isDemoPlaying ? (
                              <Pause className="w-5 h-5 fill-black text-black" />
                            ) : (
                              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate leading-none mb-1">
                              {isDemoPlaying ? "Reproduciendo pista demo..." : "Escucha un fragmento de la canción"}
                            </p>
                            <span className="text-[9px] text-zinc-500 font-medium">30 segundos de alta fidelidad</span>
                          </div>
                        </div>
                        {isDemoPlaying && (
                          <div className="flex items-end gap-0.5 shrink-0 px-2 h-6">
                            <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.1s]"></span>
                            <span className="w-0.5 h-5 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                            <span className="w-0.5 h-2 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Backstory description with markdown container */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black tracking-wider text-pink-500 uppercase flex items-center gap-1.5 leading-none">
                        <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
                        {t.historia_cancion || "Datos y Curiosidades por Gemini IA"}
                      </span>
                      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-xs text-zinc-300 leading-relaxed max-h-40 overflow-y-auto font-sans">
                        {identifiedSong.story || "No hay historia disponible para esta obra musical."}
                      </div>
                    </div>

                    {/* Navigation or shortcuts buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`https://open.spotify.com/search/${encodeURIComponent(identifiedSong.spotifySearchQuery || `${identifiedSong.artist} ${identifiedSong.songName}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow hover:scale-[1.02] active:scale-95 text-center"
                      >
                        <Disc className="w-4 h-4 fill-black text-black" />
                        {t.escuchar_spotify}
                      </a>
                      <a
                        href={`https://music.apple.com/search?term=${encodeURIComponent(`${identifiedSong.artist} ${identifiedSong.songName}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow hover:border-zinc-700 hover:scale-[1.02] active:scale-95 text-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apple Music
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
