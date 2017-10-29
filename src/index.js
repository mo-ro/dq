import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import enemyImg from "./img/enemy.png";

class Status extends Component {
  constructor() {
    super();
    this.state = {
      ally_hp: "500",
      enemy_hp: "1300",
      phase: "select",
      tagname: "",
      enemy_damage: "",
      ally_damage: "",
      answer: ""
    }
    
    this.attack = this.attack.bind(this);  
    this.changeEnemyState = this.changeEnemyState.bind(this);
    this.changeSelectState = this.changeSelectState.bind(this);
    this.enemyAttack = this.enemyAttack.bind(this);
    this.allyAttack = this.allyAttack.bind(this);
    this.answer = this.answer.bind(this);
  }
    
  getDamage() {
    
  }
  
  changeEnemyState() {
    var damage = this.enemyAttack();
    this.setState({enemy_damage: damage});
    this.setState(function(state, cur) {
      return {ally_hp: state.ally_hp - damage};
    });
    this.setState({phase: "enemy_attack"});
  }
  
  changeSelectState() {
    this.setState({phase: "select"})
  }
  
  enemyAttack() {
    return Math.floor( Math.random() * (110 - 80) ) + 80;
  }
  allyAttack() {
    return Math.floor( Math.random() * (320 - 290) ) + 290;
  }
  
  answer() {
    const answers = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "bbasefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body"];
    var rand = Math.floor( Math.random() * answers.length - 1);
    return answers[rand];
  }
    
  attack() {
    var setState = this.setState;
    var self = this;
    var answer = this.answer();
    var damage;
    
    this.setState({answer: answer});
    this.setState({phase: "attack"});
    window.setTimeout(function() {
      self.setState({tagname: answer});
      
      if(document.forms.attack_form.attack_input.value === answer){
        damage = self.allyAttack();
        self.setState({enemy_hp: self.state.enemy_hp - damage})
      }else{
        damage = 0;
      }
      self.setState({ally_damage: damage});
      self.setState({phase: "ally_attack"});
    }, 2500);
    
  }
  
  render() {
    if(this.state.phase === "select"){
      return(
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy />
          <Menu attack={this.attack}/>
        </div>
      )
    }else if(this.state.phase === "attack"){
      return(
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy />
          <Form answer={this.state.answer}/>
        </div>
      )
    }else if(this.state.phase === "ally_attack") {
      console.log(this.state.enemy_hp)
      return(
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy />
          <AllyAttackLog tagname={this.state.tagname} changeEnemyState={this.changeEnemyState} damage={this.state.ally_damage}/>
        </div>
      )
    }else if(this.state.phase === "enemy_attack") {
      return(
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy />
          <EnemyAttackLog changeSelectState={this.changeSelectState} damage={this.state.enemy_damage}/>
        </div>
      )
    }
  }
}

function toFullWidth(value) {
  return value.replace(/./g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

class TeamMembers extends Component {
  render() {
    var hp = this.props.hp;
    var status_color = document.getElementById("App");
    var borders = document.getElementsByClassName("border_style");
    var sheets = document.styleSheets,
    sheet = sheets[sheets.length - 1];
    
    if(hp <= 250 && hp > 100){
      var color = "#f1933a";
      status_color.style.color = color;
      document.getElementById("App").style.borderColor = color;

      sheet.insertRule('.menu_list:hover::after { border-left: 10px solid ' + color + ' }', sheet.cssRules.length);
    }else if(hp <= 100) {
      var color = "#e7261c";
      
      status_color.style.color = color;
      document.getElementById("App").style.borderColor = color;
      sheet.insertRule('.menu_list:hover::after { border-left: 10px solid ' + color + ' }', sheet.cssRules.length);
      if(hp <= 0) {
        hp = 0;
      }
    }
    return(
      <div className="members border_style">
        <ul>
          <li className="status_list">Ｈ<span>{toFullWidth(hp + "")}</span></li>
          <li className="status_list">Ｍ<span>６</span></li>
          <li className="status_list">も：<span>１</span></li>
        </ul>
      </div>
    )
  }
}

class Enemy extends Component {
  render() {
    return(
      <div className="enemy">
        <img src={enemyImg} className="enemy_img"/>
      </div>
    )
  }
}

class Menu extends Component {
  render() {
    return(
      <div className="menu">
        <div className="action_list border_style">
          <ul className="menu_lists">
            <li className="menu_list" onClick={this.props.attack}>たたかう</li>
            <li className="menu_list">じゅもん</li>
            <li className="menu_list">どうぐ</li>
            <li className="menu_list">にげる</li>
          </ul>
        </div>
        <div className="enemy_list border_style">
          うごくせきぞう<span>ー１ひき</span>
        </div>
      </div>
    )
  }
}

class Form extends Component {
  render() {
    return(
      <div>
        <div className="weak_point">
          じゃくてん：{this.props.answer}
        </div>
        <form id="attack_form">
          <input type="text" id="attack_input" autoFocus autocomplete="off" />
        </form>
      </div>
    )
  }
}

class AllyAttackLog extends Component {
  render() {
    return(
      <div className="ally_attack_log border_style" onClick={this.props.changeEnemyState}>
        もろーの{this.props.tagname}こうげき！<br />
        {toFullWidth(this.props.damage + "")}のダメージ！！
      </div>
    )
  }
}

class EnemyAttackLog extends Component {
  render() {
    console.log(this.props.damage)
    return(
      <div className="enemy_attack_log border_style" onClick={this.props.changeSelectState}>
        うごくせきぞうのこうげき！<br />
        {toFullWidth(this.props.damage + "")}のダメージ！！
      </div>
    )
  }
}


ReactDOM.render(
    <Status />
  , document.getElementById('App'));
registerServiceWorker();
