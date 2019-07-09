import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import FolderStructure from "./components/FolderStructure";
import "./App.css";

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <FolderStructure />
      </Provider>
    );
  }
}

export default App;
