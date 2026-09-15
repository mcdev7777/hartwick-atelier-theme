# Page bodies for build.py. `pages` and `register` are injected.

def fig(label, ratio="r-2x3", tone="", extra=""):
    return f'<div class="fig {ratio} {tone} {extra}"><span class="fig__label">{label}</span></div>'

def product(n, style, expression, lot, price, tag="", tone=""):
    tagline = f'<span class="meta quiet">{tag}</span>' if tag else '<span></span>'
    return f'''<article>
  {fig(f"{n:02d} / {style} · on body", "r-2x3", tone)}
  <h3 class="card__title">{style}</h3>
  <p class="card__sub">{expression}</p>
  <div class="card__meta meta"><span>{lot}</span><span>{price}</span></div>
  <div class="card__meta" style="margin-top:6px">{tagline}</div>
</article>'''

def jcard(n, cat, title, standfirst, meta, tone="", ratio="r-4x3"):
    return f'''<article>
  {fig(f"{n:02d} / Editorial image", ratio, tone)}
  <p class="meta quiet" style="margin-top:16px">{cat}</p>
  <h3 class="card__title">{title}</h3>
  <p class="card__ex">{standfirst}</p>
  <div class="card__meta meta"><span>{meta}</span><span class="link">Read the note</span></div>
</article>'''

# ---------------------------------------------------------------- COLLECTION
collection = f'''
<section class="section section--hero"><div class="wrap two">
  <div>
    <p class="eyebrow">The Collection</p>
    <h1 class="display display--lg">A body of work that accumulates.</h1>
    <p class="body" style="margin-top:28px">The Collection does not reset with the season. Every Style is a permanent silhouette — Skirt 001, Shirt 007 — and every Expression is the cloth it is realised in for a given Lot. What is available now is The Release. Everything the house has made stays in The Archive.</p>
    <p style="margin-top:24px"><span class="link link--ul">How the Collection works</span></p>
  </div>
  <div style="padding-top:8px">
    <table class="table">
      <tr><th>The Release</th><td>Lot I</td></tr>
      <tr><th>Pieces in this Release</th><td>[ n ]</td></tr>
      <tr><th>Made by</th><td>The Masters, India</td></tr>
      <tr><th>Ships</th><td>[ date ] · confirmed at order</td></tr>
      <tr><th>Restock</th><td>None. When the last piece goes, the Release closes.</td></tr>
    </table>
  </div>
</div></section>

<section class="section"><div class="wrap" style="padding-top:28px;padding-bottom:28px">
  <div style="display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap" class="meta">
    <div style="display:flex;gap:28px;flex-wrap:wrap"><span class="link link--ul">All</span><span class="link">Apparel</span><span class="link">Fine Silks</span><span class="link">Yoga Mats</span></div>
    <div style="display:flex;gap:28px;flex-wrap:wrap" class="quiet"><span>Technique ⌄</span><span>Style ⌄</span><span>Sort · Lot, newest ⌄</span></div>
  </div>
</div></section>

<section class="section"><div class="wrap" style="padding-top:40px">
  <div class="cols cols--3 grid-products">
    {product(1,"Skirt 002","Handspun Fresh Pink Cotton Khadi","Lot I · Edition of 25","€ —","Core Style")}
    {product(2,"Shirt 001","Kora Khadi, Handwoven Pinstripe","Lot I · Edition of 25","€ —","", "fig--b")}
    {product(3,"Trouser 001","Handloom Cotton Ikat, Celeste","Lot I · Edition of 12","€ —","", "fig--c")}
    {product(4,"Shirt 004","Ultra-Fine Handspun Jamdani, Tulip Motif","Lot I · Edition of 6","€ —","Release-exclusive", "fig--b")}
    {product(5,"Coat 001","Handloom Ikat, Neige, Hand-Guided Quilting","Lot I · Edition of 6","€ —","", "fig--c")}
    {product(6,"Dress 001","Handspun Silk-Cotton, Block Printed Natural Dye, St. Germain","Lot I · Edition of 12","€ —","")}
  </div>
</div></section>

<section class="section section--peat"><div class="wrap two two--even" style="align-items:center">
  <div>
    <p class="eyebrow">Made by Masters</p>
    <h2 class="display">Nothing here is restocked.</h2>
    <p class="body" style="margin-top:20px">Each Edition is sized to what the Masters can make in one cycle — some runs are twenty-five, some are two. A Jamdani weaver makes a quarter of an inch a day. When the last piece of a Release goes, the Release closes, and the record moves to The Archive.</p>
    <p style="margin-top:24px"><span class="link link--ul">Meet the Masters</span></p>
  </div>
  {fig("01 / Workshop · Loom · Hands", "r-4x3", "fig--peat")}
</div></section>

<section class="section"><div class="wrap">
  <div class="cols cols--3 grid-products">
    {product(7,"Skirt 003","Handspun Cotton, White with Blue Border","Lot I · Edition of 25","€ —","Woven in West Bengal", "fig--c")}
    {product(8,"Shirt 009","Fine Mashru Silk, Block Printed Natural Dye, Seed Pod","Lot I · Edition of 12","€ —","")}
    {product(9,"Belt 001","Gota Patti Embroidery, Cotton Velvet &amp; Silk, Reversible","Lot I · Edition of 6","€ —","Embroidered in Rajasthan", "fig--b")}
    {product(10,"Shayla 03","Fine Mashru Silk, Berry Blossom Pattern, Indigo Spire Border","Lot I · Fine Silks","€ —","", "fig--b")}
    {product(11,"PJ 001","Mulmul, Natural Dye Berry Blossom Ajrakh","Lot I · Edition of 12","€ —","")}
    {product(12,"Khadi Edition","Handspun / Handwoven Cotton Khadi, Sand","Lot I · Yoga Mat","€ —","", "fig--c")}
  </div>
  <p style="margin-top:48px;text-align:center"><span class="link link--ul">Show more of the Release</span></p>
</div></section>

<section class="section"><div class="wrap two">
  <div>
    <p class="eyebrow">The Archive</p>
    <h2 class="display">Everything the house has made.</h2>
    <p class="body" style="margin-top:20px">The Archive is the permanent record of every piece, Lot by Lot. It is not a sale section. A piece that did not find its wearer in its original Release remains eligible to return in a future one.</p>
    <p style="margin-top:24px"><span class="link link--ul">Enter the Archive</span></p>
  </div>
  <div>
    <ul class="index">
      <li class="on"><span class="meta quiet">01</span><span class="name">Lot I</span><span class="meta quiet">[ n ] pieces · 2026 · current</span></li>
      <li><span class="meta quiet">02</span><span class="name quiet">Lot II</span><span class="meta quiet">In production</span></li>
      <li><span class="meta quiet">—</span><span class="name quiet">Lot III</span><span class="meta quiet">Announced through The Register</span></li>
    </ul>
  </div>
</div></section>
'''
collection_reg = register("Be first to receive what comes next.",
  "Each Release is announced to The Register before it is public — the pieces, the number made, the ship date. Free, and open to all.")

# ---------------------------------------------------------------- THE MASTERS
def master(n, role, technique, tone=""):
    return f'''<article>
  {fig(f"{n:02d} / Portrait · with permission", "r-3x4", tone)}
  <h3 class="card__title">{role}</h3>
  <table class="table" style="margin-top:8px">
    <tr><th>Technique</th><td>{technique}</td></tr>
    <tr><th>Region</th><td>[ pending verification ]</td></tr>
    <tr><th>Name</th><td>Published with permission</td></tr>
  </table>
</article>'''

masters = f'''
<section class="section section--peat section--hero" style="position:relative">
  <div class="fig" style="position:absolute;inset:0;background:rgb(78,70,64)"><span class="fig__label">01 / Full-width workshop photograph · text sits over the image · overlay 60%</span></div>
  <div class="wrap two" style="position:relative;min-height:640px;align-content:end">
    <div>
      <p class="eyebrow">The Masters</p>
      <h1 class="display display--lg">The knowledge most of the world has forgotten.</h1>
    </div>
    <div style="align-self:end">
      <p class="body">Khadi weavers. Ajrakh block printers. Ikat dyers. Jamdani weavers. Gota Patti embroiderers. Each technique was developed over centuries in alignment with the natural world — dyes drawn from plants and minerals, processes governed by sunlight, rainfall and time. This knowledge lives in hands and families, not factories.</p>
    </div>
  </div>
</section>

<section class="section"><div class="wrap two">
  <div>
    <p class="eyebrow">The pace</p>
    <h2 class="display">Their pace is the pace of nature. That is the pace of Hartwick.</h2>
  </div>
  <div style="padding-top:8px">
    <p class="body">A Jamdani artisan weaves a quarter of an inch a day. Ajrakh silk rests between each of its sixteen processes, because the natural dye needs time to bond with the fibre. Natural indigo is fixed by the sun. There are no shortcuts, and the Lot sizes are not a marketing device — they are the honest yield of what nature and the Masters can produce in one cycle.</p>
    <p class="body" style="margin-top:16px">We do not rush what took this long to become this extraordinary.</p>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <p class="eyebrow">The techniques</p>
  <div class="two two--index">
    <div>
      <ul class="index">
        <li class="on"><span class="meta quiet">01</span><span class="name">Khadi · handspun, handwoven cotton</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">02</span><span class="name">Jamdani · UNESCO Intangible Cultural Heritage</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">03</span><span class="name">Ajrakh · sixteen processes, natural dye</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">04</span><span class="name">Ikat · yarn dyed before the loom</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">05</span><span class="name">Natural &amp; Ayurvedic dye · indigo, plant, mineral</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">06</span><span class="name">Hand block print · on Mashru silk and cotton</span><span class="meta quiet">Lot I</span></li>
        <li><span class="meta quiet">07</span><span class="name">Gota Patti · hand embroidery, zari thread</span><span class="meta quiet">Lot I</span></li>
      </ul>
      <p class="body quiet" style="margin-top:28px;font-size:13px">Each row opens its technique: the process, the region once verified, and the pieces in the current Release made with it. Works on touch and keyboard, as the Collection Index does.</p>
    </div>
    <div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="grid-column:1/-1">{fig("01 / Khadi · Spinning · Process image", "r-16x9")}</div>
        {fig("02 / Detail · Yarn", "r-1x1", "fig--b")}
        {fig("03 / Detail · Loom", "r-1x1", "fig--c")}
      </div>
      <div class="two two--even" style="margin-top:28px;gap:32px">
        <div>
          <h3 class="statement">Khadi.</h3>
          <p class="body" style="margin-top:12px">Yarn spun by hand, then woven by hand. The count is never perfectly even, which is why the cloth breathes and drapes as it does. Handloom is humanity’s original sustainable technology — refined across millennia in the warp and the weft.</p>
        </div>
        <table class="table">
          <tr><th>Fibre</th><td>Cotton · silk · linen</td></tr>
          <tr><th>Region</th><td>West Bengal · others pending</td></tr>
          <tr><th>In this Release</th><td>Skirt 002 · Shirt 001 · Skirt 003 · +</td></tr>
          <tr><th>Pieces</th><td><span class="link">See the Khadi pieces</span></td></tr>
        </table>
      </div>
    </div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="two" style="margin-bottom:48px">
    <div>
      <p class="eyebrow">The Masters</p>
      <h2 class="display">Named with permission.</h2>
    </div>
    <p class="body" style="padding-top:8px">The Masters are not supporting characters. Each appears here with their agreement — name, workshop and region. Until that agreement is given, the role and the technique are shown and the name is withheld. Nothing here is written by us on their behalf.</p>
  </div>
  <div class="cols cols--3 grid-masters">
    {master(1,"Jamdani Weaver","Jamdani · handloom")}
    {master(2,"Khadi Spinner","Khadi · handspun yarn","fig--b")}
    {master(3,"Ajrakh Block Printer","Ajrakh · natural dye","fig--c")}
    {master(4,"Ikat Dyer","Ikat · resist-dyed yarn","fig--c")}
    {master(5,"Natural Indigo Dyer","Indigo · sun-fixed dye")}
    {master(6,"Gota Patti Embroiderer","Gota Patti · zari thread","fig--b")}
  </div>
</div></section>

<section class="section section--peat"><div class="wrap two two--even" style="align-items:center">
  <div>
    <p class="eyebrow">Stewardship</p>
    <h2 class="display">To work with The Masters is to become a steward of something irreplaceable.</h2>
    <p class="body" style="margin-top:20px">Every piece in the Collection ships with its Lot number, its Origin, and — with permission — the name of the Master who made it. The value of each piece begins with knowledge held in human hands.</p>
    <p style="margin-top:24px"><span class="link link--ul">See the pieces they made</span></p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    {fig("01 / Hands · Block · Dye", "r-3x4", "fig--peat")}
    {fig("02 / Workshop · Dawn", "r-3x4", "fig--peat")}
  </div>
</div></section>

<section class="section"><div class="wrap">
  <p class="eyebrow">From the Journal</p>
  <div class="cols cols--3">
    {jcard(1,"The Loom","A quarter of an inch a day.","What a Jamdani weaver makes between dawn and dusk, and why the cloth cannot be hurried.","Lot I · 2026")}
    {jcard(2,"The Colour","Indigo waits for the sun.","Natural indigo is fixed by light. On the days the sun does not come, the dye house waits.","Lot I · 2026","fig--b")}
    {jcard(3,"The Loom","Sixteen processes, and the rest between them.","Ajrakh rests between each stage so the dye can bond with the fibre. The waiting is part of the technique.","Lot I · 2026","fig--c")}
  </div>
</div></section>
'''
masters_reg = register("Stories from the workshops, before anyone else.",
  "The Dispatch names the technique, the plant and — with permission — the Master. It goes to The Register first.")

# ---------------------------------------------------------------- THE JOURNAL
journal = f'''
<section class="section section--hero"><div class="wrap two">
  <div>
    <p class="eyebrow">The Journal</p>
    <h1 class="display display--lg">Notes on cloth, colour, and the people who make it.</h1>
    <p class="body" style="margin-top:28px">The Journal is where The Dispatch is kept. Considered writing on craft, provenance, the Masters and what is coming next — sent to The Register first, and published here afterwards.</p>
  </div>
  <div style="padding-top:8px">
    <ul class="index">
      <li class="on"><span class="meta quiet">—</span><span class="name">All notes</span><span class="meta quiet">[ n ]</span></li>
      <li><span class="meta quiet">01</span><span class="name">The Loom</span><span class="meta quiet">Technique · the Masters</span></li>
      <li><span class="meta quiet">02</span><span class="name">The Colour</span><span class="meta quiet">Plant · mineral · season</span></li>
      <li><span class="meta quiet">03</span><span class="name">The Wearer</span><span class="meta quiet">The piece in a life</span></li>
      <li><span class="meta quiet">04</span><span class="name">From the Founder</span><span class="meta quiet">Angela, in the first person</span></li>
      <li><span class="meta quiet">05</span><span class="name">The Dispatch</span><span class="meta quiet">Each Release, stated plainly</span></li>
    </ul>
  </div>
</div></section>

<section class="section"><div class="wrap two two--lead">
  {fig("01 / Lead editorial image · Loom · Hands", "r-4x3")}
  <div style="align-self:end">
    <p class="meta quiet">The Loom · Dispatch No. 01</p>
    <h2 class="display" style="margin-top:16px">A quarter of an inch a day.</h2>
    <p class="body" style="margin-top:20px">What a Jamdani weaver makes between dawn and dusk, why the cloth cannot be hurried, and what that means for the size of a Lot.</p>
    <div class="card__meta meta" style="margin-top:24px"><span>Lot I · September 2026 · 6 min</span><span class="link link--ul">Read the note</span></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="cols cols--3" style="row-gap:64px">
    {jcard(2,"The Colour","Indigo waits for the sun.","Natural indigo is fixed by light, not by chemistry. On the days the sun does not come, the dye house waits.","September 2026","fig--b")}
    {jcard(3,"The Loom","Sixteen processes, and the rest between them.","Ajrakh silk rests between each stage so the dye can bond with the fibre. The waiting is part of the technique.","September 2026","fig--c")}
    {jcard(4,"The Wearer","How to read an Edition number.","3 / 25: what the two numbers on the hangtag mean, and why a run is sized the way it is.","September 2026")}
    {jcard(5,"From the Founder","Weaving as vibration.","Angela on the research behind the house — with monks, with physicists — and why what you wear carries an energy.","September 2026","fig--c")}
    {jcard(6,"The Colour","One Style, many Expressions.","The silhouette is permanent. The season, the plant and the Master change the cloth it is made in.","September 2026")}
    {jcard(7,"The Dispatch","Dispatch No. 01 — the first Release.","The pieces, the number made, the ship date. Stated plainly, as every Release will be.","September 2026","fig--b")}
  </div>
  <p style="margin-top:56px;text-align:center"><span class="link link--ul">Earlier notes</span></p>
</div></section>

<section class="section"><div class="wrap two">
  <div>
    <p class="eyebrow">The Dispatch</p>
    <h2 class="display">Kept here, after it has gone to The Register.</h2>
    <p class="body" style="margin-top:20px">Not a promotion. Not a sales email. A considered piece of writing, three to four times a year around each Release and occasionally between.</p>
  </div>
  <table class="table" style="text-transform:none;letter-spacing:0.04em">
    <tr><th class="meta">No. 01</th><td style="text-align:left">The first Release — Lot I</td><td>Sept 2026</td></tr>
    <tr><th class="meta">No. 02</th><td style="text-align:left">[ title ]</td><td>[ date ]</td></tr>
    <tr><th class="meta">No. 03</th><td style="text-align:left">[ title ]</td><td>[ date ]</td></tr>
  </table>
</div></section>
'''
journal_reg = register("The Dispatch arrives by letter first.",
  "Every note is sent to The Register before it appears here. Free, and open to all.")

# ---------------------------------------------------------------- THE REGISTER
def faq(q, a=None):
    if a:
        return f'<li class="open"><div style="display:flex;justify-content:space-between"><span class="meta">{q}</span><span class="plus">−</span></div><p class="ans">{a}</p></li>'
    return f'<li><span class="meta">{q}</span><span class="plus">+</span></li>'

the_register = f'''
<section class="section section--hero"><div class="wrap two two--even" style="gap:80px">
  <div>
    <p class="eyebrow">The Register</p>
    <h1 class="display display--lg">To be on The Register<br>is to be first.</h1>
    <p class="body" style="margin-top:28px">Free, and open to all. The Register is how the house speaks to the people who care about how things are made — first to hear of each Release, first to be invited to Atelier Evenings, and the only address The Dispatch is sent to.</p>
    <div class="form" style="display:grid;gap:16px;margin-top:40px;max-width:520px">
      <label class="field"><span class="field__label meta">Email address</span><div class="field__input">you@example.com</div></label>
      <label class="field"><span class="field__label meta">First name <span class="quiet">· optional</span></span><div class="field__input">&nbsp;</div></label>
      <label class="check"><i></i><span>[Consent line — wording from Christina] Yes, add me to The Register. I can leave at any time.</span></label>
      <div><span class="btn">Join The Register</span></div>
      <p class="meta-lc quiet">A confirmation arrives by email. One click, and you are on The Register.</p>
    </div>
  </div>
  {fig("01 / Letter · Cloth · Table", "r-4x5", "fig--b")}
</div></section>

<section class="section"><div class="wrap">
  <p class="eyebrow">What you receive</p>
  <div class="cols cols--3 cols--ruled">
    <div class="col"><span class="col__num meta quiet">01</span><h3>The Dispatch</h3><p class="body">A considered piece of writing, not a sales email. On craft, provenance, the people behind the pieces, and what is coming next.</p></div>
    <div class="col"><span class="col__num meta quiet">02</span><h3>Each Release, first</h3><p class="body">The pieces, the number made and the ship date — announced to The Register before the Release is public. Scarcity stated plainly.</p></div>
    <div class="col"><span class="col__num meta quiet">03</span><h3>Atelier Evenings</h3><p class="body">Private gatherings around craft, conversation and community. The Register is the only route to them.</p></div>
  </div>
</div></section>

<section class="section section--peat"><div class="wrap">
  <div class="two" style="margin-bottom:48px">
    <div><p class="eyebrow">How it works</p><h2 class="display">Three steps. No account.</h2></div>
  </div>
  <div class="cols cols--3 cols--ruled">
    <div class="col"><span class="col__num meta">01 / Join</span><h3>One address.</h3><p class="body">Your email, and your first name if you would like the letters addressed to you. Nothing else is asked for.</p></div>
    <div class="col"><span class="col__num meta">02 / Confirm</span><h3>One click.</h3><p class="body">A confirmation arrives in your inbox. Clicking it is what places you on The Register, so no one can be added by someone else.</p></div>
    <div class="col"><span class="col__num meta">03 / Receive</span><h3>Then, the letters.</h3><p class="body">The Dispatch, each Release before it is public, and the invitations. Every letter carries a link to leave; it takes one click.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap two">
  <div>
    <p class="eyebrow">Plainly</p>
    <h2 class="display">No urgency. No noise.</h2>
  </div>
  <div style="padding-top:8px">
    <p class="body">We do not manufacture urgency. Expect the announcement of three to four Releases a year, The Dispatch around each, and very little in between. Your address is used for The Register and nothing else.</p>
    <p class="body" style="margin-top:16px">The Register is not The Circle. The Circle is a small, invitation-only group of founding friends of the house, and has no application route. The Register is open to everyone, and it is the door to everything that follows.</p>
  </div>
</div></section>

<section class="section"><div class="wrap two">
  <div><p class="eyebrow">The details</p><h2 class="display">Questions, answered plainly.</h2></div>
  <ul class="rows">
    {faq("Is The Register free?", "Yes. There is no fee, no tier and nothing to buy. It is a list of people who want to know how the pieces are made and when they are available.")}
    {faq("How often will I hear from you?")}
    {faq("Can I leave?")}
    {faq("Is this the same as The Circle?")}
    {faq("What happens to my email address?")}
  </ul>
</div></section>

<section class="section"><div class="wrap">
  <p class="eyebrow">Latest from The Dispatch</p>
  <div class="cols cols--3">
    {jcard(1,"The Dispatch","Dispatch No. 01 — the first Release.","The pieces, the number made, the ship date. Stated plainly.","September 2026","fig--b")}
    {jcard(2,"The Loom","A quarter of an inch a day.","What a Jamdani weaver makes between dawn and dusk.","September 2026")}
    {jcard(3,"From the Founder","Weaving as vibration.","Angela on the research behind the house.","September 2026","fig--c")}
  </div>
</div></section>
'''
register_reg = ""  # the page carries its own form in the hero; no second band

pages['collection']   = ("The Collection — Hartwick Atelier", "collection", collection, collection_reg)
pages['the-masters']  = ("The Masters — Hartwick Atelier", "masters", masters, masters_reg)
pages['the-journal']  = ("The Journal — Hartwick Atelier", "journal", journal, journal_reg)
pages['the-register'] = ("The Register — Hartwick Atelier", "register", the_register, register_reg)
