# Using Your Deployed Lateral Thinking MCP Server

Once deployed, here's how to use your server from various clients!

## 1. Using with Claude Desktop (Primary Method)

### Configure Claude Desktop

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lateral-thinking": {
      "url": "https://your-app-name.fly.dev/mcp",
      "transport": "http"
    }
  }
}
```

Replace `your-app-name.fly.dev` with your actual server URL!

### Restart Claude Desktop

After editing the config:
1. Quit Claude Desktop completely
2. Reopen Claude Desktop
3. The MCP server should now be available

### Using in Claude

Just chat naturally! Claude will automatically use the MCP tools when needed.

**Example Conversations:**

```
You: "Give me a lateral thinking puzzle"
Claude: [calls lateral_random_puzzle tool]

You: "Show me all easy puzzles"
Claude: [calls lateral_list_puzzles with difficulty: "easy"]

You: "What thinking techniques are available?"
Claude: [calls lateral_list_techniques]

You: "Explain the Challenge Assumptions technique"
Claude: [calls lateral_get_technique]

You: "Give me a creative thinking exercise"
Claude: [calls lateral_generate_prompt]

You: "Create a hard brainstorming challenge"
Claude: [calls lateral_brainstorming_challenge with difficulty: "hard"]
```

## 2. Using from Command Line (Testing & Development)

### Quick Health Check

```bash
# Check if server is running
curl https://your-app.fly.dev/health

# Expected response:
# {"status":"ok","service":"lateral-thinking-mcp-server"}
```

### Get Server Info

```bash
curl https://your-app.fly.dev/

# Shows:
# {
#   "name": "Lateral Thinking MCP Server",
#   "version": "1.0.0",
#   "endpoint": "/mcp",
#   "description": "MCP server for lateral thinking puzzles and techniques",
#   "tools": 7
# }
```

### Call MCP Tools Directly

#### List All Puzzles

```bash
curl -X POST https://your-app.fly.dev/mcp \
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
```

#### Get a Random Puzzle

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "lateral_random_puzzle",
      "arguments": {
        "difficulty": "easy",
        "include_answer": false,
        "response_format": "markdown"
      }
    }
  }'
```

#### Get Specific Puzzle with Answer

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "lateral_get_puzzle",
      "arguments": {
        "puzzle_id": "puzzle_001",
        "include_answer": true,
        "response_format": "markdown"
      }
    }
  }'
```

#### List All Techniques

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "lateral_list_techniques",
      "arguments": {
        "response_format": "json"
      }
    }
  }'
```

#### Get a Specific Technique

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "lateral_get_technique",
      "arguments": {
        "technique_name": "Challenge Assumptions",
        "response_format": "markdown"
      }
    }
  }'
```

#### Generate Creative Prompt

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "lateral_generate_prompt",
      "arguments": {
        "theme": "innovation in everyday objects",
        "response_format": "markdown"
      }
    }
  }'
```

#### Get Brainstorming Challenge

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "lateral_brainstorming_challenge",
      "arguments": {
        "difficulty": "hard",
        "response_format": "json"
      }
    }
  }'
```

## 3. Using with Other MCP Clients

### With MCP Inspector (Development Tool)

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Connect to your server
mcp-inspector https://your-app.fly.dev/mcp
```

This opens a web UI for testing all tools interactively!

### With Custom Applications

If you're building your own app:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'my-app',
  version: '1.0.0',
});

// Connect to your server
await client.connect({
  url: 'https://your-app.fly.dev/mcp',
  transport: 'http'
});

// Call a tool
const result = await client.callTool({
  name: 'lateral_random_puzzle',
  arguments: {
    difficulty: 'medium',
    include_answer: false
  }
});

console.log(result);
```

## 4. Testing Your Deployment

### Step-by-Step Verification

1. **Server is running:**
   ```bash
   curl https://your-app.fly.dev/health
   # Should return: {"status":"ok",...}
   ```

2. **MCP endpoint accessible:**
   ```bash
   curl https://your-app.fly.dev/
   # Should return server info with 7 tools
   ```

3. **Tools work:**
   ```bash
   # Try listing puzzles (use command from above)
   ```

4. **Claude Desktop connected:**
   - Open Claude Desktop
   - Start a conversation
   - Ask "Give me a lateral thinking puzzle"
   - Should work! 🎉

## 5. Troubleshooting

### "Cannot connect to server"

**Check 1:** Verify server is running
```bash
curl https://your-app.fly.dev/health
```

**Check 2:** Verify URL in Claude config
- Must include `/mcp` endpoint
- Must use `https://`
- No trailing slash

**Check 3:** Restart Claude Desktop
- Quit completely (Cmd+Q)
- Reopen

### "Tools not appearing in Claude"

1. Check config file location is correct
2. Verify JSON is valid (use jsonlint.com)
3. Check Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
4. Restart Claude Desktop

### "Server responds slowly"

**Render:** Normal on first request (cold start ~30 sec)
**Fly.io:** Should be fast (~1 sec cold start)

**Solution:** Wait for first request, then subsequent requests are fast

### "Error calling tool"

1. Check tool name spelling
2. Verify arguments match schema
3. Check server logs:
   - Render: Dashboard → Logs
   - Fly.io: `flyctl logs`

## 6. Monitoring Usage

### Check Logs

**Render:**
```bash
# Via dashboard at render.com
```

**Fly.io:**
```bash
flyctl logs
flyctl logs --tail  # Live logs
```

### Monitor Health

```bash
# Set up a cron job or use a monitoring service
watch -n 60 'curl -s https://your-app.fly.dev/health'
```

### Track Usage

Both platforms provide dashboards with:
- Request count
- Response times
- Error rates
- Resource usage

## 7. Advanced Usage

### Filter Puzzles by Category

```bash
curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "lateral_list_puzzles",
      "arguments": {
        "category": "situation",
        "difficulty": "hard",
        "response_format": "json"
      }
    }
  }'
```

### Get JSON for Programmatic Use

All tools support `response_format: "json"` for machine-readable output:

```json
{
  "response_format": "json"
}
```

### Combine Multiple Requests

Create a script to get multiple puzzles:

```bash
#!/bin/bash
for i in {1..3}; do
  curl -X POST https://your-app.fly.dev/mcp \
    -H "Content-Type: application/json" \
    -d "{
      \"jsonrpc\": \"2.0\",
      \"id\": $i,
      \"method\": \"tools/call\",
      \"params\": {
        \"name\": \"lateral_random_puzzle\",
        \"arguments\": {
          \"include_answer\": false
        }
      }
    }"
  echo ""
done
```

## 8. Integration Examples

### Daily Practice Reminder

```bash
# Add to cron (daily at 9am)
0 9 * * * curl -X POST https://your-app.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"lateral_random_puzzle","arguments":{"include_answer":false}}}' \
  | mail -s "Daily Lateral Thinking Puzzle" you@email.com
```

### Slack Bot Integration

```javascript
// When someone types /puzzle in Slack
app.command('/puzzle', async ({ command, ack, respond }) => {
  await ack();
  
  const response = await fetch('https://your-app.fly.dev/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'lateral_random_puzzle',
        arguments: { include_answer: false }
      }
    })
  });
  
  const puzzle = await response.json();
  await respond({ text: puzzle.result.content[0].text });
});
```

## 9. Performance Tips

### Minimize Cold Starts

**Render:**
- Keep app awake with: https://uptimerobot.com (free)

**Fly.io:**
- Already fast (~1 sec)
- Or keep always-on: `flyctl scale count 1`

### Cache Responses

If building an app, cache tool responses:
- Puzzles don't change
- Techniques don't change
- Reduces server load

## 10. Security Notes

- Server is public (anyone with URL can use)
- No authentication needed (read-only tools)
- No sensitive data stored
- No user data collected

If you need private access, consider:
- Adding API key authentication
- Using Fly.io private networking
- Deploying to internal network

## Next Steps

1. **Deploy your server** (see DEPLOY_FLYIO.md or DEPLOY_RENDER.md)
2. **Test with curl** (verify all tools work)
3. **Configure Claude Desktop** (add to config.json)
4. **Start using!** Ask Claude for puzzles 🧩

## Support

Having issues? Check:
1. Server health: `/health` endpoint
2. Server logs: Platform dashboard
3. Claude Desktop logs: `~/Library/Logs/Claude/`
4. This guide: Common issues above

---

Happy puzzle-solving! 🎉
