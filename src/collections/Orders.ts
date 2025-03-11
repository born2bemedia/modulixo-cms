import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
  },
  access: {
    //read: ({ req }) => !!req.user, // Allow logged-in users to read orders
    read: () => true,
    create: () => true, // Allow order creation
    update: ({ req }) => req.user?.role === 'admin', // Only admin can update orders
    delete: ({ req }) => req.user?.role === 'admin', // Only admin can delete orders
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Order Number',
      unique: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Ordered Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total Amount',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'text',
      label: 'Payment method',
      required: false,
    },
    {
      name: 'orderNotes',
      type: 'text',
      label: 'Order Notes',
      required: false,
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'address1', type: 'text', required: false },
        { name: 'address2', type: 'text', required: false },
        { name: 'city', type: 'text', required: false },
        { name: 'state', type: 'text', required: false },
        { name: 'zip', type: 'text', required: false },
        { name: 'country', type: 'text', required: false },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'invoice',
      type: 'upload',
      relationTo: 'media',
      label: 'Invoice file',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'files',
      type: 'upload',
      relationTo: 'media',
      label: 'Files',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const result = await req.payload.find({
            collection: 'orders',
            limit: 1,
            sort: '-createdAt',
          })

          const lastOrderNumber = result.docs.length
            ? parseInt((result.docs[0].orderNumber ?? 'ORD-100').replace('ORD-', ''), 10)
            : 100

          data.orderNumber = `ORD-${lastOrderNumber + 1}`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        console.log('doc', doc)
        if (doc.status === 'completed' && doc.files) {
          let recipientEmail: string | undefined
          if (doc.user) {
            const user = await req.payload.findByID({
              collection: 'users',
              id: doc.user,
            })
            recipientEmail = user?.email
          }
          if (!recipientEmail) {
            recipientEmail = process.env.DEFAULT_ORDER_NOTIFICATION_EMAIL
          }

          const fileDoc = await req.payload.findByID({
            collection: 'media',
            id: doc.files,
          })
          const fileUrl = fileDoc?.url || '#'

          const htmlContent = `<table width="640"
    style="border-collapse: collapse; margin: 0 auto;  font-family: Roboto, sans-serif;border: none;background: #141316;">
    <thead style="border: none;">
        <tr style="border: none;">
            <td style="border: none;">
                <img style="width: 100%;display: block;" src="https://modulixo.com/images/email_header.png"
                    alt="Header" />
            </td>
        </tr>
    </thead>
    <tbody style="border: none;">
        <tr style="border: none;">
            <td style="padding: 40px 40px 0 40px;background: #141316;border: none;">
                <h2 style="color: #FFF;
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin-bottom: 40px;">Your Modulixo Order is Ready! - #${doc.orderNumber}</h2>
                <p style="color: #808080;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;">Dear customer,</p>
                <p style="color: #808080;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;">
                    Thank you for your purchase from Modulixo! Your order has been successfully processed, and your
                    files are now ready for download.</p>
                <h3 style="color: #FFF;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin: 40px 0 20px 0;">
                    Download Your Files Here:
                </h3>
                <a href="https://cms.modulixo.com${fileUrl}" style="color: #0C0B0E;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                padding: 16px 24px;
                border-radius: 16px;
                background: #FFF;
                display: block;
                text-decoration: none;
                width: 150px;
                text-align: center;">
                    Download
                </a>
            </td>
        </tr>
        <tr style="border: none;">
            <td style="padding: 40px 40px 40px 40px;background: #141316;border: none;">

                <p style="color: #808080;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;">
                    If you have trouble accessing your files or need further assistance, don't hesitate to contact us -
                    we're here to help!<br><br>

                    We appreciate your trust in Modulixo and look forward to working with you again.</p>
                <h3 style="color: #FFF;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin: 40px 0 20px 0;">
                    Best regards,<br>
                    The Modulixo Team
                </h3>
            </td>
        </tr>
    </tbody>
    <tfoot
        style="background-color: #0B0B0E; background-image: url(https://modulixo.com/images/email_footer.png);background-position: center right; background-size: cover;">
        <tr>
            <td style="padding: 50px 40px;">
                <table>
                    <tr>
                        <td style="width: 100px; padding: 0 8px;vertical-align: baseline;">
                            <p style="color: #808080;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;">Phone</p>
                            <p style="margin: 0;">
                                <a href="tel: +48573589252" style="color: #FFF;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;"> +48573589252</a>
                            </p>
                        </td>
                        <td style="width: 100px; padding: 0 8px;vertical-align: baseline;">
                            <p style="color: #808080;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;">Email</p>
                            <p style="margin: 0;">
                                <a href="mailto:info@modulixo.com" style="color: #FFF;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;">info@modulixo.com</a>
                            </p>
                        </td>


                    </tr>
                </table>
            </td>
        </tr>
    </tfoot>
</table>`

          try {
            await req.payload.sendEmail({
              to: recipientEmail,
              subject: 'Order Completed',
              html: htmlContent,
            })
          } catch (error) {
            console.error('Error sending order completed email:', error)
          }
        }
      },
    ],
  },
}

export default Orders
