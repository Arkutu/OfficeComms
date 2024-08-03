# OfficeComms

OfficeComms is a comprehensive workplace communication solution designed to streamline team interactions and boost productivity. This React Native app offers a variety of features to enhance communication and collaboration within your organization.

## Key Features

### Realtime Messaging
Communicate seamlessly with colleagues through instant messaging, ensuring quick and efficient exchanges of information and ideas.

### Realtime Video Call and Voice Call
Conduct high-quality realtime video and voice calls for face-to-face meetings, remote work collaborations, and virtual conferences, enhancing team connectivity regardless of location.

### Project Creation
Simplify project management by creating and tracking projects within the app, assigning tasks, setting deadlines, and monitoring progress to ensure successful project completion.

### Sharing Files
Easily share documents, images, and other files within conversations or channels, enabling smooth and secure file exchanges to support your team's workflow.

### AI Chatbot
Enhance productivity with an intelligent AI chatbot that can assist with various tasks, provide information, and answer queries promptly within the app.

### Group Channels
Create and manage group channels for team discussions, project collaborations, or departmental communications, fostering a more organized and collaborative environment.

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- JDK 17
- Gradle 8.5
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Arkutu/OfficeComms.git
    cd OfficeComms
    ```

2. Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Configure the necessary environment variables in a `.env` file at the root of your project:
    ```env
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    FIREBASE_APP_ID=your_firebase_app_id
    ZEGO_APP_ID=your_zego_app_id
    ZEGO_APP_SIGN=your_zego_app_sign
    ```

4. Start the Metro bundler:
    ```bash
    npm start
    # or
    yarn start
    ```

5. Run the app on your device or emulator:
    ```bash
    npm run android
    # or
    npm run ios
    ```

## Dependencies

This project uses several key dependencies to provide its features:

- React Native Firebase for authentication, database, and storage
- Zego Cloud for video and voice calls
- React Navigation for app navigation
- Various React Native libraries for additional functionalities (e.g., image picking, document picking, permissions handling)

```json
"dependencies": {
    "@react-native-async-storage/async-storage": "^1.24.0",
    "@react-native-community/netinfo": "^11.3.2",
    "@react-native-firebase/app": "^20.3.0",
    "@react-native-firebase/auth": "^20.3.0",
    "@react-native-firebase/firestore": "^20.3.0",
    "@react-native-firebase/storage": "^20.3.0",
    "@react-native-picker/picker": "^2.7.7",
    "@react-navigation/stack": "^6.4.1",
    "@zegocloud/zego-uikit-prebuilt-call-rn": "^5.8.0",
    "@zegocloud/zego-uikit-rn": "^2.13.0",
    "axios": "^1.7.2",
    "firebase": "^10.12.4",
    "moment": "^2.30.1",
    "react": "18.2.0",
    "react-delegate-component": "^1.0.0",
    "react-native": "0.74.3",
    "react-native-agora": "^4.3.2",
    "react-native-audio-recorder-player": "^3.6.10",
    "react-native-blob-util": "^0.19.11",
    "react-native-calendar-events": "^2.2.0",
    "react-native-calendars": "^1.1305.0",
    "react-native-camera": "^4.2.1",
    "react-native-config": "^1.5.3",
    "react-native-document-picker": "^9.3.0",
    "react-native-encrypted-storage": "^4.0.3",
    "react-native-fs": "^2.20.0",
    "react-native-gesture-handler": "^2.17.1",
    "react-native-image-picker": "^7.1.2",
    "react-native-keep-awake": "^4.0.0",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "react-native-permissions": "^4.1.5",
    "react-native-qrcode-scanner": "^1.5.5",
    "react-native-safe-area-context": "^4.10.8",
    "react-native-screens": "^3.32.0",
    "react-native-sound": "^0.11.2",
    "react-native-svg": "^15.4.0",
    "react-native-svg-transformer": "^1.5.0",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-vector-icons": "^10.1.0",
    "react-native-video": "^6.4.3",
    "react-native-webview": "^13.10.5",
    "uuid-random": "^1.3.2",
    "zego-express-engine-reactnative": "^3.14.5"
}
```

### Contributors

- Gideon Awortwe Walker
- Sarkodie1

## License

This project is licensed under the MIT License.
```
