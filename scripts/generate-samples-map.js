import fs from "node:fs";
import path from "node:path";

console.log("Generating samples map");

const samplesRoot = path.resolve(".", "src/data");

// This array will hold each sample entry
const sampleEntries = {};

const locales = fs.readdirSync(samplesRoot).filter((item) => {
  const fullPath = path.join(samplesRoot, item);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`[Info] Found ${locales.length} locale(s): ${locales}.`);

for (const locale of locales) {
  sampleEntries[locale] = {};
  const localePath = path.join(samplesRoot, locale);

  // Read all sample directories inside the locale
  const sampleIds = fs.readdirSync(localePath).filter((item) => {
    const fullPath = path.join(localePath, item);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(
    `[Info] Found ${sampleIds.length} sample(s) for locale ${locale}.`,
  );

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

    sampleEntries[locale][sampleId] = [];
    for (const platformFile of platformFiles) {
      const platform = path.parse(platformFile).name;
      sampleEntries[locale][sampleId].push(platform);
    }
  }
}

const sampleIds = dedupeArray(
  Object.values(sampleEntries).flatMap(Object.keys),
);

const platforms = dedupeArray(
  Object.values(sampleEntries).map(Object.values).flat(2),
);

const fileContent = `// This file is generated automatically. Do not edit manually.

${unionType(true, "Locale", locales)}
${unionType(true, "SampleId", sampleIds)}
${unionType(true, "Platform", platforms)}

export const samples = ${JSON.stringify(sampleEntries, null, 2)} as const satisfies Record<Locale, Record<SampleId, Platform[]>>;
`;

fs.writeFileSync("src/generated.ts", fileContent);

function dedupeArray(arr) {
  return Array.from(new Set(arr));
}

function unionType(isExported, name, values) {
  const unionTypeParts = [];

  isExported && unionTypeParts.push("export");
  unionTypeParts.push(
    "type",
    name,
    "=",
    values.map((v) => JSON.stringify(v)).join(" | "),
  );

  return unionTypeParts.join(" ");
}
