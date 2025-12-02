"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@aliveui/ui"
import { Calendar } from "lucide-react"
// import { Message, MessageAvatar, MessageContent } from "../../ai/message"
// import { PromptInput, PromptInputSubmit, PromptInputTextarea } from "../../ai/prompt-input"
// import { useAgent } from "../../ai/agent-context"

export function RightSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { todoHandler } = useAgent()

  return (
    <Sidebar
      collapsible="offcanvas"
      className="sticky !h-[calc(100vh-60px)] w-80 hidden lg:flex top-0 h-svh border-l bg-sidebar"
      side="right"
      {...props}
    >
      <SidebarHeader className="h-(--header-height) border-b border-sidebar-border px-4 py-2 flex flex-row items-center justify-between">
        <span className="font-medium text-sm">Agent</span>
      </SidebarHeader>
      <SidebarContent className="flex flex-col flex-1 overflow-hidden p-4 gap-4">
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
          {/* <Message from="assistant">
            <MessageAvatar src="/avatars/ai.png" name="AI" />
            <MessageContent>
              Hello! I'm your AI assistant. How can I help you today?
            </MessageContent>
          </Message>
          <Message from="user">
            <MessageAvatar src="/avatars/user.png" name="ME" />
            <MessageContent>
              I need to add some todos.
            </MessageContent>
          </Message> */}
        </div>


      </SidebarContent>
      <SidebarFooter>
        {/* <PromptInput className="mt-auto">
          <PromptInputTextarea placeholder="Ask AI..." />
          <div className="flex justify-between p-2">
            <div />
            <PromptInputSubmit />
          </div>
        </PromptInput> */}
      </SidebarFooter>
    </Sidebar>
  )
}
