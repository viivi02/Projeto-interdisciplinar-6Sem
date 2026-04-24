const USERS_STORAGE_KEY = "sleep-sanctuary-users";
const AUTH_FLAG_STORAGE_KEY = "sleep-sanctuary-is-authenticated";
const CURRENT_USER_STORAGE_KEY = "sleep-sanctuary-current-user";

function safeRead(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function safeWrite(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = safeRead(USERS_STORAGE_KEY, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  safeWrite(USERS_STORAGE_KEY, users);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function buildUserRecord(userData) {
  return {
    id: userData.id || `user-${Date.now()}`,
    name: String(userData.name || "").trim(),
    email: normalizeEmail(userData.email),
    password: String(userData.password || ""),
    birthDate: String(userData.birthDate || "").trim(),
    gender: String(userData.gender || "").trim(),
    profession: String(userData.profession || "").trim(),
    sleepGoal: String(userData.sleepGoal || "").trim(),
    weight: String(userData.weight || "").trim(),
    height: String(userData.height || "").trim()
  };
}

export function registerUser(userData) {
  const userRecord = buildUserRecord(userData);

  if (
    !userRecord.name ||
    !userRecord.email ||
    !userRecord.password ||
    !userRecord.birthDate ||
    !userRecord.gender ||
    !userRecord.profession ||
    !userRecord.sleepGoal
  ) {
    return { success: false, message: "Preencha todos os campos obrigatorios para concluir o cadastro." };
  }

  const users = getUsers();
  const existingUser = users.find((user) => user.email === userRecord.email);

  if (existingUser) {
    return { success: false, message: "Ja existe uma conta com esse e-mail." };
  }

  // Solucao provisoria para testes do front-end. Em producao, a senha deve ser enviada ao backend e nunca persistida assim.
  const nextUsers = [...users, userRecord];
  saveUsers(nextUsers);

  return {
    success: true,
    user: sanitizeUser(userRecord)
  };
}

export function loginUser(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();
  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === String(password || "")
  );

  if (!matchedUser) {
    return {
      success: false,
      message: "Nao encontramos uma conta com esse e-mail e senha. Confira os dados e tente novamente."
    };
  }

  const safeUser = sanitizeUser(matchedUser);
  safeWrite(AUTH_FLAG_STORAGE_KEY, true);
  safeWrite(CURRENT_USER_STORAGE_KEY, safeUser);

  return { success: true, user: safeUser };
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_FLAG_STORAGE_KEY);
  window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function getCurrentUser() {
  return safeRead(CURRENT_USER_STORAGE_KEY, null);
}

export function isAuthenticated() {
  return safeRead(AUTH_FLAG_STORAGE_KEY, false) === true;
}

export function updateCurrentUser(userData) {
  const currentUser = getCurrentUser();

  if (!currentUser?.email) {
    return null;
  }

  const users = getUsers();
  const userIndex = users.findIndex((user) => user.email === currentUser.email);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = {
    ...users[userIndex],
    ...userData,
    email: normalizeEmail(userData.email || currentUser.email)
  };

  const nextUsers = [...users];
  nextUsers[userIndex] = updatedUser;
  saveUsers(nextUsers);

  const safeUser = sanitizeUser(updatedUser);
  safeWrite(CURRENT_USER_STORAGE_KEY, safeUser);

  return safeUser;
}
