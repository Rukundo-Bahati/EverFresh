export type moduleModel = "single-container" | "control-center";

export type ManagedContainerLink = {
  containerId: string;
  nickname?: string;
};

export type Account = {
  id: string;
  companyName: string;
  moduleModel: moduleModel;
  setupId: string;
  role: "Owner" | "Operator";
  managedContainers: ManagedContainerLink[];
};

type AdminSingleContainer = {
  containerId: string;
  accessCode: string;
};

type AdminControlSystem = {
  controlId: string;
  accessCode: string;
  eligibleContainerIds: string[];
};

const adminSingleContainers: AdminSingleContainer[] = [
  { containerId: "CTR-9001", accessCode: "3901" },
  { containerId: "CTR-9002", accessCode: "3902" },
  { containerId: "CTR-9003", accessCode: "3903" },
  { containerId: "CTR-9004", accessCode: "3904" },
  { containerId: "CTR-9005", accessCode: "3905" },
  { containerId: "CTR-9006", accessCode: "3906" },
  { containerId: "CTR-9007", accessCode: "3907" },
  { containerId: "CTR-9008", accessCode: "3908" },
  { containerId: "CTR-9009", accessCode: "3909" },
  { containerId: "CTR-9010", accessCode: "3910" },
];

const adminControlSystems: AdminControlSystem[] = [
  {
    controlId: "CTRL-1001",
    accessCode: "123456",
    eligibleContainerIds: ["CTR-01", "CTR-02", "CTR-03", "CTR-04", "CTR-05"],
  },
  {
    controlId: "CTRL-1002",
    accessCode: "223456",
    eligibleContainerIds: ["CTR-06", "CTR-07", "CTR-08", "CTR-09", "CTR-10"],
  },
  {
    controlId: "CTRL-1003",
    accessCode: "323456",
    eligibleContainerIds: ["CTR-11", "CTR-12", "CTR-13", "CTR-14", "CTR-15"],
  },
  {
    controlId: "CTRL-1004",
    accessCode: "423456",
    eligibleContainerIds: ["CTR-16", "CTR-17", "CTR-18", "CTR-19", "CTR-20"],
  },
  {
    controlId: "CTRL-1005",
    accessCode: "523456",
    eligibleContainerIds: ["CTR-03", "CTR-07", "CTR-11", "CTR-15", "CTR-19"],
  },
];

let accounts: Account[] = [
  {
    id: "acc-1",
    companyName: "Client-1001",
    moduleModel: "control-center",
    setupId: "CTRL-1001",
    role: "Owner",
    managedContainers: [
      { containerId: "CTR-01", nickname: "Container A" },
      { containerId: "CTR-02", nickname: "Container B" },
      { containerId: "CTR-03", nickname: "Container C" },
    ],
  },
  {
    id: "acc-2",
    companyName: "Client-9001",
    moduleModel: "single-container",
    setupId: "CTR-9001",
    role: "Owner",
    managedContainers: [{ containerId: "CTR-9001", nickname: "Milk Pod 1" }],
  },
  {
    id: "acc-3",
    companyName: "Client-9002",
    moduleModel: "single-container",
    setupId: "CTR-9002",
    role: "Owner",
    managedContainers: [{ containerId: "CTR-9002", nickname: "Dry Store 2" }],
  },
  {
    id: "acc-4",
    companyName: "Client-1002",
    moduleModel: "control-center",
    setupId: "CTRL-1002",
    role: "Owner",
    managedContainers: [
      { containerId: "CTR-06", nickname: "North-01" },
      { containerId: "CTR-07", nickname: "North-02" },
      { containerId: "CTR-08", nickname: "North-03" },
    ],
  },
  {
    id: "acc-5",
    companyName: "Client-1003",
    moduleModel: "control-center",
    setupId: "CTRL-1003",
    role: "Owner",
    managedContainers: [
      { containerId: "CTR-11", nickname: "East-01" },
      { containerId: "CTR-12", nickname: "East-02" },
      { containerId: "CTR-13", nickname: "East-03" },
      { containerId: "CTR-14", nickname: "East-04" },
    ],
  },
];

let currentAccountId: string | null = null;

let pendingLogin: { setupId: string; moduleModel: moduleModel } | null = null;
let pendingRegistration: {
  setupId: string;
  moduleModel: moduleModel;
  containers: ManagedContainerLink[];
} | null = null;

function normalizeId(id: string): string {
  return id.trim().toUpperCase();
}

function isContainerIdFormat(id: string): boolean {
  return /^CTR-\d{2,4}$/.test(id);
}

function isControlCenterIdFormat(id: string): boolean {
  return /^CTRL-\d{4}$/.test(id);
}

function generateCompanyName(setupId: string): string {
  const suffix = setupId.replace(/[^A-Z0-9]/g, "").slice(-6);
  return `Client-${suffix || Date.now().toString().slice(-4)}`;
}

export function isAuthenticated(): boolean {
  return currentAccountId !== null;
}

export function getCurrentAccount(): Account | null {
  if (!currentAccountId) {
    return null;
  }

  return accounts.find((item) => item.id === currentAccountId) ?? null;
}

export function beginLogin(
  setupIdInput: string,
): { ok: true; moduleModel: moduleModel } | { ok: false; message: string } {
  const setupId = normalizeId(setupIdInput);

  if (!isContainerIdFormat(setupId) && !isControlCenterIdFormat(setupId)) {
    return {
      ok: false,
      message:
        "Invalid ID format. Use CTR-xxxx for containers or CTRL-xxxx for control centers.",
    };
  }

  const account = accounts.find((item) => item.setupId === setupId);
  if (!account) {
    const existsInAdmin =
      adminSingleContainers.some((item) => item.containerId === setupId) ||
      adminControlSystems.some((item) => item.controlId === setupId);

    if (existsInAdmin) {
      return { ok: false, message: "Setup found but not registered." };
    }

    return { ok: false, message: "Setup ID not found." };
  }

  pendingLogin = { setupId, moduleModel: account.moduleModel };
  return { ok: true, moduleModel: account.moduleModel };
}

export function getPendingLogin() {
  return pendingLogin;
}

export function completeLogin(
  accessCodeInput: string,
): { ok: true } | { ok: false; message: string } {
  if (!pendingLogin) {
    return { ok: false, message: "Setup check is required first." };
  }

  const accessCode = accessCodeInput.trim();

  if (pendingLogin.moduleModel === "single-container") {
    const adminRecord = adminSingleContainers.find(
      (item) => item.containerId === pendingLogin!.setupId,
    );
    if (!adminRecord || adminRecord.accessCode !== accessCode) {
      return { ok: false, message: "Invalid access code for this container." };
    }
  } else {
    const adminRecord = adminControlSystems.find(
      (item) => item.controlId === pendingLogin!.setupId,
    );
    if (!adminRecord || adminRecord.accessCode !== accessCode) {
      return {
        ok: false,
        message: "Invalid access code for this control center.",
      };
    }
  }

  const account = accounts.find(
    (item) => item.setupId === pendingLogin!.setupId,
  );
  if (!account) {
    return { ok: false, message: "Registered setup not found." };
  }

  currentAccountId = account.id;
  pendingLogin = null;
  return { ok: true };
}

export function clearPendingLogin(): void {
  pendingLogin = null;
}

export function beginRegistration(
  moduleModel: moduleModel,
  setupIdInput: string,
): { ok: true } | { ok: false; message: string } {
  const setupId = normalizeId(setupIdInput);

  if (accounts.some((item) => item.setupId === setupId)) {
    return { ok: false, message: "This setup is already registered." };
  }

  if (moduleModel === "single-container") {
    if (!isContainerIdFormat(setupId)) {
      return {
        ok: false,
        message: "Invalid container ID format. Expected CTR-xxxx.",
      };
    }

    const container = adminSingleContainers.find(
      (item) => item.containerId === setupId,
    );
    if (!container) {
      return { ok: false, message: "Container ID not found." };
    }

    pendingRegistration = {
      setupId,
      moduleModel,
      containers: [{ containerId: setupId }],
    };
    return { ok: true };
  }

  if (!isControlCenterIdFormat(setupId)) {
    return {
      ok: false,
      message: "Invalid control center ID format. Expected CTRL-xxxx.",
    };
  }

  const control = adminControlSystems.find(
    (item) => item.controlId === setupId,
  );
  if (!control) {
    return { ok: false, message: "Control Center ID not found." };
  }

  pendingRegistration = { setupId, moduleModel, containers: [] };
  return { ok: true };
}

export function getPendingRegistration() {
  return pendingRegistration;
}

export function addRegistrationContainer(
  containerIdInput: string,
  nicknameInput?: string,
): { ok: true } | { ok: false; message: string } {
  if (
    !pendingRegistration ||
    pendingRegistration.moduleModel !== "control-center"
  ) {
    return {
      ok: false,
      message: "Control-center registration not initialized.",
    };
  }

  const containerId = normalizeId(containerIdInput);
  if (!isContainerIdFormat(containerId)) {
    return {
      ok: false,
      message: "Invalid container ID format. Expected CTR-xxxx.",
    };
  }

  const control = adminControlSystems.find(
    (item) => item.controlId === pendingRegistration!.setupId,
  );
  if (!control) {
    return { ok: false, message: "Control center not found." };
  }

  if (!control.eligibleContainerIds.includes(containerId)) {
    return {
      ok: false,
      message: "Container ID not found for this control center.",
    };
  }

  if (
    pendingRegistration.containers.some(
      (item) => item.containerId === containerId,
    )
  ) {
    return { ok: false, message: "Container already added." };
  }

  pendingRegistration.containers.push({
    containerId,
    nickname: nicknameInput?.trim() || undefined,
  });

  return { ok: true };
}

export function removeRegistrationContainer(containerIdInput: string): void {
  if (!pendingRegistration) {
    return;
  }

  const containerId = normalizeId(containerIdInput);
  pendingRegistration.containers = pendingRegistration.containers.filter(
    (item) => item.containerId !== containerId,
  );
}

export function completeRegistration(
  accessCodeInput: string,
): { ok: true } | { ok: false; message: string } {
  if (!pendingRegistration) {
    return { ok: false, message: "Setup check is required first." };
  }

  const accessCode = accessCodeInput.trim();

  if (pendingRegistration.moduleModel === "single-container") {
    const adminRecord = adminSingleContainers.find(
      (item) => item.containerId === pendingRegistration!.setupId,
    );
    if (!adminRecord || adminRecord.accessCode !== accessCode) {
      return {
        ok: false,
        message: "Access code does not match records for this container.",
      };
    }
  } else {
    const adminRecord = adminControlSystems.find(
      (item) => item.controlId === pendingRegistration!.setupId,
    );
    if (!adminRecord || adminRecord.accessCode !== accessCode) {
      return {
        ok: false,
        message: "Access code does not match records for this control center.",
      };
    }

    if (pendingRegistration.containers.length === 0) {
      return {
        ok: false,
        message: "Add at least one container before saving.",
      };
    }
  }

  const newAccount: Account = {
    id: `acc-${Date.now()}`,
    companyName: generateCompanyName(pendingRegistration.setupId),
    moduleModel: pendingRegistration.moduleModel,
    setupId: pendingRegistration.setupId,
    role: "Owner",
    managedContainers: [...pendingRegistration.containers],
  };

  accounts.unshift(newAccount);
  currentAccountId = newAccount.id;
  pendingRegistration = null;
  return { ok: true };
}

export function clearPendingRegistration(): void {
  pendingRegistration = null;
}

export function logout(): void {
  currentAccountId = null;
  pendingLogin = null;
  pendingRegistration = null;
}
