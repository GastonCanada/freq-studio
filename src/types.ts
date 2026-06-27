export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage?: string;
  favicon?: string;
  tags?: string;
  country?: string;
  countrycode?: string;
  state?: string;
  language?: string;
  votes?: number;
  clickcount?: number;
  spotifyId?: string;
  isPodcast?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  stations: Station[];
}

export interface RecordedFragment {
  id: string;
  stationuuid: string;
  stationName: string;
  timestamp: string; // ISO string or readable format
  duration: number; // duration in seconds
  audioUrl: string; // Blob URL or synthesized dynamic Audio URL
  fileName?: string;
}

export interface PlayHistoryItem {
  station: Station;
  playedAt: string;
}
