# Appt Code Samples

The Appt® platform is an initiative of the Appt Foundation, a non-profit organization. Our mission is to make apps
accessible for everyone. We try to achieve this by sharing free knowledge and open-source code. Appt.org is a website
that empowers developers and organizations to build accessible apps for everyone.

This package contains two things:

1. Code samples (in Markdown format)
2. Loaders - A way to let the library know how to import these files in your environment.
3. A retrieval function to query the code samples, based on locale, sample-id and/or platform.

The package is responsible solely for data and does not handle any user interface (UI) elements. UI
implementation is left to the implementing party. The implementing party should also configure their environment
(bundler) to allow the importing of Markdown files directly.

## Getting started

To use the package in your project, follow the steps below.

```shell
# Install the dependency
npm i @appt.org/samples
```

### Bundler configuration

As explained in the introduction of this readme, you must configure your environment (bundler) to allow importing
of Markdown (.md) files.

#### Understanding Loaders

Loaders are a key concept in this library. They provide a way to dynamically import Markdown files based on locale,
sample ID, and framework.

The library defines a `Loader` interface that any loader must implement:

```typescript
export interface Loader {
  loadFrameworkSample: (
    locale: Locale,
    sampleId: SampleId,
    framework: Framework,
  ) => Promise<any>;
  loadSampleIntroduction: (locale: Locale, sampleId: SampleId) => Promise<any>;
}
```

#### Webpack Configuration

The library includes a built-in loader for webpack. To use it, you first need to configure Webpack to handle Markdown
files. The rule can be defined in any way that works best for you. If you already handle markdown files, or are using
Docusaurus or a different framework that handles Markdown files by default, you can skip this step.

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        type: 'asset/source'
      }
    ]
  }
};
```

Then, set up a Webpack context

```javascript
// In your application code
import { createWebpackLoader } from '@appt.org/samples';

// Create a webpack context that includes all markdown files
const webpackContext = require.context(
  '@appt.org/samples/code-samples',
  true, // Include subdirectories
  /\.md$/, // Only include markdown files
  'lazy' // Only load a sample when it is requested in retrieval
);

// Create a loader using the webpack context
const loader = createWebpackLoader(webpackContext);

// Now you can use the loader with the getCodeSample function
import { getCodeSample } from '@appt.org/samples';

const codeSample = await getCodeSample(loader, {
  locale: 'en',
  sampleId: 'screen-dark-mode'
});

// The imported markdown file is available under codeSample.frameworks[framework].content.
// The value of `content` depends on your own Webpack configuration.
```

#### Creating Custom Loaders

You can create your own loader for your specific needs or environment. For example, if you're using a different bundler
or have a custom way of loading Markdown files, you can implement the `Loader` interface:

```typescript
import { Loader } from '@appt.org/samples';

// Create a custom loader
const customLoader: Loader = {
  loadFrameworkSample: async (locale, sampleId, framework) => {
    // Your custom implementation to load framework samples
    // This could use fetch, dynamic imports, or any other method
    const content = await yourCustomLoadingMethod(locale, sampleId, framework);
    return content;
  },
  loadSampleIntroduction: async (locale, sampleId) => {
    // Your custom implementation to load sample introductions
    const content = await yourCustomLoadingMethod(locale, sampleId, 'README');
    return content;
  }
};

// Use your custom loader with getCodeSample
import { getCodeSample } from '@appt.org/samples';

const codeSample = await getCodeSample(customLoader, {
  locale: 'en',
  sampleId: 'example-sample'
});
```

This flexibility allows you to integrate the library with any environment or build system.

## License

See the [LICENSE file](./LICENSE) for licensing information.
