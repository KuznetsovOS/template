import React from 'react';
import { getImageUrl } from '../services/api';

interface ArtistCardProps {
  artist: {
    name: string;
    image: any[];
    listeners: string;
  };
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const imageUrl = getImageUrl(artist.image);

  return (
    <div className="trending-item">
      <img
        loading="lazy"
        src={imageUrl}
        alt={artist.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
        }}
      />
      <h3>{artist.name}</h3>
      <p>{artist.listeners} слушателей</p>
    </div>
  );
};

export default ArtistCard; 