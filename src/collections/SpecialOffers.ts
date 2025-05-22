import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const SpecialOffers: CollectionConfig = {
  slug: 'special-offers',
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
      label: 'Special Offer Title',
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
      name: 'totalPrice',
      type: 'number',
      label: 'Total Price',
    },
    {
      name: 'discount',
      type: 'number',
      label: 'Discount',
    },
    {
      name: 'discountedPrice',
      type: 'number',
      label: 'Price with Discount:',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      label: 'Products',
      hasMany: true,
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
      name: 'color',
      type: 'text',
      label: 'Color',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const response = await fetch('https://modulixo.com/api/revalidate', {
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
