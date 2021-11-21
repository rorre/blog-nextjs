---
Title: 'Karya Angkatan: Behind The Scene And User Input Messiness'
Date: 2021-11-21 11:00
Modified: 2021-11-21 11:00
Category: technology
Tags: tech
Slug: ka-mess
---

In my faculty, for freshmens we are introduced with a bunch of events and tasks to further bond ourselves. One of it is _Karya Angkatan_, in which we are tasked to make something where everyone is able to contribute. For our year, we decided to follow last year's path and make a yearbook site. The deadline was long, around 3 months, so it is a pretty relaxed task. Here, I will talk about the technology being used in the site's back-end and how everything will be done, really.

## Evaluation From Previous Work

Before I start on planning things, I decided to evaluate myself from previous work, specifically _Tutor Angkatan_. Upon Tutor Angkatan's release, there are one major problem: **It was slow**. This is caused due to little to no caching being used, and the number of request that is sent from the front-end. Learning from this, I decided to make my caching system more aggresive.

## Tech Stack

For the back-end, we used the following technologies:

-   Python >=3.8 (3.7 works, but not tested)
-   FastAPI Framework
-   Ormar ORM
-   Redis

The stack was picked as such because of the following reason:

-   I am enforcing **static typing**  
    Yes, static typing in a dynamic language, this is done to reduce the number of silly errors that might happen in testing or even in production.
-   Asyncronous
    While may not be very superior, this gives me the opportunity to use `uvloop`, which is the same tech Node.js uses, and from the benchmark it looks like it is performing much better than other frameworks.
-   Enforcing Documentation Literacy  
    Due to them being such a new stack, not a lot of tutorials are available online, so your only option is to understand the official documentation and even the code behind it itself. I know I might be pushing it a bit too far, but it seems to be working just fine. It would benefit them as well.

## Development Process

The flow for development is to create a git branch, then open up a Pull Request for it. Just like how you would do in professional environment. I will be the one reviewing it. Testing is **mandatory** as well, we use Pytest for that.

The process actually went really well, I am genuinely surprised with it, props to my team for that! We finished everything around 3-4 weeks before deadline, so there is a lot of room for hotfixes without being rushed.

## Gathering Data

And... here comes the messiest part of all of this. Asking every single freshman for their data. For context, here are the things I am asking from them:

-   Student Identifier ID
-   Name
-   Username
-   Selected Program
-   House
-   Place and Date of Birth
-   Hobby
-   IT Interests (Hardcoded choices)
-   Instagram **without the @** (optional)
-   Line ID (optional)
-   "About Me"
-   Future Message
-   Picture of themselves, in **3:4** aspect ratio, with file naming format being "ID_FotoDiri.ext"
-   Introduction video, portrait, possibly 16:9 aspect ratio, uploaded to YouTube

Yes, a lot, I know. However these are required for everything that we need to do for this task. It is submitted through Google Form, and I very well know that it will be messy. I sent them the form around 3 weeks before site's deadline, with the form's deadline to submit being a week before site's deadline.

A week passed, **less than 10% has responded**. 3 days later, **32.81% has responded**. I then decide to split Introduction Video out of it and make a new form for that, so they will still have 2 days to respond. 2 days later, **94.34% has responded**. This is good, but theres quite a few that needs to respond, so I poke them personally and there's only <3% that hasn't responded up until the very second I write this.

Now, I have one week to do everything. I need to import them to the server. However, I am very well know that there is going to be challenges, and here are those:

-   Impersonation or Trolls  
    Fake entries, impersonation, and everything is definitely a big threat of mine. Obviously I don't want the site to have rick roll or even straight up porn in it.
-   People will add `@` in Instagram ID regardless.  
    I think this is self-explanatory, people can't read.
-   About Me and Future Message being inappropriate
-   Picture not being 3:4 aspect ratio, or not even portrait in the first place.
-   Picture not using the correct format
-   Picture being stupidly heavy

With these in mind, I have decided to ensure that I have all of those checks in place.

1. Impersonation or Trolls  
   The plan here is to check whether the **name and ID is valid**. To do so, I fetched from official documents and gathered everyone's ID and name, and then check whether the names match up.
2. Instagram with `@`  
   Well, simply check whether it has `@` and just cut it, really.
3. Inappropriate messages  
   For this one, I have asked about 13 people to check every single messages, and ask them to change or remove the inappropriate bits.
4. Picture Problem  
   Yeah, this one is a hard one. There are about >100 people that does not follow the specifications (that's about 25%), and 30 people sent me **landscape** pictures. Hell, that's not even portrait!  
   The plan then is to simply ignore those. I don't give a damn.

5. Incorrect File Naming
   Here, I decided to iterate on every single entry in the spreadsheet, and rename the file to follow the correct naming scheme with a script.
6. Heavy Pictures
   I'll just rescale those and compress it.

With all these in mind, the scripts are available here: [GitHub Gist](https://gist.github.com/rorre/2e7223af1c43c29414aff1844f004d8e)

And so, with all of these done, I can finally deploy the back-end into my server.

This task has been pretty tiring for me, especially on the last few days before deadline. However I had fun learning new things and explore new things to solve problems. I look forward into working in more projects in this university.

That's all, have a nice day!
