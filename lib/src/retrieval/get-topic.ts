import { samples, type Locale, type TopicId, Framework } from "../generated";
import type { Topic, Loader, CodeSample } from "../types";
import { frameworkIdToLabelMap } from "../frameworks";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForCodeSample,
  getImportPathForIntroduction,
  getImportPathForCodeSample,
} from "./utils";

interface GetTopicQuery {
  locale: Locale;
  topicId: TopicId;
  frameworks?: Framework[];
}

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
      importPath: getImportPathForIntroduction(query.locale, query.topicId),
      contributionUrl: getContributionUrlForIntroduction(
        query.locale,
        query.topicId,
      ),
      content: await loader.loadTopicIntroduction(query.locale, query.topicId),
    },
    codeSamples: await Promise.all(
      frameworks.map<Promise<CodeSample>>(async (framework) => ({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        importPath: getImportPathForCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
        contributionUrl: getContributionUrlForCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
        content: await loader.loadCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
      })),
    ),
  };
}
