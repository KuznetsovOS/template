import { Artist, Track, Album, SearchResponse, TopArtistsResponse, TopTracksResponse } from '../types/api';

const API_KEY = '736ac064beead9f907f45e40dc674fb9';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

interface ApiResponse {
  [key: string]: any;
}

const fetchData = async <T>(method: string, params: Record<string, string>): Promise<T> => {
    const queryParams = new URLSearchParams({
        method,
        api_key: API_KEY,
        format: 'json',
        ...params
    });

    const response = await fetch(`${BASE_URL}?${queryParams}`);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
};


export async function makeApiRequest(params: Record<string, any>): Promise<ApiResponse> {
  
  try {
    const queryParams = new URLSearchParams({
      ...params,
      api_key: API_KEY,
      format: 'json'
    });

    const response = await fetch(`${BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function getTopArtists(limit = 10) {
  try {
    const data = await makeApiRequest({
      method: 'chart.gettopartists',
      limit: limit
    });
    
    return data.artists.artist;
  } catch (error) {
    console.error('Failed to get top artists:', error);
    return [];
  }
}

export async function getTopTracks(limit = 10) {
  try {
    const data = await makeApiRequest({
      method: 'chart.gettoptracks',
      limit: limit
    });
    
    return data.tracks.track;
  } catch (error) {
    console.error('Failed to get top tracks:', error);
    return [];
  }
}

export async function search(query: string, type: string, limit = 10) {
  try {
    const data = await makeApiRequest({
      method: `${type}.search`,
      [type]: query,
      limit: limit
    });
    
    return data.results[`${type}matches`][type];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export function getImageUrl(images: any[] | undefined): string {
  if (!images || !Array.isArray(images)) {
    return 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
  }
  
  const image = images.find(img => img.size === 'small');
  return image?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
} 