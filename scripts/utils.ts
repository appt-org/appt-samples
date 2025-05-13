export function dedupeArray<T extends number | string>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function unionType(isExported: boolean, name: string, values: string[]) {
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
