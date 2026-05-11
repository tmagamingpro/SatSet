const sendServiceResult = async (set, resultPromise) => {
  const result = await resultPromise;
  set.status = result.status;
  return result.body;
};

export { sendServiceResult };
