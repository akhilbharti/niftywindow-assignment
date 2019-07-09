import _ from "lodash";
import {
  CREATE_DIRECTORY,
  PUSH_TO_PWD,
  POP_FROM_PWD,
  REMOVE_DIRECTORY
} from "./actionTypes";

const DirectoryStructure = {
  children: {},
  childInfo: {
    TimeOfCreation: "",
    toggleChild: false,
    path: ""
  }
};

const createNewDirectory = (dirName, pwd) => {
  let directory = _.cloneDeep(DirectoryStructure);
  directory.childInfo.TimeOfCreation = Date.now();
  directory.childInfo.path = pwd.slice();
  directory.childInfo.path.push(dirName);
  return {
    type: CREATE_DIRECTORY,
    payload: { [dirName]: directory }
  };
};

const AddtoCurrentDirectory = (dirName, pwd) => {
  let currentDirectory = pwd.slice(pwd.length - 1)[0];
  if (currentDirectory === dirName) {
    return {
      type: null
    };
  }

  return {
    type: PUSH_TO_PWD,
    payload: dirName
  };
};

const RemoveFromCurrentDirectory = () => {
  return { type: POP_FROM_PWD };
};

const removeDirectory = () => {
  return { type: REMOVE_DIRECTORY };
};

export {
  createNewDirectory,
  AddtoCurrentDirectory,
  RemoveFromCurrentDirectory,
  removeDirectory
};
