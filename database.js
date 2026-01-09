// Мок-база данных для Беларуси
class Database {
    constructor() {
        this.init();
    }

    init() {
        // Инициализация данных
        this.properties = this.loadProperties();
        this.users = this.loadUsers();
        this.cities = this.loadCities();
        this.currentUser = this.getSavedUser();
    }

    // Загрузка объектов недвижимости
    loadProperties() {
        return [
            {
                id: 1,
                title: "Магазин в ТЦ 'Столица'",
                type: "store",
                category: "Торговый центр",
                city: "minsk",
                address: "г. Минск, ул. Немига, 5",
                area: 85,
                price: 2800,
                description: "Современное торговое помещение в центре Минска. Высокий трафик, готовый ремонт, все коммуникации. Идеально для брендовой одежды или аксессуаров.",
                features: ["Кондиционер", "Охранная система", "Санузел", "Витринное остекление", "Склад"],
                contact: {
                    name: "Иван Петров",
                    phone: "+375 (29) 123-45-67",
                    email: "i.petrov@example.com"
                },
                images: ["store1.jpg", "store2.jpg"],
                status: "available",
                views: 156,
                favorites: 24,
                createdAt: "2024-01-15",
                createdBy: 2,
                coordinates: { lat: 53.9023, lng: 27.5619 }
            },
            {
                id: 2,
                title: "Киоск на вокзале",
                type: "kiosk",
                category: "Киоск/Островок",
                city: "minsk",
                address: "г. Минск, Привокзальная площадь, 3",
                area: 12,
                price: 850,
                description: "Киоск в проходном месте с высоким пешеходным трафиком. Идеально для торговли фаст-фудом, напитками или сувенирами.",
                features: ["Электричество", "Водоснабжение", "Вытяжка", "Холодильник"],
                contact: {
                    name: "Мария Сидорова",
                    phone: "+375 (29) 234-56-78",
                    email: "m.sidorova@example.com"
                },
                images: ["kiosk1.jpg", "kiosk2.jpg"],
                status: "available",
                views: 89,
                favorites: 12,
                createdAt: "2024-02-10",
                createdBy: 3,
                coordinates: { lat: 53.8905, lng: 27.5504 }
            },
            {
                id: 3,
                title: "Помещение в 'Галерее'",
                type: "mall",
                category: "Торговый центр",
                city: "minsk",
                address: "г. Минск, пр. Победителей, 9",
                area: 120,
                price: 4200,
                description: "Просторное помещение на 1 этаже торгового центра 'Галерея'. Отдельный вход, панорамные окны, высокий трафик.",
                features: ["Отдельный вход", "Панорамные окна", "Парковка", "Кондиционер", "Wi-Fi"],
                contact: {
                    name: "Алексей Волков",
                    phone: "+375 (29) 345-67-89",
                    email: "a.volkov@example.com"
                },
                images: ["mall1.jpg", "mall2.jpg"],
                status: "available",
                views: 203,
                favorites: 45,
                createdAt: "2024-01-28",
                createdBy: 4,
                coordinates: { lat: 53.9181, lng: 27.5111 }
            },
            {
                id: 4,
                title: "Уличная торговая площадка",
                type: "street",
                category: "Уличная торговля",
                city: "gomel",
                address: "г. Гомель, ул. Советская, 25",
                area: 25,
                price: 950,
                description: "Уличная торговая площадка в центре города. Сезонная аренда возможна. Высокая проходимость в выходные дни.",
                features: ["Навес", "Освещение", "Подведенные коммуникации", "Витрина"],
                contact: {
                    name: "Сергей Иванов",
                    phone: "+375 (29) 456-78-90",
                    email: "s.ivanov@example.com"
                },
                images: ["street1.jpg", "street2.jpg"],
                status: "available",
                views: 67,
                favorites: 8,
                createdAt: "2024-02-05",
                createdBy: 5,
                coordinates: { lat: 52.4345, lng: 31.0043 }
            },
            {
                id: 5,
                title: "Бутик в историческом центре",
                type: "store",
                category: "Магазин",
                city: "vitebsk",
                address: "г. Витебск, ул. Ленина, 32",
                area: 65,
                price: 1800,
                description: "Бутиковая площадь в историческом центре Витебска. Готовый дизайн-проект, премиальная отделка.",
                features: ["Дизайнерский ремонт", "Система вентиляции", "Видеонаблюдение", "Охрана"],
                contact: {
                    name: "Ольга Смирнова",
                    phone: "+375 (29) 567-89-01",
                    email: "o.smirnova@example.com"
                },
                images: ["store3.jpg", "store4.jpg"],
                status: "available",
                views: 124,
                favorites: 31,
                createdAt: "2024-02-12",
                createdBy: 6,
                coordinates: { lat: 55.1904, lng: 30.2049 }
            },
            {
                id: 6,
                title: "Островок в 'Короне'",
                type: "foodcourt",
                category: "Фуд-корт",
                city: "grodno",
                address: "г. Гродно, ул. Ожешко, 38",
                area: 15,
                price: 1200,
                description: "Островок в зоне фуд-корта торгового центра 'Корона'. Высокий трафик покупателей ежедневно. Полностью оборудован.",
                features: ["Мебель входит", "Общая вытяжка", "Холодильное оборудование", "Касса"],
                contact: {
                    name: "Дмитрий Козлов",
                    phone: "+375 (29) 678-90-12",
                    email: "d.kozlov@example.com"
                },
                images: ["foodcourt1.jpg", "foodcourt2.jpg"],
                status: "available",
                views: 95,
                favorites: 19,
                createdAt: "2024-02-08",
                createdBy: 7,
                coordinates: { lat: 53.6693, lng: 23.8131 }
            },
            {
                id: 7,
                title: "Магазин 'у дома'",
                type: "store",
                category: "Магазин",
                city: "brest",
                address: "г. Брест, ул. Московская, 267",
                area: 95,
                price: 1650,
                description: "Помещение в жилом комплексе с высокой проходимостью. Идеально для продуктового магазина или аптеки.",
                features: ["Складское помещение", "Подсобка", "Пандус", "Парковка", "Подвал"],
                contact: {
                    name: "Наталья Петрова",
                    phone: "+375 (29) 789-01-23",
                    email: "n.petrova@example.com"
                },
                images: ["store5.jpg", "store6.jpg"],
                status: "available",
                views: 142,
                favorites: 28,
                createdAt: "2024-02-01",
                createdBy: 8,
                coordinates: { lat: 52.0976, lng: 23.7341 }
            },
            {
                id: 8,
                title: "Помещение в ТЦ 'Европа'",
                type: "mall",
                category: "Торговый центр",
                city: "mogilev",
                address: "г. Могилёв, ул. Первомайская, 63",
                area: 75,
                price: 2200,
                description: "Торговая площадь на 2 этаже ТЦ 'Европа'. Хорошая проходимость, готовый ремонт.",
                features: ["Кондиционер", "Видеонаблюдение", "Охрана", "Лифт"],
                contact: {
                    name: "Андрей Николаев",
                    phone: "+375 (29) 890-12-34",
                    email: "a.nikolaev@example.com"
                },
                images: ["mall3.jpg", "mall4.jpg"],
                status: "available",
                views: 89,
                favorites: 15,
                createdAt: "2024-01-25",
                createdBy: 9,
                coordinates: { lat: 53.8945, lng: 30.3307 }
            },
            {
                id: 9,
                title: "Киоск на рынке",
                type: "kiosk",
                category: "Киоск/Островок",
                city: "borisov",
                address: "г. Борисов, Центральный рынок",
                area: 10,
                price: 650,
                description: "Киоск на территории центрального рынка. Высокий трафик, особенно в утренние часы.",
                features: ["Электричество", "Стойка", "Витрина", "Зонт"],
                contact: {
                    name: "Екатерина Волкова",
                    phone: "+375 (29) 901-23-45",
                    email: "e.volkova@example.com"
                },
                images: ["kiosk3.jpg", "kiosk4.jpg"],
                status: "available",
                views: 56,
                favorites: 7,
                createdAt: "2024-02-15",
                createdBy: 10,
                coordinates: { lat: 54.2279, lng: 28.5056 }
            },
            {
                id: 10,
                title: "Фуд-корт в ТЦ 'Тивали'",
                type: "foodcourt",
                category: "Фуд-корт",
                city: "soligorsk",
                address: "г. Солигорск, ул. Козлова, 35",
                area: 20,
                price: 1400,
                description: "Место в фуд-корте популярного ТЦ. Высокий трафик, полностью оборудовано.",
                features: ["Вытяжка", "Холодильник", "Гриль", "Посудомойка"],
                contact: {
                    name: "Владимир Семёнов",
                    phone: "+375 (29) 012-34-56",
                    email: "v.semenov@example.com"
                },
                images: ["foodcourt3.jpg", "foodcourt4.jpg"],
                status: "available",
                views: 78,
                favorites: 22,
                createdAt: "2024-02-03",
                createdBy: 11,
                coordinates: { lat: 52.7928, lng: 27.5344 }
            }
        ];
    }

    // Загрузка пользователей
    loadUsers() {
        return [
            {
                id: 1,
                email: "admin@tradespace.by",
                password: "admin123",
                name: "Администратор",
                role: "admin",
                phone: "+375 (29) 999-99-99",
                city: "minsk",
                avatar: "https://ui-avatars.com/api/?name=Администратор&background=4A90E2&color=fff",
                favorites: [],
                listings: [1, 3, 5],
                createdAt: "2024-01-01",
                lastLogin: new Date().toISOString()
            },
            {
                id: 2,
                email: "user@example.com",
                password: "user123",
                name: "Иван Иванов",
                role: "user",
                phone: "+375 (29) 111-11-11",
                city: "minsk",
                avatar: "https://ui-avatars.com/api/?name=Иван+Иванов&background=00C48C&color=fff",
                favorites: [2, 4, 6],
                listings: [2],
                createdAt: "2024-01-15",
                lastLogin: new Date().toISOString()
            },
            {
                id: 3,
                email: "landlord@example.com",
                password: "landlord123",
                name: "Петр Петров",
                role: "landlord",
                phone: "+375 (29) 222-22-22",
                city: "gomel",
                avatar: "https://ui-avatars.com/api/?name=Петр+Петров&background=FF6B6B&color=fff",
                favorites: [1, 3],
                listings: [3, 4],
                createdAt: "2024-01-20",
                lastLogin: new Date().toISOString()
            }
        ];
    }

    // Загрузка городов
    loadCities() {
        return {
            "minsk": {
                name: "Минск",
                population: "2 млн",
                region: "Минская область",
                properties: 150,
                popularAreas: ["Центр", "Уручье", "Каменная горка", "Малиновка", "Восток"],
                coordinates: { lat: 53.9023, lng: 27.5619 }
            },
            "gomel": {
                name: "Гомель",
                population: "535 тыс",
                region: "Гомельская область",
                properties: 85,
                popularAreas: ["Центр", "Новая Гута", "Волотова", "Сельмаш"],
                coordinates: { lat: 52.4345, lng: 31.0043 }
            },
            "vitebsk": {
                name: "Витебск",
                population: "364 тыс",
                region: "Витебская область",
                properties: 75,
                popularAreas: ["Центр", "Московский проспект", "Юг-5", "Марковщина"],
                coordinates: { lat: 55.1904, lng: 30.2049 }
            },
            "grodno": {
                name: "Гродно",
                population: "357 тыс",
                region: "Гродненская область",
                properties: 65,
                popularAreas: ["Центр", "Ольшанка", "Девятовка", "Фолюш"],
                coordinates: { lat: 53.6693, lng: 23.8131 }
            },
            "brest": {
                name: "Брест",
                population: "340 тыс",
                region: "Брестская область",
                properties: 60,
                popularAreas: ["Центр", "Восток", "Ковалёво", "Южный"],
                coordinates: { lat: 52.0976, lng: 23.7341 }
            },
            "mogilev": {
                name: "Могилёв",
                population: "357 тыс",
                region: "Могилёвская область",
                properties: 55,
                popularAreas: ["Центр", "Казимировка", "Спутник", "Любуж"],
                coordinates: { lat: 53.8945, lng: 30.3307 }
            },
            "borisov": {
                name: "Борисов",
                population: "143 тыс",
                region: "Минская область",
                properties: 40,
                popularAreas: ["Центр", "Старый Борисов", "Печи"],
                coordinates: { lat: 54.2279, lng: 28.5056 }
            },
            "soligorsk": {
                name: "Солигорск",
                population: "106 тыс",
                region: "Минская область",
                properties: 35,
                popularAreas: ["Центр", "Шахтёрская", "Северный"],
                coordinates: { lat: 52.7928, lng: 27.5344 }
            },
            "baranovichi": {
                name: "Барановичи",
                population: "179 тыс",
                region: "Брестская область",
                properties: 30,
                popularAreas: ["Центр", "Восточный", "Лесной"],
                coordinates: { lat: 53.1325, lng: 26.0134 }
            },
            "pinsk": {
                name: "Пинск",
                population: "138 тыс",
                region: "Брестская область",
                properties: 25,
                popularAreas: ["Центр", "Западный", "Ковнятин"],
                coordinates: { lat: 52.1119, lng: 26.1025 }
            },
            "orsha": {
                name: "Орша",
                population: "116 тыс",
                region: "Витебская область",
                properties: 20,
                popularAreas: ["Центр", "Северный", "Заднепровье"],
                coordinates: { lat: 54.5093, lng: 30.4255 }
            },
            "molodechno": {
                name: "Молодечно",
                population: "94 тыс",
                region: "Минская область",
                properties: 20,
                popularAreas: ["Центр", "Южный", "Лесной"],
                coordinates: { lat: 54.3087, lng: 26.8121 }
            },
            "lida": {
                name: "Лида",
                population: "103 тыс",
                region: "Гродненская область",
                properties: 15,
                popularAreas: ["Центр", "Минойты", "Индустриальная"],
                coordinates: { lat: 53.8886, lng: 25.3027 }
            },
            "novopolotsk": {
                name: "Новополоцк",
                population: "102 тыс",
                region: "Витебская область",
                properties: 18,
                popularAreas: ["Центр", "Боровуха", "Молодёжная"],
                coordinates: { lat: 55.5322, lng: 28.6586 }
            },
            "bobruysk": {
                name: "Бобруйск",
                population: "217 тыс",
                region: "Могилёвская область",
                properties: 18,
                popularAreas: ["Центр", "Березина", "Еловики"],
                coordinates: { lat: 53.1384, lng: 29.2214 }
            }
        };
    }

    // Получение сохраненного пользователя
    getSavedUser() {
        const saved = localStorage.getItem('tradeSpaceUser');
        return saved ? JSON.parse(saved) : null;
    }

    // Сохранение пользователя
    saveUser(user) {
        localStorage.setItem('tradeSpaceUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Удаление пользователя
    removeUser() {
        localStorage.removeItem('tradeSpaceUser');
        this.currentUser = null;
    }

    // Аутентификация
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.saveUser(user);
            return { success: true, user };
        }
        return { success: false, message: "Неверный email или пароль" };
    }

    // Регистрация
    register(userData) {
        // Проверка существующего пользователя
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: "Пользователь с таким email уже существует" };
        }

        // Создание нового пользователя
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            role: userData.userType || "user",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4A90E2&color=fff`,
            favorites: [],
            listings: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUser(newUser);

        return { success: true, user: newUser };
    }

    // Выход
    logout() {
        this.removeUser();
        return { success: true };
    }

    // Получение всех объектов
    getAllProperties() {
        return this.properties;
    }

    // Получение доступных объектов
    getAvailableProperties() {
        return this.properties.filter(p => p.status === "available");
    }

    // Получение объектов по типу
    getPropertiesByType(type) {
        if (type === "all") return this.getAvailableProperties();
        return this.getAvailableProperties().filter(p => p.type === type);
    }

    // Получение объектов по городу
    getPropertiesByCity(city) {
        if (!city) return this.getAvailableProperties();
        return this.getAvailableProperties().filter(p => p.city === city);
    }

    // Поиск объектов
    searchProperties(query) {
        const q = query.toLowerCase();
        return this.getAvailableProperties().filter(p => 
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.features.some(f => f.toLowerCase().includes(q))
        );
    }

    // Фильтрация объектов
    filterProperties(filters) {
        let results = this.getAvailableProperties();

        if (filters.city) {
            results = results.filter(p => p.city === filters.city);
        }

        if (filters.type && filters.type !== "all") {
            results = results.filter(p => p.type === filters.type);
        }

        if (filters.area) {
            const [min, max] = filters.area.split("-").map(Number);
            if (max) {
                results = results.filter(p => p.area >= min && p.area <= max);
            } else {
                results = results.filter(p => p.area >= min);
            }
        }

        if (filters.price) {
            const [min, max] = filters.price.split("-").map(Number);
            if (max) {
                results = results.filter(p => p.price >= min && p.price <= max);
            } else {
                results = results.filter(p => p.price >= min);
            }
        }

        return results;
    }

    // Сортировка объектов
    sortProperties(properties, sortType) {
        const sorted = [...properties];

        switch (sortType) {
            case "newest":
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case "price_asc":
                return sorted.sort((a, b) => a.price - b.price);
            case "price_desc":
                return sorted.sort((a, b) => b.price - a.price);
            case "area_desc":
                return sorted.sort((a, b) => b.area - a.area);
            case "popular":
                return sorted.sort((a, b) => b.views - a.views);
            default:
                return sorted;
        }
    }

    // Получение объекта по ID
    getPropertyById(id) {
        const property = this.properties.find(p => p.id === id);
        if (property) {
            property.views++;
        }
        return property;
    }

    // Добавление объекта
    addProperty(propertyData) {
        const newProperty = {
            id: this.properties.length + 1,
            ...propertyData,
            status: "available",
            views: 0,
            favorites: 0,
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser?.id || null
        };

        this.properties.push(newProperty);

        // Добавляем в список объявлений пользователя
        if (this.currentUser) {
            this.currentUser.listings.push(newProperty.id);
            this.saveUser(this.currentUser);
        }

        return newProperty;
    }

    // Получение информации о городе
    getCityInfo(cityCode) {
        return this.cities[cityCode] || null;
    }

    // Получение всех городов
    getAllCities() {
        return Object.entries(this.cities).map(([code, info]) => ({
            code,
            ...info
        }));
    }

    // Получение иконки по типу
    getPropertyIcon(type) {
        const icons = {
            "store": "fas fa-store",
            "mall": "fas fa-shopping-cart",
            "kiosk": "fas fa-utensils",
            "street": "fas fa-umbrella",
            "foodcourt": "fas fa-hamburger",
            "showroom": "fas fa-tv",
            "market": "fas fa-shopping-basket",
            "warehouse": "fas fa-warehouse"
        };
        return icons[type] || "fas fa-building";
    }

    // Получение названия типа
    getPropertyTypeName(type) {
        const names = {
            "store": "Магазин",
            "mall": "Торговый центр",
            "kiosk": "Киоск/Островок",
            "street": "Уличная торговля",
            "foodcourt": "Фуд-корт",
            "showroom": "Шоу-рум",
            "market": "Рынок",
            "warehouse": "Склад+Торговля"
        };
        return names[type] || "Торговая площадь";
    }

    // Получение названия города
    getCityName(cityCode) {
        const city = this.cities[cityCode];
        return city ? city.name : "Неизвестный город";
    }

    // Добавление в избранное
    toggleFavorite(propertyId) {
        if (!this.currentUser) return false;

        const index = this.currentUser.favorites.indexOf(propertyId);
        const property = this.getPropertyById(propertyId);

        if (index === -1) {
            this.currentUser.favorites.push(propertyId);
            if (property) property.favorites++;
        } else {
            this.currentUser.favorites.splice(index, 1);
            if (property) property.favorites--;
        }

        this.saveUser(this.currentUser);
        return true;
    }

    // Проверка избранного
    isFavorite(propertyId) {
        if (!this.currentUser) return false;
        return this.currentUser.favorites.includes(propertyId);
    }

    // Получение избранных объектов
    getFavorites() {
        if (!this.currentUser) return [];
        return this.properties.filter(p => this.currentUser.favorites.includes(p.id));
    }

    // Получение объявлений пользователя
    getUserListings() {
        if (!this.currentUser) return [];
        return this.properties.filter(p => p.createdBy === this.currentUser.id);
    }

    // Получение статистики
    getStats() {
        const totalProperties = this.properties.length;
        const availableProperties = this.getAvailableProperties().length;
        const totalUsers = this.users.length;
        const totalViews = this.properties.reduce((sum, p) => sum + p.views, 0);
        const totalFavorites = this.properties.reduce((sum, p) => sum + p.favorites, 0);

        return {
            totalProperties,
            availableProperties,
            totalUsers,
            totalViews,
            totalFavorites,
            recentProperties: this.properties.slice(-5).reverse()
        };
    }
}

// Создаем глобальный экземпляр базы данных
const db = new Database();
