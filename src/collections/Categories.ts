import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Allows public (unauthenticated) read access
    create: ({ req }) => req.user?.role === 'admin', // Only allow admins to create
    update: ({ req }) => req.user?.role === 'admin', // Only allow admins to update
    delete: ({ req }) => req.user?.role === 'admin', // Only allow admins to delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Category Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      hooks: {
        beforeChange: [
          async ({ data }) => {
            if (data?.title) {
              return slugify(data.title, { lower: true, strict: true })
            }
          },
        ],
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Category Subtitle',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Category Description',
      required: false,
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      required: false,
    },
    {
      name: 'seo_description',
      type: 'text',
      label: 'SEO Description',
      required: false,
    },
  ],
}
