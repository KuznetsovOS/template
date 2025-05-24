import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search, getImageUrl } from '../services/api';
import ArtistCard from '../components/ArtistCard';
import TrackCard from '../components/TrackCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('top');
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!query) return;

      const [artistsData, tracksData, albumsData] = await Promise.all([
        search(query, 'artist'),
        search(query, 'track'),
        search(query, 'album')
      ]);

      setArtists(artistsData);
      setTracks(tracksData);
      setAlbums(albumsData);
    };

    loadData();
  }, [query]);

  const renderResults = (type: string, items: any[]) => {
    if (type === 'artist') {
      return items.map((item) => (
        <div key={item.name} className="result-item">
          <div className="result-type">Artist</div>
          <img
            loading="lazy"
            src={getImageUrl(item.image)}
            alt={item.name}
            className="result-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
            }}
          />
          <div className="result-info">
            <div className="result-title">{item.name}</div>
            <div className="result-artist">{item.listeners} слушателей</div>
          </div>
        </div>
      ));
    } else if (type === 'track') {
      return items.map((item) => (
        <div key={`${item.name}-${item.artist.name}`} className="result-item">
          <div className="result-type">Track</div>
          <img
            loading="lazy"
            src={getImageUrl(item.image)}
            alt={item.name}
            className="result-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
            }}
          />
          <div className="result-info">
            <div className="result-title">{item.name}</div>
            <div className="result-artist">{item.artist.name}</div>
            <div className="result-artist">{item.listeners} слушателей</div>
          </div>
        </div>
      ));
    } else {
      return items.map((item) => (
        <div key={item.name} className="result-item">
          <div className="result-type">Album</div>
          <img
            loading="lazy"
            src={getImageUrl(item.image)}
            alt={item.name}
            className="result-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
            }}
          />
          <div className="result-info">
            <div className="result-title">{item.name}</div>
            <div className="result-artist">{item.artist}</div>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <h1 className="search-query">Результаты поиска для "{query}"</h1>
      </div>
      
      <div className="results-tabs">
        <div
          className={`tab ${activeTab === 'top' ? 'active' : ''}`}
          onClick={() => setActiveTab('top')}
        >
          Top
        </div>
        <div
          className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          Artists
        </div>
        <div
          className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          Tracks
        </div>
        <div
          className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          Albums
        </div>
      </div>

      {activeTab === 'top' && (
        <div className="tab-content">
          <div className="results-section">
            <h2>Top Artists</h2>
            <div className="results-grid">
              {renderResults('artist', artists.slice(0, 3))}
            </div>
          </div>
          <div className="results-section">
            <h2>Top Tracks</h2>
            <div className="results-grid">
              {renderResults('track', tracks.slice(0, 3))}
            </div>
          </div>
          <div className="results-section">
            <h2>Top Albums</h2>
            <div className="results-grid">
              {renderResults('album', albums.slice(0, 3))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="tab-content">
          <div className="results-section">
            <h2>Artists</h2>
            <div className="results-grid">
              {renderResults('artist', artists)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracks' && (
        <div className="tab-content">
          <div className="results-section">
            <h2>Tracks</h2>
            <div className="results-grid">
              {renderResults('track', tracks)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="tab-content">
          <div className="results-section">
            <h2>Albums</h2>
            <div className="results-grid">
              {renderResults('album', albums)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 
