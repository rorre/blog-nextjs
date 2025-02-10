---
Title: "PERAK: Implementing Group Invitations Code"
Date: 2022-01-16 12:00
Modified: 2022-01-16 12:00
Category: technology
Tags: tech
Slug: perak-invite
Preview: A slightly overengineered solution to code, but I learnt a lot!
---

New year, new projects show up. Around November of 2021, I was invited to join the IT Development team for a faculty event, named _Pesta Rakyat Komputer_ (PERAK). To summarize, in that event we play games for fun, sort of like a school festival. There are Valorant, League of Legends, osu!, and a few other competitions there. Usually—or so I've been told—the site is used only for information center, such as leaderboards. This year, they decided to take the site further and do all of the administration in site. In this post, I will talk about one specific part of the site: **Group Invitations**, the code generation part, to be precise.

## Rough Idea

Alright, obviously before we work on something, we have to get the idea of what we're going to implement. This has been handled by UI/UX team and they have gave us the wireframe, flow and whatnot. So, basically:

- One user creates a team
- The user does payment for it
- After payment is done, they are able to invite others
- Invitation will be shared via link and token number with 15 minutes valid time
- Other user joins via link or inputting token number

Cool, seems pretty straightforward, yeah? Now, the technology we are currently using is [Strapi v4](https://strapi.io/) using PostgresQL as database. Naturally, our team member points out to store the token inside the model. However I don't exactly agree with that, for a few reasons:

- We will require another expiration field  
  Not a big problem, but if we were to expand the model further, it would look very cluttered. Plus if we are not careful with our field naming, it could look like the field is referencing the _entire row_, instead of _just the token_. (For example, naming the field `expireTime`).
- We might _accidentally_ expose the token to the public  
  With how Strapi works, if we are not careful about what we reply, we might accidentally expose the token to the public. Better be safe than sorry, right?
- Do we really have to store the token inside it?!  
  I mean, it works, but it's just a one time thing, and it often updates due to how quick the token expires, not to mention we have to make sure that it is unique. That would require a lot of I/O operations.

Given the reasons, what did I suggest (and end up with)?

## Hello, Redis

We end up using Redis, if you don't know what Redis is, this short introduction for the site might give you an idea of what it is:

> Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker. Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.

Redis is chosen because it is:

- Fast  
  I mean, it's in-memory, and there is a hash data structure, don't think any explanation is needed.
- Simple  
  There is only a few command that we would need (spoiler: only 2) and it's pretty lightweight, so why not?

Unfortunately, it is only available in Linux based systems\*, but it doesn't matter much since we already uses Docker in our project. Though, that would add further memory usage (for Windows users especially). But we thought it isn't very major as we can still handle it.

\*Yes, I am aware that there are unofficial port for Windows, but they're all old at this point.

## Implementation

To get started, you will have to keep in mind a few things:

- We will use hashes here, think of it like `dict` in Python
- There will be two hashes: `codes-to-id` and `id-to-codes`, each maps to the key to its value like how the hash is named
- The flow will look similar to the following:
  - `getIdFromCode` or `getCodeFromId`:
    1. Simply call `HGET <hashName> <key>`
    2. Decode our data and return  
       If none found or is expire, just return `[null, null]`
  - `getOrCreateCode` (from ID):
    1. Call `getCodeFromId`
    2. If code is not null, then return it
    3. Else, create new  
       !! We have to ensure that it is actually unique somehow !!
    4. Return newly created code
- Code **must** be in form of 6 digit number.

Knowing them, let's actually implement this!

### Encoding Our Data

Since the value of the field inside a hash can only be a string, we need to think of a way to put our data inside a string. Because we will only need to store two things in the value, that is `id/code` and `expireTime`, we can simply convert `expireTime` into unix timestamp then concatenate, separating them with a character. In this case, I decided to use colon (`:`) as separator. You may use anything, just make sure your separator will never be in the values.

### Fetching Data

Fetching will be very necessary in our flow, as everything will depend on it. Hell, even code creation! Therefore, With given flow we have know before, it would look something like this:

```js
function isExpired(currentTime, expireTimeStr) {
  const expireDateTime = new Date(Number(expireTimeStr));
  return currentTime > expireDateTime;
}

/**
 * Fetch ID from code
 * @param {RedisClient} redis - Redis instance.
 * @param {number} code - Code to fetch.
 * @returns {string[]}
 */
async function getIdFromCode(redis, code) {
  const result = await redis.hGet("codes-to-id", code);

  if (!result) return [null, null];
  const [id, expireTimeStr] = result.split(":");

  if (isExpired(new Date(), expireTimeStr)) return [null, null];
  return [id, expireTimeStr];
}

/**
 * Fetch code from ID
 * @param {RedisClient} redis - Redis instance.
 * @param {number} id - ID to fetch.
 * @returns {string[]}
 */
async function getCodeFromID(redis, id) {
  const result = await redis.hGet("id-to-codes", id);

  if (!result) return [null, null];
  const [code, expireTimeStr] = result.split(":");

  if (isExpired(new Date(), expireTimeStr)) return [null, null];
  return [code, expireTimeStr];
}
```

Yep, they're actually very simple! Infact, the only change is only at the variable and the hash name! (`id-to-codes` vs `codes-to-id` in `redis.hGet()`). You could refactor this of course, but the goal here is to give you the rough idea on how it works.

### Get or Creating New

The fetching part is out of our way now, so let's go to the next part, creating `getOrCreateCode`! The code here will be more complex, but I believe it is still pretty straightforward. But first, we have to think about how we would generate the code. There are two options:

- Generate first, then check if it's available by requesting to redis
- Get all used keys first, then pick any that is available

The first option requires us to request a lot to Redis, at most N times where N is the size of the hash (which, at worst case will be 999999 members). Whereas the second option requires redis to navigate each member of the hash, with the time complexity of `O(n)` in total, where n is the size of the hash. The second option is also pretty unreliable as we only get the keys, not the values. So we cannot tell if the key is actually already expired or not. Whereas using the first option enables us to use an already previously used key and replace it with something new. Therefore, I decided to pick the first option.

The resulting code looks something similar to this

```js
async function getOrCreateCode(redis, id) {
  const [code, expireTimeStr] = await getCodeFromID(redis, id);
  if (code) return [code, expireTimeStr];

  const expireTime = new Date();
  expireTime.setTime(expireTime.getTime() + 1000 * 60 * 15); // + 15 minutes
  const expireTimestamp = Math.floor(expireTime.getTime());

  let existingCode;
  let newCode;
  while (true) {
    // (999999 - 100000) + 100000 ensures that it will always be 6 digits
    newCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
    existingCode = await getIdFromCode(redis, newCode.toString());
    if (!existingCode[0]) break;
  }

  const redisCodeData = `${newCode}:${expireTimestamp}`;
  const redisIdData = `${id}:${expireTimestamp}`;

  await redis.hSet("codes-to-id", newCode, redisIdData);
  await redis.hSet("id-to-codes", id, redisCodeData);
  return [newCode, expireTimestamp.toString()];
}
```

If your eyes are sharp, you might see one problem: **the `while(true)` loop**. What would happen if all 999999 slots are filled? Well, it would be in an infinite loop until one of the slot is expired. Sure some of you might think that's unrealistic, but on really big application this is a totally possible situation. I thought of increasing the digit to mitigate it but you may have a better option.

There is also the problem that expired tokens will always be present in memory, until it gets replaced with something else. And that is indeed true, but I don't really believe that making a routine to clean them up is very critical, unless you are in a situation where memory is very precious. In that case I could only advice you to be very careful as you're handling with two hashes.

## Wrapping Up

The event is still ongoing, and we were only doing the first half of it! There should be much more interesting things that I could possibly share. Maybe anti-cheat measurements? Who knows. Regardless though, it was pretty fun and I learn a lot from it, so I'm looking forward with how this event will go.

Thank you for reading!
