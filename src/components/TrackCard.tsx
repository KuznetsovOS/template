import React from 'react';
import { getImageUrl } from '../services/api';

interface TrackCardProps {
  track: {
    name: string;
    image: any[];
    artist: {
      name: string;
    };
    listeners: string;
  };
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const imageUrl = getImageUrl(track.image);

  return (
    <div className="popular-item">
      <img
        loading="lazy"
        src={imageUrl}
        alt={track.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
        }}
      />
      <h3>{track.name}</h3>
      <p>{track.artist.name}</p>
      <p>{track.listeners} слушателей</p>
    </div>
  );
};

export default TrackCard; 