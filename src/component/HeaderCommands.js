import React, {useContext} from 'react' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import {BeastDispatch} from './App.js'

export function HeaderCommands(props) {
    const dispatch = useContext(BeastDispatch);

    return (
    <div className='header'>
        <FontAwesomeIcon className='icon headerIcon' icon={ faPlus } onClick={()=>dispatch({ type: 'initial' })} />
        <FontAwesomeIcon className='icon headerIcon' icon={ faTrash } onClick={()=>dispatch({ type: 'reset' })} />
        <FontAwesomeIcon className='icon headerIcon' icon={ faSave }/>
    </div>
    )
}