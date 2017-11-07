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
      answer: "",
      complete: ""
    }

    this.attack = this
      .attack
      .bind(this);
    this.changeEnemyState = this
      .changeEnemyState
      .bind(this);
    this.changeSelectState = this
      .changeSelectState
      .bind(this);
    this.enemyAttack = this
      .enemyAttack
      .bind(this);
    this.allyAttack = this
      .allyAttack
      .bind(this);
    // this.answer = this.answer.bind(this);
  }

  getDamage() {}

  changeEnemyState() {
    var damage = this.enemyAttack();
    this.setState({enemy_damage: damage});
    this.setState(function (state, cur) {
      return {
        ally_hp: state.ally_hp - damage
      };
    });
    this.setState({phase: "enemy_attack"});
  }

  changeSelectState() {
    this.setState({phase: "select"})
  }

  enemyAttack() {
    return Math.floor(Math.random() * (110 - 80)) + 80;
  }
  allyAttack() {
    return Math.floor(Math.random() * (320 - 290)) + 290;
  }

  attack(e, key) {
    var setState = this.setState;
    var self = this;
    var answer = e.target.accessKey;
    var damage;
    console.log(e.target.accessKey)

    this.setState({answer: answer});
    this.setState({phase: "attack"});
    window.setTimeout(function () {
      self.setState({tagname: answer});

      if (document.getElementsByClassName("weak_point")[0].textContent === "") {
        damage = self.allyAttack();
        self.setState({
          enemy_hp: self.state.enemy_hp - damage
        })
      } else {
        damage = 0;
      }
      self.setState({ally_damage: damage});
      self.setState({phase: "ally_attack"});
    }, 3000);

  }

  componentWillUpdate() {
    // console.log(document.activeElement)
    if (document.activeElement.id === "attack_input") {
      // document.getElementById("attack_input").blur();
      console.log(document.activeElement)

    }

  }

  componentDidUpdate() {
    console.log("0")
    var self = this;
    var answer = this
      .state
      .answer
      .slice();
    console.log(answer)
    if (document.getElementById("type_point")) {
      var input = document.getElementById("type_point");
      console.log(input)
      document.addEventListener("keydown", function (event) {
        var chart = String.fromCharCode(event.keyCode);
        // alert(String.fromCharCode(event.keyCode))
        if (answer.slice(0, 1) === chart) {
          answer = answer.slice(1)
          console.log(answer, chart)
          var a = document.getElementsByClassName("weak_point")[0].textContent;
          var b = document.getElementsByClassName("complete")[0].textContent;
          console.log(b)
          b += a.slice(0, 1);
          document.getElementsByClassName("complete")[0].textContent = b;
          a = a.slice(1);
          document.getElementsByClassName("weak_point")[0].textContent = a;
        }
        //     this.blur();     var _e = document.createEvent("KeyboardEvent");
        // _e.initKeyboardEvent("keydown", true, true, null, false, false, false, false,
        // 13, 0); document.getElementById("attack_input").dispatchEvent(_e);
        // this.focus();
      })

    }
  }

  render() {
    if (this.state.phase === "select") {
      return (
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy/>
          <Menu attack={this.attack}/>
        </div>
      )
    } else if (this.state.phase === "attack") {
      return (
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy/>
          <Form answer={this.state.answer}/>
        </div>
      )
    } else if (this.state.phase === "ally_attack") {
      console.log(this.state.enemy_hp)
      return (
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy/>
          <AllyAttackLog
            tagname={this.state.tagname}
            changeEnemyState={this.changeEnemyState}
            damage={this.state.ally_damage}/>
        </div>
      )
    } else if (this.state.phase === "enemy_attack") {
      return (
        <div className="display_wrapper">
          <TeamMembers hp={this.state.ally_hp}/>
          <Enemy/>
          <EnemyAttackLog
            changeSelectState={this.changeSelectState}
            damage={this.state.enemy_damage}/>
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

    if (hp <= 250 && hp > 100) {
      var color = "#f1933a";
      status_color.style.color = color;
      document
        .getElementById("App")
        .style
        .borderColor = color;

      sheet.insertRule('.menu_list:hover::after { border-left: 10px solid ' + color + ' }', sheet.cssRules.length);
    } else if (hp <= 100) {
      var color = "#e7261c";

      status_color.style.color = color;
      document
        .getElementById("App")
        .style
        .borderColor = color;
      sheet.insertRule('.menu_list:hover::after { border-left: 10px solid ' + color + ' }', sheet.cssRules.length);
      if (hp <= 0) {
        hp = 0;
      }
    }
    return (
      <div className="members border_style">
        <ul>
          <li className="status_list">Ｈ<span>{toFullWidth(hp + "")}</span>
          </li>
          <li className="status_list">Ｍ<span>６</span>
          </li>
          <li className="status_list">も：<span>１</span>
          </li>
        </ul>
      </div>
    )
  }
}

class Enemy extends Component {
  render() {
    return (
      <div className="enemy">
        <img src={enemyImg} className="enemy_img"/>
      </div>
    )
  }
}

class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <div className="action_list border_style">
          <ul className="menu_lists">
            <li className="menu_list menu_attack">たたかう
              <div className="list_hover border_style">
                <ul>
                  <li accessKey="ARUTEMASO-DO" onClick={this.props.attack}>アルテマソード</li>
                  <li accessKey="ぎがすらっしゅ" onClick={this.props.attack}>ギガスラッシュ</li>
                  <li accessKey="かいはざん" onClick={this.props.attack}>かいはざん</li>
                  <li accessKey="だいちざん" onClick={this.props.attack}>だいちざん</li>
                  <li accessKey="くうれつざん" onClick={this.props.attack}>くうれつざん</li>
                  <li accessKey="たいがーくろー" onClick={this.props.attack}>タイガークロー</li>
                  <li accessKey="ぎがくろすぶれいく" onClick={this.props.attack}>ギガクロスブレイク</li>
                </ul>
              </div>
            </li>
            <li className="menu_list menu_magic">じゅもん</li>
            <li className="menu_list menu_item">どうぐ</li>
            <li className="menu_list menu_dash">にげる</li>
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
    return (
      <div id="type_point">
        <span className="complete"></span>
        <div className="weak_point">
          {this.props.answer}
        </div>
      </div>
    )
  }
}

class AllyAttackLog extends Component {
  render() {
    return (
      <div
        className="ally_attack_log border_style"
        onClick={this.props.changeEnemyState}>
        もろーの{this.props.tagname}こうげき！<br/> {toFullWidth(this.props.damage + "")}のダメージ！！
      </div>
    )
  }
}

class EnemyAttackLog extends Component {
  render() {
    console.log(this.props.damage)
    return (
      <div
        className="enemy_attack_log border_style"
        onClick={this.props.changeSelectState}>
        うごくせきぞうのこうげき！<br/> {toFullWidth(this.props.damage + "")}のダメージ！！
      </div>
    )
  }
}

ReactDOM.render(
  <Status/>, document.getElementById('App'));
registerServiceWorker();
