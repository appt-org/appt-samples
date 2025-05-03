import type { Locale, Framework, TopicId } from "../generated";

export function getImportPathForIntroduction(locale: Locale, topicId: TopicId) {
  return `@appt.org/samples/code-samples/${locale}.${topicId}.README.md`;
}

export function getImportPathForCodeSample(
  locale: Locale,
  topicId: TopicId,
  framework: Framework,
) {
  return `@appt.org/samples/code-samples/${locale}.${topicId}.${framework}.md`;
}

export function getContributionUrlForIntroduction(
  locale: Locale,
  topicId: TopicId,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${topicId}/README.md`;
}

export function getContributionUrlForCodeSample(
  locale: Locale,
  topicId: TopicId,
  framework: Framework,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${topicId}/${framework}.md`;
}
