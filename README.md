# Appt Code Samples

The Appt® platform is an initiative of the Appt Foundation, a non-profit organization. Our mission is to make apps
accessible for everyone. We try to achieve this by sharing free knowledge and open-source code. Appt.org is a website
that empowers developers and organizations to build accessible apps for everyone.

This repository contains all code samples and provides components to embed them on your website.

This package contains two things:

1. Code samples (in Markdown format)
2. Loaders - A way to let the library know how to import these files in your environment.
3. A retrieval function to query the code samples, based on locale, sample-id and/or platform.

## Lib usage

Details on the library usage can be found in the [lib/readme document](/lib/README.md).

## Code samples

Our code samples are located in the `/data/` folder.

The data folder contains subfolders for each locale, e.g. `en` for English.

The locale folder contains subfolders for each technique, e.g. `accessibility-label`.

The technique folder should include a `README.md` briefly explaining it's purpose.

It should also include at least one of the following files:

- `android.md`: Android code sample
- `flutter.md`: Flutter code sample
- `ios.md`: iOS code sample
- `jetpack-compose.md`: Jetpack Compose code sample
- `net-maui.md`: .NET MAUI code sample
- `react-native.md`: React Native code sample
- `swiftui.md`: SwiftUI code sample
- `xamarin.md`: Xamarin code sample

## Local setup

### Prerequisites

<!-- 
   Which software or libraries are needed to be able to install this project?
 -->

- [Volta](https://volta.sh/) for Node version management
- Access to the [appt-samples GitHub repository](https://github.com/appt-org/appt-samples)

### Steps

```shell
# Clone the repository
git clone https://github.com/appt-org/appt-samples.git

# Go to the correct directory
cd appt-samples

# Install the dependencies in all directories (/, /scripts & /lib)
npm run install-all
```

### Generating the samples map

The library uses a generated file which contains the samples that are available, as well as the locales and platforms.
This samples map should be re-generated after adding or removing a code sample in the `/data` directory (not needed if a
file is edited). A new generation can be triggered like this:

```shell
# Run this in the /scripts directory
npm run generate-samples-map
```

## Publishing a new version

New versions are automatically published to the NPM registry through GitHub actions. This happens when a new release is
created in GitHub ([link](https://github.com/appt-org/appt-samples/releases/new)).

When creating a new release, make sure the 'version' field in the `lib/package.json` has the correct new version
specified. If the version in the `package.json` does not match the release tag (can still contain `v` prefix), the
pipeline fails.

## License

See the [LICENSE file](./LICENSE) for licensing information.
