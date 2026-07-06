// Mainu Photography - Interaction Script

document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check');
    const menuLinks = document.querySelectorAll('.sidebar_menu .menu a');
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.sidebar_menu .menu li');

    // Close sidebar when a navigation link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (checkBtn) {
                checkBtn.checked = false;
            }
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        menuItems.forEach(li => {
            li.classList.remove('active');
            const href = li.querySelector('a').getAttribute('href');
            if (href === `#${current}`) {
                li.classList.add('active');
            }
        });
    });
});
