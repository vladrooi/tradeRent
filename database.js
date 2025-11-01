// Основные города Беларуси
const belarusCities = ["Минск", "Гродно", "Витебск", "Брест", "Могилёв", "Гомель"];

// Инициализация базы данных
function initializeDatabase() {
    if (!localStorage.getItem('users')) {
        const initialUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'Администратор Системы',
                email: 'admin@traderent.by',
                phone: '+375 (29) 123-45-67',
                rating: 5.0,
                registrationDate: new Date().toISOString()
            },
            {
                id: 2,
                username: 'landlord',
                password: 'landlord123',
                role: 'landlord',
                name: 'Анна Иванова',
                email: 'anna@example.com',
                phone: '+375 (33) 765-43-21',
                rating: 4.7,
                registrationDate: new Date().toISOString()
            },
            {
                id: 3,
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'Петр Сидоров',
                email: 'petr@example.com',
                phone: '+375 (44) 123-45-67',
                rating: 4.9,
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('properties')) {
        const initialData = [
            {
                id: 1,
                title: "Торговая площадь в центре Минска",
                description: "Просторная торговая площадь в самом центре города с высоким пешеходным трафиком. Идеально подходит для магазина одежды, обуви или аксессуаров. Помещение с современным ремонтом, системами кондиционирования и видеонаблюдения.",
                area: 150,
                price: 2500,
                address: "ул. Немига, 5",
                city: "Минск",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop"],
                features: ["Кондиционер", "Охранная сигнализация", "Высокие потолки", "Витринные окна"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "Торговый павильон в Гродно",
                description: "Современный торговый павильон в центре Гродно. Отличное расположение рядом с пешеходной зоной. Подходит для продажи сувениров, косметики или ювелирных изделий.",
                area: 45,
                price: 1200,
                address: "ул. Советская, 15",
                city: "Гродно",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop"],
                features: ["Центральное отопление", "Интернет", "Система безопасности"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: "Помещение в Витебске на модерации",
                description: "Новое помещение в центре Витебска, ожидает проверки модератором.",
                area: 85,
                price: 1800,
                address: "пр-т Московский, 25",
                city: "Витебск",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&h=300&fit=crop"],
                features: ["Отдельный вход", "Парковка"],
                status: "pending",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('properties', JSON.stringify(initialData));
    }

    if (!localStorage.getItem('reviews')) {
        const initialReviews = [
            {
                id: 1,
                authorId: 3,
                authorName: "Петр Сидоров",
                targetUserId: 2,
                rating: 5,
                comment: "Отличный арендодатель! Все условия соблюдаются, быстро решаются вопросы. Площадка соответствует описанию.",
                createdAt: new Date('2024-01-15').toISOString()
            }
        ];
        localStorage.setItem('reviews', JSON.stringify(initialReviews));
    }
}

// Работа с пользователями
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function findUser(username, password) {
    const users = getAllUsers();
    return users.find(user => user.username === username && user.password === password);
}

function getUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id);
}

function registerUser(userData) {
    const users = getAllUsers();
    
    if (users.find(user => user.username === userData.username)) {
        throw new Error('Пользователь с таким логином уже существует');
    }

    const newUser = {
        ...userData,
        id: Date.now(),
        rating: 0,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Работа с отзывами
function getAllReviews() {
    const reviews = localStorage.getItem('reviews');
    return reviews ? JSON.parse(reviews) : [];
}

function getReviewsForUser(userId) {
    const reviews = getAllReviews();
    return reviews.filter(review => review.targetUserId === userId);
}

function addReview(review) {
    const reviews = getAllReviews();
    
    const existingReview = reviews.find(r => 
        r.authorId === review.authorId && r.targetUserId === review.targetUserId
    );
    
    if (existingReview) {
        throw new Error('Вы уже оставляли отзыв этому пользователю');
    }

    const newReview = {
        ...review,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return newReview;
}

// Работа с площадками
function getAllProperties() {
    const properties = localStorage.getItem('properties');
    return properties ? JSON.parse(properties) : [];
}

function getApprovedProperties() {
    const properties = getAllProperties();
    return properties.filter(prop => prop.status === 'approved');
}

function getUserProperties(userId) {
    const properties = getAllProperties();
    return properties.filter(prop => prop.ownerId === userId);
}

function getPropertiesByCity(city) {
    const properties = getApprovedProperties();
    return properties.filter(prop => prop.city === city);
}

function addProperty(property) {
    const properties = getAllProperties();
    const newProperty = {
        ...property,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    properties.push(newProperty);
    localStorage.setItem('properties', JSON.stringify(properties));
    return newProperty;
}

// Функции для админа
function getPendingProperties() {
    const properties = getAllProperties();
    return properties.filter(prop => prop.status === 'pending');
}

function updatePropertyStatus(propertyId, status, rejectReason = '') {
    const properties = getAllProperties();
    const propertyIndex = properties.findIndex(prop => prop.id === propertyId);
    
    if (propertyIndex !== -1) {
        properties[propertyIndex].status = status;
        if (rejectReason) {
            properties[propertyIndex].rejectReason = rejectReason;
        }
        localStorage.setItem('properties', JSON.stringify(properties));
        return true;
    }
    return false;
}

function deleteProperty(propertyId) {
    let properties = getAllProperties();
    properties = properties.filter(prop => prop.id !== propertyId);
    localStorage.setItem('properties', JSON.stringify(properties));
    return true;
}

function getAdminStats() {
    const properties = getAllProperties();
    const users = getAllUsers();
    const reviews = getAllReviews();
    
    return {
        totalProperties: properties.length,
        pendingProperties: properties.filter(p => p.status === 'pending').length,
        approvedProperties: properties.filter(p => p.status === 'approved').length,
        totalUsers: users.length,
        totalReviews: reviews.length
    };
}

// Города
function getCities() {
    return belarusCities;
}

function getCityPropertiesCount(city) {
    const properties = getPropertiesByCity(city);
    return properties.length;
}
