export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "anteenaeximp@gmail.com,divyanshtotla18@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && getAdminEmails().includes(email.toLowerCase()));
}
