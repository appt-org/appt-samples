import {
  samples,
  type Locale,
  type Platform,
  type SampleId,
} from "./generated";

interface CodeSamplesQuery {
  locale: Locale;
  platform?: Array<Platform>;
  sampleId?: Array<SampleId>;
}

interface CodeSamplesQueryOptions {
  limit?: number;
}

interface CodeSample {
  locale: Locale;
  sampleId: SampleId;
  platform: Platform;
  content: string;
}

/**
 * Retrieves code samples based on specified query parameters and options.
 *
 * This function filters code samples by locale, sample ID, and/or platform.
 *
 * @param {CodeSamplesQuery} query - The query parameters for filtering code samples
 * @param {Locale} query.locale - The locale to filter code samples by
 * @param {SampleId[]} [query.sampleId] - Optional array of sample IDs to filter by
 * @param {Platform[]} [query.platform] - Optional array of platforms to filter by
 *
 * @param {CodeSamplesQueryOptions} [options] - Additional options for the query
 * @param {number} [options.limit] - Maximum number of code samples to return (defaults to Infinity)
 *
 * @returns {CodeSample[]} An array of code samples matching the query parameters
 *
 * @example
 * // Get all code samples for 'en' locale
 * const allSamples = getCodeSamples({ locale: 'en' });
 *
 * @example
 * // Get up to 5 Android And iOS samples for 'en' locale
 * const androidAndIosSamples = getCodeSamples(
 *   { locale: 'en-US', platform: ['android', 'ios'] },
 *   { limit: 5 }
 * );
 */
export async function getCodeSamples(
  query: CodeSamplesQuery,
  options: CodeSamplesQueryOptions = {},
): Promise<CodeSample[]> {
  const results: CodeSample[] = [];
  const limit = options.limit ?? Infinity;
  const locale = query.locale;

  // Preprocess filters into Sets for O(1) lookups
  const sampleIdSet = query.sampleId ? new Set(query.sampleId) : null;
  const platformSet = query.platform ? new Set(query.platform) : null;

  const samplesForLocale = samples[query.locale];

  for (const sampleId of Object.keys(samplesForLocale) as SampleId[]) {
    if (sampleIdSet && !sampleIdSet.has(sampleId)) {
      continue;
    }

    const platformsForSample = samplesForLocale[sampleId];

    const filteredPlatforms = platformSet
      ? platformsForSample.filter((platform) => platformSet.has(platform))
      : platformsForSample;

    for (const platform of filteredPlatforms) {
      const content = await import(
        getImportPathForCodeSample(locale, sampleId, platform)
      );

      results.push({ locale, sampleId, platform, content });

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

function getImportPathForCodeSample(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `@appt-org/samples/data/${locale}/${sampleId}/${platform}.md`;
}
