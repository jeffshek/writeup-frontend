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
    if (this.props.reconnectIntervalInMilliSeconds > 0) {
      return this.props.reconnectIntervalInMilliSeconds;
    }
    // default base results in 1000 milliseconds(?), and increments per attempt
    const result = Math.min(30, Math.pow(2, k) - 1) * 1000;
    return result;
  }

  setupWebSocket = () => {
    let connection = this.ws;

    connection.onopen = () => {
      this.logMessage("WebSocket Connected");
      this.initialized = true;

      if (typeof this.props.onOpen === "function") this.props.onOpen();
    };

    connection.onmessage = evt => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect;
    connection.onclose = () => {
      this.logMessage("WebSocket Disconnected");

      if (typeof this.props.onClose === "function") this.props.onClose();

      if (this.shouldReconnect) {
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
  //onOpen: PropTypes.func,
  //onClose: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  //protocol: PropTypes.string,
  reconnectIntervalInMilliSeconds: PropTypes.number
};
