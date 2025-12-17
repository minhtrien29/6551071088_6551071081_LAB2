document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. BANNER SLIDER ---
    const track = document.getElementById('banner-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (track && prevBtn && nextBtn) {
        const slides = track.children;
        const slideCount = slides.length;
        let currentIndex = 0;

        function updateBannerPosition() {
            const width = track.clientWidth;
            track.style.transform = `translateX(-${currentIndex * width}px)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex >= slideCount) currentIndex = 0;
            updateBannerPosition();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            if (currentIndex < 0) currentIndex = slideCount - 1;
            updateBannerPosition();
        });

        window.addEventListener('resize', updateBannerPosition);
        
        // Tự động chuyển sau 5s
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateBannerPosition();
        }, 5000);
    }

    // --- 2. ĐỒNG HỒ ĐẾM NGƯỢC ---
    const deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const t = deadline - now;
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((t % (1000 * 60)) / 1000);

        const countdowns = document.querySelectorAll('.countdown-timer');
        countdowns.forEach(timer => {
            timer.querySelector('.days').innerHTML = (days < 10 && days >= 0) ? "0" + days : (days >=0 ? days : "00");
            timer.querySelector('.hours').innerHTML = (hours < 10 && hours >= 0) ? "0" + hours : (hours >=0 ? hours : "00");
            timer.querySelector('.mins').innerHTML = (minutes < 10 && minutes >= 0) ? "0" + minutes : (minutes >=0 ? minutes : "00");
            timer.querySelector('.secs').innerHTML = (seconds < 10 && seconds >= 0) ? "0" + seconds : (seconds >=0 ? seconds : "00");
        });
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- 3. COMPARISON SLIDER (Before/After) ---
    const sliderContainer = document.getElementById('comparison-slider');
    const resizer = document.getElementById('resizer');
    const handle = document.getElementById('handle');

    if(sliderContainer && resizer && handle) {
        let isDown = false;
        function move(e) {
            if (!isDown) return;
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const rect = sliderContainer.getBoundingClientRect();
            const x = clientX - rect.left;
            const width = Math.max(0, Math.min(x, rect.width));
            const percentage = (width / rect.width) * 100;
            resizer.style.width = percentage + "%";
            handle.style.left = percentage + "%";
        }
        handle.addEventListener('mousedown', () => isDown = true);
        window.addEventListener('mouseup', () => isDown = false);
        sliderContainer.addEventListener('mousemove', move);
        handle.addEventListener('touchstart', (e) => {
            isDown = true;
            if(e.target === handle || handle.contains(e.target)) e.preventDefault();
        }, { passive: false });
        window.addEventListener('touchend', () => isDown = false);
        sliderContainer.addEventListener('touchmove', move);
    }
    
    // --- 4. MENU MOBILE ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('main-nav');
    if(menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
            navMenu.classList.toggle('flex-col');
            navMenu.classList.toggle('absolute');
            navMenu.classList.toggle('top-full');
            navMenu.classList.toggle('left-0');
            navMenu.classList.toggle('w-full');
            navMenu.classList.toggle('bg-tech-bg');
            navMenu.classList.toggle('p-4');
            navMenu.classList.toggle('shadow-xl');
            navMenu.classList.toggle('z-50');
        });
    }

    // --- 5. BEST SELLERS TABS (NEW) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0 && contents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Xóa trạng thái active cũ
                tabs.forEach(t => {
                    t.classList.remove('text-tech-red', 'border-b-2', 'border-tech-red', 'pb-1');
                    t.classList.add('text-gray-500');
                });

                // Thêm trạng thái active mới
                tab.classList.remove('text-gray-500');
                tab.classList.add('text-tech-red', 'border-b-2', 'border-tech-red', 'pb-1');

                // Ẩn tất cả nội dung
                contents.forEach(content => content.classList.add('hidden'));

                // Hiện nội dung tương ứng
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    }
});

// --- 5. BEST SELLERS TABS & SLIDER (LOGIC MỚI - TRƯỢT TỪNG CỘT) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    function initSliderDots(tabContent) {
        const track = tabContent.querySelector('.slider-track');
        const dots = tabContent.querySelectorAll('.dot-btn');
        if(!track || !dots) return;

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-index'));
                
                // Track rộng 150% (6 cột). Viewport hiện 4 cột (100%).
                // Mỗi lần bấm trượt 1 cột = 1/6 chiều rộng track = 16.666667%
                const translateValue = -(index * (100 / 6)); 
                track.style.transform = `translateX(${translateValue}%)`;

                dots.forEach(d => {
                    d.classList.remove('bg-tech-red');
                    d.classList.add('bg-gray-600', 'hover:bg-white');
                });
                dot.classList.remove('bg-gray-600', 'hover:bg-white');
                dot.classList.add('bg-tech-red');
            });
        });
    }

    if (tabs.length > 0 && contents.length > 0) {
        // Init tab đầu tiên
        const firstTabContent = document.getElementById('tires-wheels');
        if(firstTabContent) initSliderDots(firstTabContent);

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Đổi style active cho tab
                tabs.forEach(t => {
                    t.classList.remove('text-tech-red', 'border-b-2', 'border-tech-red', 'pb-1');
                    t.classList.add('text-gray-500');
                });
                tab.classList.remove('text-gray-500');
                tab.classList.add('text-tech-red', 'border-b-2', 'border-tech-red', 'pb-1');

                // Ẩn hiện nội dung
                contents.forEach(content => content.classList.add('hidden'));
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    initSliderDots(targetContent);
                    
                    // Reset về vị trí đầu
                    const track = targetContent.querySelector('.slider-track');
                    const dots = targetContent.querySelectorAll('.dot-btn');
                    if(track && dots) {
                         track.style.transform = `translateX(0%)`;
                         dots.forEach(d => {
                            d.classList.remove('bg-tech-red');
                            d.classList.add('bg-gray-600', 'hover:bg-white');
                        });
                        if(dots[0]) {
                            dots[0].classList.remove('bg-gray-600', 'hover:bg-white');
                            dots[0].classList.add('bg-tech-red');
                        }
                    }
                }
            });
        });
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        const slider = document.getElementById('comparison-slider');
        const resizer = document.getElementById('resizer');
        const handle = document.getElementById('handle');
        const beforeImg = document.getElementById('before-img');
        
        if(!slider || !resizer || !handle) return;

        let isDragging = false;

        // 1. Đồng bộ kích thước ảnh
        function syncImageWidth() {
            if(beforeImg && slider) {
                beforeImg.style.width = slider.offsetWidth + 'px';
            }
        }
        window.addEventListener('resize', syncImageWidth);
        syncImageWidth();

        // 2. Hàm tính toán vị trí
        const moveSlide = (x) => {
            let sliderRect = slider.getBoundingClientRect();
            let newX = x - sliderRect.left;
            
            if(newX < 0) newX = 0;
            if(newX > sliderRect.width) newX = sliderRect.width;

            let percent = (newX / sliderRect.width) * 100;
            
            resizer.style.width = percent + "%";
            handle.style.left = percent + "%";
        }

        // 3. Sự kiện cho Chuột (Desktop)
        
        // Khi nhấn chuột xuống -> Bắt đầu kéo
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault(); // Ngăn trình duyệt kéo cái ảnh đi (ghost image)
            moveSlide(e.clientX); // Nhảy ngay tới vị trí click
        });

        // Khi nhả chuột ra (ở bất kỳ đâu trên màn hình) -> Dừng kéo
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Khi di chuyển chuột -> Chỉ chạy nếu đang nhấn giữ (isDragging = true)
        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return; 
            moveSlide(e.clientX);
        });

        // 4. Sự kiện cho Cảm ứng (Mobile - vẫn giữ nguyên logic chạm là kéo)
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            moveSlide(e.touches[0].clientX);
        });
        
        slider.addEventListener('touchend', () => {
            isDragging = false;
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlide(e.touches[0].clientX);
        });
    });

    function moveFlashSale(index) {
        const track = document.getElementById('flash-sale-track');
        const dot0 = document.getElementById('fs-dot-0');
        const dot1 = document.getElementById('fs-dot-1');

        // 1. Di chuyển đường ray (Track)
        // Nếu index = 0 -> translate(0%), index = 1 -> translate(-100%)
        track.style.transform = `translateX(-${index * 100}%)`;

        // 2. Cập nhật màu sắc cho dấu chấm tròn
        if (index === 0) {
            dot0.classList.remove('bg-gray-600', 'hover:bg-white');
            dot0.classList.add('bg-red-600', 'scale-125');
            
            dot1.classList.remove('bg-red-600', 'scale-125');
            dot1.classList.add('bg-gray-600', 'hover:bg-white');
        } else {
            dot1.classList.remove('bg-gray-600', 'hover:bg-white');
            dot1.classList.add('bg-red-600', 'scale-125');

            dot0.classList.remove('bg-red-600', 'scale-125');
            dot0.classList.add('bg-gray-600', 'hover:bg-white');
        }
    }