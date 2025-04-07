This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# API Call Examples (4 Patterns)

## 1. Auto-fetch on Load (useApi)
```js
import { useApi } from '@/hooks/useApi';
import { apiGet } from '@/lib/apiClient';

const { data, loading, error } = useApi(() => apiGet('/user/profile'), []);
```

## 2. Conditional Fetch (useState + useEffect)
```js
const [trigger, setTrigger] = useState(false);
const [data, setData] = useState(null);
useEffect(() => {
  if (trigger) {
    apiGet('/user/profile').then(setData);
  }
}, [trigger]);
```

## 3. Manual Trigger - POST/PUT (useMutation)
```js
import { useMutation } from '@/hooks/useMutation';
import { apiPost } from '@/lib/apiClient';

const { mutate, loading, error, data } = useMutation(apiPost);

const handleCreate = () => {
  mutate('/user/create', { name: 'Shivraj' });
};
```

## 4. DELETE Example (useMutation)
```js
const { mutate, loading } = useMutation(apiDelete);
const handleDelete = () => mutate(`/user/123/delete`);
