---
layout: post
title:  "🍪 Cookies vs 🗄 Sessions in Rails"
date:   2025-08-15 11:28:41 +0530
categories: Rails
---

### Simple Difference
- **Cookie** = Small piece of data stored in the **browser**.
- **Session** = Server-side data **linked to a cookie** that identifies you.

Think:
- Cookie → "Your library card" 📇
- Session → "Books you’ve borrowed" 📚 stored at the library.

### Rails Examples

#### Cookie Example – Remember User Preferences
```ruby
cookies[:theme] = "dark"
cookies[:theme] # => "dark"
```

#### Session Example – Keep User Logged In

```ruby
def create
  user = User.find_by(email: params[:email])
  if user&.authenticate(params[:password])
    session[:user_id] = user.id
    redirect_to dashboard_path
  else
    flash[:error] = "Invalid credentials"
    render :new
  end
end
```

### Storage & Format

**Cookies**:

* Stored **client-side** in browser.
* Size limit \~4KB.
* Plaintext unless encrypted/signed.

**Sessions in Rails 8**:

* By default, stored in **encrypted cookie store** (client-side, but unreadable).
* Can be stored in DB, cache, or Redis for larger data.
* Session cookie holds encrypted JSON blob.

### Rails Internal Implementation

**Default Config** (`config/initializers/session_store.rb`):

```ruby
Rails.application.config.session_store :cookie_store, key: '_app_session', secure: true
```

* **`cookies.signed`** → signed to prevent tampering.
* **`cookies.encrypted`** → encrypted + signed.
* **Session** uses `ActionDispatch::Cookies` + `ActionDispatch::Session` middleware.

### Security Considerations

1. **Never store sensitive data directly in plain cookies**.
2. Use `cookies.encrypted` or sessions for sensitive info.
3. Set `secure: true` (HTTPS only) and `httponly: true` (no JS access).
4. Rotate secret keys if compromised.
5. Keep session data minimal → less network overhead.

### Performance Tips

* Use cookies for **small, infrequently changed** preferences (theme, language).
* Use sessions for **user state** that must be tamper-proof.
* For large session data, move to Redis/memcache to avoid cookie bloat.

### TL;DR

* Cookie = browser storage, Session = server-managed user state.
* Rails sessions often stored in encrypted cookies by default.
* Keep data small, secure, and use HTTPS.
