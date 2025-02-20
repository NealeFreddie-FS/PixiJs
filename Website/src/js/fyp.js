// Infinite Scroll Functionality
const feed = document.getElementById("fyp-feed");
let page = 1;

const loadPosts = async () => {
  // Simulate fetching posts from an API
  const posts = [
    {
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      username: "JohnDoe",
      image:
        "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg",
      caption:
        "Check out this amazing space shooter game built with PixiJS! 🚀 #GameDev #PixiJS",
      comments: [
        { username: "JaneSmith", text: "This looks incredible! 🔥" },
        { username: "AlexBrown", text: "Can't wait to try it out! 🎮" },
      ],
    },
    {
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      username: "JaneSmith",
      image:
        "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      caption:
        "Explore this thrilling platform adventure game! 🌟 #IndieGame #Platformer",
      comments: [
        { username: "JohnDoe", text: "Love the art style! 🎨" },
        { username: "AlexBrown", text: "This is so creative! 👏" },
      ],
    },
  ];

  posts.forEach((post) => {
    const postHTML = `
      <div class="fyp-post">
        <div class="post-header">
          <img src="${post.avatar}" alt="User Avatar" class="post-avatar" />
          <span class="post-username">${post.username}</span>
        </div>
        <div class="post-image">
          <img src="${post.image}" alt="Post Image" />
        </div>
        <div class="post-actions">
          <button class="like-btn"><i class="fas fa-heart"></i></button>
          <button class="comment-btn"><i class="fas fa-comment"></i></button>
          <button class="share-btn"><i class="fas fa-share"></i></button>
        </div>
        <div class="post-caption">
          <p>${post.caption}</p>
        </div>
        <div class="post-comments">
          ${post.comments
            .map(
              (comment) =>
                `<p><strong>${comment.username}:</strong> ${comment.text}</p>`
            )
            .join("")}
        </div>
      </div>
    `;
    feed.insertAdjacentHTML("beforeend", postHTML);
  });
};

// Load initial posts
loadPosts();

// Infinite Scroll Event Listener
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    page++;
    loadPosts(); // Load more posts when user reaches the bottom
  }
});

// Like Button Functionality
document.querySelectorAll(".like-btn").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");
    if (button.classList.contains("liked")) {
      button.innerHTML = '<i class="fas fa-heart"></i>';
      button.style.color = "var(--primary-color)";
    } else {
      button.innerHTML = '<i class="far fa-heart"></i>';
      button.style.color = "var(--dark-color)";
    }
  });
});

// Add this code to show notifications
function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Update the post creation code to show a notification
document.getElementById("create-post-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const imageFile = document.getElementById("post-image").files[0];
  const caption = document.getElementById("post-caption").value;

  if (!imageFile || !caption) {
    showNotification("Please upload an image and write a caption.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const post = {
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", // Current user's avatar
      username: "JohnDoe", // Current user's username
      image: event.target.result,
      caption: caption,
      comments: [],
    };

    const postHTML = `
      <div class="fyp-post">
        <div class="post-header">
          <img src="${post.avatar}" alt="User Avatar" class="post-avatar" />
          <span class="post-username">${post.username}</span>
        </div>
        <div class="post-image">
          <img src="${post.image}" alt="Post Image" />
        </div>
        <div class="post-actions">
          <button class="like-btn"><i class="fas fa-heart"></i></button>
          <button class="comment-btn"><i class="fas fa-comment"></i></button>
          <button class="share-btn"><i class="fas fa-share"></i></button>
        </div>
        <div class="post-caption">
          <p>${post.caption}</p>
        </div>
        <div class="post-comments">
          <!-- Comments will appear here -->
        </div>
      </div>
    `;

    document
      .getElementById("fyp-feed")
      .insertAdjacentHTML("afterbegin", postHTML);
    document.getElementById("create-post-form").reset();
    showNotification("Post created successfully!");
  };

  reader.readAsDataURL(imageFile);
});

// Add this code to handle comments
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("comment-btn")) {
    const post = e.target.closest(".fyp-post");
    const commentSection = post.querySelector(".post-comments");

    const commentForm = document.createElement("form");
    commentForm.classList.add("comment-form");
    commentForm.innerHTML = `
      <div class="form-group">
        <textarea placeholder="Write a comment..." required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Post Comment</button>
    `;

    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const commentText = commentForm.querySelector("textarea").value;

      if (!commentText) {
        alert("Please write a comment.");
        return;
      }

      const commentHTML = `
        <p><strong>JohnDoe:</strong> ${commentText}</p>
      `;

      commentSection.insertAdjacentHTML("beforeend", commentHTML);
      commentForm.remove();
    });

    commentSection.appendChild(commentForm);
  }
});

// Add this code to handle sharing
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("share-btn")) {
    const post = e.target.closest(".fyp-post");
    const postImage = post.querySelector(".post-image img").src;
    const postCaption = post.querySelector(".post-caption p").textContent;

    const shareLink = `https://pixijs-games.com/post?image=${encodeURIComponent(
      postImage
    )}&caption=${encodeURIComponent(postCaption)}`;

    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy link. Please try again.");
      });
  }
});
