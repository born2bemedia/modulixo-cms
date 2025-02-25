import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Products: CollectionConfig = {
  slug: 'products',
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
      label: 'Small cover',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'big_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Big cover',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      label: 'Preview video',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Image Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Gallery Image',
        },
      ],
    },
    {
      name: 'files',
      type: 'array',
      label: 'Files',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'filesurl',
      type: 'array',
      label: 'Files bu url(for large files)',
      fields: [
        {
          name: 'filename',
          type: 'text',
          label: 'File name',
          required: false,
        },
        {
          name: 'fileurl',
          type: 'text',
          label: 'File URL',
          required: false,
        },
      ],
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
              tags: ['products'],
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
