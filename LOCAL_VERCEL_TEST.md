# Test Vercel Build Locally

## Install Vercel CLI
```bash
npm i -g vercel
```

## Test Build Locally
```bash
# Login to Vercel
vercel login

# Link project (run in project root)
vercel link

# Test build locally (simulates Vercel environment)
vercel build

# Test dev locally with Vercel
vercel dev
```

## Check for Issues
```bash
# Check if vercel.json exists and is valid
ls -la vercel.json
cat vercel.json

# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')))"
```

## Alternative: Use Vercel Build Command
```bash
# This runs the exact same build process as Vercel
npx @vercel/ncc build --help
```

## Debug Steps
1. Run `vercel build` locally
2. Check `.vercel/output` folder
3. Look for build errors in terminal
4. Fix issues before pushing to GitHub

This way you catch Vercel-specific errors before deployment!