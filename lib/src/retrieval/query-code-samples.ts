import {
  samples,
  type Locale,
  type Framework,
  type SampleId,
} from "../generated";
import type { CodeSample, Loader } from "../types";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForFrameworkCodeSample,
  getImportPathForIntroduction,
  getImportPathForFrameworkCodeSample,
} from "./utils";
import { frameworkIdToLabelMap } from "../frameworks";

interface CodeSamplesQuery {
  locale: Locale;
  sampleId?: Array<SampleId>;
  framework?: Array<Framework>;
}

/**
 * Retrieves code samples based on specified query parameters and options.
 *
 * This function filters code samples by locale, sample ID, and/or framework.
 * If the sample-id or framework parameters are left empty, everything is retrieved.
 *
 * @param {Loader} loader - The loader to use
 * @param {CodeSamplesQuery} query - The query parameters for filtering code samples
 * @param {Locale} query.locale - The locale to get code samples from
 * @param {SampleId[]} [query.sampleId] - An optional array of sample IDs to retrieve by
 * @param {Framework[]} [query.framework] - An optional array of frameworks to retrieve by
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
 *   { locale: 'en', framework: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Dark Mode sample for all frameworks in 'en' locale
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
      frameworks: [],
    });

    const sampleIndex = results.length - 1;

    const frameworksForSample = samplesForLocale[sampleId];
    for (const framework of frameworksForSample) {
      if (query.framework && !query.framework.includes(framework)) {
        continue;
      }

      results[sampleIndex].frameworks.push({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        contributionUrl: getContributionUrlForFrameworkCodeSample(
          locale,
          sampleId,
          framework,
        ),
        importPath: getImportPathForFrameworkCodeSample(
          locale,
          sampleId,
          framework,
        ),
        content: loader.loadFrameworkSample(locale, sampleId, framework),
      });
    }
  }

  return results;
}
