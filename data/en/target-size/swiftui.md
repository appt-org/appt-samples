# Target size - SwiftUI

In SwiftUI, ensure that interactive elements have a target size of at least 24x24 points.

The [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/buttons#Best-practices) recommend a target size of at least 44x44 points.

This size helps ensure that users can easily interact with targets such as buttons.

```swift
Button(action: {
  // Action
}) {
  Image(systemName: "code")
}
.accessibilityLabel("Appt")
.frame(minWidth: 24, minHeight: 24) // Minimum 24 points width/height
.padding(.bottom, 24) // Set 24 points spacing
```
