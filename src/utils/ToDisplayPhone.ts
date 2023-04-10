/**
 * Formats a phone number for display.
 * @param phoneNumber the phone number to format
 * @returns a formatted phone number
 */
export function ToDisplayPhone (phoneNumber: string): string {
  // filter only numbers from the input
  let cleaned = ('' + phoneNumber).replace(/\D/g, '')

  // check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }

  // couldn't format -- just return original phone number
  return phoneNumber
}
