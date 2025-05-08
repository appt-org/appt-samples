import type { Framework } from "./generated";

export const frameworkIdToLabelMap: Record<Framework, string> = {
  android: "Android",
  flutter: "Flutter",
  ios: "iOS",
  "jetpack-compose": "Jetpack Compose",
  "net-maui": ".NET MAUI",
  "react-native": "React Native",
  swiftui: "SwiftUI",
  xamarin: "Xamarin",
};
