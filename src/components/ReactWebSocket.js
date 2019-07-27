import React from "react";
import PropTypes from "prop-types";

// Copy and pasted from
// https://github.com/mehmetkose/react-websocket/blob/master/index.jsx
// Will take this as a shell to understand how WebSocket works in React
// and then rewrite / clean up a bit.

export class ReactWebSocket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // not sure what protocol is supposed to mean
      ws: new WebSocket(this.props.url, this.props.protocol),
      attempts: 1
    };
  }

  logging(logline) {
    if (this.props.debug === true) {
      console.log(logline);
    }
  }

  generateInterval(k) {
    if (this.props.reconnectIntervalInMilliSeconds > 0) {
      return this.props.reconnectIntervalInMilliSeconds;
    }
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
  }

  setupWebsocket = () => {
    let websocket = this.state.ws;

    websocket.onopen = () => {
      this.logging("WebSocket Connected");
      if (typeof this.props.onOpen === "function") this.props.onOpen();
    };

    websocket.onmessage = evt => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect;
    websocket.onclose = () => {
      this.logging("WebSocket Disconnected");
      if (typeof this.props.onClose === "function") this.props.onClose();

      if (this.shouldReconnect) {
        let time = this.generateInterval(this.state.attempts);
        this.timeoutID = setTimeout(() => {
          this.setState({ attempts: this.state.attempts + 1 });
          this.setState({
            ws: new WebSocket(this.props.url, this.props.protocol)
          });
          this.setupWebsocket();
        }, time);
      }
    };
  };

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);
    let websocket = this.state.ws;
    websocket.close();
  }

  sendMessage = message => {
    let websocket = this.state.ws;
    websocket.send(message);
  };

  render() {
    return <div></div>;
  }
}

ReactWebSocket.defaultProps = {
  debug: true,
  reconnect: true
};

ReactWebSocket.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  protocol: PropTypes.string,
  reconnectIntervalInMilliSeconds: PropTypes.number
};
