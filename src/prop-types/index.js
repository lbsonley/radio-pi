/* eslint-disable import/prefer-default-export */

import PropTypes from "prop-types";

export const libraryPropTypes = PropTypes.shape({
  nodes: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.any),
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    extension: PropTypes.string,
  }),
});

export const socketPropTypes = PropTypes.shape({
  emit: PropTypes.func,
  on: PropTypes.func,
});

export const queuePropTypes = PropTypes.shape({
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  activeIndex: PropTypes.number,
});

export const emitUpdateQueuePropTypes = PropTypes.func;
