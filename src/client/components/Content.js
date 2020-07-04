import React, {Component} from "react";
import Loadable from 'react-loadable';
import LoadingComponent from "Client/LoadingComponent";
import { devices, devicesSizeNum } from "Client/devices";
import styled from 'styled-components';
import { Switch, Router, Route, Link, withRouter } from 'react-router-dom'
import history from 'Client/history'
import RssGeneratorFrame from "Components/RssGeneratorFrame"
import AddRssFrame from "Components/AddRssFrame"
import RssListFrame from "Components/RssListFrame"
import ReportManagerFrame from "Components/ReportManagerFrame"
import commentBox from 'commentbox.io';
const FrameStyled = styled.div`
  padding-top: 36px;
  background: whitesmoke;
  min-height: 100vh;
`
const ContentInside = styled.div`
  border-radius: 0px;
  width: 100%;
  max-width: 900px;
  background: white;
`

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
      this.removeCommentBox = commentBox('5729482597990400-proj');
  }

  render(){
    return(
      <FrameStyled className="d-flex justify-content-center">
      <ContentInside>
      <Switch>
      <Route exact path='/' component={RssListFrame}/>
      <Route exact path='/generator/' component={RssGeneratorFrame}/>
      <Route exact path='/share-your-rss/' component={AddRssFrame}/>
      <Route exact path='/report-manager/' component={ReportManagerFrame}/>
      </Switch>
      <div className="commentbox" />
      </ContentInside>

      </FrameStyled>
    );
  }
}
export default withRouter(Content);
