export const APP_CONFIG = {
  name: 'SuperTrack',
  version: '1.0.0',
  country: 'AU',
  currency: 'AUD',
  currencySymbol: '$',
  taxYear: '2024-25',
  superRate: 0.115, // 11.5% SGC rate
  medicareLevy: 0.02,
  gstRate: 0.10,
  medicareThreshold: 26000,
};

// Australian Tax Brackets 2024-25
export const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 },
];

export const LMITO_OFFSET = {
  // Low Income Tax Offset
  threshold1: 37500,
  threshold2: 45000,
  threshold3: 66667,
  max: 700,
};

export const EXPENSE_CATEGORIES = [
  { id: 'vehicle', label: 'Vehicle & Travel', icon: 'directions-car', color: '#4A90E2' },
  { id: 'equipment', label: 'Tools & Equipment', icon: 'build', color: '#A78BFA' },
  { id: 'home_office', label: 'Home Office', icon: 'home', color: '#00C4B4' },
  { id: 'phone', label: 'Phone & Internet', icon: 'phone-android', color: '#F472B6' },
  { id: 'education', label: 'Education & Training', icon: 'school', color: '#FFB347' },
  { id: 'insurance', label: 'Insurance', icon: 'security', color: '#00C853' },
  { id: 'software', label: 'Software & Apps', icon: 'computer', color: '#FF6B6B' },
  { id: 'other', label: 'Other Business', icon: 'business', color: '#8FACC8' },
];

export const INCOME_CATEGORIES = [
  { id: 'contract', label: 'Contract/Freelance', icon: 'work' },
  { id: 'rideshare', label: 'Rideshare (Uber/Ola)', icon: 'directions-car' },
  { id: 'delivery', label: 'Delivery Services', icon: 'delivery-dining' },
  { id: 'consulting', label: 'Consulting', icon: 'business-center' },
  { id: 'trade', label: 'Trade / Labour', icon: 'build' },
  { id: 'other', label: 'Other Income', icon: 'attach-money' },
];
