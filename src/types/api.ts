export interface Image {
    '#text': string;
    size: string;
}

export interface Artist {
    name: string;
    image: Image[];
    listeners?: string;
    playcount?: string;
}

export interface Track {
    name: string;
    artist: {
        name: string;
    };
    image: Image[];
    listeners?: string;
    playcount?: string;
}

export interface Album {
    name: string;
    artist: string;
    image: Image[];
    listeners?: string;
    playcount?: string;
}

export interface SearchResponse {
    results: {
        artistmatches?: {
            artist: Artist[];
        };
        trackmatches?: {
            track: Track[];
        };
        albummatches?: {
            album: Album[];
        };
    };
}

export interface TopArtistsResponse {
    topartists: {
        artist: Artist[];
    };
}

export interface TopTracksResponse {
    toptracks: {
        track: Track[];
    };
} 