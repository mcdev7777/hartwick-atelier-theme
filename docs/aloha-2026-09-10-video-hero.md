# Draft reply to Aloha — 10 September 2026

Subject: **Re: playing the film on the site — yes, and yes, please do make the desktop version**

> Ivan: this supersedes the asset list in `aloha-2026-09-10-scrapbook-hero.md`. If you've
> already sent that one, open with a line saying the ask has changed and to ignore the
> four-asset list. Hours line left for you to fill from the log.

---

Aloha,

Yes. Playing the film itself, looping, is entirely possible and it's the ordinary way this is
done — it's less work than building it in code, not more, so it also gives some budget back.

It won't look bad. But there are three things to fix before it goes up, and your instinct
about desktop is right — more right than I think you realise. Detail below.

## Your desktop worry: you're correct, and please do make that version

This is the important part of the email.

The film is 1080 × 1920 — a vertical, phone-shaped frame. On a phone that's perfect; it fills
the screen almost exactly. On a widescreen desktop the browser has to fill a shape roughly
twice as wide as it is tall, and to do that with a vertical film it has to enlarge it until the
width fits and let the top and bottom fall off the screen.

The arithmetic is unkind: **you would see about 32% of the frame. Roughly two thirds of it
would be cropped away** — and it's cropped from the top and bottom, which is precisely where
everything is.

On a standard 16:9 desktop screen, a centre crop keeps her face, the sofa and the HARTWICK
ATELIER sticker. It loses:

- "AT NEW YORK FASHION WEEK"
- the date and the address
- "Meet the founder and explore the collection…" and the line under it

So every word on the poster disappears. And because the vellum peels *downward*, the reveal
itself only crosses that narrow visible band for about a third of its travel — it stops
reading as a sheet being lifted and starts reading as a band flickering across the middle.

So yes: **please make the desktop version.** Two notes on it —

- Make it a **new landscape composition at 1920 × 1080**, not a re-crop of the vertical one.
  The layout wants rethinking for the shape, not squeezing into it.
- Keep the text within the middle 80% horizontally and clear of the top and bottom tenth.
  Ultra-wide monitors still trim the edges a little, and that keeps the words safe on all of
  them.

Serving the right file to the right device is straightforward on my side. Phones get the
vertical, desktops get the landscape, and neither downloads the other.

## The three things to fix

**1. It has to be silent.** Browsers will not autoplay a film with sound — that's a rule on
every phone and every desktop browser, not a setting I can switch off. Muted, it plays
automatically everywhere. So the export should have the audio track removed entirely. If sound
matters to you, the only option is a film that waits for the visitor to press play, which
defeats the point of it as a backdrop.

**2. The file is far too heavy.** The version you sent is **19.8 MB for 8.9 seconds**. That's
a master export for social, around 18.6 Mbps — roughly ten times what a web hero should be. As
it stands, a visitor on mobile data would spend 20 MB and several seconds of waiting on the
homepage before seeing anything.

Re-exported properly it should land **under 3 MB** with no visible loss of quality at this
length. Specs for whoever cuts it:

- MP4, H.264 High profile, yuv420p, "fast start" / web-optimised enabled
- around 2–3 Mbps, 1080p
- **no audio track**
- same for the desktop version

**3. I need a still frame from it.** A single JPEG of the opening frame — the fully veiled
state with the sticker sitting on the fold. This shows instantly while the film loads, and it's
also what appears in the situations below where the film legitimately won't play.

## Two behaviours to expect, so they aren't a surprise later

Neither is a fault, and neither can be overridden — they're deliberate protections in the
phone and the browser:

- **iPhones in Low Power Mode don't autoplay video.** The visitor sees the still frame instead.
  This is common — plenty of people run their phone in Low Power Mode most of the day.
- **Visitors who've asked their device to reduce motion** get the still frame too. That's an
  accessibility setting and we should honour it.

Both are the reason item 3 matters. The still frame isn't a fallback nobody sees — for a
meaningful slice of visitors it *is* the hero. Worth choosing it deliberately.

## One thing I'd want you to decide with open eyes

All the words are inside the film. Google can't read them, a screen reader can't read them, and
nothing on that poster can be changed later without a re-export.

If this is the homepage hero, that has a real cost in search. My recommendation is that the
film stays as the picture, and the headline plus the **Join The Register** button sit over it
as actual text on the page. It also means the words stay legible on desktop even where the
crop is unkind, and we can change the wording later without going back to the editor.

Not a blocker — but easier to decide now than after everything is built.

## Cost

Roughly **3 to 4 hours** for both versions, the device switching, the still frame, the speed
work and the reduced-motion handling. That's against the 12–14 I quoted for building it in
code, so the change saves about ten hours.

Worth saying plainly: this route no longer needs the end-of-month date on its own account.
If there are other reasons to hold, that's fine — but don't keep the delay for this.

Send me the two re-exported films and the still, and I'll have it up on the development theme
the same day.

**Hours** — [Ivan: today's figure, running total and remainder from the log.]

Ivan
