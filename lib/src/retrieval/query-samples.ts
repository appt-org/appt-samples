import {
  samples,
  type Locale,
  type Framework,
  type Technique,
} from "../generated";
import type { Topic, Loader } from "../types";
import {
  getUrlForIntroduction,
  getUrlForSample,
  getPathForIntroduction,
  getPathForSample,
  getLocaleForIntroduction,
  getLocaleForSample,
} from "./utils";
import {
  frameworkIdToLabelMap,
  frameworks as allFrameworks,
} from "../frameworks";

interface SamplesQuery {
  locale: Locale[];
  techniques?: Technique[];
  frameworks?: Framework[];
}

/**
 * Retrieves topics and samples based on specified query parameters and options.
 *
 * This function filters topics and samples by locale, technique, and/or framework.
 * If the technique or framework parameters are left empty, everything is retrieved.
 *
 * @param {Loader} loader - The loader to use
 * @param {SamplesQuery} query - The query parameters for filtering samples
 * @param {Locale[]} query.locale - The locale to get samples from. If a sample is not available in the first selected locale, we fall back to the second, then the third etc.
 * @param {Technique[]} [query.techniques] - An optional array of techniques to retrieve by
 * @param {Framework[]} [query.frameworks] - An optional array of frameworks to retrieve by
 *
 * @returns {Topic[]} An array of topics matching the query parameters
 *
 * @example
 * // Get all topics with all platforms for the 'en' locale
 * const allSamples = querySamples(loader, { locale: ['en'] });
 *
 * @example
 * // Get all topics with samples for Android and iOS, for the 'en' locale
 * const androidAndIosSamples = querySamples(
 *   loader,
 *   { locale: ['en'], frameworks: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Accessibility Role topic with all frameworks, in 'en' locale
 * const accessibilityRoleSamples = querySamples(
 *   loader,
 *   { locale: ['en'], techniques: ['accessibility-role'] },
 * );
 */
export async function querySamples(
  loader: Loader,
  query: SamplesQuery,
): Promise<Topic[]> {
  const results: Topic[] = [];

  const dupedAvailableTechniques = query.locale
    .filter((locale) => locale in samples)
    .flatMap((locale) => Object.keys(samples[locale]) as Technique[]);
  const availableTechniques = new Set(dupedAvailableTechniques);

  for (const technique of availableTechniques) {
    if (query.techniques && !query.techniques.includes(technique)) {
      continue;
    }

    const introductionLocale = getLocaleForIntroduction(
      query.locale,
      technique,
    );
    if (!introductionLocale) {
      continue;
    }

    const introductionPath = getPathForIntroduction(
      introductionLocale,
      technique,
    );
    results.push({
      technique: technique,
      introduction: {
        locale: introductionLocale,
        url: getUrlForIntroduction(introductionLocale, technique),
        path: introductionPath,
        content: await loader.loadTopicIntroduction(
          introductionPath,
          introductionLocale,
          technique,
        ),
      },
      samples: [],
    });

    const topicIndex = results.length - 1;

    for (const framework of allFrameworks) {
      if (query.frameworks && !query.frameworks.includes(framework)) {
        continue;
      }

      const sampleLocale = getLocaleForSample(
        query.locale,
        technique,
        framework,
      );
      if (!sampleLocale) {
        continue;
      }

      const samplePath = getPathForSample(sampleLocale, technique, framework);
      results[topicIndex].samples.push({
        locale: sampleLocale,
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        url: getUrlForSample(sampleLocale, technique, framework),
        path: samplePath,
        content: await loader.loadSample(
          samplePath,
          sampleLocale,
          technique,
          framework,
        ),
      });
    }
  }

  return results;
}
