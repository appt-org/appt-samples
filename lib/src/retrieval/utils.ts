import type { Locale, Platform, SampleId } from "../generated";

export function getImportPathForIntroduction(
  locale: Locale,
  sampleId: SampleId,
) {
  return `@appt.org/samples/code-samples/${locale}.${sampleId}.README.md`;
}

export function getImportPathForPlatformCodeSample(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `@appt.org/samples/code-samples/${locale}.${sampleId}.${platform}.md`;
}

export function getContributionUrlForIntroduction(
  locale: Locale,
  sampleId: SampleId,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${sampleId}/README.md`;
}

export function getContributionUrlForPlatformCodeSample(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${sampleId}/${platform}.md`;
}
