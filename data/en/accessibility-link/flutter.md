# Accessibility link - Flutter

In Flutter, links should have the semantic property [`link`](https://api.flutter.dev/flutter/semantics/SemanticsProperties/link.html).

To create text links, you can use the [`RichText`](https://api.flutter.dev/flutter/widgets/RichText-class.html) widget. You can pass multiple [`TextSpan`](https://api.flutter.dev/flutter/painting/TextSpan-class.html) widgets as it's children.

The [`url_launcher`](https://pub.dev/packages/url_launcher) package can be used to open links.

```dart
RichText(
    text: TextSpan(
      children: [
        TextSpan(text: "Learn more about "),
        WidgetSpan(
            child: Semantics(
              link: true,
              hint: "External link",
              child: GestureDetector(
                onTap: () => launchUrl(Uri.parse("https://appt.org")),
                child: Text(
                  "Appt",
                  style: TextStyle(
                    decoration: TextDecoration.underline,
                    color: Theme.of(context).colorScheme.primary,
                    decorationColor: Theme.of(context).colorScheme.primary,
                  ),
                ),
              )
            )
        ),
      ]
    )
);
```
