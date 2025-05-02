import { Platform } from "./generated";

export const platformIdToLabelMap: Record<Platform, string> = {
  android: "Android",
  "jetpack-compose": "Jetpack Compose",
  ios: "iOS",
  swiftui: "SwiftUI",
  flutter: "Flutter",
  "react-native": "React Native",
  "net-maui": ".NET MAUI",
  xamarin: "Xamarin",
};
