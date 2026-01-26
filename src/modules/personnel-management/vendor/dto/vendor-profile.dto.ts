export interface VendorProfileDto {
  id: number;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shopName: string;
  shopSlug: string;
  shopDescription?: string;
  businessEmail?: string;
  businessPhone?: string;
  image?: string;
  status: string;
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  ratings?: {
    averageRating: number;
    totalReviews: number;
  };
  joinedAt: Date;
}
