import React, {useContext} from 'react'
import '../style/InputTable.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSortAmountDown, faClipboard, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import {BeastDispatch} from './App.jsx'

export function InputTable(props) {
    const dispatch = useContext(BeastDispatch);

    function getRowStateClass(character) {
        if (character.maxHitPoints > 0 && character.hitPoints <= character.maxHitPoints * 0.25) return 'redBackground';
        if (character.maxHitPoints > 0 && character.hitPoints <= character.maxHitPoints * 0.5)  return 'yellowBackground';
        return '';
    }

    return (
        <div className="beastRows">
            {/* Toolbar */}
            <div className="tableToolbar">
                <span className="sectionTitle">Initiative Order</span>
                <button className="sortBtn" onClick={sortByInit}>
                    <FontAwesomeIcon className="sortBtnIcon" icon={faSortAmountDown} />
                    Sort
                </button>
            </div>

            {/* Table */}
            <div className="inputGrid">
                {/* Column headers */}
                <div className='columnGrid'>
                    <div>NPC</div>
                    <div>Name</div>
                    <div>Init</div>
                    <div>AC</div>
                    <div>Max HP</div>
                    <div>HP</div>
                    <div>Actions</div>
                </div>

                {/* Character rows */}
                {props.characterList.map((character, idx) => {
                    const stateClass = getRowStateClass(character);
                    return (
                        <div className={`characterGrid ${stateClass}`} key={idx}>
                            <input
                                type='checkbox'
                                name='isNpc'
                                checked={character.isNpc}
                                onChange={(e) => dispatch({
                                    type: 'update', index: idx,
                                    property: 'isNpc', value: e.target.checked, beast: character
                                })}
                            />
                            <div className="nameCell">
                                <input
                                    type='text'
                                    className='nameInput'
                                    name='name'
                                    onFocus={handleFocus}
                                    value={character.name}
                                    onChange={(e) => onInputChange(e, idx, character)}
                                />
                                {character.isNpc && character.name && (
                                    <span className="npcBadge">NPC</span>
                                )}
                            </div>
                            <input type='number' className='verySmallInput' name='initiative'
                                onFocus={handleFocus} value={character.initiative}
                                onChange={(e) => onInputChange(e, idx, character)} />
                            <input type='number' className='verySmallInput' name='armorClass'
                                onFocus={handleFocus} value={character.armorClass}
                                onChange={(e) => onInputChange(e, idx, character)}
                                disabled={!character.isNpc} />
                            <input type='number' className='smallInput' name='maxHitPoints'
                                onFocus={handleFocus} value={character.maxHitPoints}
                                onChange={(e) => onInputChange(e, idx, character)}
                                disabled={!character.isNpc} />
                            <input type='number' className={`smallInput hpInput`} name='hitPoints'
                                onFocus={handleFocus} value={character.hitPoints}
                                onChange={(e) => onInputChange(e, idx, character)}
                                disabled={!character.isNpc} />

                            <div className="rowIconGrid">
                                <span className="rowAction tooltip" onClick={() => copyCharacter(character)}>
                                    <FontAwesomeIcon icon={faClipboard} />
                                    <span className="tooltiptext">Copy row once</span>
                                </span>
                                <span className="rowAction tooltip" onClick={() => copyCharacter(character, true)}>
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                    <span className="tooltiptext">Copy row multiple times</span>
                                </span>
                                <span className="rowAction danger tooltip" onClick={() => dispatch({ type: 'remove', index: idx })}>
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span className="tooltiptext">Delete row</span>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Health legend */}
            <div className="healthLegend">
                <span className="legendLabel">Health:</span>
                <span className="legendItem">
                    <span className="legendDot" style={{background: 'var(--green)'}} />
                    Healthy
                </span>
                <span className="legendItem">
                    <span className="legendDot" style={{background: 'var(--yellow-hl)'}} />
                    Bloodied (&le;50%)
                </span>
                <span className="legendItem">
                    <span className="legendDot" style={{background: 'var(--red)'}} />
                    Critical (&le;25%)
                </span>
            </div>
        </div>
    );

    function handleFocus(event) { event.target.select(); }

    function onInputChange(args, idx, character) {
        dispatch({
            type: 'update', index: idx,
            property: args.target.name,
            value: args.target.value,
            beast: character
        });
    }

    function sortByInit() {
        dispatch({ type: 'sort' });
    }

    function copyCharacter(character, promptForCount = false) {
        let copyCount = 1;
        if (promptForCount) {
            copyCount = Number(prompt("How many copies would you like?"));
            if (isNaN(copyCount) || !isFinite(copyCount)) {
                alert("Copy count must be a number.");
                return;
            }
            if (copyCount === 0) return;
        }
        dispatch({ type: 'copy', character, copyCount });
    }
}
