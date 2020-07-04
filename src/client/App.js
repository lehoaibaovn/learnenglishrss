import React, { Component } from "react";
import Loadable from 'react-loadable';
import "./app.css";
import LoadingComponent from 'Client/LoadingComponent';
import { Router, Route, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom'
import Content from 'Components/Content';
import {HeaderStyledContainer} from 'Components/Header'
import {Helmet} from "react-helmet";

const HeaderLoadingComponent = (props) => {
 if (props.isLoading) {
   if (props.timedOut) {
     return <div>Loader timed out!</div>;
   } else if (props.pastDelay) {
     return <HeaderStyledContainer/>;
   } else {
     return null;
   }
 } else if (props.error) {
   console.log(props.error);
   return <div>Error! Component failed to load2</div>;
 } else {
   return null;
 }
}
const Header = Loadable({
  loader: () => import('Components/Header'),
  loading: HeaderLoadingComponent
});

function navItemActive(props){
  if(props.active){
    switch(props.active){
      case "true":
      return 'red';
      default:
      return 'transparent';
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }


  render() {
    return (
      <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Learn English Rss</title>
        <meta name="description" content="Rss to Learn English"/>
        <link rel="canonical" href="https://learnenglishrss.herokuapp.com" />
      </Helmet>
      <Header></Header><Content></Content></div>
    );
  }
}

export default hot(module)(App)
