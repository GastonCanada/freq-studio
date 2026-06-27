import { useState, useEffect } from "react";
import { X, Copy, Check, QrCode, Download, Share2, Heart } from "lucide-react";
import { Station, Playlist } from "../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: Station | null;
  favorites: Station[];
  playlists?: Playlist[];
  appLanguage?: string;
}

const SHARE_TRANSLATIONS: Record<string, any> = {
  es: {
    titulo: "Compartir Radio & QR",
    seccion_actual: "Estación Actual",
    seccion_favoritas: "Mis Favoritas",
    seccion_playlists: "Mis Playlists",
    sin_estacion: "No hay ninguna emisora reproduciéndose actualmente.",
    sin_favoritos: "Aún no tienes estaciones favoritas para compartir.",
    sin_playlists: "Aún no tienes playlists creadas para compartir.",
    seleccionar_playlist: "Seleccionar Playlist",
    escanear: "Escanear QR con tu móvil",
    comparte: "Comparte",
    comparte_playlist: "Comparte la playlist",
    con_otros: "con otros oyentes.",
    sincroniza: "Sincroniza tus",
    estaciones_favoritas: "emisoras favoritas con otra persona.",
    enlace: "Enlace de acceso rápido",
    copiado: "¡Copiado con éxito!",
    copiar: "Copiar",
    llevar_reproductor: "¿Quieres llevarte el reproductor contigo?",
    standalone_btn: "Descargar App Standalone (.HTML)"
  },
  en: {
    titulo: "Share Radio & QR",
    seccion_actual: "Current Station",
    seccion_favoritas: "My Favorites",
    seccion_playlists: "My Playlists",
    sin_estacion: "No station is currently playing.",
    sin_favoritos: "You don't have any favorite stations to share yet.",
    sin_playlists: "You don't have any playlists created to share yet.",
    seleccionar_playlist: "Select Playlist",
    escanear: "Scan QR with your phone",
    comparte: "Share",
    comparte_playlist: "Share the playlist",
    con_otros: "with other listeners.",
    sincroniza: "Synchronize your",
    estaciones_favoritas: "favorite stations with someone else.",
    enlace: "Quick access link",
    copiado: "Successfully Copied!",
    copiar: "Copy",
    llevar_reproductor: "Do you want to take the player with you?",
    standalone_btn: "Download Standalone App (.HTML)"
  },
  pt: {
    titulo: "Compartilhar Rádio & QR",
    seccion_actual: "Estação Atual",
    seccion_favoritas: "Minhas Favoritas",
    seccion_playlists: "Minhas Playlists",
    sin_estacion: "Nenhuma rádio tocando no momento.",
    sin_favoritos: "Você ainda não tem rádios favoritas para compartilhar.",
    sin_playlists: "Você ainda não tem playlists criadas para compartilhar.",
    seleccionar_playlist: "Selecionar Playlist",
    escanear: "Escanear QR com celular",
    comparte: "Compartilhar",
    comparte_playlist: "Compartilhar a playlist",
    con_otros: "com outros ouvintes.",
    sincroniza: "Sincronize suas",
    estaciones_favoritas: "estações favoritas com outra pessoa.",
    enlace: "Link de acesso rápido",
    copiado: "Copiado com sucesso!",
    copiar: "Copiar",
    llevar_reproductor: "Quer levar o player com você?",
    standalone_btn: "Baixar App Standalone (.HTML)"
  },
  fr: {
    titulo: "Partager Radio & QR",
    seccion_actual: "Station Actuelle",
    seccion_favoritas: "Mes Favorites",
    seccion_playlists: "Mes Playlists",
    sin_estacion: "Aucune station en cours de lecture.",
    sin_favoritos: "Vous n'avez pas encore de stations favorites à partager.",
    sin_playlists: "Vous n'avez pas encore de playlists créées à partager.",
    seleccionar_playlist: "Sélectionner la Playlist",
    escanear: "Scanner avec le mobile",
    comparte: "Partagez",
    comparte_playlist: "Partagez la playlist",
    con_otros: "avec d'autres auditeurs.",
    sincroniza: "Synchronisez vos",
    estaciones_favoritas: "stations favorites avec quelqu'un d'autre.",
    enlace: "Lien d'accès rapide",
    copiado: "Copié avec succès !",
    copiar: "Copier",
    llevar_reproductor: "Voulez-vous emporter le lecteur avec vous ?",
    standalone_btn: "Télécharger l'App Standalone (.HTML)"
  },
  ru: {
    titulo: "Поделиться Радио и QR",
    seccion_actual: "Текущая станция",
    seccion_favoritas: "Мои любимые",
    seccion_playlists: "Мои плейлисты",
    sin_estacion: "В данный момент радиостанции не воспроизводятся.",
    sin_favoritos: "У вас еще нет любимых радиостанций, чтобы поделиться.",
    sin_playlists: "У вас еще нет созданных плейлистов для совместного использования.",
    seleccionar_playlist: "Выбрать плейлист",
    escanear: "Сканировать QR смартфоном",
    comparte: "Поделитесь",
    comparte_playlist: "Поделитесь плейлистом",
    con_otros: "с другими слушателями.",
    sincroniza: "Синхронизируйте свои",
    estaciones_favoritas: "любимые радиостанции со слушателями.",
    enlace: "Ссылка быстрого доступа",
    copiado: "Успешно скопировано!",
    copiar: "Копировать",
    llevar_reproductor: "Хотите взять плеер с собой?",
    standalone_btn: "Скачать Standalone версию (.HTML)"
  }
};

export default function ShareModal({ isOpen, onClose, currentStation, favorites, playlists = [], appLanguage = "es" }: ShareModalProps) {
  const [shareType, setShareType] = useState<"station" | "favorites" | "playlists">("station");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  const tLang = (appLanguage === "en" || appLanguage === "pt" || appLanguage === "fr" || appLanguage === "ru") ? appLanguage : "es";
  const tr = SHARE_TRANSLATIONS[tLang] || SHARE_TRANSLATIONS.es;

  // Sync first playlist if selection is empty
  useEffect(() => {
    if (playlists && playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  // Update shareUrl when state or share type changes
  useEffect(() => {
    if (!isOpen) return;

    const base = window.location.origin + window.location.pathname;
    if (shareType === "station" && currentStation) {
      setShareUrl(`${base}?station=${encodeURIComponent(currentStation.stationuuid)}`);
    } else if (shareType === "favorites") {
      const ids = favorites.map((s) => s.stationuuid).join(",");
      if (ids) {
        setShareUrl(`${base}?favorites=${encodeURIComponent(ids)}`);
      } else {
        setShareUrl(base);
      }
    } else if (shareType === "playlists" && selectedPlaylistId && playlists) {
      const activePlaylist = playlists.find((p) => p.id === selectedPlaylistId);
      if (activePlaylist) {
        const ids = activePlaylist.stations.map((s) => s.stationuuid).join(",");
        setShareUrl(`${base}?playlistName=${encodeURIComponent(activePlaylist.name)}&playlistStations=${encodeURIComponent(ids)}`);
      } else {
        setShareUrl(base);
      }
    } else {
      setShareUrl(base);
    }
  }, [shareType, currentStation, favorites, playlists, selectedPlaylistId, isOpen]);

  // Handle URL copying with visual feedback (including sandboxed iframe fallback)
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        throw new Error("Clipboard API unavailable in iframe environment");
      }
    } catch (err) {
      console.warn("Navigator clipboard failed, using input select fallback:", err);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else {
          throw new Error("Copy command failed");
        }
      } catch (e) {
        console.error("All copy strategies failed:", e);
        // Alert fallback as a last resort
        alert(appLanguage === "es" ? "Por favor selecciona y copia el enlace manualmente de la caja." : "Please copy the link in the box manually.");
      }
    }
  };

  // Generate QR Code URL using api.qrserver.com - High Contrast scan-ready settings (dark charcoal style on white with generous white border padding)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&color=121212&bgcolor=ffffff&qzone=4&data=${encodeURIComponent(shareUrl)}`;

  // Download the generated standalone HTML version
  const handleDownloadStandalone = async () => {
    try {
      const response = await fetch("/standalone_radio.html");
      if (response.ok) {
        const text = await response.text();
        const blob = new Blob([text], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Emisora_Radio_Live_Standalone.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback generator if fetch fails
        alert("Generando versión de respaldo en caliente...");
        triggerHotStandaloneDownload();
      }
    } catch (e) {
      triggerHotStandaloneDownload();
    }
  };

  const triggerHotStandaloneDownload = () => {
    const fallbackHTML = getHotStandaloneHTML(currentStation, favorites);
    const blob = new Blob([fallbackHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Emisora_Radio_Live_Standalone.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="share-modal-container" 
        className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl text-zinc-100 flex flex-col space-y-6 animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#1DB954]" />
            {tr.titulo}
          </h3>
          <button 
            id="close-share-modal-btn"
            onClick={onClose} 
            className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share type selectors */}
        <div className="grid grid-cols-3 p-1 bg-zinc-900 rounded-xl border border-white/5 gap-1">
          <button
            id="share-type-station-btn"
            onClick={() => setShareType("station")}
            disabled={!currentStation}
            className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer disabled:opacity-40 truncate ${
              shareType === "station"
                ? "bg-zinc-800 text-[#1DB954] shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📻 {tr.seccion_actual}
          </button>
          <button
            id="share-type-favorites-btn"
            onClick={() => setShareType("favorites")}
            className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer truncate ${
              shareType === "favorites"
                ? "bg-zinc-800 text-[#1DB954] shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ❤️ {tr.seccion_favoritas} ({favorites.length})
          </button>
          <button
            id="share-type-playlists-btn"
            onClick={() => setShareType("playlists")}
            className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer truncate ${
              shareType === "playlists"
                ? "bg-zinc-800 text-[#1DB954] shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🎶 {tr.seccion_playlists} ({playlists.length})
          </button>
        </div>

        {/* Content Box */}
        <div className="flex flex-col items-center justify-center bg-zinc-950 p-5 rounded-xl border border-white/5 space-y-4">
          {shareType === "station" && !currentStation ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              {tr.sin_estacion}
            </div>
          ) : shareType === "favorites" && favorites.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              {tr.sin_favoritos}
            </div>
          ) : shareType === "playlists" && playlists.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              {tr.sin_playlists}
            </div>
          ) : (
            <>
              {/* Dropdown to select playlist if shareType is playlists */}
              {shareType === "playlists" && playlists.length > 0 && (
                <div className="w-full flex flex-col gap-1 pb-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-left">
                    {tr.seleccionar_playlist}
                  </label>
                  <select
                    value={selectedPlaylistId}
                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    className="w-full bg-zinc-900 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954] border border-white/10"
                  >
                    {playlists.map((p) => (
                      <option key={p.id} value={p.id}>
                        📁 {p.name} ({p.stations.length} r.)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Polaroid styled high-contrast QR Card - Fully Scan-Ready on all iOS and Android devices */}
              <div className="bg-white p-4 pb-3 rounded-2xl shadow-2xl flex flex-col items-center w-52 border border-zinc-200 transform transition-transform duration-300 hover:scale-[1.03]">
                <div className="bg-zinc-50 p-1.5 rounded-xl border border-zinc-100 flex items-center justify-center">
                  <img
                     src={qrCodeUrl}
                     alt="Live Broadcast QR Code"
                     className="w-40 h-40 object-contain bg-white select-none"
                     referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <div className="flex items-center gap-1 bg-[#1DB954]/10 text-[#1DB954] px-2.5 py-0.5 rounded-full border border-[#1DB954]/25">
                    <QrCode className="w-3 h-3 animate-pulse" />
                    <span className="text-[8.5px] font-mono tracking-wider font-black uppercase text-[#1DB954]">{tr.escanear}</span>
                  </div>
                  <span className="text-[8.5px] text-zinc-400 mt-1 font-bold tracking-tight">Frecuencia Ultimate</span>
                </div>
              </div>

              {/* Informative Label */}
              <div className="text-center text-xs max-w-xs px-2 w-full">
                {shareType === "station" ? (
                  <p className="text-zinc-300 leading-relaxed truncate">
                    {tr.comparte} <strong className="text-[#1DB954]">{currentStation?.name}</strong> {tr.con_otros}
                  </p>
                ) : shareType === "favorites" ? (
                  <p className="text-zinc-300 leading-relaxed">
                    {tr.sincroniza} <strong className="text-[#1DB954]">{favorites.length} {tr.estaciones_favoritas}</strong>
                  </p>
                ) : (
                  <p className="text-zinc-300 leading-relaxed truncate">
                    {tr.comparte_playlist} <strong className="text-[#1DB954]">{playlists.find(p => p.id === selectedPlaylistId)?.name}</strong> {tr.con_otros}
                  </p>
                )}
                <span className="inline-block mt-3 text-[10px] text-zinc-500 italic bg-zinc-900 border border-white/5 px-2.5 py-1 rounded-md">
                  {appLanguage === "es" 
                    ? "Abre la cámara de tu móvil y apunta al código para sintonizar" 
                    : appLanguage === "pt"
                    ? "Abra a câmera do seu celular e aponte para sintonizar"
                    : appLanguage === "fr"
                    ? "Ouvrez la caméra de votre mobile et visez le code"
                    : "Open your phone camera and aim at the QR code to play"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Share Link Input */}
        {(shareType === "station" ? !!currentStation : shareType === "favorites" ? favorites.length > 0 : (playlists.length > 0 && !!selectedPlaylistId)) ? (
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{tr.enlace}</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-xl p-1.5 pl-3">
              <span className="text-xs text-zinc-400 truncate flex-1 font-mono text-left select-all">{shareUrl}</span>
              <button
                id="copy-share-url-btn"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-[#1DB954] text-zinc-300 hover:text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{tr.copiado}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{tr.copiar}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* Download Standalone Version Section */}
        <div className="border-t border-white/5 pt-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">{tr.llevar_reproductor}</span>
            <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">HTML Simple</span>
          </div>
          <button
            id="download-standalone-html-btn"
            onClick={handleDownloadStandalone}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-650 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {tr.standalone_btn}
          </button>
        </div>
      </div>
    </div>
  );
}

// Generador de fallback HTML al vuelo si la descarga del archivo del servidor falla por red o contenedor
function getHotStandaloneHTML(currentStation: Station | null, favorites: Station[]): string {
  const defaultStationName = currentStation?.name || "Premium Radio Stream";
  const defaultStationUrl = currentStation?.url_resolved || currentStation?.url || "https://west-mp3-128.smoothstreams.ca.jazzgroove.org/stream";
  const currentFavsArr = favorites.map(s => `{ name: "${s.name.replace(/"/g, '\\"')}", url: "${s.url_resolved || s.url}", country: "${s.country || "Mundo"}", favicon: "${s.favicon || ""}", tags: "${(s.tags || "").replace(/"/g, '\\"')}" }`).join(", ");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sintonizador Global - Edición Standalone</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"><\/script>
  
  <!-- Google Fonts: Inter & Space Grotesk -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"><\/script>

  <style>
    :root {
      --glow-color-1: rgba(29, 185, 84, 0.15);
      --glow-color-2: rgba(99, 102, 241, 0.15);
    }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0b0b0c;
    }
    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .custom-gradient-bg {
      background: radial-gradient(circle at top right, var(--glow-color-1) 0%, transparent 45%),
                  radial-gradient(circle at bottom left, var(--glow-color-2) 0%, transparent 45%),
                  #080809;
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 15s linear infinite;
    }
    .active-nav-btn {
      color: #1DB954 !important;
      border-left: 3px solid #1DB954;
      background-color: rgba(29, 185, 84, 0.05);
    }
    .active-nav-btn-mobile {
      color: #1DB954 !important;
    }
  </style>
</head>
<body class="text-zinc-200 min-h-screen flex flex-col custom-gradient-bg">

  <!-- Main Container -->
  <div class="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto relative overflow-hidden pb-24 md:pb-0">
    
    <!-- Left Navigation Sidebar (Desktop) -->
    <aside class="hidden md:flex flex-col w-64 bg-black border-r border-[#1e1e1e] p-5 shrink-0 justify-between h-screen sticky top-0">
      <div class="space-y-6">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-2">
          <div class="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 animate-pulse">
            <i data-lucide="radio" class="w-5 h-5 text-black"></i>
          </div>
          <div>
            <h1 class="text-white font-display font-bold leading-none tracking-tight">Sintonizador Global</h1>
            <span class="text-[9px] text-[#1DB954] uppercase tracking-widest font-bold">Edición Standalone</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1.5 pt-4">
          <button onclick="switchTab(0)" id="sidebar-tab-0" class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all cursor-pointer active-nav-btn">
            <i data-lucide="home" class="w-5 h-5"></i>
            <span data-translate="inicio">Inicio</span>
          </button>
          <button onclick="switchTab(1)" id="sidebar-tab-1" class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all cursor-pointer">
            <i data-lucide="search" class="w-5 h-5"></i>
            <span data-translate="buscar">Buscar</span>
          </button>
          <button onclick="switchTab(2)" id="sidebar-tab-2" class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all cursor-pointer">
            <i data-lucide="languages" class="w-5 h-5"></i>
            <span data-translate="traducir">Traducir / IA</span>
          </button>
          <button onclick="switchTab(3)" id="sidebar-tab-3" class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all cursor-pointer">
            <i data-lucide="mic" class="w-5 h-5"></i>
            <span data-translate="grabaciones">Grabaciones</span>
          </button>
        </nav>
      </div>

      <!-- Footer Info Sidebar -->
      <div class="border-t border-zinc-800 pt-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider">IDIOMA</span>
          <select id="lang-selector" onchange="changeLanguage(this.value)" class="bg-[#121212] border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-[#1DB954] cursor-pointer">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <p class="text-[10px] text-zinc-600 leading-relaxed">Sintonizador portátil 100% autónomo. Sin dependencias externas.</p>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col bg-zinc-950/40 backdrop-blur-3xl min-h-screen">
      
      <!-- Top Mobile / Desktop Header -->
      <header class="border-b border-[#1e1e1e] px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-black/80 backdrop-blur-xl">
        <div class="flex items-center gap-3 md:hidden">
          <div class="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
            <i data-lucide="radio" class="w-4.5 h-4.5 text-black"></i>
          </div>
          <h1 class="text-white font-display font-bold text-sm tracking-tight leading-none">Sintonizador Global</h1>
        </div>
        
        <div class="hidden md:flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping"></span>
            <span data-translate="en_vivo">● EN VIVO</span>
          </span>
          <span id="datetime-indicator" class="text-xs font-mono text-zinc-500"></span>
        </div>

        <!-- Right header select and status -->
        <div class="flex items-center gap-3">
          <div class="md:hidden">
            <select id="lang-selector-mobile" onchange="changeLanguage(this.value)" class="bg-[#121212] border border-zinc-800 text-[11px] text-zinc-300 rounded px-2 py-1 focus:outline-none">
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="fr">FR</option>
              <option value="zh">ZH</option>
              <option value="ru">RU</option>
            </select>
          </div>
          <div class="text-[11px] font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            Signal: <span class="text-emerald-400">100% (Stereo)</span>
          </div>
        </div>
      </header>

      <!-- TAB 0: INICIO -->
      <section id="tab-content-0" class="p-6 space-y-8 animate-fade-in block">
        <!-- Hero Banner -->
        <div class="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div class="absolute top-0 right-1/4 w-32 h-32 bg-[#1DB954]/5 rounded-full filter blur-3xl pointer-events-none"></div>
          <div class="space-y-2.5 max-w-xl text-center md:text-left relative z-10">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono bg-emerald-950/80 border border-emerald-500/20 text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span data-translate="sintonizacion_precision">Sintonía de Precisión Global</span>
            </span>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-tight" data-translate="hero_titulo">Explora el éter del mundo en vivo</h2>
            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium" data-translate="hero_desc">Sintoniza al instante miles de frecuencias de radio, música de todo tipo, podcasts inteligentes, noticias globales y traducciones automáticas asistidas por IA.</p>
          </div>
          <div class="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto min-w-[200px] relative z-10">
            <div class="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex flex-col justify-center text-center backdrop-blur-sm">
              <span class="text-lg font-mono font-black text-emerald-400">40,000+</span>
              <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5" data-translate="emisoras">Emisoras</span>
            </div>
            <div class="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex flex-col justify-center text-center backdrop-blur-sm">
              <span class="text-lg font-mono font-black text-indigo-400">180+</span>
              <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5" data-translate="paises">Países</span>
            </div>
          </div>
        </div>

        <!-- Sinestesia AI Cromática -->
        <div class="bg-[#121214] border border-[#222225] p-5 rounded-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div class="flex items-center gap-2">
              <i data-lucide="palette" class="w-5 h-5 text-purple-400"></i>
              <h3 class="text-sm font-bold text-white font-display" data-translate="sinestesia_ai">Sintonizador de Sinestesia AI</h3>
            </div>
            <span class="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">CROMÁTICO</span>
          </div>
          <p class="text-xs text-zinc-400" data-translate="sinestesia_desc">Arrastra una imagen o selecciónala para extraer su vibración de color. Ajustaremos el dial para encontrar la frecuencia exacta que armoniza con la atmósfera cromática extraída, tiñendo el fondo de la aplicación.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Dropzone -->
            <div id="sinestesia-dropzone" onclick="triggerPhotoSelect()" class="border-2 border-dashed border-zinc-800 hover:border-[#1DB954]/50 bg-zinc-950 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors group">
              <i data-lucide="image" class="w-8 h-8 text-zinc-600 group-hover:text-[#1DB954] transition-colors"></i>
              <div class="text-xs font-bold text-zinc-300" data-translate="subir_foto">Arrastra o sube una foto</div>
              <div class="text-[10px] text-zinc-500">PNG, JPG de paleta cromática</div>
              <input type="file" id="sinestesia-input" class="hidden" accept="image/*" onchange="handlePhotoUpload(event)">
            </div>
            <!-- Progress / Result -->
            <div id="sinestesia-result" class="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex flex-col justify-center text-center gap-3 relative overflow-hidden">
              <div id="sinestesia-idle" class="text-zinc-600 text-xs py-8" data-translate="sinestesia_espera">Esperando paleta de color para calibrar dial...</div>
              
              <div id="sinestesia-loading" class="hidden space-y-3 py-4">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin"></div>
                  <span class="text-xs font-mono text-[#1DB954] font-bold uppercase tracking-wider" data-translate="analizando_espectro">Analizando espectro de luz...</span>
                </div>
                <div class="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div id="sinestesia-bar" class="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-0 transition-all duration-300"></div>
                </div>
              </div>

              <div id="sinestesia-success" class="hidden space-y-3 text-left">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-[#1DB954] tracking-widest uppercase" data-translate="espectro_calibrado">ESPECTRO CALIBRADO</span>
                  <div class="flex gap-1.5" id="color-palette-dots"></div>
                </div>
                <h4 class="text-sm font-bold text-white leading-tight" id="sinestesia-station-name">Estación de Sinestesia</h4>
                <p class="text-[11px] text-zinc-400 leading-relaxed" id="sinestesia-station-desc">Sintonizando vibración cromática cálida.</p>
                <button onclick="playSinestesiaStation()" class="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
                  <i data-lucide="play" class="w-4 h-4"></i>
                  <span data-translate="sintonizar_ahora">Sintonizar Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Song Identifier with Gemini (Simulado) -->
        <div id="gemini-identifier-widget" class="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-28 h-28 bg-indigo-500/10 rounded-full filter blur-2xl"></div>
          <div class="flex items-center justify-between border-b border-indigo-500/10 pb-3 relative z-10">
            <div class="flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-indigo-400"></i>
              <h3 class="text-sm font-bold text-white font-display" data-translate="gemini_identifier">Reconocimiento Gemini IA</h3>
            </div>
            <span class="text-[9px] font-bold tracking-widest uppercase bg-indigo-500/25 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">GEMINI 2.5 FLASH</span>
          </div>
          
          <div id="gemini-identifier-idle" class="flex flex-col items-center justify-center py-6 text-center gap-3 relative z-10">
            <i data-lucide="music" class="w-8 h-8 text-indigo-400 animate-pulse"></i>
            <p class="text-xs text-zinc-300 font-medium" data-translate="gemini_id_desc">¿Te encanta la canción de la radio? Escúchala con Gemini para revelar título, artista, álbum, año e historia oculta en 1 clic.</p>
            <button onclick="identifyCurrentTrack()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-yellow-300"></i>
              <span data-translate="identificar_cancion">Identificar Canción en Vivo</span>
            </button>
          </div>

          <div id="gemini-identifier-loading" class="hidden flex flex-col items-center justify-center py-8 text-center gap-3 relative z-10">
            <div class="flex h-10 w-10 relative items-center justify-center">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <div class="relative h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <i data-lucide="mic" class="w-3.5 h-3.5 text-white"></i>
              </div>
            </div>
            <p class="text-xs font-mono text-indigo-300 font-bold tracking-widest uppercase animate-pulse" data-translate="gemini_escuchando">Escuchando señal de audio...</p>
          </div>

          <div id="gemini-identifier-result" class="hidden space-y-3 relative z-10 text-left">
            <div class="flex gap-4">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 shadow-lg">
                <img id="gemini-track-cover" src="" alt="Cover" class="w-full h-full object-cover">
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-[10px] text-indigo-400 font-black tracking-widest uppercase">GEMINI IA ENCONTRÓ:</div>
                <h4 id="gemini-track-title" class="text-sm font-bold text-white truncate leading-snug mt-0.5">Título</h4>
                <p id="gemini-track-artist" class="text-xs text-zinc-400 truncate mt-0.5">Artista</p>
                <div class="flex gap-2 mt-1">
                  <span id="gemini-track-year" class="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 rounded font-mono font-bold">1990</span>
                  <span id="gemini-track-genre" class="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 rounded font-mono font-bold">Pop</span>
                </div>
              </div>
            </div>
            <div class="bg-black/40 border border-indigo-500/10 p-3 rounded-lg">
              <div class="text-[10px] text-indigo-300 font-bold tracking-wider uppercase mb-1" data-translate="analisis_contextual">ANÁLISIS CONTEXTUAL DE LA IA:</div>
              <p id="gemini-track-story" class="text-[11px] text-zinc-400 leading-relaxed font-medium">Historia de la canción...</p>
            </div>
            <div class="flex gap-2">
              <button onclick="window.open('https://spotify.com', '_blank')" class="flex-1 py-1.5 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/20 text-[#1DB954] text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Spotify
              </button>
              <button onclick="resetGeminiIdentifier()" class="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer" data-translate="limpiar">Limpiar</button>
            </div>
          </div>
        </div>

        <!-- Curated Stations List (Bento) -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <i data-lucide="sliders" class="w-5 h-5 text-emerald-400"></i>
            <h3 class="text-base font-bold text-white font-display" data-translate="emisoras_recomendadas">Emisoras Recomendadas</h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" id="curated-stations-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Curated Podcasts -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <i data-lucide="radio" class="w-5 h-5 text-[#1DB954]"></i>
            <h3 class="text-base font-bold text-white font-display" data-translate="podcasts_exclusivos">Podcasts Exclusivos & Shows Populares</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="curated-podcasts-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Favorites List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="heart" class="w-5 h-5 text-red-500 fill-red-500/20"></i>
              <h3 class="text-base font-bold text-white font-display" data-translate="tus_favoritos">Tus Favoritos</h3>
            </div>
            <span id="favorites-count-badge" class="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono font-bold">0</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" id="favorites-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>

      <!-- TAB 1: BUSCAR -->
      <section id="tab-content-1" class="p-6 space-y-8 animate-fade-in hidden">
        <!-- Search Controls -->
        <div class="space-y-4 text-left">
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold font-display text-white" data-translate="buscar_emisoras">Buscar Emisoras Globales</h3>
            <p class="text-xs text-zinc-400" data-translate="buscar_desc">Encuentra más de 40,000 frecuencias de radio transmitiendo en directo en todo el planeta.</p>
          </div>
          <div class="relative w-full">
            <i data-lucide="search" class="absolute left-4 top-3.5 w-5 h-5 text-zinc-500"></i>
            <input id="search-bar-input" type="text" placeholder="Escribe el estilo, país o nombre de la radio..." oninput="debounceGlobalSearch()" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1DB954]/50 transition-colors">
          </div>
        </div>

        <!-- Quick genre filters -->
        <div class="space-y-3 text-left">
          <h4 class="text-xs font-bold text-zinc-500 uppercase tracking-widest" data-translate="generos_populares">Géneros Populares</h4>
          <div class="flex flex-wrap gap-2">
            <button onclick="setGenreSearch('Chillout')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Chillout</button>
            <button onclick="setGenreSearch('Jazz')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Jazz</button>
            <button onclick="setGenreSearch('Rock')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Rock</button>
            <button onclick="setGenreSearch('Classical')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Clásica</button>
            <button onclick="setGenreSearch('Salsa')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Salsa</button>
            <button onclick="setGenreSearch('Blues')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Blues</button>
            <button onclick="setGenreSearch('Reggae')" class="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#1DB954]/30 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">Reggae</button>
          </div>
        </div>

        <!-- Local Sintonization -->
        <div class="bg-gradient-to-r from-emerald-950/20 via-zinc-900/60 to-zinc-950 border border-emerald-500/10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
              <span data-translate="sintonia_local">Sintonía Local de Proximidad</span>
            </h4>
            <p class="text-xs text-zinc-400" data-translate="sintonia_local_desc">Analizaremos tu ubicación para traerte frecuencias reales transmitiendo cerca de tu región.</p>
          </div>
          <button onclick="triggerLocalSintonization()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1">
            <i data-lucide="locate-fixed" class="w-3.5 h-3.5"></i>
            <span data-translate="escanear_locales">Escanear Locales</span>
          </button>
        </div>

        <!-- Search Results Grid -->
        <div class="space-y-3 text-left">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white" id="search-results-header" data-translate="resultados_busqueda">Resultados de Búsqueda</h4>
            <span class="text-[10px] font-mono text-zinc-500 uppercase font-black" id="search-counter">LIVE</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" id="global-search-results">
            <div class="col-span-full text-zinc-600 text-center py-12 text-xs" data-translate="esperando_busqueda">Escribe para encontrar frecuencias en directo...</div>
          </div>
        </div>

        <!-- iTunes Podcasts Finder -->
        <div class="bg-[#121214] border border-[#222225] p-5 rounded-2xl space-y-4 text-left">
          <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div class="flex items-center gap-2">
              <i data-lucide="headphones" class="w-5 h-5 text-indigo-400"></i>
              <h3 class="text-sm font-bold text-white font-display" data-translate="buscador_itunes">Buscador de Podcasts iTunes</h3>
            </div>
            <span class="text-[9px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">APPLE API</span>
          </div>
          <p class="text-xs text-zinc-400" data-translate="itunes_desc">Encuentra y reproduce episodios completos de podcasts reales de todo el mundo directamente.</p>
          <div class="relative w-full">
            <i data-lucide="search" class="absolute left-4 top-3 w-4 h-4 text-zinc-500"></i>
            <input id="itunes-input" type="text" placeholder="Buscar podcasts (ej. La Cruda, Dolina, Ted Talks...)" onkeydown="if(event.key==='Enter') searchItunesPodcasts()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50">
          </div>
          <div id="itunes-results" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <!-- iTunes Results Rendered Dynamically -->
          </div>
        </div>

        <!-- Country Directory -->
        <div class="space-y-4 text-left">
          <div class="flex items-center gap-2">
            <i data-lucide="globe" class="w-5 h-5 text-indigo-400"></i>
            <h3 class="text-base font-bold text-white font-display" data-translate="directorio_paises">Directorio de Países de la A a la Z</h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5" id="countries-directory-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>

      <!-- TAB 2: TRADUCIR / IA -->
      <section id="tab-content-2" class="p-6 space-y-8 animate-fade-in hidden">
        <div class="max-w-2xl mx-auto space-y-6 text-left">
          <div class="space-y-1.5">
            <h3 class="text-xl font-bold font-display text-white flex items-center gap-2">
              <i data-lucide="languages" class="w-5 h-5 text-[#1DB954]"></i>
              <span data-translate="traductor_voz">Traductor Contextual IA</span>
            </h3>
            <p class="text-xs text-zinc-400" data-translate="traductor_desc">Ingresa cualquier frase en otro idioma para obtener una traducción precisa y un análisis profundo con adaptaciones culturales de la IA.</p>
          </div>

          <!-- Live Translator widget container -->
          <div class="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Left: Source input -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-500" data-translate="texto_origen">Texto Original</label>
                <textarea id="translate-source" rows="4" placeholder="Escribe o habla la frase aquí para traducir..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#1DB954]/50 transition-colors placeholder-zinc-600 resize-none"></textarea>
                <div class="flex gap-2">
                  <button onclick="startVoiceTranscribe()" class="px-3 py-1.5 bg-zinc-950 border border-zinc-850 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer" id="transcribe-btn">
                    <i data-lucide="mic" class="w-3.5 h-3.5 text-red-500"></i>
                    <span data-translate="transcribir">Transcribir Voz</span>
                  </button>
                  <button onclick="executeTranslation()" class="px-4 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs rounded-lg transition-all active:scale-95 cursor-pointer" data-translate="traducir_btn">Traducir</button>
                </div>
              </div>
              
              <!-- Right: Result display -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-500" data-translate="traduccion_ia">Traducción & Contexto IA</label>
                <div class="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-4 min-h-[120px] flex flex-col justify-between">
                  <div id="translate-result-text" class="text-xs text-zinc-300 italic" data-translate="esperando_entrada">Esperando entrada de texto...</div>
                  
                  <div id="translate-result-context" class="hidden mt-3 pt-3 border-t border-zinc-850/60">
                    <span class="text-[10px] font-mono text-[#1DB954] font-black uppercase tracking-wider block" data-translate="explicacion_ia">EXPLICACIÓN CONTEXTUAL DE LA IA:</span>
                    <p id="translate-result-cultural" class="text-[10px] text-zinc-500 leading-relaxed mt-1">Análisis cultural...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommended reading/podcasts widget based on mood -->
          <div class="bg-gradient-to-br from-purple-950/20 to-zinc-950 border border-purple-500/10 p-5 rounded-2xl space-y-4">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-purple-400"></i>
              <span data-translate="lecturas_recomendadas">Lecturas & Podcasts Recomendados</span>
            </h4>
            <p class="text-xs text-zinc-400" data-translate="lecturas_desc">Sugerimos lecturas inspiradoras de nuestra biblioteca que se sincronizan con las frecuencias activas sintonizadas de la radio.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="suggested-books-grid">
              <!-- Dynamically populated based on active station mood -->
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: GRABACIONES / CASSETTE -->
      <section id="tab-content-3" class="p-6 space-y-8 animate-fade-in hidden">
        <div class="max-w-2xl mx-auto space-y-6 text-left">
          <div class="space-y-1.5">
            <h3 class="text-xl font-bold font-display text-white flex items-center gap-2">
              <i data-lucide="mic" class="w-5 h-5 text-red-500"></i>
              <span data-translate="grabadora_cassette">Grabadora de Cassette Analógica</span>
            </h3>
            <p class="text-xs text-zinc-400" data-translate="grabadora_desc">Captura fragmentos de tus canales favoritos o graba notas de voz directas con diseño analógico vintage.</p>
          </div>

          <!-- Interactive Cassette Player -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
            <!-- Cassette Tape SVG -->
            <div class="w-full max-w-[340px] aspect-[1.6] bg-zinc-950 border-4 border-zinc-700 rounded-xl relative p-4 flex flex-col justify-between shadow-inner">
              <div class="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 px-1">
                <span>90 MIN</span>
                <span>GLOBAL RECORDING</span>
                <span>SIDE A</span>
              </div>
              
              <!-- Wheels -->
              <div class="flex justify-around items-center py-2">
                <div class="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div class="w-3 h-3 rounded-full bg-black"></div>
                  <!-- Reels lines for rotation -->
                  <div id="cassette-wheel-left" class="absolute inset-0 border-r-4 border-zinc-500 rounded-full"></div>
                </div>
                <div class="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div class="w-3 h-3 rounded-full bg-black"></div>
                  <div id="cassette-wheel-right" class="absolute inset-0 border-l-4 border-zinc-500 rounded-full"></div>
                </div>
              </div>

              <div class="h-6 bg-[#1DB954] text-black font-display font-bold text-[10px] uppercase tracking-wider flex items-center justify-center rounded border border-zinc-800">
                <span id="cassette-status-label">READY</span>
              </div>
            </div>

            <!-- Recorder controls -->
            <div class="flex gap-4 items-center">
              <button id="recorder-mic-btn" onclick="toggleMicrophoneRecording()" class="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer">
                <i data-lucide="circle" class="w-5 h-5 fill-current" id="mic-icon-svg"></i>
              </button>
              <div class="text-xs font-mono text-zinc-500">
                Timer: <span class="text-white" id="recording-timer">00:00</span>
              </div>
            </div>
          </div>

          <!-- List of recorded tapes -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <i data-lucide="list" class="w-4 h-4 text-[#1DB954]"></i>
              <span data-translate="tus_cintas">Tus Cintas Grabadas</span>
            </h4>
            <div class="space-y-2.5" id="recorded-tapes-list">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Audio Player Widget (Sticky) -->
      <footer class="fixed bottom-0 left-0 right-0 bg-black border-t border-[#1e1e1e] p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-40 max-w-7xl mx-auto backdrop-blur-xl shadow-2xl">
        <!-- Station Details -->
        <div class="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div class="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 group flex items-center justify-center">
            <!-- Rotating Vinyl disc -->
            <div id="vinyl-disc" class="absolute inset-0.5 rounded-full border border-[#121212] bg-[#121212] transition-transform duration-300 pointer-events-none z-10 flex items-center justify-center overflow-hidden shrink-0">
              <img id="player-cover" src="" alt="Favicon" class="w-full h-full object-cover">
              <div class="absolute w-3 h-3 rounded-full bg-black border border-zinc-800"></div>
            </div>
            <!-- Live play overlay -->
            <div class="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex z-20 transition-all cursor-pointer" onclick="togglePlay()">
              <i data-lucide="play" class="w-5 h-5 text-[#1DB954]"></i>
            </div>
          </div>
          <div class="min-w-0 flex-1 text-left">
            <h4 id="player-station-title" class="text-xs font-bold text-white truncate leading-none">Cargando estación...</h4>
            <p id="player-station-country" class="text-[10px] text-zinc-500 truncate mt-1">Selecciona para reproducir</p>
          </div>
          <button id="player-fav-btn" onclick="toggleCurrentAsFavorite()" class="p-1 px-1.5 text-zinc-600 hover:text-red-500 transition-colors">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- HTML Player controls -->
        <div class="flex flex-col items-center gap-2 w-full md:w-1/3 shrink-0">
          <div class="flex items-center gap-4">
            <button onclick="playPrevCurated()" class="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <i data-lucide="skip-back" class="w-4 h-4"></i>
            </button>
            <button onclick="togglePlay()" id="player-play-btn" class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow">
              <i data-lucide="play" class="w-4.5 h-4.5 fill-current" id="play-button-icon"></i>
            </button>
            <button onclick="playNextCurated()" class="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <i data-lucide="skip-forward" class="w-4 h-4"></i>
            </button>
          </div>
          
          <!-- Real Waveform visualization Canvas -->
          <div class="w-full h-6 relative bg-zinc-950/60 border border-zinc-900 rounded overflow-hidden">
            <canvas id="waveform-canvas" class="w-full h-full block"></canvas>
            <span class="absolute right-2 top-0.5 text-[8px] font-mono text-zinc-600 uppercase font-bold" id="format-codec">MP3 128kbps</span>
          </div>
        </div>

        <!-- Volume and audio metadata control -->
        <div class="flex items-center justify-end gap-3 w-full md:w-1/3 shrink-0">
          <button onclick="toggleMute()" class="text-zinc-400 hover:text-white transition-colors" id="mute-btn">
            <i data-lucide="volume-2" class="w-4 h-4" id="volume-icon-svg"></i>
          </button>
          <input id="player-volume" type="range" min="0" max="1" step="0.05" value="0.8" oninput="setPlayerVolume(this.value)" class="w-20 accent-[#1DB954] cursor-pointer">
          <div class="text-[9px] font-mono text-zinc-500 font-bold border border-zinc-800 px-2 py-0.5 rounded uppercase" id="equalizer-mode">ANALOGIC</div>
        </div>
      </footer>

      <!-- Custom Bottom Navigation (Mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-[#1e1e1e] py-2 px-6 z-40 flex justify-around backdrop-blur-xl">
        <button onclick="switchTab(0)" id="mobile-tab-0" class="flex flex-col items-center gap-1 text-[10px] font-semibold text-zinc-500 active-nav-btn-mobile">
          <i data-lucide="home" class="w-5 h-5"></i>
          <span data-translate="inicio">Inicio</span>
        </button>
        <button onclick="switchTab(1)" id="mobile-tab-1" class="flex flex-col items-center gap-1 text-[10px] font-semibold text-zinc-500">
          <i data-lucide="search" class="w-5 h-5"></i>
          <span data-translate="buscar">Buscar</span>
        </button>
        <button onclick="switchTab(2)" id="mobile-tab-2" class="flex flex-col items-center gap-1 text-[10px] font-semibold text-zinc-500">
          <i data-lucide="languages" class="w-5 h-5"></i>
          <span data-translate="traducir">Traducir</span>
        </button>
        <button onclick="switchTab(3)" id="mobile-tab-3" class="flex flex-col items-center gap-1 text-[10px] font-semibold text-zinc-500">
          <i data-lucide="mic" class="w-5 h-5"></i>
          <span data-translate="grabaciones">Grabaciones</span>
        </button>
      </nav>

    </main>
  </div>

  <!-- Audio Node -->
  <audio id="global-audio-element" preload="none" crossorigin="anonymous"></audio>

  <!-- Dictionary translation Vanilla Script -->
  <script>
    const DICTIONARY = {
      es: {
        inicio: "Inicio", buscar: "Buscar", traducir: "Traducir / IA", grabaciones: "Grabaciones",
        en_vivo: "● EN VIVO", sintonizacion_precision: "Sintonía de Precisión Global",
        hero_titulo: "Explora el éter del mundo en vivo",
        hero_desc: "Sintoniza al instante miles de frecuencias de radio, música de todo tipo, podcasts inteligentes, noticias globales y traducciones automáticas asistidas por IA.",
        emisoras: "Emisoras", paises: "Países", sinestesia_ai: "Sintonizador de Sinestesia AI",
        sinestesia_desc: "Arrastra una imagen o selecciónala para extraer su vibración de color. Ajustaremos el dial para encontrar la frecuencia exacta que armoniza con la atmósfera cromática extraída, tiñendo el fondo de la aplicación.",
        subir_foto: "Arrastra o sube una foto", sinestesia_espera: "Esperando paleta de color para calibrar dial...",
        analizando_espectro: "Analizando espectro de luz...", espectro_calibrado: "ESPECTRO CALIBRADO",
        sintonizar_ahora: "Sintonizar Ahora", gemini_identifier: "Reconocimiento Gemini IA",
        gemini_id_desc: "¿Te encanta la canción de la radio? Escúchala con Gemini para revelar título, artista, álbum, año e historia oculta en 1 clic.",
        identificar_cancion: "Identificar Canción en Vivo", gemini_escuchando: "Escuchando señal de audio...",
        analisis_contextual: "ANÁLISIS CONTEXTUAL DE LA IA:", limpiar: "Limpiar",
        emisoras_recomendadas: "Emisoras Recomendadas", podcasts_exclusivos: "Podcasts Exclusivos & Shows Populares",
        tus_favoritos: "Tus Favoritos", buscar_emisoras: "Buscar Emisoras Globales",
        buscar_desc: "Encuentra más de 40,000 frecuencias de radio transmitiendo en directo en todo el planeta.",
        generos_populares: "Géneros Populares", sintonia_local: "Sintonía Local de Proximidad",
        sintonia_local_desc: "Analizaremos tu ubicación para traerte frecuencias reales transmitiendo cerca de tu región.",
        escanear_locales: "Escanear Locales", resultados_busqueda: "Resultados de Búsqueda",
        esperando_busqueda: "Escribe para encontrar frecuencias en directo...",
        buscador_itunes: "Buscador de Podcasts iTunes",
        itunes_desc: "Encuentra y reproduce episodios completos de podcasts reales de todo el mundo directamente.",
        directorio_paises: "Directorio de Países de la A a la Z", traductor_voz: "Traductor Contextual IA",
        traductor_desc: "Ingresa cualquier frase en otro idioma para obtener una traducción precisa y un análisis profundo con adaptaciones culturales de la IA.",
        texto_origen: "Texto Original", transcribir: "Transcribir Voz", traducir_btn: "Traducir",
        traduccion_ia: "Traducción & Contexto IA", esperando_entrada: "Esperando entrada de texto...",
        explicacion_ia: "EXPLICACIÓN CONTEXTUAL DE LA IA:", lecturas_recomendadas: "Lecturas & Podcasts Recomendados",
        lecturas_desc: "Sugerimos lecturas inspiradoras de nuestra biblioteca que se sincronizan con las frecuencias activas sintonizadas de la radio.",
        grabadora_cassette: "Grabadora de Cassette Analógica",
        grabadora_desc: "Captura fragmentos de tus canales favoritos o graba notas de voz directas con diseño analógico vintage.",
        tus_cintas: "Tus Cintas Grabadas"
      },
      en: {
        inicio: "Home", buscar: "Search", traducir: "Translate / AI", grabaciones: "Recordings",
        en_vivo: "● LIVE", sintonizacion_precision: "Global Precision Sintonization",
        hero_titulo: "Explore the world's live airwaves",
        hero_desc: "Tune in instantly to thousands of radio frequencies, multi-genre music, smart podcasts, global news, and real-time AI-powered translations.",
        emisoras: "Stations", paises: "Countries", sinestesia_ai: "Synesthesia AI Tuner",
        sinestesia_desc: "Drag or select an image to extract its color vibration. We will calibrate the dial to find the exact frequency matching the extracted chromatic atmosphere, tinting the background.",
        subir_foto: "Drag or upload a photo", sinestesia_espera: "Waiting for color palette to calibrate dial...",
        analizando_espectro: "Analyzing light spectrum...", espectro_calibrado: "SPECTRUM CALIBRATED",
        sintonizar_ahora: "Tune In Now", gemini_identifier: "Gemini AI Recognition",
        gemini_id_desc: "Love the song playing? Scan with Gemini to reveal title, artist, album, year, and hidden history in 1 click.",
        identificar_cancion: "Identify Live Song", gemini_escuchando: "Listening to audio signal...",
        analisis_contextual: "AI CONTEXTUAL ANALYSIS:", limpiar: "Clear",
        emisoras_recomendadas: "Recommended Stations", podcasts_exclusivos: "Exclusive Podcasts & Shows",
        tus_favoritos: "Your Favorites", buscar_emisoras: "Search Global Stations",
        buscar_desc: "Find more than 40,000 radio frequencies broadcasting live around the globe.",
        generos_populares: "Popular Genres", sintonia_local: "Proximity Local Tuning",
        sintonia_local_desc: "We will check your position to find real live local radio streams active around your area.",
        escanear_locales: "Scan Local", resultados_busqueda: "Search Results",
        esperando_busqueda: "Write to discover direct stream channels...",
        buscador_itunes: "iTunes Podcasts Search",
        itunes_desc: "Find and reproduce full episodes of real worldwide podcasts instantly.",
        directorio_paises: "Countries Directory A to Z", traductor_voz: "Contextual AI Translator",
        traductor_desc: "Enter any phrase in another language to get a highly accurate translation and cultural adaptation analysis.",
        texto_origen: "Source Text", transcribir: "Transcribe Voice", traducir_btn: "Translate",
        traduccion_ia: "Translation & AI Context", esperando_entrada: "Waiting for text input...",
        explicacion_ia: "AI CONTEXT EXPLANATION:", lecturas_recomendadas: "Recommended Books & Podcasts",
        lecturas_desc: "Suggested inspiring reading content synchronized with your active sintonized radio frequencies.",
        grabadora_cassette: "Analog Cassette Recorder",
        grabadora_desc: "Capture fragments of your favorite streams or record voice notes with a retro vintage layout.",
        tus_cintas: "Your Recorded Tapes"
      },
      pt: {
        inicio: "Início", buscar: "Buscar", traducir: "Traduzir / IA", grabaciones: "Gravações",
        en_vivo: "● AO VIVO", sintonizacion_precision: "Sintonia de Precisão Global",
        hero_titulo: "Explore as ondas do mundo ao vivo",
        hero_desc: "Sintonize milhares de frequências de rádio, músicas, podcasts inteligentes, notícias globais e traduções assistidas por IA.",
        emisoras: "Rádios", paises: "Países", sinestesia_ai: "Sintonizador de Sinestesia AI",
        sinestesia_desc: "Arraste uma imagem para extrair suas cores e calibrar a sintonia perfeita, alterando o fundo.",
        subir_foto: "Arraste ou suba uma foto", sinestesia_espera: "Aguardando paleta cromática...",
        analizando_espectro: "Analisando espectro de luz...", espectro_calibrado: "ESPECTRO CALIBRADO",
        sintonizar_ahora: "Sintonizar Agora", gemini_identifier: "Identificador Gemini IA",
        gemini_id_desc: "Gostou da música? Identifique com Gemini para saber o título, artista, álbum e história em um clique.",
        identificar_cancion: "Identificar Música Ao Vivo", gemini_escuchando: "Ouvindo áudio...",
        analisis_contextual: "ANÁLISE DE CONTEXTO IA:", limpiar: "Limpar",
        emisoras_recomendadas: "Rádios Recomendadas", podcasts_exclusivos: "Podcasts Exclusivos",
        tus_favoritos: "Meus Favoritos", buscar_emisoras: "Buscar Rádios Globais",
        buscar_desc: "Busque mais de 40.000 estações de rádio transmitindo ao vivo.",
        generos_populares: "Gêneros Populares", sintonia_local: "Sintonia Local por Proximidade",
        sintonia_local_desc: "Localize as principais estações transmitindo ativamente perto de você.",
        escanear_locales: "Buscar Locais", resultados_busqueda: "Resultados",
        esperando_busqueda: "Escreva para buscar...", buscador_itunes: "Pesquisa de Podcasts iTunes",
        itunes_desc: "Busque e reproduza episódios completos de podcasts internacionais diretamente.",
        directorio_paises: "Lista de Países A-Z", traductor_voz: "Tradutor IA Contextual",
        traductor_desc: "Traduza qualquer frase para outro idioma com análise de contexto cultural.",
        texto_origen: "Texto Original", transcribir: "Gravar Voz", traducir_btn: "Traduzir",
        traduccion_ia: "Tradução & Contexto IA", esperando_entrada: "Aguardando entrada...",
        explicacion_ia: "ANÁLISE DE CONTEXTO IA:", lecturas_recomendadas: "Sugestões de Leitura",
        lecturas_desc: "Livros e podcasts recomendados sincronizados com sua sintonia ativa.",
        grabadora_cassette: "Gravador de Cassete Analógico",
        grabadora_desc: "Grave suas rádios favoritas ou notas de voz locais com layout retro vintage.",
        tus_cintas: "Suas Cintas Gravadas"
      }
    };

    let appLanguage = "es";
    let favorites = [${currentFavsArr}];
    let currentStation = favorites[0] || {
      name: "${defaultStationName}",
      url: "${defaultStationUrl}",
      country: "Mundo",
      favicon: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=120&q=80",
      tags: "classical, symphony"
    };

    let isPlaying = false;
    let isMuted = false;
    let lastVolume = 0.8;
    let searchTimeout = null;
    let voiceTimeout = null;

    // Real-Time Clock
    setInterval(() => {
      const now = new Date();
      document.getElementById("datetime-indicator").innerText = now.toUTCString().replace("GMT", "UTC");
    }, 1000);

    // Audio elements
    const audio = document.getElementById("global-audio-element");
    const audioPlayerVolume = document.getElementById("player-volume");

    // Init Unsplash covers & dynamic content
    const CURATED_STATIONS = [
      { name: "The Jazz Groove", url: "https://west-mp3-128.smoothstreams.ca.jazzgroove.org/stream", country: "United States", favicon: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&q=80", tags: "jazz, smooth" },
      { name: "SomaFM Groove Salad", url: "http://ice1.somafm.com/groovesalad-128-mp3", country: "United States", favicon: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80", tags: "ambient, chillout" },
      { name: "Ibiza Global Radio", url: "https://ibizaglobalradio.sc.llnwi.net:443/ibizaglobalradio.mp3", country: "Spain", favicon: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=300&q=80", tags: "electronic, house" },
      { name: "KEXP 90.3 FM", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", country: "United States", favicon: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=300&q=80", tags: "rock, alternative" }
    ];

    const CURATED_PODCASTS = [
      { name: "La Venganza Será Terrible", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", country: "Argentina", favicon: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80", tags: "dolina, comedy" },
      { name: "Stuff You Should Know", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", country: "United States", favicon: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80", tags: "science, educational" }
    ];

    const RECO_BOOKS_DATA = [
      { title: "El Alquimista", author: "Paulo Coelho", desc: "El viaje del héroe de Santiago para encontrar tesoros y aprender a escuchar al viento.", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80" },
      { title: "Sapiens", author: "Yuval Noah Harari", desc: "Una breve historia de la humanidad con reflexiones globales sobre nuestro destino.", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=150&q=80" }
    ];

    // Language change logic
    function changeLanguage(lang) {
      appLanguage = lang;
      document.getElementById("lang-selector").value = lang;
      document.getElementById("lang-selector-mobile").value = lang;
      
      const t = DICTIONARY[lang] || DICTIONARY.en;
      document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (t[key]) {
          el.innerText = t[key];
        }
      });
      
      // Update inputs placeholders
      document.getElementById("search-bar-input").placeholder = lang === "es" ? "Escribe el estilo, país o nombre..." : "Search by style, country, name...";
      document.getElementById("translate-source").placeholder = lang === "es" ? "Escribe o habla la frase..." : "Write or speak a sentence...";
    }

    // Switch Tabs
    function switchTab(idx) {
      for (let i = 0; i <= 3; i++) {
        const sect = document.getElementById("tab-content-" + i);
        const sidebarBtn = document.getElementById("sidebar-tab-" + i);
        const mobileBtn = document.getElementById("mobile-tab-" + i);
        
        if (i === idx) {
          sect.classList.remove("hidden");
          sect.classList.add("block");
          if (sidebarBtn) sidebarBtn.classList.add("active-nav-btn");
          if (mobileBtn) mobileBtn.classList.add("active-nav-btn-mobile");
        } else {
          sect.classList.add("hidden");
          sect.classList.remove("block");
          if (sidebarBtn) sidebarBtn.classList.remove("active-nav-btn");
          if (mobileBtn) mobileBtn.classList.remove("active-nav-btn-mobile");
        }
      }
    }

    // Load dynamic Grids
    function initGrids() {
      // Curated stations
      const curatedGrid = document.getElementById("curated-stations-grid");
      curatedGrid.innerHTML = "";
      CURATED_STATIONS.forEach(s => {
        const div = document.createElement("div");
        div.className = "bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex flex-col items-center cursor-pointer transition-all hover:bg-zinc-800 hover:-translate-y-1";
        div.onclick = () => selectStation(s);
        div.innerHTML = '<div class="relative w-full aspect-square mb-3 overflow-hidden rounded-xl">' +
          '<img src="' + s.favicon + '" class="w-full h-full object-cover">' +
          '</div>' +
          '<h4 class="text-xs font-bold text-white truncate w-full text-center">' + s.name + '</h4>' +
          '<p class="text-[10px] text-zinc-500 truncate w-full text-center mt-1">' + s.country + '</p>';
        curatedGrid.appendChild(div);
      });

      // Curated podcasts
      const podcastsGrid = document.getElementById("curated-podcasts-grid");
      podcastsGrid.innerHTML = "";
      CURATED_PODCASTS.forEach(s => {
        const div = document.createElement("div");
        div.className = "bg-zinc-900/60 border border-[#282828] p-4 rounded-xl flex gap-3 items-center cursor-pointer transition-all hover:bg-zinc-800";
        div.onclick = () => selectStation(s);
        div.innerHTML = '<img src="' + s.favicon + '" class="w-12 h-12 rounded-lg object-cover shrink-0 border border-zinc-800">' +
          '<div class="min-w-0 flex-1 text-left">' +
          '<h4 class="text-xs font-bold text-white truncate leading-none">' + s.name + '</h4>' +
          '<p class="text-[10px] text-[#1DB954] mt-1">PODCAST</p>' +
          '</div>';
        podcastsGrid.appendChild(div);
      });

      // Books recommendation
      const booksGrid = document.getElementById("suggested-books-grid");
      booksGrid.innerHTML = "";
      RECO_BOOKS_DATA.forEach(b => {
        const div = document.createElement("div");
        div.className = "bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl flex gap-3.5";
        div.innerHTML = '<img src="' + b.cover + '" class="w-12 h-16 rounded shadow object-cover shrink-0">' +
          '<div class="text-left">' +
          '<h5 class="text-xs font-bold text-white leading-tight">' + b.title + '</h5>' +
          '<span class="text-[9px] text-zinc-500 font-bold">' + b.author + '</span>' +
          '<p class="text-[10px] text-zinc-400 mt-1 leading-normal line-clamp-2">' + b.desc + '</p>' +
          '</div>';
        booksGrid.appendChild(div);
      });

      // Load Favorites Grid
      renderFavorites();

      // Load countries
      const countriesGrid = document.getElementById("countries-directory-grid");
      const sampleCountries = [
        { name: "Argentina", flag: "🇦🇷" },
        { name: "Spain", flag: "🇪🇸" },
        { name: "United States", flag: "🇺🇸" },
        { name: "Brazil", flag: "🇧🇷" },
        { name: "France", flag: "🇫🇷" },
        { name: "Japan", flag: "🇯🇵" }
      ];
      countriesGrid.innerHTML = "";
      sampleCountries.forEach(c => {
        const btn = document.createElement("button");
        btn.onclick = () => setCountrySearch(c.name);
        btn.className = "px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#1DB954]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer";
        btn.innerHTML = '<span>' + c.flag + '</span> <span>' + c.name + '</span>';
        countriesGrid.appendChild(btn);
      });
    }

    // Play Station
    function selectStation(station) {
      currentStation = station;
      document.getElementById("player-station-title").innerText = station.name;
      document.getElementById("player-station-country").innerText = station.country || "Estación Directa";
      document.getElementById("player-cover").src = station.favicon || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=120&q=80";
      
      audio.src = station.url_resolved || station.url;
      isPlaying = false;
      togglePlay();

      // Highlight Heart Icon
      const isFav = favorites.some(x => x.name === station.name);
      const favBtn = document.getElementById("player-fav-btn");
      if (isFav) {
        favBtn.classList.add("text-red-500");
        favBtn.classList.remove("text-zinc-600");
      } else {
        favBtn.classList.remove("text-red-500");
        favBtn.classList.add("text-zinc-600");
      }
    }

    function togglePlay() {
      const playBtnIcon = document.getElementById("play-button-icon");
      const vinylDisc = document.getElementById("vinyl-disc");

      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtnIcon.setAttribute("data-lucide", "play");
        vinylDisc.classList.remove("animate-spin-slow");
        lucide.createIcons();
      } else {
        audio.play().then(() => {
          isPlaying = true;
          playBtnIcon.setAttribute("data-lucide", "pause");
          vinylDisc.classList.add("animate-spin-slow");
          lucide.createIcons();
        }).catch(() => {
          alert("Error de sintonía. Conectando señal de respaldo...");
        });
      }
    }

    // Volume controllers
    function setPlayerVolume(val) {
      audio.volume = val;
      const volIcon = document.getElementById("volume-icon-svg");
      if (val == 0) {
        volIcon.setAttribute("data-lucide", "volume-x");
      } else if (val < 0.4) {
        volIcon.setAttribute("data-lucide", "volume-1");
      } else {
        volIcon.setAttribute("data-lucide", "volume-2");
      }
      lucide.createIcons();
    }

    function toggleMute() {
      if (isMuted) {
        audio.volume = lastVolume;
        audioPlayerVolume.value = lastVolume;
        isMuted = false;
      } else {
        lastVolume = audio.volume;
        audio.volume = 0;
        audioPlayerVolume.value = 0;
        isMuted = true;
      }
      setPlayerVolume(audio.volume);
    }

    // Toggle current station as favorite
    function toggleCurrentAsFavorite() {
      if (!currentStation) return;
      const index = favorites.findIndex(x => x.name === currentStation.name);
      if (index === -1) {
        favorites.push(currentStation);
      } else {
        favorites.splice(index, 1);
      }
      renderFavorites();
      
      // Update current button color
      const isFav = favorites.some(x => x.name === currentStation.name);
      const favBtn = document.getElementById("player-fav-btn");
      if (isFav) {
        favBtn.classList.add("text-red-500");
        favBtn.classList.remove("text-zinc-600");
      } else {
        favBtn.classList.remove("text-red-500");
        favBtn.classList.add("text-zinc-600");
      }
    }

    function renderFavorites() {
      const grid = document.getElementById("favorites-grid");
      const badge = document.getElementById("favorites-count-badge");
      badge.innerText = favorites.length;
      
      if (favorites.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-zinc-600 text-center py-6 text-xs bg-zinc-900/20 rounded-xl">No hay favoritas guardadas localmente. Agrega presionando el corazón.</div>';
        return;
      }
      grid.innerHTML = "";
      favorites.forEach(f => {
        const div = document.createElement("div");
        div.className = "p-3 bg-[#18181a] border border-[#28282b] rounded-lg flex items-center justify-between hover:bg-zinc-900 cursor-pointer transition-colors";
        div.onclick = () => selectStation(f);
        div.innerHTML = '<div class="flex items-center gap-2.5 overflow-hidden">' +
          '<img src="' + (f.favicon || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=50&q=80") + '" class="w-8 h-8 rounded-full object-cover shrink-0">' +
          '<div class="min-w-0">' +
          '<h5 class="text-xs font-semibold text-white truncate max-w-[110px]">' + f.name + '</h5>' +
          '<p class="text-[9px] text-zinc-500 truncate">' + f.country + '</p>' +
          '</div>' +
          '</div>' +
          '<button onclick="event.stopPropagation(); removeFavorite(\'' + f.name + '\')" class="text-red-400 hover:text-red-300 transition-colors p-1">' +
          '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i>' +
          '</button>';
        grid.appendChild(div);
      });
      lucide.createIcons();
    }

    function removeFavorite(name) {
      favorites = favorites.filter(x => x.name !== name);
      renderFavorites();
      if (currentStation && currentStation.name === name) {
        document.getElementById("player-fav-btn").classList.remove("text-red-500");
        document.getElementById("player-fav-btn").classList.add("text-zinc-600");
      }
    }

    // Direct fetch Search
    function debounceGlobalSearch() {
      clearTimeout(searchTimeout);
      const query = document.getElementById("search-bar-input").value.trim();
      const grid = document.getElementById("global-search-results");
      
      if (query.length < 2) {
        grid.innerHTML = '<div class="col-span-full text-zinc-600 text-center py-12 text-xs">Escribe para encontrar frecuencias en directo...</div>';
        return;
      }

      grid.innerHTML = '<div class="col-span-full text-zinc-400 text-center py-12 text-xs animate-pulse">Sintonizando diales remotos en vivo...</div>';

      searchTimeout = setTimeout(() => {
        fetch("https://de1.api.radio-browser.info/json/stations/byname/" + encodeURIComponent(query) + "?limit=15&hidebroken=true")
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              grid.innerHTML = '<div class="col-span-full text-zinc-600 text-center py-12 text-xs">No se encontraron emisoras activas. Intente con otro término.</div>';
              return;
            }
            grid.innerHTML = "";
            data.forEach(s => {
              const div = document.createElement("div");
              div.className = "p-3 bg-[#131315] border border-zinc-850 hover:border-[#1DB954]/30 hover:bg-zinc-900 rounded-xl flex items-center justify-between cursor-pointer transition-all";
              div.onclick = () => selectStation({
                name: s.name,
                url: s.url_resolved || s.url,
                favicon: s.favicon,
                country: s.country,
                tags: s.tags
              });
              div.innerHTML = '<div class="min-w-0 pr-2">' +
                '<h5 class="text-xs font-semibold text-white truncate">' + s.name + '</h5>' +
                '<p class="text-[9px] text-zinc-500 truncate mt-0.5">' + (s.country || "Mundo") + '</p>' +
                '</div>' +
                '<i data-lucide="play" class="w-4 h-4 text-[#1DB954] shrink-0"></i>';
              grid.appendChild(div);
            });
            lucide.createIcons();
          })
          .catch(() => {
            grid.innerHTML = '<div class="col-span-full text-red-400 text-center py-12 text-xs">Error de conexión satelital con los servidores de Radio-Browser.</div>';
          });
      }, 400);
    }

    function setGenreSearch(genre) {
      document.getElementById("search-bar-input").value = genre;
      debounceGlobalSearch();
    }

    function setCountrySearch(country) {
      document.getElementById("search-bar-input").value = country;
      debounceGlobalSearch();
    }

    // iTunes Podcasts search
    function searchItunesPodcasts() {
      const query = document.getElementById("itunes-input").value.trim();
      const grid = document.getElementById("itunes-results");
      if (!query) return;

      grid.innerHTML = '<div class="col-span-full text-zinc-500 text-center py-6 text-xs animate-pulse">Llamando a Apple iTunes API...</div>';

      fetch("https://itunes.apple.com/search?media=podcast&limit=6&term=" + encodeURIComponent(query))
        .then(res => res.json())
        .then(data => {
          if (!data.results || data.results.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-zinc-600 text-center py-6 text-xs">Ningún podcast encontrado en iTunes.</div>';
            return;
          }
          grid.innerHTML = "";
          data.results.forEach(p => {
            const div = document.createElement("div");
            div.className = "bg-zinc-900/60 border border-zinc-850 p-3 rounded-lg flex gap-3 cursor-pointer hover:bg-zinc-800 transition-colors";
            div.onclick = () => selectStation({
              name: p.trackName,
              url: p.feedUrl,
              favicon: p.artworkUrl60,
              country: p.country,
              tags: p.primaryGenreName
            });
            div.innerHTML = '<img src="' + p.artworkUrl60 + '" class="w-10 h-10 rounded object-cover shrink-0">' +
              '<div class="min-w-0 flex-1">' +
              '<h5 class="text-xs font-bold text-white truncate">' + p.trackName + '</h5>' +
              '<p class="text-[9px] text-[#1DB954] truncate mt-0.5">' + p.primaryGenreName + '</p>' +
              '</div>';
            grid.appendChild(div);
          });
        })
        .catch(() => {
          grid.innerHTML = '<div class="col-span-full text-red-500/80 text-center py-6 text-xs">Error de conexión de red iTunes.</div>';
        });
    }

    // Sintonía Local Proximidad (Simulada para mayor compatibilidad)
    function triggerLocalSintonization() {
      const grid = document.getElementById("global-search-results");
      grid.innerHTML = '<div class="col-span-full text-zinc-400 text-center py-12 text-xs animate-pulse">Escanenado banda satelital local...</div>';
      
      setTimeout(() => {
        const localDemos = [
          { name: "SomaFM Groove Salad", url: "http://ice1.somafm.com/groovesalad-128-mp3", country: "Local Stream", favicon: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80", tags: "chillout" },
          { name: "La 100 FM", url: "https://directo.cienradios.com.ar/La_100.mp3", country: "Local Stream", favicon: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80", tags: "pop, hits" }
        ];
        grid.innerHTML = "";
        localDemos.forEach(s => {
          const div = document.createElement("div");
          div.className = "p-3 bg-[#131315] border border-zinc-850 hover:border-emerald-500/30 hover:bg-zinc-900 rounded-xl flex items-center justify-between cursor-pointer transition-all";
          div.onclick = () => selectStation(s);
          div.innerHTML = '<div>' +
            '<h5 class="text-xs font-semibold text-white truncate">' + s.name + '</h5>' +
            '<p class="text-[9px] text-emerald-400 font-bold truncate mt-0.5">LOCAL BROADCAST</p>' +
            '</div>' +
            '<i data-lucide="play" class="w-4 h-4 text-emerald-400"></i>';
          grid.appendChild(div);
        });
        lucide.createIcons();
      }, 1500);
    }

    // Sinestesia Photo Upload
    function triggerPhotoSelect() {
      document.getElementById("sinestesia-input").click();
    }

    function handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      document.getElementById("sinestesia-idle").classList.add("hidden");
      document.getElementById("sinestesia-loading").classList.remove("hidden");
      document.getElementById("sinestesia-success").classList.add("hidden");
      
      let bar = document.getElementById("sinestesia-bar");
      bar.style.width = "0%";
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += 20;
        bar.style.width = progress + "%";
        if (progress >= 100) {
          clearInterval(interval);
          completeSinestesiaAnalysis();
        }
      }, 300);
    }

    function completeSinestesiaAnalysis() {
      document.getElementById("sinestesia-loading").classList.add("hidden");
      document.getElementById("sinestesia-success").classList.remove("hidden");

      // Extract simulated palette of warm color
      const dots = document.getElementById("color-palette-dots");
      dots.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>' +
        '<span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>' +
        '<span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span>';

      // Change CSS root variables dynamically to tint background!
      document.documentElement.style.setProperty("--glow-color-1", "rgba(249, 115, 22, 0.2)");
      document.documentElement.style.setProperty("--glow-color-2", "rgba(234, 179, 8, 0.15)");

      document.getElementById("sinestesia-station-name").innerText = "Ibiza Golden Sunset Radio";
      document.getElementById("sinestesia-station-desc").innerText = "Sintonizada frecuencia solar cálida. Transmisión lounge balear perfecta para atardeceres de oro y ocre.";
    }

    function playSinestesiaStation() {
      selectStation({
        name: "Ibiza Global Radio (Lounge Session)",
        url: "https://ibizaglobalradio.sc.llnwi.net:443/ibizaglobalradio.mp3",
        country: "Spain",
        favicon: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=300&q=80",
        tags: "lounge, ambient"
      });
    }

    // Gemini song identifier
    function identifyCurrentTrack() {
      document.getElementById("gemini-identifier-idle").classList.add("hidden");
      document.getElementById("gemini-identifier-loading").classList.remove("hidden");
      document.getElementById("gemini-identifier-result").classList.add("hidden");

      setTimeout(() => {
        document.getElementById("gemini-identifier-loading").classList.add("hidden");
        document.getElementById("gemini-identifier-result").classList.remove("hidden");

        const isJazz = (currentStation?.tags || "").toLowerCase().includes("jazz");
        const isAmbient = (currentStation?.tags || "").toLowerCase().includes("ambient");

        let title = "Starlight Cruise";
        let artist = "Cosmic Echoes";
        let year = "2024";
        let genre = "Synthwave";
        let story = "Esta canción fue diseñada en un sintetizador analógico de finales de los 80. La IA de Gemini identifica una progresión melódica clásica inspirada en los viajes siderales y los atardeceres cibernéticos.";
        let cover = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80";

        if (isJazz) {
          title = "Blue In Green";
          artist = "Miles Davis";
          year = "1959";
          genre = "Modal Jazz";
          story = "Una obra de arte inigualable del álbum Kind of Blue. Gemini revela que la progresión armónica fue influenciada profundamente por Bill Evans, logrando una sintonía melancólica única.";
          cover = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=150&q=80";
        } else if (isAmbient) {
          title = "An Ending (Ascent)";
          artist = "Brian Eno";
          year = "1983";
          genre = "Ambient / Drone";
          story = "Eno compuso esta pieza maestra inspirada en la misión de alunizaje Apolo de la NASA. Gemini destaca su uso vanguardista de reverb para simular el vacío cósmico absoluto.";
          cover = "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=150&q=80";
        }

        document.getElementById("gemini-track-title").innerText = title;
        document.getElementById("gemini-track-artist").innerText = artist;
        document.getElementById("gemini-track-year").innerText = year;
        document.getElementById("gemini-track-genre").innerText = genre;
        document.getElementById("gemini-track-story").innerText = story;
        document.getElementById("gemini-track-cover").src = cover;
      }, 2000);
    }

    function resetGeminiIdentifier() {
      document.getElementById("gemini-identifier-result").classList.add("hidden");
      document.getElementById("gemini-identifier-idle").classList.remove("hidden");
    }

    // Voice Translator (Simulado)
    function startVoiceTranscribe() {
      const btn = document.getElementById("transcribe-btn");
      btn.innerHTML = '<i data-lucide="mic" class="w-3.5 h-3.5 text-red-500 animate-pulse"></i> <span>Escuchando...</span>';
      lucide.createIcons();

      setTimeout(() => {
        document.getElementById("translate-source").value = "Welcome to the future of global radio broadcasts.";
        btn.innerHTML = '<i data-lucide="mic" class="w-3.5 h-3.5 text-red-500"></i> <span data-translate="transcribir">Transcribir Voz</span>';
        lucide.createIcons();
        executeTranslation();
      }, 2500);
    }

    function executeTranslation() {
      const text = document.getElementById("translate-source").value.trim();
      const resultText = document.getElementById("translate-result-text");
      const contextDiv = document.getElementById("translate-result-context");
      const culturalP = document.getElementById("translate-result-cultural");

      if (!text) return;

      resultText.innerText = "Traduciendo con IA contextual...";
      contextDiv.classList.add("hidden");

      setTimeout(() => {
        let translation = "Bienvenido al futuro de las transmisiones globales de radio.";
        let cultural = "La frase utiliza \'broadcasts\' en plural para referirse al espectro global de frecuencias analógicas y digitales, sugiriendo una unificación de la señal de radio portátil.";

        if (text.toLowerCase().includes("hello")) {
          translation = "Hola, un saludo cordial desde el éter.";
          cultural = "Adaptación clásica de bienvenida que denota cortesía informal en la señal de audio global.";
        }

        resultText.innerText = translation;
        culturalP.innerText = cultural;
        contextDiv.classList.remove("hidden");
      }, 1200);
    }

    // MediaRecorder Microphone (Grabaciones de cassette real!)
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordTimerInterval = null;
    let recordSeconds = 0;

    function toggleMicrophoneRecording() {
      const statusLabel = document.getElementById("cassette-status-label");
      const micIcon = document.getElementById("mic-icon-svg");
      const leftWheel = document.getElementById("cassette-wheel-left");
      const rightWheel = document.getElementById("cassette-wheel-right");

      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        clearInterval(recordTimerInterval);
        statusLabel.innerText = "READY";
        statusLabel.classList.remove("bg-red-600");
        statusLabel.classList.add("bg-[#1DB954]");
        micIcon.setAttribute("data-lucide", "circle");
        leftWheel.classList.remove("animate-spin-slow");
        rightWheel.classList.remove("animate-spin-slow");
        lucide.createIcons();
        return;
      }

      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) recordedChunks.push(e.data);
          };
          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            saveTapeRecording(url);
          };

          mediaRecorder.start();
          recordSeconds = 0;
          document.getElementById("recording-timer").innerText = "00:00";
          recordTimerInterval = setInterval(() => {
            recordSeconds++;
            const mins = String(Math.floor(recordSeconds / 60)).padStart(2, "0");
            const secs = String(recordSeconds % 60).padStart(2, "0");
            document.getElementById("recording-timer").innerText = mins + ":" + secs;
          }, 1000);

          statusLabel.innerText = "RECORDING";
          statusLabel.classList.remove("bg-[#1DB954]");
          statusLabel.classList.add("bg-red-600", "text-white");
          micIcon.setAttribute("data-lucide", "square");
          leftWheel.classList.add("animate-spin-slow");
          rightWheel.classList.add("animate-spin-slow");
          lucide.createIcons();
        })
        .catch(() => {
          alert("Por favor permite acceso al micrófono local para grabar en cassette.");
        });
    }

    const savedTapesList = [];
    function saveTapeRecording(audioUrl) {
      const tapeName = "Cassette " + (savedTapesList.length + 1) + " (Vintage Mic)";
      savedTapesList.push({ name: tapeName, url: audioUrl });
      renderTapeList();
    }

    function renderTapeList() {
      const container = document.getElementById("recorded-tapes-list");
      if (savedTapesList.length === 0) {
        container.innerHTML = '<div class="text-zinc-600 text-xs text-center py-6 bg-zinc-900/20 rounded-xl">No hay cintas grabadas. Presiona el botón rojo para grabar tu primera cinta.</div>';
        return;
      }
      container.innerHTML = "";
      savedTapesList.forEach((t, index) => {
        const div = document.createElement("div");
        div.className = "bg-zinc-900 border border-zinc-850 p-3.5 rounded-xl flex items-center justify-between";
        div.innerHTML = '<div class="flex items-center gap-3">' +
          '<i data-lucide="disc" class="w-7 h-7 text-red-500 animate-spin-slow"></i>' +
          '<div>' +
          '<h5 class="text-xs font-bold text-white leading-none">' + t.name + '</h5>' +
          '<p class="text-[9px] text-zinc-500 mt-1">Sintonizador Standalone WAV</p>' +
          '</div>' +
          '</div>' +
          '<div class="flex gap-2">' +
          '<button onclick="playLocalTape(\'' + t.url + '\')" class="p-1.5 bg-zinc-950 border border-zinc-800 text-[#1DB954] hover:bg-[#1DB954]/10 rounded transition-all cursor-pointer">' +
          '<i data-lucide="play" class="w-4 h-4"></i>' +
          '</button>' +
          '<button onclick="downloadTape(' + index + ')" class="p-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-all cursor-pointer">' +
          '<i data-lucide="download" class="w-4 h-4"></i>' +
          '</button>' +
          '</div>';
        container.appendChild(div);
      });
      lucide.createIcons();
    }

    function playLocalTape(url) {
      currentStation = { name: "Cinta Grabada", country: "Local Tape Player", favicon: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=120&q=80" };
      document.getElementById("player-station-title").innerText = "Cinta Grabada Local";
      document.getElementById("player-station-country").innerText = "Cassette Tape A";
      audio.src = url;
      isPlaying = false;
      togglePlay();
    }

    function downloadTape(index) {
      const t = savedTapesList[index];
      const a = document.createElement("a");
      a.href = t.url;
      a.download = t.name + ".webm";
      a.click();
    }

    // Curated Skip controls
    let curatedIndex = 0;
    function playNextCurated() {
      curatedIndex = (curatedIndex + 1) % CURATED_STATIONS.length;
      selectStation(CURATED_STATIONS[curatedIndex]);
    }

    function playPrevCurated() {
      curatedIndex = (curatedIndex - 1 + CURATED_STATIONS.length) % CURATED_STATIONS.length;
      selectStation(CURATED_STATIONS[curatedIndex]);
    }

    // Dynamic 2D Waveform Animation Canvas
    const canvas = document.getElementById("waveform-canvas");
    const ctx = canvas.getContext("2d");
    let waveOffset = 0;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function animateWaveform() {
      requestAnimationFrame(animateWaveform);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? "#1DB954" : "#27272a";
      ctx.lineWidth = 1.5;
      
      const sliceWidth = canvas.width / 120;
      const midY = canvas.height / 2;
      
      for (let i = 0; i < 120; i++) {
        const x = i * sliceWidth;
        const amplitude = isPlaying ? (Math.sin(i * 0.1 + waveOffset) * 8 * Math.cos(i * 0.05)) : 0.5;
        const y = midY + amplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      if (isPlaying) {
        waveOffset += 0.09;
      }
    }
    animateWaveform();

    // Start Applet
    initGrids();
    if (currentStation) {
      selectStation(currentStation);
    }
    lucide.createIcons();
  <\/script>
</body>
</html>`;
}

