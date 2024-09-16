// src/pages/index.jsx
import React from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout/Layout';
import Button from '../src/components/UI/Button';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h2>Welcome to the Screen & Video Recorder App</h2>
        <p>
          Easily record your screen activities, webcam video, or both simultaneously. Share your recordings effortlessly!
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/record">
            <Button label="Record Stuff" />
          </Link>
          <Link href="/convert">
            <Button label="Convert Stuff" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
