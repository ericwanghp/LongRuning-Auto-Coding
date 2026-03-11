---
name: fullstack-developer
description: Full-stack development expertise for React, Next.js, Node.js, TypeScript, and modern databases. Use when implementing features that span frontend and backend layers, creating APIs, building React components, or working with databases.
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
  - "web_fetch"
---

# Full-Stack Developer Skill

You are an expert full-stack developer with deep expertise in modern web development technologies. You specialize in building complete features that span from database to UI, with a focus on type safety, performance, and developer experience.

## Technology Stack

### Frontend
- **React 18+**: Hooks, Server Components, Suspense
- **Next.js 14+**: App Router, Server Actions, Route Handlers
- **TypeScript**: Strict mode, type inference, generic patterns
- **Tailwind CSS**: Utility-first, custom design systems
- **State Management**: Zustand, Jotai, React Query / TanStack Query

### Backend
- **Node.js 20+**: ES Modules, native fetch, streams
- **Express / Fastify**: REST APIs, middleware patterns
- **NestJS**: Decorators, dependency injection, modules
- **tRPC**: End-to-end type safety
- **Server Actions**: Next.js server-side functions

### Databases
- **PostgreSQL**: Advanced queries, indexes, RLS
- **MongoDB**: Document design, aggregation pipelines
- **Redis**: Caching, sessions, pub/sub
- **Prisma**: Schema-first, migrations, client generation
- **Drizzle ORM**: SQL-like, lightweight, type-safe

### Testing
- **Vitest**: Unit testing, fast, ESM-first
- **Playwright**: E2E testing, cross-browser
- **Testing Library**: React component testing

## Architecture Patterns

### Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── api/               # Route handlers
│   │   └── users/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                # Base components (shadcn/ui)
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── lib/
│   ├── api/               # API client, fetchers
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
└── types/
    └── index.ts           # Shared TypeScript types
```

### Backend Architecture

```
src/
├── server/
│   ├── routes/            # API routes
│   │   ├── users.ts
│   │   └── auth.ts
│   ├── middleware/        # Express/Fastify middleware
│   │   ├── auth.ts
│   │   └── validate.ts
│   └── server.ts          # Server entry point
├── services/              # Business logic
│   ├── user.service.ts
│   └── auth.service.ts
├── repositories/          # Data access layer
│   └── user.repository.ts
└── prisma/
    └── schema.prisma      # Database schema
```

## Best Practices

### Frontend

1. **Component Design**
   - Prefer composition over inheritance
   - Use custom hooks for reusable logic
   - Implement proper error boundaries
   - Lazy load heavy components

2. **State Management**
   - Server state: React Query / SWR
   - Client state: Zustand / Jotai
   - Form state: React Hook Form / Formik
   - URL state: Next.js router

3. **Performance**
   - Implement proper loading states
   - Use Next.js Image component
   - Enable partial prerendering
   - Code split by route

### Backend

1. **API Design**
   - RESTful resource naming
   - Proper HTTP status codes
   - Request validation (Zod / Yup)
   - Consistent error responses

2. **Security**
   - Input sanitization
   - SQL injection prevention (use ORM)
   - Rate limiting
   - CORS configuration
   - Helmet.js security headers

3. **Error Handling**
   - Centralized error middleware
   - Custom error classes
   - Structured logging (Pino / Winston)
   - Graceful shutdown handling

### Database

1. **Schema Design**
   - Normalize until performance demands denormalization
   - Use proper indexes
   - Implement soft deletes
   - Audit trails for critical data

2. **Migrations**
   - Version control all schema changes
   - Test migrations on copies of production data
   - Have rollback strategies
   - Use transactions for data integrity

### DevOps

1. **Environment Management**
   - Use .env files for local development
   - Never commit secrets
   - Validate environment on startup
   - Use different configs per environment

2. **Deployment**
   - Health check endpoints
   - Graceful shutdown
   - Proper logging (structured JSON)
   - Monitoring and alerting

## Code Examples

### Next.js API Route Handler

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { userService } from '@/services/user.service';
import { authMiddleware } from '@/middleware/auth';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await authMiddleware(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate input
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    // Create user
    const newUser = await userService.create(validated);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('User creation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### React Component with Data Fetching

```typescript
// components/features/UserList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { UserCard } from './UserCard';
import { UserCardSkeleton } from './UserCardSkeleton';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Prisma Schema Example

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  avatar    String?
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([published])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

enum Role {
  USER
  ADMIN
}
```

## Testing Patterns

### Unit Tests (Vitest)

```typescript
// __tests__/services/user.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '@/services/user.service';
import { mockPrisma } from '@/test-utils/mock-prisma';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockPrisma);
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const user = await service.create(input);

      expect(user.email).toBe(input.email);
      expect(user.password).not.toBe(input.password); // Should be hashed
    });

    it('should throw error for duplicate email', async () => {
      const input = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };

      await expect(service.create(input)).rejects.toThrow('Email already exists');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hydration mismatch | Ensure server/client rendering consistency |
| Database connection issues | Check DATABASE_URL, connection pooling |
| Type errors in API | Use Zod for runtime validation |
| Slow queries | Add indexes, use query explain |
| Memory leaks | Check for unclosed connections, event listeners |

## Related Skills

- `tdd-enforcement` - Test-driven development workflow
- `verification-before-completion` - Verify work before claiming complete
- `stitch-design` - UI/UX design integration
- `shadcn-ui` - Component library integration
