import {
  samples,
  type Locale,
  type Technique,
  type Framework,
} from "../generated";
import type { Topic, Loader, Sample } from "../types";
import {
  frameworkIdToLabelMap,
  frameworks as allFrameworks,
} from "../frameworks";
import {
  getUrlForIntroduction,
  getUrlForSample,
  getPathForIntroduction,
  getPathForSample,
  getLocaleForSample,
  getLocaleForIntroduction,
} from "./utils";

interface GetTopicQuery {
  locale: Locale[];
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
 * @param {Locale[]} query.locale - The locale to fetch the topic from. If a sample is not available in the first selected locale, we fall back to the second, then the third etc.
 * @param {Technique} query.technique - The technique to retrieve
 * @param {Framework[]} [query.frameworks] - Optional array of frameworks to filter samples by
 *
 * @returns {Promise<Topic|null>} The topic with its introduction and samples, or `null` if not found
 *
 * @example
 * // Get the 'accessibility-role' topic with all available frameworks in 'en' locale
 * const topic = await getTopic(loader, { locale: ['en'], technique: 'accessibility-role' });
 *
 * @example
 * // Get the 'accessibility-role' topic, but only for the 'android' and 'ios' frameworks
 * const topic = await getTopic(loader, {
 *   locale: ['en'],
 *   technique: 'accessibility-role',
 *   frameworks: ['android', 'ios'],
 * });
 */
export async function getTopic(
  loader: Loader,
  query: GetTopicQuery,
): Promise<Topic | null> {
  const introductionLocale = getLocaleForIntroduction(
    query.locale,
    query.technique,
  );
  if (!introductionLocale) {
    return null;
  }

  const requestedFrameworks = query.frameworks ?? allFrameworks;
  const samplesToLoad = requestedFrameworks
    .map((framework) => ({
      framework,
      locale: getLocaleForSample(query.locale, query.technique, framework),
    }))
    .filter(
      (sample): sample is { locale: Locale; framework: Framework } =>
        typeof sample.locale === "string",
    );

  const introductionPath = getPathForIntroduction(
    introductionLocale,
    query.technique,
  );

  return {
    technique: query.technique,
    introduction: {
      locale: introductionLocale,
      path: introductionPath,
      url: getUrlForIntroduction(introductionLocale, query.technique),
      content: await loader.loadTopicIntroduction(
        introductionPath,
        introductionLocale,
        query.technique,
      ),
    },
    samples: await Promise.all(
      samplesToLoad.map<Promise<Sample>>(async ({ framework, locale }) => {
        const samplePath = getPathForSample(locale, query.technique, framework);
        return {
          locale,
          framework: {
            id: framework,
            label: frameworkIdToLabelMap[framework],
          },
          path: samplePath,
          url: getUrlForSample(locale, query.technique, framework),
          content: await loader.loadSample(
            samplePath,
            locale,
            query.technique,
            framework,
          ),
        };
      }),
    ),
  };
}
