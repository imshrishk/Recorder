// src/components/Layout/Layout.jsx
import React from 'react';
import Link from 'next/link';
import { FaHome, FaVideo, FaDesktop, FaFileVideo } from 'react-icons/fa';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Screen & Video Recorder</h1>
        <nav>
          <Link href="/" className={styles.navLink}>
            <FaHome /> Home
          </Link>
          <Link href="/record" className={styles.navLink}>
            <FaVideo /> Record
          </Link>
          <Link href="/convert" className={styles.navLink}>
            <FaFileVideo /> Convert
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Recorder App</p>
      </footer>
    </div>
  );
};

export default Layout;
