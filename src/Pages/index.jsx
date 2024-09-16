// src/pages/index.jsx
import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h2>Welcome to the Screen & Video Recorder App</h2>
        <p>
          Easily record your screen activities, webcam video, or both simultaneously. Share your recordings effortlessly!
        </p>
        <Link href="/record">
          <Button label="Get Started" />
        </Link>
      </div>
    </Layout>
  );
};

export default Home;