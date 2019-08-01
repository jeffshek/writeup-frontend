import React from "react";

export const AppContext = React.createContext();
export const AppConsumer = AppContext.Consumer;

export class AppProvider extends React.Component {
  state = {
    temperature: 1,
    top_k: 10,
    length: 20,
    batch_size: 5,
    handleContextChange: contextChange => value => {
      this.setState({ [contextChange]: value });
    }
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
