# Types Documentation

This folder contains all TypeScript type definitions for the TheaterHub application, organized by domain and functionality.

## 📁 Structure

```
types/
├── index.ts          # Main export file - import all types from here
├── auth.ts           # Authentication related types
├── events.ts         # Event and organizer types
├── theater.ts        # Theater, room, seat, and showtime types
├── tickets.ts        # Ticket and payment types
├── common.ts         # Shared/common types
└── README.md         # This documentation
```

## 🚀 Usage

### Import all types from the main index:

```typescript
import { User, Event, Ticket, ApiResponse } from "@/types";
```

### Import specific domain types:

```typescript
import { User, AuthResponse } from "@/types/auth";
import { Event, Organizer } from "@/types/events";
```

## 📋 Type Categories

### 🔐 Authentication Types (`auth.ts`)

- **User**: Main user entity
- **RegisterRequest**, **LoginRequest**: Authentication requests
- **AuthResponse**: Authentication API responses
- **AuthContextType**: React context type
- **EmailVerification**, **OTPLog**: Verification entities

### 🎭 Event Types (`events.ts`)

- **Event**: Main event entity
- **Organizer**: Event organizer entity
- **EventCategory**: Event categorization
- **CreateEventRequest**, **UpdateEventRequest**: Event management
- **EventFilters**: Search and filtering

### 🏛️ Theater Types (`theater.ts`)

- **Theater**: Theater venue entity
- **Room**: Theater room entity
- **Seat**, **SeatType**: Seating arrangements
- **Showtime**: Event scheduling
- **SeatPrice**, **TicketType**: Pricing structures

### 🎫 Ticket Types (`tickets.ts`)

- **Ticket**: Ticket booking entity
- **Payment**: Payment processing
- **BookingRequest**: Ticket booking requests
- **BookingSummary**: Booking overview

### 🔧 Common Types (`common.ts`)

- **ApiResponse<T>**: Generic API response wrapper
- **PaginatedResponse<T>**: Paginated data responses
- **PaginationParams**: Pagination parameters
- **FormError**, **FormState**: Form handling
- **LoadingState**: Loading states
- **CrudOperations<T>**: Generic CRUD interface

## 🛠️ Utility Types

### Type Guards

```typescript
import { isUser, isEvent, isTicket } from "@/types";

if (isUser(data)) {
  // TypeScript knows data is User type
  console.log(data.email);
}
```

### Utility Types

```typescript
import { Optional, RequiredFields, DeepPartial } from "@/types";

// Make some fields optional
type PartialUser = Optional<User, "phone" | "avatar">;

// Make some fields required
type RequiredUser = RequiredFields<User, "phone">;

// Deep partial for nested objects
type PartialEvent = DeepPartial<Event>;
```

## 🔄 Database Alignment

All types are designed to match the database schema:

- **Field names** match database column names
- **Relationships** are properly typed with optional joins
- **Enums** match database ENUM values
- **Nullable fields** are properly marked as optional

## 📝 Best Practices

### 1. Always use centralized types

```typescript
// ✅ Good
import { User } from '@/types';

// ❌ Bad - don't define types inline
interface User { ... }
```

### 2. Use proper imports

```typescript
// ✅ Good - import from main index
import { User, Event, ApiResponse } from "@/types";

// ✅ Also good - import from specific files
import { User } from "@/types/auth";
```

### 3. Extend types when needed

```typescript
// ✅ Good - extend existing types
interface UserWithStats extends User {
  totalBookings: number;
  totalSpent: number;
}
```

### 4. Use generic types for reusability

```typescript
// ✅ Good - use generic API response
const response: ApiResponse<User[]> = await getUsers();
```

## 🔧 Maintenance

### Adding new types:

1. Add to appropriate domain file (`auth.ts`, `events.ts`, etc.)
2. Export from that file
3. Types are automatically available via `types/index.ts`

### Modifying existing types:

1. Update the type definition
2. Check for breaking changes in components
3. Update related request/response types if needed

### Database changes:

1. Update corresponding type definitions
2. Update related request/response types
3. Check for impact on existing components

## 🎯 Examples

### Complete booking flow types:

```typescript
import {
  User,
  Event,
  Showtime,
  BookingRequest,
  BookingResponse,
  Ticket,
} from "@/types";

const handleBooking = async (
  user: User,
  showtime: Showtime,
  bookingData: BookingRequest
): Promise<BookingResponse> => {
  // Booking logic here
};
```

### Form handling with types:

```typescript
import { RegisterRequest, FormState, FormError } from "@/types";

const [formData, setFormData] = useState<RegisterRequest>({
  name: "",
  email: "",
  password: "",
});

const [formState, setFormState] = useState<FormState>({
  isSubmitting: false,
  errors: [],
  isValid: false,
});
```

This centralized type system ensures consistency, maintainability, and excellent TypeScript support throughout the application! 🚀
