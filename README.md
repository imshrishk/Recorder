# Screen & Video Recorder App

A production-ready screen and video recorder application built with Next.js. Capture your screen, webcam video, or both simultaneously, and upload your recordings seamlessly. This app is designed to be user-friendly and responsive, making it accessible across various devices.

## Features

- **Screen Recording**: Capture your screen activities with audio.
- **Video Recording**: Record your webcam with audio.
- **Combined Recording**: Record both screen and webcam simultaneously.
- **Video Uploads**: Seamlessly upload your recordings to Firebase Storage.
- **Download Options**: Download recordings in MP4 and WebM formats.
- **Responsive Design**: Optimized for a seamless experience on all devices.
- **Error Handling**: Robust error handling with clear messages for a better user experience.

## Technologies Used

- **Next.js**: Framework for server-rendered React applications.
- **React**: JavaScript library for building user interfaces.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).
- **Firebase**: Backend service for storage and real-time database functionalities.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **React Icons**: Popular icons in React projects.
- **FFmpeg**: Tool for video conversion and processing.

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git** (optional)
- **Firebase Account**: For configuring Firebase Storage and Firestore.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/imshrishk/Recorder.git
   cd Recorder
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure Firebase**
   * Create a Firebase project and configure Firebase Storage and Firestore.
   * Add your Firebase configuration details to a `.env.local` file.

   Example `.env.local`:
   ```
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. **Access the Application**
   Open `http://localhost:3000` in your browser to start using the application.

## Usage

* **Start Recording**: Use the built-in controls to start capturing your screen, webcam, or both.
* **Stop Recording**: Save your recording and choose to upload or download it.
* **Download Recordings**: Click the download button to save recordings in your preferred format.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.