/**
 * Format a number with commas (e.g., 1000 => "1,000")
 * @param {number} num - The number to format
 * @returns {string} The formatted number string
 */
export function formatWithCommas(num: Number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
