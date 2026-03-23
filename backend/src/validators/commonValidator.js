const hasValue = (value) => value !== undefined && value !== null && value !== "";

const validateRequiredFields = (payload, fields, options = {}) => {
  const data = payload ?? {};
  const emptyAsMissing = options.emptyAsMissing ?? true;
  const missingField = fields.find((field) => {
    const value = data[field];
    if (emptyAsMissing) return !hasValue(value);
    return value === undefined || value === null;
  });

  if (!missingField) return null;
  return { message: `${missingField} wajib diisi.` };
};

export { hasValue, validateRequiredFields };
