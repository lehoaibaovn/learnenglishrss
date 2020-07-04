import React, {Component} from "react";
import { connect } from 'react-redux'
import { compose } from 'redux'
import ContentLoader from "react-content-loader"
import {Row, Col, Button, Dropdown} from 'react-bootstrap'
import styled from 'styled-components';
import { Waypoint } from 'react-waypoint'
import {hashCode, rssKeyByName} from 'Utils'
import {fb, db} from 'Firebase'
import RSSParser from 'rss-parser'
import RSS from 'rss';
import beautify from 'xml-beautifier';
import copy from 'copy-to-clipboard';

const mapStateToProps = (state) =>{
  return{

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

const RssResult = styled.div`
  overflow: scroll;
  background: whitesmoke;
  height: 300px;
`

const ButtonStyled = styled(Button)`
  width: 100px;
`

const RssImageStyled = styled.img`
  object-fit: cover;
  object-position: center;
  width: 80px;
  height: 80px;
`

const FrameStyled = styled.div`
  width: 100%;
`
class RssGeneratorFrame extends Component {
  constructor(props){
    super(props);
    this.itemRefs = {}
    this.state = {
      message: ''
    }
  }

  handleChange (e) {
    console.log("handlechange", this.nameInput.value)
    this.state.message = undefined
    this.forceUpdate()
  }

  onCopy(value){
    copy(value)
    this.setState({
      message: "Copied to clipboard!"
    })
  }

  downloadTxtFile(name, value){
    const element = document.createElement("a");
    const file = new Blob([value], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = name.toLowerCase().replace(/\s{1,}/g,"-")+".xml";
    document.body.appendChild(element);
    element.click();
  }

  render(){
    const title = this.nameInput&&this.nameInput.value||'Undefined Title'
    const description = this.descriptionImput&&this.descriptionImput.value||''
    const image = this.imageInput&&this.imageInput.value||''
    const url = this.rssLinkInput&&this.rssLinkInput.value||''
    var feed = new RSS({
      title: title,
      link: '',
      description: description,
      site_url: 'https://archive.org/details/people-2557399_640',
      image_url: image,
      language: 'en',
      categories: ['English Listening'],
      generator: "https://rssenglish.herokuapp.com",
    });


    var feedContentPlaceHolder = "Title 1\nhttps://example.com/audio-1.mp3\n<description>Description 1</description>(Optional)\n<transcript>Transcript 1</transcript>(Optional)";
    feedContentPlaceHolder = feedContentPlaceHolder+"\n----------------\n"
    feedContentPlaceHolder = feedContentPlaceHolder+"Title 2\nhttps://example.com/audio-2.mp3\n<description>Description 2</description>(Optional)\n<transcript>Transcript 2</transcript>(Optional)";
    feedContentPlaceHolder = feedContentPlaceHolder+"\n----------------"
    const feeds = this.feedsInput&&this.feedsInput.value||feedContentPlaceHolder
    if(feeds){
      var feedSplits = feeds.split(/-{5,}/)
      feedSplits.forEach(item=>{
        console.log("checkitem", item)
        const parts = item.trim().split(/\n/)
        const title = parts[0]
        var media = undefined
        for(var i=1;i<parts.length;i++){
          if(parts[i].trim().startsWith("http")){
            media = parts[i].trim();
            break;
          }
        }
        var descriptions = item.match(/<description>(.*?)<\/description>/)
        var description = undefined
        if(descriptions && descriptions.length>0){
          description = descriptions[0].replace(/<\/?description>/g,'');
        }
        var transcripts = item.match(/<transcript>(.*?)<\/transcript>/)
        var transcript = undefined
        if(transcripts && transcripts.length>0){
          transcript = transcripts[0].replace(/<\/?transcript>/g,'');
        }
          feed.item({
            title: title,
            enclosure : {url: media},
            description: description,
            custom_elements: [
              {'transcript': transcript}
            ]
          });

      });
    }
    var xmlResult = beautify(feed.xml())
    return(
      <FrameStyled className="p-3">
      <div className='mb-3'>
      <span>Title</span>
      </div>
      <input type="text" onChange={(e) => {this.handleChange(e)}} ref={el => this.nameInput=el} placeholder="Rss title" className="form-control mb-3" />
      <div className='mb-3'>
      <span>Description</span>
      </div>
      <textarea type="text" onChange={(e) => {this.handleChange(e)}} ref={el => this.descriptionImput=el} placeholder="Description" className="form-control mb-3" />
      <div className='mb-3'>
      <span>Author</span>
      </div>
      <input type="text" onChange={(e) => {this.handleChange(e)}} ref={el => this.authorInput=el} placeholder="Author" className="form-control mb-3" />
      <div className='mb-3'>
      <span>Rss Link (Optional)</span>
      </div>
      <input type="text" onChange={(e) => {this.handleChange(e)}} ref={el => this.rssLinkInput=el} placeholder="https://example.com/podcast.rss" className="form-control mb-3" />
      <div className='mb-3'>
      <span>Image Url</span>
      </div>
      <input type="text" onChange={(e) => {this.handleChange(e)}} ref={el => this.imageInput=el} placeholder="https://example.com/image.jpg" className="form-control mb-3" />
      <div className='mb-3'>
      <span>Feed content</span>
      </div>
      <textarea type="text" rows="10" onChange={(e) => {this.handleChange(e)}} ref={el => this.feedsInput=el} defaultValue={feedContentPlaceHolder} placeholder={feedContentPlaceHolder} className="form-control mb-3" />
      <div className="d-flex align-items-center mb-2"><span>Rss Result</span>
      <Button className="ml-3" variant="light" onClick={this.onCopy.bind(this, xmlResult)}>Copy</Button>
      <Button className="ml-3" variant="light" onClick={this.downloadTxtFile.bind(this, title, xmlResult)}>Download</Button>
      <span className="ml-3 text-success">{this.state.message}</span>
      </div>
      <RssResult>
      <pre>
        {xmlResult}
        </pre>
      </RssResult>
      </FrameStyled>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RssGeneratorFrame)
