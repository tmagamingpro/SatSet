const sendServiceResult = (set, result) => {
  set.status = result.status;
  return result.body;
};

export { sendServiceResult };
