---
Title: "I Wrote A HTML Rendering Library and It Sucks"
Date: 2024-01-23 23:00
Modified: 2024-01-23 23:00
Category: technology
Tags: tech, web, html, library, python
Slug: i-wrote-a-library
---

Around new year, I was bored outside my usual job and games, plus I still don't have any classes to attend since we're still on our semester. So, I thought of going back again to my previous projects.
I noticed that I keep writing all my uni projects in Python, and almost all of them are web apps in full stack, whether it use Flask or Django. I had
one small problem whenever I try to develop in these frameworks: **Writing frontend doesn't feel the same as writing in modern framework like React or Solid.**

So, why does it feel different? I think, it boils down to 2 things:

1. **Less integration with language**  
   With React or Solid, you basically have all your data and your HTML representation in the same file, so you have all the context available for you.
   This has a few benefits, that is you can declaratively say what data you need and autocomplete based on the context you have for that component. Let's take a look
   at this React example:

   ```tsx
   interface UserProfile {
     name: string;
     bio: string;
   }

   interface UserCardProps {
     profile: UserProfile;
   }

   function UserCard({ profile }: UserCardProps) {
     return (
       <div class="rounded-md p-4 border border-black flex flex-col gap-2">
         <strong>{profile.name}</strong>
         <p>{profile.bio}</p>
       </div>
     );
   }
   ```

   As you're writing the component for `UserCard`, you will have full information of `profile` since you will always need to pass the data.

   Now, let's take a look at the same component in Jinja or Django templates

   ```html
   <div class="rounded-md p-4 border border-black flex flex-col gap-2">
     <strong>{{ profile.name }}</strong>
     <p>{{ profile.bio }}</p>
   </div>
   ```

   You will usually put this in an include for Django, or put it as a macro if you're using Jinja. This works, but as you write, the code itself
   does not know any context of what `profile` is, it'll just do that to whatever `profile` variable assigned to, since the file itself does not
   have any relationship with the Python file calling it.

2. **No type safety**  
   Based on the same example below, when you're writing JSX code, you will have autocomplete if you want to do anything related to `profile`.
   This also holds if another component is trying to include `UserCard`, they will need to pass in `profile` as props with valid data that could be
   checked statically.

   On the other hand, as you're writing Jinja/Django code, the HTML you're writing have no idea that the variable `profile` even exist, so you can
   only hope that whatever that includes or calls that component already have `profile` variable set to the correct data, that is it has `name` and
   `bio` as attribute. In my opinion, this slightly slows down development as application grows, since there is no guarantee that all data is available
   statically. It would be better if we already know that the data is there while it renders.

To solve this, I made a library that would let you represent all your HTML in Python, taking inspirations from JSX and Flutter.

## Liku

Liku is the name of the library that I wrote to solve exactly this problem, it is a library to declaratively represent your HTML and data in the same
environment as your Python code, so all data can be represented as a class or any kind of typing. You can check the motivation about this library
further [in this page of the docs](https://rorre.github.io/liku/motivation/).

For example, let's represent the same component above as a Liku component:

```py
import liku as e
from dataclasses import dataclass

@dataclass
class UserProfile:
    name: str
    bio: str

def UserCard(profile: UserProfile):
    return e.div(
        props={"class_": "rounded-md p-4 border border-black flex flex-col gap-2"},
        children=[
            e.strong(children=profile.name),
            e.p(children=profile.bio),
        ]
    )
```

Looks much neater, and solves all the problems I have above. Now I have full LSP support for all my HTML, and can ensure that all data is available
as I render, great!

Next thing, I tried building an application strictly only using the library that I wrote to render HTML. You need to know how your users would feel
like as they use your library, right? And so I did.

It... did not feel as good as I expected.

## The Problem(s)

As a preface, the application that I am trying to build is a simple QnA site, just a form box for users to ask questions, and the admin to be able
to add answers to existing questions. I also added a few simple htmx actions for interactivity. Simple enough, even it is achieveable to finish
that in a few hours. The source code is available [in this repository](https://github.com/rorre/ezqna).

After finishing the entire application, I have concluded that there are a few problems that people would find awful as they write with this library:

1. **There sure are a lot of closing brackets**  
   One of the problems that any declarative system suffers is that it tends to get really nested as your application grows more complex. In this case,
   even a simple navigation bar in the application can make the code looks something like this:

   ```
   ...
                           )
                        )
                    ]
                )
            )
        )
    )
   ```

   ...yeah, not great. You can see that in action [here](https://github.com/rorre/ezqna/blob/main/ezqna/components/base.py#L55-L64).

2. **The code gets shifted to the right of your screen real quick**  
   Same problem as above, but is really amplified in Python with PEP8 convention using 4 spaces.

3. **I don't like having all the props as dictionary**  
   If you haven't noticed, all Liku components essentially only take two arguments: `props` and `children`. This means all props/attributes that you would
   set in your HTML element would need to be in a single big dictionary, and all children to be in a list. To better understand, this is the signature for
   `<a>` tag:

   ```python
   class HTMLAttributes(TypedDict, total=True):
        ... # too long
        class_: string

   class AnchorHTMLAttributes(HTMLAttributes, total=True):
        download: Any
        href: str
        hreflang: str
        media: str
        ping: str
        target: HTMLAttributeAnchorTarget
        type: str
        referrerpolicy: HTMLAttributeReferrerPolicy

   class a:
        def __init__(self, props: AnchorHTMLAttributes | None = None, children: list[HTMLElements] | None = None):
            ...
   ```

   This means, if you're to make a link to `https://www.google.com/` that targets to new tab, this is how you will represent it:

   ```py
   e.a(
        props={
            "href": "https://www.google.com/",
            "target": "_blank",
            "class_": "text-blue-500 hover:cursor-pointer"
        },
        children="Go to Google"
    )
   ```

   Yeah, that doesn't look that good, is it? How about this:

   ```py
   e.a(
        href="https://www.google.com/",
        target="_blank",
        class_="text-blue-500 hover:cursor-pointer",
        children="Go to Google"
   )
   ```

   Much better, isn't it? While it can be done easily, I cannot do that because [Python currently does not support using `Unpack` with
   generic `TypedDict`](https://github.com/python/typing/issues/1399), so all kwargs cannot be statically typed at the moment,
   therefore I opted to not use it in favor of using props dictionary (which actually does give you attribute completion!)

## Solution?

The solution? I... couldn't think of any right now other than waiting for the issue to be resolved. As for the first and second point,
there is a future possible plan that I would write my own JSX-like format in Python, but that requires me to learn how LSP extension works,
which I do not have much time to do right now. I'll throw that to my TODO bin for the time being.

Not the best end of an article I could think of, but hey, I did mention that it does suck, did I?
