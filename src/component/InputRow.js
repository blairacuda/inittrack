import React from 'react';

export default class InputRow extends React.Component {
  constructor(props){
    super(props)

    console.log(props)    
    this.state={ 
      value: props.value,
      type: props.type,
      isNpc: true

    }

    this.onValueChange = this.onValueChange.bind(this);
  }

  render(){
    return ( <input type={this.state.type} onFocus={(e) => this.handleFocus(e)} value={this.state.value} onChange={(e) => this.onInputChange(e)} disabled={!this.state.isNpc}/> );
  }

  onValueChange(args){
    console.log(args.target.value)
    this.setState({value: args.target.value})
  }
}