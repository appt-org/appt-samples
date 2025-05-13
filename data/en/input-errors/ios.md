# Input errors - iOS

On iOS, we recommend using an [`UILabel`](https://developer.apple.com/documentation/uikit/uilabel) to indicate an error. The error message should also be posted to assistive technologies by using an [`accessibility announcement`](https://appt.org/en/docs/ios/samples/accessibility-announcement).

You could also use a third party library to display instructions. Unfortunately, accessibility is often not considered in the implementations.

```swift
errorLabel.isHidden = false
errorLabel.text = "Invalid date, must be in the form DD/MM/YYYY, for example, 01/01/2000"
```
