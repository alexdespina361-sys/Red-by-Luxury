// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Inițializare Stripe doar dacă este disponibil
    let stripe = null;
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe('pk_test_51S2tMZGdE7oRFon7Op95iLZbRo87irRPDiyDHpEhLHVlDsdfcFznLwoh2hePb1yGOGuLh2glp1FFgl6DSKVFr0qH00xTtF0J0z');
    }
    
    // Funcție pentru actualizarea numărului de produse în coș
    window.updateCartCount = function() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = totalItems;
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = '0';
            }
        }
    };
    
    // Funcție pentru adăugarea în coș
    window.addToCart = function(product) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Verificăm dacă produsul există deja în coș
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity = (parseInt(existingItem.quantity) || 0) + 1;
            } else {
                // Asigurăm că quantity este un număr valid
                cart.push({
                    ...product,
                    quantity: Math.max(1, parseInt(product.quantity) || 1)
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    
    // Apelăm funcție pentru a actualiza numărul de produse la încărcarea paginii
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    
    // Adăugare event listeners pentru butoanele de adăugare în coș
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const id = productCard.dataset.id;
            const name = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(' lei', '').replace(',', '.'));
            const image = productCard.querySelector('img').src;
            
            const product = {
                id,
                name,
                price,
                image,
                quantity: 1
            };
            
            if (typeof window.addToCart === 'function') {
                window.addToCart(product);
                window.updateCartCount();
            }
            
            // Animație de feedback
            this.textContent = 'Adăugat!';
            this.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                this.textContent = 'Adaugă';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Carusel pentru produsele principale
    if (document.querySelector('.carousel')) {
        const carousel = document.querySelector('.carousel');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        const slideCount = slides.length;
        
        // Funcție pentru mutarea caruselului
        function moveCarousel(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % slideCount;
            } else {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            }
            
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        // Event listeners pentru butoanele caruselului
        if (prevBtn) {
            prevBtn.addEventListener('click', () => moveCarousel('prev'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => moveCarousel('next'));
        }
        
        // Auto-scroll pentru carusel
        setInterval(() => {
            moveCarousel('next');
        }, 4000);
    }
    
    // Funcționalitate newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Trimite datele către server
            fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert(result.message);
                    this.reset();
                } else {
                    alert(result.message || 'A apărut o eroare. Vă rugăm încercați din nou.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('A apărut o eroare. Vă rugăm încercați din nou.');
            });
        });
    }
    
    // Actualizare linkuri active în navigație
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/') ||
            (currentPage === '/index.html' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});