const nowIso = () => new Date().toISOString();
const createId = () => Date.now() + Math.floor(Math.random() * 1000);

const toRoleLabel = (role = "") => {
  if (role === "penyedia") return "Penyedia Jasa";
  if (role === "pencari") return "Pencari Jasa";
  return "Aplikasi";
};

export { nowIso, createId, toRoleLabel };
