# Draft email to Aloha — 10 September 2026

Subject: **The scrapbook reveal as the homepage hero — yes, and the four assets I need**

> Ivan: send once you're happy. Two things deliberately left for you to fill —
> the confirmed new launch date, and the hours line from your log.

---

Aloha,

Thank you for moving the date to the end of the month. I'd rather build this properly than
ship it half-working, so that's the right call.

I've taken `ScrapbookNY02.mp4` apart frame by frame. Short version: **yes, this can be built
in code as a real hero section — not the video embedded — and most of it is straightforward.**
Below is what I read in it, the one part that isn't straightforward, and the four things I
need from you before I can start.

## What I read in the animation

The clip runs 8.9 seconds and loops:

- A vellum sheet lies over the poster. The poster reads through it as a ghost — desaturated,
  blacks lifted, slightly blurred, with grain.
- **0.4–0.9s** — the HARTWICK ATELIER sticker curls up and away, hinged on its right edge.
- **0.9–1.8s** — the vellum peels off. A soft edge travels down the page; above it the poster
  is full colour, below it still veiled. The peeled flap folds over on itself and reads as
  opaque paper-white.
- **1.8–5.3s** — the poster holds clear with a very slow push-in, about 3%.
- **5.3–7.0s** — it reverses. The vellum lays back down, the sticker settles, and it loops.

If I've misread any beat, tell me now rather than at review — the timings are the cheap part
to change up front and the expensive part to change later.

## What's easy, and the one thing that isn't

The reveal edge, the slow push-in, the sticker curl, the reverse and the loop are all ordinary
CSS. No plugin, no library, no video file, and it will be lighter than the MP4.

The one thing I want to be honest about: a **true** rolling paper curl — a cylinder of paper
with light on its inner face and a shadow bending around it — is a different class of work and
would need 3D rendering in the browser. Your clip doesn't do that; its flap is essentially a
flat fold with a soft shadow. That's why code can get very close to it. If what you actually
have in mind is a proper rolling curl, say so now, because that's a much bigger job and I'd
want to talk about whether it's worth the money.

## The four things I need

**1. The layered artwork, not the MP4.** Specifically:

- the poster at full resolution, clean
- **the veiled version of the same artwork** — the poster as it looks under the vellum
- the sticker as a transparent PNG
- a **landscape composition for desktop**

The second one matters more than it sounds. If I generate the veil in the browser it will
stutter on mid-range Android phones, which is most of the traffic. If instead I have both
versions as flat images and simply wipe between them, it's identical to your clip, costs
nothing to run, and is smooth everywhere. Whoever built the video can export both in a minute.

The fourth is the real gap. What you've sent is a 9:16 vertical crop — a Reels format. On a
widescreen desktop it either sits in a letterbox or crops the composition down to nothing.
I'm not going to re-crop Angela's artwork myself. Either I get a landscape version, or we
agree deliberately that desktop shows the vertical piece framed against a paper texture,
which can look intentional but is a design decision and therefore yours.

**2. Should it loop?** My recommendation is that it plays once when the page loads and then
rests on the revealed poster. A full-screen loop sitting behind the headline competes with the
words and the button, and by the second scroll past it it's an irritation rather than a
detail. Same reasoning I gave against the product gallery moving on its own. Happy to be
overruled — just want the reasoning on record.

**3. Is this poster the permanent hero?** The artwork is an event invitation — Saturday
12 September, 5–7pm, 508 W 26th Street. That's a two-day shelf life. So either:

- it's a deliberate temporary takeover and we agree now what replaces it and on what date, or
- I build the *mechanic* as a reusable section and we put permanent Release artwork underneath
  it, with the invite as its first use.

The second is what I'd recommend, and it costs no more.

**4. Where does Join The Register go?** Nothing on that poster carries the signup. If the
reveal owns the top of the page, the Register call to action needs a home — either sitting
over the poster once it's revealed, or immediately beneath it. Your call which.

## What it costs

Roughly **12 to 14 hours**. That covers the section and its settings, the peel mechanic and
its shadow, the sticker, desktop art direction, the reduced-motion and page-speed work, and
review time with you.

I want to be straight that this is a new hero section rather than "an animation", and that
those hours come out of the same 40. The date moving doesn't create more budget. If you'd like
it, I need that in writing along with what it displaces — my honest view is that it displaces
some of the product population work, which we'd already flagged as not fitting.

Regardless of the answers above, I'll build it so it degrades properly: anyone with reduced
motion turned on sees the revealed poster immediately with no animation, the headline and
button are real text rather than baked into the image so they're readable and searchable, and
the page won't feel two seconds slower than it is.

Nothing is built yet and no hours are logged against it. I'll start the moment the assets land.

**Hours** — [Ivan: today's figure, running total and remainder from the log.]

Ivan
