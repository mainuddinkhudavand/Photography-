// Mainu Photography - Interaction Script

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggles
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

    // --- Gallery Filtering ---
    const filterButtons = document.querySelectorAll('.filter_btn');
    const galleryItems = document.querySelectorAll('.gallery_item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // --- Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox_img');
    const lightboxCaption = document.getElementById('lightbox_caption');
    const closeBtn = document.querySelector('.lightbox_close');
    const prevBtn = document.querySelector('.lightbox_prev');
    const nextBtn = document.querySelector('.lightbox_next');

    let currentImages = []; // Stores currently visible images for slider navigation
    let currentIndex = 0;

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get all currently visible images under the current filter
            currentImages = Array.from(galleryItems).filter(el => !el.classList.contains('hide'));
            currentIndex = currentImages.indexOf(item);

            showImage(item);
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; // Disable page scroll when lightbox is open
        });
    });

    // Display image and details
    function showImage(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('.category_tag').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `${title} <span style="color: #d4af37; margin-left: 10px;">|</span> <span style="font-size: 14px; opacity: 0.7; margin-left: 10px;">${category}</span>`;
    }

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto'; // Enable page scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation Controls
    const showNext = () => {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentImages[currentIndex]);
    };

    const showPrev = () => {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentImages[currentIndex]);
    };

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeLightbox();
    });
});
