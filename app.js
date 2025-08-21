// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    loadGallery(); // Load project gallery from JSON
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleFormSubmit); // Attach form submit handler
});

/**
 * Loads the project gallery from gallery.json and renders it on the page.
 * Adds click listeners to project titles for showing more details.
 */
function loadGallery() {
    fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
            const galleryContainer = document.getElementById('project-container');
            galleryContainer.innerHTML = '';
            // Iterate over each project and create its DOM element
            data.projects.forEach((project, idx) => {
                const projectElement = document.createElement('div');
                projectElement.classList.add('project');
                projectElement.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-details">
                        <h3 class="project-title" data-index="${idx}" style="cursor:pointer;">${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                `;
                galleryContainer.appendChild(projectElement);
            });

            // Add click listeners to project titles to show details
            document.querySelectorAll('.project-title').forEach(title => {
                title.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    showProjectDetails(data.projects[index]);
                });
            });
        })
        .catch(error => console.error('Error loading gallery:', error));
}

/**
 * Displays more information about a project in the project-info section.
 * @param {Object} project - The project object to display.
 */
function showProjectDetails(project) {
    const infoDiv = document.getElementById('project-details');
    infoDiv.style.display = 'block';
    infoDiv.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}" style="max-width:200px; margin-bottom:10px;">
        <p>${project.description}</p>
        <p><strong>More info coming soon...</strong></p>
    `;
}

/**
 * Handles the contact form submission, validates input, and displays feedback.
 * @param {Event} event - The form submit event.
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const responseDiv = document.getElementById('form-response');

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name input
    if (!name) {
        responseDiv.textContent = 'Please enter your name.';
        responseDiv.style.color = 'red';
        return;
    }
    // Validate email input
    if (!email || !emailRegex.test(email)) {
        responseDiv.textContent = 'Please enter a valid email address.';
        responseDiv.style.color = 'red';
        return;
    }
    // Validate message input
    if (!message) {
        responseDiv.textContent = 'Please enter your message.';
        responseDiv.style.color = 'red';
        return;
    }

    // If all inputs are valid, show success message and reset form
    responseDiv.textContent = 'Thank you for your message!';
    responseDiv.style.color = 'green';
    event.target.reset();
}

/**
 * Helper: Format phone number as (XXX) XXX-XXXX
 * @param {string} phone - The phone number string.
 * @returns {string} - Formatted phone number or original input.
 */
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

/**
 * Helper: Validate email address format.
 * @param {string} email - The email address string.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}