import {
  samples,
  type Locale,
  type Platform,
  type SampleId,
} from "./generated/samples-map";

type Suggest<T extends string> = T | (string & {});

interface CodeSamplesQuery {
  locale: Locale;
  platform?: Array<Suggest<Platform>>;
  sampleId?: Array<Suggest<SampleId>>;
}

interface CodeSamplesQueryOptions {
  limit?: number;
}

interface CodeSample {
  locale: Locale;
  sampleId: SampleId;
  platform: Platform;
  content: string;
}

export function getCodeSamples(
  query: CodeSamplesQuery,
  options: CodeSamplesQueryOptions,
): CodeSample[] {
  const results: CodeSample[] = [];
  const limit = options.limit ?? Infinity;
  const locale = query.locale;

  // Preprocess filters into Sets for O(1) lookups
  const sampleIdSet = query.sampleId ? new Set(query.sampleId) : null;
  const platformSet = query.platform ? new Set(query.platform) : null;

  const samplesForLocale = samples[query.locale];

  for (const sampleId of Object.keys(samplesForLocale) as SampleId[]) {
    if (sampleIdSet && !sampleIdSet.has(sampleId)) {
      continue;
    }

    const platformsForSample = samplesForLocale[sampleId];

    const filteredPlatforms = platformSet
      ? platformsForSample.filter((platform) => platformSet.has(platform))
      : platformsForSample;

    for (const platform of filteredPlatforms) {
      // TODO: properly load MarkDown content
      const content = "";
      results.push({ locale, sampleId, platform, content });

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

function getImportPathForCodeSample(
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) {
  return `../data/${locale}/${sampleId}/${platform}.md`;
}
