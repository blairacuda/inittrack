import React, {useState, useContext, useEffect, useRef} from 'react'
import '../style/Beastiary.css'
import {get} from '../utilities/Fetcher.js'
import {BeastDispatch} from './App.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBook, faPlus, faChevronLeft, faChevronRight, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { SourcesSelector } from './SourcesSelector.jsx'

function DragonOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         width="1.3em" height="1.3em" fill="currentColor" aria-hidden="true">
      {/* Horns */}
      <path d="M10 0 L8.5 3.5 L11 2.5 Z"/>
      <path d="M14 0 L15.5 3.5 L13 2.5 Z"/>
      {/* Head */}
      <ellipse cx="12" cy="5" rx="2.5" ry="2"/>
      {/* Body */}
      <path d="M10 7 L14 7 L14.5 16 L12 17 L9.5 16 Z"/>
      {/* Left wing — spread wide */}
      <path d="M10 8.5 C 7.5 7.5 4 6.5 1 8 C 2.5 10.5 5.5 12.5 9 12 L 10 10 Z"/>
      {/* Right wing — spread wide */}
      <path d="M14 8.5 C 16.5 7.5 20 6.5 23 8 C 21.5 10.5 18.5 12.5 15 12 L 14 10 Z"/>
      {/* Tail */}
      <path d="M12 17 C 10.5 19 10 21.5 11.5 23.5 L 12 21 L 12.5 23.5 C 14 21.5 13.5 19 12 17 Z"/>
    </svg>
  );
}

function DragonClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         width="1.3em" height="1.3em" fill="currentColor" aria-hidden="true">
      {/* Horns */}
      <path d="M10 0 L8.5 3.5 L11 2.5 Z"/>
      <path d="M14 0 L15.5 3.5 L13 2.5 Z"/>
      {/* Head */}
      <ellipse cx="12" cy="5" rx="2.5" ry="2"/>
      {/* Body */}
      <path d="M10 7 L14 7 L14.5 16 L12 17 L9.5 16 Z"/>
      {/* Left wing — folded tight */}
      <path d="M10 8.5 C 8 8.5 7 10 7 12 C 7 14 8 15 9.5 15 L 10 12.5 Z"/>
      {/* Right wing — folded tight */}
      <path d="M14 8.5 C 16 8.5 17 10 17 12 C 17 14 16 15 14.5 15 L 14 12.5 Z"/>
      {/* Tail */}
      <path d="M12 17 C 10.5 19 10 21.5 11.5 23.5 L 12 21 L 12.5 23.5 C 14 21.5 13.5 19 12 17 Z"/>
    </svg>
  );
}

export function Beastiary({ isCollapsed, onToggleCollapse, beastSelected }) {
  const dispatch = useContext(BeastDispatch);

  const [beasts, setBeasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [documentsError, setDocumentsError] = useState(false);
  const [selectedSources, setSelectedSources] = useState(loadSavedSources); // null = all sources
  const [showSources, setShowSources] = useState(false);

  const searchDebounceTimer = useRef(null);

  const URL_BASE = "https://api.open5e.com/"
  const URL_MONSTERS = `${URL_BASE}v2/creatures`
  const URL_DOCUMENTS = `${URL_BASE}v2/documents`
  const PAGE_SIZE = 50;

  // '' = all sources (no filter), '__none__' = nothing selected, else comma-joined keys.
  // Resolved synchronously from localStorage, so a saved filter applies on the first
  // fetch without waiting on the documents endpoint (and never flashes the full library).
  const sourceFilter = computeSourceFilter(selectedSources, documents);

  // Load source documents for the picker only; the beastiary fetch does not wait on this.
  useEffect(() => {
    get(`${URL_DOCUMENTS}/?fields=key,name,gamesystem,publisher&limit=100`).then(
      data => {
        const docs = data.results || [];
        setDocuments(docs);
        // No saved selection -> materialize "all" so the picker shows everything checked.
        setSelectedSources(prev => prev === null ? new Set(docs.map(d => d.key)) : prev);
      },
      err => {
        console.error('failed to load documents', err);
        setDocumentsError(true);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadBeasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, sourceFilter]);

  return (
    <div className={`beastTable${isCollapsed ? ' beastTable--collapsed' : ''}`}>
      <div className="beastContainer">

        {/* Header */}
        <div className="beastiaryHeader">
          {!isCollapsed && <FontAwesomeIcon className="beastiaryIcon" icon={faBook} />}
          {!isCollapsed && <span className="beastiaryTitle">Beastiary</span>}
          {!isCollapsed && totalCount !== null && (
            <span className="countBadge">
              {totalCount >= 1000 ? `${Math.floor(totalCount/100)*100}+` : totalCount} monsters
            </span>
          )}
          {!isCollapsed && (
            <button className="beastiarySourcesBtn" onClick={() => setShowSources(true)} title="Select sources">
              <FontAwesomeIcon icon={faLayerGroup} />
            </button>
          )}
          <button className="beastiaryCollapseBtn" onClick={onToggleCollapse} title={isCollapsed ? 'Expand Beastiary' : 'Collapse Beastiary'}>
            {isCollapsed ? <DragonClosedIcon /> : <DragonOpenIcon />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="beastSearchArea">
              <div className="beastSearchBox">
                <FontAwesomeIcon className="searchIcon" icon={faSearch} />
                <input
                  type='text'
                  className='beastInput'
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search monsters..."
                />
              </div>
            </div>

            {loading && <div className='beastLoading'>Loading...</div>}
            {error && <div className='beastError'>{error}</div>}
            {!loading && sourceFilter === '__none__' && (
              <div className='beastError'>No sources selected. Open the sources menu to pick some.</div>
            )}

            {/* Monster list */}
            <div className='beastList'>
              {beasts.map((beast, idx) =>
                <div className="beastRow" key={beast.key || idx} onClick={() => dispatch({ type: 'add', beast })}>
                  <div className="beastInfo">
                    <span className="beastName">{beast.name}</span>
                    <span className="beastStats">
                      AC {beast.armor_class} · HP {beast.hit_points} · CR {beast.challenge_rating}
                    </span>
                  </div>
                  <button className="beastAddBtn" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'add', beast }); }}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className='beastiaryButtonGrid'>
              <button className="btn-secondary btn-sm" onClick={onPreviousClicked} disabled={currentPage === 1 || loading}>
                <FontAwesomeIcon icon={faChevronLeft} />
                Previous
              </button>
              <span className="pageInfo">Page {currentPage} of {maxPage}</span>
              <button className="btn-accent btn-sm" onClick={onNextClicked} disabled={currentPage >= maxPage || loading}>
                Next
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        )}

      {showSources && (
        <SourcesSelector
          documents={documents}
          selected={selectedSources || new Set()}
          loading={selectedSources === null && !documentsError}
          error={documentsError}
          onChange={handleSourcesChange}
          onClose={() => setShowSources(false)}
        />
      )}

      </div>
    </div>
  );

  function loadBeasts() {
    if (sourceFilter === '__none__') {
      setBeasts([]);
      setTotalCount(0);
      setMaxPage(1);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', currentPage);
    if (searchTerm) params.set('name__icontains', searchTerm);
    if (sourceFilter) params.set('document__key__in', sourceFilter);

    get(`${URL_MONSTERS}/?${params.toString()}`).then(
      data => {
        setBeasts(data.results || []);
        setMaxPage(Math.max(1, Math.ceil(data.count / PAGE_SIZE)));
        setTotalCount(data.count);
        setLoading(false);
      },
      error => {
        console.error('received error', error);
        setError('Failed to load monsters. Please try again.');
        setLoading(false);
      }
    );
  }

  function handleSourcesChange(next) {
    setSelectedSources(next);
    setCurrentPage(1);
    try {
      localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify({ selected: [...next] }));
    } catch (e) {
      console.error('Error saving sources to localStorage:', e);
    }
  }

  function handleSearchInput(value) {
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (value === "") {
      setSearchTerm('');
      setCurrentPage(1);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500);
  }

  function onPreviousClicked() {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  }

  function onNextClicked() {
    if (currentPage >= maxPage) return;
    setCurrentPage(currentPage + 1);
  }
}

// Resolve the selected sources into a `document__key__in` value.
// '' -> no filter (all sources), '__none__' -> nothing selected, else comma-joined keys.
function computeSourceFilter(selected, documents) {
  if (selected === null) return '';
  if (selected.size === 0) return '__none__';
  const allKeys = documents.map(d => d.key);
  if (allKeys.length > 0 && allKeys.every(k => selected.has(k))) return '';
  return [...selected].sort().join(',');
}

const SOURCES_STORAGE_KEY = 'inittrack-sources';

// Read the saved source selection from localStorage. Returns a Set of keys, or
// null when nothing is saved (meaning "all sources").
function loadSavedSources() {
  try {
    const raw = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data.selected) ? new Set(data.selected) : null;
  } catch (e) {
    console.error('Error loading sources from localStorage:', e);
    return null;
  }
}
