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
  contributionUrl: string;
  contentPath: string;
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
 *   { locale: 'en', platform: ['android', 'ios'] },
 *   { limit: 5 }
 * );
 */
export function getCodeSamples(
  query: CodeSamplesQuery,
  options: CodeSamplesQueryOptions = {},
): CodeSample[] {
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
      results.push({
        locale,
        sampleId,
        platform,
        contentPath: getImportPathForCodeSample(locale, sampleId, platform),
        contributionUrl: getContributionUrl(locale, sampleId, platform),
      });

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

interface GetCodeSampleForOnePlatformQuery {
  locale: Locale;
  sampleId: SampleId;
  platform: Platform;
}

/**
 * Retrieves a single code samples for a single platform, based on specified parameters.
 *
 * This function retrieves the code sample by locale, sample ID, and platform.
 *
 * @param {GetCodeSampleForOnePlatformQuery} query - The query parameters for retrieving the code sample
 * @param {Locale} query.locale - The locale to retrieve code sample for
 * @param {SampleId[]} [query.sampleId] - The sampleId to retrieve code sample for
 * @param {Platform[]} [query.platform] - The platforms to retrieve code sample for
 *
 * @returns {CodeSample[] | null} An array of code samples matching the query parameters, or `null` if no sample exists
 *
 * @example
 * // Get the Android screen-dark-mode sample for 'en' locale
 * const androidScreenDarkModeSample = getCodeSamples(
 *  { locale: 'en', sampleId: 'screen-dark-mode', platform: 'android' }
 * );
 */
export function getCodeSampleForOnePlatform(
  query: GetCodeSampleForOnePlatformQuery,
): CodeSample | null {
  const sampleExists = samples[query.locale]?.[query.sampleId]?.includes(
    query.platform,
  );

  if (!sampleExists) {
    return null;
  }

  return {
    locale: query.locale,
    sampleId: query.sampleId,
    platform: query.platform,
    contentPath: getImportPathForCodeSample(
      query.locale,
      query.sampleId,
      query.platform,
    ),
    contributionUrl: getContributionUrl(
      query.locale,
      query.sampleId,
      query.platform,
    ),
  };
}

function getImportPathForCodeSample(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `@appt.org/samples/code-samples/${locale}.${sampleId}.${platform}.md`;
}

function getContributionUrl(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${sampleId}/${platform}.md`;
}
