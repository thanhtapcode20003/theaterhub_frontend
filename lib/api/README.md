# Modern API Structure for Next.js

This directory contains a modern, scalable API client architecture for your Next.js application, designed to replace the previous React.js API structure with improved features.

## 🚀 Key Improvements Over Previous Structure

### ✅ **What's Better:**

1. **TypeScript-First**: Full type safety throughout the entire API layer
2. **Automatic Token Management**: Handles refresh tokens and session management
3. **Built-in Error Handling**: Consistent error handling with retry logic
4. **Request/Response Interceptors**: Automatic auth headers and response processing
5. **File Upload Support**: Built-in FormData handling
6. **SSR Compatible**: Works with both client and server-side rendering
7. **Modern Fetch API**: Uses native fetch instead of axios (smaller bundle)
8. **Validation Schemas**: Zod schemas for runtime validation
9. **React Integration**: Custom hooks for easy component integration

### ❌ **Issues with Previous Structure:**

- Manual token handling in every request
- No automatic retry logic
- Limited error handling
- No TypeScript support
- Inconsistent response handling
- Manual URL construction

## 📁 Directory Structure

```
lib/api/
├── client.ts          # Main API client with interceptors
├── types.ts           # TypeScript definitions and schemas
├── services/          # Service layer for different entities
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── ...
├── index.ts           # Main exports
└── README.md          # This file
```

## 🛠 Usage Examples

### Basic Service Usage

```typescript
import { userService } from "@/lib/api";
import { useAsyncOperation } from "@/lib/hooks/use-api";

// In a React component
export function UserProfile({ userId }: { userId: string }) {
  const { loading, execute } = useAsyncOperation();

  const handleUpdate = async (data: UpdateUserFormData) => {
    await execute(() => userService.updateUser(userId, data), {
      showSuccessToast: true,
      successMessage: "Profile updated!",
      onSuccess: () => router.push("/profile"),
    });
  };

  // Component JSX...
}
```

### Authentication

```typescript
import { authService } from "@/lib/api";

// Sign in
const authResponse = await authService.signIn({
  email: "user@example.com",
  password: "password",
});

// Check if authenticated
const isLoggedIn = authService.isAuthenticated();

// Sign out
await authService.signOut();
```

### Error Handling

```typescript
import { ApiError } from "@/lib/api";

try {
  const user = await userService.getUserById(id);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      // Handle not found
    } else if (error.status === 422) {
      // Handle validation errors
      console.log(error.details?.errors);
    }
  }
}
```

## ⚙️ Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://localhost:7007/api/
```

### API Client Configuration

The client automatically handles:

- ✅ Bearer token authentication
- ✅ Token refresh on expiry
- ✅ Request retries with exponential backoff
- ✅ Request timeouts
- ✅ Automatic JSON parsing
- ✅ Error standardization

## 🔐 Authentication Flow

1. **Login**: Store access & refresh tokens
2. **API Requests**: Automatically add Bearer token
3. **Token Expiry**: Auto-refresh and retry request
4. **Refresh Failure**: Redirect to login page
5. **Logout**: Clear tokens and notify server

## 🎣 React Hooks

### `useAsyncOperation`

For handling async operations with loading states:

```typescript
const { loading, error, execute } = useAsyncOperation();

const handleSubmit = async (data) => {
  await execute(() => userService.updateUser(id, data), {
    showSuccessToast: true,
    successMessage: "Updated successfully!",
    onSuccess: (result) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });
};
```

### `useApi`

For data fetching with state management:

```typescript
const { data, loading, error, execute } = useApi<User[]>();

useEffect(() => {
  execute(() => userService.getUsers());
}, []);
```

## 📝 Adding New Services

1. **Create Service File**: `lib/api/services/new-entity.service.ts`

```typescript
import { apiClient } from "../client";
import type { NewEntity, CreateNewEntityData } from "../types";

class NewEntityService {
  private readonly endpoint = "new-entities";

  async getAll(): Promise<NewEntity[]> {
    const response = await apiClient.get<NewEntity[]>(this.endpoint);
    return response.data;
  }

  async create(data: CreateNewEntityData): Promise<NewEntity> {
    const response = await apiClient.post<NewEntity>(this.endpoint, data);
    return response.data;
  }
}

export const newEntityService = new NewEntityService();
```

2. **Add Types**: Update `lib/api/types.ts`

```typescript
export interface NewEntity extends BaseEntity {
  name: string;
  // other fields...
}

export const CreateNewEntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  // other validations...
});

export type CreateNewEntityData = z.infer<typeof CreateNewEntitySchema>;
```

3. **Export Service**: Update `lib/api/index.ts`

```typescript
export { newEntityService } from "./services/new-entity.service";
```

## 🔄 Migration from Previous Structure

### Before (Old React.js structure):

```javascript
// Old way
import { getUserById, updateUser } from "../../../api/userService";

const userData = await getUserById(userId);
const response = await updateUser(userId, formData);
if (response.status === 200) {
  // Handle success
}
```

### After (New Next.js structure):

```typescript
// New way
import { userService } from "@/lib/api";
import { useAsyncOperation } from "@/lib/hooks/use-api";

const { execute } = useAsyncOperation();

const user = await userService.getUserById(userId);
await execute(() => userService.updateUser(userId, formData), {
  showSuccessToast: true,
});
```

## 🎯 Best Practices

1. **Always use TypeScript types** for API responses
2. **Use validation schemas** for form data
3. **Leverage custom hooks** for consistent error handling
4. **Handle loading states** in UI components
5. **Use toast notifications** for user feedback
6. **Implement proper error boundaries** for unexpected errors
7. **Cache data appropriately** using React Query or SWR if needed

## 🚨 Common Patterns

### Form Submission with Validation

```typescript
const form = useForm<UpdateUserFormData>({
  resolver: zodResolver(UpdateUserSchema),
});

const { execute, loading } = useAsyncOperation();

const handleSubmit = async (data: UpdateUserFormData) => {
  await execute(() => userService.updateUser(userId, data), {
    showSuccessToast: true,
    onError: (error) => {
      // Set form errors from API response
      if (error.status === 422 && error.details?.errors) {
        Object.entries(error.details.errors).forEach(([field, messages]) => {
          form.setError(field, { message: messages[0] });
        });
      }
    },
  });
};
```

### Data Fetching with Error Handling

```typescript
const [users, setUsers] = useState<User[]>([]);
const { loading, execute } = useAsyncOperation();

useEffect(() => {
  const fetchUsers = async () => {
    const result = await execute(
      () => userService.getUsers({ page: 1, limit: 10 }),
      {
        showErrorToast: true,
        onSuccess: (data) => setUsers(data.data),
      }
    );
  };

  fetchUsers();
}, []);
```

This structure provides a solid foundation for scaling your application's API layer while maintaining type safety and developer experience.
