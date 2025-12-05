# Deploy to Fly.io - Complete Guide

Fly.io offers **free allowance** and runs globally with excellent performance!

## Prerequisites

Install Fly CLI:

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
iwr https://fly.io/install.ps1 -useb | iex
```

## Quick Deploy

### 1. Login to Fly.io

```bash
flyctl auth login
```

This opens your browser to authenticate.

### 2. Initialize and Deploy

```bash
cd lateral-thinking-mcp-server

# Launch the app (fly.toml already configured!)
flyctl launch --config fly.toml

# Answer the prompts:
# - App name: (press enter to use lateral-thinking-mcp)
# - Region: Choose closest to you (Seattle for Portland!)
# - PostgreSQL: No
# - Redis: No

# Deploy!
flyctl deploy
```

That's it! Your server is live! 🚀

## Your Server URL

Fly.io gives you:
```
https://lateral-thinking-mcp.fly.dev
```

MCP endpoint:
```
https://lateral-thinking-mcp.fly.dev/mcp
```

## Test Your Deployment

```bash
# Health check
curl https://lateral-thinking-mcp.fly.dev/health

# Server info
curl https://lateral-thinking-mcp.fly.dev/

# Check status
flyctl status
```

## Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lateral-thinking": {
      "url": "https://lateral-thinking-mcp.fly.dev/mcp",
      "transport": "http"
    }
  }
}
```

## Using from Command Line

### Test with curl:

```bash
# List all puzzles
curl -X POST https://lateral-thinking-mcp.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "lateral_list_puzzles",
      "arguments": {
        "response_format": "json"
      }
    }
  }'

# Get a specific puzzle
curl -X POST https://lateral-thinking-mcp.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "lateral_get_puzzle",
      "arguments": {
        "puzzle_id": "puzzle_001",
        "include_answer": false,
        "response_format": "markdown"
      }
    }
  }'
```

## Fly.io Free Tier Details

✅ **Included Free (per month):**
- 3 shared-cpu-1x 256MB VMs
- 160GB outbound data transfer
- Auto-scaling to zero
- Global deployment
- HTTPS included
- Custom domains

⚠️ **Auto-scaling:**
- Scales to 0 when not in use (saves resources!)
- Wakes up in ~1 second (much faster than Render)
- Perfect for MCP servers

## Configuration Details

The `fly.toml` file includes:

```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true    # Save resources
  auto_start_machines = true   # Wake on request
  min_machines_running = 0     # Scale to zero
```

## Advanced Commands

### View logs:
```bash
flyctl logs
```

### Check app status:
```bash
flyctl status
```

### Scale to always-on:
```bash
flyctl scale count 1 --yes
```

### Scale to zero (default):
```bash
flyctl scale count 0 --yes
```

### Update deployment:
```bash
# After making code changes
flyctl deploy
```

### SSH into your machine:
```bash
flyctl ssh console
```

### Set secrets:
```bash
flyctl secrets set API_KEY=your_key_here
```

## Monitoring

### Dashboard:
Visit https://fly.io/dashboard

### Metrics:
```bash
flyctl metrics
```

### Health check:
Fly.io automatically checks `/health` endpoint every 30 seconds

## Regions

Deploy to multiple regions for global performance:

```bash
# Add more regions
flyctl regions add sea lax ord
```

Available regions:
- `sea` - Seattle (closest to Portland)
- `lax` - Los Angeles  
- `ord` - Chicago
- `iad` - Virginia
- `lhr` - London
- `sin` - Singapore
- Many more!

## Cost Estimate

**Free for this server!** 🎉

The configuration uses:
- 1 shared CPU
- 256MB RAM
- Auto-scales to zero

Well within free tier limits!

If you need more:
- **Hobby Plan**: ~$5/month (always-on)
- **Dedicated CPU**: ~$30/month

## Dockerfile Optimization

The included Dockerfile is already optimized:
- ✅ Multi-stage build
- ✅ Production dependencies only
- ✅ Small Alpine Linux base
- ✅ Health check included
- ✅ ~50MB final image

## Update Your Deployment

```bash
# Make changes to code
# Then deploy
flyctl deploy

# Fly.io builds and deploys automatically!
```

## Custom Domain

Add your own domain:

```bash
flyctl certs create yourdomain.com
flyctl certs show yourdomain.com

# Add DNS records as shown
```

## Troubleshooting

### Deployment fails:
```bash
# Check logs
flyctl logs

# Validate fly.toml
flyctl config validate
```

### App won't start:
```bash
# Check status
flyctl status

# View recent logs
flyctl logs --tail

# Try to access the health check
curl https://your-app.fly.dev/health
```

### Slow wake-up:
- Normal for auto-scaling (1-2 seconds)
- Keep app always-on: `flyctl scale count 1`

### Out of resources:
```bash
# Check usage
flyctl platform status

# Scale down to 0 replicas to save resources
flyctl scale count 0
```

## Environment Variables

Set in `fly.toml` or via CLI:

```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set CUSTOM_VAR=value
```

## Backup Strategy

```bash
# Export configuration
flyctl config save

# Keep fly.toml in git
git add fly.toml
git commit -m "Add Fly.io config"
```

## Comparison: Render vs Fly.io

| Feature | Render | Fly.io |
|---------|--------|--------|
| **Setup** | Easier | Requires CLI |
| **Cold Start** | ~30 sec | ~1 sec |
| **Free Tier** | 750 hrs/mo | 3 VMs always |
| **Auto-scale** | Yes | Yes |
| **Regions** | Limited | Global |
| **Best For** | Simplicity | Performance |

## Next Steps

1. Install Fly CLI: `brew install flyctl`
2. Login: `flyctl auth login`
3. Deploy: `flyctl launch --config fly.toml`
4. Test: `curl https://your-app.fly.dev/health`
5. Configure Claude Desktop
6. Start solving puzzles!

## Support

- Fly.io Docs: https://fly.io/docs
- Community: https://community.fly.io
- Status: https://status.flyio.net

## Pro Tips

💡 **Fast deploys**: Fly.io uses Docker, so rebuilds are cached
💡 **Global edge**: Deploy to multiple regions for worldwide access
💡 **Zero downtime**: Fly.io does rolling deploys automatically
💡 **Free HTTPS**: Certificates auto-managed
💡 **Logs**: Use `flyctl logs -a your-app` to debug

Happy deploying! 🚀
