import React from "react";
import PropTypes from "prop-types";

const Controls = ({ children }) => {
  return <>{children}</>;
};

Controls.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Controls;
