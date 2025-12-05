# Deploy to Render - Complete Guide

Render offers a **free tier** with automatic HTTPS, making it perfect for MCP servers!

## Quick Deploy (Method 1: GitHub)

### 1. Push to GitHub

```bash
cd lateral-thinking-mcp-server
git init
git add .
git commit -m "Initial commit"
gh repo create lateral-thinking-mcp --public --source=. --remote=origin --push
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect the `render.yaml` configuration
5. Click **"Apply"** - your server will deploy automatically!

## Manual Deploy (Method 2: Blueprint)

### 1. Create `render.yaml` (already included)

The file is already in your project with these settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `TRANSPORT=http npm start`
- **Free Plan**: ✅
- **Region**: Oregon (closest to you in Portland!)

### 2. Deploy

1. Push your code to GitHub
2. Go to Render Dashboard
3. **New** → **Blueprint**
4. Connect repository
5. Render reads `render.yaml` and deploys!

## Your Server URL

After deployment, Render gives you a URL like:
```
https://lateral-thinking-mcp-server.onrender.com
```

The MCP endpoint will be at:
```
https://lateral-thinking-mcp-server.onrender.com/mcp
```

## Test Your Deployment

### Check if server is running:
```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "lateral-thinking-mcp-server"
}
```

### Get server info:
```bash
curl https://your-app.onrender.com/
```

## Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lateral-thinking": {
      "url": "https://your-app.onrender.com/mcp",
      "transport": "http"
    }
  }
}
```

**Important**: Replace `your-app` with your actual Render app name!

## Using from Command Line

### Install MCP CLI (optional):
```bash
npm install -g @modelcontextprotocol/cli
```

### Test the server:
```bash
mcp-cli connect https://your-app.onrender.com/mcp
```

### Or use curl to call tools:
```bash
# Get a random puzzle
curl -X POST https://your-app.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "lateral_random_puzzle",
      "arguments": {
        "difficulty": "easy",
        "include_answer": false
      }
    }
  }'
```

## Render Free Tier Details

✅ **Included Free:**
- 750 hours/month (enough for 24/7 running)
- Automatic HTTPS
- Auto-deploy on git push
- Custom domains
- Health checks

⚠️ **Limitations:**
- Spins down after 15 min of inactivity (free tier)
- First request after spin-down takes ~30 seconds
- 512 MB RAM

💡 **Tip**: The "spin down" is perfect for MCP servers - they wake up when needed!

## Monitoring Your Server

1. **Render Dashboard**: Shows logs, metrics, deploy history
2. **Health Endpoint**: Check `/health` anytime
3. **Root Endpoint**: Check `/` for server info

## Troubleshooting

### Server won't start
- Check Render logs in dashboard
- Verify `package.json` has all dependencies
- Ensure `npm run build` succeeds locally

### Can't connect from Claude
- Verify URL in config is correct (include `/mcp`)
- Check server is running (visit `/health`)
- Restart Claude Desktop after config change

### Slow first request
- Normal for free tier (cold start)
- Consider upgrading to $7/month for always-on

## Update Deployment

```bash
# Make changes to your code
git add .
git commit -m "Update server"
git push

# Render auto-deploys! ✨
```

## Environment Variables

You can add these in Render dashboard if needed:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 10000 | Server port (Render sets this) |
| NODE_ENV | production | Environment mode |
| TRANSPORT | http | MCP transport type |

## Cost Estimate

**Free forever** for this server! 🎉

If you need more:
- **Starter Plan**: $7/month (always-on, no spin down)
- **Pro Plan**: $25/month (more resources)

## Next Steps

1. Deploy using Method 1 (GitHub) - easiest!
2. Test with `/health` endpoint
3. Configure Claude Desktop
4. Start solving puzzles!

## Support

- Render Docs: https://render.com/docs
- MCP Docs: https://modelcontextprotocol.io
- Issues? Check Render logs first!
