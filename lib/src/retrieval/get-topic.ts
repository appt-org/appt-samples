import {
  samples,
  type Locale,
  type Technique,
  type Framework,
} from "../generated";
import type { Topic, Loader, Sample } from "../types";
import { frameworkIdToLabelMap } from "../frameworks";
import {
  getUrlForIntroduction,
  getUrlForSample,
  getPathForIntroduction,
  getPathForSample,
} from "./utils";

interface GetTopicQuery {
  locale: Locale;
  technique: Technique;
  frameworks?: Framework[];
}

/**
 * Retrieves a single topic and its samples based on specified query parameters.
 *
 * This function fetches a topic by locale and technique, and optionally filters samples
 * by framework. If the requested topic or locale does not exist, `null` is returned.
 * If the frameworks parameter is omitted, samples for all available frameworks are included.
 *
 * @param {Loader} loader - The loader used to fetch topic introductions and samples
 * @param {GetTopicQuery} query - The query parameters for retrieving the topic
 * @param {Locale} query.locale - The locale to fetch the topic from
 * @param {Technique} query.technique - The technique to retrieve
 * @param {Framework[]} [query.frameworks] - Optional array of frameworks to filter samples by
 *
 * @returns {Promise<Topic|null>} The topic with its introduction and samples, or `null` if not found
 *
 * @example
 * // Get the 'accessibility-role' topic with all available frameworks in 'en' locale
 * const topic = await getTopic(loader, { locale: 'en', technique: 'accessibility-role' });
 *
 * @example
 * // Get the 'accessibility-role' topic, but only for the 'android' and 'ios' frameworks
 * const topic = await getTopic(loader, {
 *   locale: 'en',
 *   technique: 'accessibility-role',
 *   frameworks: ['android', 'ios'],
 * });
 */
export async function getTopic(
  loader: Loader,
  query: GetTopicQuery,
): Promise<Topic | null> {
  const availableFrameworks = samples[query.locale]?.[query.technique];
  if (!Array.isArray(availableFrameworks)) {
    return null;
  }

  const frameworks = query.frameworks
    ? availableFrameworks.filter((framework) =>
        query.frameworks?.includes(framework),
      )
    : availableFrameworks;

  const introductionPath = getPathForIntroduction(
    query.locale,
    query.technique,
  );
  return {
    locale: query.locale,
    technique: query.technique,
    introduction: {
      path: introductionPath,
      url: getUrlForIntroduction(query.locale, query.technique),
      content: await loader.loadTopicIntroduction(
        introductionPath,
        query.locale,
        query.technique,
      ),
    },
    samples: await Promise.all(
      frameworks.map<Promise<Sample>>(async (framework) => {
        const samplePath = getPathForSample(
          query.locale,
          query.technique,
          framework,
        );
        return {
          framework: {
            id: framework,
            label: frameworkIdToLabelMap[framework],
          },
          path: samplePath,
          url: getUrlForSample(query.locale, query.technique, framework),
          content: await loader.loadSample(
            samplePath,
            query.locale,
            query.technique,
            framework,
          ),
        };
      }),
    ),
  };
}
