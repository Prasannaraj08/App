export const toSafeMoney = (value) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    throw new Error('Monetary value is invalid.');
  }

  if (numeric < 0) {
    throw new Error('Monetary value cannot be negative.');
  }

  return Math.round((numeric + Number.EPSILON) * 100) / 100;
};

export const sanitizeQuantity = (value, { allowZero = false } = {}) => {
  const numeric = Number(value);

  if (!Number.isInteger(numeric) || !Number.isFinite(numeric)) {
    throw new Error('Quantity must be a positive integer.');
  }

  if (numeric === 0 && allowZero) {
    return 0;
  }

  if (numeric <= 0) {
    throw new Error('Quantity must be greater than 0.');
  }

  return numeric;
};

export const calculateCartTotals = (items, fees = {}) => {
  const normalizedItems = Array.isArray(items) ? items : [];
  const subtotal = normalizedItems.reduce((sum, item) => {
    const quantity = sanitizeQuantity(item?.quantity ?? 0);
    const price = toSafeMoney(item?.product?.price ?? 0);
    return toSafeMoney(sum + price * quantity);
  }, 0);

  const shipping = toSafeMoney(fees.shipping ?? 0);
  const tax = toSafeMoney(fees.tax ?? 0);
  const discount = toSafeMoney(fees.discount ?? 0);
  const itemCount = normalizedItems.reduce((sum, item) => sum + sanitizeQuantity(item?.quantity ?? 0), 0);
  const total = toSafeMoney(Math.max(0, subtotal + shipping + tax - discount));

  return {
    subtotal,
    shipping,
    tax,
    discount,
    itemCount,
    total,
  };
};
