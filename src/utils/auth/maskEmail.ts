export function maskEmail(email: string) {
  if (!email) return "";

  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  if (local.length <= 3) {
    return `${local}****@${domain}`;
  }

  return `${local.slice(0, 3)}****@${domain}`;
}
