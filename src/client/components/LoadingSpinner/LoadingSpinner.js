import React from 'react'
import PropTypes from 'prop-types'

export const LoadingSpinner = ({ size }) => (
      <a>Loading {size} </a>
)

LoadingSpinner.propTypes = {
  size: PropTypes.number
}

export default LoadingSpinner
