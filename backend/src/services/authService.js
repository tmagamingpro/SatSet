import { validateLoginPayload } from "../validators/authValidator.js";

const createAuthService = (deps) => {
  const { state } = deps;

  const login = (payload) => {
    const validationError = validateLoginPayload(payload);
    if (validationError) return validationError;
    const { email, password } = payload;

    const user = state.users.find((item) => item.email === email && item.password === password);
    if (!user) {
      return { status: 401, body: { message: "Email atau password salah." } };
    }

    if (user.role === "penyedia" && !user.isVerified) {
      return { status: 403, body: { message: "Akun belum diverifikasi oleh admin." } };
    }

    return { status: 200, body: { user } };
  };

  return { login };
};

export { createAuthService };
