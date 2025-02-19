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
