import React, {useState, useContext, useEffect, useRef} from 'react'
import '../style/Beastiary.css'
import {get} from '../utilities/Fetcher.js'
import {BeastDispatch} from './App.js'

export function Beastiary(props) {
  const dispatch = useContext(BeastDispatch);

  const [beasts, setBeasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDebounceTimer = useRef(null);

  const URL_BASE = "https://api.open5e.com/"
  const URL_MONSTERS = `${URL_BASE}monsters`
  const PAGE_SIZE = 50; // API default page size

  // Load beasts when page changes or search term changes
  useEffect(() => {
    loadBeasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  return(
      <div className='beastTable'>
        <div className="beastContainer">
          <h1>Beastiary</h1>

          <input
            type='text'
            className='beastInput'
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search monsters..."
          />

          {loading && <div className='beastLoading'>Loading...</div>}

          {error && <div className='beastError'>{error}</div>}

          <div className='beastList'>
            {beasts.map((beast, idx)=>
              <div className="beastRow" key={beast.slug || idx} onClick={() => dispatch({
                type: 'add',
                beast: beast
              })}>
                {beast.name}
              </div>
            )}
          </div>

          <div className='beastiaryButtonGrid'>
            <button onClick={()=>onPreviousClicked()} disabled={currentPage === 1 || loading}>Previous</button>
            <button onClick={()=>onNextClicked()} disabled={currentPage >= maxPage || loading}>Next</button>
          </div>
        </div>
      </div>
  );

  function loadBeasts(){
    setLoading(true);
    setError(null);

    const url = searchTerm
      ? `${URL_MONSTERS}/?search=${searchTerm}&page=${currentPage}`
      : `${URL_MONSTERS}/?page=${currentPage}`;

    get(url)
    .then(
      data => {
        setBeasts(data.results || []);
        // Calculate actual page count from total count
        const totalPages = Math.ceil(data.count / PAGE_SIZE);
        setMaxPage(totalPages);
        setLoading(false);
      },
      error => {
        console.error('received error', error);
        setError('Failed to load monsters. Please try again.');
        setLoading(false);
      }
    )
  }

  function handleSearchInput(value){
    // Clear any existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    // If search is cleared, reset immediately
    if (value === "") {
      setSearchTerm('');
      setCurrentPage(1);
      return;
    }

    // Debounce: wait 500ms after user stops typing
    searchDebounceTimer.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 500);
  }

  function onPreviousClicked(){
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  }

  function onNextClicked(){
    if (currentPage >= maxPage) return;
    setCurrentPage(currentPage + 1);
  }
}

