# Loading System Usage Examples

## 🎯 **Blue Circular Loading System**

This loading system provides a beautiful blue circular spinner that matches your design requirements and can be used throughout your entire website.

## 📦 **Available Components**

### 1. **Basic Loading Spinner**

```tsx
import Loading from "@/components/ui/loading";

// Basic usage
<Loading />

// With different sizes
<Loading size="sm" />   // Small
<Loading size="md" />   // Medium (default)
<Loading size="lg" />   // Large
<Loading size="xl" />   // Extra Large

// With different colors
<Loading variant="primary" />  // Blue (default)
<Loading variant="white" />    // White
<Loading variant="red" />      // Red

// With text
<Loading text="Loading data..." size="lg" />

// Full screen overlay
<Loading fullScreen text="Please wait..." />
```

### 2. **Page Loading Component**

```tsx
import { PageLoading } from "@/components/ui/loading";

// Full page loading screen
<PageLoading text="Loading dashboard..." />;
```

### 3. **Skeleton Loading Components**

```tsx
import { CardLoading, TableLoading, ButtonLoading } from "@/components/ui/loading";

// Card skeleton
<CardLoading />

// Table skeleton
<TableLoading rows={5} />

// Button loading state
<ButtonLoading text="Saving..." />
```

## 🌐 **Global Loading Context**

### Basic Usage

```tsx
import { useLoading } from "@/contexts/LoadingContext";

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleAction = async () => {
    showLoading("Processing...");

    try {
      // Your async operation
      await someApiCall();
    } finally {
      hideLoading();
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

### Using executeWithLoading Hook

```tsx
import { useAsyncOperation } from "@/contexts/LoadingContext";

function MyComponent() {
  const { executeWithLoading } = useAsyncOperation();

  const handleAction = async () => {
    await executeWithLoading(async () => {
      // Your async operation
      await someApiCall();
      await anotherApiCall();
    }, "Processing data...");
  };

  return <button onClick={handleAction}>Process Data</button>;
}
```

## 💡 **Real-World Examples**

### 1. **API Data Fetching**

```tsx
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const { executeWithLoading } = useAsyncOperation();

useEffect(() => {
  const fetchUsers = async () => {
    await executeWithLoading(async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    }, "Loading users...");
  };

  fetchUsers();
}, []);

// In JSX
{
  isLoading ? <TableLoading rows={5} /> : <UserTable users={users} />;
}
```

### 2. **Form Submission**

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const { executeWithLoading } = useAsyncOperation();

const handleSubmit = async (formData) => {
  setIsSubmitting(true);

  await executeWithLoading(async () => {
    await submitForm(formData);
    router.push("/success");
  }, "Submitting form...");

  setIsSubmitting(false);
};

// In JSX
<button disabled={isSubmitting}>
  {isSubmitting ? <ButtonLoading /> : "Submit"}
</button>;
```

### 3. **Page Navigation with Loading**

```tsx
const router = useRouter();
const { showLoading, hideLoading } = useLoading();

const navigateToPage = async (url) => {
  showLoading("Loading page...");

  // Simulate navigation delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  router.push(url);
  hideLoading();
};
```

### 4. **Dashboard Cards with Staggered Loading**

```tsx
const [statsLoading, setStatsLoading] = useState(true);
const [tableLoading, setTableLoading] = useState(true);

useEffect(() => {
  // Load stats first
  setTimeout(() => setStatsLoading(false), 1000);

  // Load table data after
  setTimeout(() => setTableLoading(false), 1500);
}, []);

return (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-4 gap-6">
      {statsLoading
        ? Array.from({ length: 4 }).map((_, i) => <CardLoading key={i} />)
        : stats.map((stat) => <StatCard key={stat.id} data={stat} />)}
    </div>

    {/* Data Table */}
    {tableLoading ? <TableLoading rows={10} /> : <DataTable data={tableData} />}
  </div>
);
```

## 🎨 **Styling Customization**

The loading components use your design system colors:

- **Primary**: Blue (#3B82F6) - matches your image
- **Background**: Dark zinc for consistency
- **Animation**: Smooth spin with 1s duration
- **Responsive**: Works on all screen sizes

## 🚀 **Best Practices**

1. **Use appropriate loading states**: Cards for dashboard widgets, tables for data lists, full-screen for page transitions
2. **Provide meaningful text**: Tell users what's happening ("Loading users...", "Saving changes...")
3. **Don't overuse global loading**: Use local loading states when possible
4. **Consistent timing**: Keep loading times reasonable (1-3 seconds for demos)
5. **Graceful fallbacks**: Always handle loading errors properly

## 📱 **Mobile Responsive**

All loading components are fully responsive and work seamlessly across:

- Desktop computers
- Tablets
- Mobile phones
- Different orientations
