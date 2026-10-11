/**
 * Application Configuration & API Defaults for Qwen College Assistant
 */
const CONFIG = {
  APP_NAME: "Apex College AI Helpdesk",
  VERSION: "2.4.0",
  
  // Storage keys in localStorage
  STORAGE_KEYS: {
    API_KEY: "college_web_qwen_api_key",
    PROVIDER: "college_web_provider",
    MODEL: "college_web_model",
    ENDPOINT: "college_web_custom_endpoint",
    CUSTOM_COLLEGE_DATA: "college_web_custom_data",
    CHAT_HISTORY: "college_web_chat_history",
    THEME: "college_web_theme"
  },

  // Available Providers
  PROVIDERS: {
    DASHSCOPE_INTL: {
      name: "Alibaba Cloud DashScope (International)",
      endpoint: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      docsUrl: "https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key",
      defaultModel: "qwen-plus",
      models: [
        { id: "qwen-plus", name: "Qwen Plus (Recommended - Balanced & Fast)" },
        { id: "qwen-turbo", name: "Qwen Turbo (Super Fast & Cost Effective)" },
        { id: "qwen-max", name: "Qwen Max (High Reasoning & Accuracy)" },
        { id: "qwen2.5-72b-instruct", name: "Qwen 2.5 72B Instruct" },
        { id: "qwen2.5-32b-instruct", name: "Qwen 2.5 32B Instruct" },
        { id: "qwen2.5-7b-instruct", name: "Qwen 2.5 7B Instruct" }
      ]
    },
    DASHSCOPE_CN: {
      name: "Alibaba Cloud DashScope (China Mainland)",
      endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      docsUrl: "https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key",
      defaultModel: "qwen-plus",
      models: [
        { id: "qwen-plus", name: "Qwen Plus" },
        { id: "qwen-turbo", name: "Qwen Turbo" },
        { id: "qwen-max", name: "Qwen Max" },
        { id: "qwen2.5-72b-instruct", name: "Qwen 2.5 72B" }
      ]
    },
    OPENROUTER: {
      name: "OpenRouter (Universal Qwen Access)",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      docsUrl: "https://openrouter.ai/keys",
      defaultModel: "qwen/qwen-2.5-72b-instruct",
      models: [
        { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B (OpenRouter)" },
        { id: "qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B" },
        { id: "qwen/qwen-turbo", name: "Qwen Turbo" },
        { id: "qwen/qwen-plus", name: "Qwen Plus" }
      ]
    },
    CUSTOM: {
      name: "Custom / Local Ollama (OpenAI Compatible)",
      endpoint: "http://localhost:11434/v1/chat/completions",
      docsUrl: "https://ollama.com/library/qwen2.5",
      defaultModel: "qwen2.5:1.5b",
      models: [
        { id: "qwen2.5:1.5b", name: "Ollama: qwen2.5:1.5b (Fast & Lightweight)" },
        { id: "qwen2.5:latest", name: "Ollama: qwen2.5:latest" },
        { id: "qwen2.5:7b", name: "Ollama: qwen2.5:7b" },
        { id: "qwen2.5:14b", name: "Ollama: qwen2.5:14b" }
      ]
    }
  },

  DEFAULT_PROVIDER: "DASHSCOPE_INTL",
  DEFAULT_TEMPERATURE: 0.3, // Lower temperature ensures strictly grounded, factual responses
  DEFAULT_MAX_TOKENS: 1024
};

// Freeze configuration
window.CONFIG = Object.freeze(CONFIG);
