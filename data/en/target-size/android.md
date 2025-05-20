# Target size - Android

On Android, ensure that interactive elements have a target size of at least 24x24 dp.

The [Material Design Guidelines](https://support.google.com/accessibility/android/answer/7101858?hl=en) recommend a target size of at least 48x48 dp.

This size helps ensure that users can easily interact with targets such as buttons.

```xml
<!-- Ensure target has sufficient width and height or sufficient spacing -->
<ImageButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:minWidth="24dp"
    android:minHeight="24dp"
    android:layout_marginBottom="24dp"
    android:src="@drawable/ic_code"
    android:contentDescription="Appt" />
```
