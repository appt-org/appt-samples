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
interface Loader {
  loadCodeSample: (
    locale: Locale,
    topicId: TopicId,
    framework: Framework,
  ) => Promise<any>;
  loadTopicIntroduction: (locale: Locale, topicId: TopicId) => Promise<any>;
}
```

#### Webpack

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
  '@appt.org/samples/samples',
  true, // Include subdirectories
  /\.md$/, // Only include markdown files
  'lazy' // Only load a sample when it is requested in retrieval
);

// Create a loader using the webpack context
const loader = createWebpackLoader(webpackContext);

// Now you can use the loader with the getCodeSample function
import { getTopic } from '@appt.org/samples';

const topic = await getTopic(loader, {
  locale: 'en',
  topicId: 'screen-dark-mode'
});

// The imported markdown file is available under topic.codeSamples[number].content.
// The value of `content` depends on your own Webpack configuration.
```

#### Creating Custom Loaders

You can create your own loader for your specific needs or environment. For example, if you're using a different bundler
or have a custom way of loading Markdown files, you can implement the `Loader` interface:

```typescript
import { Loader } from '@appt.org/samples';

// Create a custom loader
const customLoader: Loader = {
  loadCodeSample: async (locale, topicId, framework) => {
    // Your custom implementation to load framework samples
    // This could use fetch, dynamic imports, or any other method
    const content = await yourCustomLoadingMethod(locale, topicId, framework);
    return content;
  },
  loadTopicIntroduction: async (locale, topicId) => {
    // Your custom implementation to load sample introductions
    const content = await yourCustomLoadingMethod(locale, topicId, 'README');
    return content;
  }
};

// Use your custom loader with getCodeSample
import { getTopic } from '@appt.org/samples';

const codeSample = await getTopic(customLoader, {
  locale: 'en',
  topicId: 'screen-dark-mode'
});
```

This flexibility allows you to integrate the library with any environment or build system.

## Retrieval

The library provides two main functions for retrieving code samples: `querySamples` and `getTopic`. These functions allow you to fetch code samples based on various criteria such as locale, topic ID, and framework.

### querySamples

The `querySamples` function retrieves multiple topics and their code samples based on specified query parameters.

```typescript
async function querySamples(
  loader: Loader,
  query: {
    locale: Locale;
    topicId?: Array<TopicId>;
    framework?: Array<Framework>;
  }
): Promise<Topic[]>
```

This function filters topics and code samples by:
- `locale` (required): The language locale to get code samples from
- `topicId` (optional): An array of topic IDs to filter by
- `framework` (optional): An array of frameworks to filter by

If `topicId` or `framework` parameters are omitted, all available topics or frameworks will be included.

**Examples:**

```javascript
// Get all code topics with all platforms for the 'en' locale
const allSamples = await querySamples(loader, { locale: 'en' });

// Get all topics with code samples for Android and iOS, for the 'en' locale
const androidAndIosSamples = await querySamples(
  loader,
  { locale: 'en', frameworks: ['android', 'ios'] }
);

// Get the Dark Mode topic with all frameworks, in 'en' locale
const darkModeSamples = await querySamples(
  loader,
  { locale: 'en', topicIds: ['screen-dark-mode'] }
);
```

### getTopic

The `getTopic` function retrieves a single topic and its code samples based on specified query parameters.

```typescript
async function getTopic(
  loader: Loader,
  query: {
    locale: Locale;
    topicId: TopicId;
    frameworks?: Framework[];
  }
): Promise<Topic | null>
```

This function fetches a topic by:
- `locale` (required): The language locale to get the topic from
- `topicId` (required): The ID of the topic to retrieve
- `frameworks` (optional): An array of frameworks to filter code samples by

If the requested topic or locale does not exist, `null` is returned. If the `frameworks` parameter is omitted, code samples for all available frameworks are included.

**Examples:**

```javascript
// Get the 'screen-dark-mode' topic with all available frameworks in 'en' locale
const topic = await getTopic(loader, { locale: 'en', topicId: 'screen-dark-mode' });

// Get the 'screen-dark-mode' topic, but only for the 'android' and 'ios' frameworks
const topic = await getTopic(loader, {
  locale: 'en',
  topicId: 'screen-dark-mode',
  frameworks: ['android', 'ios'],
});
```

The returned `Topic` object contains the topic's introduction and code samples for the specified frameworks, along with metadata like import paths and contribution URLs.



## License

See the [LICENSE file](./LICENSE) for licensing information.
