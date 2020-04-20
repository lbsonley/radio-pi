/* eslint-disable import/prefer-default-export */

import PropTypes from "prop-types";

export const libraryPropTypes = {
  library: PropTypes.shape({
    nodes: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.any),
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      extension: PropTypes.string,
    }),
  }),
};
