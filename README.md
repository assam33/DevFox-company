# InnoVibe website

Static site (HTML, CSS, JavaScript). No build step. Deploys to GitHub Pages through `.github/workflows/static.yml`.

## 1. Make the contact form send email (EmailJS)

The form already uses EmailJS. It needs three values from your EmailJS account.

1. Create a free account at https://www.emailjs.com
2. **Email Services** > **Add New Service** > choose **Gmail** and connect `innovibetech.official@gmail.com`. Copy the **Service ID**.
3. **Email Templates** > **Create New Template** and fill it in like this:

   | Field | Value |
   | --- | --- |
   | To Email | `innovibetech.official@gmail.com` |
   | From Name | `{{from_name}}` |
   | Reply To | `{{from_email}}` |
   | Subject | `New project inquiry from {{from_name}}` |

   Content:

   ```
   Name: {{from_name}}
   Email: {{from_email}}
   Company: {{company}}
   Service: {{project_type}}
   Budget: {{budget}}

   Message:
   {{message}}
   ```

   Save it and copy the **Template ID**.
4. **Account** > **General** > copy your **Public Key**.
5. Open `js/main.js` and replace the three placeholders at the top:

   ```js
   const EMAILJS_CONFIG = {
     publicKey:  'YOUR_PUBLIC_KEY',
     serviceId:  'YOUR_SERVICE_ID',
     templateId: 'YOUR_TEMPLATE_ID',
   };
   ```
6. Recommended: in EmailJS go to **Account** > **Security** and allow only your website's domain, so nobody else can use your key.

Because "Reply To" is set to the visitor's email, pressing Reply in Gmail answers the client directly.

## 2. Replace the placeholders

Search the project for these strings and replace them with your real details:

| Search for | Replace with |
| --- | --- |
| `92XXXXXXXXXX` | Your WhatsApp number in international format, digits only (example: `923001234567`) |
| `YOUR-COMPANY-PAGE` | Your LinkedIn company page name |
| `YOUR-COMPANY-HANDLE` | Your Instagram username |
| `ASSAM-PROFILE`, `IZRAR-PROFILE` | Each founder's LinkedIn profile name |
| `ASSAM-HANDLE`, `IZRAR-HANDLE` | Each founder's Instagram username |
| `+92 300 0000000` and `tel:+923000000000` | Your real phone number |

The "Selected work" projects in `index.html` are sample entries. Replace them with your real projects when you have them.
