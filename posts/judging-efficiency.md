---
Title: Measuring Time In Arbitrary (Java) Program
Date: 2022-10-19 21:30
Modified: 2022-10-19 21:30
Category: technology
Tags: tech
Slug: judging-efficiency
Preview: How hard is it to measure them accurately?
---

Data Structure and Algorithms, a course that sends shivers down any compsci students. In my uni, in any practical assignment, there is an automatic grader that will judge our program based on its predefined test cases, as well as time and memory limit. These test cases are private, just like how you usually do in any competitive programming contests. Due to its secretive nature, usually those who get full mark will be asked by others to try out their test cases, and compare it with their own.

With the ever increasing need to test as much cases as we need, it becomes really tiring to try them out and compare manually. That is the reason why [DDPValidator](https://github.com/rorre/DDPValidator) was built. However, it only catches the difference of output. It does not record how long does it take to actually execute the program. Considering it is in Java, and I have extended the program to be able to run java source files, naturally I thought of extending the app (again) to simply track how long does it take to execute given each test case. That is, until I remember one big bottleneck.

## Boot Up Speed

When I was working on extending the app, I noticed that the boot up was _really_ slow until it can finally takes input. To the point that [I have to sleep much longer before giving any input](https://github.com/rorre/DDPValidator/commit/978bbc629f74ce2af110a21f4d70a306b06a8c47). Two and a half seconds is really long for a time limited grading system, let alone one second. Let's say you have a hard limit that the program can only run for 5 seconds, that's already half the time wasted just to wait for Java to boot up. This is definitely not an ideal solution if you were to "accurately" measure code performance in terms of time efficiency.

This boot up speed itself also depends on the machine that currently runs the program, it could be really quick, or really slow. So we definitely cannot reliably judge based if we include this bottleneck, and so we have to think and work around it.

Of course, this is not a problem with Java only, other languages also suffer the same problem, usually interpreted language or those that requires any intermediate language. Python for example, takes time to boot up its interpreter and compile the script into its bytecode before finally running the script in its virtual machine.

## Working Around

So, with this big problem we have right now, how do we reliably judge execution time? Definitely not by running something like `time java MyProgram` or the likes, considering it will also count the boot up speed.

The approach that I take is to completely forget the outside world exists, and measure the time in the program itself. This approach is [extremely similar to how Python's timeit](https://github.com/python/cpython/blob/main/Lib/timeit.py) (See line 70-77 specifically) which basically runs the program in an eval-like environment. Although admittedly, the idea for this does not come from Python's timeit, but instead from another Java grader, "HzzGrader", that is built by my senior. (It was open source, but now has been closed source)

My implementation can be seen [in this Java file](https://github.com/rorre/RenGrader/blob/main/src-tauri/java/RenGrader.java). Essentially, it will redirect all `System.{in, out}` with each test case's files, so that in every iteration, it will try to read from the test case and write to user's output. The time taken is essentially the time before and after the execution in miliseconds, then subtracted.

You may have noticed that I use some sort of templating syntax such as `{{ CLASS_NAME }}`, it's because it is indeed a template java file, which it will then be rendered by rust via `minijinja` crate, to refer to the class of the assignment. This poses a huge benefit as the assignment and grader will be compiled at the same time, plus ensures that there is no error before running the assignment with the grader class.

## Wrapping Up

Personally, it seems that there is a lot of back and forth just to measure the time of execution of program. Especially in an interpreted language like Python and those that use intermediate language like Java. I do not know if this is also the case for natively compiled language like C, but I figure that this is not really the case for those.

Regardless though, it really does give a nice overview on how you could measure execution time in tricky situations. Though, that does pose a question, how does any contest grader do this? Do they just do it like `time`, which has the throwback of including the boot up time, or do they do it like this? Seems like another topic I could research further in other time.

...or, should we really measure these by time?
