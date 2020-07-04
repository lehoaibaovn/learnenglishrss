import React, {Component} from "react";
import styled from 'styled-components';
import ContentLoader from "react-content-loader"
import {Button, Badge} from 'react-bootstrap'
import { Switch, Router, Route, Link, withRouter } from 'react-router-dom'
import {GET_REPORT_ITEMS} from 'Constants/actionTypes'
import { connect } from 'react-redux';
import {MdMoreVert, MdSort} from 'react-icons/md';
import { Waypoint } from 'react-waypoint'
import {fb, db} from 'Firebase'
import {getTimeStamp} from 'Utils'
import LoadingView from "Client/LoadingView";
import LoadMoreView from "Client/LoadMoreView";
const mapStateToProps = (state) =>{
  return{
    items: state.report.items,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    onReportItems: (value, clear) => {
      dispatch({type:GET_REPORT_ITEMS, value, clear})
    }
  }
}

class RsssFrame extends Component {
  constructor(props){
    super(props)
    this.state={filter: "vote"}
  }

  setRssItems(items, clear){
    this.props.onReportItems(items, clear)
  }
  onAgentData(documentSnapshots, clear){
    this.state.apiRunning = false
    if(documentSnapshots.docs){
      var reportItems = []
      if(documentSnapshots.docs.length>0){
        this.lastDocumentSnapshot = documentSnapshots.docs[documentSnapshots.docs.length-1]
      }else{
        this.lastDocumentSnapshot = undefined
      }
      documentSnapshots.docs.forEach( item =>{
          reportItems.push({id: item.id, data: item.data()})
      })
      this.setRssItems(reportItems, clear)
    }
  }

  getData(startDocumentSnapshot){
    if(this.state.apiRunning){
      return
    }
    var first = db.collection("report")
      .orderBy("created", "desc")

    if(startDocumentSnapshot){
      first = first.startAfter(startDocumentSnapshot)
    }
    first = first.limit(10);
    this.setState({apiRunning: true})
    first.get().then((documentSnapshots)=>{
      this.onAgentData(documentSnapshots, !startDocumentSnapshot)
    });
  }

  nextItems(){
    if(this.props.items && this.props.items.length>0){
      if(this.lastDocumentSnapshot){
        this.getData(this.lastDocumentSnapshot)
      }
    }
  }
  componentDidUpdate(){
    if(!this.props.items){
      this.getData()
    }
  }
  componentDidMount(){
    this.getData()
  }

  generateReportRows(items){
    var rows=[]
    if(items){
      var created
      items.forEach( item =>{
        created = getTimeStamp(item.data.created.seconds*1000)
        rows.push(<div className="p-3" key={rows.length}>
        <div className="mb-2"><b>{created}</b></div>
        <div className="mb-2"><b>Report ID:</b> {item.id}</div>
        <div className="mb-2"><b>User Email:</b> {item.data.email}</div>
        <div className="mb-2"><b>Rss Name:</b> {item.data.name}</div>
        <div className="mb-2"><b>Rss URL:</b> {item.data.link}</div>
        <div className="mb-2"><b>Transcript URL:</b> {item.data.transcript&&item.data.transcript.link}</div>
        <div className="mb-2"><b>Report Content:</b> {item.data.content}</div>
        </div>);
      })
    }
    return rows
  }

  getContent(){
    var rows = this.generateReportRows(this.props.items)
    var loadMoreView
    if(this.props.items.length>0){
      if(this.lastDocumentSnapshot){
        loadMoreView = <div><Waypoint onEnter={this.nextItems.bind(this)} /><LoadMoreView loading={this.state.apiRunning}/>
        </div>
      }
      return <div>
        {rows}
        <div className="mt-2">
        {loadMoreView}
        </div>
      </div>
    }else{
      return <div className="p-3">No items for this view</div>
    }

  }
  render(){
    if(this.props.items){
      return(
      <div>{this.getContent()}</div>
      )
    }else{
      return <LoadingView/>
    }

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RsssFrame)
