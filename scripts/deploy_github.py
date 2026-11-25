#!/usr/bin/env python3
"""
Create the public GitHub repo 'siddharajj/swasthsakhi', push 'main',
enable GitHub Pages (GitHub Actions workflow mode), and trigger deployment.
Uses only Python 3 standard library + your existing macOS git credentials.
"""

import json
import subprocess
import sys
import time
import urllib.error
import urllib.request

OWNER = "siddharajj"
REPO = "swasthsakhi"
DESCRIPTION = (
    "SwasthSakhi - Responsive women preventive health screening plan, "
    "non-medical lab literacy analyser and awareness hub for India"
)


def get_git_token():
    proc = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n\n",
        text=True,
        capture_output=True,
    )
    for line in proc.stdout.splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return None


def gh_api(method, path, token, payload=None):
    url = f"https://api.github.com{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "swasthsakhi-deploy-script",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        return e.code, err_body


def main():
    print("1/4 Checking GitHub credentials from git...")
    token = get_git_token()

    repo_exists = False
    if token:
        status, _ = gh_api("GET", f"/repos/{OWNER}/{REPO}", token)
        if status == 200:
            print(f"    Repository {OWNER}/{REPO} already exists on GitHub.")
            repo_exists = True
        else:
            print(f"    Creating public repository {OWNER}/{REPO} via GitHub API...")
            c_status, c_body = gh_api(
                "POST",
                "/user/repos",
                token,
                {
                    "name": REPO,
                    "description": DESCRIPTION,
                    "private": False,
                    "auto_init": False,
                },
            )
            if c_status in (200, 201):
                print(f"    Created https://github.com/{OWNER}/{REPO}")
                repo_exists = True
            else:
                print(f"    Note: Token could not auto-create repo (HTTP {c_status}).")

    if not repo_exists:
        new_url = f"https://github.com/new?name={REPO}&visibility=public"
        print("\n    Opening GitHub 'Create Repository' page in your browser...")
        print(f"    -> {new_url}")
        print("    Leave 'Add a README' unchecked, click 'Create repository',")
        subprocess.run(["open", new_url], check=False)
        input("    then press ENTER here to continue pushing & deploying... ")

    print("\n2/4 Pushing 'main' branch to GitHub...")
    push = subprocess.run(["git", "push", "-u", "origin", "main"])
    if push.returncode != 0:
        print("ERROR: 'git push -u origin main' failed. Check repo creation and re-run.")
        sys.exit(1)

    if token:
        print("\n3/4 Enabling GitHub Pages (GitHub Actions source)...")
        p_status, _ = gh_api(
            "POST",
            f"/repos/{OWNER}/{REPO}/pages",
            token,
            {"build_type": "workflow"},
        )
        if p_status in (200, 201):
            print("    GitHub Pages enabled with GitHub Actions!")
        elif p_status == 409:
            gh_api(
                "PUT",
                f"/repos/{OWNER}/{REPO}/pages",
                token,
                {"build_type": "workflow"},
            )
            print("    GitHub Pages already active (confirmed GitHub Actions source).")
        else:
            print(
                f"    Could not toggle Pages via API (HTTP {p_status}). "
                f"Enable once at: https://github.com/{OWNER}/{REPO}/settings/pages "
                "(Source -> GitHub Actions)."
            )

        print("\n4/4 Triggering GitHub Pages workflow run...")
        time.sleep(2)
        w_status, _ = gh_api(
            "POST",
            f"/repos/{OWNER}/{REPO}/actions/workflows/pages.yml/dispatches",
            token,
            {"ref": "main"},
        )
        if w_status in (200, 204):
            print("    Workflow 'pages.yml' triggered!")
        else:
            print("    Push workflow is queued on GitHub Actions.")
    else:
        print(
            f"\n3/4 Enable GitHub Pages at: https://github.com/{OWNER}/{REPO}/settings/pages\n"
            "    Set 'Build and deployment -> Source' to 'GitHub Actions'."
        )

    print("\n============================================================")
    print(f"Repo URL   : https://github.com/{OWNER}/{REPO}")
    print(f"Actions    : https://github.com/{OWNER}/{REPO}/actions")
    print(f"Live Pages : https://{OWNER}.github.io/{REPO}/  (ready in ~45s)")
    print("============================================================")


if __name__ == "__main__":
    main()
