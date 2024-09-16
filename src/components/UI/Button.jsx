// src/components/UI/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import { FaCircle } from 'react-icons/fa';

const Button = ({ onClick, label, color, recording }) => {
  return (
    <button
      className={`${styles.button} ${color === 'red' ? styles.red : styles.blue}`}
      onClick={onClick}
      disabled={recording && label === 'Start Combined Recording'}
      aria-live="polite"
    >
      {recording && label.startsWith('Stop') && <FaCircle className={styles.indicator} />}
      {label}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  recording: PropTypes.bool,
};

Button.defaultProps = {
  color: 'blue',
  recording: false,
};

export default Button;