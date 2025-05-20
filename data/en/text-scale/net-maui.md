# Scale text - .NET MAUI

In MAUI, all controls that display text automatically apply font scaling. The scale is based on the font size preference set in the Android or iOS operating system.

By default, .NET MAUI apps use the `Open Sans` font on each platform. However, this default can be changed by registering additional fonts in your app.

You can find additional guidance in the [.NET MAUI fonts article](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/fonts?view=net-maui-8.0).

```csharp
<Label Text="Appt"
       FontSize="18"
       FontAutoScalingEnabled="True"
       FontFamily="Custom" />
```

If there is not enough room to display scaled text, consider implementing a [Large Content Viewer](https://developer.apple.com/videos/play/wwdc2019/261/).
