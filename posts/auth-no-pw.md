---
Title: Authenticating Without Knowing The Password
Date: 2025-09-21 17:00
Modified: 2025-09-21 17:00
Category: technology
Tags: tech, security, hash, password
Slug: auth-no-pw
Preview: Authentication is hard, but what's easy is passing the user's hash!
---

Authentication is hard. Really hard. There is a reason why authentication libraries exist, and why there are a lot of them. Though, really, the flow is basically the same: User provides credentials (username-password pair, OAuth, etc) -> Server validates it -> User gains their session (Session cookie, JWT tokens, or anything like that). However, the trick is always in the details. Under really specific circumstances, you might even be able to authenticate with just the password's hash, without knowing the password at all!

This technique is called [Pass-the-Hash](https://en.wikipedia.org/wiki/Pass_the_hash) (PtH), where an attacker is able to authenticate with only the user's hash and gain access to the system. This attack method is often used in Windows red team scenarios, but this scenario can be used everywhere, what we need to understand is the concept. So, let's try to understand this in context of a web application!

## The Credentials

I'll be talking for the simplest credential here, and ironically, where a lot of projects seems to run into pitfalls on: a username/email-password pair. Real simple. Though, they hash the user's password and only store the password's hash. So, what could possibly go wrong?

## Client Side Hashing

Let's see the situation in an attacker's PoV: What happens when you try to log in as a user? Say, our credential is `admin:admin`. They submit it, and see the traffic from the browser's Developer Tools or their beloved Burp Suite Proxy.

```
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
...

{"username":"admin","password":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}
```

The attacker would raise their eyebrow, as they would expect the password sent to be "admin", but instead, its a long hex string! Of course, they would want to know _why_ it submits a hash. Maybe the app tries to encrypt the password? hash it right away? So they look into the JS source code:

```html
<form id="login-form" method="POST" action="/login" autocomplete="on">
  <h1>Sign in</h1>

  <label for="username">Username</label>
  <input id="username" name="username" type="text" required />

  <label for="password">Password</label>
  <input id="password" type="password" required />

  <button type="submit">Continue</button>
</form>

<script>
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // SNIP
    const hash = await sha256(password);
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: hash }),
    });
    // SNIP
  });
</script>
```

<Notice header="Slight Tangent" faIcon="fa-info-circle" noticeType="info">
<p>A lot of developers seem to just take the "hash your password!!!" too literally, to the point they do it in the client side. Their reason being the password can be seen in the form data in plaintext. Which, well, technically not wrong, but they didn't see the complete picture.</p>
<p>The connection you have once you (eventually) deploy it would be HTTPS, that means the data you're sending is encrypted anyway, so there is no need to be scared of sending the plaintext password in the form data.</p>
<p>If you can't do HTTPS (or is able to serve in HTTP) then you might have bigger problems to deal with, anyway. HTTP in big 2025, really?</p>
</Notice>

So, what does this really mean to the attacker? Well, they can make an educated guess that the authentication algorithm is something like this:

```py
@app.post("/login")
def login(request):
    form_data = request.form
    user = db.users.get(username=form_data["username"])
    if user.password_hash != form_data["hash"]:
        return "Invalid credentials", 403

    res = make_response("OK")
    res.cookie.add("session", create_session_cookie(user))
    return res
```

This however, doesn't mean a thing for them. They don't even know if it's the correct algorithm or not! Therefore, it's not useful at all.
The attacker is just going to be stop there, and would just know this knowledge without any leads to get in.

In other words, yes, this might be a weird way to authenticate... but it doesn't pose any problem when isolated.

## Dumping The Credentials

Now that we know the authentication uses the hash of the password, what can we really do? One thing that we can do is to find a leaky endpoint that
might just dump the user's hash. This can be done in authenticated or unauthenticated way, but the point is that we need to find a way to get
any user's hash.

Let's say, for example, there is a public backend API to enumerate the user's information.

```
GET /user/2 HTTP/1.1
Host: api.example.com
...
```

```
HTTP/1.1 200 OK
Content-Type: application/json
...

{"id": 2, "username": "ren", "name": "Ren", "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342", "role": "admin"}
```

Because the password hash itself is leaked from said endpoint, we can then try to enumerate and "harvest" all of the user's password hash. Therefore,
we are able to login as any user in the webapp, simply by using the password hash we extracted from the leaky endpoints!

Let's try logging in with this "ren" account from the information we get.

```
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
...

{"username":"ren","password":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}
```

```
HTTP/1.1 200 OK
Content-Type: text/plain
Set-Cookie: session=.....;

OK
```

We get their session, and is now able to use the app on behalf of "ren"!

## Going Further

As an attacker, you might want to know _more_ of the user rather than being able to just log in into that specific website. Maybe, the user
is tied to another service? maybe it's in an LDAP server? The user likely share their password for multiple services, so you could maybe crack the hash!

Of course, doing this requires us to understand the authentication mechanism first. We can't just blindly guess the next step as it could lead
us to some unexpected rabbit holes.

For example, in our case, we already know the following:

- The authentication uses username-password
- When sent to password, the password is hashed with SHA256
- We are able to harvest all the hashes

Then, we can simply crack all the hashes, maybe with hashcat. It is out of scope from this blog, but you can do your own research on this :p Just be mindful that maybe you might need to create a custom password cracker on your own. (I've need to do that before!)

However, here are some ideas that you can try:

- Try looking for other services with similar authenticated method, maybe you can send the hash as-is?
- If you can't enumerate other user's password, but you CAN enumerate users, maybe try using the same hash for everyone (hash spraying? lol)

## Key Takeaways (as a Developer)

So, what can we learn from this?

- Run all the hashing in the server. It's the only place you can trust anyway
- Don't forget to exclude certain fields from your API responses
- [Salt your password!!!!!!!!!!!](https://en.wikipedia.org/wiki/Salt_%28cryptography%29)

If you've already done this before and felt dumb, don't worry. I mean,
[we can attack Windows machines with the same technique, using their NT hash](https://www.thehacker.recipes/ad/movement/ntlm/) :p
