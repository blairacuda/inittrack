import React, {useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSave, faTrash, faBan} from '@fortawesome/free-solid-svg-icons'
import {BeastDispatch} from './App.js'
import '../style/HeaderCommands.css'

export function HeaderCommands(props) {
    const dispatch = useContext(BeastDispatch);
    const { onSave, saveMessage } = props;

    return (
    <div className='header'>
        <div className='headerIcons'>
            <FontAwesomeIcon className='icon headerIcon' icon={ faPlus } onClick={()=>dispatch({ type: 'initial' })} title="Add empty character" />
            <FontAwesomeIcon className='icon headerIcon' icon={ faTrash } onClick={()=>dispatch({ type: 'reset' })} title="Remove all NPCs" />
            <FontAwesomeIcon className='icon headerIcon' icon={ faSave } onClick={onSave} title="Save to browser storage" />
            <FontAwesomeIcon className='icon headerIcon' icon={ faBan } onClick={()=>{
                if (window.confirm('Clear all characters and saved data?')) {
                    dispatch({ type: 'clearAll' });
                }
            }} title="Clear all & storage" />
        </div>
        {saveMessage && <div className='saveMessage'>{saveMessage}</div>}
    </div>
    )
}