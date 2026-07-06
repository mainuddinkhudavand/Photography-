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
    // --- Print Store & Checkout Simulation ---
    const storeCards = document.querySelectorAll('.store_card');
    const checkoutModal = document.getElementById('checkout_modal');
    const checkoutClose = document.querySelector('.checkout_close');
    const checkoutForm = document.getElementById('checkout_form');
    const checkoutSuccess = document.getElementById('checkout_success');

    // Dynamic price updating based on size selection
    storeCards.forEach(card => {
        const sizeSelect = card.querySelector('.print_size');
        const priceDisplay = card.querySelector('.store_price');

        if (sizeSelect && priceDisplay) {
            sizeSelect.addEventListener('change', () => {
                const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
                const price = selectedOption.getAttribute('data-price');
                priceDisplay.textContent = `$${price}`;
            });
        }

        // Open checkout modal on "Buy Print" click
        const buyBtn = card.querySelector('.store_btn_buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                const img = card.getAttribute('data-img');
                const title = card.getAttribute('data-title');
                const size = sizeSelect.value;
                const finish = card.querySelector('.print_finish').value;
                const price = priceDisplay.textContent;

                // Set modal summary data
                document.getElementById('checkout_summary_img').src = img;
                document.getElementById('checkout_summary_title').textContent = title;
                document.getElementById('checkout_summary_size').textContent = size;
                document.getElementById('checkout_summary_finish').textContent = finish.charAt(0).toUpperCase() + finish.slice(1);
                document.getElementById('checkout_summary_total').textContent = price;

                // Reset form state
                checkoutForm.reset();
                checkoutForm.classList.remove('hide');
                checkoutSuccess.classList.remove('show');

                // Show modal
                checkoutModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Close checkout modal
    const closeCheckout = () => {
        checkoutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckout();
            }
        });
    }

    // Submit checkout form simulation
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            checkoutForm.classList.add('hide');
            checkoutSuccess.classList.add('show');
        });
    // --- Booking Form Submission ---
    const bookingForm = document.getElementById('booking_form');
    const bookingSuccessAlert = document.getElementById('booking_success_alert');
    const bookingDateInput = document.getElementById('booking_date');

    // Prevent past dates in date picker
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.min = today;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            bookingForm.classList.add('hide');
            bookingSuccessAlert.classList.add('show');
        });
    }

    // --- Star Rating Input ---
    const starInputContainer = document.querySelector('.star_rating_input');
    let selectedRating = 5;

    if (starInputContainer) {
        const stars = starInputContainer.querySelectorAll('i');
        
        // Highlight stars up to selected value
        const highlightStars = (rating) => {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('fa-regular');
                    star.classList.add('fa-solid', 'selected');
                } else {
                    star.classList.remove('fa-solid', 'selected');
                    star.classList.add('fa-regular');
                }
            });
        };

        // Initialize with default 5 stars selected
        highlightStars(selectedRating);

        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-rating'));
                highlightStars(selectedRating);
            });

            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.getAttribute('data-rating'));
                highlightStars(hoverRating);
            });
        });

        starInputContainer.addEventListener('mouseleave', () => {
            highlightStars(selectedRating);
        });
    }

    // --- LocalStorage Guestbook Reviews ---
    const feedbackForm = document.getElementById('feedback_form');
    const reviewsListContainer = document.getElementById('reviews_list');

    const defaultReviews = [
        {
            name: "Emily Jenkins",
            rating: 5,
            comment: "Absolutely in love with our wedding photoshoot. Mainu has an incredible eye for capturing raw emotions and perfect lighting. Highly recommend!",
            date: "June 15, 2026"
        },
        {
            name: "Marcus Vance",
            rating: 5,
            comment: "Great experience working together on our product launch photography. Professional, fast turnaround, and stunning results that elevated our brand.",
            date: "May 28, 2026"
        },
        {
            name: "Sarah Lin",
            rating: 4,
            comment: "Loved the portrait session! The lighting was gorgeous, and she made me feel super comfortable in front of the camera. Will book again.",
            date: "May 10, 2026"
        }
    ];

    // Load and Render Reviews
    const loadReviews = () => {
        if (!reviewsListContainer) return;
        
        let storedReviews = localStorage.getItem('photography_reviews');
        let reviews = [];

        if (storedReviews) {
            reviews = JSON.parse(storedReviews);
        } else {
            // Setup default reviews on first load
            reviews = defaultReviews;
            localStorage.setItem('photography_reviews', JSON.stringify(reviews));
        }

        reviewsListContainer.innerHTML = '';

        // Render reviews in reverse chronological order (newest first)
        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review_card';

            // Star icons generation
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHTML += '<i class="fa-solid fa-star"></i> ';
                } else {
                    starsHTML += '<i class="fa-regular fa-star"></i> ';
                }
            }

            card.innerHTML = `
                <div class="review_header">
                    <h4>${escapeHTML(review.name)}</h4>
                    <div class="review_stars">${starsHTML}</div>
                </div>
                <div class="review_date">${review.date}</div>
                <div class="review_text">${escapeHTML(review.comment)}</div>
            `;

            reviewsListContainer.appendChild(card);
        });
    };

    // Helper to escape HTML tags to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Submit new review
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('reviewer_name');
            const commentInput = document.getElementById('reviewer_comment');

            const newReview = {
                name: nameInput.value,
                rating: selectedRating,
                comment: commentInput.value,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };

            let storedReviews = JSON.parse(localStorage.getItem('photography_reviews')) || defaultReviews;
            storedReviews.unshift(newReview); // Add to the top of the list
            localStorage.setItem('photography_reviews', JSON.stringify(storedReviews));

            // Reload reviews list
            loadReviews();

            // Reset form
            feedbackForm.reset();
            selectedRating = 5;
            if (starInputContainer) {
                const stars = starInputContainer.querySelectorAll('i');
                stars.forEach(star => {
                    star.classList.remove('fa-regular');
                    star.classList.add('fa-solid', 'selected');
                });
            }
        });
    }

    // --- Services "Book Now" Button Linker ---
    const serviceButtons = document.querySelectorAll('.service_card .service_btn');
    const bookingTypeSelect = document.getElementById('booking_type');

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service_card');
            const serviceName = card.querySelector('h3').textContent.trim();

            if (bookingTypeSelect) {
                if (serviceName.includes('Portrait')) {
                    bookingTypeSelect.value = 'portrait';
                } else if (serviceName.includes('Wedding')) {
                    bookingTypeSelect.value = 'wedding';
                } else if (serviceName.includes('Commercial')) {
                    bookingTypeSelect.value = 'commercial';
                }
            }
        });
    });

    // Initial Load
    loadReviews();
});
