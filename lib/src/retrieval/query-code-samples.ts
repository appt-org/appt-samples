import {
  samples,
  type Locale,
  type Platform,
  type SampleId,
} from "../generated";
import type { CodeSample, Loader } from "../types";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForPlatformCodeSample,
  getImportPathForIntroduction,
  getImportPathForPlatformCodeSample,
} from "./utils";
import { platformIdToLabelMap } from "../platforms";

interface CodeSamplesQuery {
  locale: Locale;
  platform?: Array<Platform>;
  sampleId?: Array<SampleId>;
}

/**
 * Retrieves code samples based on specified query parameters and options.
 *
 * This function filters code samples by locale, sample ID, and/or platform.
 * If the sample-id or platform-id parameters are left empty, everything is retrieved.
 *
 * @param {Loader} loader - The loader to use
 * @param {CodeSamplesQuery} query - The query parameters for filtering code samples
 * @param {Locale} query.locale - The locale to get code samples from
 * @param {SampleId[]} [query.sampleId] - An optional array of sample IDs to retrieve by
 * @param {Platform[]} [query.platform] - An optional array of platforms to retrieve by
 *
 * @returns {CodeSample[]} An array of code samples matching the query parameters
 *
 * @example
 * // Get all code samples for 'en' locale
 * const allSamples = queryCodeSamples(loader, { locale: 'en' });
 *
 * @example
 * // Get all Android And iOS samples for 'en' locale
 * const androidAndIosSamples = queryCodeSamples(
 *   loader,
 *   { locale: 'en', platform: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Dark Mode sample for all platforms in 'en' locale
 * const androidAndIosSamples = queryCodeSamples(
 *   loader,
 *   { locale: 'en', sampleId: ['screen-dark-mode'] },
 * );
 */
export async function queryCodeSamples(
  loader: Loader,
  query: CodeSamplesQuery,
): Promise<CodeSample[]> {
  const results: CodeSample[] = [];
  const locale = query.locale;

  const samplesForLocale = samples[query.locale];

  for (const sampleId of Object.keys(samplesForLocale) as SampleId[]) {
    if (query.sampleId && !query.sampleId.includes(sampleId)) {
      continue;
    }

    results.push({
      locale,
      sampleId,
      introduction: {
        contributionUrl: getContributionUrlForIntroduction(locale, sampleId),
        importPath: getImportPathForIntroduction(locale, sampleId),
        content: loader.loadSampleIntroduction(locale, sampleId),
      },
      platforms: [],
    });

    const sampleIndex = results.length - 1;

    const platformsForSample = samplesForLocale[sampleId];
    for (const platform of platformsForSample) {
      if (query.platform && !query.platform.includes(platform)) {
        continue;
      }

      results[sampleIndex].platforms.push({
        platform: {
          id: platform,
          label: platformIdToLabelMap[platform],
        },
        contributionUrl: getContributionUrlForPlatformCodeSample(
          locale,
          sampleId,
          platform,
        ),
        importPath: getImportPathForPlatformCodeSample(
          locale,
          sampleId,
          platform,
        ),
        content: loader.loadPlatformSample(locale, sampleId, platform),
      });
    }
  }

  return results;
}
