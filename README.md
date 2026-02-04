# pi-compact-footer

A compact 3-line footer extension for [pi coding agent](https://github.com/badlogic/pi-mono), optimized for narrow screens and mobile devices (like Termux on Android).

## Features

- **Line 1:** Current path with git branch: `~/projects/myapp (main)`
- **Line 2:** Context usage with window size: `36.4%/200k (auto)`
- **Line 3:** Full model info: `(provider) model-name • thinking-level`

The footer automatically:
- Truncates long paths from the start
- Colorizes context percentage (yellow >70%, red >90%)
- Shows thinking level when using reasoning models

## Installation

```bash
pi install github.com/Whamp/pi-compact-footer
```

Or for project-local install:

```bash
pi install -l github.com/Whamp/pi-compact-footer
```

## Screenshot

coming later

## License

MIT
