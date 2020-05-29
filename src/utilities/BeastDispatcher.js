import React, {useReducer} from 'react';

export const BeastDispatch = React.createContext(null);

export function BeastDispatcher(){
const [characterList, dispatch] = useReducer((state, action)=>{
    switch(action.type){
        case 'initial':
          return [
            ...state,
            getInitialCharacter()
          ]
        case 'add':
            console.log(action.beast)
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
            return state.filter((item)=> !item.isNpc)
        case 'remove':
            return state.filter((_, idx)=> idx !== action.index)
        case 'update':
          let myChars = [...state]
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
            // let myChars = [...state] 
            // let sort = initSort
            // if (sort === 1){ // sorted asc; sort desc
            //     myChars = state.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
            //     sort = 2
            // }else if (sort === 2){ // sorted desc; sort asc
            //     myChars = state.sort((a,b) => (a.initiative > b.initiative) ? 1 : ((b.initiative > a.initiative) ? -1 : 0));
            //     sort = 1
            // }else{ // no sort; default to asc
            //     myChars = state.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
            //     sort = 1
            // }
            return state
        default: return state;
    }
  }, [getInitialCharacter()])

    function getInitialCharacter(){ return {isNpc:true, name: '', initiative: 0, armorClass: 0, hitPoints: 0, maxHitPoints: 0} }
}