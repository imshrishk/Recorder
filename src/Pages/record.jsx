// src/pages/record.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import ScreenRecorder from '../components/Recorder/ScreenRecorder';
import VideoRecorder from '../components/Recorder/VideoRecorder';
import CombinedRecorder from '../components/Recorder/CombinedRecorder'; // No .jsx needed
import Button from '../components/UI/Button';
import styles from '../styles/Record.module.css';
import { FaDesktop, FaVideo, FaCamera } from 'react-icons/fa';

const Record = () => {
  const [mode, setMode] = useState('screen');

  const renderRecorder = () => {
    switch (mode) {
      case 'screen':
        return <ScreenRecorder />;
      case 'video':
        return <VideoRecorder />;
      case 'combined':
        return <CombinedRecorder />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className={styles.recordContainer}>
        <h2>Select Recording Mode</h2>
        <div className={styles.buttonGroup}>
          <Button
            label="Screen Recorder"
            onClick={() => setMode('screen')}
            color={mode === 'screen' ? 'red' : 'blue'}
          >
            <FaDesktop />
          </Button>
          <Button
            label="Video Recorder"
            onClick={() => setMode('video')}
            color={mode === 'video' ? 'red' : 'blue'}
          >
            <FaVideo />
          </Button>
          <Button
            label="Combined Recorder"
            onClick={() => setMode('combined')}
            color={mode === 'combined' ? 'red' : 'blue'}
          >
            <FaCamera />
          </Button>
        </div>
        <div className={styles.recorderSection}>{renderRecorder()}</div>
      </div>
    </Layout>
  );
};

export default Record;