// src/pages/convert.jsx
import React, { useState } from 'react';
import Layout from '../src/components/Layout/Layout';
import WebMToMP4Converter from '../src/components/WebMToMP4Converter';
import Button from '../src/components/UI/Button';
import styles from '../src/styles/Convert.module.css';
import { FaFileVideo, FaArrowCircleLeft } from 'react-icons/fa';

const ConvertPage = () => {
  const [showConverter, setShowConverter] = useState(false);

  return (
    <Layout>
      <div className={styles.convertContainer}>
        <h2></h2>
        {!showConverter ? (
          <div className={styles.buttonGroup}>
            <Button
              label="Start Conversion"
              onClick={() => setShowConverter(true)}
              color="blue"
            >
              <FaFileVideo />
            </Button>
          </div>
        ) : (
          <div className={styles.converterSection}>
            <WebMToMP4Converter />
            <Button
              label="Back"
              onClick={() => setShowConverter(false)}
              color="red"
              className={styles.backButton}
            >
              <FaArrowCircleLeft />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConvertPage;
