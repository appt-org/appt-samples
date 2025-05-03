import { samples, type Locale, type SampleId, Platform } from "../generated";
import type { CodeSample, Loader, PlatformCodeSample } from "../types";
import { platformIdToLabelMap } from "../platforms";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForPlatformCodeSample,
  getImportPathForIntroduction,
  getImportPathForPlatformCodeSample,
} from "./utils";

interface GetCodeSampleQuery {
  locale: Locale;
  sampleId: SampleId;
  platforms?: Platform[];
}

export async function getCodeSample(
  loader: Loader,
  query: GetCodeSampleQuery,
): Promise<CodeSample | null> {
  const availablePlatforms = samples[query.locale]?.[query.sampleId];
  if (!Array.isArray(availablePlatforms)) {
    return null;
  }

  const platforms = query.platforms
    ? availablePlatforms.filter((platform) =>
        query.platforms?.includes(platform),
      )
    : availablePlatforms;

  return {
    locale: query.locale,
    sampleId: query.sampleId,
    introduction: {
      importPath: getImportPathForIntroduction(query.locale, query.sampleId),
      contributionUrl: getContributionUrlForIntroduction(
        query.locale,
        query.sampleId,
      ),
      content: await loader.loadSampleIntroduction(
        query.locale,
        query.sampleId,
      ),
    },
    platforms: await Promise.all(
      platforms.map<Promise<PlatformCodeSample>>(async (platform) => ({
        platform: {
          id: platform,
          label: platformIdToLabelMap[platform],
        },
        importPath: getImportPathForPlatformCodeSample(
          query.locale,
          query.sampleId,
          platform,
        ),
        contributionUrl: getContributionUrlForPlatformCodeSample(
          query.locale,
          query.sampleId,
          platform,
        ),
        content: await loader.loadPlatformSample(
          query.locale,
          query.sampleId,
          platform,
        ),
      })),
    ),
  };
}
