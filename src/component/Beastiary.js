import React, {useState, useContext} from 'react'
import '../style/Beastiary.css'
import {get} from '../utilities/Fetcher.js'
import {useMountEffect} from "../utilities/ComponentUtils.js"
import {BeastDispatch} from './App.js'

export function Beastiary(props) {
  const dispatch = useContext(BeastDispatch);

  const [beasts, setBeasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const URL_BASE = "https://api.open5e.com/"
  const URL_MONSTERS = `${URL_BASE}monsters`

  useMountEffect(loadBeasts)

  return(
      <div className='beastTable'>
        <div className="beastContainer">
          <h1>Beastiary</h1>
          
          <input type='text' className='beastInput' onChange={(e) => searchForBeast(e.target.value)}/>

          <div className='beastList'>
            {beasts.map((beast, idx)=>
              <div className="beastRow" key={idx} onClick={() => dispatch({
                type: 'add',
                beast: beast
              })}>
                {beast.name}
              </div>
            )}
          </div>

          <div className='beastiaryButtonGrid'>
            <button onClick={()=>onPreviousClicked()} disabled={currentPage === 1}>Previous</button>
            <button onClick={()=>onNextClicked()} disabled={currentPage === maxPage}>Next</button>
          </div>
        </div>
      </div>
  );

  function loadBeasts(){
    get(URL_MONSTERS)
    .then(
      data => { 
        setBeasts(data.results)
        setMaxPage(data.count) 
      },
      error => {console.error('recieved error', error)}
    )
  }
  
  function searchForBeast(searchTerm){
    if (searchTerm === "") { return }

    get(`${URL_MONSTERS}/?search=${searchTerm}`)
    .then(
      data => { setBeasts(data.results) },
      error => {console.error('recieved error', error)}
    )
  }
  
  function onPreviousClicked(){
    if (currentPage === 1) return
    setCurrentPage(currentPage-1)
  
  }
  
  function onNextClicked(){
    if (currentPage === maxPage) return
    setCurrentPage(currentPage+1)  
  }
}

