import type { Locale, Framework, TopicId } from "../generated";

export function getImportPathForIntroduction(locale: Locale, topicId: TopicId) {
  return `@appt.org/samples/samples/${locale}.${topicId}.README.md`;
}

export function getImportPathForSample(
  locale: Locale,
  topicId: TopicId,
  framework: Framework,
) {
  return `@appt.org/samples/samples/${locale}.${topicId}.${framework}.md`;
}

export function getContributionUrlForIntroduction(
  locale: Locale,
  topicId: TopicId,
) {
  return `https://github.com/appt-org/appt-samples/tree/develop/data/${locale}/${topicId}/README.md`;
}

export function getContributionUrlForSample(
  locale: Locale,
  topicId: TopicId,
  framework: Framework,
) {
  return `https://github.com/appt-org/appt-samples/tree/develop/data/${locale}/${topicId}/${framework}.md`;
}
