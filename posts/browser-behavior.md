---
Title: "Browser Behavior: Form Problem"
Date: 2021-08-20 15:00
Modified: 2021-08-20 15:00
Category: technology
Tags: tech, webdev, web, browser
Slug: browser-behavior
Preview: Browsers and their inconsistensies...
---

Web developing sucks. We all know that, and well, that doesnt just apply to web development, but to a lot of things in technology. However I would like to talk about this simple browser behavior inconsistency that occured back when I was registering for my uni's orientation program.

Anyway, we were told to register on a site, but oddly when we press the `Register` button, it... does nothing. I thought the server probably got overloaded, but it does the same even when there's not much traffic going on. I decided to pull off the Chrome Developer Tools and surprised that there are no HTTP request being made. Upon inspecting the code, there doesn't seem to be any JS fuckery that causes it, only a function to disable the button on click. That shouldn't be a problem, right? Well... apparently not.

You can see how it feels like in action here:

<Notice>
    <iframe src="/static/post/browser-behavior/form.html"></iframe>
</Notice>

If you see an `alert()` when you submit, then this doesn't affect you. Try using different browser, like Chrome, you should see that it only disables without making any pop up.

If you are using Chrome and you see the pop up, then I guess Chrome has changed its behavior, lol.

# Reasoning

So why does this happen, really?

Here, we have a form that looks like following:

```html
<form id="exForm">
  <label for="name">Name:</label><br />
  <input type="text" id="name" name="name" /><br /><br />
  <button id="submitBtn" type="submit">Submit</button>
</form>
```

---

With the following JS script:

```js
var nameInput = document.getElementById("name");
var submitBtn = document.getElementById("submitBtn");
var form = document.getElementById("exForm");
form.onsubmit = onFormSubmit;

submitBtn.addEventListener("click", function (ev) {
  this.setAttribute("disabled", true);
});

function onFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  alert(`Hello, ${nameInput.value}!`);
}
```

---

As you can see, we are making an `onClick` event to the button, and an `onSubmit` event to the form. What happens here is that the `onClick` is being evaluated first, making it disabled. Due to it being disabled, the form's `onSubmit` is not being evaluated. On Firefox, when an `onClick` even happens to the button, it will also trigger an `onSubmit` event to the form.

This makes it really annoying for a front end developer, as their behavior are different when they're technically only triggering one event, that is, an `onClick` on the submit button.

Regardless, it is more of an annoyance to test different browsers rather than a huge problem, so I don't mind it too much.

That's all, have a nice day.
