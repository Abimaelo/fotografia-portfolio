// Script principal para el sitio web
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
        const copyrightElement = document.getElementById('copyright-text');
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
    const container = document.getElementById('portfolio-grid');
    container.innerHTML = '';
    
    portfolioItems.forEach(item => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        portfolioCard.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <button class="portfolio-btn" onclick="openGallery('${item.title}', ${JSON.stringify(item.images).replace(/"/g, '&quot;')})">
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
        container.appendChild(portfolioCard);
    });
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
            <a href="#" class="blog-link" onclick="openBlogPost('${post.title}', ${JSON.stringify(post.content).replace(/"/g, '&quot;')}, '${formattedDate}'); return false;">Leer más →</a>
        `;
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

// Abrir galería de imágenes
window.openGallery = function(title, images) {
    // Crear modal para la galería
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="gallery-content">
            <div class="gallery-header">
                <h2>${title}</h2>
                <button class="gallery-close" onclick="closeGallery()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="gallery-body">
                <button class="gallery-nav gallery-prev" onclick="prevImage()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <img id="gallery-main-image" src="${images[0]}" alt="${title}">
                <button class="gallery-nav gallery-next" onclick="nextImage()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="gallery-thumbnails">
                ${images.map((img, index) => `
                    <img src="${img}" alt="${title} ${index + 1}" onclick="showImage(${index})" class="${index === 0 ? 'active' : ''}">
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Almacenar imágenes en el modal
    modal.dataset.images = JSON.stringify(images);
    modal.dataset.currentIndex = '0';
}

window.closeGallery = function() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function nextImage() {
    const modal = document.querySelector('.gallery-modal');
    if (!modal) return;
    
    const images = JSON.parse(modal.dataset.images);
    let currentIndex = parseInt(modal.dataset.currentIndex);
    
    currentIndex = (currentIndex + 1) % images.length;
    modal.dataset.currentIndex = currentIndex;
    
    showImage(currentIndex);
}

function prevImage() {
    const modal = document.querySelector('.gallery-modal');
    if (!modal) return;
    
    const images = JSON.parse(modal.dataset.images);
    let currentIndex = parseInt(modal.dataset.currentIndex);
    
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modal.dataset.currentIndex = currentIndex;
    
    showImage(currentIndex);
}

function showImage(index) {
    const modal = document.querySelector('.gallery-modal');
    if (!modal) return;
    
    const images = JSON.parse(modal.dataset.images);
    const mainImage = document.getElementById('gallery-main-image');
    if (mainImage) {
        mainImage.src = images[index];
    }
    modal.dataset.currentIndex = index;
    
    // Actualizar thumbnails
    document.querySelectorAll('.gallery-thumbnails img').forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

// Make functions global
window.nextImage = nextImage;
window.prevImage = prevImage;
window.showImage = showImage;

// Cerrar galería con ESC o click fuera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGallery();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gallery-modal')) {
        closeGallery();
    }
});

// Abrir post del blog en modal
window.openBlogPost = function(title, content, date) {
    // Crear modal para el post del blog
    const modal = document.createElement('div');
    modal.className = 'blog-post-modal';
    modal.innerHTML = `
        <div class="blog-post-content">
            <div class="blog-post-header">
                <h2>${title}</h2>
                <div class="blog-post-meta">
                    <time datetime="${date}">${date}</time>
                </div>
                <button class="blog-post-close" onclick="closeBlogPost()">
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
    
    // Animación de entrada
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeBlogPost() {
    const modal = document.querySelector('.blog-post-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

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
// SQUARESPACE-INSPIRED ANIMATIONS
// ====================================

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Smooth scroll animations
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('section, .service-card, .portfolio-item, .blog-card, .stat-item');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Add stagger effect to grid items
    const gridItems = document.querySelectorAll('.services-grid .service-card, .portfolio-grid .portfolio-item, .blog-grid .blog-card');
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Parallax effect for hero
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Enhanced hover effects
function initEnhancedHoverEffects() {
    // Portfolio hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Typing effect for hero title (removed duplicate)

// Smooth reveal for navigation
function initNavReveal() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.opacity = '0';
        nav.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            nav.style.transition = 'all 0.8s ease';
            nav.style.opacity = '1';
            nav.style.transform = 'translateY(0)';
        }, 300);
    }
}

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
    initAllEffects();
    initLoadingScreen();
});

// ====================================
// BRING ME SOMEWHERE NICE INSPIRED ENHANCEMENTS
// ====================================

// Efectos específicos para diseño monocromático
function initImageFilterEffects() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Añadir clase para el efecto de escala de grises
        img.classList.add('monochrome-image');
        
        // Efecto hover para remover escala de grises
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'grayscale(0%)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
}

// Animaciones mejoradas para tarjetas de servicios
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Añadir delay escalonado para aparecer
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            
            // Animar el icono
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'var(--color-white)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.background = 'var(--color-light-gray)';
            }
        });
    });
}

// Animaciones mejoradas para portfolio
function initPortfolioHoverAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        // Efecto hover elegante
        item.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.portfolio-overlay');
            
            if (img) {
                img.style.filter = 'grayscale(0%) brightness(1.1)';
                img.style.transform = 'scale(1.05)';
            }
            
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.portfolio-overlay');
            
            if (img) {
                img.style.filter = 'grayscale(100%)';
                img.style.transform = 'scale(1)';
            }
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// Efecto de escritura mejorado para el hero
function initTypingEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Obtener el texto actual
        const text = heroTitle.textContent;
        
        // Si ya hay texto, no aplicar el efecto de typing para evitar duplicación
        if (text && text.trim() !== '') {
            // Solo aplicar fade-in effect en lugar de typing
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(20px)';
            heroTitle.style.transition = 'all 1s ease-out';
            
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 2000);
        }
    }
}

// Revelado suave de navegación
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

// Efecto parallax suave para hero
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

// Efecto de scroll para el header
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

// Animaciones de aparición para elementos
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
    
    // Observar elementos con animaciones
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Añadir delay escalonado a elementos de grilla
    const gridItems = document.querySelectorAll('.service-card, .portfolio-item, .blog-card');
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
}

// Efectos hover mejorados
function initEnhancedHoverEffects() {
    // Efectos para blog cards
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
    // Reinitialize scroll animations on resize
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});

// Abrir galería de portfolio
window.openGallery = function(title, images) {
    console.log('🎨 Abriendo galería:', title);
    console.log('🖼️ Imágenes:', images);
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div class="gallery-content" style="
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        ">
            <div class="gallery-header" style="
                padding: 20px;
                background: #333;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0;">${title}</h3>
                <button class="gallery-close" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
            <div class="gallery-body" style="
                position: relative;
                width: 100%;
                height: calc(90vh - 80px);
                overflow: hidden;
            ">
                <img class="gallery-current" src="" alt="${title}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                ">
                <button class="gallery-prev" style="
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 24px;
                    padding: 15px;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">‹</button>
                <button class="gallery-next" style="
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 24px;
                    padding: 15px;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">›</button>
            </div>
        </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(modal);
    
    // Mostrar con animación
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Configurar navegación de imágenes
    let currentIndex = 0;
    const imageArray = JSON.parse(images.replace(/&quot;/g, '"'));
    const currentImage = modal.querySelector('.gallery-current');
    
    function showImage(index) {
        if (imageArray && imageArray[index]) {
            currentImage.src = imageArray[index];
        }
    }
    
    // Mostrar primera imagen
    showImage(0);
    
    // Event listeners para navegación
    modal.querySelector('.gallery-prev').addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1;
        showImage(currentIndex);
    });
    
    modal.querySelector('.gallery-next').addEventListener('click', () => {
        currentIndex = currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0;
        showImage(currentIndex);
    });
    
    // Cerrar modal
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    modal.querySelector('.gallery-close').addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        } else if (e.key === 'ArrowLeft') {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1;
            showImage(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0;
            showImage(currentIndex);
        }
    });
    
    console.log('✅ Galería abierta correctamente');
};

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    console.log('Initializing mobile menu...');
    
    // Toggle function
    function toggleMenu() {
        console.log('Toggle menu clicked');
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Add event listener for toggle button
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    console.log('Mobile menu initialized successfully');
}