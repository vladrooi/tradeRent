let currentUser = null;
let currentPropertyModal = null;
let currentReviewRating = 0;
let currentRejectPropertyId = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    populateCityFilters();
    checkAuth();
    setupEventListeners();
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
    
    // Показать нужную секцию
    document.getElementById(sectionName + '-section').classList.add('active');
    
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
    } else {
        alert('Неверные данные для входа!');
    }
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const role = document.getElementById('reg-role').value;
    
    try {
        const userData = {
            username,
            password,
            role,
            name,
            email,
            phone
        };
        
        const newUser = registerUser(userData);
        setCurrentUser(newUser);
        currentUser = newUser;
        showInterface();
        document.getElementById('register-form').reset();
        alert('Регистрация успешна!');
        
    } catch (error) {
        alert(error.message);
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
    showSection('hero');
}

function showInterface() {
    document.getElementById('guest-nav').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    
    const navAvatar = document.getElementById('nav-avatar');
    navAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Показываем соответствующие разделы для ролей
    if (currentUser.role === 'admin') {
        document.getElementById('admin-nav').style.display = 'inline';
        showAdminPanel();
    } else if (currentUser.role === 'landlord') {
        document.getElementById('landlord-nav').style.display = 'inline';
        showSection('properties');
    } else {
        showSection('properties');
    }
}

function logout() {
    logoutUser();
    currentUser = null;
    location.reload();
}

// Отображение площадок
function showProperties() {
    const properties = getApprovedProperties();
    const container = document.getElementById('properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = '<div class="property-card"><h3>Нет доступных площадок</h3><p>Станьте первым арендодателем!</p></div>';
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <img src="${property.images[0]}" alt="${property.title}" class="property-image">
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
                </div>
                <div class="price">$${property.price}/месяц</div>
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div class="owner-rating">
                            <span class="stars">${'★'.repeat(Math.floor(owner.rating))}${'☆'.repeat(5 - Math.floor(owner.rating))}</span>
                            ${owner.rating}
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

// Показ городов
function showCities() {
    const cities = getCities();
    const container = document.getElementById('cities-list');
    
    container.innerHTML = cities.map(city => {
        const propertiesCount = getCityPropertiesCount(city);
        const hasProperties = propertiesCount > 0;
        const icons = ['🏙️', '🏛️', '🌉', '🏰', '🌃', '🎡'];
        
        return `
            <div class="city-card" onclick="showCityProperties('${city}')">
                <div class="city-icon">${icons[cities.indexOf(city)]}</div>
                <h3 class="city-name">${city}</h3>
                <p class="city-properties ${hasProperties ? 'has-properties' : 'no-properties'}">
                    ${hasProperties ? 
                        `✅ ${propertiesCount} площадок в аренду` : 
                        '❌ Нет доступных площадок'
                    }
                </p>
            </div>
        `;
    }).join('');
}

function showCityProperties(city) {
    const properties = getPropertiesByCity(city);
    const container = document.getElementById('properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card">
                <h3>${city}</h3>
                <p>В этом городе пока нет доступных торговых площадей.</p>
                ${currentUser && currentUser.role === 'landlord' ? 
                    '<p>Станьте первым арендодателем в этом городе!</p>' : 
                    ''
                }
            </div>
        `;
    } else {
        container.innerHTML = properties.map(property => {
            const owner = getUserById(property.ownerId);
            return `
                <div class="property-card" onclick="openPropertyModal(${property.id})">
                    <img src="${property.images[0]}" alt="${property.title}" class="property-image">
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
                    </div>
                    <div class="price">$${property.price}/месяц</div>
                    <div class="owner-info">
                        <div class="owner-avatar">${owner.name.charAt(0)}</div>
                        <div class="owner-details">
                            <div class="owner-name">${owner.name}</div>
                            <div class="owner-rating">
                                <span class="stars">${'★'.repeat(Math.floor(owner.rating))}${'☆'.repeat(5 - Math.floor(owner.rating))}</span>
                                ${owner.rating}
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
    const profileRating = document.getElementById('profile-rating');
    const profileAvatar = document.getElementById('profile-avatar');
    
    profileName.textContent = currentUser.name;
    profileRole.textContent = getRoleName(currentUser.role);
    profileEmail.textContent = currentUser.email;
    profilePhone.textContent = currentUser.phone;
    profileRating.textContent = currentUser.rating;
    profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
}

function getRoleName(role) {
    const roles = {
        'admin': 'Администратор',
        'landlord': 'Арендодатель',
        'user': 'Пользователь'
    };
    return roles[role] || role;
}

// Мои площадки
function showMyProperties() {
    if (!currentUser || currentUser.role !== 'landlord') return;
    
    const properties = getUserProperties(currentUser.id);
    const container = document.getElementById('my-properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = '<div class="property-card"><h3>У вас нет площадок</h3><p>Добавьте первую площадку!</p></div>';
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const statusText = property.status === 'approved' ? 'Одобрено' : 
                          property.status === 'pending' ? 'На модерации' : 'Отклонено';
        const statusClass = property.status === 'approved' ? 'status-approved' : 
                           property.status === 'pending' ? 'status-pending' : 'status-rejected';
        
        return `
            <div class="property-card">
                <img src="${property.images[0]}" alt="${property.title}" class="property-image">
                <h3 class="property-title">${property.title} 
                    <span class="property-status ${statusClass}">${statusText}</span>
                </h3>
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
                <div class="price">$${property.price}/месяц</div>
                <p><strong>Адрес:</strong> ${property.address}</p>
                ${property.rejectReason ? `<p style="color: #ef4444; margin-top: 0.5rem;"><strong>Причина отклонения:</strong> ${property.rejectReason}</p>` : ''}
                <button class="btn btn-primary contact-btn" onclick="openPropertyModal(${property.id})">
                    <i class="fas fa-info-circle"></i> Подробнее
                </button>
            </div>
        `;
    }).join('');
}

// Добавление новой площадки
function addNewProperty() {
    if (!currentUser || currentUser.role !== 'landlord') return;
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const area = parseInt(document.getElementById('area').value);
    const price = parseInt(document.getElementById('price').value);
    const city = document.getElementById('property-city').value;
    const address = document.getElementById('address').value;
    const imageUrl = document.getElementById('image-url').value;
    
    const newProperty = {
        title,
        description,
        area,
        price,
        city,
        address,
        images: [imageUrl],
        features: ["Базовые удобства"],
        ownerId: currentUser.id,
        ownerName: currentUser.name
    };
    
    addProperty(newProperty);
    document.getElementById('add-property-form').reset();
    alert('Площадка отправлена на модерацию!');
    showSection('my-properties');
}

// Фильтрация
function filterProperties() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const city = document.getElementById('city-filter').value;
    const maxArea = document.getElementById('area-filter').value;
    
    let properties = getApprovedProperties();
    
    if (query) {
        properties = properties.filter(prop => 
            prop.title.toLowerCase().includes(query) ||
            prop.description.toLowerCase().includes(query)
        );
    }
    
    if (city) {
        properties = properties.filter(prop => prop.city === city);
    }
    
    if (maxArea) {
        properties = properties.filter(prop => prop.area <= parseInt(maxArea));
    }
    
    const container = document.getElementById('properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = '<div class="property-card"><h3>Ничего не найдено</h3><p>Попробуйте изменить параметры поиска</p></div>';
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card" onclick="openPropertyModal(${property.id})">
                <img src="${property.images[0]}" alt="${property.title}" class="property-image">
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
                </div>
                <div class="price">$${property.price}/месяц</div>
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div class="owner-rating">
                            <span class="stars">${'★'.repeat(Math.floor(owner.rating))}${'☆'.repeat(5 - Math.floor(owner.rating))}</span>
                            ${owner.rating}
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

// Админ-панель
function showAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const stats = getAdminStats();
    
    document.getElementById('total-properties').textContent = stats.totalProperties;
    document.getElementById('pending-properties').textContent = stats.pendingProperties;
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-reviews').textContent = stats.totalReviews;
    
    showSection('admin-panel');
}

function showAdminModeration() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const pendingProperties = getPendingProperties();
    const container = document.getElementById('moderation-list');
    
    if (pendingProperties.length === 0) {
        container.innerHTML = `
            <div class="property-card" style="grid-column: 1 / -1; text-align: center;">
                <h3>🎉 Отличная работа!</h3>
                <p>Нет заявок, ожидающих модерации</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pendingProperties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card">
                <img src="${property.images[0]}" alt="${property.title}" class="property-image">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 100)}...</p>
                
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${property.price}/мес</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                </div>
                
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div>${owner.phone}</div>
                    </div>
                </div>
                
                <div class="moderation-actions">
                    <button class="btn btn-success" onclick="approveProperty(${property.id})">
                        <i class="fas fa-check"></i> Одобрить
                    </button>
                    <button class="btn btn-danger" onclick="openRejectModal(${property.id})">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                    <button class="btn btn-secondary" onclick="openPropertyModal(${property.id})">
                        <i class="fas fa-eye"></i> Просмотр
                    </button>
                </div>
                
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                    <small style="color: #6b7280;">
                        <i class="fas fa-clock"></i> Подана: ${new Date(property.createdAt).toLocaleDateString()}
                    </small>
                </div>
            </div>
        `;
    }).join('');
}

function filterModeration() {
    const query = document.getElementById('moderation-search').value.toLowerCase();
    const city = document.getElementById('moderation-city').value;
    
    let properties = getPendingProperties();
    
    if (query) {
        properties = properties.filter(prop => 
            prop.title.toLowerCase().includes(query) ||
            prop.description.toLowerCase().includes(query) ||
            prop.ownerName.toLowerCase().includes(query)
        );
    }
    
    if (city) {
        properties = properties.filter(prop => prop.city === city);
    }
    
    const container = document.getElementById('moderation-list');
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="property-card" style="grid-column: 1 / -1; text-align: center;">
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => {
        const owner = getUserById(property.ownerId);
        return `
            <div class="property-card">
                <img src="${property.images[0]}" alt="${property.title}" class="property-image">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-description">${property.description.substring(0, 100)}...</p>
                
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${property.price}/мес</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.city}</span>
                    </div>
                </div>
                
                <div class="owner-info">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div>${owner.phone}</div>
                    </div>
                </div>
                
                <div class="moderation-actions">
                    <button class="btn btn-success" onclick="approveProperty(${property.id})">
                        <i class="fas fa-check"></i> Одобрить
                    </button>
                    <button class="btn btn-danger" onclick="openRejectModal(${property.id})">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                    <button class="btn btn-secondary" onclick="openPropertyModal(${property.id})">
                        <i class="fas fa-eye"></i> Просмотр
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function approveProperty(propertyId) {
    if (confirm('Вы уверены, что хотите одобрить эту площадку?')) {
        if (updatePropertyStatus(propertyId, 'approved')) {
            alert('Площадка одобрена!');
            showAdminModeration();
        }
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
    if (!reason.trim()) {
        alert('Пожалуйста, укажите причину отклонения');
        return;
    }
    
    if (updatePropertyStatus(currentRejectPropertyId, 'rejected', reason.trim())) {
        alert('Площадка отклонена!');
        closeRejectModal();
        showAdminModeration();
    }
}

function showAllUsers() {
    alert('Функция управления пользователями в разработке');
}

function showAllProperties() {
    showSection('properties');
}

// Модальные окна
function openPropertyModal(propertyId) {
    const property = getAllProperties().find(p => p.id === propertyId);
    if (!property) return;
    
    const owner = getUserById(property.ownerId);
    const reviews = getReviewsForUser(property.ownerId);
    
    const isAdmin = currentUser && currentUser.role === 'admin';
    const isOwner = currentUser && currentUser.id === property.ownerId;
    
    const adminActions = isAdmin ? `
        <div class="admin-actions-modal">
            <h4 style="color: #1f2937; margin-bottom: 1rem;">Действия администратора</h4>
            <div style="display: flex; gap: 0.5rem;">
                ${property.status === 'pending' ? `
                    <button class="btn btn-success" onclick="approveProperty(${property.id}); closeModal();">
                        <i class="fas fa-check"></i> Одобрить
                    </button>
                    <button class="btn btn-danger" onclick="openRejectModal(${property.id}); closeModal();">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                ` : ''}
                <button class="btn btn-danger" onclick="deletePropertyFromModal(${property.id})">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        </div>
    ` : '';
    
    const ownerActions = isOwner ? `
        <div class="admin-actions-modal">
            <h4 style="color: #1f2937; margin-bottom: 1rem;">Ваши действия</h4>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-danger" onclick="deletePropertyFromModal(${property.id})">
                    <i class="fas fa-trash"></i> Удалить мою площадку
                </button>
            </div>
        </div>
    ` : '';

    const modalContent = `
        <h2>${property.title}</h2>
        <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
            <div>
                <h3 style="color: #1f2937; margin-bottom: 1rem;">Информация о площади</h3>
                <div class="property-details">
                    <div class="detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>Площадь: ${property.area} м²</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Цена: $${property.price}/мес</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Город: ${property.city}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-home"></i>
                        <span>Адрес: ${property.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-info-circle"></i>
                        <span>Статус: 
                            <span class="property-status ${property.status === 'approved' ? 'status-approved' : property.status === 'pending' ? 'status-pending' : 'status-rejected'}">
                                ${property.status === 'approved' ? 'Одобрено' : property.status === 'pending' ? 'На модерации' : 'Отклонено'}
                            </span>
                        </span>
                    </div>
                </div>
                
                <h4 style="color: #1f2937; margin: 1.5rem 0 1rem;">Описание</h4>
                <p style="color: #6b7280; line-height: 1.6;">${property.description}</p>
                
                <h4 style="color: #1f2937; margin: 1.5rem 0 1rem;">Особенности</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${property.features.map(feature => `
                        <span style="background: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                            <i class="fas fa-check"></i> ${feature}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3 style="color: #1f2937; margin-bottom: 1rem;">Контактная информация</h3>
                <div class="owner-info" style="background: #f8fafc; padding: 1.5rem; border-radius: 10px;">
                    <div class="owner-avatar">${owner.name.charAt(0)}</div>
                    <div class="owner-details">
                        <div class="owner-name">${owner.name}</div>
                        <div class="owner-rating">
                            <span class="stars">${'★'.repeat(Math.floor(owner.rating))}${'☆'.repeat(5 - Math.floor(owner.rating))}</span>
                            (${owner.rating})
                        </div>
                        <div style="margin-top: 0.5rem;">
                            <div><i class="fas fa-phone"></i> ${owner.phone}</div>
                            <div><i class="fas fa-envelope"></i> ${owner.email}</div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="contactOwner('${owner.phone}', '${owner.email}')">
                    <i class="fas fa-phone"></i> Связаться с арендодателем
                </button>
                
                ${currentUser && currentUser.id !== owner.id ? `
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="openReviewModal(${owner.id})">
                        <i class="fas fa-star"></i> Оставить отзыв
                    </button>
                ` : ''}
            </div>
        </div>
        
        ${property.rejectReason ? `
            <div style="background: #fee2e2; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <h4 style="color: #dc2626; margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Причина отклонения</h4>
                <p style="color: #7f1d1d;">${property.rejectReason}</p>
            </div>
        ` : ''}
        
        <div class="reviews-section">
            <h3 style="color: #1f2937; margin-bottom: 1rem;">Отзывы об арендодателе</h3>
            ${reviews.length > 0 ? reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="owner-avatar" style="width: 35px; height: 35px; font-size: 0.8rem;">${review.authorName.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 600;">${review.authorName}</div>
                            <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        </div>
                        <div style="color: #6b7280; font-size: 0.9rem; margin-left: auto;">
                            ${new Date(review.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <p style="color: #374151; margin-top: 0.5rem;">${review.comment}</p>
                </div>
            `).join('') : `
                <p style="color: #6b7280; text-align: center; padding: 2rem;">Пока нет отзывов</p>
            `}
        </div>
        
        ${adminActions}
        ${ownerActions}
    `;
    
    document.getElementById('modal-content').innerHTML = modalContent;
    document.getElementById('property-modal').style.display = 'block';
    currentPropertyModal = property;
}

function deletePropertyFromModal(propertyId) {
    if (confirm('Вы уверены, что хотите удалить эту площадку? Это действие нельзя отменить.')) {
        if (deleteProperty(propertyId)) {
            alert('Площадка удалена!');
            closeModal();
            if (currentUser.role === 'admin') {
                showAdminModeration();
            } else {
                showMyProperties();
            }
        }
    }
}

function contactOwner(phone, email) {
    if (confirm(`Хотите связаться с арендодателем?\nТелефон: ${phone}\nEmail: ${email}\n\nНажмите OK для копирования номера телефона`)) {
        navigator.clipboard.writeText(phone).then(() => {
            alert('Номер телефона скопирован в буфер обмена!');
        }).catch(() => {
            alert(`Телефон: ${phone}\nEmail: ${email}`);
        });
    }
}

function openReviewModal(ownerId) {
    const modalContent = `
        <h2>Оставить отзыв</h2>
        <form onsubmit="submitReview(${ownerId}); return false;">
            <div class="form-group">
                <label>Ваша оценка:</label>
                <div class="star-rating" style="display: flex; gap: 0.5rem; margin: 1rem 0; justify-content: center;">
                    ${[1,2,3,4,5].map(star => `
                        <i class="fas fa-star" style="font-size: 2rem; color: #ddd; cursor: pointer;" 
                           onclick="setReviewRating(${star})" 
                           id="star-${star}"></i>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label>Комментарий:</label>
                <textarea id="review-comment" rows="4" placeholder="Расскажите о вашем опыте сотрудничества..." required style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 10px;"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Отправить отзыв</button>
        </form>
    `;
    
    document.getElementById('review-modal-content').innerHTML = modalContent;
    document.getElementById('review-modal').style.display = 'block';
    currentReviewRating = 0;
}

function setReviewRating(rating) {
    currentReviewRating = rating;
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star-${i}`);
        if (star) {
            star.style.color = i <= rating ? '#f59e0b' : '#ddd';
        }
    }
}

function submitReview(ownerId) {
    if (!currentReviewRating) {
        alert('Пожалуйста, поставьте оценку');
        return;
    }
    
    const comment = document.getElementById('review-comment').value;
    if (!comment.trim()) {
        alert('Пожалуйста, напишите комментарий');
        return;
    }
    
    try {
        addReview({
            authorId: currentUser.id,
            authorName: currentUser.name,
            targetUserId: ownerId,
            rating: currentReviewRating,
            comment: comment.trim()
        });
        
        alert('Спасибо за ваш отзыв!');
        closeReviewModal();
        
        if (currentPropertyModal) {
            openPropertyModal(currentPropertyModal.id);
        }
        
    } catch (error) {
        alert(error.message);
    }
}

function closeModal() {
    document.getElementById('property-modal').style.display = 'none';
    currentPropertyModal = null;
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
    currentReviewRating = 0;
}

// Закрытие модальных окон при клике вне их
window.onclick = function(event) {
    const modals = ['property-modal', 'review-modal', 'reject-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            if (modalId === 'property-modal') closeModal();
            if (modalId === 'review-modal') closeReviewModal();
            if (modalId === 'reject-modal') closeRejectModal();
        }
    });
}

