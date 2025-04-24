import fs from "node:fs";
import path from "node:path";

console.log("Generating samples map");

const samplesRoot = path.resolve(".", "src/data");

// This array will hold each sample entry
const sampleEntries = [];

const locales = fs.readdirSync(samplesRoot).filter((item) => {
  const fullPath = path.join(samplesRoot, item);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`[Info] Found ${locales.length} locale(s): ${locales}.`);

for (const locale of locales) {
  const localePath = path.join(samplesRoot, locale);

  // Read all sample directories inside the locale
  const sampleIds = fs.readdirSync(localePath).filter((item) => {
    const fullPath = path.join(localePath, item);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`[Info] Found ${sampleIds.length} samples.`);

  for (const sampleId of sampleIds) {
    const samplePath = path.join(localePath, sampleId);

    const { readme, platformFiles } = fs
      .readdirSync(samplePath)
      .filter((item) => {
        const fullPath = path.join(samplePath, item);
        const isMarkdownFile = path.extname(fullPath).toLowerCase() === ".md";

        return fs.statSync(fullPath).isFile() && isMarkdownFile;
      })
      .map((item) => path.join("data", locale, sampleId, item))
      .reduce(
        (acc, item) => {
          const isReadme = path.basename(item).toLowerCase() === "readme.md";
          if (isReadme) {
            return { ...acc, readme: item };
          }

          return { ...acc, platformFiles: [...acc.platformFiles, item] };
        },
        { readme: null, platformFiles: [] },
      );

    if (!readme) {
      console.warn(
        `[Warn]: skipping ${sampleId} because it does not contain a README.md file`,
      );
    }

    for (const platformFile of platformFiles) {
      // The data property will be a function that returns a dynamic import of the markdown file.
      // We write it out as a string containing the TS code for the function.
      const dataFunctionString = `() => import("${platformFile}")`;

      sampleEntries.push({
        locale,
        sampleId,
        platform: path.parse(platformFile).name,
        data: dataFunctionString,
      });
    }
  }
}

let fileContent = `// This file is generated automatically. Do not edit manually.

export const samples = [
`;

for (const entry of sampleEntries) {
  fileContent += `  {
    locale: "${entry.locale}",
    sampleId: "${entry.sampleId}",
    platform: "${entry.platform}",
    data: ${entry.data}
  },
`;
}

fileContent += `];
`;

fs.writeFileSync("src/generated/samples-map.ts", fileContent);
