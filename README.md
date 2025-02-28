# Simulator Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="screenshots/simulator_screenshot_E5EEA857-5288-4C5F-AA00-0B49069B3D7B.png" width="24%">
  <img src="screenshots/simulator_screenshot_67723CDA-AB2B-4D8D-A8EF-7E09BBCA8B56.png" width="24%">
  <img src="screenshots/simulator_screenshot_13418956-4649-41DF-B3C1-8B693EC379B8.png" width="24%">
  <img src="screenshots/simulator_screenshot_7D50BCEB-8ADD-4498-B73A-414CB273F7E4.png" width="24%">

  <img src="screenshots/simulator_screenshot_8B4434DF-4903-419B-8B70-C51823930A7D.png" width="24%">
  <img src="screenshots/simulator_screenshot_64DD47A2-935D-4873-9EC8-D64B6153B3F3.png" width="24%">
  <img src="screenshots/simulator_screenshot_F44574ED-E808-4789-A9A6-F0B03E01E807.png" width="24%">
  <img src="screenshots/simulator_screenshot_B3C2E5B4-EFF2-4663-986C-B3055C23FC27.png" width="24%">

  <img src="screenshots/simulator_screenshot_C06D950A-61E5-415B-8A61-03E1A262CFA4.png" width="24%">
  <img src="screenshots/simulator_screenshot_543E4668-6447-4AF1-B20B-A8C866C9B718.png" width="24%">
  <img src="screenshots/simulator_screenshot_25AFC6D9-23E0-4B3F-B14F-750230919B0D.png" width="24%">
  <img src="screenshots/simulator_screenshot_BA36BA6C-FD89-43B0-B66E-20F81C94BDFD.png" width="24%">

  <img src="screenshots/simulator_screenshot_4ECEB572-C4B3-4C21-B3B4-942198890AB1.png" width="24%">
  <img src="screenshots/simulator_screenshot_BD38F717-349B-4706-9C22-6AD8D42ABE5F.png" width="24%">
  <img src="screenshots/simulator_screenshot_59CCBCFD-4D56-4D89-BAFF-56AF27723D52.png" width="24%">
  <img src="screenshots/simulator_screenshot_389A4188-E74B-42C5-B91C-078CAA07EBBE.png" width="24%">

  <img src="screenshots/simulator_screenshot_6E6BD711-6D54-49CE-ACD2-0EDE75B92C93.png" width="24%">
</div>

## Setup Guide

### Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- React Native CLI or Expo CLI
- Android Studio / Xcode (for building on Android/iOS)
- Unity 6 (latest LTS version recommended)
- AWS account and CLI configured

## Getting Started

### 1. Clone the Repository
Clone the repository and navigate into the project folder:
  ```bash
  git clone https://github.com/carlandren2002/react-unity-project.git
  cd react-unity-project
  ```
### 2. Install Dependencies

Install all required dependencies:

  ```bash
  npm install
  ```
### 3. iOS Setup
  ```bash
  cd ios
  pod install
  cd ..
  npm run ios
  ```
### 4. Android Setup
  ```bash
  npm run android
  ```
### 5. AWS Amplify Configuration
  ```bash 
  amplify init
  ```

### 6. Adding Unity as a Library

To integrate Unity into your React Native project, follow the steps outlined in the [react-native-unity guide](https://github.com/azesmway/react-native-unity)


### Additional Resources
- [React Native Documentation](https://reactnative.dev/docs/environment-setup)
- [Unity Documentation](https://docs.unity3d.com/Manual/index.html)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
