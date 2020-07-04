import React, {Component} from 'react'
import { Switch, Router, Route, withRouter } from 'react-router-dom'
import { Nav, Badge, Dropdown, Button} from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { devices,devicesSizeNum } from "Client/devices";
import history from 'Client/history'
import {db, fb, auth} from 'Firebase'
import {UPDATE_AUTH_STATE} from "Constants/actionTypes"

const RightConer = styled.div`
`
const HeaderStyledContainer = styled.div`
  background-color: white;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 36px;
  &:after {
    bottom: -5px;
    box-shadow: inset 0px 4px 8px -3px rgba(17, 17, 17, .06);
    content: "";
    height: 5px;
    left: 0px;
    opacity: 1;
    pointer-events: none;
    position: absolute;
    right: 0px;
    width: 100%;
    z-index: 2050;
}
`;

const mapStateToProps = (state) =>{
  return{
    authState: state.user.authState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    onUserLogined: (value) => {
      dispatch({type: UPDATE_AUTH_STATE, value})
    },
  }
}

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {chainClick: 0}
    auth.onAuthStateChanged((user) => {
      if(user){
        var transcriptsQuery = db.collection("users").doc(user.uid);
        transcriptsQuery.get().then((doc)=>{
          if(doc.exists){
            const data = doc.data()
            if(data.level===1){
              this.state.user = user
              this.props.onUserLogined(user)
            }else{
              this.onLogoutClick()
            }
          }else{
            this.onLogoutClick()
          }
        });
      }else{
        console.log("onnouser")
        this.state.user = undefined
        this.props.onUserLogined(undefined)
      }
    })
  }

  componentDidMount() {
  }

onLogoutClick(){
  auth.signOut().then(()=> {
  }).catch((error)=> {
    console.log(error)
  });
}
onSwitchModeClick(){
  if(this.state.user){
    if(this.props.authState){
      this.props.onUserLogined(undefined)
    }else{
      this.props.onUserLogined(this.state.user)
    }

  }
}
  onLoginGoogle(){
    if(this.state.chainClick<5){
      this.state.chainClick++
      return
    }
    var provider = new fb.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
  }
  menuItem(value, path) {
    var isActive
    let match = this.props.match
    if(match){
      if((match.url=="/" && path=="/")|| (path!="/"&&match.url.includes(path))){
        isActive = true
      }
    }
    var text
    if(isActive){
      text = <b>{value}</b>
    }else{
      text = value
    }
    return (
      <Nav.Item className="d-flex flex-nowrap p-2 mr-2 pointer" onClick={()=>{history.push(path)}}>
        <span>{text}</span>
      </Nav.Item>
    );
  }

  onGithubClick(){
    const user = "masterchiefvn"
    const repo = "learnenglishrss"
    const githubUrl = `https://github.com/${user}/${repo}`
    window.open(githubUrl, "_blank")
  }
  getGithubButton(){
    const btn = <Button onClick={this.onGithubClick.bind(this)} size="sm" variant="link">GitHub</Button>
    return btn
  }
  render() {
    var btnLogout
    var navItemReport
    var btnSwitchMode
    if(this.state.user){
      if(this.props.authState){
        btnLogout = <Button variant="link" onClick={this.onLogoutClick.bind(this)}>{this.props.authState.displayName} - Log Out</Button>
        navItemReport = this.menuItem("Report manager", "/report-manager")
      }
      btnSwitchMode = <Button variant="link" onClick={this.onSwitchModeClick.bind(this)}>{this.props.authState?"Normal User":"Admin"}</Button>
    }else{
      btnLogout = <div className="p-2" onClick={this.onLoginGoogle.bind(this)}></div>
    }
    var githubButton = this.getGithubButton()
    const screenWidth = window.innerWidth
    return (
      <HeaderStyledContainer className="d-flex flex-column pl-2 pr-2">
      <Nav className="d-flex flex-wrap justify-content-center align-items-center mr-5">
        {this.menuItem("Home", "/")}
        {this.menuItem("Share Your Rss", "share-your-rss")}
        {this.menuItem("Rss Generator", "generator")}
        {navItemReport}
        {btnSwitchMode}
        {btnLogout}

      </Nav>
      <RightConer className="position-absolute align-self-end">
      {githubButton}
      </RightConer>
      </HeaderStyledContainer>

    );
  }
}
const connectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header)
const RenderContent = () => {
  return(
  <Switch>
  <Route path='/:frame' component={connectedHeader}/>
  <Route path='/' component={connectedHeader}/>
  </Switch>
)
};

export default withRouter(RenderContent);
