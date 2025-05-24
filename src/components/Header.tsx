import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <a href="/">
            <img loading="lazy" src="/ico.png" alt="Last.fm Logo" />
          </a>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
          </button>
        </form>

        <nav className="main-nav">
          <ul>
            <li><a href="#">Live</a></li>
            <li><a href="#">Music</a></li>
            <li><a href="#">Charts</a></li>
            <li><a href="#">Events</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 