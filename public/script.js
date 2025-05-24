/**
 * Интеграция с Last.fm API
 * @module lastfm-api
 */

// Конфигурация API
const API_KEY = '736ac064beead9f907f45e40dc674fb9';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Кэш для хранения результатов API
 */
const apiCache = new Map();

/**
 * Выполняет запрос к Last.fm API с кэшированием
 * @param {Object} params - Параметры запроса к API
 * @returns {Promise<Object>} - Promise с ответом API
 */
async function makeApiRequest(params) {
    const cacheKey = JSON.stringify(params);
    
    // Проверяем кэш
    if (apiCache.has(cacheKey)) {
        return apiCache.get(cacheKey);
    }

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
        
        // Сохраняем в кэш
        apiCache.set(cacheKey, data);
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Получает топ исполнителей с Last.fm
 * @param {number} limit - Количество исполнителей для возврата (по умолчанию: 10)
 * @returns {Promise<Array>} - Promise с массивом топ исполнителей
 */
async function getTopArtists(limit = 10) {
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

/**
 * Получает топ треков с Last.fm
 * @param {number} limit - Количество треков для возврата (по умолчанию: 10)
 * @returns {Promise<Array>} - Promise с массивом топ треков
 */
async function getTopTracks(limit = 10) {
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

/**
 * Выполняет поиск исполнителей, треков или альбомов на Last.fm
 * @param {string} query - Поисковый запрос
 * @param {string} type - Тип поиска (artist, track, album)
 * @param {number} limit - Количество результатов для возврата (по умолчанию: 10)
 * @returns {Promise<Array>} - Promise с массивом результатов поиска
 */
async function search(query, type, limit = 10) {
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

/**
 * Получает дополнительную информацию об исполнителе
 * @param {string} artistName - Имя исполнителя
 * @returns {Promise<Object>} - Promise с информацией об исполнителе
 */
async function getArtistInfo(artistName) {
    try {
        const data = await makeApiRequest({
            method: 'artist.getInfo',
            artist: artistName,
            lang: 'en'
        });
        return data.artist;
    } catch (error) {
        console.error('Failed to get artist info:', error);
        return null;
    }
}

/**
 * Получает дополнительную информацию о треке
 * @param {string} trackName - Название трека
 * @param {string} artistName - Имя исполнителя
 * @returns {Promise<Object>} - Promise с информацией о треке
 */
async function getTrackInfo(trackName, artistName) {
    try {
        const data = await makeApiRequest({
            method: 'track.getInfo',
            track: trackName,
            artist: artistName
        });
        return data.track;
    } catch (error) {
        console.error('Failed to get track info:', error);
        return null;
    }
}

/**
 * Получает URL изображения из массива изображений
 * @param {Array} images - Массив изображений
 * @returns {string} - URL изображения
 */
function getImageUrl(images) {
    if (!images || !Array.isArray(images)) return 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
    
    // Ищем только small изображение для скорости
    const image = images.find(img => img.size === 'small');
    return image?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
}

/**
 * Отображает топ исполнителей в DOM
 * @param {Array} artists - Массив объектов исполнителей
 */
function renderTopArtists(artists) {
    const trendingGrid = document.querySelector('.trending-grid');
    if (!trendingGrid) return;

    const html = artists.map(artist => {
        const imageUrl = getImageUrl(artist.image);
        
        return `
            <div class="trending-item">
                <img loading="lazy" src="${imageUrl}" alt="${artist.name}" onerror="this.src='https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png'">
                <h3>${artist.name}</h3>
                <p>${artist.listeners} слушателей</p>
            </div>
        `;
    }).join('');

    trendingGrid.innerHTML = html;
}

/**
 * Отображает топ треков в DOM
 * @param {Array} tracks - Массив объектов треков
 */
function renderTopTracks(tracks) {
    const popularGrid = document.querySelector('.popular-grid');
    if (!popularGrid) return;

    const html = tracks.map(track => {
        const imageUrl = getImageUrl(track.image);
        
        return `
            <div class="popular-item">
                <img loading="lazy" src="${imageUrl}" alt="${track.name}" onerror="this.src='https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png'">
                <h3>${track.name}</h3>
                <p>${track.artist.name}</p>
                <p>${track.listeners} слушателей</p>
            </div>
        `;
    }).join('');

    popularGrid.innerHTML = html;
}

/**
 * Отображает результаты поиска в DOM
 * @param {Array} results - Массив объектов результатов
 * @param {string} type - Тип результатов (artist, track, album)
 * @param {string} tabId - ID вкладки для отображения результатов
 */
function renderSearchResults(results, type, tabId) {
    const resultsContainer = document.querySelector(`#${tabId}`);
    if (!resultsContainer) return;

    const html = `
        <h2 class="section-title">${type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
        ${results.map(result => {
            const imageUrl = getImageUrl(result.image);

            return `
                <div class="result-item">
                    <div class="result-type">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <img loading="lazy" src="${imageUrl}" alt="${result.name}" class="result-image" onerror="this.src='https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png'">
                    <div class="result-info">
                        <div class="result-title">${result.name}</div>
                        <div class="result-artist">${result.listeners || result.artist?.name || ''} ${result.listeners ? 'слушателей' : ''}</div>
                    </div>
                </div>
            `;
        }).join('')}
    `;

    resultsContainer.innerHTML = html;
}

/**
 * Показывает выбранную вкладку и скрывает остальные
 * @param {string} tabId - ID вкладки для отображения
 */
function showTab(tabId) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Убираем класс active у всех кнопок вкладок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    const selectedTab = document.querySelector(`#${tabId}`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Добавляем класс active к выбранной кнопке вкладки
    const selectedTabButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем топ исполнителей и треков параллельно
        const [artists, tracks] = await Promise.all([
            getTopArtists(),
            getTopTracks()
        ]);
        
        // Отображаем результаты сразу после получения данных
        requestAnimationFrame(() => {
            renderTopArtists(artists);
            renderTopTracks(tracks);
        });

        // Настраиваем функционал поиска
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
        
        if (searchInput && searchButton) {
            const handleSearch = () => {
                const query = searchInput.value.trim();
                if (!query) return;
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            };

            searchButton.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
        }

        // Обработка страницы поиска
        if (window.location.pathname.includes('search.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');

            if (query) {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.value = query;

                try {
                    // Выполняем все поисковые запросы параллельно
                    const [artists, tracks, albums] = await Promise.all([
                        search(query, 'artist'),
                        search(query, 'track'),
                        search(query, 'album')
                    ]);

                    const searchQuery = document.querySelector('.search-query');
                    if (searchQuery) {
                        searchQuery.textContent = `Результаты поиска для "${query}"`;
                    }

                    const resultsContainer = document.querySelector('.search-results');
                    if (resultsContainer) {
                        // Создаем структуру вкладок
                        resultsContainer.innerHTML += `
                            <div id="top-tab" class="tab-content">
                                <div class="results-section" id="top-artists"></div>
                                <div class="results-section" id="top-tracks"></div>
                                <div class="results-section" id="top-albums"></div>
                            </div>
                            <div id="artists-tab" class="tab-content" style="display: none;"></div>
                            <div id="tracks-tab" class="tab-content" style="display: none;"></div>
                            <div id="albums-tab" class="tab-content" style="display: none;"></div>
                        `;

                        // Настраиваем вкладки
                        const tabButtons = document.querySelectorAll('.tab');
                        tabButtons.forEach(button => {
                            const tabId = button.textContent.toLowerCase() + '-tab';
                            button.setAttribute('data-tab', tabId);
                            button.addEventListener('click', () => showTab(tabId));
                        });

                        // Отображаем результаты в следующем кадре анимации
                        requestAnimationFrame(() => {
                            renderSearchResults(artists.slice(0, 3), 'artist', 'top-artists');
                            renderSearchResults(tracks.slice(0, 3), 'track', 'top-tracks');
                            renderSearchResults(albums.slice(0, 3), 'album', 'top-albums');

                            renderSearchResults(artists, 'artist', 'artists-tab');
                            renderSearchResults(tracks, 'track', 'tracks-tab');
                            renderSearchResults(albums, 'album', 'albums-tab');

                            showTab('top-tab');
                        });
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                }
            }
        }
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}); 