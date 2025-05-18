/**
 * Test fixtures for restaurant and user tests
 *
 * This file provides shared fixtures and utility functions for tests,
 * including sample data for restaurants and users.
 */

/**
 * Sample valid restaurant data for testing
 */
export const validRestaurantData = {
  // Complete data
  complete: {
    name: "Tasty Pizza",
    description: "Best pizza in town",
    email: "contact@tastypizza.com",
    phoneNumber: "+1234567890",
    address: "123 Main St, Goma",
    serviceArea: "Goma downtown area",
  },
  // Minimal required data
  minimal: {
    name: "Burger Place",
    phoneNumber: "+9876543210",
  },
};

/**
 * Sample invalid restaurant data for testing
 */
export const invalidRestaurantData = {
  // Missing required name
  missingName: {
    phoneNumber: "+1234567890",
  },
  // Missing required phone number
  missingPhone: {
    name: "Missing Phone Restaurant",
  },
  // Invalid email format
  invalidEmail: {
    name: "Email Test Restaurant",
    phoneNumber: "+1234567890",
    email: "not-an-email",
  },
  // Name too short
  nameTooShort: {
    name: "A", // Minimum is 2 characters
    phoneNumber: "+1234567890",
  },
  // Invalid phone format
  invalidPhone: {
    name: "Phone Test Restaurant",
    phoneNumber: "not-a-phone",
  },
};

/**
 * Sample valid user data for testing
 */
import { UserRole } from "@/prisma/app/generated/prisma/client";

export const validUserData = {
  // Complete data
  complete: {
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!",
    phoneNumber: "+1234567890",
    role: UserRole.RESTAURANT,
    restaurantId: "restaurant-id-1",
  },
  // Minimal data
  minimal: {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "Password123",
    role: UserRole.RESTAURANT,
    restaurantId: "restaurant-id-2",
  },
};

/**
 * Sample invalid user data for testing
 */
export const invalidUserData = {
  // Missing email
  missingEmail: {
    name: "Missing Email User",
    password: "Password123",
    role: UserRole.RESTAURANT,
    restaurantId: "restaurant-id-1",
  },
  // Invalid email format
  invalidEmail: {
    name: "Invalid Email User",
    email: "not-an-email",
    password: "Password123",
    phoneNumber: "+1234567890",
    role: UserRole.RESTAURANT,
    restaurantId: "restaurant-id-1",
  },
  // Password too short
  passwordTooShort: {
    name: "Password Test User",
    email: "password@example.com",
    password: "short", // Too short based on requirements
    role: UserRole.RESTAURANT,
    restaurantId: "restaurant-id-1",
  },
  // Missing restaurant ID for restaurant admin
  missingRestaurantId: {
    name: "Missing Restaurant User",
    email: "missing@example.com",
    password: "Password123",
    role: UserRole.RESTAURANT,
    // Missing restaurantId
  },
};

/**
 * Sample database responses for successful operations
 */
export const dbResponses = {
  restaurant: {
    create: {
      id: "restaurant-id-1",
      name: "Tasty Pizza",
      description: "Best pizza in town",
      email: "contact@tastypizza.com",
      phoneNumber: "+1234567890",
      address: "123 Main St, Goma",
      serviceArea: "Goma downtown area",
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    list: [
      {
        id: "restaurant-id-1",
        name: "Tasty Pizza",
        description: "Best pizza in town",
        email: "contact@tastypizza.com",
        phoneNumber: "+1234567890",
        address: "123 Main St, Goma",
        serviceArea: "Goma downtown area",
        isActive: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
        managers: [
          {
            id: "manager-id-1",
            user: {
              id: "user-id-1",
              name: "John Doe",
              email: "john@example.com",
            },
          },
        ],
      },
      {
        id: "restaurant-id-2",
        name: "Burger Place",
        description: "Juicy burgers and fries",
        email: "info@burgerplace.com",
        phoneNumber: "+9876543210",
        address: "456 Oak St, Goma",
        serviceArea: "North Goma area",
        isActive: true,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
        managers: [
          {
            id: "manager-id-2",
            user: {
              id: "user-id-2",
              name: "Jane Smith",
              email: "jane@example.com",
            },
          },
          {
            id: "manager-id-3",
            user: {
              id: "user-id-3",
              name: "Bob Johnson",
              email: "bob@example.com",
            },
          },
        ],
      },
      {
        id: "restaurant-id-3",
        name: "Sushi Corner",
        description: "Fresh sushi and Japanese cuisine",
        email: "hello@sushicorner.com",
        phoneNumber: "+1122334455",
        address: "789 Pine St, Goma",
        serviceArea: "East Goma area",
        isActive: true,
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        managers: [],
      },
    ],
    paginatedResponse: {
      restaurants: [
        /* Will be filled with the list data */
      ],
      pagination: {
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  },
  user: {
    create: {
      id: "user-id-1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashed_SecurePass123!", // Add password field
      role: UserRole.RESTAURANT,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null,
      image: null,
    },
  },
  restaurantManager: {
    create: {
      id: "manager-id-1",
      userId: "user-id-1",
      restaurantId: "restaurant-id-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};
