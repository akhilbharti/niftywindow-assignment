import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import Node from "./Node";
import Modal from "./Modal";
import {
  createNewDirectory,
  AddtoCurrentDirectory,
  RemoveFromCurrentDirectory
} from "../actions/DirectoryAction";
import {
  getCurrentDirectoryTree,
  isAtRoot,
  pwdDisplayText,
  getDirNamesAtCurrentPath
} from "../store/selectors";
import "./FolderStructure.css";

const ErrorMessageHandlerModal = styled.div`
  color: red;
  font-size: 1rem;
`;

class FolderStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleModal: false,
      directoryName: ""
    };
  }

  setPresentWorkingDirectory = (dirName, e) => {
    e.preventDefault();
    const { AddtoCurrentDirectory, pwd } = this.props;
    AddtoCurrentDirectory(dirName, pwd);
  };

  goBack = () => {
    this.props.RemoveFromCurrentDirectory();
  };

  createNewDirectory = () => {
    const { directoryName } = this.state;
    const { pwd } = this.props;
    this.props.createNewDirectory(directoryName, pwd);
    this.closeModal();
  };

  showModal = () => {
    this.setState({ toggleModal: true });
  };

  closeModal = () => {
    this.setState({ toggleModal: false, directoryName: "" });
  };

  onDirectoryNameChange = event => {
    this.setState({ directoryName: event.target.value });
  };

  removeDirectory = event => {
    this.props.removeDirectory();
  };

  renderBackBtn() {
    return (
      <span className="Actionbutton" onClick={this.goBack}>
        <i class="fa fa-long-arrow-left" aria-hidden="true" />
      </span>
    );
  }

  renderCurrentDirectoryTree(directory) {
    let nodes = Object.keys(directory).map(dirName => {
      return (
        <Node
          key={directory[dirName].childInfo.TimeOfCreation}
          name={dirName}
          children={directory[dirName].children}
          meta={directory[dirName].childInfo}
          onClick={this.setPresentWorkingDirectory}
        />
      );
    });

    return nodes;
  }

  renderErrorMessage() {
    const { dirNamesAtCurrentPath } = this.props;
    const { directoryName } = this.state;
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    let isNameAlreadyPresent = false;

    dirNamesAtCurrentPath.forEach(name => {
      if (!isNameAlreadyPresent && name) {
        isNameAlreadyPresent =
          name.toLowerCase() === directoryName.toLowerCase();
      }
    });

    if (isNameAlreadyPresent) {
      return (
        <ErrorMessageHandlerModal>
          uh-oh ! You already have a folder named. "{directoryName}"
        </ErrorMessageHandlerModal>
      );
    }

    if (directoryName.match(regex)) {
      return (
        <ErrorMessageHandlerModal>
          uh-oh ! Special characters are not allowed. "{directoryName}"
        </ErrorMessageHandlerModal>
      );
    }

    return null;
  }

  render() {
    const { directory, pwdDisplayText, isAtRoot } = this.props;
    const { toggleModal, directoryName } = this.state;

    return (
      <div className="container">
        <div className="header">Directory Structure Implementation</div>
        <div className="columns">
          <div className="column is-three-fifths">
            Currently In: {pwdDisplayText}
          </div>
          <div className="buttons column">
            <span className="Actionbutton" onClick={this.showModal}>
              <i
                class="fa fa-plus-square-o"
                tooltip="New Folder"
                aria-hidden="true"
              />
            </span>
            {/* <span className="Actionbutton" onClick={this.removeDirectory}>
              <i class="fa fa-minus-square-o" aria-hidden="true" />
            </span> */}
            {!isAtRoot ? this.renderBackBtn() : null}
          </div>
        </div>

        {this.renderCurrentDirectoryTree(directory)}
        <Modal
          closeModal={this.closeModal}
          toggleModal={toggleModal}
          title="Enter directory name"
          successAction={this.createNewDirectory}
          successActionText="Create"
          successActionDisabled={this.renderErrorMessage() != null}
        >
          <input
            className="input"
            type="text"
            value={directoryName}
            onChange={this.onDirectoryNameChange}
          />
          {this.renderErrorMessage()}
        </Modal>
      </div>
    );
  }
}

FolderStructure.propTypes = {
  createNewDirectory: PropTypes.func.isRequired,
  AddtoCurrentDirectory: PropTypes.func.isRequired,
  RemoveFromCurrentDirectory: PropTypes.func.isRequired,
  pwd: PropTypes.array.isRequired,
  directory: PropTypes.object.isRequired,
  isAtRoot: PropTypes.bool.isRequired,
  pwdDisplayText: PropTypes.string.isRequired,
  dirNamesAtCurrentPath: PropTypes.array.isRequired
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createNewDirectory,
      AddtoCurrentDirectory,
      RemoveFromCurrentDirectory
    },
    dispatch
  );

const mapStateToProps = state => {
  const { DirectoryReducer } = state;
  console.log(DirectoryReducer);
  const { pwd } = state.DirectoryReducer;
  return {
    directory: getCurrentDirectoryTree(DirectoryReducer),
    pwd,
    isAtRoot: isAtRoot(DirectoryReducer),
    pwdDisplayText: pwdDisplayText(DirectoryReducer),
    dirNamesAtCurrentPath: getDirNamesAtCurrentPath(DirectoryReducer)
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FolderStructure);
