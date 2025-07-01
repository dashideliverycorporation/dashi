# Dashi Environment Variables

## Configuration Loading Mechanism

Environment variables are loaded into the Dashi application using the following mechanisms:

- **Local Development:** Using `.env.local` file with Next.js built-in environment variable support
- **Deployment (Vercel):** Set via Vercel's project environment configuration in the dashboard

## Required Variables

| Variable Name                   | Description                                      | Example / Default Value               | Required? (Yes/No) | Sensitive? (Yes/No) |
| :------------------------------ | :----------------------------------------------- | :------------------------------------ | :----------------- | :------------------ |
| `NODE_ENV`                      | Runtime environment                              | `development` / `production`          | Yes                | No                  |
| `DATABASE_URL`                  | Connection string for PostgreSQL database        | `postgresql://user:pass@host:port/db` | Yes                | Yes                 |
| `NEXTAUTH_SECRET`               | Secret for Auth.js (NextAuth) session encryption | `your-secret-key-at-least-32-chars`   | Yes                | Yes                 |
| `NEXTAUTH_URL`                  | Base URL for Auth.js callbacks                   | `http://localhost:3000`               | Yes                | No                  |
| `RESEND_API_KEY`                | API Key for Resend email service                 | `re_...`                              | Yes                | Yes                 |
| `EMAIL_FROM`                    | Email address used as sender for notifications   | `orders@dashi.com`                    | Yes                | No                  |
| `SMTP_HOST`                     | SMTP server hostname for Nodemailer              | `smtp.gmail.com`                      | Yes                | No                  |
| `SMTP_PORT`                     | SMTP server port for Nodemailer                  | `587`                                 | Yes                | No                  |
| `SMTP_USER`                     | SMTP username for authentication                 | `your-email@gmail.com`                | Yes                | Yes                 |
| `SMTP_PASS`                     | SMTP password for authentication                 | `your-app-password`                   | Yes                | Yes                 |
| `TEXTBELT_API_KEY`              | API key for Textbelt SMS service                | `your-textbelt-api-key`              | Yes                | Yes                 |
| `DEFAULT_ADMIN_EMAIL`           | Default admin user email (for initial setup)     | `admin@dashi.com`                     | No                 | Yes                 |
| `DEFAULT_ADMIN_PASSWORD`        | Default admin user password (for initial setup)  | `complex-initial-password`            | No                 | Yes                 |
| `NEXT_PUBLIC_APP_URL`           | Public-facing application URL                    | `https://dashi.vercel.app`            | No                 | No                  |
| `NEXT_PUBLIC_DEFAULT_LOCALE`    | Default locale for internationalization          | `en`                                  | No                 | No                  |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Supported locales for internationalization       | `en,fr`                               | No                 | No                  |

## Notes

- **Secrets Management:**
  - All sensitive variables should be kept in `.env.local` for local development and never committed to the repository
  - For production, all secrets are stored securely in Vercel's environment variable configuration
  - Ensure proper access controls are in place for the Vercel project
- **`.env.example`:**

  - An `.env.example` file is maintained in the repository with placeholder values (not actual secrets)
  - New developers should copy this file to `.env.local` and replace placeholders with appropriate values

- **Validation:**
  - Environment variables are validated during application startup using a dedicated validation utility
  - The validation ensures required variables are present and follows appropriate formats
  - Application will fail to start with meaningful error messages if validation fails

## Change Log

| Change                 | Date       | Version | Description                                              | Author         |
| ---------------------- | ---------- | ------- | -------------------------------------------------------- | -------------- |
| Initial draft          | 2025-05-05 | 0.1     | Initial Dashi environment variables                      | GitHub Copilot |
| Added locale variables | 2025-05-09 | 0.2     | Added NEXT_PUBLIC_SUPPORTED_LOCALES environment variable | GitHub Copilot |
| Added SMTP variables   | 2025-07-01 | 0.3     | Added SMTP configuration for Nodemailer email service    | GitHub Copilot |
| Added Textbelt SMS API | 2025-07-01 | 0.4     | Added Textbelt SMS notification service configuration    | GitHub Copilot |

<!-- Generated by Copilot -->
