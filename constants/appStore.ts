import { findBestProfile } from "./productProfiles";
import { getCurrentAccount } from "./sessionStore";

export type SystemMode = "single-container" | "multi-container";
export type AlertLevel = "Info" | "Warning" | "Critical";

export type NotificationPreferences = {
  push: boolean;
  sms: boolean;
  criticalOnly: boolean;
};

export type PowerStatus = {
  batteryPct: number;
  upsReserveHours: number;
};

export type ContainerUnit = {
  id: string;
  name: string;
  type: "Dry" | "Cool" | "Controlled Atmosphere";
  status: "Optimal" | "Attention" | "Critical";
  fillPercent: number;
  productType: string;
  currentTempC: number;
  currentHumidityPct: number;
  currentOxygenPct: number;
  targetTempC: number;
  targetHumidityPct: number;
  targetOxygenPct: number;
  lastSync: string;
};

export type BatchRecord = {
  id: string;
  productName: string;
  profile: string;
  containerId: string;
  containerName: string;
  enteredOn: string;
  expiryOn: string;
  targetTempC: number;
  targetHumidityPct: number;
  targetOxygenPct: number;
  quantityKg: number;
  status: "Good" | "Watch" | "Critical";
};

export type AlertRecord = {
  id: string;
  level: AlertLevel;
  message: string;
  timestamp: string;
  read: boolean;
  viaPush: boolean;
  viaSms: boolean;
};

export type GeneratedBatchDraft = Omit<BatchRecord, "id" | "status">;

let notificationPreferences: NotificationPreferences = {
  push: true,
  sms: true,
  criticalOnly: false,
};

let powerStatus: PowerStatus = {
  batteryPct: 87,
  upsReserveHours: 68,
};

const issuedAlertKeys = new Set<string>();

const containers: ContainerUnit[] = [
  {
    id: "CTR-01",
    name: "Container A",
    type: "Dry",
    status: "Optimal",
    fillPercent: 61,
    productType: "Maize",
    currentTempC: 17,
    currentHumidityPct: 57,
    currentOxygenPct: 20,
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-02",
    name: "Container B",
    type: "Cool",
    status: "Attention",
    fillPercent: 74,
    productType: "Potato",
    currentTempC: 7,
    currentHumidityPct: 90,
    currentOxygenPct: 18,
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    lastSync: "1 min ago",
  },
  {
    id: "CTR-03",
    name: "Container C",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 49,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 85,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "3 min ago",
  },
  {
    id: "CTR-04",
    name: "Container D",
    type: "Dry",
    status: "Optimal",
    fillPercent: 33,
    productType: "Rice",
    currentTempC: 16,
    currentHumidityPct: 55,
    currentOxygenPct: 19,
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    lastSync: "5 min ago",
  },
  {
    id: "CTR-05",
    name: "Container E",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 22,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 84,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "4 min ago",
  },
  {
    id: "CTR-06",
    name: "Container F",
    type: "Dry",
    status: "Optimal",
    fillPercent: 66,
    productType: "Beans",
    currentTempC: 18,
    currentHumidityPct: 51,
    currentOxygenPct: 19,
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-07",
    name: "Container G",
    type: "Cool",
    status: "Attention",
    fillPercent: 58,
    productType: "Potato",
    currentTempC: 7,
    currentHumidityPct: 88,
    currentOxygenPct: 18,
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    lastSync: "1 min ago",
  },
  {
    id: "CTR-08",
    name: "Container H",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 44,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 85,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "3 min ago",
  },
  {
    id: "CTR-09",
    name: "Container I",
    type: "Dry",
    status: "Optimal",
    fillPercent: 41,
    productType: "Rice",
    currentTempC: 16,
    currentHumidityPct: 56,
    currentOxygenPct: 19,
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-10",
    name: "Container J",
    type: "Cool",
    status: "Optimal",
    fillPercent: 36,
    productType: "Milk",
    currentTempC: 3,
    currentHumidityPct: 85,
    currentOxygenPct: 21,
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    lastSync: "1 min ago",
  },
  {
    id: "CTR-11",
    name: "Container K",
    type: "Dry",
    status: "Optimal",
    fillPercent: 73,
    productType: "Maize",
    currentTempC: 17,
    currentHumidityPct: 56,
    currentOxygenPct: 20,
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-12",
    name: "Container L",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 52,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 84,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "4 min ago",
  },
  {
    id: "CTR-13",
    name: "Container M",
    type: "Dry",
    status: "Optimal",
    fillPercent: 47,
    productType: "Beans",
    currentTempC: 18,
    currentHumidityPct: 52,
    currentOxygenPct: 19,
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    lastSync: "3 min ago",
  },
  {
    id: "CTR-14",
    name: "Container N",
    type: "Cool",
    status: "Attention",
    fillPercent: 61,
    productType: "Potato",
    currentTempC: 7,
    currentHumidityPct: 91,
    currentOxygenPct: 18,
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    lastSync: "1 min ago",
  },
  {
    id: "CTR-15",
    name: "Container O",
    type: "Dry",
    status: "Optimal",
    fillPercent: 39,
    productType: "Rice",
    currentTempC: 16,
    currentHumidityPct: 55,
    currentOxygenPct: 19,
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    lastSync: "5 min ago",
  },
  {
    id: "CTR-16",
    name: "Container P",
    type: "Dry",
    status: "Optimal",
    fillPercent: 55,
    productType: "Maize",
    currentTempC: 17,
    currentHumidityPct: 56,
    currentOxygenPct: 20,
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    lastSync: "3 min ago",
  },
  {
    id: "CTR-17",
    name: "Container Q",
    type: "Cool",
    status: "Optimal",
    fillPercent: 42,
    productType: "Milk",
    currentTempC: 3,
    currentHumidityPct: 85,
    currentOxygenPct: 21,
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-18",
    name: "Container R",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 27,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 86,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "4 min ago",
  },
  {
    id: "CTR-19",
    name: "Container S",
    type: "Dry",
    status: "Optimal",
    fillPercent: 63,
    productType: "Beans",
    currentTempC: 18,
    currentHumidityPct: 52,
    currentOxygenPct: 19,
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    lastSync: "3 min ago",
  },
  {
    id: "CTR-20",
    name: "Container T",
    type: "Cool",
    status: "Attention",
    fillPercent: 69,
    productType: "Potato",
    currentTempC: 7,
    currentHumidityPct: 90,
    currentOxygenPct: 18,
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    lastSync: "2 min ago",
  },
  {
    id: "CTR-9001",
    name: "Single Container 9001",
    type: "Cool",
    status: "Optimal",
    fillPercent: 42,
    productType: "Milk",
    currentTempC: 3,
    currentHumidityPct: 84,
    currentOxygenPct: 21,
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    lastSync: "Just now",
  },
  {
    id: "CTR-9002",
    name: "Single Container 9002",
    type: "Dry",
    status: "Optimal",
    fillPercent: 39,
    productType: "Beans",
    currentTempC: 18,
    currentHumidityPct: 52,
    currentOxygenPct: 19,
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    lastSync: "Just now",
  },
  {
    id: "CTR-9003",
    name: "Single Container 9003",
    type: "Dry",
    status: "Optimal",
    fillPercent: 35,
    productType: "Maize",
    currentTempC: 17,
    currentHumidityPct: 56,
    currentOxygenPct: 20,
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    lastSync: "Just now",
  },
  {
    id: "CTR-9004",
    name: "Single Container 9004",
    type: "Cool",
    status: "Optimal",
    fillPercent: 31,
    productType: "Milk",
    currentTempC: 3,
    currentHumidityPct: 85,
    currentOxygenPct: 21,
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    lastSync: "Just now",
  },
  {
    id: "CTR-9005",
    name: "Single Container 9005",
    type: "Dry",
    status: "Optimal",
    fillPercent: 46,
    productType: "Beans",
    currentTempC: 18,
    currentHumidityPct: 52,
    currentOxygenPct: 19,
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    lastSync: "Just now",
  },
  {
    id: "CTR-9006",
    name: "Single Container 9006",
    type: "Controlled Atmosphere",
    status: "Optimal",
    fillPercent: 28,
    productType: "Tomato",
    currentTempC: 13,
    currentHumidityPct: 86,
    currentOxygenPct: 18,
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    lastSync: "Just now",
  },
  {
    id: "CTR-9007",
    name: "Single Container 9007",
    type: "Cool",
    status: "Optimal",
    fillPercent: 37,
    productType: "Potato",
    currentTempC: 5,
    currentHumidityPct: 92,
    currentOxygenPct: 18,
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    lastSync: "Just now",
  },
  {
    id: "CTR-9008",
    name: "Single Container 9008",
    type: "Dry",
    status: "Optimal",
    fillPercent: 40,
    productType: "Rice",
    currentTempC: 16,
    currentHumidityPct: 55,
    currentOxygenPct: 19,
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    lastSync: "Just now",
  },
  {
    id: "CTR-9009",
    name: "Single Container 9009",
    type: "Dry",
    status: "Optimal",
    fillPercent: 52,
    productType: "Maize",
    currentTempC: 17,
    currentHumidityPct: 56,
    currentOxygenPct: 20,
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    lastSync: "Just now",
  },
  {
    id: "CTR-9010",
    name: "Single Container 9010",
    type: "Cool",
    status: "Optimal",
    fillPercent: 29,
    productType: "Milk",
    currentTempC: 3,
    currentHumidityPct: 85,
    currentOxygenPct: 21,
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    lastSync: "Just now",
  },
];

const batches: BatchRecord[] = [
  {
    id: "B-001",
    productName: "Maize",
    profile: "Dry Grain",
    containerId: "CTR-01",
    containerName: "Container A",
    enteredOn: "2026-02-20",
    expiryOn: "2026-11-07",
    targetTempC: 17,
    targetHumidityPct: 56,
    targetOxygenPct: 20,
    quantityKg: 850,
    status: "Good",
  },
  {
    id: "B-002",
    productName: "Potato",
    profile: "Cool Produce",
    containerId: "CTR-02",
    containerName: "Container B",
    enteredOn: "2026-02-10",
    expiryOn: "2026-05-16",
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    quantityKg: 460,
    status: "Watch",
  },
  {
    id: "B-003",
    productName: "Milk",
    profile: "Chilled Liquid",
    containerId: "CTR-9001",
    containerName: "Single Container 9001",
    enteredOn: "2026-03-01",
    expiryOn: "2026-03-11",
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    quantityKg: 200,
    status: "Good",
  },
  {
    id: "B-004",
    productName: "Beans",
    profile: "Dry Legume",
    containerId: "CTR-06",
    containerName: "Container F",
    enteredOn: "2026-02-28",
    expiryOn: "2026-10-26",
    targetTempC: 18,
    targetHumidityPct: 52,
    targetOxygenPct: 19,
    quantityKg: 540,
    status: "Good",
  },
  {
    id: "B-005",
    productName: "Tomato",
    profile: "Fresh Produce",
    containerId: "CTR-08",
    containerName: "Container H",
    enteredOn: "2026-03-02",
    expiryOn: "2026-04-01",
    targetTempC: 13,
    targetHumidityPct: 86,
    targetOxygenPct: 18,
    quantityKg: 280,
    status: "Good",
  },
  {
    id: "B-006",
    productName: "Rice",
    profile: "Dry Grain",
    containerId: "CTR-11",
    containerName: "Container K",
    enteredOn: "2026-02-14",
    expiryOn: "2027-01-09",
    targetTempC: 16,
    targetHumidityPct: 55,
    targetOxygenPct: 19,
    quantityKg: 920,
    status: "Good",
  },
  {
    id: "B-007",
    productName: "Potato",
    profile: "Cool Produce",
    containerId: "CTR-14",
    containerName: "Container N",
    enteredOn: "2026-02-25",
    expiryOn: "2026-05-31",
    targetTempC: 5,
    targetHumidityPct: 92,
    targetOxygenPct: 18,
    quantityKg: 430,
    status: "Watch",
  },
  {
    id: "B-008",
    productName: "Milk",
    profile: "Chilled Liquid",
    containerId: "CTR-9002",
    containerName: "Single Container 9002",
    enteredOn: "2026-03-03",
    expiryOn: "2026-03-13",
    targetTempC: 3,
    targetHumidityPct: 85,
    targetOxygenPct: 21,
    quantityKg: 160,
    status: "Good",
  },
];

const alerts: AlertRecord[] = [];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function shouldNotify(level: AlertLevel): boolean {
  return !notificationPreferences.criticalOnly || level === "Critical";
}

function getManagedContainerIds(): string[] {
  const account = getCurrentAccount();

  if (!account) {
    return [];
  }

  return account.managedContainers.map((item) => item.containerId);
}

function applyAccountContainerNaming(items: ContainerUnit[]): ContainerUnit[] {
  const account = getCurrentAccount();
  if (!account) {
    return items;
  }

  const nicknameMap = new Map(
    account.managedContainers.map((item) => [item.containerId, item.nickname]),
  );

  return items.map((container) => {
    const nickname = nicknameMap.get(container.id);
    if (!nickname) {
      return container;
    }

    return { ...container, name: nickname };
  });
}

export function createAlert(
  level: AlertLevel,
  message: string,
  key?: string,
): AlertRecord | null {
  if (key && issuedAlertKeys.has(key)) {
    return null;
  }

  if (key) {
    issuedAlertKeys.add(key);
  }

  const allowDelivery = shouldNotify(level);

  const newAlert: AlertRecord = {
    id: `AL-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    level,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    viaPush: allowDelivery && notificationPreferences.push,
    viaSms: allowDelivery && notificationPreferences.sms,
  };

  alerts.unshift(newAlert);
  return newAlert;
}

function seedAlertsIfNeeded() {
  if (alerts.length > 0) {
    return;
  }

  createAlert(
    "Warning",
    "Container B is +2°C above target for 18 minutes.",
    "seed-temp-drift",
  );
  createAlert(
    "Info",
    "Container C oxygen actuator calibration completed.",
    "seed-o2-calibration",
  );
  createAlert(
    "Critical",
    "Container B predicted spoilage risk reached 81% for potato batch.",
    "seed-risk",
  );
}

export function getSystemMode(): SystemMode {
  const account = getCurrentAccount();
  return account?.moduleModel === "single-container"
    ? "single-container"
    : "multi-container";
}

export function setSystemMode(_: SystemMode): void {
  createAlert("Info", "module model is locked to the registered setup type.");
}

export function getContainers(): ContainerUnit[] {
  return [...containers];
}

export function getManagedContainers(): ContainerUnit[] {
  const managedIds = getManagedContainerIds();
  const filtered = containers.filter((item) => managedIds.includes(item.id));
  return applyAccountContainerNaming(filtered);
}

export function getBatches(): BatchRecord[] {
  const managedIds = new Set(getManagedContainerIds());
  return batches.filter((item) => managedIds.has(item.containerId));
}

export function getBatchById(id: string): BatchRecord | null {
  const managedIds = new Set(getManagedContainerIds());
  return (
    batches.find(
      (item) => item.id === id && managedIds.has(item.containerId),
    ) ?? null
  );
}

export function getContainerById(id: string): ContainerUnit | null {
  const managed = getManagedContainers();
  return managed.find((item) => item.id === id) ?? null;
}

export function getAlerts(): AlertRecord[] {
  seedAlertsIfNeeded();
  return [...alerts];
}

export function getUnreadAlertCount(): number {
  seedAlertsIfNeeded();
  return alerts.filter((item) => !item.read).length;
}

export function markAllAlertsAsRead(): void {
  alerts.forEach((item) => {
    item.read = true;
  });
}

export function getNotificationPreferences(): NotificationPreferences {
  return { ...notificationPreferences };
}

export function updateNotificationPreferences(
  next: NotificationPreferences,
): void {
  notificationPreferences = { ...next };

  createAlert(
    "Info",
    `Notification preferences updated: push ${next.push ? "on" : "off"}, sms ${next.sms ? "on" : "off"}, critical-only ${next.criticalOnly ? "on" : "off"}.`,
  );
}

export function runContainerHealthCheck(): void {
  const activeContainers = getManagedContainers();

  activeContainers.forEach((container) => {
    const tempGap = Math.abs(container.currentTempC - container.targetTempC);
    const humidityGap = Math.abs(
      container.currentHumidityPct - container.targetHumidityPct,
    );

    if (tempGap >= 2) {
      createAlert(
        container.status === "Critical" ? "Critical" : "Warning",
        `${container.name} temperature drift is ${tempGap.toFixed(1)}°C from target.`,
        `temp-${container.id}`,
      );
    }

    if (humidityGap >= 6) {
      createAlert(
        "Warning",
        `${container.name} humidity drift is ${humidityGap.toFixed(0)}% from target.`,
        `humidity-${container.id}`,
      );
    }
  });
}

export function getPowerStatus(): PowerStatus {
  return { ...powerStatus };
}

export function runPowerHealthCheck(): void {
  if (powerStatus.batteryPct <= 15) {
    createAlert(
      "Critical",
      `Power battery is at ${powerStatus.batteryPct}%. Immediate recharge required.`,
      "power-battery-critical",
    );
    return;
  }

  if (powerStatus.batteryPct <= 30) {
    createAlert(
      "Warning",
      `Power battery is at ${powerStatus.batteryPct}%. Plan recharge soon.`,
      "power-battery-warning",
    );
  }
}

export function generateBatchDraft(
  productName: string,
  containerId: string,
): GeneratedBatchDraft {
  const container = containers.find((item) => item.id === containerId);

  if (!container) {
    throw new Error("Container not found.");
  }

  const profile = findBestProfile(productName);
  const now = new Date();

  const canonicalName = profile?.canonicalName ?? productName.trim();
  const expectedShelfLifeDays = profile?.expectedShelfLifeDays ?? 120;

  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + expectedShelfLifeDays);

  return {
    productName: canonicalName,
    profile: profile?.storageProfile ?? "General Storage",
    containerId: container.id,
    containerName: container.name,
    enteredOn: formatDate(now),
    expiryOn: formatDate(expiry),
    targetTempC: profile?.targetTempC ?? container.targetTempC,
    targetHumidityPct:
      profile?.targetHumidityPct ?? container.targetHumidityPct,
    targetOxygenPct: profile?.targetOxygenPct ?? container.targetOxygenPct,
    quantityKg: Math.round((120 + Math.random() * 700) * 10) / 10,
  };
}

export function addBatch(draft: GeneratedBatchDraft): BatchRecord {
  const newBatch: BatchRecord = {
    ...draft,
    id: `B-${Date.now()}`,
    status: "Good",
  };

  batches.unshift(newBatch);

  const container = containers.find((item) => item.id === draft.containerId);
  if (container) {
    container.productType = draft.productName;
    container.targetTempC = draft.targetTempC;
    container.targetHumidityPct = draft.targetHumidityPct;
    container.targetOxygenPct = draft.targetOxygenPct;
    container.status = "Optimal";
    container.fillPercent = Math.min(100, container.fillPercent + 8);
    container.lastSync = "Just now";
  }

  createAlert(
    "Info",
    `${draft.productName} batch assigned to ${draft.containerName} with AI profile ${draft.profile}.`,
  );
  return newBatch;
}
