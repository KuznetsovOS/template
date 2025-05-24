import React, { useEffect, useState } from 'react';
import { getTopArtists, getTopTracks } from '../services/api';
import ArtistCard from '../components/ArtistCard';
import TrackCard from '../components/TrackCard';

const HomePage: React.FC = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [artistsData, tracksData] = await Promise.all([
        getTopArtists(),
        getTopTracks()
      ]);
      
      setArtists(artistsData);
      setTracks(tracksData);
    };

    loadData();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Music</h1>
        </div>
      </section>

      <section className="trending">
        <div className="container">
          <h2>Trending now</h2>
          <div className="trending-grid">
            {artists.map((artist) => (
              <ArtistCard key={artist.name} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <h2>Popular tracks</h2>
          <div className="popular-grid">
            {tracks.map((track) => (
              <TrackCard key={`${track.name}-${track.artist.name}`} track={track} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage; 