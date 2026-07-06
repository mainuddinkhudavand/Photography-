// Mainu Photography - Interaction Script

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Toggles ---
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

    // --- Dynamic Gallery & Filtering ---
    const galleryGrid = document.querySelector('.gallery_grid');
    const filterButtons = document.querySelectorAll('.filter_btn');

    const defaultPhotos = [
        { title: "Misty Mountains", src: "gallery_nature.png", category: "nature" },
        { title: "Golden Hour Portrait", src: "gallery_portrait.png", category: "portrait" },
        { title: "Neon Shadows", src: "gallery_street.png", category: "street" },
        { title: "Concrete Symmetry", src: "gallery_architecture.png", category: "architecture" }
    ];

    const loadGallery = () => {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        const customPhotos = JSON.parse(localStorage.getItem('photography_custom_photos')) || [];
        const allPhotos = [...defaultPhotos, ...customPhotos];

        allPhotos.forEach((photo, idx) => {
            const item = document.createElement('div');
            item.className = 'gallery_item';
            item.setAttribute('data-category', photo.category);
            item.innerHTML = `
                <img src="${photo.src}" alt="${photo.title}">
                <div class="gallery_overlay">
                    <h3>${photo.title}</h3>
                    <span class="category_tag">${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}</span>
                </div>
            `;

            // Open Lightbox on click
            item.addEventListener('click', () => {
                const activeFilter = document.querySelector('.filter_btn.active').getAttribute('data-filter');
                const visibleItems = Array.from(galleryGrid.querySelectorAll('.gallery_item')).filter(el => {
                    const cat = el.getAttribute('data-category');
                    return activeFilter === 'all' || cat === activeFilter;
                });
                
                currentIndex = visibleItems.indexOf(item);
                currentImages = visibleItems;

                showImage(item);
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            });

            galleryGrid.appendChild(item);
        });

        applyFilter();
    };

    const applyFilter = () => {
        const activeBtn = document.querySelector('.filter_btn.active');
        if (!activeBtn) return;
        const filterValue = activeBtn.getAttribute('data-filter');
        const items = galleryGrid.querySelectorAll('.gallery_item');

        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilter();
        });
    });

    // --- Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox_img');
    const lightboxCaption = document.getElementById('lightbox_caption');
    const closeBtn = document.querySelector('.lightbox_close');
    const prevBtn = document.querySelector('.lightbox_prev');
    const nextBtn = document.querySelector('.lightbox_next');

    let currentImages = []; 
    let currentIndex = 0;

    function showImage(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('.category_tag').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `${title} <span style="color: #d4af37; margin-left: 10px;">|</span> <span style="font-size: 14px; opacity: 0.7; margin-left: 10px;">${category}</span>`;
    }

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

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

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

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

        const buyBtn = card.querySelector('.store_btn_buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                const img = card.getAttribute('data-img');
                const title = card.getAttribute('data-title');
                const size = sizeSelect.value;
                const finish = card.querySelector('.print_finish').value;
                const price = priceDisplay.textContent;

                document.getElementById('checkout_summary_img').src = img;
                document.getElementById('checkout_summary_title').textContent = title;
                document.getElementById('checkout_summary_size').textContent = size;
                document.getElementById('checkout_summary_finish').textContent = finish.charAt(0).toUpperCase() + finish.slice(1);
                document.getElementById('checkout_summary_total').textContent = price;

                checkoutForm.reset();
                checkoutForm.classList.remove('hide');
                checkoutSuccess.classList.remove('show');

                checkoutModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    const closeCheckout = () => {
        checkoutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckout();
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            checkoutForm.classList.add('hide');
            checkoutSuccess.classList.add('show');
        });
    }

    // --- Booking Form Submission ---
    const bookingForm = document.getElementById('booking_form');
    const bookingSuccessAlert = document.getElementById('booking_success_alert');
    const bookingDateInput = document.getElementById('booking_date');

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

    const loadReviews = () => {
        if (!reviewsListContainer) return;
        
        let storedReviews = localStorage.getItem('photography_reviews');
        let reviews = storedReviews ? JSON.parse(storedReviews) : defaultReviews;

        if (!storedReviews) {
            localStorage.setItem('photography_reviews', JSON.stringify(defaultReviews));
        }

        reviewsListContainer.innerHTML = '';

        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review_card';

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                starsHTML += i <= review.rating ? '<i class="fa-solid fa-star"></i> ' : '<i class="fa-regular fa-star"></i> ';
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

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }

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
            storedReviews.unshift(newReview);
            localStorage.setItem('photography_reviews', JSON.stringify(storedReviews));

            loadReviews();
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

    // --- Dynamic Exhibits & Sub-Galleries ---
    const exhibitsContainer = document.querySelector('.exhibits_container');
    const exhibitModal = document.getElementById('exhibit_modal');
    const exhibitModalClose = document.querySelector('.exhibit_modal_close');
    const exhibitModalTitle = document.getElementById('exhibit_modal_title');
    const exhibitModalDesc = document.getElementById('exhibit_modal_desc');
    const exhibitModalGrid = document.getElementById('exhibit_modal_grid');

    const defaultExhibits = [
        {
            title: "Neon Reflections",
            date: "October 12 - November 5, 2026",
            desc: "A solo exhibition exploring the night streets of Tokyo and the intersection of artificial light and urban solitude.",
            loc: "City Arts Gallery, NY",
            img: "gallery_street.png",
            photos: [
                { src: "gallery_street.png", title: "Cyber Tokyo Night", category: "Street" },
                { src: "gallery_architecture.png", title: "Geometric Neon", category: "Street" },
                { src: "gallery_portrait.png", title: "Reflected Glow", category: "Street" },
                { src: "gallery_nature.png", title: "Urban Mist", category: "Street" }
            ]
        },
        {
            title: "Silence of the Pines",
            date: "December 1 - December 20, 2026",
            desc: "A landscape exhibition focusing on the quiet majesty of northern mountain ranges during early winter mornings.",
            loc: "The Exposure Room, LA",
            img: "gallery_nature.png",
            photos: [
                { src: "gallery_nature.png", title: "Misty Sunrise", category: "Nature" },
                { src: "gallery_architecture.png", title: "Mountain Cabin", category: "Nature" },
                { src: "gallery_portrait.png", title: "Solitude in Woods", category: "Nature" },
                { src: "gallery_street.png", title: "Snowy Pine Trail", category: "Nature" }
            ]
        }
    ];

    const loadExhibits = () => {
        if (!exhibitsContainer) return;
        exhibitsContainer.innerHTML = '';

        const customExhibits = JSON.parse(localStorage.getItem('photography_custom_exhibits')) || [];
        const allExhibits = [...defaultExhibits, ...customExhibits];

        allExhibits.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exhibit_card';
            card.innerHTML = `
                <div class="exhibit_img">
                    <img src="${ex.img}" alt="${ex.title}">
                </div>
                <div class="exhibit_info">
                    <span class="exhibit_date">${ex.date}</span>
                    <h3>${ex.title}</h3>
                    <p>${ex.desc}</p>
                    <span class="exhibit_loc"><i class="fa-solid fa-location-dot"></i> ${ex.loc}</span>
                </div>
            `;

            // Open sub-gallery modal on click
            card.addEventListener('click', () => {
                if (!exhibitModal) return;
                exhibitModalTitle.textContent = ex.title;
                exhibitModalDesc.textContent = ex.desc;
                exhibitModalGrid.innerHTML = '';

                const photos = ex.photos || [
                    { src: ex.img, title: `${ex.title} Frame 1`, category: "Custom" },
                    { src: "gallery_nature.png", title: `${ex.title} Frame 2`, category: "Custom" },
                    { src: "gallery_street.png", title: `${ex.title} Frame 3`, category: "Custom" },
                    { src: "gallery_portrait.png", title: `${ex.title} Frame 4`, category: "Custom" }
                ];

                photos.forEach((photo, idx) => {
                    const item = document.createElement('div');
                    item.className = 'exhibit_modal_item';
                    item.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;

                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImages = photos.map(ph => {
                            const mockItem = document.createElement('div');
                            mockItem.innerHTML = `
                                <img src="${ph.src}">
                                <h3>${ph.title}</h3>
                                <span class="category_tag">${ph.category}</span>
                            `;
                            return mockItem;
                        });
                        currentIndex = idx;
                        showImage(currentImages[currentIndex]);
                        lightbox.classList.add('show');
                        document.body.style.overflow = 'hidden';
                    });

                    exhibitModalGrid.appendChild(item);
                });

                exhibitModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });

            exhibitsContainer.appendChild(card);
        });
    };

    const closeExhibitModal = () => {
        if (exhibitModal) {
            exhibitModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };

    if (exhibitModalClose) exhibitModalClose.addEventListener('click', closeExhibitModal);
    if (exhibitModal) {
        exhibitModal.addEventListener('click', (e) => {
            if (e.target === exhibitModal) {
                closeExhibitModal();
            }
        });
    }

    // --- Admin Panel Forms Handling ---
    const adminPhotoForm = document.getElementById('admin_photo_form');
    const adminPhotoSuccess = document.getElementById('admin_photo_success');
    const adminExhibitForm = document.getElementById('admin_exhibit_form');
    const adminExhibitSuccess = document.getElementById('admin_exhibit_success');

    if (adminPhotoForm) {
        adminPhotoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('admin_photo_title').value;
            const category = document.getElementById('admin_photo_category').value;
            const preset = document.getElementById('admin_photo_preset').value;

            const newPhoto = { title, category, src: preset };

            const customPhotos = JSON.parse(localStorage.getItem('photography_custom_photos')) || [];
            customPhotos.push(newPhoto);
            localStorage.setItem('photography_custom_photos', JSON.stringify(customPhotos));

            loadGallery();
            adminPhotoForm.reset();

            adminPhotoSuccess.classList.add('show');
            setTimeout(() => {
                adminPhotoSuccess.classList.remove('show');
            }, 3000);
        });
    }

    if (adminExhibitForm) {
        adminExhibitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('admin_exhibit_title').value;
            const date = document.getElementById('admin_exhibit_date').value;
            const loc = document.getElementById('admin_exhibit_loc').value;
            const desc = document.getElementById('admin_exhibit_desc').value;

            const presets = ["gallery_street.png", "gallery_nature.png", "gallery_portrait.png", "gallery_architecture.png"];
            const randomCover = presets[Math.floor(Math.random() * presets.length)];

            const newExhibit = { title, date, loc, desc, img: randomCover };

            const customExhibits = JSON.parse(localStorage.getItem('photography_custom_exhibits')) || [];
            customExhibits.push(newExhibit);
            localStorage.setItem('photography_custom_exhibits', JSON.stringify(customExhibits));

            loadExhibits();
            adminExhibitForm.reset();

            adminExhibitSuccess.classList.add('show');
            setTimeout(() => {
                adminExhibitSuccess.classList.remove('show');
            }, 3000);
        });
    }

    // --- Initial Load ---
    loadGallery();
    loadExhibits();
    loadReviews();
});
