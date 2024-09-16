// src/components/UI/DownloadButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './DownloadButton.module.css';
import { FaDownload } from 'react-icons/fa';

const DownloadButton = ({ url, filename }) => {
  // Add a check to ensure the URL is valid
  if (!url) {
    return <p>Download URL is not available.</p>;
  }

  return (
    <a href={url} download={filename} className={styles.downloadButton}>
      <FaDownload className={styles.icon} /> Download Recording
    </a>
  );
};

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
};

export default DownloadButton;
