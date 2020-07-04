import React from 'react';
import styled from 'styled-components';

const LoadmoreStyled = styled.div`
  height: 35px;
  width: 100%;
  color: white;
  background: #007bff;
`
const LoadingView = (props) => {
  if(props.loading){
      return <div className={props.className}><LoadmoreStyled className="pointer d-flex align-items-center justify-content-center"><span>Please wait...</span></LoadmoreStyled></div>
    }else{
    const text = props.text||"Load more items"
    return <div onClick={props.onClick} className={props.className}><LoadmoreStyled className="pointer d-flex align-items-center justify-content-center"><span>{text}</span></LoadmoreStyled></div>
  }


}
export default (LoadingView);
