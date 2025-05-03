import { samples, type Locale, type SampleId, Framework } from "../generated";
import type { CodeSample, Loader, FrameworkCodeSample } from "../types";
import { frameworkIdToLabelMap } from "../frameworks";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForFrameworkCodeSample,
  getImportPathForIntroduction,
  getImportPathForFrameworkCodeSample,
} from "./utils";

interface GetCodeSampleQuery {
  locale: Locale;
  sampleId: SampleId;
  frameworks?: Framework[];
}

export async function getCodeSample(
  loader: Loader,
  query: GetCodeSampleQuery,
): Promise<CodeSample | null> {
  const availableFrameworks = samples[query.locale]?.[query.sampleId];
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
    frameworks: await Promise.all(
      frameworks.map<Promise<FrameworkCodeSample>>(async (framework) => ({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        importPath: getImportPathForFrameworkCodeSample(
          query.locale,
          query.sampleId,
          framework,
        ),
        contributionUrl: getContributionUrlForFrameworkCodeSample(
          query.locale,
          query.sampleId,
          framework,
        ),
        content: await loader.loadFrameworkSample(
          query.locale,
          query.sampleId,
          framework,
        ),
      })),
    ),
  };
}
