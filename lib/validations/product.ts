import { z } from 'zod';

export const productAttributeSchema = z.object({
  name: z.string().trim().min(1, 'Attribute name is required').max(50),
  values: z.array(z.string().trim().min(1, 'Value cannot be empty').max(100)).min(1, 'At least one attribute value is required'),
});

export const productFormSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200, 'Title cannot exceed 200 characters'),
  shortDescription: z.string().trim().min(10, 'Short description must be at least 10 characters').max(500, 'Short description cannot exceed 500 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(20000, 'Description is too long'),
  categoryId: z.string().trim().min(1, 'Please select a category'),
  productCode: z
    .string()
    .trim()
    .min(1, 'Product code (SKU) is required')
    .max(100, 'Product code cannot exceed 100 characters')
    .transform((val) => val.toUpperCase())
    .refine(
      (val) => /^[A-Z]{3,}-[A-Z0-9]{4,20}$/.test(val),
      {
        message: 'Product code must follow PREFIX-SUFFIX format (e.g. MOB-EY4EM7OG, 3+ letter prefix, hyphen, 4-20 alphanumeric suffix)',
      }
    ),
  barcode: z.string().trim().optional().nullable(),
  costPrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number({ required_error: 'Cost price is required', invalid_type_error: 'Cost price is required' }).positive('Cost price must be greater than 0')),
  customerSellPrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number({ required_error: 'Customer sell price is required', invalid_type_error: 'Customer sell price is required' }).positive('Customer sell price must be greater than 0')),
  enableCustomerSpecialPrice: z.boolean().default(false),
  customerSpecialPrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().positive('Customer special price must be greater than 0').optional().nullable()),
  resellerPrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number({ required_error: 'Reseller sell price is required', invalid_type_error: 'Reseller sell price is required' }).positive('Reseller sell price must be greater than 0')),
  enableResellerSpecialPrice: z.boolean().default(false),
  resellerSpecialPrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().positive('Reseller special price must be greater than 0').optional().nullable()),
  salePrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().positive('Sale price must be greater than 0').optional().nullable()),
  specialSaleEnabled: z.boolean().default(false),
  discountEnabled: z.boolean().default(false),
  discountType: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : v), z.enum(['PERCENTAGE', 'FIXED']).optional().nullable().or(z.literal(''))),
  discountValue: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().nonnegative('Discount value cannot be negative').optional().nullable()),
  taxRate: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().nonnegative('Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').optional().nullable()),
  couponCode: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : String(v).trim()), z.string().optional().nullable().or(z.literal(''))),
  attributes: z.array(productAttributeSchema).optional(),
  enableSize: z.boolean().default(false),
  availableSizes: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('ACTIVE'),
  thumbnailImage: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Thumbnail image is required'),
  productImages: z.array(z.any()).optional(),
  productVideos: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
}).superRefine((data, ctx) => {
  // Validate Discount percentage rule only if discount value is explicitly supplied
  if (data.discountType === 'PERCENTAGE' && typeof data.discountValue === 'number' && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountValue'],
      message: 'Percentage discount cannot exceed 100%',
    });
  }

  // Validate Size rules
  if (data.enableSize && (!data.availableSizes || data.availableSizes.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['availableSizes'],
      message: 'Select or add at least one size when Size is enabled',
    });
  }
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

