class BaseService {
  constructor(deps) {
    this.deps = deps;
  }

  get state() {
    return this.deps.state;
  }

  nowIso() {
    return this.deps.nowIso();
  }

  createId() {
    return this.deps.createId();
  }

  ok(status, body) {
    return { status, body };
  }

  fail(status, message) {
    return { status, body: { message } };
  }
}

export { BaseService };
