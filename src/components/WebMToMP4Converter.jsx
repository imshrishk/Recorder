// src/components/WebMToMP4Converter.jsx

import React, { useState } from 'react';
import axios from 'axios';
import styles from './WebMToMP4Converter.module.css'; // Import the CSS module

const WebMToMP4Converter = () => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setVideoUrl(response.data.url);
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className={styles.label}>WebM to MP4 Converter</h1>
        <input
          className={styles.input}
          type="file"
          accept="video/webm"
          onChange={handleFileChange}
        />
        {loading && <p>Converting...Go grab a coffee🍵😊</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {videoUrl && (
          <div>
            <video controls className={styles.video} src={videoUrl} />
            <a href={videoUrl} download="converted.mp4" className={styles.downloadLink}>
              <button className={styles.uploadButton}>Download MP4</button>
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default WebMToMP4Converter;
