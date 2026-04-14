export const formatToRupiah = (amount: number, currency: string = 'IDR') => {
  // Ensure input is a valid number
  if (isNaN(amount)) {
    console.error("Invalid input: The input should be a valid number.");
    return ""; // Or throw an error as appropriate
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
