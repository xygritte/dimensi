// Gallery Functionality
const galleryHeader = document.getElementById('galleryHeader');
const mainGalleryImage = document.getElementById('mainGalleryImage');
const galleryContainer = document.getElementById('galleryContainer');
const closeGallery = document.getElementById('closeGallery');
const currentImage = document.getElementById('currentImage');
const galleryItems = document.querySelectorAll('.gallery-item');
const imageOverlay = document.querySelector('.image-overlay');
const imageInfo = document.querySelector('.image-info');
const imageCounter = document.querySelector('.image-counter');

let currentImageIndex = 0;
let isGalleryExpanded = false;
let rotationInterval;
let images = [];

// Initialize gallery
function initGallery() {
    // Extract images from HTML gallery items
    extractImagesFromHTML();
    
    // Set initial image
    updateMainImage(0);
    
    // Start auto-rotation
    startAutoRotation();
    
    // Add event listeners
    setupEventListeners();
}

// Extract image data from HTML elements
function extractImagesFromHTML() {
    images = [];
    
    galleryItems.forEach((item, index) => {
        const imgElement = item.querySelector('img');
        const title = item.getAttribute('data-title') || `Image ${index + 1}`;
        const description = item.getAttribute('data-description') || 'DIMENSI Band Performance';
        
        if (imgElement) {
            images.push({
                src: imgElement.src,
                title: title,
                description: description
            });
        }
    });
    
    // If no gallery items found, use the main image
    if (images.length === 0 && currentImage) {
        images.push({
            src: currentImage.src,
            title: 'DIMENSI Band',
            description: 'UKM Musik UNIDA'
        });
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Expand gallery when header or main image is clicked
    if (galleryHeader) {
        galleryHeader.addEventListener('click', expandGallery);
    }
    
    if (mainGalleryImage) {
        mainGalleryImage.addEventListener('click', expandGallery);
    }
    
    // Close gallery
    if (closeGallery) {
        closeGallery.addEventListener('click', closeGalleryView);
    }
    
    // Gallery item clicks
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => selectGalleryItem(index));
    });
    
    // Pause rotation on hover
    if (mainGalleryImage) {
        mainGalleryImage.addEventListener('mouseenter', pauseAutoRotation);
        mainGalleryImage.addEventListener('mouseleave', startAutoRotation);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close gallery when clicking outside
    document.addEventListener('click', handleOutsideClick);
}

// Update main image with fade effect
function updateMainImage(index) {
    if (index < 0 || index >= images.length) return;
    
    currentImageIndex = index;
    const imageData = images[index];
    
    if (!currentImage) return;
    
    // Fade out current image
    currentImage.style.opacity = '0';
    
    setTimeout(() => {
        // Update image source and alt text
        currentImage.src = imageData.src;
        currentImage.alt = imageData.title;
        
        // Update overlay information if it exists
        if (imageInfo) {
            imageInfo.innerHTML = `
                <h3>${imageData.title}</h3>
                <p>${imageData.description}</p>
            `;
        }
        
        // Update counter if it exists
        if (imageCounter) {
            imageCounter.textContent = `${index + 1}/${images.length}`;
        }
        
        // Fade in new image
        currentImage.style.opacity = '1';
        
        // Update active state in gallery items
        updateActiveGalleryItem(index);
        
    }, 300);
}

// Update active state of gallery items
function updateActiveGalleryItem(activeIndex) {
    galleryItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Expand gallery to show all images
function expandGallery() {
    if (isGalleryExpanded) return;
    
    isGalleryExpanded = true;
    
    // Show gallery container
    if (galleryContainer) {
        galleryContainer.classList.add('expanded');
    }
    
    if (closeGallery) {
        closeGallery.classList.add('visible');
    }
    
    // Hide main view elements
    if (galleryHeader) {
        galleryHeader.style.display = 'none';
    }
    
    if (mainGalleryImage) {
        mainGalleryImage.style.display = 'none';
    }
    
    // Pause auto-rotation
    pauseAutoRotation();
    
    // Smooth scroll to gallery section
    const gallerySection = document.getElementById('gallery');
    const header = document.querySelector('header');
    
    if (gallerySection && header) {
        const headerHeight = header.offsetHeight;
        const scrollPosition = gallerySection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }
    
    // Add escape key handler
    document.addEventListener('keydown', handleEscapeKey);
}

// Close gallery view
function closeGalleryView() {
    if (!isGalleryExpanded) return;
    
    isGalleryExpanded = false;
    
    // Hide gallery container
    if (galleryContainer) {
        galleryContainer.classList.remove('expanded');
    }
    
    if (closeGallery) {
        closeGallery.classList.remove('visible');
    }
    
    // Show main view elements
    if (galleryHeader) {
        galleryHeader.style.display = 'block';
    }
    
    if (mainGalleryImage) {
        mainGalleryImage.style.display = 'block';
    }
    
    // Resume auto-rotation
    startAutoRotation();
    
    // Remove escape key handler
    document.removeEventListener('keydown', handleEscapeKey);
}

// Select gallery item and set as main image
function selectGalleryItem(index) {
    updateMainImage(index);
    closeGalleryView();
}

// Auto-rotation functions
function startAutoRotation() {
    if (isGalleryExpanded || images.length <= 1) return;
    
    pauseAutoRotation(); // Clear any existing interval
    
    rotationInterval = setInterval(() => {
        const nextIndex = (currentImageIndex + 1) % images.length;
        updateMainImage(nextIndex);
    }, 5000);
}

function pauseAutoRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    if (!isGalleryExpanded) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateGallery(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateGallery(1);
            break;
        case 'Escape':
            e.preventDefault();
            closeGalleryView();
            break;
    }
}

function navigateGallery(direction) {
    let newIndex = currentImageIndex + direction;
    
    if (newIndex < 0) {
        newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
        newIndex = 0;
    }
    
    updateMainImage(newIndex);
}

// Escape key handler for expanded gallery
function handleEscapeKey(e) {
    if (e.key === 'Escape' && isGalleryExpanded) {
        closeGalleryView();
    }
}

// Close gallery when clicking outside
function handleOutsideClick(e) {
    if (!isGalleryExpanded) return;
    
    const isClickInsideGallery = (galleryContainer && galleryContainer.contains(e.target)) || 
                                (closeGallery && closeGallery.contains(e.target));
    
    if (!isClickInsideGallery) {
        closeGalleryView();
    }
}

// Preload images for better performance
function preloadImages() {
    images.forEach(imageData => {
        const img = new Image();
        img.src = imageData.src;
    });
}

// Mobile swipe support
function setupSwipeSupport() {
    if (!mainGalleryImage) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    mainGalleryImage.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    mainGalleryImage.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                navigateGallery(1);
            } else {
                // Swipe right - previous image
                navigateGallery(-1);
            }
        }
    }
}

// Refresh gallery when images change (call this if you dynamically add images)
function refreshGallery() {
    extractImagesFromHTML();
    updateMainImage(0);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    if (mobileMenu && navUl) {
        mobileMenu.addEventListener('click', function() {
            navUl.classList.toggle('show');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('show');
            });
        });
    }
}

// Music player functionality
function initMusicPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                // Add actual play functionality here
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                // Add actual pause functionality here
            }
        });
    }
    
    if (playlistItems.length > 0) {
        playlistItems.forEach(item => {
            item.addEventListener('click', function() {
                playlistItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Update player with selected track info
                const trackTitle = this.querySelector('h4').textContent;
                const trackInfo = document.querySelector('.track-info h3');
                if (trackInfo) {
                    trackInfo.textContent = trackTitle;
                }
                
                // Reset play button to play icon
                const playIcon = document.querySelector('.play-btn i');
                if (playIcon) {
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                }
            });
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                const navUl = document.querySelector('nav ul');
                if (navUl && navUl.classList.contains('show')) {
                    navUl.classList.remove('show');
                }
            }
        });
    });
}

// Form submission handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
function initResponsiveBehavior() {
    window.addEventListener('resize', debounce(function() {
        // Adjust gallery layout if needed
        if (isGalleryExpanded) {
            // Recalculate any responsive layouts
        }
    }, 250));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
    
    // Preload images
    preloadImages();
    
    // Setup mobile swipe support
    setupSwipeSupport();
    
    // Initialize other components
    initMobileMenu();
    initMusicPlayer();
    initSmoothScrolling();
    initContactForm();
    initScrollToTop();
    initResponsiveBehavior();
});

// Make refreshGallery available globally for dynamic updates
window.refreshGallery = refreshGallery;