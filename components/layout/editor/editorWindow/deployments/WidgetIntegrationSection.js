"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Button,
} from "@heroui/react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function WidgetIntegrationSection({ workflowId }) {
  const [activeFramework, setActiveFramework] = useState("html");
  const [copiedCode, setCopiedCode] = useState(null);

  const frameworks = [
    {
      id: "html",
      name: "HTML/Vanilla JS",
      icon: "🌐",
      snippets: [
        {
          title: "Basic Integration",
          description: "Add the script tag and initialize the widget",
          language: "html",
          code: `<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your content -->
    
    <!-- DeForge Widget Script -->
    <script src="https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js"></script>
    <script>
        const widget = new ChatbotWidget({
            workflowId: "${workflowId}",
            theme: "deforge-light", // or "deforge-dark"
            position: "bottom-right" // bottom-left, top-right, top-left
        });
    </script>
</body>
</html>`,
        },
      ],
    },
    {
      id: "nextjs",
      name: "Next.js",
      icon: "⚡",
      badge: "React",
      snippets: [
        {
          title: "App Router (Recommended)",
          description: "Using Next.js 13+ App Router with useEffect",
          language: "tsx",
          filename: "components/chatbot-widget.tsx",
          code: `'use client'

import { useEffect } from 'react'

interface ChatbotWidgetProps {
  workflowId: string
  theme?: 'deforge-light' | 'deforge-dark'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export default function ChatbotWidget({ 
  workflowId, 
  theme = 'deforge-light', 
  position = 'bottom-right' 
}: ChatbotWidgetProps) {
  useEffect(() => {
    // Load the script dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
    script.async = true
    
    script.onload = () => {
      // Initialize widget after script loads
      if (typeof window !== 'undefined' && (window as any).ChatbotWidget) {
        new (window as any).ChatbotWidget({
          workflowId,
          theme,
          position
        })
      }
    }
    
    document.head.appendChild(script)
    
    // Cleanup
    return () => {
      document.head.removeChild(script)
    }
  }, [workflowId, theme, position])

  return null // Widget renders itself
}`,
        },
        {
          title: "Usage in Layout/Page",
          description: "How to use the widget component",
          language: "tsx",
          filename: "app/layout.tsx",
          code: `import ChatbotWidget from '@/components/chatbot-widget'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatbotWidget 
          workflowId="${workflowId}"
          theme="deforge-light"
          position="bottom-right"
        />
      </body>
    </html>
  )
}`,
        },
        {
          title: "Pages Router (Legacy)",
          description: "For Next.js 12 and below using Pages Router",
          language: "tsx",
          filename: "pages/_app.tsx",
          code: `import { useEffect } from 'react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
    script.async = true
    
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).ChatbotWidget) {
        new (window as any).ChatbotWidget({
          workflowId: "${workflowId}",
          theme: "deforge-light",
          position: "bottom-right"
        })
      }
    }
    
    document.head.appendChild(script)
  }, [])

  return <Component {...pageProps} />
}`,
        },
      ],
    },
    {
      id: "react",
      name: "React",
      icon: "⚛️",
      snippets: [
        {
          title: "Hook Implementation",
          description: "Custom hook for widget integration",
          language: "tsx",
          filename: "hooks/useChatbotWidget.ts",
          code: `import { useEffect } from 'react'

interface UseChatbotWidgetProps {
  workflowId: string
  theme?: 'deforge-light' | 'deforge-dark'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function useChatbotWidget({ 
  workflowId, 
  theme = 'deforge-light', 
  position = 'bottom-right' 
}: UseChatbotWidgetProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
    script.async = true
    
    script.onload = () => {
      if ((window as any).ChatbotWidget) {
        new (window as any).ChatbotWidget({
          workflowId,
          theme,
          position
        })
      }
    }
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [workflowId, theme, position])
}`,
        },
        {
          title: "Component Usage",
          description: "Using the hook in your React component",
          language: "tsx",
          filename: "App.tsx",
          code: `import { useChatbotWidget } from './hooks/useChatbotWidget'

function App() {
  useChatbotWidget({
    workflowId: "${workflowId}",
    theme: "deforge-light",
    position: "bottom-right"
  })

  return (
    <div className="App">
      <h1>Your React App</h1>
      {/* Your app content */}
    </div>
  )
}

export default App`,
        },
      ],
    },
    {
      id: "vue",
      name: "Vue.js",
      icon: "💚",
      snippets: [
        {
          title: "Vue 3 Composition API",
          description: "Using the Composition API with onMounted",
          language: "vue",
          filename: "components/ChatbotWidget.vue",
          code: `<template>
  <!-- Widget renders itself, no template needed -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  workflowId: string
  theme?: 'deforge-light' | 'deforge-dark'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'deforge-light',
  position: 'bottom-right'
})

let scriptElement: HTMLScriptElement | null = null

onMounted(() => {
  scriptElement = document.createElement('script')
  scriptElement.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
  scriptElement.async = true
  
  scriptElement.onload = () => {
    if ((window as any).ChatbotWidget) {
      new (window as any).ChatbotWidget({
        workflowId:props.workflowId,
        theme: props.theme,
        position: props.position
      })
    }
  }
  
  document.head.appendChild(scriptElement)
})

onUnmounted(() => {
  if (scriptElement && document.head.contains(scriptElement)) {
    document.head.removeChild(scriptElement)
  }
})
</script>`,
        },
        {
          title: "Usage in App",
          description: "How to use the widget component in your Vue app",
          language: "vue",
          filename: "App.vue",
          code: `<template>
  <div id="app">
    <h1>Your Vue App</h1>
    <!-- Your app content -->
    
    <ChatbotWidget 
      workflow-id="${workflowId}"
      theme="deforge-light"
      position="bottom-right"
    />
  </div>
</template>

<script setup lang="ts">
import ChatbotWidget from './components/ChatbotWidget.vue'
</script>`,
        },
      ],
    },
    {
      id: "angular",
      name: "Angular",
      icon: "🅰️",
      snippets: [
        {
          title: "Service Implementation",
          description: "Create a service to manage the widget",
          language: "typescript",
          filename: "services/chatbot-widget.service.ts",
          code: `import { Injectable } from '@angular/core'

export interface ChatbotWidgetConfig {
  workflowId: string
  theme?: 'deforge-light' | 'deforge-dark'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotWidgetService {
  private scriptLoaded = false

  async loadWidget(config: ChatbotWidgetConfig): Promise<void> {
    if (this.scriptLoaded) {
      this.initializeWidget(config)
      return
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
      script.async = true
      
      script.onload = () => {
        this.scriptLoaded = true
        this.initializeWidget(config)
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load chatbot widget script'))
      }
      
      document.head.appendChild(script)
    })
  }

  private initializeWidget(config: ChatbotWidgetConfig): void {
    if ((window as any).ChatbotWidget) {
      new (window as any).ChatbotWidget({
        workflowId: config.workflowId,
        theme: config.theme || 'deforge-light',
        position: config.position || 'bottom-right'
      })
    }
  }
}`,
        },
        {
          title: "Component Usage",
          description: "Using the service in your Angular component",
          language: "typescript",
          filename: "app.component.ts",
          code: `import { Component, OnInit } from '@angular/core'
import { ChatbotWidgetService } from './services/chatbot-widget.service'

@Component({
  selector: 'app-root',
  template: \`
    <div class="app">
      <h1>Your Angular App</h1>
      <!-- Your app content -->
    </div>
  \`
})
export class AppComponent implements OnInit {
  constructor(private chatbotService: ChatbotWidgetService) {}

  ngOnInit(): void {
    this.chatbotService.loadWidget({
      workflowId: "${workflowId}",
      theme: 'deforge-light',
      position: 'bottom-right'
    }).catch(error => {
      console.error('Failed to load chatbot widget:', error)
    })
  }
}`,
        },
      ],
    },
    {
      id: "svelte",
      name: "Svelte",
      icon: "🧡",
      snippets: [
        {
          title: "Svelte Component",
          description: "Widget component using onMount lifecycle",
          language: "svelte",
          filename: "ChatbotWidget.svelte",
          code: `<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  
  export let workflowId: string
  export let theme: 'deforge-light' | 'deforge-dark' = 'deforge-light'
  export let position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right'
  
  let scriptElement: HTMLScriptElement | null = null
  
  onMount(() => {
    scriptElement = document.createElement('script')
    scriptElement.src = 'https://cdn.jsdelivr.net/npm/deforge-widget/chatbot.min.js'
    scriptElement.async = true
    
    scriptElement.onload = () => {
      if ((window as any).ChatbotWidget) {
        new (window as any).ChatbotWidget({
          workflowId,
          theme,
          position
        })
      }
    }
    
    document.head.appendChild(scriptElement)
  })
  
  onDestroy(() => {
    if (scriptElement && document.head.contains(scriptElement)) {
      document.head.removeChild(scriptElement)
    }
  })
</script>

<!-- Widget renders itself, no markup needed -->`,
        },
        {
          title: "Usage in App",
          description: "How to use the widget in your Svelte app",
          language: "svelte",
          filename: "App.svelte",
          code: `<script lang="ts">
  import ChatbotWidget from './ChatbotWidget.svelte'
</script>

<main>
  <h1>Your Svelte App</h1>
  <!-- Your app content -->
  
  <ChatbotWidget 
    workflowId="${workflowId}"
    theme="deforge-light"
    position="bottom-right"
  />
</main>`,
        },
      ],
    },
  ];

  const copyToClipboard = async (code, title) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Code copied!", {
        description: `${title} code has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Please copy the code manually.",
      });
    }
  };

  return (
    <section className="w-full border border-black/50 bg-black/5 dark:bg-transparent dark:border-background rounded-lg mt-4 flex flex-col gap-2">
      <Card className="w-full bg-transparent p-4 text-black dark:text-background">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2">
                Widget Integration Guides
                <Chip
                  color="secondary"
                  variant="flat"
                  size="sm"
                  className="text-xs text-black/60 dark:text-background dark:bg-white/10"
                >
                  6 Frameworks
                </Chip>
              </h3>
              <p className=" dark:text-background mt-1 opacity-60 text-xs">
                Select your framework below to see the specific integration code
                and instructions.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-2">
          <Tabs
            selectedKey={activeFramework}
            onSelectionChange={(key) => setActiveFramework(key)}
            className="w-full"
            variant="underlined"
            classNames={{
              cursor: "bg-black/80 dark:bg-white/80",
            }}
          >
            {frameworks.map((framework) => (
              <Tab
                key={framework.id}
                title={
                  <div className="flex items-center gap-2 dark:text-background text-black">
                    <span>{framework.icon}</span>
                    <span className="text-sm dark:text-background text-black">
                      {framework.name}
                    </span>
                  </div>
                }
                className="px-1 pb-2"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{framework.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold">
                        {framework.name}
                      </h4>
                      <p className="text-xs opacity-60 dark:text-background">
                        Integration guide for {framework.name}
                      </p>
                    </div>
                  </div>

                  {framework.snippets.map((snippet, index) => (
                    <Card
                      key={index}
                      className="relative shadow-none rounded-lg bg-black/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between w-full text-black dark:text-background">
                          <div>
                            <h5 className="text-sm font-semibold">
                              {snippet.title}
                            </h5>
                            <p className="text-xs opacity-60">
                              {snippet.description}
                            </p>
                            {snippet.filename && (
                              <Chip
                                variant="bordered"
                                size="sm"
                                className="mt-2 text-xs opacity-60 text-black dark:text-background dark:border-background border-black/50"
                              >
                                {snippet.filename}
                              </Chip>
                            )}
                          </div>
                          <Button
                            variant="bordered"
                            size="sm"
                            isIconOnly
                            onClick={() =>
                              copyToClipboard(snippet.code, snippet.title)
                            }
                            className="dark:border-background border-black/50 text-black dark:text-background"
                          >
                            {copiedCode === snippet.code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardBody className="p-0">
                        <div className="relative">
                          <pre className="p-4 rounded-lg rounded-t-none overflow-x-auto text-sm bg-black/80 dark:bg-white/5">
                            <code>{snippet.code}</code>
                          </pre>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
