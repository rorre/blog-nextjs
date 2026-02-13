---
Title: "Searching Videos From Screenshots"
Date: 2026-02-12 23:00
Modified: 2025-02-12 23:00
Category: technology
Tags: image, video, python
Slug: searching-video
Preview: I can finally find those sauce that people on Twitter kept posting the screenshot of!
---

![](https://i.imgur.com/obrb0xP.gif)

I've always been fascinated on how [SauceNao](https://saucenao.com/), [Google Lens](https://lens.google.com/), [TinEye](https://tineye.com), or literally any reverse search tool works. The fact that we are able to trace images back to its source merely by showing the image is really amazing, even if the picture itself has been modified in any way possible (cropping, color being degraded because of compression, etc). Not to mention that they work really fast, just in a matter of miliseconds.

Even though there are numerous articles that discusses on how they could possibly work, there are still one feature on these reverse search tool that I'm very curious about: "How does it search back videos from a screenshot of it?". Try it out, take a screenshot of an anime, then send it to SauceNao. Not only it'll show what show it is, it'll also tell you in which season, episode, even the timestamp of it!

![](https://i.imgur.com/Uf77FVL.png)

I figured it might be a nice challenge for me to figure out how it works, and in general would just be really cool to show it off to people :p

Realistically though, I think there are a few cases where it might effectively apply in real world: Digital Forensics is definitely one, but a more common scenario is probably searching for full version of a video that's posted on your Twitter timeline.

## Where To Start

![](https://cdn.discordapp.com/emojis/1228225906208669706.webp?size=512)

So, where to really get started? As always, I always try to Google things around and see if somebody else has done this before... or really, anything similar to it. My professor used to always say GSGS (*Google Sana, Google Sini*, or Google This, Google That) so it always sticks to me to always check if somebody else has done it.

Well... either my keywords just suck, but I really didn't get anything other than advertisements from some company about reverse searching or completely unrelated results... bleh.

![](https://cdn.discordapp.com/emojis/1228225908083658862.webp?size=512)

<center>...or just Google advertising Lens.</center>

## Looks Like It

All is not lost, though. I did stumble upon image hashing, which seems to be how these reverse image search tools works! The main blogpost are [Looks Like It](https://hackerfactor.com/blog/index.php%3F/archives/432-Looks-Like-It.html) and [Kind of Like That](https://www.hackerfactor.com/blog/?/archives/529-Kind-of-Like-That.html). The blog posts are really short and straightforward, even a complete Computer Vision dummy like me could understand it.

I really recommend you to read them out before continuing.

I thought this is a good start. Afterall, a video is just a lot of images squished into one anyway... right? Let's try to sketch out a rough idea of how it'll work.

## The Idea

We know the following things:

1. A video is just a collection of images
2. We can "hash" an image and it'll be a fairly good "fingerprint"

Knowing these two, we can naively try to implement this: Simply hash all of the frames, and check which is the most similar.

![](https://i.imgur.com/mpV7gts.png)

Let's see how it looks like in code:

```py
@dataclass
class VideoFrameHash:
    hash: ImageHash
    path: PathLike[str]
    time: float

def search_similar(
    image: Image,
    hashed_frames: list[VideoFrameHash],
    hash_algorithm: Callable[[Image], ImageHash] = phash,
):
    current_hash = hash_algorithm(image)

    result = []
    for frame in hashed_frames:
        result.append((frame, current_hash - frame.hash))

    result.sort(key=lambda x: x[1])
    return list(map(lambda x: x[0], result))

def hash_video(
    video: PathLike,
    hash_algorithm: Callable[[Image], ImageHash] = phash,
):
    vid = av.open(video, mode="r")

    for frame in vid.decode(video=0):
        im: Image = frame.to_image()
        current = hash_algorithm(im)
        frame_hash = VideoFrameHash(im, current, video, frame.time)
        yield frame_hash

    vid.close()
```

It should work! since we know that it'll at least find one match that's exactly of that frame. Though, that means storing every single frame as 8x8 matrix... Not like it's the worst thing ever, though. It's just that more likely than not, a frame N and N+1 wouldn't really be that much different, no? Especially in video footages or animations. The changes for those two frames are negligible, and likely, the frame N+1 could be detected by the hash of frame N anyway.

I think we can do better than that. Let's add some more facts:

1. We can also get the distance between two hash, which will represent how different two images are
2. These hashes usually tolerate small differences, as long as the general idea of the image stays the same
3. The frame surrounding frame N could be detected by the hash of frame N

Now, let's improve the system further:

- We only take note of "important frames", that is, a frame that's distinctly different from the previous "important frame"
- The first "important frame" will always be the first frame

![](https://i.imgur.com/sPhRy73.png)

With this logic, the screenshot will be detected as similar to frame 1, instead of the exact frame 2. Despite it being inaccurate, it should be within tolerable limit especially with higher FPS videos.

```py
THRESHOLD = 0.2 # If the difference between the two is at least 20%, aka it needs to be at least 80% similar

def hash_video(
    video: PathLike,
    hash_algorithm: Callable[[Image], ImageHash] = phash,
):
    vid = av.open(video, mode="r")

    previous_hash = None
    for frame in vid.decode(video=0):
        im: Image = frame.to_image()
        current = hash_algorithm(im)
        frame_hash = VideoFrameHash(current, video, frame.time)

        if not previous_hash:
            yield frame_hash
            previous_hash = current
            continue

        pct = (current - previous_hash) / 64
        if pct > THRESHOLD:
            yield frame_hash
            previous_hash = current
    vid.close()
```

There is no need to edit the logic for `search_similar` since we only modify the way how we produce the hashes.

As a sanity check, let's try to hash a video and check with a frame from the video:

```py
hashed = list(hash_video(Path("afterburner.mp4")))
res = search_similar(PILImage.open("image.jpg"), hashed)

for result in res[:10]:
    print("Found at time:", result.time)
```

![](https://i.imgur.com/QCSrrE8.png)

Alright, seems like it's working well! For one video, at least.

---

![](https://cdn.discordapp.com/emojis/1228225906208669706.webp?size=512)

<center>*If you think about it, a video consisting of an image slideshow collage would just be almost the same as rerending the video to 8x8.*</center>

---

## Extending Our Search

Okay, we've figured out how to reverse search a frame for a single video, but what about multiple videos?

It's simple, we just store every hash of all the videos! Just like when you're searching for files, sometimes your system already index the path, we can do the same but with image hash!

```py
hashed = []
for p in Path("dir").glob("**/*.mp4"):
    vid_hashes = list(hash_video(Path("afterburner.mp4")))
    hashed.extend(vid_hashes)

res = search_similar(PILImage.open("image.jpg"), hashed)

for result in res[:10]:
    print("Found at", result.path, "with time:", result.time)
```

![](https://i.imgur.com/iRfkFHc.png)

It works! Huzzah! We've built ourselves a reverse search tool for videos using the same concepts of image hashing.

## Benchmark

All of those are cool, but how does it hold up in real life? Especially with social media often having a lot of alterations to the image itself.

So, I benchmarked it. I downloaded 600+ videos from a certain image board, as well as Blender's free video (Big Buck Bunny, Elephant's Dream, Sintel, Tears of Steel).

Here's how it works:
1. Hash all of the videos, and put the result in a big array
2. For each video: pick a random frame
3. Run some transformation to the frame
4. Find the random frame from all of the hashes
5. If it can find the original video with the threshold of 50% similarity, then we consider that as a success

Here's the result:

| Transformation            |  Pass / Total | Accuracy |
|---------------------------|---------------|----------------|
| No Transformation                    |   567 /   623 |   91.01% |
| Rotation (1 deg)          |   559 /   623 |   89.73% |
| Rotation (10 deg)         |   222 /   623 |   35.63% |
| Rotation (30 deg)         |    49 /   623 |    7.87% |
| Brightness +25%           |   565 /   623 |   90.69% |
| Contrast +25%             |   569 /   623 |   91.33% |
| Grayscale                 |   567 /   623 |   91.01% |
| Gamma Correction          |   566 /   623 |   90.85% |
| JPEG Quality 10           |   564 /   623 |   90.53% |
| Gaussian Blur             |   567 /   623 |   91.01% |
| Median Filter             |   567 /   623 |   91.01% |
| Letterboxing              |   243 /   623 |   39.00% |
| Watermarking              |   562 /   623 |   90.21% |

As we can see, altering the image even just by rotating it by 10 degrees already hurts the result so much. This means our algorithm isn't robust enough to handle such cases. Though I am not here to try and find a better solution for it, I'm sure someone out there is more capable than I do :p

However, I think having a 91% accuracy rate is good enough! I don't have any basis for this, it's just gut feeling.

## Conclusion

I think this was a really fun weekend project! I worked on it the whole weekend, and I can say I'm quite proud with the result.

I purposefully omitted a lot of parts though, building out the GUI, CLI, and my method of saving all the frame's hashes to the storage. Though you are free to look into my repository and see how I did it. (Spoiler: I just dumped the whole array to it, and to load it I just iterate through the file)

The repository is available on my GitHub: [rorre/video-search](https://github.com/rorre/video-search)

![](https://cdn.discordapp.com/emojis/1228225901859442689.webp?size=512)

<center>Thank you for reading!</center>
