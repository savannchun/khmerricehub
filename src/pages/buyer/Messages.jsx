import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, MessageSquare, Send, Store } from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button, IconButton } from "../../components/ui/core";
import { Input, SearchBar } from "../../components/ui/forms";
import { Avatar, Badge, EmptyState } from "../../components/ui/display";
import { AttachmentButton, ConversationCard } from "../../components/cards";
import { MESSAGES as DEMO_MESSAGES, NAV_BUYER, NAV_FARMER } from "../../lib/data";
import { getMessages } from "../../lib/services";
import { useAsyncData } from "../../lib/useAsyncData";
import { cx } from "../../lib/utils";

function dayLabel(iso) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function TypingBubble({ name }) {
  return (
    <div className="flex items-end gap-2.5">
      <Avatar name={name} size="sm" />
      <div className="rounded-2xl rounded-bl-md border border-line bg-bg px-4 py-3">
        <p className="text-[11px] font-medium text-faint">{name} is typing…</p>
        <span className="mt-1 flex items-center gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-subtle"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-subtle"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-subtle"
            style={{ animationDelay: "300ms" }}
          />
        </span>
      </div>
    </div>
  );
}

export default function Messages({ role = "buyer" }) {
  const nav = role === "farmer" ? NAV_FARMER : NAV_BUYER;
  const notificationPath = role === "farmer" ? "/farmer/notifications" : "/buyer/notifications";

  const [conversations, setConversations] = useAsyncData(getMessages, DEMO_MESSAGES);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const typingTimer = useRef(null);
  const endRef = useRef(null);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const conversation = conversations.find((c) => c.id === activeId) || null;
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unread, 0);
  const filtered = conversations.filter((c) =>
    c.with.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeId, typing, conversation?.messages.length]);

  const selectConversation = (id) => {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    clearTimeout(typingTimer.current);
    setTyping(true);
    typingTimer.current = setTimeout(() => setTyping(false), 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !conversation) return;
    const now = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              last: text,
              time: now,
              unread: 0,
              messages: [...c.messages, { from: "me", text, time: now }],
            }
          : c,
      ),
    );
    setDraft("");
    clearTimeout(typingTimer.current);
    setTyping(true);
    typingTimer.current = setTimeout(() => setTyping(false), 1800);
  };

  return (
    <DashboardLayout
      nav={nav}
      title="Messages"
      subtitle="Chat directly with farmers"
      notificationPath={notificationPath}
    >
      <div className="grid gap-6 lg:h-[calc(100vh-140px)] lg:grid-cols-[340px_1fr] lg:overflow-hidden">
        <aside className={cx("lg:block", activeId ? "hidden" : "block")}>
          <div className="card flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink">Conversations</h2>
              {unreadTotal > 0 && <Badge variant="primary">{unreadTotal} unread</Badge>}
            </div>
            <div className="border-b border-line p-3">
              <SearchBar
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations…"
                size="sm"
              />
            </div>
            <div className="max-h-[60vh] flex-1 space-y-2 overflow-y-auto p-3 lg:max-h-none">
              {filtered.length ? (
                filtered.map((c) => (
                  <ConversationCard
                    key={c.id}
                    conversation={c}
                    active={c.id === activeId}
                    onClick={() => selectConversation(c.id)}
                  />
                ))
              ) : (
                <p className="px-3 py-8 text-center text-sm text-subtle">
                  No conversations found.
                </p>
              )}
            </div>
          </div>
        </aside>

        <section className={cx("lg:block", activeId ? "block" : "hidden")}>
          {conversation ? (
            <div className="card flex h-full flex-col overflow-hidden">
              <header className="flex items-center gap-3 border-b border-line p-4">
                <IconButton
                  label="Back to conversations"
                  onClick={() => setActiveId(null)}
                  className="lg:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </IconButton>
                <Avatar
                  name={conversation.with.name}
                  size="md"
                  online={conversation.with.online}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{conversation.with.name}</p>
                  <p className="text-xs text-subtle">
                    {conversation.with.province}
                    {conversation.with.online ? " · Online" : ""}
                  </p>
                </div>
                <Button as={Link} to="/marketplace" variant="ghost" size="sm" icon={Store}>
                  View store
                </Button>
              </header>

              <div
                className="flex-1 space-y-4 overflow-y-auto bg-bg/60 p-4 sm:p-6"
                style={{ maxHeight: "calc(100vh - 360px)" }}
              >
                {conversation.messages.map((message, index) => {
                  const showDay =
                    index === 0 ||
                    dayLabel(message.time) !== dayLabel(conversation.messages[index - 1].time);
                  return (
                    <Fragment key={index}>
                      {showDay && (
                        <div className="flex justify-center">
                          <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-subtle">
                            {dayLabel(message.time)}
                          </span>
                        </div>
                      )}
                      <div className={cx("flex", message.from === "me" ? "justify-end" : "justify-start")}>
                        <div
                          className={cx(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-card sm:max-w-[70%]",
                            message.from === "me"
                              ? "rounded-br-md bg-primary text-white"
                              : "rounded-bl-md border border-line bg-surface text-ink",
                          )}
                        >
                          <p className="text-sm leading-6">{message.text}</p>
                          <p
                            className={cx(
                              "mt-1 text-right text-[11px]",
                              message.from === "me" ? "text-primary-100" : "text-faint",
                            )}
                          >
                            {timeLabel(message.time)}
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
                {typing && <TypingBubble name={conversation.with.name} />}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-line p-3 sm:p-4"
              >
                <AttachmentButton />
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  aria-label="Type a message"
                  className="flex-1"
                />
                <Button type="submit" icon={Send} disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden lg:block">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a farmer on the left to start chatting about orders, pricing, and delivery."
              />
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
