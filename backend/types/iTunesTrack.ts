export type iTunesTrack = {
    wrapperType: 'track';
    kind: 'song';
    artistId: number;
    collectionId: number;
    trackId: number;
    artistName: string;
    collectionName: string;
    trackName: string;
    collectionCensoredName: string;
    trackCensoredName: string;
    artistViewUrl: string;
    collectionViewUrl: string;
    trackViewUrl: string;
    previewUrl: string;
    artworkUrl30: string;
    artworkUrl60: string;
    artworkUrl100: string;
    collectionPrice: number;
    trackPrice: number;
    releaseDate: string; // ISO string
    collectionExplicitness: 'explicit' | 'notExplicit' | 'cleaned';
    trackExplicitness: 'explicit' | 'notExplicit' | 'cleaned';
    discCount: number;
    discNumber: number;
    trackCount: number;
    trackNumber: number;
    trackTimeMillis: number;
    country: string;
    currency: string;
    primaryGenreName: string;
    contentAdvisoryRating?: 'Explicit' | 'Clean';
    isStreamable: boolean;
  
    // Optional fields
    collectionArtistName?: string;
    collectionArtistId?: number;
    genres?: string[];
  };
  