// src/components/Recorder/ScreenRecorder.jsx

import React from 'react';
import VideoPlayer from '../UI/VideoPlayer';
import Button from '../UI/Button';
import DownloadButton from '../UI/DownloadButton';
import useRecorder from '../../hooks/useRecorder';
import styles from './Recorder.module.css';

const ScreenRecorder = () => {
  const { recording, videoURL, filename, startRecording, stopRecording, stopStreams } = useRecorder('screen');

  // Clean up streams if needed when the user navigates away or the component unmounts
  React.useEffect(() => {
    return () => {
      stopStreams();
    };
  }, [stopStreams]);

  return (
    <div className={styles.recorderContainer}>
      <h2>Screen Recorder</h2>
      {!recording ? (
        <Button onClick={startRecording} label="Start Recording" />
      ) : (
        <Button onClick={stopRecording} label="Stop Recording" color="red" recording={recording} />
      )}
      {videoURL && (
        <>
          <VideoPlayer src={videoURL} title="Screen Recording" />
          <DownloadButton url={videoURL} filename={filename} />
        </>
      )}
    </div>
  );
};

export default ScreenRecorder;