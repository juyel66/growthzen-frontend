export const formatMoney = (amount: number | null | undefined): string => {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return '৳0.00';
  }
  const numericAmount = typeof amount === 'number' ? amount : Number(amount);
  return `৳${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
