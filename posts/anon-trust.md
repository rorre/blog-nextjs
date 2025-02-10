---
Title: On Anonymity And Trust
Date: 2021-09-18 20:00
Modified: 2021-09-18 20:00
Category: technology
Tags: tech, anon, menfess, anonymity
Slug: anon-trust
Preview: There is a bit of a problem with Indonesian Twitter's menfess system...
---

The internet has its own miracle, because no one really knows who you are in the real world (well, unless you deanonymize yourself, of course). By default, what people see is just another person on the internet, and that's all. But, there is a bit of a problem with Indonesian Twitter's menfess system...

# What Menfess Is

Menfess is--to keep it simple--a (bot) account on Twitter that takes DMs from people (or just their accepted/followings accounts) and tweets the message anonymously. Such example of these are [@sbmptnfess](https://twitter.com/sbmptnfess) and [@utbkfess](https://twitter.com/utbkfess). They're usually limited to a certain topic or theme, and is moderated by a few admins.

To most people, this doesn't seem to be a bad idea, they can be anonymous while sending whatever they want without the feel of being judged by people. Or they can simply use that as a media to reach much more people to engage with their statement and/or question. What they have to believe is that the admins or moderators or anyone who is in charge of the account won't simply deanonymize them, and the key here is **trust**. The thing is, _can you trust them?_

# Trustability

There is no doubt that all of the anonymous _fess_ sent in those account are actually available in plain text in the account's DMs. The account holder--hell, maybe the bot creator--could easily look over and see who actually sends it. This does not necessarily pose a problem on big accounts, as there would be lots and lots of DMs coming in and it would drown anyway, but it _could_ be a problem on smaller accounts. The number of DMs that comes are small and thus someone that holds the account could simply just inspect what you sent and know who actually sends it, adding the chance of someone leaking it. Therefore, it might just be not the best idea to send in something that is sensitive to them.

# How About Pacilfess?

While Pacilfess does in a way suffer the same sort of problem, I made it specifically to hash the user ID so that no one who has the database (including myself) could directly know who is actually behind it. **However**, there could still a way to deanonymize, which is to bruteforce who the hell actually posts it, but that takes quite some time and to be frank I would be way too lazy to do that. This is how it looks like in the database, if you wish to know:

| id   | server_id          | message_id         | user_id                                                          | content           | sendtime   | attachment |
| ---- | ------------------ | ------------------ | ---------------------------------------------------------------- | ----------------- | ---------- | ---------- |
| 1422 | 871324023500464169 | 886565236075798538 | eab4e59e7c00df6da02aa3958709ff182c26ef2ca306c5807dd10e0340f092ee | yes gue juga gitu | 1631444023 |

`user_id` is hashed with SHA-256 from Discord's UID.

# Conclusion

Sending a message anonymously sounds great, but you need to put trust on them. And personally, I won't put trust on some random on the internet easily. So, I would say that to refrain from posting anything controversial or sensitive especially on smaller menfess accounts, since there is a possibility that someone could just leak you. Or just don't post those stuffs, really. Just keep it to yourself unless you know what the heck you are doing.

On things like Discord bots, there is a chance that someone could just log everything in plain text, so better be sure to read their privacy policy and if possible, the source code.

That's all, have a nice day.
