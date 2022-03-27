---
Title: 'How I Render Bad Apple With HTML5 Canvas'
Date: 2022-03-26 21:00
Modified: 2022-03-26 21:00
Category: technology
Tags: tech
Slug: bad-canvas2d
---

Ah, Bad Apple. Truly a classic piece of art that has been transformed into a lot of medias. From [playing it on Desmos](https://www.youtube.com/watch?v=MVrNn5TuMkY), [Google Maps](https://www.youtube.com/watch?v=r-axdVfM0c0&vl=en), [Microsoft Paint](https://www.youtube.com/watch?v=itbBubDqm70), [File Explorer](https://www.youtube.com/watch?v=7WHA_Gi4nPA), or [CSS Animations](https://www.youtube.com/watch?v=MQbjW2VfaHs). Oh... wait, they are all made by the same person. Well, there is [Bad Apple on apple](https://www.youtube.com/watch?v=rSiOhsGwcII) and [Bad Apple... Among Us](https://www.youtube.com/watch?v=UbaBI-XxGbo). Point is—you can render it everywhere, regardless of which platform you are running it on. In this post, I will talk about how I render Bad Apple on HTML Canvas. Here's the result, though:

<Notice>
    <iframe width="400" height="300" src="https://pesta-rakyat-fasilkom.github.io/perak-games/bad-apple/"></iframe>
    <p>Yeah, it doesn't look good here... <a href="https://pesta-rakyat-fasilkom.github.io/perak-games/bad-apple/">just open it in new tab</a>, I guess.</p>
</Notice>

<Notice
faIcon="info-circle"
noticeType="info"
header="Full disclosure" >
The logic is taken from my previous project, <a href="https://github.com/rorre/frames2osb">frames2osb</a>. The one showed above uses this but converted into JSON instead of Python pickle.
</Notice>

In this post though, I will assume you already have some knowledge about what HTML5 Canvas is (at least, just knowing what it is) so I will not be explaining what Canvas is.

# The Plan

Alright, so let's set up a plan for this. What I had in mind is that we can extract all the frames from the video, then get all the pixel data of each frame. Finally, from all the pixel data we got, we can make some sort of keyframe for the canvas rendering.

So, a quick rundown would be something like this:

-   Extract all frames to image files
-   Load the images sequentially
-   Track changes for each pixels

Pretty simple, right? However, there is an obvious space problem here: consider the video is 480p, since its 4:3, then it would be 640x480. That would require us to render 307200 pixels **in worst case scenario**. Not only that, there would be a lot of keyframes, making our script bloated.

So clearly, we need to cut things down. Let's cut the resolution down to 48p. That would mean we will render at 64x48 resolution. Pretty small, so let's render each pixel as 10x10 square. That'll make it back to 640x480, albeit the visual would look pretty blurry. But to be honest, I think that still looks fairly okay for a Bad Apple video.

The final rundown would look something like this:

-   Extract all frames to image files
-   Load the images sequentially
-   Resize the image to 64x48
-   Track alpha changes for each pixels

Alright, enough planning, let's code this!

# The Code

Before we go further, there are a few things you have to prepare:

-   Python 3.8
-   Pillow
-   FFmpeg

## Extracting Frames

Extracting frames from a video is simple. Simply get ffmpeg for your OS and run the following command:

```bash
$ ffmpeg -i $VIDEO_FILE frames/%03d.jpg
```

This will extract all frames in your video file into frames folder.

## Processing The Video Frames

To process the video frames, we simply have to load each image sequentially, resize it, convert it to black and white, then keep track of each pixels. Really, it's that simple!

Here's the full code:

```py
# Typing shenanigans
from typing import List, NamedTuple
class Point(NamedTuple):
    offset: int # Offset of current point in frames
    alpha: int # 0-255

# Don't be intimidated! Let me translate it to java:
# Point[][][] PixelData = new Point[64][48][<dynamic>]
PixelData = List[List[List[float]]]

# I know I can use list comprehension, but I'd rather have people be able to read the code tbh.
pixel_data: PixelData = []

# Let's initialize the pixel_data content with empty arrays.
for x in range(64):
    pixel_data.append([])
    for y in range(48):
        # Those arrays will be the keyframes.
        pixel_data[x].append([])

# Iterate over each images
for image_file in Path("frames").iterdir():
    with Image.open(image_file) as im:
        # Resize our image to 64x48
        im_resized = im.resize((64, 48))

    # Convert our image to b/w
    image = im_resized.convert("L")

    for x in range(x_max):
        for y in range(y_max):
            px = pixel_data[x][y]

            # Only add an entry if current value is different from last value.
            # Thus we only have timestamps where the values are different.
            current_alpha = int(image.getpixel((x, y)))
            if not px or px[-1].alpha != current_alpha:
                pixel_data[x][y].append(
                    Point(
                        offset=start_frame + i, alpha=current_alpha
                    )
                )

    # Delete from memory to save space.
    del im_resized
    del image

# Dump all our frames to json file
import json
with open("frames.json", "w") as f:
    json.dump(pixel_data, f)
```

As I have said above, this logic is taken from my other project, [frames2osb](https://github.com/rorre/frames2osb). There are more configurations so feel free to peek around!

## Rendering On Browser

Finally, we are actually doing the fun part: rendering it.
Here are some important notes you need to keep in mind:

-   The JSON file is big. Don't bother looking at it.
-   Remember the structure: `Point[x][y][]` with `Point` being `[offset, alpha]`.
-   You will be rendering **every frame**.
-   You need to keep track of **last alpha value** due to the keyframe nature.

With those in mind, let's start with the boilerplate code to get started: (I won't explain tho, you figure out!)

`index.html`:

```html
<head>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="flex-container">
        <div class="content">
            <canvas id="badapple" width="640" height="480" style="display: none"></canvas>
            <button class="btn" onclick="start()" id="playbtn" style="display: none">Play</button>
            <p id="messageText">Loading...</p>
        </div>
    </div>
    <script src="index.js"></script>
</body>
```

`style.css`:

```css
html,
body {
    background: black;
    height: 100%;
}

body {
    margin: 0;
}

.flex-container {
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn {
    background: transparent;
    border: none; /* Remove borders */
    cursor: pointer; /* Mouse pointer on hover */

    position: absolute;
    top: 50%; /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */

    transform: translate(-50%, -50%);
}

canvas {
    aspect-ratio: 4 / 3;
    margin-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

.content {
    border: 1px solid white;
    padding: 1rem;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
```

Alright, now let's get into the javascript!

### Loading Frames

Well, we have to download the frames somehow, right? So let's download it! After we parse the JSON, we can let the user play the canvas.

```js
// Let this be a global variable
var resJson

onload = async function () {
    try {
        // Make sure frames.json is in your root!
        let res = await fetch('./frames.json')
        resJson = await res.json()

        // Clear memory
        res = null

        // Set message and let user play
        messageElem.innerText = 'Loaded.'
        playBtn.style.display = 'block'
        canvas.style.display = 'block'
    } catch {
        // Something got messed up
        messageElem.innerText = 'Load failed!'
    }
}
```

### Rendering

Now here comes the actual fun part: rendering it! The plan is to render the canvas **every single frame**, but with the knowledge of keyframes that we have known. To do that, we can iterate through every single pixel and create a 10x10 square that corresponds its alpha value. Simple enough, yeah?

```js
var intervalId

// The start function will be called by the play button
function start() {
    // Loop every 1000 / FPS ms
    intervalId = setInterval(startDraw, 1000 / 29.8)
}

async function startDraw() {
    // The max offset could differ from yours, mine is on frame 6570
    // If it exceeds, let's just clear the interval and exit
    if (currentOffset >= 6570) {
        clearInterval(intervalId)
        return
    }

    // Clear and redraw background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 48; y++) {
            let pixelDatas = resJson[x][y]
            let found = false
            let alpha = -1

            // Find for new alpha value
            for (let i = 0; i < pixelDatas.length; i++) {
                let curr = pixelDatas[i]
                // Frame list is sorted, by this point we will never find it, as the offset is above us.
                if (curr[0] > currentOffset) break

                // We found our new alpha value!
                if (curr[0] == currentOffset) {
                    alpha = curr[1]
                    found = true

                    // Let's just remove this object from memory, we won't use it anymore.
                    pixelDatas.splice(i, 1)
                    break
                }
            }

            // Use previous alpha value if not found
            if (!found) {
                alpha = lastPixelData[x + '|' + y]
            }

            // Save our current alpha value for next render
            lastPixelData[x + '|' + y] = alpha

            // Only draw if alpha is not 0 (not black)
            if (alpha != 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha / 255).toFixed(2) + ')'
                ctx.fillRect(x * 10, y * 10, 10, 10)
            }
        }
    }
}
```

And you're done! Try playing it and you will get Bad Apple rendered in your browser with HTML5 Canvas!

# Wrapping Up

This was a silly fun project to do for an easter egg in PERAK Fasilkom UI. You can see the easter egg [here](https://perak.cs.ui.ac.id/apple). However, it taught me quite a few things, such as how to manage memory, how to improve an existing algorithm to be more performant, etc.

However, there are still a few improvements that we can try:

-   **Maybe use quadtree?** That way there are less drawing commands to be done
-   **Maybe draw the background based on dominant color?** Currently, it's drawing a black background and only draws white pixels. So there is a clear performance issue if a section has too many white pixels.

I'll have to see what I can do later on. But for now, thanks for reading! Have a nice day.
