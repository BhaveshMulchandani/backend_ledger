🏦 Banking Ledger Backend System

A production-oriented backend system simulating core banking operations including account creation, fund transfers, and double-entry ledger accounting.

This system ensures ACID-compliant transactions, idempotent transfers, secure authentication, and automatic token blacklisting cleanup using MongoDB TTL indexes.

🚀 Features

- 🔐 JWT-based Authentication
- 🏦 User & Bank Account Creation
- 💸 Fund Transfer (Account → Account)
- 📒 Strict Double-Entry Ledger Enforcement
- 🔁 Idempotent Transactions (Prevents Duplicate Transfers)
- 🔄 MongoDB Session-based ACID Transactions
- ⏳ Token Blacklisting with TTL Auto-Expiry (3 days)
- ⚡ Indexed Queries for Performance Optimization
- 🧾 Complete Transaction & Ledger History Tracking

🏗 Architecture Overview

User  
↓  
Account  
↓  
Transaction (Atomic Session)  
↓  
Ledger (Debit & Credit Entries)

Transfer Flow

1. Validate authentication
2. Start MongoDB session
3. Verify sufficient balance (credit - debit aggregation)
4. Create transaction record
5. Create two ledger entries:
   - Debit entry (sender)
   - Credit entry (receiver)
6. Commit transaction
7. Handle rollback on failure

🧠 Technical Concepts Implemented

- ACID Properties using MongoDB Sessions
- Double Entry Accounting System
- Idempotency Key Handling
- TTL Index for Automatic Token Cleanup
- Indexed Database Queries
- Secure Token Blacklisting
- Aggregation-based Dynamic Balance Calculation

🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
 
🚀 Deployment

https://backend-ledger-jirf.onrender.com
