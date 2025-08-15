---
layout: post
title:  "JWT in Rails"
date:   2025-08-14 11:28:41 +0530
categories: Rails
---

Imagine you have a **magic library card** 📇.

* Every time you visit the library (website), instead of writing your name and address every time, you just **show your magic card**.
* The librarian instantly knows who you are and what you can borrow — because **all the info is already inside that card**.
* The card is **signed** in a special way so no one can change it without breaking the magic seal.

That’s **JWT** (JSON Web Token) — a **digital magic card** that proves **who you are** without asking the server to look you up every time.

### Why We Need JWT

Without JWT:

* Every time you talk to the server, it must **look up your session in a database**.
* This makes servers slow and dependent on shared memory or a central store.

With JWT:

* The **token itself carries the identity and permissions**.
* No database lookup needed — the server just **checks the signature**.

### Problems JWT Solves

1. **Stateless Authentication** – No need to store session data on server.
2. **Cross-Service Login** – Easily pass user identity between microservices.
3. **Mobile / SPA Auth** – Works perfectly for APIs (no browser cookie dependency).
4. **Secure Info Sharing** – Can contain small bits of verified data that can’t be tampered with.

### When to Use JWT

✅ **Best for**:

* APIs & microservices
* Single Page Applications (React/Vue)
* Mobile app authentication
* Temporary access (e.g., password reset link)

❌ **Not ideal for**:

* Storing large data inside the token
* Long-lived sessions without refresh
* Sensitive data unless encrypted

### How JWT Works

1. User logs in with username/password
2. Server verifies credentials
3. Server creates JWT with user info + signs it with secret key
4. Server sends JWT back to user
5. User stores JWT (usually in browser)
6. For future requests: User sends JWT in request header
7. Server verifies JWT signature (without checking database)
8. If valid: Server trusts the user info in the JWT

### Rails Example

#### 1. Add the JWT gem

```ruby
gem 'jwt'
```

#### 2. Create a JWT service

```ruby
class JsonWebToken
  SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  end
end
```

#### 3. In your authentication controller

```ruby
class AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token }
    else
      render json: { error: 'Invalid credentials' }
    end
  end
end
```

#### 4. Middleware to verify tokens

```ruby
class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }
    end
  end
end
```

### Structure

JWT has **3 parts** (Base64 encoded, separated by dots):

```json
<Header>.<Payload>.<Signature>
```

Example:

```json
// Header (type & algo)
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload (claims)
{
  "sub": "user123",
  "role": "admin",
  "exp": 1713456000
}

// Signature = HMACSHA256(Base64(header) + "." + Base64(payload), secret)
```

### Core Concepts

* **Statelessness**: No server storage needed for auth state.
* **Claims**:

  * Registered claims (`exp`, `iat`, `iss`)
  * Public claims (`role`, `email`)
  * Private claims (custom, agreed between parties)
* **Signing Algorithms**:

  * `HS256` → Symmetric key (secret shared)
  * `RS256` → Asymmetric (private/public key pair)
* **Verification**:

  * Check signature matches with known key
  * Check `exp` (expiry) and `nbf` (not before) claims

### Security Pitfalls

* Never store sensitive info (like passwords) in JWT payload — it’s Base64-encoded, not encrypted.
* Always set expiry (`exp`) to avoid infinite tokens.
* Use HTTPS — JWTs can be stolen if sent over plain HTTP.
* Invalidate tokens via **short expiry + refresh tokens**.

### 🧵 TL;DR

* JWT = signed info package for **stateless authentication**.
* Removes the need for server session storage.
* Great for APIs, SPAs, and microservices.
* Must handle expiry, HTTPS, and secret key management for security.
