// src/components/UI/VideoPlayer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ src, title }) => {
  const handleError = () => {
    console.error('Error loading video:', src);
    alert('Failed to load the video.');
  };

  return (
    <div className={styles.videoContainer}>
      <video
        src={src}
        controls
        className={styles.video}
        onError={handleError}
        loading="lazy"
        aria-label={title || 'Video Player'}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default VideoPlayer;