import React from 'react';
import { withRouter } from 'react-router-dom';

 const LoadingComponent = (props) => {
  if (props.isLoading) {
    if (props.timedOut) {
      return <div>Loader timed out!</div>;
    } else if (props.pastDelay) {
      return <div></div>;
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
export default (LoadingComponent);
