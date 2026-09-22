#!/usr/bin/env python3
"""
Hartwick Atelier — Aloha's product-copy sheet -> Shopify.

    Hartwick Atelier | Product Copy for Angela & Ivan  (Google Sheet, 5 tabs)
        -> export as .xlsx (File > Download > Microsoft Excel)
        -> this script
        -> Shopify product metafields (hartwick.*), variant SKUs, and — at
           launch only — title, description and price.

Aloha, 16 September 2026: "Rather than creating another place for metadata,
I'd like us to use this same spreadsheet going forward as the team's working
source … Then on your side, the relevant fields can map into the Shopify
product records, metafields and metaobjects you've already created."

Aloha, 21 September 2026 (sheet "(2)"): "We've returned to the original names,
such as Tribeca Skirt and Amman Shirt. Please use these as the customer facing
product titles, with the Expression underneath to distinguish the fabric,
weave, colour or treatment. Style codes and product IDs stay internal. Column O
in '01 Product copy' is now in short bullet points, ready for the product page
description accordion. You can use the updated sheet to build out the website
product pages, keeping anything marked draft or awaiting confirmation
unpublished."

So, from that sheet on:
  - tab 01 "Product name" IS the customer-facing name (Tribeca Skirt). The
    `style` record's display_name carries it; the numbered code (Skirt 001)
    moves to style.code, internal (--styles does the one-off swap).
  - the fine-silk rows have no location name recorded (DUPATTA 01, SHAYLA 03):
    tab 05, "Do not invent location names where none is recorded" — their code
    stays the name.
  - column O is a bullet list -> hartwick.construction_details as a rich-text
    LIST, which the Description row renders as <ul>.
  - the "Approval notes" column is the gate: a row that says DRAFT / to review
    / awaiting gets hartwick.copy_status = draft, the unpublished theme marks
    the page, and --launch refuses it.
  - the sheet's column E still reads "Legacy name - internal only" but holds
    the short hero subtitle ("Handspun Matka Silk") — the old "Short hero
    subtitle" column was dropped and its data kept under the stale header. It
    is read as the subtitle (hartwick.subtitle) and Aloha is told.

MAPPING is the single source of truth for column -> field. docs/product-data-
mapping.md is generated from it (--doc), so the document Aloha reads and the
code that runs are the same table.

USAGE
    python3 scripts/sheet-to-shopify.py --match                   # sheet row -> Shopify product, all 78
    python3 scripts/sheet-to-shopify.py --plan P001               # what would be written for SKIRT 001
    python3 scripts/sheet-to-shopify.py --write P001              # metafields + SKUs (needs write scopes)
    python3 scripts/sheet-to-shopify.py --write P001 --launch     # ALSO title, description, price: LIVE-VISIBLE
    python3 scripts/sheet-to-shopify.py --write-all               # metafields for every row with a certain match
    python3 scripts/sheet-to-shopify.py --styles                  # one-off: style.display_name <- location name, code <- number
    python3 scripts/sheet-to-shopify.py --refresh                 # re-pull products + metaobjects into store-snapshot/
    python3 scripts/sheet-to-shopify.py --definitions             # create the missing hartwick.* definitions
    python3 scripts/sheet-to-shopify.py --csv out.csv             # admin-import CSV (Handle + metafield columns)
    python3 scripts/sheet-to-shopify.py --doc                     # regenerate docs/product-data-mapping.md

    --sheet PATH   the .xlsx export (default: the one in ~/Downloads)
    --dry          print the GraphQL instead of running it
    --skus         also write the product reference to the variant SKUs (off
                   until the size-suffix question is settled)

WRITES go through the Shopify CLI's stored store auth:
    shopify store auth --store 9c8a52-dc.myshopify.com --scopes read_products,write_products,read_metaobjects,write_metaobjects,read_metaobject_definitions,write_metaobject_definitions
and `shopify store execute --allow-mutations`. Nothing here stores a token.

WHAT STAYS UNPUBLISHED. Draft copy goes into hartwick.* metafields, which no
published theme reads (checked 21 Sep: the live "Hartwick - Landing" theme
renders Luxe's native product section), so the live site does not change.
Title, description, price and SKU are visible on the live theme's product
pages, so they are written only with --launch, per product, and only for a
row whose Approval notes do not say DRAFT.
"""
import argparse, csv, json, os, re, subprocess, sys, tempfile
from collections import OrderedDict

STORE = "9c8a52-dc.myshopify.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SHEET = os.path.expanduser("~/Downloads/Hartwick Atelier _ Product Data text (2).xlsx")
SNAPSHOT = os.path.join(ROOT, "store-snapshot")

# ---------------------------------------------------------------------------
# THE MAPPING. One row per sheet column.
#   tab, column, target, kind, website, seo, note
#   kind: mf:<key>:<type>   product metafield hartwick.<key>
#         core:<field>      Shopify product / variant field  (launch only)
#         ref:<key>:<type>  metaobject reference resolved by name
#         theme             a theme setting, not per-product data
#         none              not stored (internal / derived / handled elsewhere)
# ---------------------------------------------------------------------------
MAPPING = [
 # --- 01 Product copy -----------------------------------------------------
 ("01","ID","none","none","—","—","Worksheet key only. Never published (tab 05)."),
 ("01","Product name","ref:style:metaobject_reference","ref","Opening — the heading (h1); Lot record STYLE; Related Works cards; the browser tab title","Product name in JSON-LD; the crawlable heading","The customer-facing name (Aloha, 21 Sept: Tribeca Skirt, Amman Shirt). Resolved to the `style` record whose display_name / legacy_name / code matches; the record's display_name IS this name after --styles. Fine-silk rows keep their code (DUPATTA 01) — no location name is recorded. At --launch it becomes the title before the bar: “Tribeca Skirt | Handspun Matka Silk, Emerald Changeant”."),
 ("01","Expression / full subtitle","mf:expression:single_line_text_field","mf","Lot record EXPRESSION; the source of the subtitle and selector below","Part of the product name / description in JSON-LD","Split at the comma: before = subtitle, after = selector."),
 ("01","EU retail (€)","core:price","core","Buy rail price (Shopify money, Markets converts)","Offer price / currency in JSON-LD; channel feeds","LAUNCH ONLY. Store base is USD; EU RRP is entered on the EUR market price list or converted — Christina to confirm which."),
 ("01","Legacy name - internal only","mf:subtitle:single_line_text_field","mf","Opening — serif line under the name","—","STALE HEADER. Since the 21 Sept sheet this column holds the short hero subtitle (“Handspun Matka Silk”, “Handspun Linen”); the old Short-hero-subtitle column was removed and its data kept here. Read as the subtitle. The legacy name itself is now the Product name."),
 ("01","Approval notes","mf:copy_status:single_line_text_field","mf","Unpublished theme only — a “Draft copy” marker on the page; nothing on the live theme","Nowhere","THE GATE. “DRAFT | Angela to review …” -> draft; “… approved …” -> approved. --launch refuses a draft row. The note text itself goes to internal_notes (no storefront access)."),
 ("01","Short hero subtitle","none","derived","Opening — serif line under the name","—","Column E above when filled; else the Expression before its comma. Not stored twice."),
 ("01","Material / technique line","mf:material_line:single_line_text_field","mf","Opening — record label under the subtitle","—","“HANDSPUN / HANDWOVEN”."),
 ("01","Hero introduction","mf:hero_introduction:rich_text_field","mf","Opening — the introduction paragraph(s)","Product description in JSON-LD (at launch it becomes product.description)","Staged here while DRAFT; --launch copies it to the Shopify description, which is live."),
 ("01","Fibre","mf:fibre:single_line_text_field","mf","Opening FIBRE fact; From Fibre to Garment stage 01; The Cloth heading fallback","`material` in JSON-LD","“Silk”."),
 ("01","Weave","mf:weave:single_line_text_field","mf","Opening WEAVE fact; stage 03 method line(s)","additionalProperty in JSON-LD","“Handwoven / Changeant”."),
 ("01","Colour / expression selector","mf:colour_name:single_line_text_field","mf","Buy rail EXPRESSION row; opening COLOUR fact","`color` in JSON-LD; channel colour attribute","“Emerald Changeant”."),
 ("01","Made in","ref:place_of_construction:origin","ref","Opening MADE IN fact; stage 05 Place","`countryOfOrigin` in JSON-LD","Resolved to an `origin` record by place name (India / Jaipur / West Bengal exist); a new place needs a new record."),
 ("01","Fit summary","mf:fit:single_line_text_field","mf","Opening — FIT & MEASUREMENTS record line","—","“HIGH WAIST / FULL LENGTH”."),
 ("01","Fit & measurements body","mf:fit_measurements:multi_line_text_field","mf","Opening — sentence under the Fit line","—",""),
 ("01","Description accordion (these should be bullet points)","mf:construction_details:rich_text_field","mf","Opening — DESCRIPTION row, as a bullet list","Description in JSON-LD (appended at launch)","Column O, 21 Sept: “•” lines -> one rich-text list item each; a line without a bullet is a paragraph. The row renders <ul>."),
 ("01","Size options","core:variants","core","Buy rail size picker","Offers per variant in JSON-LD","Variants already exist (S / M / L). Not written; compared and warned."),
 ("01","Size-guide link","theme","theme","Buy rail SIZE GUIDE link","—","One theme setting (the size-guide page), not per product."),
 ("—","(style code: Skirt 001)","ref:style.code","ref","Nowhere — internal (Aloha, 21 Sept)","Nowhere","No longer in the sheet. Kept on the `style` record as `code`, filled by --styles from the old display_name; the collection template may still address a Style by it."),
 ("01","Availability / dispatch notes","mf:availability_note:single_line_text_field","mf","Buy rail AVAILABILITY (overrides the live stock line) and EXPECTED DISPATCH","Offer availability in JSON-LD comes from live stock, not this note","Only a CONFIRMED note is written; “Confirm …” text is dropped and the live line shows instead."),
 ("01","Old product URL","none","none","—","301 redirect old URL -> new","Squarespace category URLs; product-level redirects need the product-level old URLs."),
 # --- 02 Origin and maker -------------------------------------------------
 ("02","01 Fibre: origin & composition","mf:fibre_ratio:single_line_text_field","mf","Stage 01 COMPOSITION; The Cloth COMPOSITION","`material` composition in JSON-LD","Cell parsed: factual fragments kept, “… to confirm” dropped. Fibre itself comes from tab 01."),
 ("02","02 Spinning: process, maker, place","mf:yarn:single_line_text_field","mf","Stage 02 method line(s); material line fallback","additionalProperty (yarn)","“Handspun”. Maker/place fragments -> Master / place_of_spinning once named."),
 ("02","03 Weaving: process, maker, place","mf:weave:single_line_text_field","mf","Stage 03 method line(s)","additionalProperty (weave)","Fragments after the first (“black silk weft”) are kept as further lines; tab 01 Weave wins if both set."),
 ("02","04 Dyeing -- process, maker, place","mf:dye_process:single_line_text_field","mf","Stage 04 method line(s)","additionalProperty (dye)","A verified `dye` record (hartwick.dye) takes precedence when linked."),
 ("02","05 Construction -- process, atelier, place","mf:construction_method:single_line_text_field","mf","Stage 05 method line(s)","additionalProperty (construction)","“Dropped box pleats; concealed side zip”."),
 ("02","Process tags (01–05)","mf:process_tags:single_line_text_field","mf","The small classification under each stage","—","Held whole; “[…]” entries render as [Confirm]."),
 ("02","Dye / process source link","mf:internal_notes:multi_line_text_field","mf","Nowhere","Nowhere","Internal evidence."),
 ("02","Master name","ref:masters:master.name","ref","The Master — name over the photograph; stage Master lines","Person in JSON-LD (contributor, not manufacturer)","Written to the `master` RECORD, not the product. Empty on all 78 rows today; the module stays hidden until a name is verified (tab 05)."),
 ("02","Master discipline","ref:masters:master.role","ref","The Master — discipline / place line; decides which stage the Master sits on","—","-> master.role (+ master.stage)."),
 ("02","Master place","ref:masters:master.region","ref","The Master — discipline / place line","—","-> master.region (an `origin` record)."),
 ("02","Master introduction (if used)","ref:masters:master.stories","ref","The Master record page (Phase 2)","Person description","-> master.stories."),
 ("02","Master-record link","none","derived","VIEW MASTER RECORD","—","Derived: the record's own page once metaobject storefront pages are on; else the Masters page."),
 ("02","Workshop image filename","ref:masters:master.workshop_images","ref","The Master — full-width photograph","ImageObject","Uploaded to Files, linked on the master record."),
 ("02","Verification / approval notes","mf:internal_notes:multi_line_text_field","mf","Nowhere","Nowhere","Internal."),
 # --- 03 Cloth and images -------------------------------------------------
 ("03","Material heading","mf:cloth_heading:single_line_text_field","mf","The Cloth — display heading","—","“MATKA SILK”."),
 ("03","Material short introduction","mf:cloth_statement:multi_line_text_field","mf","The Cloth — two-line statement","—","Line breaks kept."),
 ("03","Material explanation","mf:cloth_explanation:multi_line_text_field","mf","The Cloth — paragraph under the statement","Description text (crawlable)",""),
 ("03","Exact composition","mf:fibre_ratio:single_line_text_field","mf","The Cloth COMPOSITION; stage 01","`material`","Wins over tab 02's fragment when both exist."),
 ("03","Material-record reference","mf:material_record_ref:single_line_text_field","mf","The Cloth RECORD; Lot record PRODUCT REFERENCE fallback","`sku` fallback","Tab 05: distinguish from the product SKU — so it is its own field."),
 ("03","Material-record link","none","future","—","—","A cloth record page is Phase 2 (a `cloth` metaobject with storefront pages)."),
 ("03","Image 01–04 index label","ref:cloth_details:file.alt","ref","The Cloth — numbered index; the image's alt text","Image alt text","The label IS the alt text of the file in hartwick.cloth_details (list of files)."),
 ("03","Image 01–04 caption","mf:cloth_captions:list.single_line_text_field","mf","The Cloth — caption under each photograph","—","Same order as cloth_details."),
 ("03","Image 01–04 filename & alt text","ref:cloth_details:file","ref","The Cloth — the photographs","ImageObject","Files uploaded to Shopify Files, then referenced. Blank on all rows until Aloha's renamed images arrive."),
 ("03","Look closer line","mf:look_closer:single_line_text_field","mf","The Cloth — foot line","—",""),
 ("03","Hero image filename & alt text","core:featured_media","core","Opening — first photograph","Primary image in JSON-LD","Product media, with alt."),
 # --- 04 Production and care ----------------------------------------------
 ("04","Product reference / SKU","core:sku","core","Lot record PRODUCT REFERENCE","`sku` in JSON-LD; channel feeds","On every size variant as REF-S / REF-M / REF-L (--sku-suffix off keeps it identical). Written with --write."),
 ("04","Current lot number","ref:lot:metaobject_reference","ref","Lot record LOT; opening Lot label","—","Resolved to the `lot` record by numeral; only “I” exists."),
 ("04","Production quantity","mf:production_quantity:number_integer","mf","Lot record QUANTITY (gated)","—","Renders only when hartwick.production_quantity_verified is true."),
 ("04","Production period / completion","ref:lot.opened_on/completed_on","ref","Lot record PRODUCTION / COMPLETION","—","On the `lot` record, not the product."),
 ("04","Care & Repair copy","mf:care_instructions:rich_text_field","mf","Care & Repair row","FAQ / Knowledge Base source","Interim draft; publication needs the verified care source (tab 05)."),
 ("04","Verified care source","mf:internal_notes:multi_line_text_field","mf","Nowhere","Nowhere","Internal."),
 ("04","Related work 01–03","mf:related_products:list.product_reference","mf","Related Works cards","isRelatedTo in JSON-LD; internal links","Names resolved through tab 01 to Shopify products; “Suggested:” rows are written only with --include-suggested."),
 ("04","Related image filenames","none","none","—","—","The related product's own featured image is used."),
 ("04","Product-specific delivery / returns exception","mf:delivery_exception:rich_text_field","mf","Buy rail Delivery row, above the policy","—","Empty on all rows; field created only if ever used."),
 ("04","Approval / outstanding facts","mf:internal_notes:multi_line_text_field","mf","Nowhere","Nowhere","Internal."),
 # --- 05 Shared text and guide --------------------------------------------
 ("05","Labels, buttons, links","theme","theme","Section settings on the product template (one place)","—","COLLECT, EXPECTED DISPATCH, Request a Private Appointment, Scroll to explore, FIT & MEASUREMENTS … set on 16 Sept."),
 ("05","Delivery / returns policy copy","core:shop.policies","core","Delivery & Returns row (buy rail) and Shipping & Returns row — one source","Shipping/returns policy pages; Knowledge Base","Settings > Policies. Christina's text; not in the sheet."),
]

MF_TYPES = {}   # key -> type, from MAPPING
for tab, col, target, kind, *_ in MAPPING:
    if target.startswith("mf:"):
        _, key, typ = target.split(":", 2)
        MF_TYPES[key] = typ

# Definitions the theme reads that the sheet does not feed (this morning's set)
EXTRA_DEFS = {
    "place_of_fibre": "metaobject_reference", "place_of_spinning": "metaobject_reference",
    "cloth_details": "list.file_reference", "provenance_verified_by": "single_line_text_field",
    "provenance_verified_on": "date", "expected_ship_date": "single_line_text_field",
    "individually_numbered": "boolean", "production_quantity_verified": "boolean",
}

# ---------------------------------------------------------------------------
# Headers that were renamed between exports, mapped to the name the code uses.
HEADER_ALIASES = {
    "Description accordion (these should be bullet points)": "Description accordion",
}

def load_sheet(path):
    import openpyxl
    wb = openpyxl.load_workbook(path, data_only=True)
    tabs = {}
    for ws in wb.worksheets[:4]:
        rows = list(ws.iter_rows(min_row=3, values_only=True))
        hdr = [HEADER_ALIASES.get(h, h) for h in rows[0]]
        recs = OrderedDict()
        for r in rows[1:]:
            if not r or not r[0]:
                continue
            rec = {hdr[i]: (r[i] if r[i] is not None else "") for i in range(len(hdr)) if hdr[i]}
            recs[rec["ID"]] = rec
        tabs[ws.title[:2]] = recs
    # 21 Sept export: the "Short hero subtitle" column is gone and its data sits
    # under the stale "Legacy name - internal only" header. Detect that by the
    # data, not the header: a legacy name would repeat the Product name's noun
    # ("Tribeca Skirt"); the subtitle never does ("Handspun Matka Silk").
    t1 = tabs.get("01", {})
    if t1 and "Short hero subtitle" not in next(iter(t1.values())):
        col = "Legacy name - internal only"
        looks_like_subtitle = sum(1 for r in t1.values() if s(r.get(col)) and norm(s(r.get(col)).split()[-1]) not in norm(r.get("Product name"))) 
        for r in t1.values():
            r["Short hero subtitle"] = s(r.get(col)) if looks_like_subtitle > len(t1) / 2 else ""
        if looks_like_subtitle > len(t1) / 2:
            sys.stderr.write(f"note: tab 01 column {col!r} holds the short hero subtitle on {looks_like_subtitle} of {len(t1)} rows (stale header) — read as the subtitle\n")
    return tabs

def s(v):
    return str(v).strip() if v is not None else ""

CONFIRM_RE = re.compile(r"\b(to confirm|to be confirmed|confirm|tbc|pending)\b|\[", re.I)

def fragments(cell):
    """'Handwoven; black silk weft; maker and place to confirm' -> (['Handwoven','black silk weft'], ['maker and place to confirm'])"""
    facts, notes = [], []
    for part in re.split(r"[;\n]", s(cell)):
        p = part.strip().rstrip(".")
        if not p:
            continue
        (notes if CONFIRM_RE.search(p) else facts).append(p)
    return facts, notes

BULLET_RE = re.compile(r"^\s*[•·\-\*–]\s+")

def rich(text):
    """Shopify rich_text_field JSON from plain text. A run of "• …" lines is one
    unordered list (column O, 21 Sept); anything else is a paragraph."""
    children, items = [], []
    def flush():
        nonlocal items
        if items:
            children.append({"type": "list", "listType": "unordered", "children": [
                {"type": "list-item", "children": [{"type": "text", "value": i}]} for i in items]})
            items = []
    for line in s(text).split("\n"):
        line = line.strip()
        if not line:
            continue
        if BULLET_RE.match(line):
            items.append(BULLET_RE.sub("", line).strip().rstrip("."))
        else:
            flush(); children.append({"type": "paragraph", "children": [{"type": "text", "value": line}]})
    flush()
    return json.dumps({"type": "root", "children": children})

def bullets_html(text):
    """The same bullets as HTML, for the launch-time description."""
    items = [BULLET_RE.sub("", l).strip().rstrip(".") for l in s(text).split("\n") if BULLET_RE.match(l.strip())]
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>" if items else ""

# The sheet's approval column, read as a status. Anything not clearly approved
# is a draft — that is the direction Aloha asked for ("keeping anything marked
# draft or awaiting confirmation unpublished").
DRAFT_RE = re.compile(r"\bdraft\b|to review|awaiting|unconfirmed|not approved", re.I)
APPROVED_RE = re.compile(r"\bapproved\b", re.I)

def copy_status(note):
    n = s(note)
    if DRAFT_RE.search(n): return "draft"
    if APPROVED_RE.search(n): return "approved"
    return "draft"

# ---------------------------------------------------------------------------
def load_snapshot():
    prods = json.load(open(os.path.join(SNAPSHOT, "products.json")))
    mos = json.load(open(os.path.join(SNAPSHOT, "metaobjects.json")))
    return prods, mos

def norm(x): return re.sub(r"[^a-z0-9 ]", " ", s(x).lower()).strip()
STOP = {"the","and","with","in","of","handwoven","handspun","natural","silk","cotton","khadi","dye","block","print","printed",
        "blouse","shirt","skirt","trousers","dress","robe","coat","scarf","long","short","set","pyjama","tote","belt","pouch","kaftan","fine","mashru"}
# Sheet name -> what the old site's title/handle actually says (typos included).
ALIAS = {"samarkant dress": "samarkand dress", "calcutta blouse": "calcutta shirt", "cyprus pyjama set": "cyprus lounge set",
         "blossom shorts": "blossom lounge shorts", "pine shirt": "pine lounge shirt", "jasmine dress": "jasmine lounge dress",
         "jaipur scarf": "jaipur sarong", "cedar trousers": "cedar pants", "sitges tote": "stiges tote bag",
         "dupatta 01": "oversized dupatta 01", "dupatta 02": "oversized dupatta 02", "classic stole 01": "stole 01", "classic stole 02": "stole 02"}
# The store's own vocabulary for a sheet colour, where the old records show it:
# jodhpur-blouse-handwoven-ikat-navy-celeste, "Navy Quilted Handwoven Cotton Ikat".
SYNONYM = {"celeste": "navy"}
NOISE = {"the","and","with","in","of","by","a","an","raw","hand","pattern","print","motif"}

def stem(w):
    w = SYNONYM.get(w, w)
    if len(w) > 4 and w.endswith("ed"): w = w[:-2]
    elif len(w) > 3 and w.endswith("s"): w = w[:-1]
    return w

def tokens(text):
    return {stem(w) for w in re.split(r"[^a-z0-9]+", s(text).lower()) if len(w) > 2 and w not in NOISE}

OLD_NAME_RE = re.compile(r"(?:changed from|omits the older)\s+(.+?)\s+(?:in the older|motif|to\b)", re.I)

def style_index(mos):
    """Every name a `style` record answers to -> its gid: display_name, legacy_name, code."""
    idx = {}
    for mo in mos.get("style", []):
        for k in ("display_name", "legacy_name", "code"):
            v = norm(x_field(mo, k))
            if v: idx.setdefault(v, mo["id"])
    return idx

def match_products(tab01, prods, mos=None):
    """Sheet row -> Shopify product.

    Candidates come from the Style record the product is already linked to
    (hartwick.style, written 17 Sept on the apparel; the sheet's Product name
    is that record's legacy name), or, with no Style linked (fine silk,
    accessories), from title words. Within the candidates the Expression's
    words decide, weighted by where they appear — the old title counts most,
    the old subtitle next, the handle least (handles of "-copy" products lie).
    Old print names the sheet notes as renamed ("changed from Victorian Rouge
    … to Vine Red") count as the row's words too.

    Rows are settled best score first, and a product once taken is off the
    table for the rest — so two Tribeca Skirts cannot both take the emerald
    one. ok = a clear winner; check = a tie to settle by eye; none = nothing
    left (the note says who took it)."""
    styles = style_index(mos or {})
    by_style = {}
    for p in prods:
        for m in p["metafields"]["nodes"]:
            if m["namespace"] == "hartwick" and m["key"] == "style":
                by_style.setdefault(m["value"], []).append(p)
    rows = {}
    for pid, r in tab01.items():
        name = s(r["Product name"])
        sid = styles.get(norm(name))
        cands = list(by_style.get(sid, [])) if sid else []
        how = "style"
        if not cands:
            how = "title"
            key = norm(ALIAS.get(norm(name), name))
            words = [w for w in key.split() if w not in STOP]
            cands = [p for p in prods if words and all(w in norm(p["title"]) or w in norm(p["handle"]) for w in words)]
        want = tokens(r["Expression / full subtitle"]) | tokens(r.get("Colour / expression selector"))
        for old in OLD_NAME_RE.findall(s(r.get("Approval notes"))):
            want |= tokens(old)
        scored = []
        for p in cands:
            cf = {m["key"]: m["value"] for m in p["metafields"]["nodes"] if m["namespace"] == "custom"}
            title = p["title"].split("|", 1)[1] if "|" in p["title"] else p["title"]
            sc = 3 * len(want & tokens(title)) + 2 * len(want & tokens(cf.get("subtitle"))) + len(want & tokens(p["handle"].replace("-", " ")))
            scored.append((sc, p))
        scored.sort(key=lambda x: -x[0])
        rows[pid] = {"how": how, "scored": scored}
    out, taken = {}, {}
    for pid in sorted(rows, key=lambda k: -(rows[k]["scored"][0][0] if rows[k]["scored"] else -1)):
        left = [(sc, p) for sc, p in rows[pid]["scored"] if p["id"] not in taken]
        cands = [p["handle"] for _, p in left[:4]]
        if not left:
            gone = [f"{p['handle']} → {taken[p['id']]}" for _, p in rows[pid]["scored"][:2]]
            out[pid] = {"product": None, "confidence": "none", "how": rows[pid]["how"], "candidates": gone}
            continue
        best = left[0][1]
        tie = len(left) > 1 and left[1][0] == left[0][0]
        if not tie: taken[best["id"]] = pid
        out[pid] = {"product": best, "confidence": "check" if tie else "ok", "how": rows[pid]["how"], "candidates": cands}
    return OrderedDict((pid, out[pid]) for pid in tab01)

# ---------------------------------------------------------------------------
def build_payload(pid, tabs, matches, mos, opts):
    """Everything the sheet says about one product, resolved to Shopify fields."""
    t1, t2, t3, t4 = (tabs[k].get(pid, {}) for k in ("01", "02", "03", "04"))
    m = matches[pid]; prod = m["product"]
    mf, core, warn, notes = OrderedDict(), OrderedDict(), [], []

    # The customer-facing name (Aloha, 21 Sept). The sheet writes the fine-silk
    # codes in capitals (DUPATTA 01); the store's records say Dupatta 01, and a
    # heading in capitals is the theme's job, so the case is normalised there
    # only. Location names keep the sheet's own spelling.
    name = s(t1.get("Product name"))
    if name.isupper(): name = name.title()
    sid = style_index(mos).get(norm(name))
    if sid: mf["style"] = ("metaobject_reference", sid)
    else: warn.append(f"no `style` record answers to {name!r} — create it")
    if prod and norm(name).split()[0] not in norm(prod["title"]) and norm(ALIAS.get(norm(name), "")).split()[:1] != norm(prod["title"]).split()[:1]:
        warn.append(f"name {name!r} vs store title {prod['title']!r} — spelling differs; the sheet wins at --launch")

    # the gate
    status = copy_status(t1.get("Approval notes"))
    mf["copy_status"] = ("single_line_text_field", status)

    expr = s(t1.get("Expression / full subtitle"))
    if expr: mf["expression"] = ("single_line_text_field", expr)
    if s(t1.get("Short hero subtitle")): mf["subtitle"] = ("single_line_text_field", s(t1["Short hero subtitle"]))
    if s(t1.get("Material / technique line")): mf["material_line"] = ("single_line_text_field", s(t1["Material / technique line"]))
    if s(t1.get("Hero introduction")): mf["hero_introduction"] = ("rich_text_field", rich(t1["Hero introduction"]))
    if s(t1.get("Fibre")): mf["fibre"] = ("single_line_text_field", s(t1["Fibre"]))
    # weave: tab 01 wins, tab 02's further fragments are appended as lines
    w_facts, w_notes = fragments(t2.get("03 Weaving: process, maker, place"))
    weave = s(t1.get("Weave")) or (w_facts[0] if w_facts else "")
    extra = [f for f in w_facts[1:]] if w_facts else []
    if weave: mf["weave"] = ("single_line_text_field", "; ".join([weave] + extra))
    if s(t1.get("Colour / expression selector")): mf["colour_name"] = ("single_line_text_field", s(t1["Colour / expression selector"]))
    made = s(t1.get("Made in"))
    if made:
        oid = origin_id(mos, made)
        if oid: mf["place_of_construction"] = ("metaobject_reference", oid)
        else: warn.append(f"Made in {made!r}: no `origin` record — create it")
    if s(t1.get("Fit summary")): mf["fit"] = ("single_line_text_field", s(t1["Fit summary"]))
    if s(t1.get("Fit & measurements body")): mf["fit_measurements"] = ("multi_line_text_field", s(t1["Fit & measurements body"]))
    if s(t1.get("Description accordion")): mf["construction_details"] = ("rich_text_field", rich(t1["Description accordion"]))
    avail_f, avail_n = fragments(t1.get("Availability / dispatch notes"))
    if avail_f: mf["availability_note"] = ("single_line_text_field", "; ".join(avail_f))
    notes += avail_n

    # tab 02
    f_facts, f_notes = fragments(t2.get("01 Fibre: origin & composition")); notes += f_notes
    comp = s(t3.get("Exact composition")) or "; ".join(f for f in f_facts if norm(f) != norm(s(t1.get("Fibre"))))
    if comp: mf["fibre_ratio"] = ("single_line_text_field", comp)
    sp_f, sp_n = fragments(t2.get("02 Spinning: process, maker, place")); notes += sp_n
    if sp_f: mf["yarn"] = ("single_line_text_field", "; ".join(sp_f))
    notes += w_notes
    d_f, d_n = fragments(t2.get("04 Dyeing -- process, maker, place")); notes += d_n
    if d_f: mf["dye_process"] = ("single_line_text_field", "; ".join(d_f))
    c_f, c_n = fragments(t2.get("05 Construction -- process, atelier, place")); notes += c_n
    if c_f: mf["construction_method"] = ("single_line_text_field", "; ".join(c_f))
    if s(t2.get("Process tags (01–05)")): mf["process_tags"] = ("single_line_text_field", s(t2["Process tags (01–05)"]))
    for k in ("Master name", "Master discipline", "Master place", "Master introduction (if used)", "Workshop image filename"):
        if s(t2.get(k)): warn.append(f"tab 02 {k!r} is filled — write it to the `master` record by hand (this script does not create people)")

    # tab 03
    if s(t3.get("Material heading")): mf["cloth_heading"] = ("single_line_text_field", s(t3["Material heading"]))
    if s(t3.get("Material short introduction")): mf["cloth_statement"] = ("multi_line_text_field", s(t3["Material short introduction"]))
    if s(t3.get("Material explanation")): mf["cloth_explanation"] = ("multi_line_text_field", s(t3["Material explanation"]))
    if s(t3.get("Material-record reference")): mf["material_record_ref"] = ("single_line_text_field", s(t3["Material-record reference"]))
    caps = [s(t3.get(f"Image 0{i} caption")) for i in range(1, 5)]
    labels = [s(t3.get(f"Image 0{i} index label")) for i in range(1, 5)]
    if any(caps): mf["cloth_captions"] = ("list.single_line_text_field", json.dumps([c for c in caps if c]))
    if any(s(t3.get(f"Image 0{i} filename & alt text")) for i in range(1, 5)):
        warn.append("tab 03 image filenames present — upload to Files and link in hartwick.cloth_details (alt = index label); this script does not upload")
    else:
        notes.append("cloth photographs: index labels " + " / ".join(l for l in labels if l) + " — files not yet supplied")
    if s(t3.get("Look closer line")): mf["look_closer"] = ("single_line_text_field", s(t3["Look closer line"]))

    # tab 04
    sku = s(t4.get("Product reference / SKU"))
    if sku: core["sku"] = sku
    lot = s(t4.get("Current lot number"))
    if lot:
        lid = lot_id(mos, lot)
        if lid: mf["lot"] = ("metaobject_reference", lid)
        else: warn.append(f"lot {lot!r}: no `lot` record — create it")
    if s(t4.get("Production quantity")):
        mf["production_quantity"] = ("number_integer", str(int(float(t4["Production quantity"]))))
        notes.append("production quantity written but NOT verified — set production_quantity_verified when Angela confirms")
    if s(t4.get("Care & Repair copy")): mf["care_instructions"] = ("rich_text_field", rich(t4["Care & Repair copy"]))
    rel = []
    for i in (1, 2, 3):
        cell = s(t4.get(f"Related work 0{i} -- style, expression, link"))
        if not cell: continue
        suggested = cell.lower().startswith("suggested")
        if suggested and not opts.include_suggested:
            notes.append(f"related {i}: {cell[:60]}… (suggested only — not written; --include-suggested to include)")
            continue
        h = resolve_related(cell, tabs["01"], matches)
        if h: rel.append(h)
        else: warn.append(f"related {i}: could not resolve {cell[:60]!r} to a product")
    if rel: mf["related_products"] = ("list.product_reference", json.dumps(rel))
    if s(t4.get("Product-specific delivery / returns exception")):
        mf["delivery_exception"] = ("rich_text_field", rich(t4["Product-specific delivery / returns exception"]))

    internal = [x for x in [s(t1.get("Approval notes")), s(t2.get("Dye / process source link")), s(t2.get("Verification / approval notes")),
                            s(t4.get("Verified care source")), s(t4.get("Approval / outstanding facts"))] if x]
    if internal: mf["internal_notes"] = ("multi_line_text_field", "\n".join(internal))

    # launch-only core fields. The title is the name, then the Expression
    # after a bar — the form the old site already used and the theme's fallback
    # parses; the cart, checkout and order mail show the title alone, and two
    # "Tribeca Skirt" lines there must still tell the silk from the cotton.
    if expr and name: core["title"] = f"{name} | {expr}"
    if s(t1.get("Hero introduction")):
        core["descriptionHtml"] = "".join(f"<p>{p.strip()}</p>" for p in re.split(r"\n\s*\n|\n", s(t1["Hero introduction"])) if p.strip())
        core["descriptionHtml"] += bullets_html(t1.get("Description accordion"))
    if s(t1.get("EU retail (€)")): core["price_eur"] = float(t1["EU retail (€)"])
    sizes = s(t1.get("Size options"))
    if prod and sizes:
        have = [v["title"] for v in prod["variants"]["nodes"]]
        want = [x.strip() for x in sizes.split("/")]
        if have != want: warn.append(f"sizes: sheet says {want}, Shopify has {have}")
    return {"id": pid, "name": name, "status": status, "product": prod, "confidence": m["confidence"], "metafields": mf, "core": core, "warnings": warn, "notes": notes}

def x_field(mo, key):
    for f in mo.get("fields", []):
        if f["key"] == key: return f.get("value") or ""
    return ""
def origin_id(mos, place):
    for mo in mos.get("origin", []):
        if norm(x_field(mo, "place")) == norm(place) or norm(x_field(mo, "country")) == norm(place) or norm(x_field(mo, "region")) == norm(place):
            return mo["id"]
def lot_id(mos, numeral):
    n = norm(numeral).replace("lot", "").strip().upper()
    for mo in mos.get("lot", []):
        if x_field(mo, "number_roman").upper() == n or x_field(mo, "number_internal") == n:
            return mo["id"]
def resolve_related(cell, tab01, matches):
    """'Suggested: Amman Shirt - Handspun Silk-Linen, Natural Pearl Shimmer. Confirm …' -> product gid.
    The name is whichever tab-01 Product name the cell begins with (longest first)."""
    txt = re.sub(r"^suggested:\s*", "", cell, flags=re.I)
    txt = re.split(r"\.\s*confirm", txt, flags=re.I)[0]
    names = sorted({s(r["Product name"]) for r in tab01.values()}, key=len, reverse=True)
    style = next((n for n in names if norm(txt).startswith(norm(n))), None)
    if not style: return None
    rest = norm(txt)[len(norm(style)):]
    best, score = None, -1
    for pid, r in tab01.items():
        if norm(r["Product name"]) != norm(style): continue
        sc = sum(1 for t in rest.split() if len(t) > 2 and t in norm(r["Expression / full subtitle"]))
        if sc > score and matches[pid]["product"]:
            best, score = matches[pid]["product"]["id"], sc
    return best

# ---------------------------------------------------------------------------
def gql(query, variables=None, mutate=False, dry=False):
    args = ["shopify", "store", "execute", "-s", STORE, "--query", query]
    if variables is not None:
        args += ["--variables", json.dumps(variables)]
    if mutate: args.append("--allow-mutations")
    if dry:
        print("\n--- GraphQL ---\n" + query + "\n--- variables ---\n" + json.dumps(variables, indent=1)[:4000]); return None
    out = subprocess.run(args, capture_output=True, text=True).stdout
    i = out.find("{"); data = json.loads(out[i:]) if i >= 0 else {}
    if "errors" in data or (isinstance(data, dict) and any("userErrors" in str(v) and "[]" not in str(v) for v in data.values())):
        pass
    return data

def write_product(payload, opts):
    prod = payload["product"]
    if not prod: print(f"  ✗ {payload['id']}: no Shopify product matched"); return
    gid = prod["id"]
    mfs = [{"ownerId": gid, "namespace": "hartwick", "key": k, "type": t, "value": v} for k, (t, v) in payload["metafields"].items()]
    q = "mutation($metafields:[MetafieldsSetInput!]!){ metafieldsSet(metafields:$metafields){ metafields{ key } userErrors{ field message } } }"
    for i in range(0, len(mfs), 25):
        r = gql(q, {"metafields": mfs[i:i+25]}, mutate=True, dry=opts.dry)
        if r is not None:
            errs = r.get("metafieldsSet", {}).get("userErrors") or r.get("data", {}).get("metafieldsSet", {}).get("userErrors")
            print(f"  metafields {i+1}-{i+len(mfs[i:i+25])}: {'ok' if not errs else errs}")
    sku = payload["core"].get("sku")
    if sku and not opts.skus:
        print(f"  SKUs: {sku} not written (--skus; the size-suffix rule is still open with Aloha)")
    elif sku:
        vs = []
        for v in prod["variants"]["nodes"]:
            size = v["selectedOptions"][0]["value"] if v.get("selectedOptions") else ""
            suffix = f"-{size[:3].upper()}" if (opts.sku_suffix and size and size.lower() != "one size") else ""
            vs.append({"id": v["id"], "inventoryItem": {"sku": sku + suffix}})
        q2 = "mutation($productId:ID!,$variants:[ProductVariantsBulkInput!]!){ productVariantsBulkUpdate(productId:$productId, variants:$variants){ userErrors{ field message } } }"
        r = gql(q2, {"productId": gid, "variants": vs}, mutate=True, dry=opts.dry)
        if r is not None: print(f"  SKUs: {vs[0]['inventoryItem']['sku']} … {'ok' if not (r.get('productVariantsBulkUpdate') or {}).get('userErrors') else r}")
    if opts.launch and payload["status"] != "approved":
        print(f"  ✗ --launch refused: {payload['id']} is {payload['status']} in the sheet's Approval notes (Aloha: draft stays unpublished)")
    elif opts.launch:
        core = payload["core"]
        q3 = "mutation($product:ProductUpdateInput!){ productUpdate(product:$product){ product{ id title } userErrors{ field message } } }"
        inp = {"id": gid}
        if "title" in core: inp["title"] = core["title"]
        if "descriptionHtml" in core: inp["descriptionHtml"] = core["descriptionHtml"]
        r = gql(q3, {"product": inp}, mutate=True, dry=opts.dry)
        if r is not None: print(f"  title/description: {r}")
        print("  price: EU RRP is not written by this script — set it on the EUR price list / base price in the admin (Christina to confirm the market rule)")

def live_definitions():
    """Live hartwick.* product definitions and the metaobject definitions (ids + field keys)."""
    q = ('{ metafieldDefinitions(first: 250, ownerType: PRODUCT, namespace: "hartwick") { nodes { key type { name } } }'
         ' metaobjectDefinitions(first: 50) { nodes { id type fieldDefinitions { key } } } }')
    d = gql(q) or {}
    mfs = {n["key"]: n["type"]["name"] for n in d.get("metafieldDefinitions", {}).get("nodes", [])}
    mos = {n["type"]: n for n in d.get("metaobjectDefinitions", {}).get("nodes", [])}
    return mfs, mos

REF_TARGETS = {"place_of_fibre": "origin", "place_of_spinning": "origin", "place_of_construction": "origin",
               "place_of_weaving": "origin", "place_of_dyeing": "origin", "style": "style", "lot": "lot", "dye": "dye"}
MO_FIELDS = {  # metaobject type -> fields the theme reads that the definition may lack
    "master": [{"key": "stage", "name": "Stage", "type": "single_line_text_field",
                "validations": [{"name": "choices", "value": json.dumps(["fibre", "spinning", "weaving", "dyeing", "construction"])}]}],
    "lot": [{"key": "quantity", "name": "Quantity", "type": "number_integer"},
            {"key": "completed_on", "name": "Completed on", "type": "date"}],
}

def create_definitions(opts):
    """Idempotent: reads what the store has and creates only what is missing."""
    have, mos = live_definitions()
    want = dict(MF_TYPES); want.update(EXTRA_DEFS)
    missing = {k: t for k, t in want.items() if k not in have}
    mismatch = {k: (have[k], t) for k, t in want.items() if k in have and have[k] != t}
    print(f"{len(have)} hartwick.* definitions live; {len(missing)} to create: {sorted(missing) or '—'}")
    for k, (a, b) in mismatch.items(): print(f"  ! {k}: store has {a}, theme expects {b} — change by hand")
    q = ("mutation($definition:MetafieldDefinitionInput!){ metafieldDefinitionCreate(definition:$definition){"
         " createdDefinition{ key } userErrors{ field message code } } }")
    for k, t in sorted(missing.items()):
        d = {"name": k, "namespace": "hartwick", "key": k, "type": t, "ownerType": "PRODUCT"}
        if k == "internal_notes": d["access"] = {"storefront": "NONE"}
        if t.endswith("metaobject_reference"):
            target = REF_TARGETS.get(k)
            if not target or target not in mos:
                print(f"  ! {k}: no metaobject definition for {target!r} — create the metaobject first"); continue
            d["validations"] = [{"name": "metaobject_definition_id", "value": mos[target]["id"]}]
        r = gql(q, {"definition": d}, mutate=True, dry=opts.dry)
        if r is not None:
            node = r.get("metafieldDefinitionCreate") or {}
            print(f"  {k} ({t}): {'ok' if node.get('createdDefinition') else node.get('userErrors')}")
    q2 = ("mutation($id:ID!,$definition:MetaobjectDefinitionUpdateInput!){ metaobjectDefinitionUpdate(id:$id, definition:$definition){"
          " metaobjectDefinition{ type } userErrors{ field message code } } }")
    for mo_type, fields in MO_FIELDS.items():
        if mo_type not in mos: print(f"  ! metaobject {mo_type} does not exist"); continue
        present = {f["key"] for f in mos[mo_type]["fieldDefinitions"]}
        todo = [f for f in fields if f["key"] not in present]
        if not todo: print(f"  {mo_type}: fields complete"); continue
        r = gql(q2, {"id": mos[mo_type]["id"], "definition": {"fieldDefinitions": [{"create": f} for f in todo]}}, mutate=True, dry=opts.dry)
        if r is not None:
            node = r.get("metaobjectDefinitionUpdate") or {}
            print(f"  {mo_type}.{'/'.join(f['key'] for f in todo)}: {'ok' if node.get('metaobjectDefinition') else node.get('userErrors')}")

CODE_RE = re.compile(r"^[A-Za-z][A-Za-z ]*\s\d{2,3}$")

def swap_style_names(mos, opts):
    """One-off for Aloha's 21 Sept decision, idempotent. On every `style`
    record: code <- the numbered display_name (Skirt 001) if code is empty;
    display_name <- legacy_name (Tribeca Skirt) when the record has one that
    differs. Fine-silk records (Dupatta 01 / Dupatta 01) and the yoga
    editions keep their display_name — no location name is recorded. Also
    sets the definition's displayNameKey so the admin lists read by name."""
    have, defs = live_definitions()
    st = defs.get("style")
    if not st: print("no `style` metaobject definition"); return
    keys = {f["key"] for f in st["fieldDefinitions"]}
    q = ("mutation($id:ID!,$definition:MetaobjectDefinitionUpdateInput!){ metaobjectDefinitionUpdate(id:$id, definition:$definition){"
         " metaobjectDefinition{ type displayNameKey } userErrors{ field message code } } }")
    d = {"displayNameKey": "display_name"}
    if "code" not in keys:
        d["fieldDefinitions"] = [{"create": {"key": "code", "name": "Style code (internal)", "type": "single_line_text_field",
                                             "description": "Skirt 001 - production / data reference. Never customer-facing (Aloha, 21 Sept 2026)."}}]
    r = gql(q, {"id": st["id"], "definition": d}, mutate=True, dry=opts.dry)
    if r is not None:
        node = r.get("metaobjectDefinitionUpdate") or {}
        print(f"  style definition: {'ok' if node.get('metaobjectDefinition') else node.get('userErrors')}")
    q2 = "mutation($id:ID!,$metaobject:MetaobjectUpdateInput!){ metaobjectUpdate(id:$id, metaobject:$metaobject){ metaobject{ handle } userErrors{ field message code } } }"
    n = 0
    for mo in mos.get("style", []):
        disp, legacy, code = x_field(mo, "display_name"), x_field(mo, "legacy_name"), x_field(mo, "code")
        fields = []
        if not code and CODE_RE.match(disp): fields.append({"key": "code", "value": disp})
        if legacy and norm(legacy) != norm(disp) and CODE_RE.match(disp): fields.append({"key": "display_name", "value": legacy})
        if not fields: continue
        r = gql(q2, {"id": mo["id"], "metaobject": {"fields": fields}}, mutate=True, dry=opts.dry)
        n += 1
        if r is not None:
            node = r.get("metaobjectUpdate") or {}
            print(f"  {disp:18} -> {dict((f['key'], f['value']) for f in fields)}: {'ok' if node.get('metaobject') else node.get('userErrors')}")
    print(f"{n} style records updated" + (" (dry)" if opts.dry else ""))

PRODUCTS_Q = """query($cursor: String) { products(first: 100, after: $cursor) {
  pageInfo { hasNextPage endCursor }
  nodes { id handle title status productType vendor tags templateSuffix
    featuredMedia { ... on MediaImage { id } }
    variants(first: 100) { nodes { id title sku price inventoryQuantity selectedOptions { name value } } }
    metafields(first: 60) { nodes { namespace key type value } } } } }"""
METAOBJECTS_Q = "query($t:String!){ metaobjects(type:$t, first:100){ nodes { id handle displayName fields { key type value } } } }"

def refresh_snapshot():
    """Re-pull what this script matches against — products and the metaobjects —
    into store-snapshot/ through the CLI, so --match reflects the store today.
    (scripts/store-audit.sh is the full snapshot; it needs a token env.)"""
    prods, cur = [], None
    while True:
        d = gql(PRODUCTS_Q, {"cursor": cur}); node = d.get("products") or {}
        prods += node.get("nodes", [])
        if not node.get("pageInfo", {}).get("hasNextPage"): break
        cur = node["pageInfo"]["endCursor"]
    mos = {}
    for t in ["style", "lot", "origin", "master", "dye", "process", "technique", "collection", "release", "process_step"]:
        d = gql(METAOBJECTS_Q, {"t": t})
        mos[t] = (d.get("metaobjects") or {}).get("nodes", [])
    json.dump(prods, open(os.path.join(SNAPSHOT, "products.json"), "w"), indent=1)
    json.dump(mos, open(os.path.join(SNAPSHOT, "metaobjects.json"), "w"), indent=1)
    print(f"store-snapshot refreshed: {len(prods)} products, " + ", ".join(f"{k} {len(v)}" for k, v in mos.items() if v))

def write_csv(path, tabs, matches, mos, opts):
    keys = sorted(MF_TYPES)
    with open(path, "w", newline="") as f:
        w = csv.writer(f); w.writerow(["Handle", "Title"] + [f"product.metafields.hartwick.{k}" for k in keys])
        for pid in tabs["01"]:
            p = build_payload(pid, tabs, matches, mos, opts)
            if not p["product"]: continue
            row = [p["product"]["handle"], p["product"]["title"]] + [p["metafields"].get(k, ("", ""))[1] for k in keys]
            w.writerow(row)
    print(f"wrote {path} — Products > Import, tick 'Overwrite products with matching handles'. Only the columns present are changed.")

def write_doc(tabs, matches, mos):
    path = os.path.join(ROOT, "docs", "product-data-mapping.md")
    L = []
    L.append("# Product data — where each sheet field lives\n")
    L.append("Generated by `scripts/sheet-to-shopify.py --doc` from the mapping the importer runs on, so this table and the code cannot disagree. Source: **Hartwick Atelier | Product Copy for Angela & Ivan** (5 tabs, 78 expressions across 52 styles), the 21 September 2026 export.\n")
    L.append("Flow: **Google Sheet** (team working source; Angela reviews) → **Shopify product record + `hartwick.*` metafields + metaobjects** (live structured source) → **product page / JSON-LD / channels**.\n")
    L.append("**Names, from 21 September (Aloha):** the location name — *Tribeca Skirt*, *Amman Shirt* — is the customer-facing product name, with the Expression beneath it. Style codes (*Skirt 001*) and worksheet IDs (*P001*) are internal. The `style` record's `display_name` now carries the location name and its `code` field the number; the fine-silk pieces keep their code as the name because no location name is recorded for them (tab 05). **Publication:** only a row whose Approval notes do not read DRAFT can go live (`--launch`); every other row stays in `hartwick.*` fields, which no published theme reads, and is marked *Draft copy* on the unpublished theme.\n")
    L.append("| Tab | Spreadsheet field | Shopify field / metafield | Website location | SEO / AI use | Notes |\n|---|---|---|---|---|---|")
    for tab, col, target, kind, web, seo, note in MAPPING:
        if target.startswith("mf:"): _, key, typ = target.split(":", 2); tgt = f"`hartwick.{key}` ({typ})"
        elif target.startswith("ref:"): tgt = "→ " + target[4:].replace(":", " · ")
        elif target.startswith("core:"): tgt = "Shopify " + target[5:]
        elif target == "theme": tgt = "theme setting"
        else: tgt = "—"
        L.append(f"| {tab} | {col} | {tgt} | {web} | {seo} | {note} |")
    # definitions summary
    present, mo_present = set(), {}
    try:
        have, mos = live_definitions(); present = set(have); mo_present = mos
    except Exception: pass
    want = dict(MF_TYPES); want.update(EXTRA_DEFS)
    new = sorted(k for k in want if k not in present)
    L.append("\n## Definitions the sheet needs that the store does not have yet\n")
    L.append("Checked against the live store when this document was generated. `--definitions` creates whatever is listed; it is idempotent.\n")
    L.append("| Key | Type |\n|---|---|")
    for k in new: L.append(f"| `hartwick.{k}` | {want[k]} |")
    for mo_type, fields in MO_FIELDS.items():
        keys = {f["key"] for f in mo_present.get(mo_type, {}).get("fieldDefinitions", [])}
        for f in fields:
            if f["key"] not in keys: L.append(f"| `{mo_type}.{f['key']}` | {f['type']} |")
    if not new and all(f["key"] in {x["key"] for x in mo_present.get(t, {}).get("fieldDefinitions", [])} for t, fs in MO_FIELDS.items() for f in fs):
        L.append("| — | *nothing: the store has every definition the theme reads (checked live)* |")
    # what Angela still needs to supply — computed from the sheet
    L.append("\n## What we still need from Angela — counted from the sheet\n")
    L.append("Blank or “to confirm” cells that the page would show as `[Confirm]` or leave empty. Everything with a source is already mapped; this is the genuine gap, so nobody is asked to supply what exists.\n")
    L.append("| Fact | Rows still open (of 78) | Where it shows |\n|---|---|---|")
    counts = []
    t1, t2, t3, t4 = tabs["01"], tabs["02"], tabs["03"], tabs["04"]
    def cnt(tab, col, test): return sum(1 for r in tab.values() if test(s(r.get(col))))
    blank = lambda v: not v
    conf = lambda v: (not v) or bool(CONFIRM_RE.search(v))
    counts += [("Made in (garment origin)", cnt(t1, "Made in", blank), "Opening MADE IN; stage 05 Place"),
               ("Weave", cnt(t1, "Weave", blank), "Opening WEAVE; stage 03"),
               ("Availability / dispatch (confirmed)", cnt(t1, "Availability / dispatch notes", conf), "Buy rail"),
               ("Fibre origin & composition (verified)", cnt(t2, "01 Fibre: origin & composition", conf), "Stage 01; The Cloth COMPOSITION"),
               ("Spinning maker & place", cnt(t2, "02 Spinning: process, maker, place", conf), "Stage 02"),
               ("Weaving maker & place", cnt(t2, "03 Weaving: process, maker, place", conf), "Stage 03"),
               ("Dyeing process, maker & place", cnt(t2, "04 Dyeing -- process, maker, place", conf), "Stage 04"),
               ("Construction atelier & place", cnt(t2, "05 Construction -- process, atelier, place", conf), "Stage 05"),
               ("Master name / discipline / place / photo", cnt(t2, "Master name", blank), "The Master (hidden until named)"),
               ("Exact composition", cnt(t3, "Exact composition", blank), "The Cloth COMPOSITION"),
               ("Material-record reference", cnt(t3, "Material-record reference", blank), "The Cloth RECORD"),
               ("Cloth photographs (4 per product)", cnt(t3, "Image 01 filename & alt text", blank), "The Cloth"),
               ("Hero image", cnt(t3, "Hero image filename & alt text", blank), "Opening"),
               ("Product reference / SKU", cnt(t4, "Product reference / SKU", blank), "Lot record"),
               ("Current lot number", cnt(t4, "Current lot number", blank), "Lot record"),
               ("Production quantity", cnt(t4, "Production quantity", blank), "Lot record (gated)"),
               ("Production period / completion", cnt(t4, "Production period / completion", blank), "Lot record"),
               ("Verified care source", cnt(t4, "Verified care source", blank), "Care & Repair"),
               ("Related works (confirmed, not “Suggested”)", cnt(t4, "Related work 01 -- style, expression, link", lambda v: (not v) or v.lower().startswith("suggested")), "Related Works")]
    for fact, n, where in counts: L.append(f"| {fact} | {n} | {where} |")
    # match table
    L.append("\n## Sheet row → Shopify product\n")
    L.append("Matched through the Style record the product is already linked to (`hartwick.style`, whose legacy name is the sheet's Product name), or by title words where no Style is linked, then by Expression words within the Style — against the store's 97 products. **ok** = one clear match; **check** = two candidates scored equally, or one product claimed by two rows — confirm by eye; **none** = no product exists (to be created).\n")
    L.append("| ID | Product | Expression | Status | Shopify handle | Confidence |\n|---|---|---|---|---|---|")
    for pid, r in tabs["01"].items():
        m = matches[pid]; h = m["product"]["handle"] if m["product"] else "—"
        alt = "" if m["confidence"] == "ok" else (" · also: " + ", ".join(c for c in m["candidates"][1:3]) if m["candidates"][1:3] else "")
        L.append(f"| {pid} | {r['Product name']} | {s(r['Expression / full subtitle'])[:48]} | {copy_status(r.get('Approval notes'))} | `{h}` | {m['confidence']}{alt} |")
    open(path, "w").write("\n".join(L) + "\n"); print("wrote", path)

# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheet", default=DEFAULT_SHEET)
    ap.add_argument("--match", action="store_true"); ap.add_argument("--plan"); ap.add_argument("--write")
    ap.add_argument("--launch", action="store_true"); ap.add_argument("--definitions", action="store_true")
    ap.add_argument("--csv"); ap.add_argument("--doc", action="store_true"); ap.add_argument("--dry", action="store_true")
    ap.add_argument("--include-suggested", action="store_true"); ap.add_argument("--sku-suffix", action="store_true", default=True)
    ap.add_argument("--no-sku-suffix", dest="sku_suffix", action="store_false")
    ap.add_argument("--skus", action="store_true", help="also write variant SKUs (off by default)")
    ap.add_argument("--write-all", action="store_true", help="metafields for every row whose match is certain")
    ap.add_argument("--styles", action="store_true", help="style.display_name <- location name; code <- number")
    ap.add_argument("--refresh", action="store_true", help="re-pull products + metaobjects into store-snapshot/")
    opts = ap.parse_args()
    if opts.refresh: refresh_snapshot()
    tabs = load_sheet(opts.sheet); prods, mos = load_snapshot()
    if opts.styles:
        swap_style_names(mos, opts)
        if not opts.dry: refresh_snapshot(); prods, mos = load_snapshot()
    matches = match_products(tabs["01"], prods, mos)
    if opts.match:
        for pid, m in matches.items():
            r = tabs["01"][pid]; print(f"{m['confidence']:5} {m['how']:5} {pid} {r['Product name']:20} {s(r['Expression / full subtitle'])[:40]:40} -> {m['product']['handle'] if m['product'] else '-'}")
        n = sum(1 for m in matches.values() if m["confidence"] == "ok")
        print(f"\n{n} ok / {sum(1 for m in matches.values() if m['confidence'] == 'check')} check / {sum(1 for m in matches.values() if m['confidence'] == 'none')} none of {len(matches)}")
    if opts.write_all:
        done, skipped = 0, []
        for pid in tabs["01"]:
            p = build_payload(pid, tabs, matches, mos, opts)
            if p["confidence"] != "ok":
                skipped.append(f"{pid} {p['name']} ({p['confidence']})"); continue
            print(f"{pid} {p['name']} [{p['status']}] -> {p['product']['handle']}")
            for w in p["warnings"]: print("  ! " + w)
            write_product(p, opts); done += 1
        print(f"\n{done} products written" + (" (dry)" if opts.dry else "") + f"; skipped {len(skipped)}: " + ", ".join(skipped))
    if opts.plan or opts.write:
        pid = opts.plan or opts.write
        p = build_payload(pid, tabs, matches, mos, opts)
        print(f"\n{pid} {p['name']} [{p['status']}] -> {p['product']['handle'] if p['product'] else 'NO MATCH'} ({p['confidence']})")
        print("\nMETAFIELDS (hartwick.*) — invisible on the live theme:")
        for k, (t, v) in p["metafields"].items(): print(f"  {k:26} {t:28} {str(v)[:90]}")
        print("\nVARIANT SKUs (written only with --skus; not customer-facing):")
        if "sku" in p["core"]: print(f"  {'sku':26} {p['core']['sku']}{'-S / -M / -L' if opts.sku_suffix else ''}")
        print("\nCORE (live-visible, written only with --launch):")
        for k, v in p["core"].items():
            if k != "sku": print(f"  {k:26} {str(v)[:90]}")
        for w in p["warnings"]: print("  ! " + w)
        for n in p["notes"]: print("  · " + n)
        if opts.write:
            if p["confidence"] != "ok" and not opts.dry: print("refusing to write: product match is not certain"); sys.exit(1)
            write_product(p, opts)
    if opts.definitions:
        create_definitions(opts)
    if opts.csv: write_csv(opts.csv, tabs, matches, mos, opts)
    if opts.doc: write_doc(tabs, matches, mos)

if __name__ == "__main__":
    main()
