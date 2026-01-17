/**
 * Gallery functionality for Verhoost Photography Portfolio
 *
 * Usage: In your gallery HTML, include this script and set the gallery config:
 *
 * <script>
 *   window.galleryConfig = {
 *     folder: 'lichtstudio',
 *     prefix: 'PE1_Verhoost_Daan_Internet-',
 *     count: 5
 *   };
 * </script>
 * <script src="../js/gallery.js"></script>
 */

(function() {
    'use strict';

    // Get config from window
    const config = window.galleryConfig;

    if (!config) {
        console.error('Gallery config not found. Please set window.galleryConfig before loading this script.');
        return;
    }

    const { folder, prefix, count } = config;
    const photoScroll = document.querySelector('.photo-scroll');
    const progressBar = document.querySelector('.progress-bar');
    const counter = document.getElementById('current');
    const totalElement = document.getElementById('total');

    // Update total count
    if (totalElement) {
        totalElement.textContent = count;
    }

    // Clear existing content
    photoScroll.innerHTML = '';
    progressBar.innerHTML = '';

    // Create photo containers and progress dots
    for (let i = 0; i < count; i++) {
        // Create photo container
        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-container';
        photoContainer.dataset.index = i;

        // Create image
        const img = document.createElement('img');
        img.src = `../images/${folder}/${prefix}${i + 1}.jpg`;
        img.alt = `Foto ${i + 1}`;
        img.loading = i === 0 ? 'eager' : 'lazy';

        photoContainer.appendChild(img);

        // Add scroll hint to first photo
        if (i === 0) {
            const scrollHint = document.createElement('div');
            scrollHint.className = 'scroll-hint';
            scrollHint.innerHTML = `
                <span class="scroll-hint-icon"></span>
                Scroll
            `;
            photoContainer.appendChild(scrollHint);
        }

        photoScroll.appendChild(photoContainer);

        // Create progress dot
        const dot = document.createElement('span');
        dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        progressBar.appendChild(dot);
    }

    // Get references to newly created elements
    const photos = document.querySelectorAll('.photo-container');
    const dots = document.querySelectorAll('.progress-dot');
    const scrollHint = document.querySelector('.scroll-hint');

    // Intersection Observer for scroll tracking
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index);

                // Update counter
                if (counter) {
                    counter.textContent = index + 1;
                }

                // Update dots
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });

                // Hide scroll hint after first scroll
                if (index > 0 && scrollHint) {
                    scrollHint.style.opacity = '0';
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all photos
    photos.forEach(photo => observer.observe(photo));

    // Click dots to navigate
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            photos[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentIndex = parseInt(counter?.textContent || 1) - 1;

        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            if (currentIndex < count - 1) {
                photos[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                photos[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'Escape') {
            window.location.href = '../index.html';
        }
    });

})();
