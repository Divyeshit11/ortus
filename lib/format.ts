export function formatPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (currencyCode === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}
