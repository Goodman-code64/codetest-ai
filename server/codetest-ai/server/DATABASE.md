***# Database Documentation***



***## Table Relationships***



***### Users → Subscriptions (1:1)***

***- Each user has exactly ONE subscription***

***- When user signs up, subscription is auto-created (via trigger)***

***- If user is deleted, subscription is deleted (CASCADE)***



***### Users → Generations (1:Many)***

***- Each user can have MANY test generations***

***- If user is deleted, all their generations are deleted (CASCADE)***



***### Subscriptions → Generations (Indirect)***

***- Subscription tracks how many generations user has used***

***- Before creating generation, check: generations\_used < generation\_limit***



***## Field Constraints***



***### users.email***

***- Must be unique***

***- Must be valid email format (validated in backend)***

***- Cannot be null***



***### users.password\_hash***

***- Stored as bcrypt hash (never plain text!)***

***- Min 8 characters before hashing***

***- Cannot be null***



***### subscriptions.generation\_limit***

***- Free tier: 10***

***- Pro tier: 100***

***- Team tier: Unlimited (-1 or very large number)***



***### generations.code\_input***

***- Max length: 50,000 characters (500 lines × 100 chars/line)***

***- Must contain valid JavaScript syntax***



***## Indexes***



***Indexes speed up queries. We've added:***

***- `idx\_users\_email` - Fast login lookup***

***- `idx\_generations\_user\_id` - Fast user history lookup***

***- `idx\_subscriptions\_user\_id` - Fast subscription lookup***



***## Auto-Reset Logic***



***Monthly generation reset:***



