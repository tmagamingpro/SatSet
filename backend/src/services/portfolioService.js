const createPortfolioService = (deps) => {
  const { state, createId, nowIso } = deps;

  const create = (payload) => {
    const data = payload ?? {};
    const providerId = Number(data.providerId);

    if (!providerId || !data.title || !data.description) {
      return {
        status: 400,
        body: { message: "providerId, title, dan description wajib diisi." },
      };
    }

    const provider = state.users.find((user) => user.id === providerId && user.role === "penyedia");
    if (!provider) {
      return { status: 404, body: { message: "Penyedia jasa tidak ditemukan." } };
    }

    if (!data.image || typeof data.image !== "string") {
      return { status: 400, body: { message: "Gambar portofolio wajib diisi." } };
    }

    const portfolioItem = {
      id: createId(),
      providerId,
      title: data.title.trim(),
      description: data.description.trim(),
      image: data.image,
      beforeAfter: Boolean(data.beforeAfter),
      createdAt: nowIso(),
    };

    state.portfolioItems.push(portfolioItem);
    return { status: 201, body: { portfolioItem } };
  };

  return {
    create,
  };
};

export { createPortfolioService };
