// Load user posts
const postsGrid = document.querySelector(".posts-grid");

// Simulate fetching user posts
const userPosts = [
  {
    image:
      "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg",
    title: "Space Shooter Game",
    description: "Check out my latest game built with PixiJS!",
  },
  {
    image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    title: "Platform Adventure",
    description: "A fun platformer game I created.",
  },
  {
    image: "https://images.pexels.com/photos/3165338/pexels-photo-3165338.jpeg",
    title: "Puzzle Challenge",
    description: "A challenging puzzle game for all ages.",
  },
];

// Render user posts
userPosts.forEach((post) => {
  const postHTML = `
    <div class="post-card">
      <img src="${post.image}" alt="${post.title}" />
      <div class="post-info">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
      </div>
    </div>
  `;
  postsGrid.insertAdjacentHTML("beforeend", postHTML);
});

// Edit Profile Modal Functionality
const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileModal = document.getElementById("edit-profile-modal");
const closeModalBtn = document.querySelector(".close-modal");
const editProfileForm = document.getElementById("edit-profile-form");
const profileUsername = document.querySelector(".profile-info h1");
const profileBio = document.querySelector(".profile-bio p");
const profileAvatar = document.querySelector(".profile-avatar img");

// Open the modal
editProfileBtn.addEventListener("click", () => {
  editProfileModal.style.display = "flex";
});

// Close the modal
closeModalBtn.addEventListener("click", () => {
  editProfileModal.style.display = "none";
});

// Close the modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === editProfileModal) {
    editProfileModal.style.display = "none";
  }
});

// Handle form submission
editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newUsername = document.getElementById("edit-username").value;
  const newBio = document.getElementById("edit-bio").value;
  const newAvatar = document.getElementById("edit-avatar").files[0];

  // Update username and bio
  profileUsername.textContent = newUsername;
  profileBio.textContent = newBio;

  // Update avatar if a new one is uploaded
  if (newAvatar) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profileAvatar.src = event.target.result;
    };
    reader.readAsDataURL(newAvatar);
  }

  // Close the modal
  editProfileModal.style.display = "none";
});
