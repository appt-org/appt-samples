# Appt Code Samples

The Appt® platform is an initiative of the Appt Foundation, a non-profit organization. Our mission is to make apps
accessible for everyone. We try to achieve this by sharing free knowledge and open-source code. Appt.org is a website
that empowers developers and organizations to build accessible apps for everyone.

This repository contains all code samples and provides components to embed them on your website.

This package contains two things:

1. Code samples in Markdown files
2. A function to query these Markdown files, based on locale, sample-id and/or platform.

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

As explained in the introduction of this readme, you must configure your environment (bundler) to allow direct importing
of Markdown (.md) files. Below are setup instructions for popular JavaScript environments:

#### Vite

For Vite, you can use vite-plugin-markdown to import Markdown files as raw Markdown, as Vue/React components or as
structured data (e.g., frontmatter + HTML).

Install the plugin:

```bash
npm install vite-plugin-markdown --save-dev
```

Add to your vite.config.js:

```js
import { defineConfig } from 'vite'
import { plugin as markdownPlugin, Mode } from "vite-plugin-markdown";

export default defineConfig({
  plugins: [
    markdownPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC, Mode.REACT, Mode.VUE] }) // Choose modes as needed
  ],
})
```

Now you can import Markdown files and access their content and metadata:

```js
import doc from './README.md'

// doc.markdown - the raw markdown
// doc.html     - the rendered HTML
// doc[...]
```

#### Next.js

For Next.js, you typically use @next/mdx to import Markdown as React components or structured data.

```shell
npm install @next/mdx @mdx-js/loader
```

Update your `next.config.js`:

```js
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
```

Now you can import Markdown/MDX files as React components:

```tsx
import MyDoc from './README.md'

export default function Page() {
  return <MyDoc />
}
```

#### Docusaurus

Docusaurus natively supports importing Markdown files as React components and extracting frontmatter.

Import as a component:

```tsx
import Doc from '@site/docs/README.md'

export default function Page() {
  return <Doc />
}
```

To access frontmatter or metadata, use the useDoc or useMDXComponent hooks if needed.

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
created in GitHub ([link](https://github.com/appt-org/appt-samples/releases/new)). When creating a new release, make
sure the 'version' field in the `lib/package.json` has the correct new version specified.

## License

See the [LICENSE file](./LICENSE) for licensing information.
