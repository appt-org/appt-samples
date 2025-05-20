# Target size - Xamarin

In Xamarin, ensure that interactive elements have a target size of at least 24x24 points.

- On Android, the [Material Design Guidelines](https://support.google.com/accessibility/android/answer/7101858?hl=en) recommend a target size of at least 48x48 dp.
- On iOS, the [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/buttons#Best-practices) recommend a target size of at least 44x44 points.

This size helps ensure that users can easily interact with targets such as buttons.

```csharp
public partial class IconButton : ContentView
{
  public IconButton()
  {
    MinimumWidthRequest = 24;  // Minimum 24 points width
    MinimumHeightRequest = 24; // Minimum 24 points height
    Margin = new Thickness(0, 0, 0, 24); // Set 24 points spacing
  }
}
```
