import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ControlButton = styled.button`
  background-color: #121212;
  color: #f9f9f9;
  padding: 26px 8px;
  border-top: none;
  border: 2px grey outset;
  flex: ${(props) => props.size} 0 12.5%;
`;

const Control = ({ title, payload, routeControl, size = 1, icon }) => {
  const handleClick = () => {
    routeControl("control", payload);
  };

  return (
    <ControlButton onClick={handleClick} size={size} aria-label={title}>
      {icon}
    </ControlButton>
  );
};

Control.defaultProps = {
  size: 1,
};

Control.propTypes = {
  title: PropTypes.string.isRequired,
  payload: PropTypes.shape({
    action: PropTypes.string.isRequired,
    path: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  routeControl: PropTypes.func.isRequired,
  size: PropTypes.number,
  icon: PropTypes.element.isRequired,
};

export default Control;
