# Target size - React Native

In React Native, ensure that interactive elements have a target size of at least 24x24 points.

- On Android, the [Material Design Guidelines](https://support.google.com/accessibility/android/answer/7101858?hl=en) recommend a target size of at least 48x48 dp.
- On iOS, the [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/buttons#Best-practices) recommend a target size of at least 44x44 points.

This size helps ensure that users can easily interact with targets such as buttons.

```jsx
const IconButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <MaterialIcons name="code" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 24,     // Minimum 24 points width 
    minHeight: 24,    // Minimum 24 points width
    marginBottom: 24, // Set 24 points spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
```
