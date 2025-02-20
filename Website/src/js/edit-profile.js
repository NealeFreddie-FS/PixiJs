// DOM Elements
const editProfileForm = document.getElementById("edit-profile-form");
const skillInput = document.getElementById("skill-input");
const addSkillBtn = document.getElementById("add-skill");
const skillsList = document.getElementById("skills-list");
const socialPlatform = document.getElementById("social-platform");
const socialUrl = document.getElementById("social-url");
const addSocialBtn = document.getElementById("add-social");
const socialLinksList = document.getElementById("social-links-list");
const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatar-preview");

// Skills Array
let skills = [];

// Social Links Array
let socialLinks = [];

// Add Skill
addSkillBtn.addEventListener("click", () => {
  const skill = skillInput.value.trim();
  if (skill && !skills.includes(skill)) {
    skills.push(skill);
    renderSkills();
    skillInput.value = "";
  }
});

// Render Skills
function renderSkills() {
  skillsList.innerHTML = skills
    .map(
      (skill) => `
    <div class="skill-item">
      <span>${skill}</span>
      <button type="button" onclick="removeSkill('${skill}')">&times;</button>
    </div>
  `
    )
    .join("");
}

// Remove Skill
window.removeSkill = (skill) => {
  skills = skills.filter((s) => s !== skill);
  renderSkills();
};

// Add Social Link
addSocialBtn.addEventListener("click", () => {
  const platform = socialPlatform.value;
  const url = socialUrl.value.trim();
  if (url) {
    socialLinks.push({ platform, url });
    renderSocialLinks();
    socialUrl.value = "";
  }
});

// Render Social Links
function renderSocialLinks() {
  socialLinksList.innerHTML = socialLinks
    .map(
      (link) => `
    <div class="social-link-item">
      <i class="fab fa-${link.platform}"></i>
      <span>${link.url}</span>
      <button type="button" onclick="removeSocialLink('${link.url}')">&times;</button>
    </div>
  `
    )
    .join("");
}

// Remove Social Link
window.removeSocialLink = (url) => {
  socialLinks = socialLinks.filter((link) => link.url !== url);
  renderSocialLinks();
};

// Handle Avatar Upload
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Avatar Preview" />`;
    };
    reader.readAsDataURL(file);
  }
});

// Handle Form Submission
editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const bio = document.getElementById("bio").value;

  // Save profile data (simulate saving to localStorage)
  const profileData = {
    username,
    bio,
    skills,
    socialLinks,
    avatar: avatarPreview.querySelector("img")?.src || "",
  };

  localStorage.setItem("profile", JSON.stringify(profileData));

  // Redirect to profile page
  window.location.href = "profile.html";
});

// Load existing profile data (if any)
const savedProfile = JSON.parse(localStorage.getItem("profile"));
if (savedProfile) {
  document.getElementById("username").value = savedProfile.username;
  document.getElementById("bio").value = savedProfile.bio;
  skills = savedProfile.skills || [];
  socialLinks = savedProfile.socialLinks || [];
  if (savedProfile.avatar) {
    avatarPreview.innerHTML = `<img src="${savedProfile.avatar}" alt="Avatar Preview" />`;
  }
  renderSkills();
  renderSocialLinks();
}
