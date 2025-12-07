# Development Guidelines

## Cache Busting

When making content changes to `app.js`, `style.css`, or markdown files, update the cache-busting timestamp in `index.html` and `posts.json`.

**How to update:**

1. Get current timestamp: `date +%s000`
2. Update `?v=` parameters in `index.html` for:
   - `style.css?v=TIMESTAMP`
   - `app.js?v=TIMESTAMP`
3. Update `?v=` parameter in `posts.json` for:
   - `"file": "posts/filename.md?v=TIMESTAMP"`

**Example:**
```bash
# Get timestamp
date +%s000
# Output: 1765118363000

# Update index.html
# <link rel="stylesheet" href="style.css?v=1765118363000">
# <script src="app.js?v=1765118363000"></script>

# Update posts.json
# "file": "posts/js-ecosystem-burnout.md?v=1765118363000"
```
