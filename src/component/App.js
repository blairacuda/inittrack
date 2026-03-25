import React, {useReducer, useState} from 'react';
import {InputTable} from './InputTable.js'
import {Beastiary} from './Beastiary.js'
import '../style/App.css'
import { HeaderCommands } from './HeaderCommands.js';

export const BeastDispatch = React.createContext(null);

const InitSortEnum={
  none: 0,
  asc: 1,
  dsc: 2
}

const STORAGE_KEY = 'inittrack-characters';

// Load saved data from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return data.characters || [getInitialCharacter()];
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return [getInitialCharacter()];
}

function getInitialCharacter(){ return {isNpc:true, name: '', initiative: 0, armorClass: 0, hitPoints: 0, maxHitPoints: 0} }

export function App() {
  const [initSort, setInitSort] = React.useState(InitSortEnum.none)
  const [saveMessage, setSaveMessage] = useState('');
  const [characterList, dispatch] = useReducer((state, action)=>{
    let myChars = []
    switch(action.type){
        case 'initial':
          return [            
            ...state,
            getInitialCharacter()
          ]
        case 'add':
            return [
                ...state,
                {
                  isNpc: true,
                  initiative: 0,
                  name: action.beast.name,
                  armorClass: action.beast.armor_class,
                  maxHitPoints: action.beast.hit_points,
                  hitPoints: action.beast.hit_points
                }
            ]
        case 'reset':
            myChars = state.filter((item)=> !item.isNpc)
            if (myChars === undefined || myChars.length === 0) {
              myChars.push(getInitialCharacter())
            }

            return myChars
        case 'remove':
            return state.filter((_, idx)=> idx !== action.index)
        case 'update':
          myChars = [...state]
          switch(action.property){
              case 'isNpc': action.beast.isNpc = action.value; break;
              case 'name': action.beast.name = action.value; break;
              case 'initiative': action.beast.initiative = Number(action.value); break;
              case 'armorClass': action.beast.armorClass = Number(action.value); break;
              case 'maxHitPoints': 
                  action.beast.maxHitPoints = Number(action.value); 
                  action.beast.hitPoints = Number(action.value); 
                  break;
              case 'hitPoints': action.beast.hitPoints = Number(action.value); break;
              default: console.log('hit the default case')
          }        

          myChars[action.index] = action.beast
          return myChars
        case 'sort':
          myChars = [...state] 
            if (initSort === InitSortEnum.asc){ // sorted asc; sort desc
                myChars = state.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
                setInitSort(InitSortEnum.dsc)
            }else if (initSort === InitSortEnum.dsc){ // sorted desc; sort asc
                myChars = state.sort((a,b) => (a.initiative > b.initiative) ? 1 : ((b.initiative > a.initiative) ? -1 : 0));
                setInitSort(InitSortEnum.asc)
            }else{ // no sort; default to asc
                myChars = state.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
                setInitSort(InitSortEnum.asc)
            }
            return myChars
        case 'copy':
          myChars = [...state]
          for (var i = 0; i < action.copyCount; i++) {
              var newCharacter = JSON.parse(JSON.stringify(action.character));
              myChars.push(newCharacter)
          }
          return myChars
        case 'save':
          // Save current state to localStorage
          try {
            const dataToSave = {
              characters: state,
              savedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            action.onSuccess && action.onSuccess();
          } catch (error) {
            console.error('Error saving to localStorage:', error);
            action.onError && action.onError(error);
          }
          return state;
        case 'clearAll':
          // Clear everything including localStorage
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (error) {
            console.error('Error clearing localStorage:', error);
          }
          return [getInitialCharacter()];
        default: return state;
    }
  }, loadFromStorage())

  // Handler for save success with visual feedback
  const handleSave = () => {
    dispatch({
      type: 'save',
      onSuccess: () => {
        setSaveMessage('Saved!');
        setTimeout(() => setSaveMessage(''), 2000);
      },
      onError: () => {
        setSaveMessage('Error saving!');
        setTimeout(() => setSaveMessage(''), 2000);
      }
    });
  };

  return (
    <div className="App applicationGrid">
      <BeastDispatch.Provider value={dispatch}>
        <HeaderCommands className="header" onSave={handleSave} saveMessage={saveMessage}/>
        <InputTable className="beastRows" characterList={characterList} initSort={initSort}/>
        <Beastiary beastSelected={(beast)=>console.log(beast.name)}/>
      </BeastDispatch.Provider>
    </div>
  );
}