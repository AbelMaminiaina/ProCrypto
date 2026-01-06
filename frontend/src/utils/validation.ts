/**
 * Input validation utilities
 */

/**
 * Validate that a value is a positive number
 */
export const isPositiveNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Validate that a value is a non-negative number (including 0)
 */
export const isNonNegativeNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0 && isFinite(num);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize HTML string to prevent XSS
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Format number for input display
 */
export const formatNumberInput = (value: string): string => {
  // Remove non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
};

/**
 * Validate password strength
 * Returns { valid: boolean, message: string }
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  return { valid: true, message: 'Mot de passe valide' };
};

/**
 * Validate crypto quantity
 */
export const validateQuantity = (quantity: string | number): { valid: boolean; error?: string } => {
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;

  if (isNaN(num)) {
    return { valid: false, error: 'Veuillez entrer un nombre valide' };
  }

  if (num <= 0) {
    return { valid: false, error: 'La quantité doit être supérieure à 0' };
  }

  if (!isFinite(num)) {
    return { valid: false, error: 'La quantité est trop grande' };
  }

  // Maximum 8 decimal places for crypto
  const decimals = (num.toString().split('.')[1] || '').length;
  if (decimals > 8) {
    return { valid: false, error: 'Maximum 8 décimales autorisées' };
  }

  return { valid: true };
};

/**
 * Validate price
 */
export const validatePrice = (price: string | number): { valid: boolean; error?: string } => {
  const num = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(num)) {
    return { valid: false, error: 'Veuillez entrer un prix valide' };
  }

  if (num < 0) {
    return { valid: false, error: 'Le prix ne peut pas être négatif' };
  }

  if (!isFinite(num)) {
    return { valid: false, error: 'Le prix est trop grand' };
  }

  return { valid: true };
};
