# uTubeWX
Show an embedded video on a simple blank page when visiting a YouTube video link.

#### Supports
 * Chromium-based Browsers

#### Caveats
Navigating backwards from a redirected YouTube video does not function correctly due to Chromium's insanely stupid design. Support for either `loadReplace` in the `chrome.tabs.update()` call, or some kind of exclusion filter for `chrome.declarativeNetRequest.updateSessionRules()` would allow for seamless, quick redirects, but apparently the most common use case imaginable can't be imagined by Google.

## Building
Simply download the contents of the repository and use your Chromium-based browser to pack the extension.

## Download
You can grab the latest release from the [GitHub Releases Page](//github.com/RealityRipple/uTubeWX/releases).
