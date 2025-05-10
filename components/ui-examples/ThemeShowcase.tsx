"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import theme from "@/lib/constants/theme";

/**
 * Component that showcases the Dashi design system
 * Displays color palette, typography, spacing, and UI components
 */
export const ThemeShowcase: React.FC = () => {
  return (
    <div className="container py-8 space-y-12">
      <section>
        <h1 className="mb-6">Dashi Design System</h1>
        <p className="text-lg mb-8">
          This page showcases all the design elements and components for the
          Dashi platform.
        </p>
      </section>

      {/* Color Palette */}
      <section>
        <h2 className="mb-4">Color Palette</h2>

        <div className="space-y-8">
          {/* Primary Colors */}
          <div>
            <h3 className="mb-2">Primary Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <ColorCard
                name="Primary Orange"
                hex={theme.colors.primary.default}
                usage="Main brand color, CTAs"
              />
              <ColorCard
                name="Secondary Orange"
                hex={theme.colors.primary.secondary}
                usage="Secondary actions, hover states"
              />
              <ColorCard
                name="Light Orange"
                hex={theme.colors.primary.light}
                usage="Subtle highlights, backgrounds"
              />
              <ColorCard
                name="Dark Orange"
                hex={theme.colors.primary.dark}
                usage="Pressed states"
              />
            </div>
          </div>

          {/* Neutral Colors */}
          <div>
            <h3 className="mb-2">Neutral Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <ColorCard
                name="White"
                hex={theme.colors.neutral.white}
                usage="Backgrounds, cards"
                className="border border-gray-200"
              />
              <ColorCard
                name="Light Gray"
                hex={theme.colors.neutral.lightGray}
                usage="Secondary backgrounds"
              />
              <ColorCard
                name="Medium Gray"
                hex={theme.colors.neutral.mediumGray}
                usage="Borders, dividers"
              />
              <ColorCard
                name="Dark Gray"
                hex={theme.colors.neutral.darkGray}
                usage="Text, icons"
                textColor="white"
              />
              <ColorCard
                name="Black"
                hex={theme.colors.neutral.black}
                usage="Maximum contrast"
                textColor="white"
              />
            </div>
          </div>

          {/* Accent Colors */}
          <div>
            <h3 className="mb-2">Accent Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <ColorCard
                name="Success Green"
                hex={theme.colors.accent.success}
                usage="Success states, confirmations"
                textColor="white"
              />
              <ColorCard
                name="Error Red"
                hex={theme.colors.accent.error}
                usage="Error messages, warnings"
                textColor="white"
              />
              <ColorCard
                name="Info Blue"
                hex={theme.colors.accent.info}
                usage="Information, links"
                textColor="white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="mb-4">Typography</h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2">Headings</h3>
            <div className="space-y-4 border p-6 rounded-lg bg-white">
              <div>
                <span className="text-sm text-gray-500 block">
                  Display - 36px/2.25rem - Bold
                </span>
                <span
                  style={{
                    fontSize: theme.fontSize.display,
                    fontWeight: theme.fontWeight.bold,
                    lineHeight: theme.lineHeight.tight,
                  }}
                >
                  Welcome to Dashi
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Heading 1 - 30px/1.875rem - Bold
                </span>
                <h1>Restaurant Listings</h1>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Heading 2 - 24px/1.5rem - SemiBold
                </span>
                <h2>Popular Categories</h2>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Heading 3 - 20px/1.25rem - SemiBold
                </span>
                <h3>Menu Items</h3>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Heading 4 - 18px/1.125rem - Medium
                </span>
                <h4>Order Details</h4>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2">Body Text</h3>
            <div className="space-y-4 border p-6 rounded-lg bg-white">
              <div>
                <span className="text-sm text-gray-500 block">
                  Body Large - 16px/1rem - Regular
                </span>
                <p className="text-base">
                  Order delicious food from your favorite local restaurants in
                  Goma.
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Body - 14px/0.875rem - Regular
                </span>
                <p>
                  Dashi connects you with the best restaurants in town, offering
                  a wide variety of cuisines and dishes.
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">
                  Small - 12px/0.75rem - Regular
                </span>
                <small>
                  Terms and conditions apply. Delivery times may vary based on
                  restaurant availability.
                </small>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2">Font Weights</h3>
            <div className="space-y-3 border p-6 rounded-lg bg-white">
              <p style={{ fontWeight: theme.fontWeight.light }}>
                Light (300) - The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontWeight: theme.fontWeight.regular }}>
                Regular (400) - The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontWeight: theme.fontWeight.medium }}>
                Medium (500) - The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontWeight: theme.fontWeight.semiBold }}>
                Semi-Bold (600) - The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontWeight: theme.fontWeight.bold }}>
                Bold (700) - The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h2 className="mb-4">Spacing System</h2>
        <div className="border p-6 rounded-lg bg-white space-y-4">
          <p>
            Based on a 4px grid system, our spacing scale provides consistent
            measurements across the UI.
          </p>

          <div className="space-y-3">
            {/* Spacing items */}
            {Object.entries(theme.spacing).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <div
                  className="bg-orange-100 border border-orange-200 mr-4"
                  style={{ width: value, height: value }}
                ></div>
                <span className="text-sm">
                  <strong>space-{key}:</strong> {value} -{" "}
                  {getSpacingDescription(key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section>
        <h2 className="mb-4">UI Components</h2>

        <div className="space-y-8">
          {/* Buttons */}
          <div>
            <h3 className="mb-2">Buttons</h3>
            <Card className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Primary</h4>
                  <Button>Primary Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Secondary</h4>
                  <Button variant="secondary">Secondary Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Outline</h4>
                  <Button variant="outline">Outline Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Ghost</h4>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Destructive</h4>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Link</h4>
                  <Button variant="link">Link Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Disabled</h4>
                  <Button disabled>Disabled Button</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Small</h4>
                  <Button size="sm">Small Button</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Elements */}
          <div>
            <h3 className="mb-2">Form Elements</h3>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Input</h4>
                  <Input placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Input (Disabled)</h4>
                  <Input placeholder="Disabled input" disabled />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Checkbox</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <h3 className="mb-2">Alerts</h3>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Info Alert</AlertTitle>
                <AlertDescription>
                  This is an informational message for the user.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Error Alert</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>

              <div
                className="p-4 border-l-4 rounded-md"
                style={{
                  backgroundColor: theme.colors.accent.successLight,
                  borderLeftColor: theme.colors.accent.success,
                }}
              >
                <div
                  className="font-medium"
                  style={{ color: theme.colors.accent.success }}
                >
                  Success Alert
                </div>
                <div className="text-sm">
                  Your order has been placed successfully.
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="mb-2">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Restaurant Card */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Restaurant Image
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Restaurant Name
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Cuisine Type</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★</span>
                    <span className="text-gray-400">★</span>
                    <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                  </div>
                </div>
              </Card>

              {/* Menu Item Card */}
              <Card className="p-4">
                <div className="flex">
                  <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <span className="text-xs">Image</span>
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium mb-1">Menu Item</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      Description of the item
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">$10.99</span>
                      <Button size="sm" className="w-8 h-8 p-0">
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Order Summary Card */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Item 1 × 2</span>
                    <span>$21.98</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Item 2 × 1</span>
                    <span>$8.99</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>$30.97</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>$33.96</span>
                  </div>
                </div>
                <Button className="w-full">Checkout</Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
interface ColorCardProps {
  name: string;
  hex: string;
  usage: string;
  textColor?: string;
  className?: string;
}

const ColorCard: React.FC<ColorCardProps> = ({
  name,
  hex,
  usage,
  textColor = "inherit",
  className = "",
}) => {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div
        className="h-20 flex items-end p-2"
        style={{ backgroundColor: hex, color: textColor }}
      >
        <span className="font-mono text-xs font-medium">{hex}</span>
      </div>
      <div className="p-3 bg-white border border-t-0 border-gray-200 rounded-b-lg">
        <h4 className="font-medium text-sm">{name}</h4>
        <p className="text-xs text-gray-500">{usage}</p>
      </div>
    </div>
  );
};

// Helper function to get spacing descriptions
function getSpacingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    "1": "Minimal spacing, tight elements (4px)",
    "2": "Common small spacing, between related items (8px)",
    "3": "Medium spacing (12px)",
    "4": "Standard spacing, between unrelated elements (16px)",
    "5": "Large spacing, section separations (24px)",
    "6": "Extra large spacing, major section breaks (32px)",
    "7": "Maximum spacing, page sections (48px)",
    "8": "Extra large gap, major layout divisions (64px)",
  };

  return descriptions[key] || "";
}

export default ThemeShowcase;
