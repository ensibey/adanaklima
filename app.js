document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // Mobile Navigation Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Active link class
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        n.classList.add('active');
    }));

    // BTU Calculator Logic
    const btnCalculate = document.getElementById('btn-calculate');
    const roomAreaInput = document.getElementById('room-area');
    const roomExposureSelect = document.getElementById('room-exposure');
    const peopleCountInput = document.getElementById('people-count');
    const calcResultBox = document.getElementById('calc-result-box');
    const recommendedBtu = document.getElementById('recommended-btu');
    const recommendedDesc = document.getElementById('recommended-desc');
    const filterRecommendedBtn = document.getElementById('btn-filter-recommended');
    
    let calculatedCapacityClass = 'all';

    btnCalculate.addEventListener('click', () => {
        const area = parseFloat(roomAreaInput.value);
        const exposureMultiplier = parseFloat(roomExposureSelect.value);
        const people = parseInt(peopleCountInput.value) || 0;

        if (!area || area <= 0) {
            alert('Lütfen geçerli bir oda metrekaresi giriniz.');
            return;
        }

        // Calculation: Area (m2) * Base Factor (400) * Exposure Multiplier + 350 BTU per extra person
        const baseBtuFactor = 400;
        let btuNeeded = (area * baseBtuFactor * exposureMultiplier) + (people * 350);

        // Determine recommended commercial size class
        let recommendationText = '';
        let btuClass = '';

        if (btuNeeded <= 9000) {
            btuClass = '12000'; // Standardize to closest available capacity
            recommendationText = 'Odanız için 9.000 BTU yeterli olsa da daha hızlı iklimlendirme ve yüksek verimlilik için 12.000 BTU modelimizi öneririz.';
            calculatedCapacityClass = '12000';
        } else if (btuNeeded <= 12000) {
            btuClass = '12000';
            recommendationText = '12.000 BTU kapasiteli klima odanız için ideal konforu ve tasarrufu sunacaktır.';
            calculatedCapacityClass = '12000';
        } else if (btuNeeded <= 18000) {
            btuClass = '18000';
            recommendationText = '18.000 BTU kapasiteli klima odanız için mükemmel iklimlendirme performansı sağlar.';
            calculatedCapacityClass = '18000';
        } else {
            btuClass = '24000';
            recommendationText = 'Oda alanınız oldukça büyük. En iyi serinletme verimi için 24.000 BTU gücündeki modellerimizi tercih etmelisiniz.';
            calculatedCapacityClass = '24000';
        }

        // Show result box
        const placeholder = calcResultBox.querySelector('.result-placeholder');
        const display = calcResultBox.querySelector('.result-display');
        
        placeholder.classList.add('d-none');
        display.classList.remove('d-none');
        
        recommendedBtu.textContent = `${btuClass} BTU`;
        recommendedDesc.textContent = recommendationText;
    });

    // Filter Recommended Climates
    filterRecommendedBtn.addEventListener('click', () => {
        if (calculatedCapacityClass !== 'all') {
            document.getElementById('capacity-select').value = calculatedCapacityClass;
            filterProducts();
            // Scroll to products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Product Filtering Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const capacitySelect = document.getElementById('capacity-select');
    const productCards = document.querySelectorAll('.product-card');

    let activeBrandFilter = 'all';

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeBrandFilter = btn.getAttribute('data-filter');
            filterProducts();
        });
    });

    capacitySelect.addEventListener('change', filterProducts);

    function filterProducts() {
        const selectedCapacity = capacitySelect.value;

        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const cardBtu = card.getAttribute('data-btu');

            const matchesBrand = (activeBrandFilter === 'all' || cardBrand === activeBrandFilter);
            const matchesCapacity = (selectedCapacity === 'all' || cardBtu === selectedCapacity);

            if (matchesBrand && matchesCapacity) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Direct WhatsApp Product Order Integration
    const phoneNo = "905457990356"; // Updated Target WhatsApp Number

    document.querySelectorAll('.btn-wa-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const brand = btn.getAttribute('data-brand');
            const model = btn.getAttribute('data-model');
            const btu = btn.getAttribute('data-btu');
            const price = btn.getAttribute('data-price');

            const textMessage = `Merhaba, ${brand} ${model} ${btu} BTU klimayı KDV ve montaj dahil ${price} TL fiyatıyla sipariş etmek istiyorum. Stok durumu ve teslimat süresi hakkında bilgi alabilir miyim?`;
            const waUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(textMessage)}`;
            window.open(waUrl, '_blank');
        });
    });

    // WhatsApp Contact Form Action
    const contactForm = document.getElementById('wa-contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const phone = document.getElementById('form-phone').value;
        const service = document.getElementById('form-service').value;
        const message = document.getElementById('form-message').value;

        const textMessage = `Merhaba, ben *${name}* (${phone}).\n\n*Talep/Hizmet Türü:* ${service}\n*Mesajım:* ${message}`;
        const waUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(textMessage)}`;
        
        window.open(waUrl, '_blank');
    });
});
