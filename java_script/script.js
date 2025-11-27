document.addEventListener('DOMContentLoaded', function () {

    // ================================================================
    // --- 1. KHỞI TẠO SLIDER (TRANG CHỦ) ---
    // ================================================================
    if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
        new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            speed: 1000,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
            navigation: { nextEl: '.hero-swiper .swiper-button-next', prevEl: '.hero-swiper .swiper-button-prev' },
            on: {
                init: function() {
                    const activeSlide = this.el.querySelector('.swiper-slide-active');
                    if(activeSlide) activeSlide.classList.add('zoom-active');
                },
                slideChangeTransitionStart: function() {
                    this.slides.forEach(s => { s.classList.remove('zoom-active'); s.style.transition = 'none'; });
                },
                slideChangeTransitionEnd: function() {
                    const activeSlide = this.el.querySelector('.swiper-slide-active');
                    if(activeSlide) {
                        activeSlide.style.transition = 'transform 6s linear';
                        activeSlide.classList.add('zoom-active');
                    }
                }
            }
        });
    }

    // ================================================================
    // --- 2. LOGIC GIỎ HÀNG (CART CORE) ---
    // ================================================================
    const CART_KEY = 'manwahCart';
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    // UI Elements
    const headerTotalEl = document.querySelector('.cart-total');
    const headerCountEl = document.querySelector('.cart-count');
    const cartPageContainer = document.getElementById('cart-items-container');
    const cartPageTotal = document.getElementById('cart-summary-total');

    // --- Tính toán tổng ---
    function getCartStats() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { count, total };
    }

    // --- Cập nhật Header ---
    function updateHeaderUI() {
        const stats = getCartStats();
        if (headerTotalEl) headerTotalEl.textContent = stats.total.toLocaleString('vi-VN') + '₫';
        if (headerCountEl) {
            headerCountEl.textContent = stats.count;
            headerCountEl.style.display = stats.count > 0 ? 'flex' : 'none';
        }
    }

    // --- Lưu & Vẽ lại ---
    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateHeaderUI();
        renderCartPage(); // Cập nhật trang giỏ hàng nếu đang mở
    }

    // --- Vẽ trang Giỏ hàng (QUAN TRỌNG) ---
    function renderCartPage() {
        if (!cartPageContainer) return; // Không ở trang giỏ hàng thì thoát

        if (cart.length === 0) {
            cartPageContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Giỏ hàng của bạn đang trống.</p>';
            if (cartPageTotal) cartPageTotal.textContent = '0₫';
            return;
        }

        let html = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.imageSrc}" alt="${item.name}"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString('vi-VN')}₫</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQty('${item.id}')"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQty('${item.id}')"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="cart-item-subtotal">${itemTotal.toLocaleString('vi-VN')}₫</div>
                    <button class="remove-item" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
        cartPageContainer.innerHTML = html;
        
        const stats = getCartStats();
        if (cartPageTotal) cartPageTotal.textContent = stats.total.toLocaleString('vi-VN') + '₫';
    }

    // --- Thêm vào giỏ ---
    function addToCart(name, price, imgSrc) {
        const id = name.replace(/\s+/g, '_').toLowerCase();
        const existing = cart.find(item => item.id === id);
        if (existing) existing.quantity++;
        else cart.push({ id, name, price, imageSrc: imgSrc, quantity: 1 });
        saveCart();
    }

    // --- Sự kiện nút Thêm ---
    document.querySelectorAll('.add-to-cart, .btn-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.menu-card') || this.closest('.product-item') || this.closest('.combo-item');
            if (!card) return;

            let name, price, imgSrc;
            if (this.dataset.name) { // Trang chủ
                name = this.dataset.name;
                price = parseFloat(this.dataset.price);
                imgSrc = card.querySelector('img') ? card.querySelector('img').src : '';
            } else { // Trang thực đơn
                const titleEl = card.querySelector('.menu-title, .product-name, .combo-name');
                if (titleEl) name = titleEl.textContent.trim();
                const priceEl = card.querySelector('.menu-price, .product-price, .combo-price');
                if (priceEl) price = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''));
                const imgEl = card.querySelector('img');
                if (imgEl) imgSrc = imgEl.src;
            }

            if (name && price) {
                addToCart(name, price, imgSrc);
                
                // Hiệu ứng nút
                const originalHTML = this.innerHTML;
                const originalBg = this.style.backgroundColor;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.backgroundColor = '#28a745';
                this.style.color = '#fff';
                this.style.borderColor = '#28a745';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.backgroundColor = originalBg;
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 1000);
            }
        });
    });

    // --- EXPOSE GLOBAL FUNCTIONS (Để gọi onclick trong HTML) ---
    window.increaseQty = function(id) {
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity++; saveCart(); }
    };

    window.decreaseQty = function(id) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) removeItem(id);
            else saveCart();
        }
    };

    window.removeItem = function(id) {
        if(confirm('Bạn muốn xóa món này?')) {
            cart = cart.filter(i => i.id !== id);
            saveCart();
        }
    };

    window.clearCart = function() {
        if(confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            cart = [];
            saveCart();
        }
    };

    window.checkout = function() {
        if (cart.length === 0) alert("Giỏ hàng trống!");
        else {
            alert("Đặt hàng thành công! (Chức năng mô phỏng)");
            cart = [];
            saveCart();
        }
    };

    // Init UI
    updateHeaderUI();
    renderCartPage();


    // ================================================================
    // --- 3. LOGIC TAB, SIDEBAR & URL HASH ---
    // ================================================================
    const tabPanes = document.querySelectorAll(".tab-pane");
    const sidebarItems = document.querySelectorAll(".sidebar-item");

    function activateTab(id) {
        tabPanes.forEach(p => { p.classList.remove("active"); p.style.display = "none"; });
        sidebarItems.forEach(i => i.classList.remove("active"));

        const target = document.getElementById("tab-" + id);
        if (target) {
            target.style.display = "block";
            setTimeout(() => target.classList.add("active"), 10);
        }

        const link = document.querySelector(`.tab-link[data-tab="${id}"]`);
        if (link && link.closest("li")) {
            link.closest("li").classList.add("active");
            const group = link.closest(".category-group");
            if (group && !group.classList.contains("open")) {
                group.classList.add("open");
                const icon = group.querySelector(".category-header i");
                if(icon) { icon.classList.remove("fa-chevron-down"); icon.classList.add("fa-chevron-up"); }
            }
        }
    }

    document.querySelectorAll(".tab-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const id = this.getAttribute("data-tab");
            activateTab(id);
            const content = document.querySelector('.menu-content');
            if(content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Đóng mobile menu nếu đang mở
            if(window.innerWidth <= 768) {
                document.querySelector('.nav-menu').classList.remove('active');
                const toggleIcon = document.querySelector('.mobile-toggle i');
                if(toggleIcon) { toggleIcon.classList.remove('fa-times'); toggleIcon.classList.add('fa-bars'); }
            }
        });
    });

    function checkHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            activateTab(hash);
            setTimeout(() => {
                const el = document.getElementById("tab-" + hash);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            }, 500);
        }
    }
    checkHash();
    window.addEventListener('hashchange', checkHash);


    // ================================================================
    // --- 4. MOBILE TOGGLE ---
    // ================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if(mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if(navMenu.classList.contains('active')) { 
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); 
            } else { 
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); 
            }
        });
    }
    const mobileDropdown = document.querySelector('.has-dropdown > a');
    if(mobileDropdown && window.innerWidth <= 768) {
        mobileDropdown.addEventListener('click', function(e) {
            e.preventDefault(); this.parentElement.classList.toggle('open');
        });
    }


    // ================================================================
    // --- 5. LOGIN & REGISTER FORM LOGIC ---
    // ================================================================
    
    // Toggle Password
    document.querySelectorAll('.toggle-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.querySelector('i').classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                input.type = "password";
                this.querySelector('i').classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    });

    // Form Submit (Login & Register)
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            alert("Đăng nhập thành công! (Giả lập)");
            window.location.href = "../index.html"; // Về trang chủ
        });
    }

    const regForm = document.getElementById('registerForm');
    if(regForm) {
        regForm.addEventListener('submit', function(e){
            e.preventDefault();
            const p1 = document.getElementById('regPass').value;
            const p2 = document.getElementById('regConfirmPass').value;
            if(p1 !== p2) { alert("Mật khẩu không khớp!"); return; }
            alert("Đăng ký thành công!");
            window.location.href = "login.html";
        });
    }
});

// --- GLOBAL FUNCTION: TOGGLE SIDEBAR ---
function toggleSubMenu(header) {
    const group = header.parentElement;
    group.classList.toggle("open");
    const icon = header.querySelector("i");
    if(icon) {
        if(group.classList.contains("open")) {
            icon.classList.remove("fa-chevron-down"); icon.classList.add("fa-chevron-up");
        } else {
            icon.classList.remove("fa-chevron-up"); icon.classList.add("fa-chevron-down");
        }
    }
}