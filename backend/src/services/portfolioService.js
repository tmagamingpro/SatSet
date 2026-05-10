import { BaseService } from "./baseService.js";

class PortfolioService extends BaseService {
  create(payload) {
    const data = payload ?? {};
    const providerId = Number(data.providerId);

    if (!providerId || !data.title || !data.description) {
      return this.fail(400, "providerId, title, dan description wajib diisi.");
    }

    const provider = this.state.users.find((user) => user.id === providerId && user.role === "penyedia");
    if (!provider) {
      return this.fail(404, "Penyedia jasa tidak ditemukan.");
    }

    if (!data.image || typeof data.image !== "string") {
      return this.fail(400, "Gambar portofolio wajib diisi.");
    }

    const portfolioItem = {
      id: this.createId(),
      providerId,
      title: data.title.trim(),
      description: data.description.trim(),
      image: data.image,
      beforeAfter: Boolean(data.beforeAfter),
      createdAt: this.nowIso(),
    };

    this.state.portfolioItems.push(portfolioItem);
    return this.ok(201, { portfolioItem });
  }
}

const createPortfolioService = (deps) => new PortfolioService(deps);

export { createPortfolioService };
