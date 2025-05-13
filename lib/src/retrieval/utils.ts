import { Locale, Framework, Technique, samples } from "../generated";

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

/**
 * Returns the first locale (from left to right) that supports a technique (and therefore has an introduction).
 */
export function getLocaleForIntroduction(
  allowedLocales: Locale[],
  technique: Technique,
) {
  return allowedLocales.find((locale) =>
    Array.isArray(samples[locale]?.[technique]),
  );
}

/**
 * Returns the first locale (from left to right) that has the requested sample.
 */
export function getLocaleForSample(
  allowedLocales: Locale[],
  technique: Technique,
  framework: Framework,
) {
  return allowedLocales.find((locale) => {
    const availableSamples = samples[locale]?.[technique];
    return (
      Array.isArray(availableSamples) && availableSamples.includes(framework)
    );
  });
}
