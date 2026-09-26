/**
 * Authoritative User Session & Authentication Fixtures for Dijimoon Storefront Testing
 * Derived from reverse-engineered AuthService specs and COMPREHENSIVE_REPORT.md
 */

export interface AddressFixture {
  id: string | number;
  title: string;
  fullAddress: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
}

export interface UserProfileFixture {
  id: string | number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  walletBalance: number; // in Toman
  orderCount: number;
}

export const FIXTURE_USER: UserProfileFixture = {
  id: 'usr_882103',
  phoneNumber: '09123456789',
  firstName: 'امیر',
  lastName: 'حیدری',
  walletBalance: 2500000,
  orderCount: 4,
};

export const FIXTURE_ADDRESSES: AddressFixture[] = [
  {
    id: 'addr_1',
    title: 'منزل تهران',
    fullAddress: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه نگار، پلاک ۱۲، واحد ۴',
    postalCode: '۱۹۶۹۷۶۳۱۱۴',
    receiverName: 'امیر حیدری',
    receiverPhone: '09123456789',
    isDefault: true,
  },
  {
    id: 'addr_2',
    title: 'دفتر کار',
    fullAddress: 'تهران، سعادت‌آباد، خیابان سرو غربی، برج سرو، طبقه پنجم، واحد ۲۰۲',
    postalCode: '۱۹۹۸۸۸۱۱۲۲',
    receiverName: 'امیر حیدری',
    receiverPhone: '09123456789',
    isDefault: false,
  },
];

export const VALID_PHONE_NUMBERS = [
  '09123456789',
  '09351234567',
  '09029876543',
  '09901112233',
  '09198765432',
];

export const INVALID_PHONE_NUMBERS = [
  '08123456789', // Invalid prefix 08
  '07123456789', // Invalid prefix 07
  '02188776655', // Landline prefix
  '0912345678',  // 10 digits (too short)
  '091234567890', // 12 digits (too long)
  '0912345678a', // Alphanumeric
  '',            // Empty
  '0912 345 6789', // Unsanitized spaces
];
