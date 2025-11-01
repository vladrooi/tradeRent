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
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 2,
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'Петр Сидоров',
                email: 'petr@example.com',
                phone: '+375 (44) 123-45-67',
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 3,
                username: 'user2',
                password: 'user123',
                role: 'user',
                name: 'Мария Козлова',
                email: 'maria@example.com',
                phone: '+375 (25) 555-55-55',
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 4,
                username: 'business',
                password: 'business123',
                role: 'user',
                name: 'Дмитрий Смирнов',
                email: 'dmitry@example.com',
                phone: '+375 (33) 777-77-77',
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('properties')) {
        const initialData = [
            {
                id: 1,
                title: "Торговая площадь в центре Минска",
                description: "Просторная торговая площадь в самом центре города с высоким пешеходным трафиком. Идеально подходит для магазина одежды, обуви или аксессуаров. Помещение с современным ремонтом, системами кондиционирования и видеонаблюдения. Высокие потолки 4.5 метра, отдельный вход, витринные окна во всю стену.",
                area: 150,
                price: 2500,
                address: "ул. Немига, 5",
                city: "Минск",
                ownerId: 2,
                ownerName: "Петр Сидоров",
                images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"],
                features: ["Кондиционер", "Охранная сигнализация", "Высокие потолки", "Витринные окна", "Отдельный вход", "Ремонт 2024"],
                status: "approved",
                createdAt: new Date('2024-01-15').toISOString(),
                views: 124,
                contacts: 45
            },
            {
                id: 2,
                title: "Торговый павильон в Гродно",
                description: "Современный торговый павильон в центре Гродно. Отличное расположение рядом с пешеходной зоной. Подходит для продажи сувениров, косметики или ювелирных изделий. Павильон полностью оборудован для ведения торговли, есть складское помещение.",
                area: 45,
                price: 1200,
                address: "ул. Советская, 15",
                city: "Гродно",
                ownerId: 2,
                ownerName: "Петр Сидоров",
                images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"],
                features: ["Центральное отопление", "Интернет", "Система безопасности", "Складское помещение", "Пешеходная зона"],
                status: "approved",
                createdAt: new Date('2024-01-20').toISOString(),
                views: 89,
                contacts: 23
            },
            {
                id: 3,
                title: "Помещение под магазин в Витебске",
                description: "Светлое просторное помещение на первом этаже жилого дома. Отдельный вход, большие витринные окна. Идеально для продуктового магазина или аптеки. Ремонт выполнен в 2023 году, все коммуникации новые.",
                area: 85,
                price: 1800,
                address: "пр-т Московский, 25",
                city: "Витебск",
                ownerId: 2,
                ownerName: "Петр Сидоров",
                images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop"],
                features: ["Отдельный вход", "Парковка", "Складское помещение", "Новый ремонт", "Жилой район"],
                status: "approved",
                createdAt: new Date('2024-02-01').toISOString(),
                views: 156,
                contacts: 34
            },
            {
                id: 4,
                title: "ТЦ 'Европа' - этаж 2",
                description: "Премиальное помещение в торговом центре 'Европа'. Высокий трафик, современный дизайн. Подходит для брендовой одежды, электроники или ювелирных изделий. Помещение полностью соответствует стандартам премиум-класса.",
                area: 120,
                price: 3500,
                address: "ТЦ 'Европа', 2 этаж",
                city: "Минск",
                ownerId: 3,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1600585154340-ffff5c5b4d38?w=600&h=400&fit=crop"],
                features: ["ТЦ", "Кондиционер", "Охранная система", "Уборка", "Реклама", "Премиум-класс"],
                status: "approved",
                createdAt: new Date('2024-01-10').toISOString(),
                views: 278,
                contacts: 67
            },
            {
                id: 5,
                title: "Павильон у метро",
                description: "Торговый павильон у станции метро с высоким пассажиропотоком. Отличная видимость, отдельный вход. Идеально для кофе-поинта, фастфуда или цветов. Есть все необходимые коммуникации.",
                area: 30,
                price: 900,
                address: "ст. м. Пушкинская",
                city: "Минск",
                ownerId: 3,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"],
                features: ["Метро", "Высокий трафик", "Коммуникации", "Готовый бизнес", "Отдельный вход"],
                status: "approved",
                createdAt: new Date('2024-02-05').toISOString(),
                views: 203,
                contacts: 89
            },
            {
                id: 6,
                title: "Помещение в Брестской крепости",
                description: "Уникальное помещение в историческом центре Бреста рядом с крепостью. Высокий туристический трафик. Подходит для сувениров, кафе или музея. Помещение в историческом здании с сохраненным фасадом.",
                area: 65,
                price: 1500,
                address: "ул. Гоголя, 12",
                city: "Брест",
                ownerId: 3,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop"],
                features: ["Туристическое место", "Историческое здание", "Пешеходная зона", "Реконструкция", "Высокий трафик"],
                status: "approved",
                createdAt: new Date('2024-01-25').toISOString(),
                views: 167,
                contacts: 45
            },
            {
                id: 7,
                title: "Новое помещение в Могилёве",
                description: "Современное помещение в новом жилом комплексе. Подходит для продуктового магазина, аптеки или химчистки. Большая жилая аудитория. Ремонт выполнен по современным стандартам.",
                area: 95,
                price: 1600,
                address: "пр-т Мира, 45",
                city: "Могилёв",
                ownerId: 2,
                ownerName: "Петр Сидоров",
                images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
                features: ["Новостройка", "Жилой район", "Парковка", "Лифт", "Современный ремонт"],
                status: "pending",
                createdAt: new Date().toISOString(),
                views: 0,
                contacts: 0
            },
            {
                id: 8,
                title: "Торговый комплекс в Гомеле",
                description: "Помещение в крупном торговом комплексе. Стабильный трафик, хорошая инфраструктура. Подходит для различных видов retail-бизнеса. Находится на первом этаже с хорошей проходимостью.",
                area: 200,
                price: 4200,
                address: "ТК 'Спутник'",
                city: "Гомель",
                ownerId: 3,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
                features: ["Торговый комплекс", "Кондиционер", "Эскалатор", "Охрана", "Уборка", "Первый этаж"],
                status: "approved",
                createdAt: new Date('2024-02-10').toISOString(),
                views: 145,
                contacts: 28
            },
            {
                id: 9,
                title: "Бизнес-центр 'Столица'",
                description: "Элитное помещение в бизнес-центре класса А. Подходит для представительства, шоу-рума или премиального ритейла. Высокий уровень сервиса и безопасности.",
                area: 180,
                price: 5500,
                address: "б-р Мулявина, 10",
                city: "Минск",
                ownerId: 4,
                ownerName: "Дмитрий Смирнов",
                images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop"],
                features: ["Бизнес-центр", "Консьерж", "Паркинг", "Лифт", "Система безопасности", "Класс А"],
                status: "approved",
                createdAt: new Date('2024-01-30').toISOString(),
                views: 189,
                contacts: 23
            },
            {
                id: 10,
                title: "Торговая галерея в Гродно",
                description: "Помещение в крытой торговой галерее. Постоянный поток покупателей, отличное расположение в центре города. Идеально для магазина одежды или аксессуаров.",
                area: 75,
                price: 2200,
                address: "ул. Ожешко, 25",
                city: "Гродно",
                ownerId: 4,
                ownerName: "Дмитрий Смирнов",
                images: ["https://images.unsplash.com/photo-1567496898661-0d17f0174b1f?w=600&h=400&fit=crop"],
                features: ["Торговая галерея", "Отопление", "Охранная система", "Общественные зоны", "Центр города"],
                status: "approved",
                createdAt: new Date('2024-02-08').toISOString(),
                views: 134,
                contacts: 31
            }
        ];
        localStorage.setItem('properties', JSON.stringify(initialData));
    }

    if (!localStorage.getItem('reviews')) {
        const initialReviews = [
            {
                id: 1,
                authorId: 2,
                authorName: "Петр Сидоров",
                targetUserId: 3,
                rating: 5,
                comment: "Отличный арендодатель! Все условия соблюдаются, быстро решаются вопросы. Площадка соответствует описанию.",
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                authorId: 3,
                authorName: "Мария Козлова",
                targetUserId: 2,
                rating: 4,
                comment: "Хороший партнер, площадки всегда в отличном состоянии. Рекомендую к сотрудничеству.",
                createdAt: new Date('2024-01-20').toISOString()
            },
            {
                id: 3,
                authorId: 4,
                authorName: "Дмитрий Смирнов",
                targetUserId: 3,
                rating: 5,
                comment: "Прекрасные помещения в хороших локациях. Все четко по договору, без surprises. Спасибо!",
                createdAt: new Date('2024-02-01').toISOString()
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
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

function updateUserLastLogin(userId) {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user) {
        updateUserLastLogin(user.id);
    }
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
        createdAt: new Date().toISOString(),
        views: 0,
        contacts: 0
    };
    properties.push(newProperty);
    localStorage.setItem('properties', JSON.stringify(properties));
    return newProperty;
}

function incrementPropertyViews(propertyId) {
    const properties = getAllProperties();
    const propertyIndex = properties.findIndex(prop => prop.id === propertyId);
    if (propertyIndex !== -1) {
        properties[propertyIndex].views = (properties[propertyIndex].views || 0) + 1;
        localStorage.setItem('properties', JSON.stringify(properties));
    }
}

function incrementPropertyContacts(propertyId) {
    const properties = getAllProperties();
    const propertyIndex = properties.findIndex(prop => prop.id === propertyId);
    if (propertyIndex !== -1) {
        properties[propertyIndex].contacts = (properties[propertyIndex].contacts || 0) + 1;
        localStorage.setItem('properties', JSON.stringify(properties));
    }
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
    
    const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
    const totalContacts = properties.reduce((sum, prop) => sum + (prop.contacts || 0), 0);
    
    return {
        totalProperties: properties.length,
        pendingProperties: properties.filter(p => p.status === 'pending').length,
        approvedProperties: properties.filter(p => p.status === 'approved').length,
        totalUsers: users.length,
        totalReviews: reviews.length,
        totalViews: totalViews,
        totalContacts: totalContacts
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

// Поиск и фильтрация
function searchProperties(filters) {
    let properties = getApprovedProperties();
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        properties = properties.filter(property => 
            property.title.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm) ||
            property.address.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.city) {
        properties = properties.filter(property => property.city === filters.city);
    }
    
    if (filters.area) {
        properties = properties.filter(property => property.area <= parseInt(filters.area));
    }
    
    if (filters.price) {
        properties = properties.filter(property => property.price <= parseInt(filters.price));
    }
    
    return properties;
}
