import type { CollectionConfig, PayloadRequest } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args?: { token?: string }) => {
        const token = args?.token
        if (!token) {
          return `<p>Error: No reset token provided.</p>`
        }
        return `<table width="640" style="border-collapse: collapse; margin: 0 auto;  font-family: Roboto, sans-serif;">
    <thead>
        <tr>
            <td>
                <img style="width: 100%" src="https://3dellium.com/images/email_header.png" alt="Header" />
            </td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 8px;border-radius: 16px;background: #EFF3F0;">
                <table style="width: 100%;">
                    <td style="padding: 36px; color:#0A0A0A;border-radius: 16px;background: #D4DDD7;">
                        <h2 style="text-align: left; font-size: 20px;">Dear user,</h2>
                        <p style="font-size: 16px; line-height: 19px;">
                            We received a request to reset your password. Click the link below to create a new one:</p>

                        <p style="margin: 24px 0;">
                          <a href="${process.env.WEB_FRONT_URL}/set-password?token=${token}"
                            style="color: #FFF;
                            text-align: center;
                            font-size: 20px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: 34px;
                            padding: 10px 24px;
                            background: #2B2B2B;
                            border-radius:40px;
                            text-decoration: none;">
                            Reset Password
                        </a>
                        </p>

                        <p style="font-size: 16px; line-height: 19px;">
                            If you didn’t request this, you can ignore this email. Your current password will remain
                            unchanged.
                        </p>

                        <p style="font-size: 16px; line-height: 19px;">For any questions, feel free to contact us.</p>

                        <p style="font-size: 16px; line-height: 19px; font-weight: 600;">
                            Best regards,
                            <br>The 3DelliumTeam
                        </p>
                    </td>
                </table>
            </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td style="padding: 10px 0;">
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 130px; padding: 0 8px;vertical-align: middle;">
                            <img width="130" height="23" src="https://3dellium.com/images/email_logo.png"
                                alt="Header" />
                        </td>
                        <td style="width: 100px; padding: 0 8px;vertical-align: baseline;">
                            <p style="color: #1D4C29;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: 100%;">Email: </p>
                            <p style="margin: 0;">
                                <a href="tel:+34951748379" style="color: #000;
                                font-size: 10px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: 120%;
                                text-decoration: none;">+34951748379</a>
                            </p>
                        </td>
                        <td style="width: 100px; padding: 0 8px;vertical-align: baseline;">
                            <p style="color: #1D4C29;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: 100%;">Email: </p>
                            <p style="margin: 0;">
                                <a href="mailto:info@3dellium.com" style="color: #000;
                                font-size: 10px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: 120%;
                                text-decoration: none;">info@3dellium.com</a>
                            </p>
                        </td>

                        <td style="width: 150px; padding: 0 8px;vertical-align: baseline;">
                            <p style="color: #1D4C29;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: 100%;">Registration Address:</p>

                            <p style="color: #000;
                                font-size: 10px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: 120%;margin: 0s;">Calle Aguamarina, S/N - Local 1-2, Marbella, 29670,
                                Malaga</p>

                        </td>

                    </tr>
                </table>
            </td>
        </tr>
    </tfoot>
</table>`
      },
    },
  },
  access: {
    /*read: function (args: { req: PayloadRequest }) {
      return args.req.user?.role === 'admin'
    },*/
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      required: false,
    },
    {
      name: 'street',
      type: 'text',
      label: 'Street',
      required: false,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
      required: false,
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
      required: false,
    },
    {
      name: 'state',
      type: 'text',
      label: 'State',
      required: false,
    },
    {
      name: 'zip',
      type: 'text',
      label: 'Zip Code',
      required: false,
    },
    {
      name: 'country',
      type: 'text',
      label: 'Country',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
      required: true,
    },
  ],
}
