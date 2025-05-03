import type { Locale, Framework, SampleId } from "../generated";

export function getImportPathForIntroduction(
  locale: Locale,
  sampleId: SampleId,
) {
  return `@appt.org/samples/code-samples/${locale}.${sampleId}.README.md`;
}

export function getImportPathForFrameworkCodeSample(
  locale: Locale,
  sampleId: SampleId,
  framework: Framework,
) {
  return `@appt.org/samples/code-samples/${locale}.${sampleId}.${framework}.md`;
}

export function getContributionUrlForIntroduction(
  locale: Locale,
  sampleId: SampleId,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${sampleId}/README.md`;
}

export function getContributionUrlForFrameworkCodeSample(
  locale: Locale,
  sampleId: SampleId,
  framework: Framework,
) {
  return `https://github.com/appt-org/appt-website/tree/develop/src/data/code-samples/${locale}/${sampleId}/${framework}.md`;
}
