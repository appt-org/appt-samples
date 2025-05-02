# Appt Code Samples

The Appt® platform is an initiative of the Appt Foundation, a non-profit organization. Our mission is to make apps
accessible for everyone. We try to achieve this by sharing free knowledge and open-source code. Appt.org is a website
that empowers developers and organizations to build accessible apps for everyone.

This repository contains all code samples and provides components to embed them on your website.

This package contains two things:

1. Code samples in Markdown files
2. A function to query these Markdown files, based on locale, sample-id and/or platform.

## Lib usage

Details on the library usage can be found in the [lib/readme document](/lib/README.md).

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
