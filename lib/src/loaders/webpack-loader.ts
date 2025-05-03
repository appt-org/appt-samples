import type { Loader } from "../types";

/**
 * A partial of the __WebpackModuleApi.RequireContext, taken from the webpack-env repo, but slightly modified to align with lazy loading
 */
export interface WebpackContext {
  (id: string): Promise<any>;
  keys(): string[];
}

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
    loadSampleIntroduction: async (locale, sampleId) => {
      const lookupKey = constructLookupKey(locale, sampleId, "README");
      const relativePath = pathMap[lookupKey];

      return await webpackContext(relativePath);
    },
    loadFrameworkSample: async (locale, sampleId, framework) => {
      const lookupKey = constructLookupKey(locale, sampleId, framework);
      const relativePath = pathMap[lookupKey];

      return await webpackContext(relativePath);
    },
  };
}

/**
 * Constructs a lookup-key with the format `[locale].[sampleId].[framework]`.
 */
function constructLookupKey(
  locale: string,
  sampleId: string,
  framework: string,
) {
  return `${locale}.${sampleId}.${framework}`;
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

  // Get from the filename: [locale, sampleId, framework]
  const sampleMeta = filename.split(".").slice(0, 3);
  if (sampleMeta.length !== 3) {
    throw new Error(
      `The key could not be constructed for "${relativePath}", because of an invalid filename`,
    );
  }

  return constructLookupKey(sampleMeta[0], sampleMeta[1], sampleMeta[2]);
}
