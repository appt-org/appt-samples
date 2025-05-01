# Scale text - Jetpack Compose

In Jetpack Compose, you can use [Scale-independent Pixels](https://developer.android.com/guide/topics/resources/more-resources.html#Dimension) to scale text. This unit ensures that the user's preferences are taken into account when determining the font size. We recommend to define the [`fontSize`](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/TextStyle#fontSize()) property inside the [`Typography`](https://developer.android.com/reference/kotlin/androidx/compose/material3/Typography) object in your code to ensure consistency throughout your app.

You can use the [`@PreviewFontScale`](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/PreviewFontScale) annotation to preview different font scales.

```kotlin
val typography = Typography(
    titleLarge = TextStyle(
        fontSize = 20.sp,
    ),
    bodyLarge = TextStyle(
        fontSize = 16.sp,
    ),
    headlineLarge = TextStyle(
        fontSize = 20.sp,
    ),
)

@FontScalePreviews
@Composable
fun fontScalePreviews() {
  Text(text = "This is font scale ${LocalDensity.current.fontScale}")
}
```
