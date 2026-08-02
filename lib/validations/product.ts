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
  productCode: z.string().trim().min(1, 'Product code is required').max(100).regex(/^[A-Za-z0-9._-]+$/, 'Product code contains invalid characters'),
  barcode: z.string().trim().optional().nullable(),
  costPrice: z.coerce.number().positive('Cost price must be greater than 0'),
  customerSellPrice: z.coerce.number().positive('Customer sell price must be greater than 0'),
  resellerPrice: z.coerce.number().positive('Reseller price must be greater than 0'),
  salePrice: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().positive('Sale price must be greater than 0').optional().nullable()),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional().nullable(),
  discountValue: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().nonnegative('Discount value cannot be negative').optional().nullable()),
  taxRate: z.preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().nonnegative('Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').optional().nullable()),
  couponCode: z.string().trim().optional().nullable(),
  attributes: z.array(productAttributeSchema).optional(),
  enableSize: z.boolean().default(false),
  availableSizes: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('ACTIVE'),
  thumbnailImage: z.string().trim().min(1, 'Thumbnail image is required'),
  productImages: z.array(z.string()).optional(),
  productVideos: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
}).superRefine((data, ctx) => {
  // Validate Discount rules
  if ((data.discountType && data.discountValue === null) || (!data.discountType && typeof data.discountValue === 'number' && data.discountValue > 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountValue'],
      message: 'Discount Type and Discount Value must be provided together',
    });
  }

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
