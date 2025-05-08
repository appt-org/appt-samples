import { samples, type Locale, type TopicId, Framework } from "../generated";
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
  topicId: TopicId;
  frameworks?: Framework[];
}

/**
 * Retrieves a single topic and its samples based on specified query parameters.
 *
 * This function fetches a topic by locale and topic ID, and optionally filters samples
 * by framework. If the requested topic or locale does not exist, `null` is returned.
 * If the frameworks parameter is omitted, samples for all available frameworks are included.
 *
 * @param {Loader} loader - The loader used to fetch topic introductions and samples
 * @param {GetTopicQuery} query - The query parameters for retrieving the topic
 * @param {Locale} query.locale - The locale to fetch the topic from
 * @param {TopicId} query.topicId - The ID of the topic to retrieve
 * @param {Framework[]} [query.frameworks] - Optional array of frameworks to filter samples by
 *
 * @returns {Promise<Topic|null>} The topic with its introduction and samples, or `null` if not found
 *
 * @example
 * // Get the 'accessibility-role' topic with all available frameworks in 'en' locale
 * const topic = await getTopic(loader, { locale: 'en', topicId: 'accessibility-role' });
 *
 * @example
 * // Get the 'accessibility-role' topic, but only for the 'android' and 'ios' frameworks
 * const topic = await getTopic(loader, {
 *   locale: 'en',
 *   topicId: 'accessibility-role',
 *   frameworks: ['android', 'ios'],
 * });
 */
export async function getTopic(
  loader: Loader,
  query: GetTopicQuery,
): Promise<Topic | null> {
  const availableFrameworks = samples[query.locale]?.[query.topicId];
  if (!Array.isArray(availableFrameworks)) {
    return null;
  }

  const frameworks = query.frameworks
    ? availableFrameworks.filter((framework) =>
        query.frameworks?.includes(framework),
      )
    : availableFrameworks;

  return {
    locale: query.locale,
    topicId: query.topicId,
    introduction: {
      path: getPathForIntroduction(query.locale, query.topicId),
      url: getUrlForIntroduction(query.locale, query.topicId),
      content: await loader.loadTopicIntroduction(query.locale, query.topicId),
    },
    samples: await Promise.all(
      frameworks.map<Promise<Sample>>(async (framework) => ({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        path: getPathForSample(query.locale, query.topicId, framework),
        url: getUrlForSample(query.locale, query.topicId, framework),
        content: await loader.loadSample(
          query.locale,
          query.topicId,
          framework,
        ),
      })),
    ),
  };
}
