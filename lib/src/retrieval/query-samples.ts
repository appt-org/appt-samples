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
} from "./utils";
import { frameworkIdToLabelMap } from "../frameworks";

interface SamplesQuery {
  locale: Locale;
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
 * @param {Locale} query.locale - The locale to get samples from
 * @param {Technique[]} [query.techniques] - An optional array of techniques to retrieve by
 * @param {Framework[]} [query.frameworks] - An optional array of frameworks to retrieve by
 *
 * @returns {Topic[]} An array of topics matching the query parameters
 *
 * @example
 * // Get all topics with all platforms for the 'en' locale
 * const allSamples = querySamples(loader, { locale: 'en' });
 *
 * @example
 * // Get all topics with samples for Android and iOS, for the 'en' locale
 * const androidAndIosSamples = querySamples(
 *   loader,
 *   { locale: 'en', frameworks: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Accessibility Role topic with all frameworks, in 'en' locale
 * const accessibilityRoleSamples = querySamples(
 *   loader,
 *   { locale: 'en', techniques: ['accessibility-role'] },
 * );
 */
export async function querySamples(
  loader: Loader,
  query: SamplesQuery,
): Promise<Topic[]> {
  const results: Topic[] = [];
  const locale = query.locale;

  const techniquesForLocale = samples[query.locale];

  for (const technique of Object.keys(techniquesForLocale) as Technique[]) {
    if (query.techniques && !query.techniques.includes(technique)) {
      continue;
    }

    const introductionPath = getPathForIntroduction(locale, technique);
    results.push({
      locale,
      technique: technique,
      introduction: {
        url: getUrlForIntroduction(locale, technique),
        path: introductionPath,
        content: loader.loadTopicIntroduction(
          introductionPath,
          locale,
          technique,
        ),
      },
      samples: [],
    });

    const topicIndex = results.length - 1;

    const frameworksForSample = techniquesForLocale[technique];
    for (const framework of frameworksForSample) {
      if (query.frameworks && !query.frameworks.includes(framework)) {
        continue;
      }

      const samplePath = getPathForSample(locale, technique, framework);
      results[topicIndex].samples.push({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        url: getUrlForSample(locale, technique, framework),
        path: samplePath,
        content: loader.loadSample(samplePath, locale, technique, framework),
      });
    }
  }

  return results;
}
