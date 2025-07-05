# MCP Agent: LLM Tool Routing with DB & Web Integration

A lightweight agent powered by the Model Context Protocol that dynamically routes user questions to either a database or web search tool using LLM-based logic. Built for inspection via MCP Inspector.

## Features
✅ Intelligent tool selection via LLM

📊 PostgreSQL integration for structured data

🌐 Web scraping fallback via Cheerio

🔁 Auto fallback if DB tool returns no result

🧠 MCP Inspector-compatible

🖼️ Flow diagram and demo included

## Setup Instructions
```
git clone https://github.com/yourusername/mcp-agent.git
cd mcp-agent
conda create -n mcp-agent python=3.10
conda activate mcp-agent
pip install -r requirements.txt
npx tsc 
npx @modelcontextprotocol/inspector node dist/app.js

```
### 📈 Agent Flow

![Flow Diagram](path/to/your/diagram.png)

### 📽️ Live Demo

[![Watch the video](http://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
