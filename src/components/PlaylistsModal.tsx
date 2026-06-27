import React, { useState, useId } from "react";
import { X, Plus, FolderHeart, Music, Trash2, Play, Edit2, Check, Share2 } from "lucide-react";
import { Station, Playlist } from "../types";

interface PlaylistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: Station | null;
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenamePlaylist: (playlistId: string, newName: string) => void;
  onAddStationToPlaylist: (playlistId: string, station: Station) => void;
  onRemoveStationFromPlaylist: (playlistId: string, stationUuid: string) => void;
  onPlayStation: (station: Station) => void;
  appLanguage?: string;
}

const MODAL_TRANSLATIONS: Record<string, any> = {
  es: {
    titulo: "Playlists de Radios Favoritas",
    placeholder_nueva: "Nombre de la nueva playlist...",
    crear: "Crear",
    mis_playlists: "Mis Playlists",
    sin_playlists: "No tienes playlists creadas.",
    eliminar_playlist: "Eliminar playlist",
    estaciones_count: "estaciones",
    sonando_ahora: "Sonando Ahora",
    ya_en_playlist: "Ya en playlist",
    agregar: "Agregar",
    vacia: "Esta playlist está vacía.",
    vacia_desc: "Agrega estaciones clickeando el botón \"+\" en la barra inferior o sintonizando una y agregándola arriba.",
    reproducir: "Reproducir estación",
    eliminar_estacion: "Eliminar de la playlist",
    sintonizando_ahora: "Sintonizando ahora",
    que_playlist: "¿A qué playlist deseas sintonizarla?",
    ya_agregada: "Ya agregada",
    selecciona_playlist: "Selecciona una Playlist",
    selecciona_desc: "Elige una lista de la izquierda para ver tus radios guardadas o crea una nueva arriba.",
    internacional: "Internacional"
  },
  en: {
    titulo: "Favorite Radio Playlists",
    placeholder_nueva: "New playlist name...",
    crear: "Create",
    mis_playlists: "My Playlists",
    sin_playlists: "You have no playlists created.",
    eliminar_playlist: "Delete playlist",
    estaciones_count: "stations",
    sonando_ahora: "Now Playing",
    ya_en_playlist: "Already in playlist",
    agregar: "Add",
    vacia: "This playlist is empty.",
    vacia_desc: "Add stations by clicking the \"+\" button on the bottom bar or tuning in to one and adding it above.",
    reproducir: "Play station",
    eliminar_estacion: "Remove from playlist",
    sintonizando_ahora: "Tuning in now",
    que_playlist: "Which playlist do you want to add it to?",
    ya_agregada: "Already added",
    selecciona_playlist: "Select a Playlist",
    selecciona_desc: "Choose a list from the left to view your saved radios or create a new one above.",
    internacional: "International"
  },
  pt: {
    titulo: "Playlists de Rádios Favoritas",
    placeholder_nueva: "Nome da nova playlist...",
    crear: "Criar",
    mis_playlists: "Minhas Playlists",
    sin_playlists: "Você não tem playlists criadas.",
    eliminar_playlist: "Excluir playlist",
    estaciones_count: "estações",
    sonando_ahora: "Sintonizado Agora",
    ya_en_playlist: "Já na playlist",
    agregar: "Adicionar",
    vacia: "Esta playlist está vazia.",
    vacia_desc: "Adicione estações clicando no botão \"+\" na barra inferior ou sintonizando uma e adicionando-a acima.",
    reproducir: "Tocar estação",
    eliminar_estacion: "Excluir da playlist",
    sintonizando_ahora: "Sintonizando agora",
    que_playlist: "A qual playlist você deseja adicioná-la?",
    ya_agregada: "Já adicionada",
    selecciona_playlist: "Selecione uma Playlist",
    selecciona_desc: "Escolha uma lista à esquerda para ver suas rádios salvas ou crie uma nova acima.",
    internacional: "Internacional"
  },
  fr: {
    titulo: "Playlists de Radios Préférées",
    placeholder_nueva: "Nom de la nouvelle playlist...",
    crear: "Créer",
    mis_playlists: "Mes Playlists",
    sin_playlists: "Vous n'avez pas de playlists créées.",
    eliminar_playlist: "Supprimer la playlist",
    estaciones_count: "stations",
    sonando_ahora: "Écoute en Cours",
    ya_en_playlist: "Déjà dans la playlist",
    agregar: "Ajouter",
    vacia: "Cette playlist est vide.",
    vacia_desc: "Ajoutez des stations en cliquant sur le bouton \"+\" de la barre inférieure ou en écoutant une station et en l'ajoutant ci-dessus.",
    reproducir: "Lire la station",
    eliminar_estacion: "Supprimer de la playlist",
    sintonizando_ahora: "Syntonisation en cours",
    que_playlist: "À quelle playlist souhaitez-vous l'ajouter ?",
    ya_agregada: "Déjà ajoutée",
    selecciona_playlist: "Sélectionnez une Playlist",
    selecciona_desc: "Choisissez une liste à gauche pour voir vos radios enregistrées ou créez-en une nouvelle ci-dessus.",
    internacional: "International"
  }
};

export default function PlaylistsModal({
  isOpen,
  onClose,
  currentStation,
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onAddStationToPlaylist,
  onRemoveStationFromPlaylist,
  onPlayStation,
  appLanguage = "es",
}: PlaylistsModalProps) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [playlistCopied, setPlaylistCopied] = useState(false);
  const inputId = useId();

  if (!isOpen) return null;

  const activePlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  const transLanguage = (appLanguage === "en" || appLanguage === "pt" || appLanguage === "fr") ? appLanguage : "es";
  const tr = MODAL_TRANSLATIONS[transLanguage] || MODAL_TRANSLATIONS.es;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  const handleSaveRename = () => {
    if (selectedPlaylistId && editNameValue.trim()) {
      onRenamePlaylist(selectedPlaylistId, editNameValue.trim());
      setIsEditingName(false);
    }
  };

  const handleSharePlaylist = async () => {
    if (!activePlaylist) return;
    const base = window.location.origin + window.location.pathname;
    const uuids = activePlaylist.stations.map((s) => s.stationuuid).join(",");
    const sharedUrl = `${base}?playlistName=${encodeURIComponent(
      activePlaylist.name
    )}&playlistStations=${encodeURIComponent(uuids)}`;
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setPlaylistCopied(true);
      setTimeout(() => setPlaylistCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        id="playlist-modal"
        className="w-full max-w-2xl bg-[#181818] border border-[#282828] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between bg-[#121212]/50">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-6 h-6 text-[#1DB954]" />
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              {tr.titulo}
            </h2>
          </div>
          <button
            id="close-playlist-modal-btn"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-[#282828] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Create playlist input form */}
        <div className="p-4 bg-[#121212] border-b border-[#282828]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <label htmlFor={inputId} className="sr-only">{tr.placeholder_nueva}</label>
              <input
                id={inputId}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder={tr.placeholder_nueva}
                className="w-full bg-[#181818] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954] border border-[#282828]"
              />
            </div>
            <button
              id="create-playlist-submit-btn"
              type="submit"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tr.crear}
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden min-h-[300px]">
          {/* Left Panel: Playlist Names */}
          <div className="w-full md:w-2/5 border-r border-[#282828] overflow-y-auto p-3 flex flex-col gap-1.5 bg-[#121212]/30 max-h-[250px] md:max-h-none">
            <span className="text-xs font-semibold text-zinc-500 px-2 mb-1 uppercase tracking-wider">
              {tr.mis_playlists}
            </span>
            {playlists.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm italic">
                {tr.sin_playlists}
              </div>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`group flex items-center justify-between rounded-lg p-2.5 transition-colors cursor-pointer text-left ${
                    selectedPlaylistId === playlist.id
                      ? "bg-[#282828] text-white font-medium"
                      : "text-zinc-300 hover:bg-[#282828]/50 hover:text-white"
                  }`}
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm truncate">{playlist.name}</span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-full">
                      {playlist.stations.length}
                    </span>
                  </div>
                  <button
                    id={`delete-playlist-btn-${playlist.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedPlaylistId === playlist.id) {
                        setSelectedPlaylistId(null);
                      }
                      onDeletePlaylist(playlist.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition-opacity"
                    title={tr.eliminar_playlist}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right Panel: Selected Playlist Stations */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col min-h-0 bg-zinc-900/40">
            {activePlaylist ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        className="bg-zinc-805 text-white text-xs font-semibold rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-505 border border-zinc-700"
                        placeholder="Nombre..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                      />
                      <button
                        onClick={handleSaveRename}
                        className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors cursor-pointer"
                        title="Guardar nombre / Save name"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="text-[10px] text-zinc-400 hover:text-white px-1.5 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-sm font-bold text-white font-display truncate">
                        {activePlaylist.name}
                      </h3>
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setEditNameValue(activePlaylist.name);
                        }}
                        className="p-1 text-zinc-500 hover:text-white rounded transition-colors cursor-pointer"
                        title="Renombrar playlist / Rename playlist"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSharePlaylist}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/60 rounded text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer h-7"
                      title="Copiar enlace para compartir / Copy playlist share link"
                    >
                      {playlistCopied ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-2.5 h-2.5" />
                          <span>Compartir</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-zinc-400 shrink-0 font-medium bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                      {activePlaylist.stations.length}
                    </span>
                  </div>
                </div>

                {/* Banner to add Current Playing Station to the Active Playlist */}
                {currentStation && (() => {
                  const alreadyInPlaylist = activePlaylist.stations.some(
                    (s) => s.stationuuid === currentStation.stationuuid
                  );
                  return (
                    <div className="mb-4 bg-[#121212] border border-[#282828] p-3 rounded-xl flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {currentStation.favicon ? (
                          <img
                            src={currentStation.favicon}
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=48&q=80`;
                            }}
                            className="w-8 h-8 rounded-md object-cover flex-shrink-0 bg-zinc-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-[10px] flex-shrink-0 uppercase">
                            {currentStation.name.substring(0, 2)}
                          </div>
                        )}
                        <div className="text-left overflow-hidden">
                          <p className="text-[9px] text-[#1DB954] font-bold font-mono uppercase tracking-wider">
                            {tr.sonando_ahora}
                          </p>
                          <h4 className="text-xs font-semibold text-white truncate max-w-[130px] sm:max-w-xs">
                            {currentStation.name}
                          </h4>
                        </div>
                      </div>

                      {alreadyInPlaylist ? (
                        <span className="text-[10px] text-zinc-500 font-medium bg-[#282828] px-2.5 py-1 rounded-full select-none">
                          {tr.ya_en_playlist}
                        </span>
                      ) : (
                        <button
                          id="btn-add-current-to-playlist"
                          onClick={() => onAddStationToPlaylist(activePlaylist.id, currentStation)}
                          className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full px-3 py-1 text-[11px] flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {tr.agregar}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {activePlaylist.stations.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 text-sm py-12 text-center">
                    <Music className="w-10 h-10 mb-2 text-zinc-600" />
                    <p>{tr.vacia}</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {tr.vacia_desc}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activePlaylist.stations.map((station, idx) => (
                      <div
                        key={station.stationuuid + "-" + idx}
                        className="group/item flex items-center justify-between bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800/80 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {station.favicon ? (
                            <img
                              src={station.favicon}
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=48&q=80`;
                              }}
                              className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-zinc-700"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-zinc-700 rounded-md flex items-center justify-center text-zinc-400 flex-shrink-0 font-bold text-sm">
                              {station.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden text-left">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {station.name}
                            </h4>
                            <p className="text-xs text-zinc-400 truncate">
                              {station.country || station.tags || tr.internacional}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            id={`play-station-from-playlist-btn-${station.stationuuid}`}
                            onClick={() => {
                              onPlayStation(station);
                              onClose();
                            }}
                            className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-colors flex items-center justify-center cursor-pointer"
                            title={tr.reproducir}
                          >
                            <Play className="w-3.5 h-3.5 fill-black" />
                          </button>
                          <button
                            id={`remove-station-from-playlist-btn-${station.stationuuid}`}
                            onClick={() =>
                              onRemoveStationFromPlaylist(activePlaylist.id, station.stationuuid)
                            }
                            className="p-1.5 text-zinc-400 hover:text-red-400 rounded transition-colors"
                            title={tr.eliminar_estacion}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 text-sm py-12 text-center">
                {currentStation && playlists.length > 0 ? (
                  <div className="w-full max-w-md p-5 bg-[#121212]/50 rounded-2xl border border-[#282828] text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {currentStation.favicon ? (
                        <img
                          src={currentStation.favicon}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shadow-md border border-[#282828]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-[#1DB954] font-bold text-lg">
                          📻
                        </div>
                      )}
                      <div className="text-left">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-[#1DB954] uppercase block">{tr.sintonizando_ahora}</span>
                        <h4 className="text-md font-bold text-white max-w-[200px] truncate">{currentStation.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-zinc-350 mb-3">{tr.que_playlist}</p>
                    <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
                      {playlists.map((p) => {
                        const alreadyAdded = p.stations.some((s) => s.stationuuid === currentStation.stationuuid);
                        return (
                          <button
                            key={p.id + "-quick-add"}
                            id={`quick-add-to-playlist-${p.id}`}
                            disabled={alreadyAdded}
                            onClick={() => {
                              onAddStationToPlaylist(p.id, currentStation);
                              setSelectedPlaylistId(p.id);
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors border ${
                              alreadyAdded
                                ? "bg-[#181818] text-zinc-500 border-zinc-800/40 cursor-not-allowed"
                                : "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 cursor-pointer"
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                              {alreadyAdded ? tr.ya_agregada : <>{tr.agregar} <Plus className="w-3 h-3" /></>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <FolderHeart className="w-12 h-12 mb-3 text-zinc-600" />
                    <p className="font-semibold text-zinc-400">{tr.selecciona_playlist}</p>
                    <p className="text-xs text-zinc-600 mt-1 max-w-[250px]">
                      {tr.selecciona_desc}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
