#!/usr/bin/env bash
# Graebridge image archive (mac/Linux). Same three steps as download-images.ps1.
set -u
mkdir -p found originals gallery-probe
grab() { while IFS= read -r u; do [ -z "$u" ] && continue; n=$(basename "$u" | sed 's/+/ /g'); curl -sfL --max-time 30 -o "$2/$n" "$u" || rm -f "$2/$n"; done < "$1"; }
grab image-urls-found.txt found
grab image-urls-originals-to-try.txt originals
grab image-urls-gallery-probe.txt gallery-probe
find found originals gallery-probe -type f -size -2k -delete
echo "found: $(ls found | wc -l)  originals: $(ls originals | wc -l)  gallery-probe: $(ls gallery-probe | wc -l)"
