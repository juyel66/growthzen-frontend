import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(100, 'Category name cannot exceed 100 characters'),
  slug: z.string().trim().min(2, 'Slug must be at least 2 characters').max(120, 'Slug cannot exceed 120 characters').optional(),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional().nullable(),
  image: z.string().trim().max(2048, 'Image URL too long').optional().nullable(),
  parentCategoryId: z.string().trim().optional().nullable(),
  discountPercentage: z.coerce.number().min(0, 'Discount percentage cannot be less than 0').max(100, 'Discount percentage cannot exceed 100').default(0),
  discountEnabled: z.boolean().default(false),
  sortOrder: z.coerce.number().int('Sort order must be an integer').min(0, 'Sort order cannot be negative').default(0),
  showOnHomepage: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  metaTitle: z.string().trim().max(200, 'Meta title cannot exceed 200 characters').optional().nullable(),
  metaDescription: z.string().trim().max(500, 'Meta description cannot exceed 500 characters').optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

