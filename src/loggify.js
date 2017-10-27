import React, { Component } from 'react';
import styled from 'styled-components';

/*
this.setState({key:values});
this.setState({key});
this.setState(
  (prevState, props) => {
    //perform any operations here
    return {
      //new object that reps changes to state
    }
  }
  , () => {
    //my callback function
  }
)
*/

export default function loggify(Wrapped) {

  let originals = {};
  const methodsToLog = [
    "componentWillMount"
    , "componentDidMount"
    , "componentWillUnMount"
    , "componentWillReceiveProps"
    , "shouldComponentUpdate"
    , "componentWillUpdate"
  ];

  methodsToLog.forEach( method => {
    if (Wrapped.prototype[method]) {
      originals[method] = Wrapped.prototype[method];
    }

    Wrapped.prototype[method] = function(...args) {
      let original = originals[method];
      console.groupCollapsed(`${Wrapped.displayName} called ${method}`);

      if (method === 'componentWillReceiveProps') {
        console.log("nextProps", args[0]);
      }
      else if (method === 'componentWillReceiveProps'
                      ||  'componentWillUpdate') {
        console.log("nextProps", args[0]);
        console.log("nextProps", args[1]);
      }

      console.groupEnd();

      if (original) {
        original = original.bind(this);
        return original(...args);
      }

      if (method === 'shouldComponentUpdate' && typeof original === 'undefined'){
        return true;
      }
    }

    Wrapped.prototype.setState = function (partialState, callback) {
      console.groupCollapsed(`${Wrapped.displayName} setState`);
      console.log("partialState", partialState);
      console.log("callback", callback);
      console.groupEnd();

      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    }

  });

  return class extends Component {
    render() {
      return (
        <LoggerContainer>
          <H2>
            {Wrapped.displayName} is now loggified:
          </H2>
          <Wrapped {...this.props} />
        </LoggerContainer>
      );
    }
  }
}

const LoggerContainer = styled.div`
  background-color: aliceBlue;
  border: 2px grooved aquemarine;
  border-radius: 5px;
`

LoggerContainer.displayName = 'LoggerContainer';

const H2 = styled.h2`
  color: blueviolet;
`
H2.displayName = 'H2'
