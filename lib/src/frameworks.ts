import type { Framework } from "./generated";

export const frameworkIdToLabelMap: Record<Framework, string> = {
  android: "Android",
  "jetpack-compose": "Jetpack Compose",
  ios: "iOS",
  swiftui: "SwiftUI",
  flutter: "Flutter",
  "react-native": "React Native",
  "net-maui": ".NET MAUI",
  xamarin: "Xamarin",
};
