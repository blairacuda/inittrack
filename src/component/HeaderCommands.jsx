import React, {useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSave, faTrash, faBan} from '@fortawesome/free-solid-svg-icons'
import {BeastDispatch} from './App.jsx'
import '../style/HeaderCommands.css'

export function HeaderCommands(props) {
    const dispatch = useContext(BeastDispatch);
    const { onSave, saveMessage } = props;

    return (
    <div className='header'>
        <div className='logoBox'>⚔</div>
        <div className='appTitleGroup'>
            <span className='appTitle'>InitTrack</span>
            <span className='appSubtitle'>D&amp;D 5e Initiative Tracker</span>
        </div>
        <div className='headerSpacer' />
        <div className='headerActions'>
            <button className='btn-primary' onClick={() => dispatch({ type: 'initial' })} title="Add empty character">
                <FontAwesomeIcon icon={faPlus} />
                Add Character
            </button>
            <button className='btn-secondary' onClick={() => dispatch({ type: 'reset' })} title="Remove all NPCs">
                <FontAwesomeIcon icon={faTrash} style={{color: 'var(--red)'}} />
                Remove NPCs
            </button>
            <button className='btn-secondary' onClick={onSave} title="Save to browser storage">
                <FontAwesomeIcon icon={faSave} style={{color: 'var(--blue)'}} />
                Save
            </button>
            <button className='btn-secondary' onClick={() => {
                if (window.confirm('Clear all characters and saved data?')) {
                    dispatch({ type: 'clearAll' });
                }
            }} title="Clear all & storage">
                <FontAwesomeIcon icon={faBan} style={{color: 'var(--red)'}} />
                Clear All
            </button>
        </div>
        {saveMessage && <div className='saveMessage'>{saveMessage}</div>}
    </div>
    )
}
