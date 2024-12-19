export const generatePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = "!@#$%^&*()_+[]{}|;:',.<>?";
  const numbers = '0123456789';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';

  const getRandomChars = (chars: string, count: number) =>
    Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  const upperCasePart = getRandomChars(uppercase, 3);
  const symbolPart = getRandomChars(symbols, 3);
  const numberPart = getRandomChars(numbers, 3);
  const lowerCasePart = getRandomChars(lowercase, 3);

  // Combine and shuffle the password
  const password = upperCasePart + symbolPart + numberPart + lowerCasePart;
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};
