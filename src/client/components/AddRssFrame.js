import React, {Component} from "react";
import { connect } from 'react-redux'
import { compose } from 'redux'
import ContentLoader from "react-content-loader"
import {Row, Col, Button, Dropdown} from 'react-bootstrap'
import styled from 'styled-components';
import { Waypoint } from 'react-waypoint'
import {isEmpty, hashCode, rssKeyByName} from 'Utils'
import {fb, db} from 'Firebase'
import RSSParser from 'rss-parser'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

const mapStateToProps = (state) =>{
  return{

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

const ButtonStyled = styled(Button)`
  width: 130px;
`

const RssImageStyled = styled.img`
  object-fit: cover;
  object-position: center;
  width: 80px;
  height: 80px;
`

class AddRssFrame extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: '',
      tags: []
    }
  }

  fetchRssLink(){
    var link = this.linkInput.value
    console.log("fetchRssLink", link)
    if(link){
      let parser = new RSSParser();
      let redirect = `${window.location.origin}/read-url/${link}`
      parser.parseURL(redirect, (err, feed) => {
        console.log(feed)
        if(feed){
          var data = {}
          data.name = feed.title
          if(feed.itunes && feed.itunes.image){
            data.image = feed.itunes.image
          }else if(feed.image){
            data.image = feed.image.url
          }
          if(data.image){
            data.image = data.image.replace("http://", "https://")
          }
          var key = rssKeyByName(feed.title)
          var docRef = db.collection("rss").doc(key);
            docRef.get().then((doc)=> {
              if (doc.exists) {
                data.rssId = key
                data.message = "Rss existed"
                data.existed = true
                  this.setState(data)
              } else {
                data.message = undefined
                  this.setState(data)
              }
          }).catch((error)=> {
            data.message = "Error getting document:"+ error
            this.setState(data)
          });
        }else{
          this.setState({
            message: "no rss"
          })
        }
      })
    }

  }

  updateRssLink(){
    var link = this.state.link
    var key = this.state.rssId
    var postData = {
      link: link
    };
    db.collection("rss").doc(key).update(postData)
    .then(()=> {
        console.log("Document update successfully written!");
        this.linkInput.value = link
        this.setState({
          message: "Update rss link completed"
        })
    })
    .catch((error)=> {
      this.setState({
        message: "Error writing document: "+ error
      })
    });
  }
  addRssLink(){
    var link = this.state.link
    var tagsvalue = this.state.tags
    var name = this.state.name
    var description = this.state.description
    var image = this.imagePreview.src
    console.log("checkaddrsslink", link, name)
    if(link && name){
      var key = rssKeyByName(name)
      var postData = {
      created: fb.firestore.FieldValue.serverTimestamp(),
      link: link,
      name: name,
      tags: tagsvalue,
      score: 1,
      vote: 0,
      copied: 0
      };
      if(description){
        postData.description = description
      }
      if(image){
        postData.image = image
      }
      db.collection("rss").doc(key).set(postData)
      .then(()=> {
          console.log("Document successfully written!");
          this.linkInput.value = ''
          this.nameInput.value = ''
          this.descriptionInput.value = ''
          this.setState({
            tags: [],
            message: "Add new rss completed"
          })
      })
      .catch((error)=> {
        this.setState({
          message: "Error writing document: "+ error
        })
      });
    }else{
      this.setState({
        message: "Please fill all value"
      })
    }
  }

  handleChange(tags) {
      this.setState({tags})
  }

  handleLinkInput(){
    this.setState({link: this.linkInput.value})
  }

  handleNameInput(){
    this.setState({name: this.nameInput.value})
  }

  handleDescriptionInput(){
    this.setState({description: this.descriptionInput.value})
  }

  render(){
    return(
      <div className='p-3'>
      <div>
      <div className='mb-3'>
      <span>Link</span>
      </div>
      <input type="text" defaultValue={this.state.link} onChange={this.handleLinkInput.bind(this)}
       ref={el => this.linkInput=el} placeholder="Rss link" className="form-control mb-3" />
      <ButtonStyled onClick={this.fetchRssLink.bind(this)} className="mt-1 mb-2">Check</ButtonStyled>
      </div>
      <RssImageStyled className='mt-3' ref={el => this.imagePreview=el} src={this.state.image}/>
      <div>
      <div className='mt-3 mb-3'>
      <span>Name</span>
      </div>
      <input type="text" value={this.state.name||''} onChange={this.handleNameInput.bind(this)} ref={el => this.nameInput=el} placeholder="Rss name" className="form-control mb-3" />
      </div>
      <div>
      <div className='mb-3'>
      <span>Description</span>
      </div>
      <textarea value={this.state.description||''} onChange={this.handleDescriptionInput.bind(this)} ref={el => this.descriptionInput=el} placeholder="Rss description" className="form-control mb-3" />
      </div>
      <div>
      <div className='mb-3'>
      <span>Tags</span>
      </div>
      <TagsInput value={this.state.tags||''} onChange={this.handleChange.bind(this)} />
      </div>
      <div className="mt-3 mb-2">
      <ButtonStyled disabled={this.state.message||!this.state.link || !this.state.name} onClick={this.addRssLink.bind(this)}>Submit</ButtonStyled>
      <ButtonStyled disabled={!this.state.existed} onClick={this.updateRssLink.bind(this)} className="ml-3">Update Rss link</ButtonStyled>
      </div>
      <p>{this.state.message||''}</p>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRssFrame)
