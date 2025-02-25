document.addEventListener('DOMContentLoaded', function () {
    // Certifications
    const certificationsContainer = document.getElementById('certifications-container');
    if (certificationsContainer) {
        certifications.forEach(certification => {
            const certificationDiv = document.createElement('img');
            certificationDiv.src = certification.imgSrc;
            certificationDiv.alt = certification.alt;
            certificationDiv.className = "w-20 h-20 md:w-32 md:h-32 transform transition-all duration-300 hover:w-36 hover:h-36";
            certificationsContainer.appendChild(certificationDiv);
        });
    }

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = `w-12 h-12 md:w-20 md:h-20 hover:bg-gray-800 ${skill.color} text-2xl md:text-3xl hover:text-4xl transform transition-all duration-200 rounded-lg p-6 hover:p-4 text-center flex items-center justify-center`;

            if (skill.image) {
                skillDiv.innerHTML = `<img src="${skill.image}" alt="icon ${skill.name}" class="w-20 h-auto">`;
            } else {
                skillDiv.innerHTML = `<i class="fa-brands ${skill.icon} text-white"></i>`;
            }

            skillsContainer.appendChild(skillDiv);
        });
    }

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'w-full lg:w-1/2 xl:w-1/3 p-4 mb-2';
            projectDiv.innerHTML = `
                <div class="flex flex-col items-center">
                    <a href="${project.url}" target="_blank">
                        <img src="${project.imgSrc}" alt="${project.alt}"
                            class="w-full h-12 md:h-12 md:w-full mb-2">
                    </a>
                    <h3 class="text-lg font-bold text-center">${project.name}</h3>
                    <p class="mt-2 text-center text-sm md:px-14">
                        ${project.description}
                    </p>
                </div>
            `;
            projectsContainer.appendChild(projectDiv);
        });
    }
});