import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _ from "lodash";

const Node = ({ name, children, onClick, className }) => {
  return (
    <div>
      <div onClick={event => onClick(name, event)} className={className}>
        <i class="fa fa-folder" aria-hidden="true" />
        <span>{name}</span>
        {!_.isEmpty(children) ? renderChildren(children, onClick) : null}
      </div>
    </div>
  );
};

const renderChildren = (children, onClick) => {
  let childNodes = Object.keys(children).map(dirName => {
    return (
      <StyledNode
        key={children[dirName].childInfo.TimeOfCreation}
        name={dirName}
        meta={children[dirName].childInfo}
        onClick={onClick}
      />
    );
  });

  return childNodes;
};

const StyledNode = styled(Node)`
  margin-left: 16px;
  cursor:pointer span {
    margin-left: 8px;
  }
`;

Node.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.object
};

export default Node;
