document.addEventListener('DOMContentLoaded', function () {

    // Khởi tạo các biến Swiper ở phạm vi rộng hơn cho mục 6
    let heroSwiper = null;
    let productsSwiper = null;
    let brandsSwiper = null;

    // --- 1. Xử lý logic Đăng nhập (Phần quan trọng nhất cho trang này) ---
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPass');
    const icon = togglePassword ? togglePassword.querySelector('i') : null;
    const loginForm = document.getElementById('loginForm');

    // 1a. Toggle Password Visibility (Ẩn/Hiện Mật Khẩu)
    if (togglePassword && passwordInput && icon) {
        togglePassword.addEventListener('click', function () {
            // Xác định loại input hiện tại (text hoặc password)
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';

            // Đổi loại input
            passwordInput.setAttribute('type', type);

            // Đổi icon tương ứng (mắt gạch chéo -> ẩn, mắt mở -> hiện)
            if (type === 'text') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }


    // 1b. Xử lý Đăng Nhập (Form Submission)
    if (loginForm && passwordInput) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('loginUser').value;
            const password = passwordInput.value;

            console.log('Đăng nhập với:', { username, password });

            alert('Đăng nhập thành công! (Chức năng này cần được kết nối với API thực tế.)');
        });
    }

    // --- 2. Xử lý Swiper (Phần này đã được sắp xếp lại và gộp các logic bị lặp) ---
    if (typeof Swiper === 'undefined') {
        console.error('Swiper not loaded. Make sure the Swiper script tag is correct.');
        return;
    }

    // Hiển thị trang chủ
    function showHome() {
        document.querySelectorAll('.menu-category').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById('hero').style.display = 'flex';
    }

    // Hiển thị danh mục thực đơn
    function showCategory(categoryId) {
        // Ẩn tất cả danh mục
        document.querySelectorAll('.menu-category').forEach(el => {
            el.classList.remove('active');
        });

        // Hiển thị danh mục được chọn
        document.getElementById(categoryId).classList.add('active');

        // Cập nhật tab active
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Xác định tab tương ứng với category
        let tab;
        switch (categoryId) {
            case 'hotpot':
                tab = document.querySelector('.menu-tab:nth-child(1)');
                break;
            case 'combo':
                tab = document.querySelector('.menu-tab:nth-child(2)');
                break;
            case 'side-dish':
                tab = document.querySelector('.menu-tab:nth-child(3)');
                break;
            case 'dessert':
                tab = document.querySelector('.menu-tab:nth-child(4)');
                break;
            case 'drink':
                tab = document.querySelector('.menu-tab:nth-child(5)');
                break;
        }

        if (tab) tab.classList.add('active');

        // Ẩn hero section
        document.getElementById('hero').style.display = 'none';

        // Cuộn xuống phần menu
        document.getElementById('menu-categories').scrollIntoView({ behavior: 'smooth' });
    }


    // 2a. HERO SWIPER
    const heroEl = document.querySelector('.hero-swiper');
    if (heroEl) {
        heroSwiper = new Swiper('.hero-swiper', {
            loop: false,
            effect: 'fade',
            speed: 1200,
            autoplay: { delay: 3000, disableOnInteraction: false },
            pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
            navigation: { nextEl: '.hero-swiper .swiper-button-next', prevEl: '.hero-swiper .swiper-button-prev' },
            on: {
                init() {
                    this.slides.forEach(s => s.classList.remove('zoom-active'));
                    const a = this.slides[this.activeIndex];
                    if (a) a.classList.add('zoom-active');
                },
                slideChangeTransitionStart() { this.slides.forEach(s => s.classList.remove('zoom-active')); },
                slideChangeTransitionEnd() {
                    const a = this.slides[this.activeIndex];
                    if (a) a.classList.add('zoom-active');
                }
            }
        });
        window._heroSwiper = heroSwiper;
    }

    // 2b. PRODUCTS SWIPER
    if (document.querySelector('.products-swiper')) {
        productsSwiper = new Swiper('.products-swiper', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            spaceBetween: 20,
            speed: 600,
            pagination: { el: '.products-swiper .swiper-pagination', clickable: true },
            navigation: { el: '.products-swiper .swiper-button-next', prevEl: '.products-swiper .swiper-button-prev' },
            // Responsive breakpoints
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 10 },
                480: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 2, spaceBetween: 15 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 4, spaceBetween: 20 }
            },
            on: {
                init: function () { console.log('Products Swiper initialized'); }
            }
        });
    }

    // 2c. BRANDS SWIPER
    if (document.querySelector('.brands-swiper')) {
        brandsSwiper = new Swiper('.brands-swiper', {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            spaceBetween: 30,
            speed: 1000,
            // Responsive breakpoints
            breakpoints: {
                320: { slidesPerView: 2, spaceBetween: 10 },
                480: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 30 }
            },
            on: {
                init: function () { console.log('Brands Swiper initialized'); }
            }
        });
    }
    console.log('All Swipers initialized (guarded).');

    //
    // --- 3. Logic Cart (Giả lập "Add to cart") ---
    // let cartCount = 0;
    // let cartTotal = 0.00;

    // const cartCountEl = document.querySelector('.cart-count');
    // const cartTotalEl = document.querySelector('.cart-total');

    // document.querySelectorAll('.add-to-cart').forEach(button => {
    //     button.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const name = this.getAttribute('data-name') || 'Sản phẩm không xác định';
    //         const price = parseFloat(this.getAttribute('data-price')) || 0;

    //         cartCount++;
    //         cartTotal += price;

    //         if (cartCountEl) { cartCountEl.textContent = cartCount; }
    //         if (cartTotalEl) { cartTotalEl.textContent = '$' + cartTotal.toFixed(2); }

    //         // TODO: Thay thế alert bằng Modal/Toast
    //         alert(`Đã thêm "${name}" ($${price.toFixed(2)}) vào giỏ hàng!\nTổng số lượng: ${cartCount}\nTổng tiền: $${cartTotal.toFixed(2)}`);

    //         const originalText = this.textContent;
    //         this.textContent = 'Added!';
    //         this.style.background = '#28a745';
    //         setTimeout(() => {
    //             this.textContent = originalText;
    //             this.style.background = '';
    //         }, 2000);

    //         console.log('Added to cart:', name, price, 'Total:', cartTotal.toFixed(2));
    //     });
    // });

    // --- 4. Newsletter form (Giả lập submit) ---
    // const newsletterButton = document.querySelector('.newsletter button');
    // const newsletterInput = document.querySelector('.newsletter input');

    // if (newsletterButton && newsletterInput) {
    //     newsletterButton.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const email = newsletterInput.value.trim();
    //         if (email && email.includes('@')) {
    //             // TODO: Thay thế alert bằng Modal/Toast
    //             alert('Cảm ơn! Bạn đã đăng ký nhận bản tin Manwah thành công.\nEmail: ' + email);
    //             newsletterInput.value = '';
    //         } else {
    //             // TODO: Thay thế alert bằng Modal/Toast
    //             alert('Vui lòng nhập email hợp lệ (ví dụ: example@email.com)!');
    //             newsletterInput.focus();
    //         }
    //         console.log('Newsletter submitted:', email);
    //     });

    //     // Enter key submit
    //     newsletterInput.addEventListener('keypress', function (e) {
    //         if (e.key === 'Enter') {
    //             newsletterButton.click();
    //         }
    //     });
    // }

    // --- 5. Mobile Menu Toggle (Hamburger menu) ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            console.log('Mobile menu toggled');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.textContent = '☰';
            });
        });
    }

    // --- 6. Tùy chọn: Pause autoplay khi tab không active ---
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            if (heroSwiper && heroSwiper.autoplay) heroSwiper.autoplay.stop();
            if (productsSwiper && productsSwiper.autoplay) productsSwiper.autoplay.stop();
            if (brandsSwiper && brandsSwiper.autoplay) brandsSwiper.autoplay.stop();
        } else {
            if (heroSwiper && heroSwiper.autoplay) heroSwiper.autoplay.start();
            if (productsSwiper && productsSwiper.autoplay) productsSwiper.autoplay.start();
            if (brandsSwiper && brandsSwiper.autoplay) brandsSwiper.autoplay.start();
        }
    });

    function showCategory(categoryId, clickedButton) {
        // 1. Ẩn tất cả các danh mục
        const categories = document.querySelectorAll('.menu-category');
        categories.forEach(category => {
            category.classList.remove('active');
        });

        // 2. Hiện danh mục được chọn
        const selectedCategory = document.getElementById(categoryId);
        if (selectedCategory) {
            selectedCategory.classList.add('active');
        }

        // 3. Cập nhật trạng thái active của các nút tab
        const tabs = document.querySelectorAll('.menu-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // 4. Gán class active cho nút vừa click
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
    }

    let cartCount = 0;
    let cartTotal = 0.00; // Sử dụng VND

    // Lấy các phần tử UI trên Header
    const cartCountEl = document.querySelector('.cart-count');
    const cartTotalEl = document.querySelector('.cart-total');

    // Cập nhật giao diện giỏ hàng
    function updateCartUI() {
        if (cartCountEl) {
            cartCountEl.textContent = cartCount;
        }
        if (cartTotalEl) {
            // Định dạng tiền tệ sang VND
            cartTotalEl.textContent = cartTotal.toLocaleString('vi-VN') + '₫';
        }
    }

    // Hàm xử lý sự kiện khi nhấn nút "Thêm"
    function handleAddToCart(event) {
        // Ngăn chặn hành vi mặc định (nếu là thẻ <a>)
        event.preventDefault();

        const button = event.currentTarget;
        const name = button.getAttribute('data-name') || 'Sản phẩm không xác định';

        // Lấy giá trị, loại bỏ định dạng tiền tệ nếu có
        const priceString = button.getAttribute('data-price');
        let price = parseFloat(priceString);

        if (isNaN(price)) {
            console.error('Lỗi: Không tìm thấy hoặc giá tiền không hợp lệ cho sản phẩm:', name);
            return;
        }

        // Cập nhật giỏ hàng
        cartCount++;
        cartTotal += price;

        // Cập nhật giao diện
        updateCartUI();

        // Hiển thị thông báo (Sử dụng console log để tránh alert())
        console.log(`Đã thêm "${name}" vào giỏ hàng. Tổng số lượng: ${cartCount}. Tổng tiền: ${cartTotal.toLocaleString('vi-VN')}₫`);

        // Hiệu ứng phản hồi trên nút
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        button.style.backgroundColor = '#28a745'; // Màu xanh lá

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = ''; // Reset màu
        }, 1000); // 1 giây
    }

    // Gắn sự kiện cho tất cả các nút "Thêm vào giỏ hàng"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // --- 1. BIẾN VÀ KHỞI TẠO ---
    const CART_STORAGE_KEY = 'manwahCart';
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryTotalEl = document.getElementById('cart-summary-total');
    const headerCartCountEl = document.querySelector('.cart-count');
    const headerCartTotalEl = document.querySelector('.cart-total');

    // Lấy giỏ hàng từ Local Storage hoặc khởi tạo rỗng
    let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    // --- 2. HÀM CƠ BẢN VÀ CẬP NHẬT UI ---

    /**
     * Lưu trữ giỏ hàng vào Local Storage và cập nhật UI Header
     */
    function saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateHeaderCartUI();
    }

    /**
     * Tính tổng số lượng món và tổng tiền của toàn bộ giỏ hàng
     * @returns {{count: number, total: number}}
     */
    function calculateTotals() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { count, total };
    }

    /**
     * Cập nhật số lượng và tổng tiền trên Header (Icon Giỏ hàng)
     */
    function updateHeaderCartUI() {
        const { count, total } = calculateTotals();

        if (headerCartCountEl) {
            headerCartCountEl.textContent = count;
        }
        if (headerCartTotalEl) {
            // Định dạng tiền tệ VND
            headerCartTotalEl.textContent = total.toLocaleString('vi-VN') + '₫';
        }
    }

    // --- 3. LOGIC XỬ LÝ TRÊN TRANG GIỎ HÀNG (gio_hang.html) ---

    /**
     * Render toàn bộ danh sách sản phẩm và tổng tiền trên trang Giỏ Hàng
     */
    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 50px;">Giỏ hàng của bạn đang trống.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
                    <div class="cart-item-img">
                        <img src="${item.imageSrc}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="cart-item-subtotal">
                        ${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }

        // Cập nhật tổng tiền ở phần summary
        const { total } = calculateTotals();
        if (cartSummaryTotalEl) {
            cartSummaryTotalEl.textContent = total.toLocaleString('vi-VN') + '₫';
        }
    }

    // --- 4. HÀM TƯƠNG TÁC (Global Functions được gọi từ HTML) ---

    // Gán hàm cho window để có thể gọi từ onclick="..."
    window.updateQuantity = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            saveCart();
            renderCart();
        }
    };

    window.removeItem = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    };

    window.clearCart = () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?')) {
            cart = [];
            saveCart();
            renderCart();
        }
    };

    window.checkout = () => {
        if (cart.length === 0) {
            alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
            return;
        }
        alert(`Thanh toán ${calculateTotals().total.toLocaleString('vi-VN')}₫ thành công!`);
        // Chuyển hướng hoặc xử lý thanh toán thực tế ở đây
        // cart = []; saveCart(); renderCart(); 
    };

    // --- 5. LOGIC THÊM SẢN PHẨM TỪ TRANG MENU/INDEX ---

    /**
     * Hàm thêm sản phẩm vào giỏ hàng (Được gọi từ nút "Thêm" trên trang Menu)
     * @param {string} id - ID sản phẩm
     * @param {string} name - Tên sản phẩm
     * @param {number} price - Giá tiền
     * @param {string} imageSrc - Đường dẫn ảnh
     */
    function addToCart(id, name, price, imageSrc) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, imageSrc, quantity: 1 });
        }

        saveCart();
        console.log(`Đã thêm "${name}". Tổng số món: ${calculateTotals().count}`);
    }

    // Đăng ký sự kiện click cho tất cả nút "Thêm vào giỏ hàng"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        // Lấy thông tin từ HTML (cần được đặt data-name, data-price, data-id)
        // Lưu ý: Giá tiền trong HTML phải là số (vd: data-price="289000")

        // Giả sử HTML của bạn có data-id và data-img-src
        const dataId = button.getAttribute('data-id') || button.getAttribute('data-name').replace(/\s/g, '_');
        const dataImgSrc = button.closest('.menu-card').querySelector('img')?.src || '';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const dataName = button.getAttribute('data-name');
            const dataPrice = parseFloat(button.getAttribute('data-price'));

            addToCart(dataId, dataName, dataPrice, dataImgSrc);

            // Hiệu ứng phản hồi trên nút
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
            button.style.backgroundColor = '#28a745';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // --- 6. CHẠY KHI TẢI TRANG ---

    // Luôn cập nhật UI Header khi tải bất kỳ trang nào
    updateHeaderCartUI();

    // Chỉ render giỏ hàng nếu đang ở trang giỏ hàng
    if (cartItemsContainer) {
        renderCart();
    }

    // Đã được tích hợp vào thẻ <script> cuối file index.html
    function initPageLoadAnimation() {
        const contentSections = document.querySelectorAll('.page-content-section');
        const delayStep = 300; // Độ trễ giữa mỗi phần tử (300ms)
        let initialDelay = 500; // Độ trễ ban đầu

        contentSections.forEach((section, index) => {
            // Áp dụng độ trễ tăng dần
            setTimeout(() => {
                section.classList.remove('hidden');
                section.classList.add('visible');
            }, initialDelay + (index * delayStep));
        });
    }

    console.log('All scripts loaded successfully! Hero autoplay + zoom active.');
});