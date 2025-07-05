/**
 * Simple seed script that doesn't depend on auth.ts
 * This avoids ESM compatibility issues when running with ts-node
 */
import { PrismaClient } from "../prisma/app/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Hash a password
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Main seed function
 */
async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - be careful in production)
  await clearDatabase();

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      email: "admin@dashi.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`👤 Created admin user: ${admin.email}`);

  // Create restaurant manager users and restaurants
  const restaurants = [
    {
      name: "Pizza Palace",
      description: "Best pizza in town with authentic Italian recipes",
      email: "info@pizzapalace.com",
      phoneNumber: "+243123456789",
      address: "123 Main St, Goma, DRC",
      serviceArea: "Central Goma, Himbi, Katindo areas",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Italian",
      preparationTime: "20-30",
      deliveryFee: 2.50,
      discountTag: "Free Delivery on Orders Over $25",
      rating: 4.5,
      ratingCount: 127,
      manager: {
        email: "manager@pizzapalace.com",
        name: "Mario Pizza",
      },
    },
    {
      name: "Burger Bliss",
      description: "Juicy burgers with fresh ingredients",
      email: "info@burgerbliss.com",
      phoneNumber: "+243987654321",
      address: "456 Oak Ave, Goma, DRC",
      serviceArea: "Downtown Goma, Mugunga, Sake areas",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Fast Food",
      preparationTime: "15-25",
      deliveryFee: 1.75,
      discountTag: "20% OFF First Order",
      rating: 4.2,
      ratingCount: 89,
      manager: {
        email: "manager@burgerbliss.com",
        name: "Bob Burger",
      },
    },
    {
      name: "Sushi Sensation",
      description: "Fresh and delicious sushi made with care",
      email: "info@sushisensation.com",
      phoneNumber: "+243456789123",
      address: "789 Elm Blvd, Goma, DRC",
      serviceArea: "Les Volcans, Birere, Ndosho areas",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Japanese",
      preparationTime: "25-40",
      deliveryFee: 3.00,
      discountTag: null,
      rating: 4.8,
      ratingCount: 56,
      manager: {
        email: "manager@sushisensation.com",
        name: "Sakura Sushi",
      },
    },
  ];

  // Create restaurants and their managers
  for (const restaurantData of restaurants) {
    const { manager, ...restData } = restaurantData;

    // Create manager user
    const managerPassword = await hashPassword("manager123");
    const managerUser = await prisma.user.create({
      data: {
        email: manager.email,
        name: manager.name,
        password: managerPassword,
        role: "RESTAURANT",
      },
    });

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        ...restData, // Include all the restaurant data fields
        managers: {
          create: {
            userId: managerUser.id,
            phoneNumber: restData.phoneNumber || "+243999999999", // Use restaurant phone or default
          },
        },
      },
    });

    // Create menu items for this restaurant
    await createMenuItems(restaurant.id);

    console.log(
      `🍽️ Created restaurant: ${restaurant.name} with manager: ${managerUser.email}`
    );
  }

  // Create customer users
  const customers = [
    {
      email: "john@example.com",
      name: "John Doe",
      phoneNumber: "+243111222333",
      address: "321 Pine St, Goma, DRC",
    },
    {
      email: "jane@example.com",
      name: "Jane Smith",
      phoneNumber: "+243444555666",
      address: "654 Cedar Rd, Goma, DRC",
    },
    {
      email: "sam@example.com",
      name: "Sam Wilson",
      phoneNumber: "+243777888999",
      address: "987 Birch Ave, Goma, DRC",
    },
  ];

  for (const customerData of customers) {
    const { email, name, phoneNumber, address } = customerData;

    // Create customer user
    const customerPassword = await hashPassword("customer123");
    const customerUser = await prisma.user.create({
      data: {
        email,
        name,
        password: customerPassword,
        role: "CUSTOMER",
        customer: {
          create: {
            phoneNumber,
            address,
          },
        },
      },
    });

    console.log(`👤 Created customer: ${customerUser.email}`);
  }

  // Create sample orders
  await createSampleOrders();

  console.log("✅ Database seeding completed successfully");
}

/**
 * Create menu items for a restaurant
 */
async function createMenuItems(restaurantId: string) {
  const menuItems = [
    {
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "Pizza",
      imageUrl:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      category: "Pizza",
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Veggie Burger",
      description: "Plant-based burger with lettuce, tomato, and special sauce",
      price: 10.99,
      category: "Burger",
      imageUrl:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Classic Burger",
      description: "Beef patty with cheese, lettuce, tomato, and sauce",
      price: 11.99,
      category: "Burger",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "California Roll",
      description: "Sushi roll with crab, avocado, and cucumber",
      price: 8.99,
      category: "Sushi",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "French Fries",
      description: "Crispy golden fries with salt",
      price: 4.99,
      category: "Sides",
      imageUrl:
        "https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId,
      },
    });
  }
}

/**
 * Create sample orders with various statuses and payment transactions
 */
async function createSampleOrders() {
  // Get customers
  const customers = await prisma.customer.findMany({
    include: { user: true },
  });

  // Get restaurants with menu items
  const restaurants = await prisma.restaurant.findMany({
    include: { menuItems: true },
  });

  // Order statuses to use for variety
  const orderStatuses: ("PLACED" | "PREPARING" | "DISPATCHED" | "DELIVERED" | "CANCELLED")[] = [
    "PLACED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"
  ];
  
  // Payment methods to use
  const paymentMethods: ("MOBILE_MONEY" | "CARD" | "CASH")[] = ["MOBILE_MONEY", "CARD", "CASH"];
  
  // Payment statuses
  const paymentStatuses: ("PENDING" | "COMPLETED" | "FAILED")[] = ["PENDING", "COMPLETED", "FAILED"];

  // For each customer, create a couple of orders
  for (const customer of customers) {
    // Create 2-3 orders from different restaurants per customer
    const numOrders = Math.floor(Math.random() * 2) + 2; // 2-3 orders
    
    for (let i = 0; i < numOrders && i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      if (restaurant.menuItems.length === 0) continue;

      // Select random menu items (1-3 items)
      const menuItems = restaurant.menuItems.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );

      // Calculate total amount including delivery fee
      let subtotal = 0;
      const orderItems = menuItems.map((item) => {
        const quantity = Math.floor(Math.random() * 2) + 1;
        subtotal += Number(item.price) * quantity;

        return {
          menuItemId: item.id,
          quantity,
          price: item.price,
        };
      });

      const totalAmount = subtotal + Number(restaurant.deliveryFee);

      // Generate a random 4-digit number for order number
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const displayOrderNumber = `#${randomNumber}`;
      
      // Pick a random status
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      
      // Add cancellation reason if cancelled
      const cancellationReason = status === "CANCELLED" ? "Customer requested cancellation" : null;
      
      // Create the order
      const order = await prisma.order.create({
        data: {
          totalAmount,
          status,
          customerId: customer.id,
          restaurantId: restaurant.id,
          customerNotes: "Please deliver ASAP. Thank you!",
          deliveryAddress: customer.address || "Default Address",
          orderNumber: randomNumber,
          displayOrderNumber: displayOrderNumber,
          cancellationReason,
          orderItems: {
            create: orderItems,
          },
        },
      });

      // Create payment transaction for each order
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      let paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      // Ensure cancelled orders have failed/pending payments
      if (status === "CANCELLED") {
        paymentStatus = Math.random() > 0.5 ? "FAILED" : "PENDING";
      }
      // Ensure delivered orders have completed payments
      else if (status === "DELIVERED") {
        paymentStatus = "COMPLETED";
      }

      // Create payment transaction data
      const paymentData: any = {
        orderId: order.id,
        amount: totalAmount,
        paymentMethod,
        status: paymentStatus,
        customerId: customer.id,
        restaurantId: restaurant.id,
        notes: `Payment via ${paymentMethod.toLowerCase().replace('_', ' ')}`,
      };

      // Add mobile money specific fields
      if (paymentMethod === "MOBILE_MONEY") {
        paymentData.transactionId = `MM${Math.floor(100000 + Math.random() * 900000)}`;
        paymentData.mobileNumber = customer.phoneNumber;
        paymentData.providerName = Math.random() > 0.5 ? "Orange Money" : "Airtel Money";
      }

      await prisma.paymentTransaction.create({
        data: paymentData,
      });
    }
  }

  console.log("📦 Created sample orders with payment transactions");
}

/**
 * Clear existing data (use with caution)
 */
async function clearDatabase() {
  // Order of deletion matters due to foreign key constraints
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurantManager.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Cleared existing data");
}

// Execute the main function
main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
