// TradeRent Application - ОБНОВЛЕННАЯ ВЕРСИЯ

let currentUser = null;
let currentPropertyModal = null;
let currentRejectPropertyId = null;
let currentReviewModalData = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    populateCityFilters();
    setupEventListeners();
    setupBirthdateValidation();
    
    // Проверяем авторизацию
    checkAuth();
    
    // Показываем первую секцию
    showSection('hero');
    
    // Обновляем счетчик модерации
    updateModerationCounter();
    
    // Загружаем отображение городов
    loadCitiesDisplay();
    
    // Загружаем площадки
    showProperties();
    
    // Инициализация анимаций
    initAnimations();
});

// Инициализация анимаций
function initAnimations() {
    // Анимация счетчиков
    animateCounters();
    
    // Анимация появления элементов при скролле
    initScrollAnimations();
    
    // Плавный скролл для якорей
    initSmoothScroll();
}

// Анимация счетчиков - ОБНОВЛЕНА с реальными данными
function animateCounters() {
    const stats = getHomeStats();
    
    // Обновляем счетчик на главной
    const heroCounters = document.querySelectorAll('.hero-container .stat-number[data-count]');
    heroCounters.forEach(counter => {
        const dataCount = counter.getAttribute('data-count');
        if (dataCount === '1250') {
            // Заменяем на реальное количество площадок
            counter.setAttribute('data-count', stats.totalProperties);
            animateCounter(counter, stats.totalProperties);
        }
    });
    
    // Обновляем текст в hero-subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle .accent-text');
    if (heroSubtitle && heroSubtitle.getAttribute('data-count') === '1250') {
        heroSubtitle.setAttribute('data-count', stats.totalProperties);
        heroSubtitle.textContent = stats.totalProperties;
    }
    
    // Анимируем все счетчики
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (!isNaN(target)) {
            animateCounter(counter, target);
        }
    });
}

// Улучшенная анимация счетчика
function animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;
    
    const duration = 2000;
    const startTime = Date.now();
    const increment = target > current ? 1 : -1;
    
    const updateCounter = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Используем easing функцию для более плавной анимации
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const value = Math.floor(current + (target - current) * easeOutQuart);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Анимация при скролле
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Анимируем счетчики внутри элемента
                const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    if (!isNaN(target)) {
                        animateCounter(counter, target);
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Наблюдаем за всеми карточками и элементами
    document.querySelectorAll('.feature-card, .property-card, .city-card, .stat-card, .admin-stats-grid, .profile-stats').forEach(el => {
        observer.observe(el);
    });
}

// Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Формы
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
    
    document.getElementById('add-property-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProperty();
    });

    // Валидация в реальном времени
    document.getElementById('reg-username').addEventListener('input', function(e) {
        validateUsername(e.target.value);
    });
    
    document.getElementById('reg-password').addEventListener('input', function(e) {
        validatePassword(e.target.value);
    });
    
    document.getElementById('reg-name').addEventListener('input', function(e) {
        validateFullName(e.target.value);
    });
    
    document.getElementById('reg-email').addEventListener('input', function(e) {
        validateEmail(e.target.value);
    });
    
    document.getElementById('reg-phone').addEventListener('input', function(e) {
        formatPhoneNumber(e.target);
    });
    
    // Обработчики для фильтров
    document.getElementById('search-input').addEventListener('input', filterProperties);
    document.getElementById('city-filter').addEventListener('change', filterProperties);
    document.getElementById('area-filter').addEventListener('change', filterProperties);
    document.getElementById('price-filter').addEventListener('change', filterProperties);
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        const modals = ['property-modal', 'reject-modal', 'support-modal', 'auth-prompt-modal', 'review-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && event.target === modal) {
                if (modalId === 'property-modal') closeModal();
                if (modalId === 'reject-modal') closeRejectModal();
                if (modalId === 'support-modal') closeSupportModal();
                if (modalId === 'auth-prompt-modal') closeAuthPrompt();
                if (modalId === 'review-modal') closeReviewModal();
            }
        });
    });
    
    // Обработчик скролла для прогресс-бара и кнопки "Наверх"
    window.addEventListener('scroll', function() {
        updateScrollProgress();
        toggleScrollTopButton();
    });
    
    // Обработчик для кнопки написания отзыва в модальном окне
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('write-review-btn')) {
            const propertyId = e.target.dataset.propertyId;
            const ownerId = e.target.dataset.ownerId;
            openReviewModal(ownerId, propertyId);
        }
    });
}

// Обновление прогресс-бара скролла
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + "%";
}

// Показать/скрыть кнопку "Наверх"
function toggleScrollTopButton() {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Прокрутка наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Настройка валидации даты рождения
function setupBirthdateValidation() {
    const birthdateInput = document.getElementById('reg-birthdate');
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    birthdateInput.max = minDate.toISOString().split('T')[0];
}

// Заполнение фильтров городов
function populateCityFilters() {
    const cities = getCities();
    const cityFilter = document.getElementById('city-filter');
    const propertyCity = document.getElementById('property-city');
    
    if (cityFilter) {
        cityFilter.innerHTML = '<option value="">Все города</option>';
        cities.forEach(city => {
            cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
        });
    }
    
    if (propertyCity) {
        propertyCity.innerHTML = '<option value="">Выберите город</option>';
        cities.forEach(city => {
            propertyCity.innerHTML += `<option value="${city}">${city}</option>`;
        });
    }
}

// Функции валидации
function validateUsername(username) {
    const isValid = /^[a-zA-Z0-9*&^%$#@]{3,20}$/.test(username);
    const input = document.getElementById('reg-username');
    const strengthBar = input.parentElement.querySelector('.strength-bar');
    
    if (username.length > 0) {
        input.style.borderColor = isValid ? 'var(--secondary)' : 'var(--danger)';
        if (strengthBar) {
            strengthBar.style.width = isValid ? '100%' : '0%';
        }
    }
}

function validatePassword(password) {
    const input = document.getElementById('reg-password');
    const strengthBar = input.parentElement.querySelector('.strength-bar');
    
    if (password.length > 0) {
        let strength = 0;
        
        // Проверка длины
        if (password.length >= 8) strength += 25;
        
        // Проверка наличия строчных букв
        if (/[a-zа-я]/.test(password)) strength += 25;
        
        // Проверка наличия заглавных букв
        if (/[A-ZА-Я]/.test(password)) strength += 25;
        
        // Проверка наличия цифр
        if (/\d/.test(password)) strength += 25;
        
        const isValid = strength >= 75;
        input.style.borderColor = isValid ? 'var(--secondary)' : 'var(--danger)';
        
        if (strengthBar) {
            strengthBar.style.width = strength + '%';
            strengthBar.style.background = strength < 50 ? 'var(--danger)' : 
                                          strength < 75 ? 'var(--warning)' : 'var(--success)';
        }
    }
}

function validateFullName(name) {
    const isValid = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(name);
    const input = document.getElementById('reg-name');
    
    if (name.length > 0) {
        input.style.borderColor = isValid ? 'var(--secondary)' : 'var(--danger)';
    }
}

function validateEmail(email) {
    const validDomains = ['gmail.com', 'mail.ru', 'yandex.ru', 'tut.by', 'mail.by'];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidFormat = emailRegex.test(email);
    
    const input = document.getElementById('reg-email');
    if (email.length > 0) {
        if (isValidFormat) {
            const domain = email.split('@')[1].toLowerCase();
            const isValidDomain = validDomains.some(validDomain => domain === validDomain);
            input.style.borderColor = isValidDomain ? 'var(--secondary)' : 'var(--danger)';
        } else {
            input.style.borderColor = 'var(--danger)';
        }
    }
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('375')) {
        value = value.substring(3);
    }
    
    let formattedValue = '+375(';
    
    if (value.length > 0) {
        formattedValue += value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ')' + value.substring(2, 5);
    }
    if (value.length > 5) {
        formattedValue += '-' + value.substring(5, 7);
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 9);
    }
    
    input.value = formattedValue;
}

// Показать секцию с анимацией
function showSection(sectionName) {
    // Скрыть все секции с анимацией
    document.querySelectorAll('.section').forEach(section => {
        if (section.classList.contains('active')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            setTimeout(() => {
                section.classList.remove('active');
                section.style.opacity = '';
                section.style.transform = '';
            }, 300);
        }
    });
    
    // Скрыть все навигационные ссылки активного класса
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Показать нужную секцию с анимацией
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
        
        // Обновляем активную навигационную ссылку
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('onclick') === `showSection('${sectionName}')`) {
                link.classList.add('active');
            }
        });
        
        // Прокрутка к верху с плавной анимацией
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Обновляем статистику для текущей секции
        if (sectionName === 'hero') {
            updateHomePageStats();
        }
    }
    
    // Загрузить данные для секции
    switch(sectionName) {
        case 'properties':
            showProperties();
            break;
        case 'cities':
            loadCitiesDisplay();
            break;
        case 'profile':
            showProfile();
            break;
        case 'my-properties':
            showMyProperties();
            break;
        case 'admin-panel':
            showAdminPanel();
            break;
        case 'admin-moderation':
            showAdminModeration();
            break;
        case 'database-management':
            showDatabaseManagement();
            break;
        case 'reviews-received':
            loadReviews('received');
            break;
    }
}

// Обновление статистики на главной странице
function updateHomePageStats() {
    const stats = getHomeStats();
    
    // Обновляем счетчик торговых площадей
    const propertyCountElement = document.querySelector('.hero-subtitle .accent-text[data-count]');
    if (propertyCountElement) {
        propertyCountElement.setAttribute('data-count', stats.totalProperties);
        propertyCountElement.textContent = stats.totalProperties;
    }
    
    // Обновляем счетчики в статистике
    const statNumbers = document.querySelectorAll('.glass-stats .stat-number');
    if (statNumbers.length >= 3) {
        // Торговых площадей
        statNumbers[0].setAttribute('data-count', stats.totalProperties);
        animateCounter(statNumbers[0], stats.totalProperties);
        
        // Довольных клиентов (пользователей)
        statNumbers[1].setAttribute('data-count', stats.totalUsers);
        animateCounter(statNumbers[1], stats.totalUsers);
        
        // 24/7 поддержка (не меняем)
    }
    
    // Обновляем текст на странице площадок
    updatePropertiesCount();
}

// Загрузка отображения городов с разными значками
function loadCitiesDisplay() {
    const cities = getCities();
    const container = document.getElementById('cities-list');
    
    if (!container) return;
    
    // Разные значки для городов
    const cityIcons = {
        'Минск': '🏙️', 'Гомель': '🏢', 'Могилёв': '🏛️', 'Витебск': '⛪',
        'Гродно': '🏰', 'Брест': '🕌', 'Барановичи': '🏘️', 'Борисов': '🏭',
        'Пинск': '⛲', 'Орша': '🏞️'
    };
    
    container.innerHTML = cities.map(city => {
        const propertiesCount = getCityTradingPointsCount(city);
        const hasProperties = propertiesCount > 0;
        const icon = cityIcons[city] || '🏠';
        
        return `
            <div class="city-card hover-lift" onclick="showCityProperties('${city}')">
                <div class="city-icon" style="font-size: 3.5rem;">
                    ${icon}
                </div>
                <h3 class="city-name gradient-text">${city}</h3>
                <p class="city-properties ${hasProperties ? 'has-properties' : 'no-properties'}">
                    ${hasProperties ? 
                        `✅ ${propertiesCount} площадок` : 
                        `❌ Площадок пока нет`
                    }
                </p>
                ${hasProperties ? `
                    <button class="btn btn-glass btn-sm" onclick="event.stopPropagation(); showCityProperties('${city}')" style="margin-top: 1rem;">
                        Смотреть площадки
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showCityProperties(city) {
    document.getElementById('city-filter').value = city;
    showSection('properties');
    filterProperties();
}

// Авторизация
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = findUser(username, password);
    
    if (user) {
        setCurrentUser(user);
        currentUser = user;
        showInterface();
        document.getElementById('login-form').reset();
        showSuccessNotification('Вход выполнен успешно!');
        
        updateModerationCounter();
        showSection('hero');
    } else {
        showErrorNotification('Неверный логин или пароль');
    }
}

// Регистрация
function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const birthdate = document.getElementById('reg-birthdate').value;
    
    // Валидация
    if (!/^[a-zA-Z0-9*&^%$#@]{3,20}$/.test(username)) {
        showErrorNotification('Логин должен содержать от 3 до 20 символов (буквы, цифры, *&^%$#@)');
        return;
    }
    
    if (password.length < 8) {
        showErrorNotification('Пароль должен содержать минимум 8 символов');
        return;
    }
    
    if (!/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(name)) {
        showErrorNotification('ФИО должно быть в формате: Фамилия Имя Отчество');
        return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showErrorNotification('Введите корректный email адрес');
        return;
    }
    
    const phoneRegex = /^\+375\((25|29|33|44|17)\)\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
        showErrorNotification('Телефон должен быть в формате: +375(XX)XXX-XX-XX');
        return;
    }
    
    if (!birthdate) {
        showErrorNotification('Укажите дату рождения');
        return;
    }
    
    try {
        const userData = {
            username,
            password,
            role: 'user',
            name,
            email,
            phone,
            birthdate: new Date(birthdate).toISOString()
        };
        
        const newUser = registerUser(userData);
        setCurrentUser(newUser);
        currentUser = newUser;
        showInterface();
        document.getElementById('register-form').reset();
        showSuccessNotification('Регистрация успешна!');
        
        updateModerationCounter();
        showSection('hero');
    } catch (error) {
        showErrorNotification(error.message);
    }
}

function checkAuth() {
    const user = getCurrentUser();
    if (user) {
        currentUser = user;
        showInterface();
    } else {
        showGuestInterface();
    }
}

function showGuestInterface() {
    const guestNav = document.getElementById('guest-nav');
    const mainNav = document.getElementById('main-nav');
    
    if (guestNav) guestNav.style.display = 'flex';
    if (mainNav) mainNav.style.display = 'none';
}

function showInterface() {
    const guestNav = document.getElementById('guest-nav');
    const mainNav = document.getElementById('main-nav');
    
    if (guestNav) guestNav.style.display = 'none';
    if (mainNav) mainNav.style.display = 'flex';
    
    const navAvatar = document.getElementById('nav-avatar');
    const userName = document.getElementById('user-name');
    
    if (navAvatar && currentUser) {
        navAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    
    if (userName && currentUser) {
        userName.textContent = currentUser.name.split(' ')[1] || currentUser.name;
    }
    
    // Показываем соответствующие разделы для ролей
    if (currentUser) {
        if (currentUser.role === 'admin') {
            document.getElementById('admin-nav').style.display = 'inline-flex';
            document.getElementById('user-nav').style.display = 'none';
            document.getElementById('user-dropdown-nav').style.display = 'none';
            
            updateModerationCounter();
        } else {
            document.getElementById('admin-nav').style.display = 'none';
            document.getElementById('user-nav').style.display = 'inline-flex';
            document.getElementById('user-dropdown-nav').style.display = 'inline';
        }
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        logoutUser();
        currentUser = null;
        showGuestInterface();
        showSection('hero');
        showSuccessNotification('Вы успешно вышли из системы');
    }
}

// Обновление счетчика модерации
function updateModerationCounter() {
    if (currentUser && currentUser.role === 'admin') {
        const pendingCount = getPendingProperties().length;
        const moderationBadge = document.getElementById('moderation-badge');
        
        if (moderationBadge) {
            if (pendingCount > 0) {
                moderationBadge.textContent = pendingCount;
                moderationBadge.style.display = 'inline';
            } else {
                moderationBadge.style.display = 'none';
            }
        }
    }
}

// Отображение площадок с анимациями
function showProperties() {
    const properties = getApprovedProperties();
    const container = document.getElementById('properties-list');
    
    if (!container) return;
    
    updatePropertiesCount();
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #666; margin-bottom: 1rem; animation: bounce 2s infinite;">🏪</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">Нет доступных площадок</h3>
                <p style="color: var(--light-2);">Станьте первым арендодателем!</p>
                ${currentUser ? `
                    <button class="btn btn-primary" onclick="showSection('add-property')" style="margin-top: 1rem;">
                        Добавить площадку
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="showAuthPrompt()" style="margin-top: 1rem;">
                        Зарегистрироваться
                    </button>
                `}
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        const timeAgo = getTimeAgo(property.createdAt);
        const reviews = getReviewsForProperty(property.id);
        const avgRating = reviews.length > 0 ? 
            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 
            'Нет отзывов';
        
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <div class="property-badge status-approved">Одобрено</div>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 100)}...</p>
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-star"></i>
                        <span>${avgRating}</span>
                    </div>
                </div>
                <div class="price">$${property.dailyRentPrice}/день</div>
                <div class="payment-type">
                    <i class="fas fa-calendar"></i> Посуточная аренда
                    <span class="time-badge">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                <button class="btn btn-primary contact-btn" onclick="event.stopPropagation(); openPropertyModal(${property.id})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        `;
    }).join('');
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} д назад`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} нед назад`;
    return date.toLocaleDateString('ru-RU');
}

function updatePropertiesCount() {
    const properties = getApprovedProperties();
    const countElement = document.getElementById('properties-count');
    const countText = document.getElementById('properties-count-text');
    
    if (countElement) {
        animateCounter(countElement, properties.length);
    }
    
    if (countText) {
        countText.innerHTML = `Найдено <span id="properties-count" class="accent-text">${properties.length}</span> объектов`;
    }
}

// Профиль пользователя
function showProfile() {
    if (!currentUser) return;
    
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profileBirthdate = document.getElementById('profile-birthdate');
    const profileDate = document.getElementById('profile-date');
    const profileAvatar = document.getElementById('profile-avatar');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileRole) {
        profileRole.textContent = currentUser.role === 'admin' ? 'Администратор' : 'Пользователь';
        profileRole.className = currentUser.role === 'admin' ? 'profile-role admin' : 'profile-role user';
    }
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone;
    if (profileBirthdate) profileBirthdate.textContent = currentUser.birthdate ? new Date(currentUser.birthdate).toLocaleDateString('ru-RU') : 'Не указана';
    if (profileDate) profileDate.textContent = new Date(currentUser.registrationDate).toLocaleDateString('ru-RU');
    if (profileAvatar) profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Обновляем статистику пользователя (только для обычных пользователей)
    if (currentUser.role !== 'admin') {
        const userProperties = getUserProperties(currentUser.id);
        const pendingCount = userProperties.filter(p => p.status === 'pending').length;
        const approvedCount = userProperties.filter(p => p.status === 'approved').length;
        const userReviews = getReviewsForUser(currentUser.id);
        const avgRating = userReviews.length > 0 ? 
            (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1) : 
            '0';
        
        const userPropertiesCount = document.getElementById('user-properties-count');
        const userPendingCount = document.getElementById('user-pending-count');
        const userApprovedCount = document.getElementById('user-approved-count');
        
        if (userPropertiesCount) animateCounter(userPropertiesCount, userProperties.length);
        if (userPendingCount) animateCounter(userPendingCount, pendingCount);
        if (userApprovedCount) animateCounter(userApprovedCount, approvedCount);
    } else {
        // Для админа скрываем статистику площадок
        document.querySelector('.profile-stats').style.display = 'none';
    }
}

// Мои площадки
function showMyProperties() {
    if (!currentUser || currentUser.role === 'admin') {
        showErrorNotification('Эта функция доступна только пользователям');
        return;
    }
    
    const properties = getUserProperties(currentUser.id);
    const container = document.getElementById('my-properties-list');
    const countElement = document.getElementById('my-properties-count');
    
    if (!container) return;
    
    if (countElement) {
        animateCounter(countElement, properties.length);
    }
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #666; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">🏪</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">У вас пока нет площадок</h3>
                <p style="color: var(--light-2);">Добавьте свою первую торговую площадь!</p>
                <button class="btn btn-primary" onclick="showSection('add-property')" style="margin-top: 1rem;">
                    Добавить площадку
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const statusText = property.status === 'approved' ? 'Одобрено' : 
                         property.status === 'pending' ? 'На модерации' : 'Отклонено';
        const statusClass = property.status === 'approved' ? 'status-approved' : 
                          property.status === 'pending' ? 'status-pending' : 'status-rejected';
        const timeAgo = getTimeAgo(property.createdAt);
        
        return `
            <div class="property-card">
                <span class="property-badge ${statusClass}">${statusText}</span>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description}</p>
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                </div>
                <div class="price">$${property.dailyRentPrice}/день</div>
                <div class="payment-type">
                    <i class="fas fa-calendar"></i> Посуточная аренда
                    <span class="time-badge">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                
                <div class="property-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-danger" onclick="deletePropertyById(${property.id})" style="flex: 1;">
                        Удалить
                    </button>
                    ${property.status === 'rejected' ? `
                        <button class="btn btn-primary" onclick="editProperty(${property.id})" style="flex: 1;">
                            Редактировать
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Добавление новой площадки
function addNewProperty() {
    if (!currentUser) {
        showErrorNotification('Для добавления площадки необходимо войти в систему');
        return;
    }
    
    const title = document.getElementById('title').value;
    const area = parseInt(document.getElementById('area').value);
    const floor = parseInt(document.getElementById('floor').value);
    const price = parseInt(document.getElementById('price').value);
    const city = document.getElementById('property-city').value;
    const description = document.getElementById('description').value;
    const address = document.getElementById('address').value;
    const imageUrl = document.getElementById('image-url').value;
    const hasAirConditioning = document.getElementById('air-conditioning').value === 'true';
    
    // Сбор выбранных особенностей
    const selectedFeatures = [];
    document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
        selectedFeatures.push(checkbox.value);
    });
    
    // Валидация
    if (area <= 0 || price <= 0 || floor < 0) {
        showErrorNotification('Все числовые поля должны быть положительными');
        return;
    }
    
    if (!city) {
        showErrorNotification('Выберите город');
        return;
    }
    
    const newProperty = {
        title,
        description,
        area,
        floor,
        dailyRentPrice: price,
        hasAirConditioning,
        address,
        city,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        images: [imageUrl],
        features: selectedFeatures
    };
    
    try {
        addProperty(newProperty);
        document.getElementById('add-property-form').reset();
        showSuccessNotification('Площадка отправлена на модерацию!');
        
        updateModerationCounter();
        showSection('my-properties');
    } catch (error) {
        showErrorNotification('Ошибка при добавлении площадки');
    }
}

// Админ-панель с реальной статистикой
function showAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorNotification('Доступ запрещен');
        return;
    }
    
    const stats = getDetailedAdminStats();
    
    const totalProperties = document.getElementById('total-properties');
    const pendingProperties = document.getElementById('pending-properties');
    const totalUsers = document.getElementById('total-users');
    const activeListings = document.getElementById('active-listings');
    
    if (totalProperties) animateCounter(totalProperties, stats.totalTradingPoints);
    if (pendingProperties) animateCounter(pendingProperties, stats.pendingTradingPoints);
    if (totalUsers) animateCounter(totalUsers, stats.totalUsers);
    if (activeListings) animateCounter(activeListings, stats.approvedTradingPoints);
    
    // Добавляем дополнительную статистику
    const adminContainer = document.querySelector('#admin-panel-section .container');
    if (adminContainer && !document.getElementById('detailed-stats')) {
        const detailedStats = `
            <div class="glass-card" style="margin-top: 2rem; padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--light-1);">Детальная статистика</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${stats.averageRating}</div>
                        <div style="color: var(--light-2); font-size: 0.9rem;">Средний рейтинг</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--success);">${stats.monthlyGrowth}%</div>
                        <div style="color: var(--light-2); font-size: 0.9rem;">Рост за месяц</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--warning);">${stats.activeClients}</div>
                        <div style="color: var(--light-2); font-size: 0.9rem;">Активные клиенты</div>
                    </div>
                </div>
            </div>
        `;
        
        const detailedStatsDiv = document.createElement('div');
        detailedStatsDiv.id = 'detailed-stats';
        detailedStatsDiv.innerHTML = detailedStats;
        adminContainer.appendChild(detailedStatsDiv);
    }
}

// Модерация для админа с полным просмотром анкет
function showAdminModeration() {
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorNotification('Доступ запрещен');
        return;
    }
    
    const pendingProperties = getPendingProperties();
    const container = document.getElementById('moderation-list');
    const countElement = document.getElementById('moderation-count');
    
    if (!container) return;
    
    if (countElement) {
        animateCounter(countElement, pendingProperties.length);
    }
    
    if (pendingProperties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #666; margin-bottom: 1rem; animation: spin 2s linear infinite;">✅</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">Нет заявок на модерации</h3>
                <p style="color: var(--light-2);">Все заявки проверены и обработаны.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pendingProperties.map(property => {
        const owner = getUserById(property.ownerId);
        const timeAgo = getTimeAgo(property.createdAt);
        
        return `
            <div class="property-card">
                <span class="property-badge status-pending">На модерации</span>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description}</p>
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${owner.name}</span>
                    </div>
                </div>
                <div class="price">$${property.dailyRentPrice}/день</div>
                <div class="payment-type">
                    <i class="fas fa-calendar"></i> Посуточная аренда
                    <span class="time-badge">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-glass" onclick="viewFullPropertyDetails(${property.id})" style="flex: 1;">
                        <i class="fas fa-eye"></i> Полный просмотр
                    </button>
                </div>
                
                <div class="admin-actions-modal" style="margin-top: 1rem;">
                    <button class="btn btn-success" onclick="approveProperty(${property.id})" style="flex: 1;">
                        <i class="fas fa-check"></i> Одобрить
                    </button>
                    <button class="btn btn-danger" onclick="openRejectModal(${property.id})" style="flex: 1;">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Полный просмотр анкеты для модерации
function viewFullPropertyDetails(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    const owner = getUserById(property.ownerId);
    const featureNames = {
        'security': 'Система безопасности',
        'parking': 'Парковка',
        'internet': 'Интернет',
        'heating': 'Отопление',
        'storage': 'Складское помещение',
        'windows': 'Витринные окна',
        'entrance': 'Отдельный вход'
    };
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">Полная информация о площадке</h2>
        <div style="margin-bottom: 1.5rem;">
            <span class="property-badge status-pending">На модерации</span>
        </div>
        
        <div style="position: relative; margin-bottom: 1.5rem;">
            <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px;">
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">${property.title}</h3>
            <p style="color: var(--light-2); line-height: 1.6;">${property.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <div style="color: var(--light-2); font-size: 0.9rem; margin-bottom: 0.25rem;">Площадь</div>
                <div style="color: var(--light-1); font-weight: 600;">${property.area} м²</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <div style="color: var(--light-2); font-size: 0.9rem; margin-bottom: 0.25rem;">Этаж</div>
                <div style="color: var(--light-1); font-weight: 600;">${property.floor}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <div style="color: var(--light-2); font-size: 0.9rem; margin-bottom: 0.25rem;">Цена</div>
                <div style="color: var(--light-1); font-weight: 600;">$${property.dailyRentPrice}/день</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <div style="color: var(--light-2); font-size: 0.9rem; margin-bottom: 0.25rem;">Город</div>
                <div style="color: var(--light-1); font-weight: 600;">${property.city}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Адрес</h3>
            <p style="color: var(--light-2);">${property.address}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Дополнительная информация</h3>
            <div style="color: var(--light-2);">
                <div style="margin-bottom: 0.5rem;">Кондиционер: ${property.hasAirConditioning ? 'Есть' : 'Нет'}</div>
                <div style="margin-bottom: 0.5rem;">Дата добавления: ${new Date(property.createdAt).toLocaleDateString('ru-RU')}</div>
                <div>Код площадки: ${property.code}</div>
            </div>
        </div>
        
        ${property.features.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Особенности</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${property.features.map(feature => `
                        <span style="background: rgba(139, 92, 246, 0.1); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; color: var(--primary); border: 1px solid rgba(139, 92, 246, 0.2);">
                            ${featureNames[feature] || feature}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Информация о владельце</h3>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                        ${owner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style="color: var(--light-1); font-weight: 600;">${owner.name}</div>
                        <div style="color: var(--light-2); font-size: 0.9rem;">${owner.email}</div>
                    </div>
                </div>
                <div style="color: var(--light-2); font-size: 0.9rem;">
                    <div>Телефон: ${owner.phone}</div>
                    <div>Дата регистрации: ${new Date(owner.registrationDate).toLocaleDateString('ru-RU')}</div>
                </div>
            </div>
        </div>
        
        <div class="admin-actions-modal" style="margin-top: 1.5rem;">
            <button class="btn btn-success" onclick="approveProperty(${property.id}); closeModal();" style="flex: 1;">
                <i class="fas fa-check"></i> Одобрить
            </button>
            <button class="btn btn-danger" onclick="openRejectModal(${property.id}); closeModal();" style="flex: 1;">
                <i class="fas fa-times"></i> Отклонить
            </button>
        </div>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function approveProperty(propertyId) {
    if (updatePropertyStatus(propertyId, 'approved')) {
        showSuccessNotification('Площадка одобрена!');
        showAdminModeration();
        updateModerationCounter();
    }
}

function openRejectModal(propertyId) {
    currentRejectPropertyId = propertyId;
    document.getElementById('reject-modal').style.display = 'flex';
}

function closeRejectModal() {
    document.getElementById('reject-modal').style.display = 'none';
    currentRejectPropertyId = null;
    document.getElementById('reject-reason').value = '';
}

function submitRejection() {
    const rejectReason = document.getElementById('reject-reason').value;
    
    if (!rejectReason) {
        showErrorNotification('Укажите причину отклонения');
        return;
    }
    
    if (updatePropertyStatus(currentRejectPropertyId, 'rejected', rejectReason)) {
        showSuccessNotification('Площадка отклонена!');
        closeRejectModal();
        showAdminModeration();
        updateModerationCounter();
    }
}

function deletePropertyById(propertyId) {
    if (confirm('Вы уверены, что хотите удалить эту площадку?')) {
        if (deleteProperty(propertyId)) {
            showSuccessNotification('Площадка удалена!');
            showMyProperties();
        }
    }
}

// Фильтрация площадок
function filterProperties() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const city = document.getElementById('city-filter').value;
    const area = document.getElementById('area-filter').value;
    const price = document.getElementById('price-filter').value;
    
    const filters = { search, city, area, price };
    const properties = searchProperties(filters);
    const container = document.getElementById('properties-list');
    const countElement = document.getElementById('properties-count');
    const countText = document.getElementById('properties-count-text');
    
    if (!container) return;
    
    if (countElement) {
        animateCounter(countElement, properties.length);
    }
    
    if (countText) {
        countText.innerHTML = `Найдено <span id="properties-count" class="accent-text">${properties.length}</span> объектов`;
    }
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #666; margin-bottom: 1rem; animation: shake 0.5s ease-in-out;">🔍</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">Ничего не найдено</h3>
                <p style="color: var(--light-2);">Попробуйте изменить параметры поиска</p>
                <button class="btn btn-glass" onclick="resetFilters()" style="margin-top: 1rem;">
                    Сбросить фильтры
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const timeAgo = getTimeAgo(property.createdAt);
        const reviews = getReviewsForProperty(property.id);
        const avgRating = reviews.length > 0 ? 
            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 
            'Нет отзывов';
        
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <div class="property-badge status-approved">Одобрено</div>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 100)}...</p>
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-star"></i>
                        <span>${avgRating}</span>
                    </div>
                </div>
                <div class="price">$${property.dailyRentPrice}/день</div>
                <div class="payment-type">
                    <i class="fas fa-calendar"></i> Посуточная аренда
                    <span class="time-badge">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                <button class="btn btn-primary contact-btn" onclick="event.stopPropagation(); openPropertyModal(${property.id})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        `;
    }).join('');
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('city-filter').value = '';
    document.getElementById('area-filter').value = '';
    document.getElementById('price-filter').value = '';
    filterProperties();
}

// Модальные окна с анимациями и функцией написания отзыва
function openPropertyModal(propertyId) {
    if (!currentUser) {
        showAuthPrompt();
        return;
    }
    
    const property = getAllProperties().find(p => p.id === propertyId);
    if (!property) return;
    
    const owner = getUserById(property.ownerId);
    const reviews = getReviewsForProperty(propertyId);
    const avgRating = reviews.length > 0 ? 
        (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 
        '0';
    
    currentPropertyModal = property;
    incrementPropertyViews(propertyId);
    
    const featureNames = {
        'security': 'Система безопасности',
        'parking': 'Парковка',
        'internet': 'Интернет',
        'heating': 'Отопление',
        'storage': 'Складское помещение',
        'windows': 'Витринные окна',
        'entrance': 'Отдельный вход'
    };
    
    // Проверяем, оставлял ли текущий пользователь отзыв для этой площадки
    const userReview = reviews.find(review => review.authorId === currentUser.id);
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">${property.title}</h2>
        <div style="position: relative;">
            <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin: 1rem 0;">
            <span class="property-badge status-approved" style="position: absolute; top: 1rem; right: 1rem;">Одобрено</span>
        </div>
        
        <div style="margin: 1rem 0;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Описание</h3>
            <p style="line-height: 1.6; color: var(--light-2);">${property.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
            <div class="detail-item">
                <i class="fas fa-ruler-combined"></i>
                <div>
                    <strong style="color: var(--light-1);">Площадь</strong>
                    <div style="color: var(--light-2);">${property.area} м²</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-dollar-sign"></i>
                <div>
                    <strong style="color: var(--light-1);">Цена</strong>
                    <div style="color: var(--light-2);">$${property.dailyRentPrice}/день</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-layer-group"></i>
                <div>
                    <strong style="color: var(--light-1);">Этаж</strong>
                    <div style="color: var(--light-2);">${property.floor}</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong style="color: var(--light-1);">Город</strong>
                    <div style="color: var(--light-2);">${property.city}</div>
                </div>
            </div>
        </div>
        
        <div style="margin: 1rem 0;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Адрес</h3>
            <p style="color: var(--light-2);">${property.address}</p>
        </div>
        
        ${property.features.length > 0 ? `
            <div style="margin: 1rem 0;">
                <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Особенности</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${property.features.map(feature => `
                        <span style="background: rgba(139, 92, 246, 0.1); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; color: var(--primary); border: 1px solid rgba(139, 92, 246, 0.2);">
                            ${featureNames[feature] || feature}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin: 1rem 0;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Статистика</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${property.views || 0}</div>
                    <div style="color: var(--light-2); font-size: 0.9rem;">Просмотров</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${property.contacts || 0}</div>
                    <div style="color: var(--light-2); font-size: 0.9rem;">Контактов</div>
                </div>
            </div>
        </div>
        
        <div style="margin: 1rem 0;">
            <h3 style="margin-bottom: 0.5rem; color: var(--light-1);">Отзывы о площадке</h3>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <div>
                        <div style="font-weight: 700; font-size: 1.2rem; color: var(--light-1);">${avgRating}</div>
                        <div style="color: var(--light-2);">${reviews.length} отзывов</div>
                    </div>
                    ${currentUser.id !== owner.id && !userReview ? `
                        <button class="btn btn-primary write-review-btn" 
                                data-property-id="${property.id}"
                                data-owner-id="${owner.id}"
                                style="padding: 0.5rem 1rem;">
                            <i class="fas fa-star"></i> Написать отзыв
                        </button>
                    ` : ''}
                </div>
                
                ${reviews.length > 0 ? `
                    <div style="max-height: 200px; overflow-y: auto; margin-top: 1rem;">
                        ${reviews.slice(0, 3).map(review => {
                            const reviewAuthor = getUserById(review.authorId);
                            return `
                                <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <div style="font-weight: 600; color: var(--light-1);">${reviewAuthor.name}</div>
                                        <div style="color: var(--accent);">
                                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <div style="color: var(--light-2); font-size: 0.9rem;">
                                        ${review.comment}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        ${reviews.length > 3 ? `
                            <div style="text-align: center; color: var(--primary); cursor: pointer;" onclick="showAllReviews(${property.id})">
                                Показать все ${reviews.length} отзывов
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <div style="text-align: center; padding: 1rem; color: var(--light-2);">
                        Пока нет отзывов. Будьте первым!
                    </div>
                `}
            </div>
        </div>
        
        <div class="owner-info" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
            <div class="owner-avatar">${owner.name.charAt(0)}</div>
            <div class="owner-details">
                <div class="owner-name">${owner.name}</div>
                <div class="owner-rating">
                    ${avgRating} (${reviews.length} отзывов)
                </div>
            </div>
        </div>
        
        <div style="margin-top: 1rem;">
            <button class="btn btn-primary" onclick="contactOwner(${owner.id}, ${property.id})" style="width: 100%;">
                <i class="fas fa-phone"></i> Связаться с владельцем
            </button>
        </div>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Модальное окно для написания отзыва
function openReviewModal(ownerId, propertyId) {
    currentReviewModalData = { ownerId, propertyId };
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">Написать отзыв</h2>
        <div style="margin: 1.5rem 0;">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--light-1);">Оценка</label>
                <div class="star-rating" style="display: flex; gap: 0.5rem;">
                    ${[1,2,3,4,5].map(star => `
                        <div class="star" data-rating="${star}" 
                             style="font-size: 2rem; color: #666; cursor: pointer; transition: color 0.3s;">
                            ★
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="review-rating" value="5">
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--light-1);">Ваш отзыв</label>
                <textarea id="review-comment" rows="4" 
                          style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: var(--light-1); resize: vertical;"
                          placeholder="Поделитесь вашими впечатлениями о площадке и сотрудничестве..."></textarea>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="submitReview()" style="flex: 1;">
                    <i class="fas fa-paper-plane"></i> Отправить отзыв
                </button>
                <button class="btn btn-glass" onclick="closeReviewModal()" style="flex: 1;">
                    Отмена
                </button>
            </div>
        </div>
    `;
    
    // Инициализация звездного рейтинга
    const stars = modalContent.querySelectorAll('.star');
    let selectedRating = 5;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            document.getElementById('review-rating').value = selectedRating;
            
            stars.forEach((s, index) => {
                s.style.color = index < selectedRating ? 'var(--accent)' : '#666';
            });
        });
        
        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                s.style.color = index < hoverRating ? 'var(--accent-light)' : '#666';
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                s.style.color = index < selectedRating ? 'var(--accent)' : '#666';
            });
        });
    });
    
    // Устанавливаем начальный рейтинг
    stars.forEach((star, index) => {
        star.style.color = index < selectedRating ? 'var(--accent)' : '#666';
    });
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function closeReviewModal() {
    const modal = document.getElementById('property-modal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('modal-content').innerHTML = '';
        currentReviewModalData = null;
    }, 300);
}

function submitReview() {
    if (!currentReviewModalData || !currentUser) return;
    
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    
    if (!comment) {
        showErrorNotification('Пожалуйста, напишите текст отзыва');
        return;
    }
    
    if (comment.length < 10) {
        showErrorNotification('Отзыв должен содержать минимум 10 символов');
        return;
    }
    
    const reviewData = {
        authorId: currentUser.id,
        authorName: currentUser.name,
        targetUserId: currentReviewModalData.ownerId,
        targetPropertyId: currentReviewModalData.propertyId,
        rating: rating,
        comment: comment
    };
    
    try {
        addReview(reviewData);
        showSuccessNotification('Отзыв успешно добавлен!');
        closeReviewModal();
        
        // Обновляем модальное окно с площадкой
        if (currentPropertyModal) {
            openPropertyModal(currentPropertyModal.id);
        }
    } catch (error) {
        showErrorNotification('Ошибка при добавлении отзыва');
    }
}

function showAllReviews(propertyId) {
    const reviews = getReviewsForProperty(propertyId);
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <h2 class="gradient-text">Все отзывы</h2>
        <div style="max-height: 400px; overflow-y: auto; margin-top: 1rem;">
            ${reviews.map(review => {
                const author = getUserById(review.authorId);
                const timeAgo = getTimeAgo(review.createdAt);
                return `
                    <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <div style="font-weight: 600; color: var(--light-1);">${author.name}</div>
                            <div style="color: var(--light-2); font-size: 0.9rem;">${timeAgo}</div>
                        </div>
                        <div style="color: var(--accent); margin-bottom: 0.5rem;">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                        <div style="color: var(--light-2); line-height: 1.5;">
                            ${review.comment}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <button class="btn btn-primary" onclick="closeModal()" style="width: 100%; margin-top: 1rem;">
            Закрыть
        </button>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function contactOwner(ownerId, propertyId) {
    incrementPropertyContacts(propertyId);
    const owner = getUserById(ownerId);
    showSuccessNotification(`Контакты владельца: ${owner.phone}, ${owner.email}`);
}

function closeModal() {
    const modal = document.getElementById('property-modal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('modal-content').innerHTML = '';
        currentPropertyModal = null;
    }, 300);
}

function showAuthPrompt() {
    document.getElementById('auth-prompt-modal').style.display = 'flex';
}

function closeAuthPrompt() {
    const modal = document.getElementById('auth-prompt-modal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function openSupportModal() {
    document.getElementById('support-modal').style.display = 'flex';
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Уведомления с анимациями
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        border-radius: var(--border-radius-lg);
        backdrop-filter: blur(10px);
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 300px;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `
        <div style="font-size: 1.5rem;">${icon}</div>
        <div style="flex: 1;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Управление базой данных
function showDatabaseManagement() {
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorNotification('Доступ запрещен');
        return;
    }
    
    openDatabaseTab('trading-points');
}

function openDatabaseTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    const tab = document.getElementById(`${tabName}-tab`);
    const button = document.querySelector(`.tab-button[onclick="openDatabaseTab('${tabName}')"]`);
    
    if (tab) tab.classList.add('active');
    if (button) button.classList.add('active');
    
    switch(tabName) {
        case 'trading-points':
            loadTradingPointsTable();
            break;
        case 'clients':
            loadClientsTable();
            break;
        case 'rentals':
            loadRentalsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
    }
}

function loadTradingPointsTable() {
    const points = getAllProperties();
    const container = document.getElementById('trading-points-table');
    
    if (!container) return;
    
    container.innerHTML = points.map(point => {
        const owner = getUserById(point.ownerId);
        const statusText = point.status === 'approved' ? 'Одобрено' : 
                         point.status === 'pending' ? 'На модерации' : 'Отклонено';
        const statusClass = point.status === 'approved' ? 'status-approved' : 
                          point.status === 'pending' ? 'status-pending' : 'status-rejected';
        
        return `
            <tr>
                <td>${point.code}</td>
                <td>${point.title}</td>
                <td>${point.city}</td>
                <td>${point.floor}</td>
                <td>${point.area} м²</td>
                <td>${point.hasAirConditioning ? 'Да' : 'Нет'}</td>
                <td>$${point.dailyRentPrice}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-glass" onclick="viewFullPropertyDetails(${point.id})" style="margin-bottom: 0.25rem;">
                        Просмотр
                    </button>
                    ${point.status !== 'approved' ? `
                        <button class="btn btn-sm btn-success" onclick="approveProperty(${point.id})" style="margin-bottom: 0.25rem;">
                            Одобрить
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="adminDeleteProperty(${point.id})">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadClientsTable() {
    const clients = getAllClients();
    const container = document.getElementById('clients-table');
    
    if (!container) return;
    
    container.innerHTML = clients.map(client => {
        return `
            <tr>
                <td>${client.code}</td>
                <td>${client.name}</td>
                <td>${client.contactPerson}</td>
                <td>${client.phone}</td>
                <td>${client.email}</td>
                <td><span class="status-badge status-approved">${client.status === 'active' ? 'Активен' : 'Неактивен'}</span></td>
                <td>
                    <button class="btn btn-sm btn-glass" onclick="viewClientDetails(${client.id})">
                        Просмотр
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClientById(${client.id})">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadRentalsTable() {
    const rentals = getAllRentals();
    const container = document.getElementById('rentals-table');
    
    if (!container) return;
    
    container.innerHTML = rentals.map(rental => {
        const point = getAllProperties().find(p => p.id === rental.tradingPointId);
        const client = getClientById(rental.clientId);
        
        let statusText, statusClass;
        if (rental.status === 'active') {
            statusText = 'Активен';
            statusClass = 'status-approved';
        } else if (rental.status === 'upcoming') {
            statusText = 'Предстоящий';
            statusClass = 'status-pending';
        } else {
            statusText = 'Завершен';
            statusClass = 'status-rejected';
        }
        
        return `
            <tr>
                <td>${rental.code}</td>
                <td>${rental.contractNumber}</td>
                <td>${point ? point.title : 'Не найдено'}</td>
                <td>${client ? client.name : 'Не найдено'}</td>
                <td>${new Date(rental.startDate).toLocaleDateString('ru-RU')}</td>
                <td>${new Date(rental.endDate).toLocaleDateString('ru-RU')}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>$${rental.dailyPrice}</td>
                <td>
                    <button class="btn btn-sm btn-glass" onclick="viewRentalDetails(${rental.id})">
                        Просмотр
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRentalById(${rental.id})">
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadUsersTable() {
    const users = getAllUsers();
    const container = document.getElementById('users-table');
    
    if (!container) return;
    
    container.innerHTML = users.map(user => {
        const userProperties = getUserProperties(user.id);
        const userReviews = getReviewsForUser(user.id);
        const avgRating = userReviews.length > 0 ? 
            (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1) : 
            '0';
        
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${new Date(user.birthdate).toLocaleDateString('ru-RU')}</td>
                <td><span class="status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}">${user.role === 'admin' ? 'Админ' : 'Пользователь'}</span></td>
                <td>${new Date(user.registrationDate).toLocaleDateString('ru-RU')}</td>
                <td>
                    <button class="btn btn-sm btn-glass" onclick="viewUserDetails(${user.id})">
                        Просмотр
                    </button>
                    <div style="font-size: 0.8rem; color: var(--light-2); margin-top: 0.25rem;">
                        ${userProperties.length} площадок, ${avgRating}★
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewClientDetails(clientId) {
    const client = getClientById(clientId);
    if (!client) return;
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">Детали клиента</h2>
        <div style="margin: 1rem 0;">
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Название компании:</strong> <span style="color: var(--light-2);">${client.name}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Контактное лицо:</strong> <span style="color: var(--light-2);">${client.contactPerson}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Телефон:</strong> <span style="color: var(--light-2);">${client.phone}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Email:</strong> <span style="color: var(--light-2);">${client.email}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Адрес:</strong> <span style="color: var(--light-2);">${client.address || 'Не указан'}</span></div>
        </div>
        <button class="btn btn-primary" onclick="closeModal()" style="width: 100%;">
            Закрыть
        </button>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function viewUserDetails(userId) {
    const user = getUserById(userId);
    if (!user) return;
    
    const userProperties = getUserProperties(userId);
    const userReviews = getReviewsForUser(userId);
    const avgRating = userReviews.length > 0 ? 
        (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1) : 
        '0';
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">Профиль пользователя</h2>
        <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">
                ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 style="margin: 0 0 0.5rem 0; color: var(--light-1);">${user.name}</h3>
                <div style="color: var(--light-2);">@${user.username}</div>
            </div>
        </div>
        <div style="margin: 1rem 0;">
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Email:</strong> <span style="color: var(--light-2);">${user.email}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Телефон:</strong> <span style="color: var(--light-2);">${user.phone}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Дата регистрации:</strong> <span style="color: var(--light-2);">${new Date(user.registrationDate).toLocaleDateString('ru-RU')}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Статистика:</strong> 
                <span style="color: var(--light-2);">${userProperties.length} площадок, ${userReviews.length} отзывов, ${avgRating}★</span>
            </div>
        </div>
        <button class="btn btn-primary" onclick="closeModal()" style="width: 100%;">
            Закрыть
        </button>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Функции для админа
function adminDeleteProperty(propertyId) {
    if (confirm('Удалить площадку?')) {
        if (deleteProperty(propertyId)) {
            showSuccessNotification('Площадка удалена!');
            loadTradingPointsTable();
        }
    }
}

function deleteClientById(clientId) {
    if (confirm('Удалить клиента?')) {
        if (deleteClient(clientId)) {
            showSuccessNotification('Клиент удален!');
            loadClientsTable();
        }
    }
}

function deleteRentalById(rentalId) {
    if (confirm('Удалить договор аренды?')) {
        if (deleteRental(rentalId)) {
            showSuccessNotification('Договор удален!');
            loadRentalsTable();
        }
    }
}

// Отзывы
function openReviewsTab(tabName) {
    document.querySelectorAll('#reviews-received-section .tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    document.querySelectorAll('#reviews-received-section .tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    const tab = document.getElementById(`${tabName}-reviews-tab`);
    const button = document.querySelector(`#reviews-received-section .tab-button[onclick*="${tabName}"]`);
    
    if (tab) tab.classList.add('active');
    if (button) button.classList.add('active');
    
    loadReviews(tabName);
}

function loadReviews(tabName) {
    if (!currentUser) return;
    
    if (tabName === 'received') {
        loadReceivedReviews();
    } else if (tabName === 'given') {
        loadGivenReviews();
    }
}

function loadReceivedReviews() {
    const reviews = getReviewsForUser(currentUser.id);
    const container = document.getElementById('received-reviews-list');
    
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; color: #666; margin-bottom: 1rem; animation: pulse 2s infinite;">💬</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">Пока нет отзывов</h3>
                <p style="color: var(--light-2);">Отзывы появятся после аренды ваших площадок</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const author = getUserById(review.authorId);
        const timeAgo = getTimeAgo(review.createdAt);
        const property = review.targetPropertyId ? getPropertyById(review.targetPropertyId) : null;
        
        return `
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div style="font-weight: 700; color: var(--light-1);">${review.authorName}</div>
                    <div style="color: var(--light-2); font-size: 0.9rem;">${timeAgo}</div>
                </div>
                <div style="color: var(--accent); margin-bottom: 0.5rem;">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <div style="color: var(--light-2); line-height: 1.5; margin-bottom: 1rem;">
                    ${review.comment}
                </div>
                ${property ? `
                    <div style="font-size: 0.9rem; color: var(--primary);">
                        <i class="fas fa-store"></i> ${property.title}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function loadGivenReviews() {
    const allReviews = getAllReviews();
    const givenReviews = allReviews.filter(review => review.authorId === currentUser.id);
    const container = document.getElementById('given-reviews-list');
    
    if (!container) return;
    
    if (givenReviews.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; color: #666; margin-bottom: 1rem; animation: pulse 2s infinite;">⭐</div>
                <h3 style="color: var(--light-1); margin-bottom: 0.5rem;">Вы еще не оставляли отзывов</h3>
                <p style="color: var(--light-2);">Оставьте отзыв после аренды площадки</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = givenReviews.map(review => {
        const targetUser = getUserById(review.targetUserId);
        const property = review.targetPropertyId ? getPropertyById(review.targetPropertyId) : null;
        const timeAgo = getTimeAgo(review.createdAt);
        
        return `
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div style="font-weight: 700; color: var(--light-1);">Отзыв для ${targetUser ? targetUser.name : 'Пользователя'}</div>
                    <div style="color: var(--light-2); font-size: 0.9rem;">${timeAgo}</div>
                </div>
                <div style="color: var(--accent); margin-bottom: 0.5rem;">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <div style="color: var(--light-2); line-height: 1.5; margin-bottom: 1rem;">
                    ${review.comment}
                </div>
                ${property ? `
                    <div style="font-size: 0.9rem; color: var(--primary);">
                        <i class="fas fa-store"></i> ${property.title}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Вспомогательные функции
function getCityTradingPointsCount(city) {
    const points = getPropertiesByCity(city);
    return points.length;
}

function editProperty(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    // Заполняем форму редактирования
    document.getElementById('title').value = property.title;
    document.getElementById('area').value = property.area;
    document.getElementById('floor').value = property.floor;
    document.getElementById('price').value = property.dailyRentPrice;
    document.getElementById('property-city').value = property.city;
    document.getElementById('description').value = property.description;
    document.getElementById('address').value = property.address;
    document.getElementById('image-url').value = property.images[0];
    document.getElementById('air-conditioning').value = property.hasAirConditioning;
    
    // Сбрасываем все чекбоксы
    document.querySelectorAll('input[name="features"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Устанавливаем выбранные особенности
    property.features.forEach(feature => {
        const checkbox = document.querySelector(`input[name="features"][value="${feature}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Удаляем старую площадку
    deleteProperty(propertyId);
    
    // Показываем секцию добавления
    showSection('add-property');
    showSuccessNotification('Площадка загружена для редактирования');
}

// Инициализация кнопок просмотра договоров аренды
function viewRentalDetails(rentalId) {
    const rental = getAllRentals().find(r => r.id === rentalId);
    if (!rental) return;
    
    const point = getAllProperties().find(p => p.id === rental.tradingPointId);
    const client = getClientById(rental.clientId);
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2 class="gradient-text">Детали договора аренды</h2>
        <div style="margin: 1rem 0;">
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Номер договора:</strong> <span style="color: var(--light-2);">${rental.contractNumber}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Торговая точка:</strong> <span style="color: var(--light-2);">${point ? point.title : 'Не найдено'}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Клиент:</strong> <span style="color: var(--light-2);">${client ? client.name : 'Не найдено'}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Дата начала:</strong> <span style="color: var(--light-2);">${new Date(rental.startDate).toLocaleDateString('ru-RU')}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Дата окончания:</strong> <span style="color: var(--light-2);">${new Date(rental.endDate).toLocaleDateString('ru-RU')}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Стоимость в день:</strong> <span style="color: var(--light-2);">$${rental.dailyPrice}</span></div>
            <div style="margin-bottom: 0.5rem;"><strong style="color: var(--light-1);">Статус:</strong> <span style="color: ${rental.status === 'active' ? 'var(--success)' : rental.status === 'upcoming' ? 'var(--warning)' : 'var(--light-2)'};">${rental.status === 'active' ? 'Активен' : rental.status === 'upcoming' ? 'Предстоящий' : 'Завершен'}</span></div>
        </div>
        <button class="btn btn-primary" onclick="closeModal()" style="width: 100%;">
            Закрыть
        </button>
    `;
    
    const modal = document.getElementById('property-modal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Функции пагинации (заглушки)
function prevPage() {
    showErrorNotification('Пагинация находится в разработке');
}

function nextPage() {
    showErrorNotification('Пагинация находится в разработке');
}
