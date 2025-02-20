export default class Messages {
  constructor() {
    this.conversations = [
      {
        id: 1,
        contact: "John Doe",
        lastMessage: "Hey, how's it going?",
        time: "10:30 AM",
        unread: 2,
        messages: [
          {
            id: 1,
            text: "Hey, how's it going?",
            time: "10:30 AM",
            sent: false,
          },
          {
            id: 2,
            text: "I'm doing great! How about you?",
            time: "10:31 AM",
            sent: true,
          },
        ],
      },
      {
        id: 2,
        contact: "Jane Smith",
        lastMessage: "See you tomorrow!",
        time: "Yesterday",
        unread: 0,
        messages: [
          {
            id: 1,
            text: "Are we still on for tomorrow?",
            time: "Yesterday",
            sent: true,
          },
          {
            id: 2,
            text: "Yes, definitely!",
            time: "Yesterday",
            sent: false,
          },
          {
            id: 3,
            text: "See you tomorrow!",
            time: "Yesterday",
            sent: false,
          },
        ],
      },
    ];

    this.currentConversation = null;
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    if (this.currentConversation) {
      this.renderConversation();
    } else {
      this.renderConversationList();
    }
  }

  renderConversationList() {
    this.container.innerHTML = `
      <div class="messages-app">
        <div class="app-header">
          <h2>Messages</h2>
          <button class="new-message-btn">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search" />
        </div>

        <div class="conversations-list">
          ${this.conversations
            .map(
              (conv) => `
            <div class="conversation-item" data-id="${conv.id}">
              <div class="contact-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="conversation-info">
                <div class="conversation-header">
                  <span class="contact-name">${conv.contact}</span>
                  <span class="message-time">${conv.time}</span>
                </div>
                <div class="conversation-preview">
                  <p class="last-message">${conv.lastMessage}</p>
                  ${
                    conv.unread
                      ? `<span class="unread-badge">${conv.unread}</span>`
                      : ""
                  }
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    this.setupConversationListeners();
  }

  renderConversation() {
    const conversation = this.conversations.find(
      (c) => c.id === this.currentConversation
    );
    if (!conversation) return;

    this.container.innerHTML = `
      <div class="messages-app conversation-view">
        <div class="app-header">
          <button class="back-button">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="contact-info">
            <div class="contact-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <span class="contact-name">${conversation.contact}</span>
          </div>
          <button class="info-button">
            <i class="fas fa-info-circle"></i>
          </button>
        </div>

        <div class="messages-container">
          ${conversation.messages
            .map(
              (msg) => `
            <div class="message ${msg.sent ? "sent" : "received"}">
              <div class="message-bubble">
                <p class="message-text">${msg.text}</p>
                <span class="message-time">${msg.time}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="message-input">
          <button class="camera-button">
            <i class="fas fa-camera"></i>
          </button>
          <div class="input-field">
            <input type="text" placeholder="iMessage" />
            <button class="emoji-button">
              <i class="fas fa-smile"></i>
            </button>
          </div>
          <button class="send-button">
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    `;

    this.setupConversationViewListeners();
  }

  setupConversationListeners() {
    this.container.querySelectorAll(".conversation-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.currentConversation = parseInt(item.dataset.id);
        this.render();
      });
    });
  }

  setupConversationViewListeners() {
    const backButton = this.container.querySelector(".back-button");
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.currentConversation = null;
        this.render();
      });
    }

    const input = this.container.querySelector(".input-field input");
    const sendButton = this.container.querySelector(".send-button");

    if (input && sendButton) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          this.sendMessage(input.value.trim());
          input.value = "";
        }
      });

      sendButton.addEventListener("click", () => {
        if (input.value.trim()) {
          this.sendMessage(input.value.trim());
          input.value = "";
        }
      });
    }
  }

  sendMessage(text) {
    const conversation = this.conversations.find(
      (c) => c.id === this.currentConversation
    );
    if (!conversation) return;

    const newMessage = {
      id: conversation.messages.length + 1,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      sent: true,
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = text;
    conversation.time = newMessage.time;

    this.render();
  }
}
