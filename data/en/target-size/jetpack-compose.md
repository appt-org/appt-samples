# Target size - Jetpack Compose

In Jetpack Compose, ensure that interactive elements have a target size of at least 24x24 dp.

The [Material Design Guidelines](https://support.google.com/accessibility/android/answer/7101858?hl=en) recommend a target size of at least 48x48 dp.

This size helps ensure that users can easily interact with targets such as buttons.

```kotlin
IconButton(
  onClick = {
    // Action
  },
  modifier = Modifier
    .widthIn(min = 24.dp)    // Minimum 24 dp width
    .heightIn(min = 24.dp)   // Minimum 24 dp height
    .padding(bottom = 24.dp) // Set 24 dp spacing
) {
  // Icon inside will be properly sized
  Icon(
    imageVector = Icons.Default.Code,
    contentDescription = "Appt"
  )
}
```
