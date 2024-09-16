// src/components/Recorder/VideoRecorder.jsx

import React from 'react';
import VideoPlayer from '../UI/VideoPlayer';
import Button from '../UI/Button';
import DownloadButton from '../UI/DownloadButton';
import useRecorder from '../../hooks/useRecorder';
import styles from './Recorder.module.css';

const VideoRecorder = () => {
  const { recording, videoURL, filename, startRecording, stopRecording, stopStreams } = useRecorder('video');

  // Clean up streams if needed when the user navigates away or the component unmounts
  React.useEffect(() => {
    return () => {
      stopStreams();
    };
  }, [stopStreams]);

  return (
    <div className={styles.recorderContainer}>
      <h2>Video Recorder</h2>
      {!recording ? (
        <Button onClick={startRecording} label="Start Recording" />
      ) : (
        <Button onClick={stopRecording} label="Stop Recording" color="red" recording={recording} />
      )}
      {videoURL && (
        <>
          <VideoPlayer src={videoURL} title="Video Recording" />
          <DownloadButton url={videoURL} filename={filename} />
        </>
      )}
    </div>
  );
};

export default VideoRecorder;