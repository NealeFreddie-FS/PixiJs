document
  .getElementById("submit-project-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const projectName = document.getElementById("project-name").value;
    const projectDescription = document.getElementById(
      "project-description"
    ).value;
    const projectImage = document.getElementById("project-image").files[0];
    const projectLink = document.getElementById("project-link").value;

    if (!projectName || !projectDescription || !projectImage || !projectLink) {
      alert("Please fill out all fields.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const project = {
        name: projectName,
        description: projectDescription,
        image: event.target.result,
        link: projectLink,
      };

      // Save the project to local storage (or send to a backend API)
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      projects.push(project);
      localStorage.setItem("projects", JSON.stringify(projects));

      alert("Project submitted successfully!");
      document.getElementById("submit-project-form").reset();
    };

    reader.readAsDataURL(projectImage);
  });
