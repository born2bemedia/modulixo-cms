import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Ideas: CollectionConfig = {
  slug: 'ideas',
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
      label: 'Product Title',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'text',
      label: 'Excerpt',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
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
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const response = await fetch('https://3dellium.com/api/revalidate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tags: ['ideas'],
            }),
          })

          if (!response.ok) {
            console.error('Cache revalidation failed:', response.statusText)
          } else {
            console.log('Cache revalidation triggered successfully.')
          }
        } catch (error) {
          console.error('Error triggering cache revalidation:', error)
        }
      },
    ],
  },
}
