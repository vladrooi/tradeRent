let currentUser = null;
let currentPropertyModal = null;
let currentRejectPropertyId = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    populateCityFilters();
    checkAuth();
    setupEventListeners();
    initializeAnimations();
    setupQuickCitySearch();
    setupParallax();
    showSection('hero');
});

// Настройка обработчиков событий
function setupEventListeners() {
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
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('property-modal');
        const rejectModal = document.getElementById('reject-modal');
        const supportModal = document.getElementById('support-modal');
        
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === rejectModal) {
            closeRejectModal();
        }
        if (event.target === supportModal) {
            closeSupportModal();
        }
    });
}

// Анимации
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out ${entry.target.dataset.delay || '0s'} forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.property-card, .feature-card, .city-card, .stat-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.dataset.delay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Параллакс эффект
function setupParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Быстрый поиск по городам
function setupQuickCitySearch() {
    const citiesList = document.getElementById('cities-list');
    
    if (citiesList) {
        citiesList.addEventListener('click', function(e) {
            const cityCard = e.target.closest('.city-card');
            if (cityCard) {
                const cityName = cityCard.querySelector('.city-name').textContent;
                
                // Устанавливаем фильтр города
                document.getElementById('city-filter').value = cityName;
                
                // Показываем секцию с площадками
                showSection('properties');
                
                // Применяем фильтр
                setTimeout(() => {
                    filterProperties();
                    
                    // Плавная прокрутка к результатам
                    document.getElementById('properties-section').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Показываем уведомление
                    showSuccessNotification(`Показаны площадки в городе ${cityName}`);
                }, 100);
            }
        });
    }
}

// Заполнение фильтров городов
function populateCityFilters() {
    const cities = getCities();
    const cityFilter = document.getElementById('city-filter');
    const propertyCity = document.getElementById('property-city');
    const moderationCity = document.getElementById('moderation-city');
    
    cities.forEach(city => {
        cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
        propertyCity.innerHTML += `<option value="${city}">${city}</option>`;
        moderationCity.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

// Показать секцию
function showSection(sectionName) {
    // Скрыть все секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Скрыть все навигационные ссылки активного класса
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Показать нужную секцию
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
        
        // Прокрутка к верху
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Загрузить данные для секции
    switch(sectionName) {
        case 'properties':
            showProperties();
            break;
        case 'cities':
            showCities();
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
        case 'about':
            showAbout();
            break;
    }
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
    } else {
        showErrorNotification('Неверные данные для входа!');
    }
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    
    try {
        const userData = {
            username,
            password,
            role: 'user',
            name,
            email,
            phone
        };
        
        const newUser = registerUser(userData);
        setCurrentUser(newUser);
        currentUser = newUser;
        showInterface();
        document.getElementById('register-form').reset();
        showSuccessNotification('Регистрация успешна! Добро пожаловать!');
        
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
    document.getElementById('guest-nav').style.display = 'flex';
    document.getElementById('main-nav').style.display = 'none';
}

function showInterface() {
    document.getElementById('guest-nav').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    
    const navAvatar = document.getElementById('nav-avatar');
    const userName = document.getElementById('user-name');
    
    navAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    userName.textContent = currentUser.name;
    
    // Показываем соответствующие разделы для ролей
    if (currentUser.role === 'admin') {
        document.getElementById('admin-nav').style.display = 'inline';
        showSection('admin-panel');
    } else {
        showSection('properties');
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

// Отображение площадок
function showProperties() {
    const properties = getApprovedProperties();
    const container = document.getElementById('properties-list');
    
    updatePropertiesCount();
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #e5e7eb; margin-bottom: 1rem;">🏪</div>
                <h3>Нет доступных площадок</h3>
                <p>Станьте первым арендодателем!</p>
                ${currentUser ? `
                    <button class="btn btn-primary" onclick="showSection('add-property')" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i> Добавить площадку
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <div class="property-badge status-approved">Одобрено</div>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 120)}...</p>
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
                        <i class="fas fa-eye"></i>
                        <span>${property.views || 0} просмотров</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${property.contacts || 0} контактов</span>
                    </div>
                </div>
                <div class="price">$${property.price.toLocaleString()}/месяц</div>
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div class="owner-rating">
                            <span class="stars">${getRatingStars(4.5)}</span>
                            4.5
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary contact-btn" onclick="event.stopPropagation(); openPropertyModal(${property.id})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        `;
    }).join('');
}

function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function updatePropertiesCount() {
    const properties = getApprovedProperties();
    document.getElementById('properties-count').textContent = properties.length;
}

// Показ городов
function showCities() {
    const cities = getCities();
    const container = document.getElementById('cities-list');
    
    container.innerHTML = cities.map(city => {
        const propertiesCount = getCityPropertiesCount(city);
        const hasProperties = propertiesCount > 0;
        const icons = ['🏙️', '🏛️', '🌉', '🏰', '🌃', '🎡'];
        const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];
        
        return `
            <div class="city-card hover-lift" style="border-color: ${colors[cities.indexOf(city) % colors.length]}20;">
                <div class="city-icon" style="color: ${colors[cities.indexOf(city) % colors.length]}">
                    ${icons[cities.indexOf(city) % icons.length]}
                </div>
                <h3 class="city-name gradient-text">${city}</h3>
                <p class="city-properties ${hasProperties ? 'has-properties' : 'no-properties'}">
                    ${hasProperties ? 
                        `✅ ${propertiesCount} площадок в аренду` : 
                        '❌ Нет доступных площадок'
                    }
                </p>
                ${hasProperties ? `
                    <div style="margin-top: 1.5rem;">
                        <button class="btn btn-primary" onclick="event.stopPropagation();">
                            <i class="fas fa-search"></i> Смотреть площадки
                        </button>
                    </div>
                ` : `
                    <div style="margin-top: 1.5rem;">
                        <button class="btn btn-outline" onclick="event.stopPropagation(); showSection('add-property')">
                            <i class="fas fa-plus"></i> Стать первым
                        </button>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function showCityProperties(city) {
    const properties = getPropertiesByCity(city);
    const container = document.getElementById('properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #e5e7eb; margin-bottom: 1rem;">🏙️</div>
                <h3>${city}</h3>
                <p>В этом городе пока нет доступных торговых площадей.</p>
                ${currentUser ? `
                    <p>Станьте первым арендодателем в этом городе!</p>
                    <button class="btn btn-primary" onclick="showSection('add-property')" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i> Добавить площадку
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="showSection('register')" style="margin-top: 1rem;">
                        <i class="fas fa-user-plus"></i> Зарегистрироваться
                    </button>
                `}
            </div>
        `;
    } else {
        container.innerHTML = properties.map(property => {
            const owner = getUserById(property.ownerId);
            return `
                <div class="property-card" onclick="openPropertyModal(${property.id})">
                    <div class="property-badge status-approved">Одобрено</div>
                    <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                    <h3 class="property-title">${property.title}</h3>
                    <p class="property-description">${property.description.substring(0, 120)}...</p>
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
                    <div class="price">$${property.price.toLocaleString()}/месяц</div>
                    <div class="owner-info">
                        <div class="owner-avatar">${owner.name.charAt(0)}</div>
                        <div class="owner-details">
                            <div class="owner-name">${owner.name}</div>
                            <div class="owner-rating">
                                <span class="stars">${getRatingStars(4.5)}</span>
                                4.5
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary contact-btn" onclick="event.stopPropagation(); openPropertyModal(${property.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                </div>
            `;
        }).join('');
    }
    
    showSection('properties');
}

// Профиль пользователя
function showProfile() {
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profileDate = document.getElementById('profile-date');
    const profileAvatar = document.getElementById('profile-avatar');
    
    profileName.textContent = currentUser.name;
    profileRole.textContent = currentUser.role === 'admin' ? 'Администратор' : 'Пользователь';
    profileEmail.textContent = currentUser.email;
    profilePhone.textContent = currentUser.phone;
    profileDate.textContent = new Date(currentUser.registrationDate).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Обновляем статистику пользователя
    if (currentUser.role !== 'admin') {
        const userProperties = getUserProperties(currentUser.id);
        const pendingCount = userProperties.filter(p => p.status === 'pending').length;
        const approvedCount = userProperties.filter(p => p.status === 'approved').length;
        
        document.getElementById('user-properties-count').textContent = userProperties.length;
        document.getElementById('user-pending-count').textContent = pendingCount;
        document.getElementById('user-approved-count').textContent = approvedCount;
        
        document.getElementById('user-stats').style.display = 'grid';
    } else {
        document.getElementById('user-stats').style.display = 'none';
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
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #e5e7eb; margin-bottom: 1rem;">🏪</div>
                <h3>У вас пока нет площадок</h3>
                <p>Добавьте свою первую торговую площадь и начните получать заявки!</p>
                <button class="btn btn-primary" onclick="showSection('add-property')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Добавить площадку
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
                    <div class="detail-item">
                        <i class="fas fa-eye"></i>
                        <span>${property.views || 0} просмотров</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${property.contacts || 0} контактов</span>
                    </div>
                </div>
                <div class="price">$${property.price.toLocaleString()}/месяц</div>
                ${property.rejectReason ? `
                    <div style="background: #fee2e2; padding: 1rem; border-radius: 8px; margin-top: 1rem; border-left: 4px solid #ef4444;">
                        <strong style="color: #dc2626;">Причина отклонения:</strong>
                        <p style="color: #b91c1c; margin: 0.5rem 0 0 0;">${property.rejectReason}</p>
                    </div>
                ` : ''}
                <div class="moderation-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-danger" onclick="deletePropertyById(${property.id})" style="flex: 1;">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                    ${property.status === 'rejected' ? `
                        <button class="btn btn-primary" onclick="editProperty(${property.id})" style="flex: 1;">
                            <i class="fas fa-edit"></i> Редактировать
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
    const price = parseInt(document.getElementById('price').value);
    const city = document.getElementById('property-city').value;
    const description = document.getElementById('description').value;
    const address = document.getElementById('address').value;
    const imageUrl = document.getElementById('image-url').value;
    
    // Валидация
    if (area <= 0) {
        showErrorNotification('Площадь должна быть положительным числом');
        return;
    }
    
    if (price <= 0) {
        showErrorNotification('Цена должна быть положительным числом');
        return;
    }
    
    const newProperty = {
        title,
        description,
        area,
        price,
        address,
        city,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        images: [imageUrl],
        features: []
    };
    
    try {
        addProperty(newProperty);
        document.getElementById('add-property-form').reset();
        showSuccessNotification('Площадка отправлена на модерацию! Мы проверим её в ближайшее время.');
        showSection('my-properties');
    } catch (error) {
        showErrorNotification('Ошибка при добавлении площадки: ' + error.message);
    }
}

// Админ-панель
function showAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorNotification('Доступ запрещен');
        return;
    }
    
    const stats = getAdminStats();
    
    // Анимируем счетчики
    setTimeout(() => {
        animateCounter(document.getElementById('total-properties'), stats.totalProperties);
        animateCounter(document.getElementById('pending-properties'), stats.pendingProperties);
        animateCounter(document.getElementById('total-users'), stats.totalUsers);
        animateCounter(document.getElementById('active-listings'), stats.approvedProperties);
    }, 500);
}

// Анимация счетчиков
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Модерация для админа
function showAdminModeration() {
    if (!currentUser || currentUser.role !== 'admin') {
        showErrorNotification('Доступ запрещен');
        return;
    }
    
    const pendingProperties = getPendingProperties();
    const container = document.getElementById('moderation-list');
    
    if (pendingProperties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #e5e7eb; margin-bottom: 1rem;">✅</div>
                <h3>Нет заявок на модерацию</h3>
                <p>Все заявки проверены и обработаны.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pendingProperties.map(property => {
        const owner = getUserById(property.ownerId);
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
                        <span>${property.ownerName}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(property.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>
                <div class="price">$${property.price.toLocaleString()}/месяц</div>
                <div class="admin-actions-modal">
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

// Функции модерации
function approveProperty(propertyId) {
    if (updatePropertyStatus(propertyId, 'approved')) {
        showSuccessNotification('Площадка одобрена и теперь видна пользователям!');
        showAdminModeration();
    } else {
        showErrorNotification('Ошибка при одобрении площадки');
    }
}

function openRejectModal(propertyId) {
    currentRejectPropertyId = propertyId;
    document.getElementById('reject-modal').style.display = 'block';
}

function closeRejectModal() {
    document.getElementById('reject-modal').style.display = 'none';
    currentRejectPropertyId = null;
    document.getElementById('reject-reason').value = '';
}

function submitRejection() {
    const reason = document.getElementById('reject-reason').value;
    if (!reason) {
        showErrorNotification('Укажите причину отклонения');
        return;
    }
    
    if (reason.length < 10) {
        showErrorNotification('Причина отклонения должна содержать не менее 10 символов');
        return;
    }
    
    if (updatePropertyStatus(currentRejectPropertyId, 'rejected', reason)) {
        showSuccessNotification('Площадка отклонена! Владелец получит уведомление с причиной.');
        closeRejectModal();
        showAdminModeration();
    } else {
        showErrorNotification('Ошибка при отклонении площадки');
    }
}

// Удаление площадки
function deletePropertyById(propertyId) {
    if (confirm('Вы уверены, что хотите удалить эту площадку? Это действие нельзя отменить.')) {
        if (deleteProperty(propertyId)) {
            showSuccessNotification('Площадка успешно удалена!');
            showMyProperties();
        } else {
            showErrorNotification('Ошибка при удалении площадки');
        }
    }
}

// Фильтрация
function filterProperties() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const city = document.getElementById('city-filter').value;
    const area = document.getElementById('area-filter').value;
    const price = document.getElementById('price-filter').value;
    
    const filters = {
        search: search,
        city: city,
        area: area,
        price: price
    };
    
    const properties = searchProperties(filters);
    const container = document.getElementById('properties-list');
    document.getElementById('properties-count').textContent = properties.length;
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card text-center" style="grid-column: 1 / -1;">
                <div style="font-size: 4rem; color: #e5e7eb; margin-bottom: 1rem;">🔍</div>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                <button class="btn btn-outline" onclick="resetFilters()" style="margin-top: 1rem;">
                    <i class="fas fa-refresh"></i> Сбросить фильтры
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <div class="property-badge status-approved">Одобрено</div>
                <img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 120)}...</p>
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
                <div class="price">$${property.price.toLocaleString()}/месяц</div>
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div class="owner-rating">
                            <span class="stars">${getRatingStars(4.5)}</span>
                            4.5
                        </div>
                    </div>
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

function filterModeration() {
    // Реализация фильтрации для модерации
    showAdminModeration();
}

// Модальные окна
function openPropertyModal(propertyId) {
    const property = getAllProperties().find(p => p.id === propertyId);
    if (!property) return;
    
    const owner = getUserById(property.ownerId);
    currentPropertyModal = property;
    
    // Увеличиваем счетчик просмотров
    incrementPropertyViews(propertyId);
    
    document.getElementById('modal-content').innerHTML = `
        <h2 class="gradient-text">${property.title}</h2>
        <div style="position: relative;">
            <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin: 1rem 0;" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'">
            <span class="property-badge status-approved" style="position: absolute; top: 1rem; right: 1rem;">Одобрено</span>
        </div>
        
        <div style="margin: 1.5rem 0;">
            <h3 style="margin-bottom: 1rem;">Описание</h3>
            <p style="line-height: 1.6; color: #6b7280;">${property.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div class="detail-item">
                <i class="fas fa-ruler-combined"></i>
                <div>
                    <strong>Площадь</strong>
                    <div>${property.area} м²</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-dollar-sign"></i>
                <div>
                    <strong>Цена</strong>
                    <div>$${property.price.toLocaleString()}/месяц</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Город</strong>
                    <div>${property.city}</div>
                </div>
            </div>
            <div class="detail-item">
                <i class="fas fa-home"></i>
                <div>
                    <strong>Адрес</strong>
                    <div>${property.address}</div>
                </div>
            </div>
        </div>
        
        ${property.features.length > 0 ? `
            <div style="margin: 1.5rem 0;">
                <h3 style="margin-bottom: 1rem;">Особенности</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${property.features.map(feature => `
                        <span style="background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #4b5563;">
                            ${feature}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin: 1.5rem 0;">
            <h3 style="margin-bottom: 1rem;">Статистика</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #4f46e5;">${property.views || 0}</div>
                    <div style="color: #6b7280; font-size: 0.9rem;">Просмотров</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${property.contacts || 0}</div>
                    <div style="color: #6b7280; font-size: 0.9rem;">Контактов</div>
                </div>
            </div>
        </div>
        
        <div class="owner-info" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
            <div class="owner-avatar">${owner.name.charAt(0)}</div>
            <div class="owner-details">
                <div class="owner-name">${owner.name}</div>
                <div class="owner-rating">
                    <span class="stars">${getRatingStars(4.5)}</span>
                    4.5 (12 отзывов)
                </div>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" onclick="contactOwner(${owner.id}, ${property.id})" style="width: 100%;">
                <i class="fas fa-phone"></i> Связаться с владельцем
            </button>
        </div>
    `;
    
    document.getElementById('property-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('property-modal').style.display = 'none';
    currentPropertyModal = null;
}

function contactOwner(ownerId, propertyId) {
    const owner = getUserById(ownerId);
    incrementPropertyContacts(propertyId);
    
    const contactInfo = `
Контактные данные владельца:

👤 Имя: ${owner.name}
📞 Телефон: ${owner.phone}
📧 Email: ${owner.email}

Для связи по площадке:
"${currentPropertyModal.title}"
${currentPropertyModal.address}, ${currentPropertyModal.city}

Рекомендуем:
1. Представиться и указать цель звонка
2. Уточнить актуальность аренды
3. Договориться о просмотре
    `;
    
    alert(contactInfo);
}

// Поддержка
function openSupportModal() {
    document.getElementById('support-modal').style.display = 'block';
}

function closeSupportModal() {
    document.getElementById('support-modal').style.display = 'none';
}

// О нас
function showAbout() {
    // Страница "О нас" уже статична, ничего дополнительно не загружаем
}

// Уведомления
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${
                type === 'success' ? 'var(--gradient-secondary)' : 'var(--danger)'
            }; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}" style="color: white;"></i>
            </div>
            <div>
                <div style="font-weight: 700; color: var(--dark); margin-bottom: 0.25rem;">
                    ${type === 'success' ? 'Успешно!' : 'Ошибка!'}
                </div>
                <div style="color: var(--gray);">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Добавляем CSS для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Дополнительные функции для админа
function showAllUsers() {
    alert('Функция управления пользователями будет реализована в следующем обновлении!');
}

function generateReport() {
    const stats = getAdminStats();
    const report = `
Отчет системы TradeRent
Генерирован: ${new Date().toLocaleDateString('ru-RU')}

📊 Общая статистика:
• Всего площадок: ${stats.totalProperties}
• На модерации: ${stats.pendingProperties}
• Одобрено: ${stats.approvedProperties}
• Пользователей: ${stats.totalUsers}
• Отзывов: ${stats.totalReviews}

📈 Активность:
• Всего просмотров: ${stats.totalViews}
• Всего контактов: ${stats.totalContacts}
• Конверсия: ${stats.totalViews > 0 ? ((stats.totalContacts / stats.totalViews) * 100).toFixed(1) : 0}%
    `;
    
    alert(report);
}

// Функция редактирования площадки (заглушка)
function editProperty(propertyId) {
    alert('Функция редактирования будет реализована в следующем обновлении!');
}
