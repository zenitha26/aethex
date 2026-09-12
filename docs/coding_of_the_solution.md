# **AETHEX – Coding of the Solution**

## 1. Overview

The AETHEX platform was developed using **Next.js** with the **App Router** architecture to create a fast, scalable, and maintainable web application. The frontend was implemented with **React**, **Tailwind CSS**, and **Framer Motion**, while the backend commerce functionality was powered by the **Shopify Storefront API**. **Supabase** was integrated to support user authentication, wishlist management, reviews, and additional application data.

The application follows a modular component-based architecture where each feature is developed as an independent, reusable component.

---

## 2. Development Environment

| Component            | Technology       |
| -------------------- | ---------------- |
| Programming Language | TypeScript       |
| Frontend Framework   | Next.js          |
| UI Library           | React            |
| Styling              | Tailwind CSS     |
| Animation            | Framer Motion    |
| Database             | Supabase         |
| Commerce Platform    | Shopify Headless |
| State Management     | Zustand          |
| Package Manager      | npm              |
| Version Control      | Git & GitHub     |

---

## 3. Project Structure

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── account/
│
├── components/
│   ├── Hero/
│   ├── Product/
│   ├── Cart/
│   ├── Navbar/
│   ├── Footer/
│   └── UI/
│
├── lib/
│   ├── shopify.ts
│   ├── supabase.ts
│   ├── products.ts
│   └── utils.ts
│
├── hooks/
│
├── store/
│
├── styles/
│
└── types/
```

---

## 4. Homepage Development

The homepage introduces users to the featured sneaker collection through a full-screen hero section and smooth scrolling interactions.

### Example Component

```tsx
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold">
        Discover the Next Drop
      </h1>
    </section>
  );
}
```

---

## 5. Product Retrieval

Products are retrieved from Shopify using the Storefront GraphQL API. If the Shopify connection is unavailable, the application automatically falls back to Supabase or offline mock data to ensure uninterrupted functionality.

### Example

```ts
export async function getProducts() {
  return await shopifyFetch(PRODUCT_QUERY);
}
```

---

## 6. State Management

The shopping cart is managed using Zustand, allowing global state management without excessive component re-rendering.

### Example

```ts
const useCartStore = create((set) => ({
  cart: [],
  addItem: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
}));
```

---

## 7. User Interface Development

Reusable React components were developed for all major interface elements, including:

* Hero section
* Product cards
* Product details
* Shopping cart
* Checkout
* Footer

Tailwind CSS utility classes were used to maintain a consistent design system throughout the application.

---

## 8. Animation Implementation

Framer Motion was used to create smooth page transitions and interactive effects while maintaining high performance.

### Example

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Product Details
</motion.div>
```

---

## 9. Database Integration

Supabase handles user authentication and stores additional application data such as wishlists and reviews.

Example operations include:

* User registration
* Login
* Wishlist storage
* Review submission

---

## 10. Responsive Development

The application uses Tailwind CSS responsive utilities to adapt the layout for different devices.

Example:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

This approach ensures compatibility across desktop, tablet, and mobile devices.

---

## 11. Error Handling

The application includes robust error handling to improve reliability.

Implemented features include:

* Try-catch blocks for API requests
* Fallback product loading
* User-friendly error messages
* Loading indicators
* Graceful handling of network failures

---

## 12. Code Quality

To improve maintainability, the following practices were adopted:

* TypeScript type checking
* Modular component design
* Reusable utility functions
* Consistent naming conventions
* Component-based architecture
* Separation of business logic from UI components

---

## 13. Security Considerations

Security was incorporated throughout development by:

* Validating user input
* Protecting API keys with environment variables
* Using secure HTTPS communication
* Implementing authentication through Supabase
* Leveraging Shopify's secure checkout process

---

## 14. Outcome

The coding phase resulted in a modular, scalable, and high-performance web application that satisfies the identified functional and non-functional requirements. The implementation provides a strong foundation for future enhancements, including additional product categories, personalization features, and advanced user interactions, while maintaining clean architecture and maintainable code.
