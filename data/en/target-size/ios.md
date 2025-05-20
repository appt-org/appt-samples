# Target size - iOS

On iOS, ensure that interactive elements have a target size of at least 24x24 points.

The [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/buttons#Best-practices) recommend a target size of at least 44x44 points.

This size helps ensure that users can easily interact with targets such as buttons.

```swift
import UIKit

class IconButton: UIButton {
    
    convenience init(systemImageName: String, accessibilityLabel: String) {
        self.init(type: .system)
        
        let image = UIImage(systemName: systemImageName)
        self.setImage(image, for: .normal)
        self.accessibilityLabel = accessibilityLabel

        // Apply 24 points spacing
        self.contentEdgeInsets = UIEdgeInsets(
            top: 12,
            left: 12,
            bottom: 12,
            right: 12
        )

        // Apply minimum 24 points width and 24 points height
        self.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            self.widthAnchor.constraint(greaterThanOrEqualToConstant: 24),
            self.heightAnchor.constraint(greaterThanOrEqualToConstant: 24)
        ])
    }
}
```
