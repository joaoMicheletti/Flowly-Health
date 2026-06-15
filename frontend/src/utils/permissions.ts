export function getCurrentUser() {
  return JSON.parse(
    localStorage.getItem(
      '@flowly:user',
    ) || '{}',
  );
}

export function isAdmin() {
  return (
    getCurrentUser().role ===
    'ADMIN'
  );
}

export function isDoctor() {
  return (
    getCurrentUser().role ===
    'DOCTOR'
  );
}

export function isReceptionist() {
  return (
    getCurrentUser().role ===
    'RECEPTIONIST'
  );
}