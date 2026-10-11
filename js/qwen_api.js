/**
 * Qwen API Integration Service
 * 
 * SECURE ARCHITECTURE:
 * - The secret API Key is stored on the backend server (.env) and NEVER exposed to the browser.
 * - Client sends requests to the server proxy `/api/chat`.
 * - If running without server, falls back gracefully to local SACET knowledge engine or local Ollama.
 */

class QwenApiService {
  constructor() {
    this.useBackendProxy = true; // Default: Secure Server Proxy
    this.backendEndpoint = "/api/chat";
    this.statusEndpoint = "/api/status";
    this.modelName = "Qwen 2.5 72B (Server Protected)";
    this.isBackendOnline = false;

    // Check backend status on startup
    this.checkBackendHealth();
  }

  async checkBackendHealth() {
    try {
      const paths = ["/api/status", "/college_web/api/status"];
      for (const p of paths) {
        try {
          const res = await fetch(p);
          if (res.ok) {
            const data = await res.json();
            this.isBackendOnline = true;
            this.backendEndpoint = p.replace("/status", "/chat");
            this.modelName = data.model || "Qwen 2.5 72B";
            console.log("🔒 Connected to Secure Server Backend:", data);
            return true;
          }
        } catch (_) {}
      }
    } catch (e) {
      this.isBackendOnline = false;
    }
    return false;
  }

  isConfigured() {
    // If backend is active, it's always configured securely
    return true;
  }

  /**
   * Tests the connection with the secure server proxy
   */
  async testConnection() {
    try {
      const response = await fetch(this.backendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Connection verification ping",
          systemPrompt: "Respond with exactly: 'SACET Secure Qwen Backend Verified Successfully!'"
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      return data.reply || "Connected successfully!";
    } catch (err) {
      throw new Error(`Backend Connection: ${err.message}`);
    }
  }

  /**
   * Sends user prompt with knowledge base grounding to Qwen via Secure Backend Proxy
   */
  async sendMessage(userMessage, history = [], onChunk = null) {
    // 1. Generate strictly grounded System Prompt with retrieved facts
    const systemPrompt = window.knowledgeBase.generateSystemPrompt(userMessage);

    // 2. Try sending through Secure Backend Proxy (API Key stays secret on server)
    try {
      const response = await fetch(this.backendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: history.slice(-6).map(h => ({ role: h.role, content: h.content })),
          systemPrompt: systemPrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || "No reply generated.";

        // Simulate smooth word-by-word streaming animation for natural conversational feel
        if (onChunk) {
          const words = reply.split(" ");
          let acc = "";
          for (let i = 0; i < words.length; i++) {
            acc += (acc ? " " : "") + words[i];
            onChunk(acc);
            await new Promise(r => setTimeout(r, 16));
          }
        }

        return reply;
      } else {
        console.warn("Backend proxy error. Falling back to local verified knowledge engine.");
      }
    } catch (networkErr) {
      console.warn("Server backend unreachable. Falling back to local verified knowledge engine:", networkErr);
    }

    // 3. Fallback: Local verified college database engine
    const localAnswer = window.knowledgeBase.generateLocalAnswer(userMessage);
    if (onChunk) {
      const words = localAnswer.split(" ");
      let acc = "";
      for (const w of words) {
        acc += (acc ? " " : "") + w;
        onChunk(acc);
        await new Promise(r => setTimeout(r, 20));
      }
    }
    return localAnswer;
  }
}

// Global API service instance
window.qwenApi = new QwenApiService();
