import React from "react";
import PropTypes from "prop-types";

// Copy and pasted from
// https://github.com/mehmetkose/react-websocket/blob/master/index.jsx
// Will take this as a shell to understand how WebSocket works in React
// and then rewrite / clean up a bit.

export class ReactWebSocket extends React.Component {
  constructor(props) {
    super(props);

    this.ws = new WebSocket(this.props.url);
    this.attempts = 1;
    this.initialized = false;
  }

  logMessage = logline => {
    if (this.props.debug === true) {
      console.log(logline);
    }
  };

  generateInterval(k) {
    // i copied this from online, this thing is unreadable
    // default base results in 5000 milliseconds(?), and increments per attempt
    const result = Math.min(30, Math.pow(2, k) - 1) * 5000;
    return result;
  }

  setupWebSocket = () => {
    let connection = this.ws;

    this.generateInterval(this.attempts);

    connection.onopen = () => {
      this.logMessage("WebSocket Connected");
      this.initialized = true;
      this.props.onOpen();
    };

    connection.onmessage = evt => {
      this.props.onMessage(evt.data);
    };

    connection.onclose = () => {
      this.logMessage("WebSocket Disconnected");

      if (this.props.shouldReconnect) {
        console.log("WebSocket Disconnected, Trying To Reconnect");
        let time = this.generateInterval(this.attempts);
        this.timeoutID = setTimeout(() => {
          this.attempts += 1;
          this.ws = new WebSocket(this.props.url);

          this.setupWebSocket();
        }, time);
      }
    };
  };

  dissembleWebSocket() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);

    let connection = this.ws;
    connection.close();
  }

  sendMessage = message => {
    let connection = this.ws;
    connection.send(message);
  };
}

ReactWebSocket.defaultProps = {
  debug: true,
  reconnect: true
};

ReactWebSocket.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  //onClose: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  reconnectIntervalInMilliSeconds: PropTypes.number
};
