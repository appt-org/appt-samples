import type { Loader } from "../types";

/**
 * A partial of the __WebpackModuleApi.RequireContext, taken from the webpack-env repo, but slightly modified to align with lazy loading
 */
interface WebpackContext {
  (id: string): Promise<any>;
  keys(): string[];
}

/**
 * Creates a Loader instance that loads topic introductions and samples using a Webpack context.
 *
 * This function adapts a (possibly lazy) Webpack context (such as one created by `require.context`)
 * to the Loader interface expected by topic and sample query functions.
 *
 * @param {WebpackContext} webpackContext - The Webpack context to use for loading files.
 *   Typically created with `require.context` and configured for lazy loading.
 *
 * @returns {Loader} A Loader implementation that loads topic introductions and samples
 *   via the provided Webpack context.
 *
 * @example
 * // Create a Webpack context for all markdown files under the samples directory (lazy loaded)
 * const samplesContext = require.context('@appt.org/samples/samples', true, /\.md$/, 'lazy');
 *
 * // Create a Loader using the Webpack context
 * const webpackLoader = createWebpackLoader(samplesContext);
 *
 * // Use the loader to retrieve topic(s) and its samples
 * const topic = await getTopic(webpackLoader, {
 *   locale: 'en',
 *   technique: 'accessibility-role',
 * });
 *
 * @see {@link https://webpack.js.org/guides/dependency-management/#requirecontext}
 */
export function createWebpackLoader(webpackContext: WebpackContext): Loader {
  // Create the map from lookup keys to the relative paths needed by the context module.
  const pathMap = webpackContext
    .keys()
    .reduce<Record<string, string>>((map, relativePath) => {
      const lookupKey = constructLookupKeyForRelativePath(relativePath);
      map[lookupKey] = relativePath;
      return map;
    }, {});

  return {
    loadTopicIntroduction: async (_, locale, technique) => {
      const lookupKey = constructLookupKey(locale, technique, "README");
      const relativePath = pathMap[lookupKey];

      return await webpackContext(relativePath);
    },
    loadSample: async (_, locale, technique, framework) => {
      const lookupKey = constructLookupKey(locale, technique, framework);
      const relativePath = pathMap[lookupKey];

      return await webpackContext(relativePath);
    },
  };
}

/**
 * Constructs a lookup-key with the format `[locale].[technique].[framework]`.
 */
function constructLookupKey(
  locale: string,
  technique: string,
  framework: string,
) {
  return `${locale}.${technique}.${framework}`;
}

/**
 * Constructs the lookup-key for a relative path that is yielded from a WebpackContext.
 */
function constructLookupKeyForRelativePath(relativePath: string) {
  const filename = relativePath.split("/").at(-1);
  if (!filename) {
    throw new Error(
      `A lookup-key could not be constructed for ${relativePath}`,
    );
  }

  // Get from the filename: [locale, technique, framework]
  const sampleMeta = filename.split(".").slice(0, 3);
  if (sampleMeta.length !== 3) {
    throw new Error(
      `The key could not be constructed for "${relativePath}", because of an invalid filename`,
    );
  }

  return constructLookupKey(sampleMeta[0], sampleMeta[1], sampleMeta[2]);
}
