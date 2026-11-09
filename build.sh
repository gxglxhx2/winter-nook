#!/bin/bash
set -euo pipefail
src_dir="$(cd -- "$(dirname -- "$0")" && pwd -P)"
app_dir="${1:-$src_dir/build/冬日小窝.app}"
if [[ -e "$app_dir" ]]; then
  printf '目标已存在，请指定新路径：%s\n' "$app_dir" >&2
  exit 1
fi
if [[ -z "${DEVELOPER_DIR:-}" && -d /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk ]]; then
  export DEVELOPER_DIR=/Library/Developer/CommandLineTools
fi
staging="$(mktemp -d "${TMPDIR:-/tmp}/winter-nook-build.XXXXXXXX")"
trap 'rm -rf "$staging"' EXIT
bundle="$staging/冬日小窝.app"
mkdir -p "$bundle/Contents/MacOS" "$bundle/Contents/Resources/web"
xcrun --sdk macosx clang -isysroot "$(xcrun --sdk macosx --show-sdk-path)" \
  -arch arm64 -arch x86_64 -mmacosx-version-min=12.0 -O2 -fobjc-arc \
  -Wall -Wextra "$src_dir/main.m" -framework AppKit -framework WebKit \
  -o "$bundle/Contents/MacOS/WinterNook"
cp -X "$src_dir"/web/{index.html,style.css,game.js,art.js} "$bundle/Contents/Resources/web/"
cp -X "$src_dir/Info.plist" "$bundle/Contents/Info.plist"
cp -X "$src_dir/WinterNook.icns" "$bundle/Contents/Resources/WinterNook.icns"
codesign --force --sign - "$bundle"
codesign --verify --strict "$bundle"
mkdir -p "$(dirname -- "$app_dir")"
ditto --noextattr --noqtn "$bundle" "$app_dir"
codesign --verify "$app_dir"
printf '%s\n' "$app_dir"
