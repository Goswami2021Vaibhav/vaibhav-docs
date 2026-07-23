---
title: Security & Privileges
description: User accounts, GRANT/REVOKE, and preventing SQL injection at the database layer.
sidebar_position: 15
---

# Security & Privileges

## 1. What is user account management in MySQL, and how do you create a new user?

### 📖 Introduction

Every other security topic covered throughout this chapter — privileges, least privilege, encryption — ultimately attaches to a specific database user account, making user management the genuine starting point for this entire chapter.

### 👤 What a MySQL User Account Is

A MySQL user account is an identity, defined by a username and the specific host it's allowed to connect from, that a client authenticates as when connecting to the database — genuinely distinct from an application-level user account, tying back to the authentication concepts covered in the Express.js guide's Authentication & Authorization chapter, which represents an entirely different, application-specific layer of identity.

### ✍️ Creating a New User

```sql
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'a-strong-password';
```

Creates a new user account, `app_user`, allowed to connect only from `localhost`, authenticating with the given password — this account exists independently of any privileges, covered in the next question, which need to be explicitly granted afterward.

### 🌐 Why the Host Matters

The `'app_user'@'localhost'` syntax specifies both a username and a host — the same username connecting from a different host is treated as a genuinely separate account with potentially different privileges, letting a database restrict exactly where a given set of credentials can even be used from.

### 💎 Good to Know: A Database User Account Is a Genuinely Different Layer of Identity Than an Application User Account

The important distinction worth internalizing at the start of this chapter: a MySQL user account authenticates a connection to the database itself, while an application's own users, covered throughout the Express.js guide's Authentication & Authorization chapter, are typically just rows in a table that the application's single database connection reads and writes — two entirely separate concerns that happen to share similar terminology.

### ❓ Follow-up Interview Questions

1. Why does the host specified in `CREATE USER` matter, beyond just the username?
2. Why does creating a user account alone not grant it any actual privileges?
3. How does a MySQL user account genuinely differ from an application-level user account, covered in the Express.js guide's Authentication & Authorization chapter?
4. Why might the same username be allowed to connect from one host but not another?
5. What would happen if an application tried to connect using a username that existed for a different host?

---

## 2. What are GRANT and REVOKE, and how do they control access to database objects?

### 📖 Introduction

Creating a user account, covered in the previous question, grants no actual access at all by default — `GRANT` and `REVOKE` are the two statements that actually control what a given account can do.

### ✅ GRANT

`GRANT` gives a user account specific privileges on specific database objects — tables, entire databases, or even specific columns.

```sql
GRANT SELECT, INSERT, UPDATE ON myapp.orders TO 'app_user'@'localhost';
```

Allows `app_user` to read, insert, and update rows in the `orders` table specifically, within the `myapp` database — notably, without granting `DELETE`, meaning this account genuinely cannot remove rows from that table at all.

### ❌ REVOKE

`REVOKE` removes previously granted privileges — the exact mirror operation of `GRANT`.

```sql
REVOKE UPDATE ON myapp.orders FROM 'app_user'@'localhost';
```

Removes the ability to update `orders`, while leaving the previously granted `SELECT` and `INSERT` privileges intact.

### 🎯 Why Granular Privilege Control Matters

Granting only the specific privileges an account genuinely needs — rather than broad, blanket access — directly limits the damage a compromised application account, covered in more depth in the next question's discussion of least privilege, could actually do, since an attacker who obtains those specific credentials is bound by exactly the same restricted privileges.

### 💎 Good to Know: Privileges Apply Independently at Multiple Levels of Granularity

The genuinely useful detail worth knowing: `GRANT`/`REVOKE` can apply at the level of an entire server, a specific database, a specific table, or even specific columns within a table — letting access be scoped as tightly, or as broadly, as a given situation genuinely requires.

### ❓ Follow-up Interview Questions

1. Why does creating a user account, covered in the previous question, not automatically grant it any privileges?
2. In the concrete GRANT example, what specifically can `app_user` not do to the `orders` table?
3. Why would REVOKE be used to remove just one specific privilege while leaving others intact?
4. Why does granting only specific, needed privileges limit the damage from a compromised account?
5. At what different levels of granularity can a privilege actually be granted?

---

## 3. What is the principle of least privilege, and how does it apply to database user accounts?

### 📖 Introduction

`GRANT` and `REVOKE`, covered in the previous question, are the mechanism — least privilege is the actual guiding philosophy that determines how they should be used in practice.

### 🔒 What the Principle States

Every account should have exactly the privileges it genuinely needs to do its job, and nothing more — no broader access "just in case," and no convenient but unnecessary blanket permissions.

### 🎯 Why This Matters Specifically for Database Accounts

A compromised account — through a leaked credential, or an SQL injection vulnerability, covered in more depth in the next question — can only do as much damage as the privileges it actually holds, covered in the previous question's discussion of granular GRANT/REVOKE. An application account with only `SELECT`, `INSERT`, and `UPDATE` on specific tables genuinely cannot `DROP` a table or read from an entirely unrelated database, even if fully compromised.

### 🖼️ A Concrete Illustration

An application's own database connection should never use the MySQL `root` account, covered in more depth in a later question in this chapter — instead, a dedicated account with exactly the privileges that specific application genuinely needs on exactly the tables it genuinely uses, following the granular GRANT syntax covered in the previous question.

### 🎯 Applying This Beyond Just the Application's Main Account

A reporting tool that only ever reads data should have an account granted only `SELECT`, never `INSERT`, `UPDATE`, or `DELETE` — even though, technically, granting broader access would also "work," least privilege means deliberately not doing so.

### 💎 Good to Know: Least Privilege Is About Limiting Blast Radius, Not About Distrusting Any Specific Account

The genuinely important framing, tying back to the defense-in-depth theme covered throughout the Express.js guide's Security chapter: least privilege isn't about assuming any given account will definitely be compromised — it's about deliberately limiting how much damage is possible if one ever is.

### ❓ Follow-up Interview Questions

1. Why does an application account's blast radius, if compromised, depend directly on its actual granted privileges?
2. Why shouldn't an application's own database connection ever use the MySQL root account?
3. In the reporting-tool example, why should that account never be granted INSERT, UPDATE, or DELETE, even though it would technically also work?
4. How does this principle connect to the defense-in-depth theme covered in the Express.js guide's Security chapter?
5. How would you audit an existing set of database accounts to check whether they actually follow least privilege?

---

## 4. How does SQL injection work, and how do parameterized queries prevent it at the database layer?

### 📖 Introduction

SQL injection already received full application-layer treatment in the Express.js guide's Security chapter — this question revisits it specifically from the database's own side of the connection, focused on exactly what a parameterized query does differently at that layer.

### 💉 A Brief Recap of the Attack

SQL injection occurs when unvalidated user input gets concatenated directly into a query string — an attacker-supplied value like `' OR '1'='1` can hijack a query's actual logic, covered in full in the Express.js guide's Security chapter, potentially returning or modifying far more data than the query was ever intended to touch.

### 🛡️ What a Parameterized Query Does Differently, at the Protocol Level

A parameterized query sends the query's structure and its actual data values to MySQL as two genuinely separate things, over the connection protocol itself — the query template is compiled first, with placeholders standing in for values, and the actual data is bound to those placeholders afterward, in a completely separate step.

### 🖼️ A Concrete Illustration

```sql
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ?';
SET @username = 'alex';
EXECUTE stmt USING @username;
```

Because `@username`'s value is bound to the already-compiled query's placeholder, rather than concatenated into the query text itself, there's no way for its content to ever be interpreted as part of the query's structure — even a maliciously crafted value like `' OR '1'='1` would simply be treated as a literal string being searched for, not as executable query syntax.

### 🎯 Why This Makes Injection Structurally Impossible, Not Just Unlikely

Since the query's structure is already fixed and compiled before the actual data value is ever considered, there's no remaining opportunity for that data to be interpreted as anything other than a literal value — this is a genuinely structural guarantee, not merely a best-effort mitigation.

### 💎 Good to Know: This Question's Value Is the Two-Phase, Protocol-Level Mechanism, Not the Attack Itself

The genuinely new depth here, beyond the Express.js guide's own application-layer coverage, is understanding precisely why parameterization works — the query and its data are physically separate at the wire protocol level, not just conceptually separate in application code.

### ❓ Follow-up Interview Questions

1. Why does concatenating user input directly into a query string let an attacker change the query's own logic?
2. Why does binding a value to an already-compiled query's placeholder prevent it from being interpreted as query syntax?
3. Why is parameterization described as a structural guarantee rather than a best-effort mitigation?
4. How does this database-layer mechanism relate to the application-layer SQL injection coverage in the Express.js guide's Security chapter?
5. Would an ORM automatically protect against SQL injection? Why or why not?

---

## 5. What is the difference between authentication and authorization in the context of a database?

### 📖 Introduction

This exact distinction already received full application-layer treatment in the Express.js guide's Authentication & Authorization chapter — this question applies the same underlying concepts specifically to a database connection itself.

### 🪪 Authentication: Verifying the Connecting User's Identity

A MySQL user account, covered earlier in this chapter, authenticating with a username and password when establishing a connection — confirming that whoever is connecting genuinely is who they claim to be, exactly the "who are you" question covered generally in the Express.js guide's Authentication & Authorization chapter.

### 🔐 Authorization: What That Authenticated Account Is Allowed to Do

Once connected, the privileges granted via `GRANT`, covered earlier in this chapter, determine what that specific, already-authenticated account is actually allowed to do — query certain tables, modify certain data, or nothing at all beyond what's been explicitly granted.

### 🖼️ A Concrete Illustration

`app_user` successfully authenticating with the correct password proves its identity — but if it was only ever granted `SELECT` on `orders`, covered earlier in this chapter, attempting a `DELETE FROM orders` fails, not because authentication failed, but because that authenticated account was never authorized to perform that specific action.

### 🎯 Why Both Layers Matter Together

Authentication alone doesn't limit what a legitimately connected account can do; authorization alone is meaningless without first confirming genuine identity — exactly the same "authorization always requires authentication first" relationship covered generally in the Express.js guide's Authentication & Authorization chapter, now applied specifically to database connections.

### 💎 Good to Know: This Distinction Is the Same One Covered Generally Elsewhere, Now Applied to the Database Connection Itself

The genuinely important connective insight is recognizing that this chapter's `CREATE USER`, covered earlier in this chapter, handles authentication, while `GRANT`/`REVOKE`, also covered earlier in this chapter, handle authorization — the exact same conceptual split covered generally in the Express.js guide, mapped directly onto specific MySQL mechanisms.

### ❓ Follow-up Interview Questions

1. Why does successfully authenticating as `app_user` not guarantee that every operation it attempts will succeed?
2. Which MySQL statement handles authentication, and which handles authorization, both covered earlier in this chapter?
3. Why must authorization always be checked after authentication, never before?
4. How does this distinction map onto the general authentication-versus-authorization concept covered in the Express.js guide?
5. What error would you expect if an authenticated account attempted an action it was never granted?

---

## 6. How should sensitive data, like passwords, be stored in a database?

### 📖 Introduction

Password hashing already received full treatment from an application-implementation perspective in the Express.js guide's Authentication & Authorization chapter — this question confirms the same principle applies regardless of which database or application actually implements it.

### 🔒 The Core Principle, Recapped

Passwords should never be stored in plain text — a one-way hashing algorithm like bcrypt, covered in full in the Express.js guide's Authentication & Authorization chapter, combined with a unique salt per password, transforms a password into a value that can't feasibly be reversed, while still allowing login verification by re-hashing an attempted password and comparing the results.

### 🗄️ Why This Is a Database-Layer Concern Too, Not Just an Application Concern

Regardless of which specific application or framework handles the actual hashing, covered in the Express.js guide, the database itself only ever stores the resulting hash — the database schema should never define a plain-text `password` column at all, only a `password_hash` column, making it structurally impossible for the raw password to ever even be written to storage in the first place.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL
);
```

Naming the column `password_hash`, sized appropriately for bcrypt's fixed-length output, rather than `password`, is a small but genuinely meaningful schema-design signal that no plain-text value should ever be stored there.

### 💎 Good to Know: The Schema Itself Should Make Storing a Plain-Text Password Structurally Awkward or Impossible

The genuinely useful, practical takeaway specific to schema design: naming and sizing the column specifically for a hash's output, rather than a plausible plain-text password, is a small but real safeguard against an accidental mistake later.

### ❓ Follow-up Interview Questions

1. Why should a database schema never include a plain-text `password` column at all?
2. Why does sizing a column specifically for bcrypt's fixed-length hash output serve as a small safeguard?
3. How does this database-layer concern relate to the hashing mechanics covered in the Express.js guide's Authentication & Authorization chapter?
4. Why does this principle apply regardless of which specific application or framework handles the actual hashing?
5. What would you look for when auditing an existing schema to confirm passwords are being stored correctly?

---

## 7. What is data encryption at rest, and how does MySQL support it?

### 📖 Introduction

Password hashing, covered in the previous question, protects one specific, sensitive column — encryption at rest protects the entire database's stored files more broadly, against a genuinely different threat.

### 💾 What Encryption at Rest Means

Encryption at rest means data is encrypted while physically stored on disk — protecting against a scenario where the underlying storage itself is accessed directly, bypassing the database entirely: a stolen physical drive, an improperly secured backup file, or unauthorized access to the server's file system.

### 🔧 How MySQL Supports It

InnoDB, covered in the Introduction & Fundamentals chapter, supports transparent data encryption at the tablespace level — data is automatically encrypted when written to disk and automatically decrypted when read back by an authorized connection, with the encryption and decryption happening transparently, invisible to any application code or query.

### 🎯 What This Protects Against, Specifically

Someone who gains access to the raw database files directly — bypassing MySQL's own connection and privilege system, covered throughout this chapter, entirely — still can't read the actual data without also having the appropriate encryption keys.

### 🖼️ A Concrete Illustration

A backup file, covered in more depth in the Replication, Backup & Scaling chapter later in this guide, copied off a server and later stolen or leaked, remains unreadable without the corresponding encryption key — even though the exact same backup, without encryption at rest enabled, would have been immediately readable by anyone who obtained it.

### 💎 Good to Know: Encryption at Rest Protects Against Storage-Level Access, Not Against a Compromised, Legitimately Connected Application Account

The genuinely important scope to understand: encryption at rest specifically protects against someone bypassing MySQL's connection layer entirely and reading raw files directly — it does nothing to limit what a legitimately connected, authorized account (or one whose credentials were compromised) can already see, which is exactly why it complements, rather than replaces, the privilege and least-privilege coverage earlier in this chapter.

### ❓ Follow-up Interview Questions

1. Why does encryption at rest specifically protect against a stolen physical drive or leaked backup file?
2. Why is the encryption and decryption process described as "transparent" to application code?
3. Why doesn't encryption at rest limit what a legitimately connected, authorized account can see?
4. How does encryption at rest complement, rather than replace, the least-privilege coverage earlier in this chapter?
5. Why does this protection specifically matter for backup files, covered in more depth in the Replication, Backup & Scaling chapter?

---

## 8. What is data encryption in transit, and why does it matter for database connections?

### 📖 Introduction

Encryption at rest, covered in the previous question, protects data sitting on disk — encryption in transit protects that same data while it's actually traveling over the network between a client and the database.

### 📡 What Encryption in Transit Means

Encrypting the actual connection between a client application and the MySQL server, typically using TLS, tying back to the same underlying protocol covered in the Node.js guide's Networking chapter and the Express.js guide's Security chapter's discussion of HTTPS — preventing anyone intercepting network traffic between the two from reading the data actually being exchanged.

### ⚠️ What's at Risk Without It

Without encryption in transit, a query's actual content — including any sensitive data being read or written, and potentially the connection's own authentication credentials — travels across the network in plain text, readable by anyone able to intercept that traffic, particularly significant when an application and its database aren't on the exact same trusted, private network.

### 🔧 How MySQL Supports It

MySQL supports establishing a TLS-encrypted connection between client and server, configured via connection parameters requiring or preferring an encrypted connection, rather than defaulting to an unencrypted one.

### 🖼️ A Concrete Illustration

An application server connecting to a managed MySQL database hosted by a separate cloud provider, over the public internet or a shared network, without TLS enabled, risks that connection's traffic being intercepted — enabling TLS closes off that specific risk, the same way HTTPS, covered in the Express.js guide's Security chapter, protects a browser's own connection to a web server.

### 💎 Good to Know: Encryption at Rest and in Transit Protect Two Genuinely Different Points Along Data's Journey

The genuinely important synthesis tying this question back to the previous one: encryption at rest protects data sitting still on disk; encryption in transit protects that same data while it's actually moving across the network — a complete security posture, covered in more depth in the Deployment & Production-equivalent chapter later in this guide's discussion of production architecture, genuinely needs both.

### ❓ Follow-up Interview Questions

1. Why does a query's content risk being read by an interceptor without encryption in transit?
2. Why does this risk become more significant when an application and its database aren't on the same trusted network?
3. How does MySQL's TLS support relate to the HTTPS coverage in the Express.js guide's Security chapter?
4. Why do encryption at rest and encryption in transit protect two genuinely different points, rather than one covering the other?
5. Would enabling only one of these two forms of encryption leave a genuine gap? Which one, and why?

---

## 9. What are common database security mistakes (e.g., using root for application access, overly broad privileges)?

### 📖 Introduction

Beyond any single mechanism already covered in this chapter, it's worth naming the specific, recurring mistakes that actually show up in real-world MySQL deployments.

### ⚠️ The Common Mistakes

- **Using the root account for application access** — directly violating the least-privilege principle covered earlier in this chapter; a compromised application with root access can do genuinely anything to the entire database server, not just the tables it actually needs.
- **Overly broad privileges** — granting `ALL PRIVILEGES` out of convenience rather than the specific privileges an account genuinely needs, covered earlier in this chapter's discussion of granular GRANT.
- **Hardcoding database credentials directly in source code** — tying back to the Node.js guide's Environment Variables & Configuration chapter's coverage of the Twelve-Factor App principle, rather than injecting them securely via environment variables.
- **Leaving default accounts or weak passwords in place** — a genuinely common, easily avoidable oversight, especially on a freshly provisioned database server.
- **No encryption in transit for a database accessible over a shared or public network** — covered earlier in this chapter, leaving connection traffic readable to anyone able to intercept it.
- **Relying solely on application-level validation, with no database-level constraints** — tying back to the Constraints chapter's discussion of constraints as an independent enforcement layer.

### 🖼️ A Concrete Illustration

An application connecting as `root`, with its credentials hardcoded directly in a committed configuration file, over an unencrypted connection to a database accessible from the public internet — a genuinely realistic combination of several of these mistakes stacking together into a severe, compounded risk.

### 💎 Good to Know: Nearly Every Mistake Here Is a Failure to Apply a Principle Already Covered Elsewhere in This Chapter or This Guide

Recognizing each specific real-world mistake and mapping it back to the underlying principle it violates — least privilege, secrets management, encryption in transit, defense-in-depth — is exactly the practical, diagnostic skill this question, and the next, is testing for.

### ❓ Follow-up Interview Questions

1. Why does using root for application access violate least privilege even if the application "only ever" reads and writes a few specific tables?
2. Why is granting `ALL PRIVILEGES` out of convenience a genuine security risk rather than a harmless shortcut?
3. Why does hardcoding database credentials in source code create risk even in a private repository?
4. In the compounded concrete example, which single change would most reduce the overall risk?
5. Why do so many of these mistakes trace back to principles already covered earlier in this chapter or guide?

---

## 10. How would you audit a MySQL database for security vulnerabilities?

### 📖 Introduction

This capstone question for the chapter turns every individual principle and mistake covered throughout this chapter into an actual, systematic, practical checklist.

### 👤 Step 1: Review User Accounts and Privileges

Check for any account using root for routine application access, covered in the previous question, and review every account's actual granted privileges against least privilege, covered earlier in this chapter — using `SHOW GRANTS FOR 'user'@'host';` to see exactly what's currently granted.

### 🔐 Step 2: Confirm Secrets Are Managed Properly

Verify database credentials are injected via environment variables or a dedicated secrets manager, tying back to the Node.js guide's Environment Variables & Configuration chapter, rather than hardcoded anywhere in source code, covered in the previous question.

### 🔒 Step 3: Verify Encryption Is Properly Configured

Confirm encryption at rest, covered earlier in this chapter, is enabled for sensitive tablespaces, and encryption in transit, also covered earlier in this chapter, is enforced for all client connections, especially over any shared or public network.

### 🗝️ Step 4: Check Password Storage

Confirm the schema stores only password hashes, never plain text, covered earlier in this chapter, and that hashing uses an appropriately slow, salted algorithm.

### 🛡️ Step 5: Confirm Injection Defenses Are Actually in Place

Verify application code genuinely uses parameterized queries, covered earlier in this chapter, consistently, rather than string concatenation anywhere in the codebase — a targeted code review specifically looking for this pattern.

### 📋 Step 6: Cross-Reference Against the OWASP Top 10

Tying back to the Express.js guide's Security chapter's coverage of the OWASP Top 10 as a systematic reference — using it as an additional, independent checklist alongside this database-specific one.

### 💎 Good to Know: A Security Audit Is Just This Chapter's Own Principles, Walked Through Systematically Against a Real Database

The genuinely important synthesis closing out this chapter: an audit isn't a separate skill from understanding these individual principles — it's the exact same principles, covered throughout this chapter, applied deliberately and systematically to an existing, real database rather than considered in the abstract.

### ❓ Follow-up Interview Questions

1. Why does `SHOW GRANTS` matter as a concrete, practical tool for the least-privilege review step?
2. Why should encryption in transit specifically be checked for any connection over a shared or public network?
3. Why does verifying parameterized query usage require an actual code review, rather than a purely database-side check?
4. How does the OWASP Top 10, covered in the Express.js guide's Security chapter, serve as a useful cross-check during this audit?
5. If asked to walk through this entire audit process from memory, what's the correct order of these steps?

---