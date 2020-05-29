import React, {useContext} from 'react'
import '../style/InputTable.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSave, faTrash, faSort, faSortUp, faSortDown, faClipboard, faHashtag } from '@fortawesome/free-solid-svg-icons'
import {BeastDispatch} from './App.js'

export function InputTable(props) {
    //const [initSort, setInitSort] = useState(0);
    const dispatch = useContext(BeastDispatch);

    return (
        <div className="beastRows">
            <div className="inputGrid">
                <div className='columnGrid'>
                    <div>NPC</div>
                    <div>Name</div>
                    <div className='headerIcon sortGrid'>
                        <FontAwesomeIcon icon={ props.initSort === 0 ? faSort : props.initSort === 1 ? faSortUp : faSortDown } onClick={sortByInit}/>
                        {/* <FontAwesomeIcon icon={ faSort } onClick={sortByInit}/> */}
                        <div>Init</div>
                    </div>
                    <div>AC</div>
                    <div>Max HP</div>
                    <div>HP</div>
                    <div></div>
                </div>

                {props.characterList.map((character, idx)=>                
                    <div className={`characterGrid
                                    ${character.maxHitPoints>0 && character.hitPoints <= character.maxHitPoints*.25 ? 'redBackground' : 
                                        character.maxHitPoints>0 && character.hitPoints <= character.maxHitPoints*.5 ? 'yellowBackground': ''}`} key={idx}>
                        
                        <input type='checkbox' name='isNpc' checked={character.isNpc} onChange={(e) => dispatch({
                            type: 'update',
                            index: idx,
                            property: 'isNpc',
                            value: e.target.checked,
                            beast: character
                        })}/>
                        <input type='text' name='name' onFocus={(e) => handleFocus(e)} value={character.name} onChange={(e) => onInputChange(e, idx, character)}/>
                        <input type='number' className='verySmallInput' name='initiative' onFocus={(e) => handleFocus(e)} value={character.initiative} onChange={(e) => onInputChange(e, idx, character)}/>
                        <input type='number' className='verySmallInput' name='armorClass' onFocus={(e) => handleFocus(e)} value={character.armorClass} onChange={(e) => onInputChange(e, idx, character)} disabled={!character.isNpc}/>
                        <input type='number' className='smallInput' name='maxHitPoints' onFocus={(e) => handleFocus(e)} value={character.maxHitPoints} onChange={(e) => onInputChange(e, idx, character)} disabled={!character.isNpc}/>
                        <input type='number' className='smallInput' name='hitPoints' onFocus={(e) => handleFocus(e)} value={character.hitPoints} onChange={(e) => onInputChange(e, idx, character)} disabled={!character.isNpc}/>

                        <div className="rowIconGrid">
                            <span className="fa-stack tooltip" onClick={() => copyCharacter(character)} >
                                <FontAwesomeIcon className='fa-stack-2x' icon={ faClipboard }/>
                                <strong className="iconText fa-stack-1x">1</strong>
                                <span className="tooltiptext">Click to copy row once</span>
                            </span>
                            <span className="fa-stack tooltip" onClick={() => copyCharacter(character, true)} >
                                <FontAwesomeIcon className='fa-stack-2x' icon={ faClipboard }/>
                                <FontAwesomeIcon className='infinityIcon fa-stack-1x fa-inverse' icon={ faHashtag }/>
                                <span className="tooltiptext">Click to copy row multiple times</span>
                            </span>
                            <span className="fa-stack tooltip">
                                <FontAwesomeIcon className='fa-stack-2x' icon={ faTrash } onClick={() => dispatch({
                                    type: 'remove',
                                    index: idx
                                })} />
                                <span className="tooltiptext">Click to delete row</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    function handleFocus(event){ event.target.select();}   

    function onInputChange(args, idx, character){
        dispatch({
            type: 'update',
            index: idx,
            property: args.target.name,
            value: args.target.value,
            beast: character
        })
    }

    function sortByInit(){
        dispatch({ type: 'sort' })
    }

    function saveTracker(){
        // var charactersJson = JSON.stringify(characters)
        
        // const a = document.createElement("a");
        // a.href = URL.createObjectURL(new Blob([JSON.stringify(charactersJson, null, 2)], { type: "text/plain" }));
        // a.setAttribute("download", "data.txt");
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    }

    function copyCharacter(character, promptForCount = false){
        let copyCount = 1;
        if (promptForCount === true)
        {
            copyCount = Number(prompt("How many copies would you like?"));
            if (!isNumber(copyCount)){
                alert("Copy count must be a number.");
                return;
            }
            if (copyCount === 0){ return;}
        }

        dispatch({
            type: 'copy',
            character: character,
            copyCount: copyCount
        })
    }

    function isNumber(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }
  }