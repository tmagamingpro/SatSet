import { validateLoginPayload } from "../validators/authValidator.js";
import { BaseService } from "./baseService.js";

class AuthService extends BaseService {
  login(payload) {
    const validationError = validateLoginPayload(payload);
    if (validationError) return validationError;
    const { email, password } = payload;

    const user = this.state.users.find((item) => item.email === email && item.password === password);
    if (!user) return this.fail(401, "Email atau password salah.");

    if (user.role === "penyedia" && !user.isVerified) {
      return this.fail(403, "Akun belum diverifikasi oleh admin.");
    }

    return this.ok(200, { user });
  }
}

const createAuthService = (deps) => new AuthService(deps);

export { createAuthService };
