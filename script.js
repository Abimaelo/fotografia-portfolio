// Script principal para el sitio web

// ====================================
// GLOBAL FUNCTIONS - Available immediately
// ====================================

// Global mobile menu function - Available from start
window.toggleMobileMenu = function() {
    console.log('Toggling mobile menu...');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        // Toggle active states
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        console.log('Mobile menu toggled successfully');
    } else {
        console.error('Menu elements not found');
    }
}

// Global gallery functions - Available from start
// Global gallery functions - Available from start
window.openGallery = function(title, images) {
    console.log('🎨 Opening gallery:', title, images);
    if (!images || !Array.isArray(images) || images.length === 0) {
        console.error('❌ No images provided for gallery');
        return;
    }
    
    // Remove existing modal if any
    const existingModal = document.querySelector('.gallery-modal');
    if (existingModal) {
        existingModal.remove();
        console.log('🗑️ Removed existing modal');
    }
    
    // Create modal for the gallery
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="gallery-content">
            <div class="gallery-header">
                <h2>${title}</h2>
                <button class="gallery-close" onclick="window.closeGallery()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="gallery-body">
                <button class="gallery-nav gallery-prev" onclick="window.prevImage()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <img id="gallery-main-image" src="${images[0]}" alt="${title}">
                <button class="gallery-nav gallery-next" onclick="window.nextImage()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="gallery-thumbnails">
                ${images.map((img, index) => `
                    <img src="${img}" alt="${title} ${index + 1}" onclick="window.showImage(${index})" class="${index === 0 ? 'active' : ''}">
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Store images and current index in the modal
    modal.dataset.images = JSON.stringify(images);
    modal.dataset.currentIndex = '0';
    
    console.log('✅ Gallery opened successfully with', images.length, 'images');
}

window.closeGallery = function() {
    console.log('❌ Closing gallery');
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        console.log('✅ Gallery closed successfully');
    } else {
        console.log('ℹ️ No gallery modal to close');
    }
}

window.nextImage = function() {
    console.log('➡️ Next image');
    const modal = document.querySelector('.gallery-modal');
    if (!modal) {
        console.error('❌ No gallery modal found');
        return;
    }
    
    const images = JSON.parse(modal.dataset.images);
    let currentIndex = parseInt(modal.dataset.currentIndex);
    
    currentIndex = (currentIndex + 1) % images.length;
    modal.dataset.currentIndex = currentIndex;
    
    window.showImage(currentIndex);
}

window.prevImage = function() {
    console.log('⬅️ Previous image');
    const modal = document.querySelector('.gallery-modal');
    if (!modal) {
        console.error('❌ No gallery modal found');
        return;
    }
    
    const images = JSON.parse(modal.dataset.images);
    let currentIndex = parseInt(modal.dataset.currentIndex);
    
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modal.dataset.currentIndex = currentIndex;
    
    window.showImage(currentIndex);
}

window.showImage = function(index) {
    console.log('🖼️ Showing image:', index);
    const modal = document.querySelector('.gallery-modal');
    if (!modal) {
        console.error('❌ No gallery modal found');
        return;
    }
    
    const images = JSON.parse(modal.dataset.images);
    const mainImage = document.getElementById('gallery-main-image');
    
    if (mainImage && images[index]) {
        mainImage.src = images[index];
        modal.dataset.currentIndex = index;
        
        // Update thumbnails
        document.querySelectorAll('.gallery-thumbnails img').forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        console.log('✅ Image updated to index', index);
    } else {
        console.error('❌ Image or mainImage not found', {mainImage, imagesLength: images ? images.length : 'no images'});
    }
}

// Global blog functions
window.openBlogPost = function(title, content, date) {
    console.log('Opening blog post:', title);
    if (!content) {
        console.error('No content provided for blog post');
        return;
    }
    
    // Remove existing modal if any
    const existingModal = document.querySelector('.blog-post-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal for the blog post
    const modal = document.createElement('div');
    modal.className = 'blog-post-modal';
    modal.innerHTML = `
        <div class="blog-post-content">
            <div class="blog-post-header">
                <h2>${title}</h2>
                <div class="blog-post-meta">
                    <time datetime="${date}">${date}</time>
                </div>
                <button class="blog-post-close" onclick="window.closeBlogPost()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="blog-post-body">
                <p>${content}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animation entry
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    console.log('Blog post opened successfully');
}

window.closeBlogPost = function() {
    console.log('Closing blog post');
    const modal = document.querySelector('.blog-post-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
            console.log('Blog post closed successfully');
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    loadSiteData();
    initSmoothScrolling();
    initContactForm();
    initMobileMenu();
    
    // Fix hero image flash issue - hide hero image initially
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transition = 'opacity 0.5s ease';
    }
    
    console.log('Initializations complete');
});

// Cargar datos del sitio desde JSON
async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        updatePageContent(data);
    } catch (error) {
        console.error('Error loading site data:', error);
    }
}

// Actualizar contenido de la página con los datos cargados
function updatePageContent(data) {
    // Título de la página
    document.getElementById('page-title').textContent = data.siteTitle;
    document.title = data.siteTitle;
    
    // Header
    document.getElementById('site-title').textContent = data.siteTitle;
    
    // Hero section
    if (data.hero) {
        document.getElementById('hero-title').textContent = data.hero.title;
        document.getElementById('hero-subtitle').textContent = data.hero.subtitle;
        document.getElementById('hero-cta').textContent = data.hero.ctaText;
        if (data.hero.image) {
            const heroImage = document.getElementById('hero-image');
            heroImage.src = data.hero.image;
            // Show image after it's loaded to prevent flash
            heroImage.onload = function() {
                this.style.opacity = '1';
            };
        }
    }
    
    // About section (photographer info)
    if (data.photographer) {
        document.getElementById('photographer-name').textContent = data.photographer.name;
        document.getElementById('photographer-specialty').textContent = data.photographer.specialty;
        document.getElementById('photographer-experience').textContent = data.photographer.experience;
        if (data.photographer.bio) {
            document.getElementById('photographer-bio').textContent = data.photographer.bio;
        }
        if (data.photographer.image) {
            document.getElementById('photographer-image').src = data.photographer.image;
        }
    }
    
    // Services
    if (data.services && data.services.length > 0) {
        renderServices(data.services);
    }
    
    // Portfolio
    if (data.portfolio && data.portfolio.length > 0) {
        renderPortfolio(data.portfolio);
    }
    
    // Blog posts
    if (data.blogPosts && data.blogPosts.length > 0) {
        renderBlogPosts(data.blogPosts);
    }
    
    // Contact info
    if (data.contact) {
        document.getElementById('contact-email').textContent = data.contact.email;
        document.getElementById('contact-phone').textContent = data.contact.phone;
        if (data.contact.address) {
            document.getElementById('contact-address').textContent = data.contact.address;
        }
        if (data.contact.studio) {
            document.getElementById('contact-studio').textContent = data.contact.studio;
        }
        if (data.contact.availability) {
            document.getElementById('contact-availability').textContent = data.contact.availability;
        }
    }
    
    // Footer
    const footerTitle = data.siteTitle || 'Mi Sitio Web';
    document.getElementById('footer-title').textContent = footerTitle;
    
    // Update copyright text from data
    if (data.meta?.copyright) {
        const copyrightElement = document.querySelector('.footer-bottom p');
        if (copyrightElement) {
            copyrightElement.textContent = data.meta.copyright;
        }
    }
    
    // Social media links
    if (data.socialMedia) {
        if (data.socialMedia.show) {
            // Control which social media links to show
            if (data.socialMedia.show.instagram && data.socialMedia.instagram) {
                document.getElementById('instagram-link').style.display = 'flex';
                document.getElementById('instagram-link').href = data.socialMedia.instagram;
            } else {
                document.getElementById('instagram-link').style.display = 'none';
            }
            
            if (data.socialMedia.show.facebook && data.socialMedia.facebook) {
                document.getElementById('facebook-link').style.display = 'flex';
                document.getElementById('facebook-link').href = data.socialMedia.facebook;
            } else {
                document.getElementById('facebook-link').style.display = 'none';
            }
            
            if (data.socialMedia.show.twitter && data.socialMedia.twitter) {
                document.getElementById('twitter-link').style.display = 'flex';
                document.getElementById('twitter-link').href = data.socialMedia.twitter;
            } else {
                document.getElementById('twitter-link').style.display = 'none';
            }
            
            if (data.socialMedia.show.linkedin && data.socialMedia.linkedin) {
                document.getElementById('linkedin-link').style.display = 'flex';
                document.getElementById('linkedin-link').href = data.socialMedia.linkedin;
            } else {
                document.getElementById('linkedin-link').style.display = 'none';
            }
            
            if (data.socialMedia.show.website && data.socialMedia.website) {
                document.getElementById('website-link').style.display = 'flex';
                document.getElementById('website-link').href = data.socialMedia.website;
            } else {
                document.getElementById('website-link').style.display = 'none';
            }
        } else {
            // Fallback to show all if no show control
            if (data.socialMedia.instagram) {
                document.getElementById('instagram-link').href = data.socialMedia.instagram;
            }
            if (data.socialMedia.facebook) {
                document.getElementById('facebook-link').href = data.socialMedia.facebook;
            }
            if (data.socialMedia.linkedin) {
                document.getElementById('linkedin-link').href = data.socialMedia.linkedin;
            }
        }
    }
}

// Renderizar servicios
function renderServices(services) {
    const container = document.getElementById('services-grid');
    container.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        `;
        container.appendChild(serviceCard);
    });
}

// Renderizar portfolio
function renderPortfolio(portfolioItems) {
    console.log('🖼️ Rendering portfolio with', portfolioItems.length, 'items');
    const container = document.getElementById('portfolio-grid');
    container.innerHTML = '';
    
    portfolioItems.forEach((item, index) => {
        console.log(`📸 Portfolio item ${index + 1}:`, {
            title: item.title,
            category: item.category,
            hasImages: !!item.images,
            imagesCount: item.images ? item.images.length : 0
        });
        
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        portfolioCard.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <button class="portfolio-btn" data-index="${index}" data-title="${item.title}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Ver Galería
                    </button>
                </div>
            </div>
            <div class="portfolio-info">
                <span class="portfolio-category">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        // Add click event listener with better debugging
        const portfolioBtn = portfolioCard.querySelector('.portfolio-btn');
        portfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Portfolio button clicked:', {
                title: item.title,
                index: index,
                images: item.images
            });
            
            if (!item.images || item.images.length === 0) {
                console.error('❌ No images found for portfolio item:', item.title);
                return;
            }
            
            window.openGallery(item.title, item.images);
        });
        
        // Add hover effect debugging
        portfolioBtn.addEventListener('mouseenter', () => {
            console.log('👆 Hovering over portfolio button:', item.title);
        });
        
        container.appendChild(portfolioCard);
    });
    
    console.log('✅ Portfolio rendered successfully with', portfolioItems.length, 'items');
}

// Renderizar posts del blog
function renderBlogPosts(posts) {
    const container = document.getElementById('blog-grid');
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'blog-card';
        
        const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        postCard.innerHTML = `
            <div class="blog-card-header">
                <time datetime="${post.date}">${formattedDate}</time>
            </div>
            <h3>${post.title}</h3>
            <p>${truncateText(post.content, 150)}</p>
            <a href="#" class="blog-link">Leer más →</a>
        `;
        
        // Add click event listener instead of inline onclick
        postCard.querySelector('.blog-link').addEventListener('click', (e) => {
            e.preventDefault();
            window.openBlogPost(post.title, post.content, formattedDate);
        });
        
        container.appendChild(postCard);
    });
}

// Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Scroll suave para navegación
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Excluir enlaces que ya tienen un onclick handler
        if (anchor.onclick) return;
        
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Manejo del formulario de contacto
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Crear mailto link (solución simple)
            const subject = encodeURIComponent(`Contacto desde ${name}`);
            const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
            const mailtoLink = `mailto:${document.getElementById('contact-email').textContent}?subject=${subject}&body=${body}`;
            
            // Abrir cliente de email
            window.location.href = mailtoLink;
            
            // Limpiar formulario
            form.reset();
            
            // Mostrar mensaje de confirmación
            showNotification('¡Mensaje preparado! Se abrirá tu cliente de email.');
        });
    }
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Animación de scroll para elementos
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos que necesitan animación
    document.querySelectorAll('.service-card, .portfolio-card, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Cerrar galería con ESC o click fuera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeGallery();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gallery-modal')) {
        window.closeGallery();
    }
});

// Cerrar modal del blog con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const blogModal = document.querySelector('.blog-post-modal');
        if (blogModal) {
            closeBlogPost();
        }
    }
});

// Inicializar animaciones cuando la página cargue
window.addEventListener('load', initScrollAnimations);

// ====================================
// REUSABLE FUNCTIONS
// ====================================

// Mobile menu functionality - WITHOUT addEventListener conflict
function initMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    
    if (navMenu) {
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                window.toggleMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const navToggle = document.getElementById('nav-toggle');
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                window.toggleMobileMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const navToggle = document.getElementById('nav-toggle');
                const navMenu = document.getElementById('nav-menu');
                if (navToggle && navMenu && navMenu.classList.contains('active')) {
                    window.toggleMobileMenu();
                }
            }
        });
    }
}

// Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Cerrar galería con ESC o click fuera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeGallery();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gallery-modal')) {
        window.closeGallery();
    }
});

// Cerrar modal del blog con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const blogModal = document.querySelector('.blog-post-modal');
        if (blogModal) {
            window.closeBlogPost();
        }
    });
});

// Initialize all effects
function initAllEffects() {
    initHeaderScrollEffect();
    initScrollAnimations();
    initParallaxEffect();
    initEnhancedHoverEffects();
    initTypingEffect();
    initNavReveal();
}

// Add loading screen
function initLoadingScreen() {
    const body = document.body;
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Cargando...</p>
        </div>
    `;
    
    // Add loader styles
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
            color: white;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid var(--color-accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    body.appendChild(loader);
    
    // Remove loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                body.removeChild(loader);
            }, 500);
        }, 1000);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
    initSmoothScrolling();
    initContactForm();
    initMobileMenu();
    initAllEffects();
    initLoadingScreen();
});

// Reusable animation and effect functions
function initTypingEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroTitle.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 2000);
    }
}

function initNavReveal() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.opacity = '0';
        nav.style.transform = 'translateY(-30px)';
        nav.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            nav.style.opacity = '1';
            nav.style.transform = 'translateY(0)';
        }, 1000);
    }
}

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            const rate = scrolled * -0.3;
            
            if (scrolled <= heroHeight) {
                const heroImg = hero.querySelector('img');
                if (heroImg) {
                    heroImg.style.transform = `translateY(${rate}px)`;
                }
            }
        });
    }
}

function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add delay to grid items
    const gridItems = document.querySelectorAll('.service-card, .portfolio-item, .blog-card');
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
}

function initEnhancedHoverEffects() {
    // Blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'grayscale(0%)';
                img.style.transform = 'scale(1.03)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'grayscale(100%)';
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Resize handler for responsive animations
window.addEventListener('resize', () => {
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});