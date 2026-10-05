#!/usr/bin/env python3
"""
Hartwick — upload local images to Shopify Files (staged upload -> fileCreate).

    python3 scripts/files-upload.py path/to/a.jpg path/to/b.jpg [--alt "text"]
    python3 scripts/files-upload.py --list ~/Downloads/THE\ BRAND\ BOOK/IMAGE --only new

Uses the Shopify CLI's stored store auth (needs write_files). Prints the
stored filename for each upload, i.e. what a theme setting references as
    shopify://shop_images/<filename>
Shopify never overwrites: an existing name gets a suffix, so --only new skips
files whose name is already in Files.
"""
import argparse, json, mimetypes, os, re, subprocess, sys, urllib.request

STORE = "9c8a52-dc.myshopify.com"

def gql(q, v=None, mut=False):
    a = ["shopify", "store", "execute", "-s", STORE, "--query", q]
    if v is not None: a += ["--variables", json.dumps(v)]
    if mut: a.append("--allow-mutations")
    out = subprocess.run(a, capture_output=True, text=True).stdout
    i = out.find("{")
    return json.JSONDecoder().raw_decode(out[i:])[0] if i >= 0 else {}

def existing_names():
    names, cursor = set(), None
    while True:
        after = f', after: "{cursor}"' if cursor else ""
        d = gql('{ files(first: 250, query: "media_type:IMAGE"%s) { nodes { ... on MediaImage { image { url } } } pageInfo { hasNextPage endCursor } } }' % after)
        for n in d["files"]["nodes"]:
            if n and n.get("image"): names.add(n["image"]["url"].split("/")[-1].split("?")[0])
        if not d["files"]["pageInfo"]["hasNextPage"]: break
        cursor = d["files"]["pageInfo"]["endCursor"]
    return names

def upload(path, alt=""):
    name = os.path.basename(path); size = os.path.getsize(path)
    mime = mimetypes.guess_type(path)[0] or "image/jpeg"
    st = gql('mutation($input:[StagedUploadInput!]!){ stagedUploadsCreate(input:$input){ stagedTargets{ url resourceUrl parameters{ name value } } userErrors{ field message } } }',
             {"input": [{"filename": name, "mimeType": mime, "resource": "FILE", "fileSize": str(size), "httpMethod": "POST"}]}, mut=True)
    t = st["stagedUploadsCreate"]["stagedTargets"][0]
    # multipart POST to the staged target
    boundary = "----hartwick" + os.urandom(6).hex()
    body = b""
    for p in t["parameters"]:
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{p['name']}\"\r\n\r\n{p['value']}\r\n".encode()
    body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\nContent-Type: {mime}\r\n\r\n".encode()
    body += open(path, "rb").read() + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(t["url"], data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    urllib.request.urlopen(req).read()
    fc = gql('mutation($files:[FileCreateInput!]!){ fileCreate(files:$files){ files{ ... on MediaImage { id alt image { url } } } userErrors{ field message } } }',
             {"files": [{"originalSource": t["resourceUrl"], "contentType": "IMAGE", "alt": alt}]}, mut=True)
    errs = fc["fileCreate"]["userErrors"]
    if errs: print("  ✗", name, errs); return None
    f = fc["fileCreate"]["files"][0]
    stored = (f.get("image") or {}).get("url", "")
    stored = stored.split("/")[-1].split("?")[0] if stored else "(processing — name resolves once Shopify has processed it)"
    print(f"  ✓ {name} -> shopify://shop_images/{stored}")
    return stored

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*"); ap.add_argument("--alt", default="")
    ap.add_argument("--list", help="a folder to upload"); ap.add_argument("--only", choices=["new", "all"], default="new")
    o = ap.parse_args()
    paths = list(o.paths)
    if o.list:
        paths += sorted(os.path.join(o.list, f) for f in os.listdir(o.list) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    if o.only == "new":
        have = existing_names(); skip = [p for p in paths if os.path.basename(p) in have]
        paths = [p for p in paths if os.path.basename(p) not in have]
        if skip: print(f"skipping {len(skip)} already in Files")
    print(f"uploading {len(paths)}")
    for p in paths: upload(p, o.alt)

if __name__ == "__main__":
    main()
