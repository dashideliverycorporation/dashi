# Dashi Internationalization (i18n) Guide

## Overview

Dashi uses a comprehensive internationalization framework based on [react-i18next](https://react.i18next.com/) to support multiple languages. The current implementation supports English (default) and French, with the ability to easily add more languages in the future.

## Table of Contents

1. [Configuration](#configuration)
2. [Directory Structure](#directory-structure)
3. [Translation Files](#translation-files)
4. [Using Translations](#using-translations)
5. [Language Switching](#language-switching)
6. [Server Components](#server-components)
7. [Environment Variables](#environment-variables)
8. [Adding a New Language](#adding-a-new-language)
9. [Best Practices](#best-practices)

## Configuration

The i18n framework is configured in multiple files to support both client and server components in Next.js:

- `lib/i18n/index.ts` - Main entry point with shared types and utilities
- `lib/i18n/client.ts` - Client-side configuration with browser language detection
- `lib/i18n/server.ts` - Server-side configuration for server components
- `lib/i18n/settings.ts` - Shared settings like supported languages and namespaces
- `lib/i18n/storage.ts` - Language preference persistence in local storage

The framework is initialized in the root layout with `I18nProvider` to ensure all components have access to translations.

## Directory Structure

```
lib/
  i18n/
    client.ts         # Client-side i18n configuration
    index.ts          # Main entry point and shared types
    server.ts         # Server-side i18n configuration
    settings.ts       # Language settings and namespaces
    storage.ts        # Language preference persistence
components/
  custom/
    i18n-provider.tsx # Provider component for Next.js
  i18n/
    LanguageSwitcher.tsx # Language switcher component
    LocalizedLink.tsx    # Link component with language preservation
hooks/
  useTranslation.ts   # Custom hook for accessing translations
public/
  locales/            # Translation files
    en/               # English translations
      common.json
    fr/               # French translations
      common.json
```

## Translation Files

Translation files are organized by language and namespace in the `public/locales` directory:

```
public/
  locales/
    en/
      common.json     # General translations
      auth.json       # Authentication-related translations
      restaurant.json # Restaurant-related translations
      menu.json       # Menu-related translations
      cart.json       # Cart-related translations
      order.json      # Order-related translations
    fr/
      # Same structure as English
```

Example translation file (`common.json`):

```json
{
  "app": {
    "name": "Dashi",
    "tagline": "Food delivery made simple"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  },
  "language": {
    "title": "Language",
    "select": "Select Language",
    "en": "English",
    "fr": "French"
  },
  "nav": {
    "home": "Home",
    "restaurants": "Restaurants",
    "orders": "Orders",
    "account": "Account"
  }
}
```

## Using Translations

### In Client Components

Use the custom `useTranslation` hook to access translations in client components:

```tsx
"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.title")}</h1>
      <p>{t("common.description")}</p>

      {/* With default value fallback */}
      <button>{t("common.save", "Save")}</button>

      {/* With variables */}
      <p>{t("greeting", { name: "John" })}</p>

      {/* With pluralization */}
      <p>{t("items", { count: 5 })}</p>
    </div>
  );
}
```

### Enhanced Features

The custom hook provides several additional utilities:

```tsx
const {
  t, // Basic translation function
  currentLanguage, // Current language code (e.g., 'en')
  currentLanguageInfo, // Language details (name, flag)
  formatDate, // Format dates according to locale
  formatNumber, // Format numbers according to locale
  plural, // Shorthand for pluralization
  changeLanguage, // Function to change language
  exists, // Check if a translation key exists
} = useTranslation();

// Format date according to current locale
const formattedDate = formatDate(new Date(), {
  dateStyle: "full",
});

// Format currency according to current locale
const price = formatNumber(19.99, {
  style: "currency",
  currency: "USD",
});

// Simplified pluralization
const itemCount = plural("items.count", 5); // "5 items"
```

### In Server Components

For server components, use the `getServerTranslation` function:

```tsx
import { getServerTranslation } from "@/lib/i18n";

export default async function ServerComponent() {
  // Get the translation function for the server
  const { t } = await getServerTranslation("en");

  return (
    <div>
      <h1>{t("common.serverTitle")}</h1>
      <p>{t("common.serverDescription")}</p>
    </div>
  );
}
```

## Language Switching

The `LanguageSwitcher` component provides UI for users to change languages:

```tsx
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export default function Header() {
  return (
    <header>
      <nav>
        {/* Other navigation elements */}

        {/* Simple variant (just flags) */}
        <LanguageSwitcher variant="simple" />

        {/* Full variant (flags and names) */}
        <LanguageSwitcher variant="full" />
      </nav>
    </header>
  );
}
```

## Server Components

For server components, translations are handled differently:

1. Import the server-side translation utility
2. Use the utility to get translations based on the current language
3. Use the returned translation function

```tsx
import { getServerTranslation } from "@/lib/i18n";

export default async function ServerComponent() {
  // Get translations for the default language
  const { t } = await getServerTranslation();

  return <h1>{t("common.title")}</h1>;
}
```

## Environment Variables

The i18n system uses the following environment variables:

- `NEXT_PUBLIC_DEFAULT_LOCALE`: Sets the default language (e.g., "en")
- `NEXT_PUBLIC_SUPPORTED_LOCALES`: Comma-separated list of supported language codes (e.g., "en,fr")

These variables can be configured in `.env.local` for development or in your deployment environment:

```
# .env.local
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,fr
```

## Adding a New Language

To add support for a new language:

1. Update the `LANGUAGES` array in `lib/i18n/settings.ts`:

```ts
export const LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
  },
];
```

2. Create translation files in `public/locales/[language-code]/`:

```
public/locales/es/common.json
public/locales/es/auth.json
// etc.
```

3. Update the `NEXT_PUBLIC_SUPPORTED_LOCALES` environment variable to include the new language code.

## Best Practices

1. **Namespace Organization**:

   - Organize translations into logical namespaces (common, auth, restaurant, etc.)
   - Keep namespaces aligned with features for better maintainability

2. **Key Structure**:

   - Use dot notation for hierarchical keys (`common.button.save`)
   - Group related translations under common parents

3. **Avoid Hard-coding Strings**:

   - Always use the translation function for user-facing text
   - Provide default values for development convenience

4. **Component Text**:

   - Keep UI component text in the `common` namespace
   - Use feature-specific namespaces for domain-specific text

5. **Type Safety**:

   - Utilize TypeScript for type-safe translation keys
   - Consider using the `createTranslationKeys` helper for type checking

6. **Pluralization and Formatting**:

   - Use proper pluralization with the `count` parameter
   - Use `formatDate` and `formatNumber` for locale-aware formatting

7. **Testing Translations**:
   - Include tests for key existence and proper formatting
   - Test language switching functionality

## Change Log

| Change        | Date       | Version | Description                              | Author         |
| ------------- | ---------- | ------- | ---------------------------------------- | -------------- |
| Initial draft | 2025-05-09 | 0.1     | Initial documentation for i18n framework | GitHub Copilot |
