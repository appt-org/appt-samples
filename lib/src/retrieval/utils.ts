import type { Locale, Framework, Technique } from "../generated";

export function getPathForIntroduction(locale: Locale, technique: Technique) {
  return `@appt.org/samples/samples/${locale}.${technique}.README.md`;
}

export function getPathForSample(
  locale: Locale,
  technique: Technique,
  framework: Framework,
) {
  return `@appt.org/samples/samples/${locale}.${technique}.${framework}.md`;
}

export function getUrlForIntroduction(locale: Locale, technique: Technique) {
  return `https://github.com/appt-org/appt-samples/tree/develop/data/${locale}/${technique}/README.md`;
}

export function getUrlForSample(
  locale: Locale,
  technique: Technique,
  framework: Framework,
) {
  return `https://github.com/appt-org/appt-samples/tree/develop/data/${locale}/${technique}/${framework}.md`;
}
