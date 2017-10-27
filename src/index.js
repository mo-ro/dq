import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

class Status extends Component {
  constructor() {
    super();
    this.state = {
      ally: "500",
      enemy: "500"
    }
    this.attack = this.attack.bind(this);    
  }
    
  attack() {
    this.setState(function(state, cur) {
      return {ally: state.ally - 10};
    });
  }
  
  render() {
    return(
      <div className="display_wrapper">
        <TeamMembers hp={this.state.ally}/>
        <Enemy />
        <Menu attack={this.attack}/>
      </div>
    )
  }
}

function toFullWidth(value) {
  return value.replace(/./g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

class TeamMembers extends Component {
  render() {
    var hp = this.props.hp
    return(
      <div className="members">
        <ul>
          <li>Ｈ<span>{toFullWidth(this.props.hp + "")}</span></li>
          <li>Ｍ</li>
          <li></li>
        </ul>
      </div>
    )
  }
}

class Enemy extends Component {
  render() {
    return(
      <div className="enemy">
      
      </div>
    )
  }
}

class Menu extends Component {
  render() {
    return(
      <div className="menu">
        <div className="menu_inner">
          <ul className="menu_lists">
            <li className="menu_list" onClick={this.props.attack}>たたかう</li>
            <li className="menu_list">まほう</li>
            <li className="menu_list">アイテム</li>
            <li className="menu_list">にげる</li>
          </ul>
        </div> 
      </div>
    )
  }
}


ReactDOM.render(
    <Status />
  , document.getElementById('App'));
registerServiceWorker();
