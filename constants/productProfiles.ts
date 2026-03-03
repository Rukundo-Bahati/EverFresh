export type ProductProfile = {
  canonicalName: string;
  aliases: string[];
  storageProfile: string;
  targetTempC: number;
  targetHumidityPct: number;
  targetOxygenPct: number;
  expectedShelfLifeDays: number;
  containerType: "Dry" | "Cool" | "Controlled Atmosphere";
};

export const productProfiles: ProductProfile[] = [
  {
    canonicalName: "Maize",
    aliases: ["corn", "maize"],
    storageProfile: "Dry Grain",
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    expectedShelfLifeDays: 260,
    containerType: "Dry",
  },
  {
    canonicalName: "Beans",
    aliases: ["beans", "dry beans"],
    storageProfile: "Dry Legume",
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    expectedShelfLifeDays: 240,
    containerType: "Dry",
  },
  {
    canonicalName: "Rice",
    aliases: ["rice", "paddy"],
    storageProfile: "Dry Grain",
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    expectedShelfLifeDays: 330,
    containerType: "Dry",
  },
  {
    canonicalName: "Potato",
    aliases: ["potato", "irish potato", "potatoes"],
    storageProfile: "Cool Produce",
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    expectedShelfLifeDays: 95,
    containerType: "Cool",
  },
  {
    canonicalName: "Tomato",
    aliases: ["tomato", "tomatoes"],
    storageProfile: "Fresh Produce",
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    expectedShelfLifeDays: 30,
    containerType: "Controlled Atmosphere",
  },
  {
    canonicalName: "Milk",
    aliases: ["milk", "dairy"],
    storageProfile: "Chilled Liquid",
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    expectedShelfLifeDays: 10,
    containerType: "Cool",
  },
];

export function findBestProfile(productName: string): ProductProfile | null {
  const normalized = productName.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const exact = productProfiles.find((profile) =>
    profile.aliases.some((alias) => alias === normalized),
  );

  if (exact) {
    return exact;
  }

  const partial = productProfiles.find((profile) =>
    profile.aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized)),
  );

  return partial ?? null;
}
