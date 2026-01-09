// TradeRent Database System - ОБНОВЛЕННАЯ ВЕРСИЯ

// Инициализация базы данных
let users = [];
let properties = [];
let reviews = [];
let cities = ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест', 'Барановичи', 'Борисов', 'Пинск', 'Орша'];
let clients = [];
let rentals = [];

// Функция инициализации БД
function initializeDatabase() {
    // Проверяем, есть ли данные в localStorage
    const savedUsers = localStorage.getItem('traderent_users');
    const savedProperties = localStorage.getItem('traderent_properties');
    const savedReviews = localStorage.getItem('traderent_reviews');
    const savedClients = localStorage.getItem('traderent_clients');
    const savedRentals = localStorage.getItem('traderent_rentals');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Создаем тестовых пользователей (10+ пользователей с оригинальными почтами)
        users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'Александр Петров',
                email: 'alex.petrov@traderent.by',
                phone: '+375(29)526-09-95',
                birthdate: '1985-03-15',
                registrationDate: new Date('2023-01-15').toISOString()
            },
            {
                id: 2,
                username: 'ivanov',
                password: 'user123',
                role: 'user',
                name: 'Иван Иванов',
                email: 'ivanov.commerce@mail.ru',
                phone: '+375(29)345-67-89',
                birthdate: '1990-07-22',
                registrationDate: new Date('2023-02-20').toISOString()
            },
            {
                id: 3,
                username: 'sokolova',
                password: 'sokolova123',
                role: 'user',
                name: 'Мария Соколова',
                email: 'sokolova.business@gmail.com',
                phone: '+375(33)987-65-43',
                birthdate: '1988-11-05',
                registrationDate: new Date('2023-03-10').toISOString()
            },
            {
                id: 4,
                username: 'kuznetsov',
                password: 'kuznetsov123',
                role: 'user',
                name: 'Дмитрий Кузнецов',
                email: 'dkuznetsov.trade@yandex.ru',
                phone: '+375(25)234-56-78',
                birthdate: '1992-04-18',
                registrationDate: new Date('2023-03-25').toISOString()
            },
            {
                id: 5,
                username: 'novikova',
                password: 'novikova123',
                role: 'user',
                name: 'Елена Новикова',
                email: 'novikova.retail@tut.by',
                phone: '+375(44)876-54-32',
                birthdate: '1987-09-30',
                registrationDate: new Date('2023-04-05').toISOString()
            },
            {
                id: 6,
                username: 'vorobyov',
                password: 'vorobyov123',
                role: 'user',
                name: 'Андрей Воробьёв',
                email: 'vorobyov.invest@mail.by',
                phone: '+375(29)654-32-10',
                birthdate: '1995-01-12',
                registrationDate: new Date('2023-04-18').toISOString()
            },
            {
                id: 7,
                username: 'morozova',
                password: 'morozova123',
                role: 'user',
                name: 'Ольга Морозова',
                email: 'morozova.shop@gmail.com',
                phone: '+375(33)321-09-87',
                birthdate: '1991-06-25',
                registrationDate: new Date('2023-05-02').toISOString()
            },
            {
                id: 8,
                username: 'zhukov',
                password: 'zhukov123',
                role: 'user',
                name: 'Сергей Жуков',
                email: 'zhukov.commercial@mail.ru',
                phone: '+375(25)789-01-23',
                birthdate: '1983-12-08',
                registrationDate: new Date('2023-05-20').toISOString()
            },
            {
                id: 9,
                username: 'fedorova',
                password: 'fedorova123',
                role: 'user',
                name: 'Анна Фёдорова',
                email: 'fedorova.space@yandex.ru',
                phone: '+375(44)456-78-90',
                birthdate: '1994-02-14',
                registrationDate: new Date('2023-06-10').toISOString()
            },
            {
                id: 10,
                username: 'popov',
                password: 'popov123',
                role: 'user',
                name: 'Михаил Попов',
                email: 'popov.trading@tut.by',
                phone: '+375(29)890-12-34',
                birthdate: '1989-10-05',
                registrationDate: new Date('2023-06-25').toISOString()
            },
            {
                id: 11,
                username: 'volkova',
                password: 'volkova123',
                role: 'user',
                name: 'Татьяна Волкова',
                email: 'volkova.boutique@gmail.com',
                phone: '+375(33)567-89-01',
                birthdate: '1993-08-19',
                registrationDate: new Date('2023-07-05').toISOString()
            }
        ];
        saveUsers();
    }
    
    if (savedProperties) {
        properties = JSON.parse(savedProperties);
    } else {
        // Создаем тестовые площадки (15+ объектов)
        properties = [
            {
                id: 1,
                code: 'TP-001',
                title: 'Торговый центр "Столица"',
                description: 'Просторная торговая площадь в центре города с высоким трафиком. Идеально для магазина одежды или электроники. Высокие потолки, современная отделка, готовые коммуникации.',
                area: 150,
                floor: 1,
                dailyRentPrice: 200,
                hasAirConditioning: true,
                address: 'Минск, ул. Ленина, 25',
                city: 'Минск',
                ownerId: 2,
                ownerName: 'Иван Иванов',
                images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
                features: ['security', 'parking', 'internet', 'windows', 'entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                views: 45,
                contacts: 12
            },
            {
                id: 2,
                code: 'TP-002',
                title: 'Бутик в историческом центре',
                description: 'Небольшой бутик в историческом центре города. Уникальное расположение, высокая проходимость. Идеально для брендовой одежды или ювелирного магазина.',
                area: 80,
                floor: 1,
                dailyRentPrice: 120,
                hasAirConditioning: true,
                address: 'Гродно, ул. Советская, 15',
                city: 'Гродно',
                ownerId: 3,
                ownerName: 'Мария Соколова',
                images: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'],
                features: ['windows', 'entrance', 'heating', 'security'],
                status: 'approved',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                views: 28,
                contacts: 8
            },
            {
                id: 3,
                code: 'TP-003',
                title: 'Кафе в спальном районе',
                description: 'Помещение под кафе в спальном районе. Готовые коммуникации, отдельный вход, оборудованная кухня. Идеально для открытия кофейни или небольшого ресторана.',
                area: 120,
                floor: 1,
                dailyRentPrice: 150,
                hasAirConditioning: false,
                address: 'Брест, ул. Московская, 42',
                city: 'Брест',
                ownerId: 4,
                ownerName: 'Дмитрий Кузнецов',
                images: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop'],
                features: ['entrance', 'storage', 'internet'],
                status: 'pending',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                views: 15,
                contacts: 3
            },
            {
                id: 4,
                code: 'TP-004',
                title: 'Магазин продуктов у метро',
                description: 'Помещение в жилом комплексе у станции метро. Высокая проходимость, большая площадь, витринные окна. Подходит для супермаркета или магазина товаров повседневного спроса.',
                area: 200,
                floor: 1,
                dailyRentPrice: 180,
                hasAirConditioning: true,
                address: 'Минск, пр. Независимости, 58',
                city: 'Минск',
                ownerId: 5,
                ownerName: 'Елена Новикова',
                images: ['https://images.unsplash.com/photo-1604719312566-8912e4227c19?w=800&h=600&fit=crop'],
                features: ['windows', 'parking', 'storage', 'heating'],
                status: 'approved',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                views: 32,
                contacts: 10
            },
            {
                id: 5,
                code: 'TP-005',
                title: 'Офисное помещение с витриной',
                description: 'Современное офисное помещение с витринными окнами на первом этаже. Идеально для банка, турагентства или салона связи.',
                area: 90,
                floor: 1,
                dailyRentPrice: 140,
                hasAirConditioning: true,
                address: 'Витебск, ул. Замковая, 7',
                city: 'Витебск',
                ownerId: 6,
                ownerName: 'Андрей Воробьёв',
                images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop'],
                features: ['windows', 'internet', 'security', 'entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                views: 41,
                contacts: 9
            },
            {
                id: 6,
                code: 'TP-006',
                title: 'Торговая площадь на рынке',
                description: 'Место на крытом рынке. Низкая арендная ставка, высокая проходимость. Подходит для торговли продуктами, одеждой или сувенирами.',
                area: 40,
                floor: 1,
                dailyRentPrice: 60,
                hasAirConditioning: false,
                address: 'Гомель, ул. Советская, 25',
                city: 'Гомель',
                ownerId: 7,
                ownerName: 'Ольга Морозова',
                images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop'],
                features: ['entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                views: 27,
                contacts: 7
            },
            {
                id: 7,
                code: 'TP-007',
                title: 'Аренда в торговом комплексе',
                description: 'Помещение в современном торговом комплексе. Инфраструктура для бизнеса, централизованные системы безопасности и кондиционирования.',
                area: 110,
                floor: 2,
                dailyRentPrice: 170,
                hasAirConditioning: true,
                address: 'Могилёв, ул. Первомайская, 33',
                city: 'Могилёв',
                ownerId: 8,
                ownerName: 'Сергей Жуков',
                images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'],
                features: ['security', 'parking', 'internet', 'heating'],
                status: 'pending',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                views: 18,
                contacts: 4
            },
            {
                id: 8,
                code: 'TP-008',
                title: 'Помещение под аптеку',
                description: 'Специализированное помещение для аптеки. Готовые коммуникации, отдельный вход, система кондиционирования. Расположение в спальном районе.',
                area: 75,
                floor: 1,
                dailyRentPrice: 130,
                hasAirConditioning: true,
                address: 'Барановичи, ул. Советская, 41',
                city: 'Барановичи',
                ownerId: 9,
                ownerName: 'Анна Фёдорова',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop'],
                features: ['entrance', 'security', 'heating'],
                status: 'approved',
                createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                views: 23,
                contacts: 6
            },
            {
                id: 9,
                code: 'TP-009',
                title: 'Магазин электроники',
                description: 'Помещение в центре города, идеально подходящее для магазина электроники. Высокие потолки, современная электропроводка, система безопасности.',
                area: 130,
                floor: 1,
                dailyRentPrice: 190,
                hasAirConditioning: true,
                address: 'Борисов, ул. Гагарина, 12',
                city: 'Борисов',
                ownerId: 10,
                ownerName: 'Михаил Попов',
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
                features: ['security', 'internet', 'windows', 'entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                views: 35,
                contacts: 11
            },
            {
                id: 10,
                code: 'TP-010',
                title: 'Цветочный магазин',
                description: 'Небольшое уютное помещение для цветочного магазина. Большие окна, хорошее освещение, система полива. Идеальное расположение в центре.',
                area: 50,
                floor: 1,
                dailyRentPrice: 90,
                hasAirConditioning: false,
                address: 'Пинск, ул. Центральная, 8',
                city: 'Пинск',
                ownerId: 11,
                ownerName: 'Татьяна Волкова',
                images: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&h=600&fit=crop'],
                features: ['windows', 'entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                views: 21,
                contacts: 5
            },
            {
                id: 11,
                code: 'TP-011',
                title: 'Торговая площадь в ТЦ "Корона"',
                description: 'Помещение в крупном торговом центре. Высокий трафик, современная инфраструктура, централизованные системы обслуживания.',
                area: 95,
                floor: 3,
                dailyRentPrice: 160,
                hasAirConditioning: true,
                address: 'Орша, ул. Мира, 15',
                city: 'Орша',
                ownerId: 2,
                ownerName: 'Иван Иванов',
                images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
                features: ['security', 'parking', 'internet', 'heating', 'entrance'],
                status: 'approved',
                createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                views: 39,
                contacts: 14
            },
            {
                id: 12,
                code: 'TP-012',
                title: 'Помещение под салон красоты',
                description: 'Помещение для салона красоты или парикмахерской. Готовые коммуникации для воды, отдельные кабинеты, система вентиляции.',
                area: 110,
                floor: 1,
                dailyRentPrice: 170,
                hasAirConditioning: true,
                address: 'Минск, ул. Калиновского, 55',
                city: 'Минск',
                ownerId: 3,
                ownerName: 'Мария Соколова',
                images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop'],
                features: ['entrance', 'internet', 'heating', 'windows'],
                status: 'pending',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                views: 16,
                contacts: 3
            },
            {
                id: 13,
                code: 'TP-013',
                title: 'Книжный магазин в центре',
                description: 'Атмосферное помещение для книжного магазина. Деревянные полы, высокие стеллажи, уютное освещение. Идеально для букинистического магазина.',
                area: 85,
                floor: 1,
                dailyRentPrice: 125,
                hasAirConditioning: true,
                address: 'Гродно, ул. Ожешко, 17',
                city: 'Гродно',
                ownerId: 4,
                ownerName: 'Дмитрий Кузнецов',
                images: ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop'],
                features: ['windows', 'entrance', 'heating'],
                status: 'approved',
                createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
                views: 29,
                contacts: 8
            },
            {
                id: 14,
                code: 'TP-014',
                title: 'Спортивный магазин',
                description: 'Помещение для спортивного магазина. Широкий вход, просторный зал, система демонстрации товаров. Рядом с фитнес-центром.',
                area: 140,
                floor: 1,
                dailyRentPrice: 210,
                hasAirConditioning: true,
                address: 'Брест, ул. Гоголя, 22',
                city: 'Брест',
                ownerId: 5,
                ownerName: 'Елена Новикова',
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'],
                features: ['entrance', 'parking', 'windows', 'security'],
                status: 'approved',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                views: 33,
                contacts: 9
            },
            {
                id: 15,
                code: 'TP-015',
                title: 'Кафе с летней террасой',
                description: 'Помещение для кафе с летней террасой. Отдельный вход, подготовленное место под кухню, возможность летней торговли.',
                area: 160,
                floor: 1,
                dailyRentPrice: 240,
                hasAirConditioning: true,
                address: 'Минск, пр. Победителей, 9',
                city: 'Минск',
                ownerId: 6,
                ownerName: 'Андрей Воробьёв',
                images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'],
                features: ['entrance', 'internet', 'storage', 'windows'],
                status: 'approved',
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
                views: 47,
                contacts: 15
            }
        ];
        saveProperties();
    }
    
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        // Создаем отзывы для пользователей и площадок
        reviews = [
            // Отзывы для пользователя 2 (Иван Иванов)
            {
                id: 1,
                authorId: 3,
                authorName: 'Мария Соколова',
                targetUserId: 2,
                targetPropertyId: 1,
                rating: 5,
                comment: 'Отличный арендодатель! Помещение полностью соответствовало описанию. Все вопросы решались оперативно. Рекомендую!',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                authorId: 4,
                authorName: 'Дмитрий Кузнецов',
                targetUserId: 2,
                targetPropertyId: 11,
                rating: 4,
                comment: 'Хорошая площадка в торговом центре. Трафик действительно высокий. Небольшие нарекания к системе кондиционирования, но в целом всё отлично.',
                createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
            },
            
            // Отзывы для пользователя 3 (Мария Соколова)
            {
                id: 3,
                authorId: 2,
                authorName: 'Иван Иванов',
                targetUserId: 3,
                targetPropertyId: 2,
                rating: 5,
                comment: 'Прекрасное расположение! Бутик в самом центре города привлекает много клиентов. Владелица очень ответственная и приятная в общении.',
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                authorId: 5,
                authorName: 'Елена Новикова',
                targetUserId: 3,
                targetPropertyId: 12,
                rating: 5,
                comment: 'Идеальное помещение для салона красоты! Все коммуникации готовы, отдельные кабинеты удобно расположены. Очень довольна сотрудничеством.',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            
            // Отзывы для пользователя 4 (Дмитрий Кузнецов)
            {
                id: 5,
                authorId: 6,
                authorName: 'Андрей Воробьёв',
                targetUserId: 4,
                targetPropertyId: 3,
                rating: 4,
                comment: 'Кафе работает успешно благодаря хорошему расположению. Арендодатель всегда идёт на встречу при решении вопросов.',
                createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 6,
                authorId: 7,
                authorName: 'Ольга Морозова',
                targetUserId: 4,
                targetPropertyId: 13,
                rating: 5,
                comment: 'Книжный магазин получился просто замечательный! Атмосферное помещение идеально подходит для этого бизнеса. Большое спасибо!',
                createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
            },
            
            // Отзывы для пользователя 5 (Елена Новикова)
            {
                id: 7,
                authorId: 8,
                authorName: 'Сергей Жуков',
                targetUserId: 5,
                targetPropertyId: 4,
                rating: 5,
                comment: 'Магазин у метро - отличная инвестиция. Высокая проходимость обеспечивает хорошую выручку. Рекомендую эту площадку.',
                createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 8,
                authorId: 9,
                authorName: 'Анна Фёдорова',
                targetUserId: 5,
                targetPropertyId: 14,
                rating: 4,
                comment: 'Спортивный магазин процветает. Расположение рядом с фитнес-центром - большое преимущество. Есть небольшие пожелания по освещению.',
                createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
            },
            
            // Отзывы для пользователя 6 (Андрей Воробьёв)
            {
                id: 9,
                authorId: 10,
                authorName: 'Михаил Попов',
                targetUserId: 6,
                targetPropertyId: 5,
                rating: 5,
                comment: 'Офисное помещение полностью соответствует описанию. Современная отделка, хорошее освещение, кондиционер работает отлично.',
                createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 10,
                authorId: 11,
                authorName: 'Татьяна Волкова',
                targetUserId: 6,
                targetPropertyId: 15,
                rating: 5,
                comment: 'Кафе с террасой - мечта! Летом работаем на улице, зимой - в уютном зале. Очень довольны площадкой и сотрудничеством.',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        saveReviews();
    }
    
    if (savedClients) {
        clients = JSON.parse(savedClients);
    } else {
        clients = [
            {
                id: 1,
                code: 'CL-001',
                name: 'ООО "Ромашка"',
                contactPerson: 'Петров Пётр Петрович',
                phone: '+375(29)111-22-33',
                email: 'info@romashka.by',
                address: 'Минск, ул. Победы, 10',
                status: 'active'
            },
            {
                id: 2,
                code: 'CL-002',
                name: 'ИП Сидоров',
                contactPerson: 'Сидоров Сидор Сидорович',
                phone: '+375(29)222-33-44',
                email: 'sidorov@mail.ru',
                address: 'Гомель, ул. Советская, 5',
                status: 'active'
            },
            {
                id: 3,
                code: 'CL-003',
                name: 'ТОО "Восток Сервис"',
                contactPerson: 'Козлова Елена Викторовна',
                phone: '+375(33)333-44-55',
                email: 'vostok.service@gmail.com',
                address: 'Брест, ул. Кирова, 15',
                status: 'active'
            }
        ];
        saveClients();
    }
    
    if (savedRentals) {
        rentals = JSON.parse(savedRentals);
    } else {
        rentals = [
            {
                id: 1,
                code: 'RNT-001',
                contractNumber: 'ДОГ-2024-001',
                tradingPointId: 1,
                clientId: 1,
                startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                dailyPrice: 200,
                status: 'active'
            },
            {
                id: 2,
                code: 'RNT-002',
                contractNumber: 'ДОГ-2024-002',
                tradingPointId: 2,
                clientId: 2,
                startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                dailyPrice: 120,
                status: 'active'
            },
            {
                id: 3,
                code: 'RNT-003',
                contractNumber: 'ДОГ-2024-003',
                tradingPointId: 4,
                clientId: 3,
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                dailyPrice: 180,
                status: 'active'
            }
        ];
        saveRentals();
    }
}

// Функции сохранения данных
function saveUsers() {
    localStorage.setItem('traderent_users', JSON.stringify(users));
}

function saveProperties() {
    localStorage.setItem('traderent_properties', JSON.stringify(properties));
}

function saveReviews() {
    localStorage.setItem('traderent_reviews', JSON.stringify(reviews));
}

function saveClients() {
    localStorage.setItem('traderent_clients', JSON.stringify(clients));
}

function saveRentals() {
    localStorage.setItem('traderent_rentals', JSON.stringify(rentals));
}

// Функции работы с пользователями
function findUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

function findUserByUsername(username) {
    return users.find(user => user.username === username);
}

function registerUser(userData) {
    const existingUser = findUserByUsername(userData.username);
    if (existingUser) {
        throw new Error('Пользователь с таким логином уже существует');
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    return newUser;
}

function getUserById(id) {
    return users.find(user => user.id === id);
}

function getAllUsers() {
    return [...users];
}

// Функции для работы с текущим пользователем
function getCurrentUser() {
    const userId = localStorage.getItem('traderent_current_user');
    if (!userId) return null;
    return getUserById(parseInt(userId));
}

function setCurrentUser(user) {
    localStorage.setItem('traderent_current_user', user.id);
}

function logoutUser() {
    localStorage.removeItem('traderent_current_user');
}

// Функции работы с площадками
function addProperty(propertyData) {
    const newProperty = {
        id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1,
        code: `TP-${String(properties.length + 1).padStart(3, '0')}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        views: 0,
        contacts: 0,
        ...propertyData
    };
    
    properties.push(newProperty);
    saveProperties();
    return newProperty;
}

function getApprovedProperties() {
    return properties.filter(property => property.status === 'approved');
}

function getPendingProperties() {
    return properties.filter(property => property.status === 'pending');
}

function getAllProperties() {
    return [...properties];
}

function getPropertyById(id) {
    return properties.find(property => property.id === id);
}

function getUserProperties(userId) {
    return properties.filter(property => property.ownerId === userId);
}

function updatePropertyStatus(propertyId, status, rejectReason = null) {
    const property = getPropertyById(propertyId);
    if (property) {
        property.status = status;
        if (rejectReason) {
            property.rejectReason = rejectReason;
        }
        saveProperties();
        return true;
    }
    return false;
}

function deleteProperty(propertyId) {
    const index = properties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
        properties.splice(index, 1);
        saveProperties();
        return true;
    }
    return false;
}

function incrementPropertyViews(propertyId) {
    const property = getPropertyById(propertyId);
    if (property) {
        property.views = (property.views || 0) + 1;
        saveProperties();
    }
}

function incrementPropertyContacts(propertyId) {
    const property = getPropertyById(propertyId);
    if (property) {
        property.contacts = (property.contacts || 0) + 1;
        saveProperties();
    }
}

// Функции поиска и фильтрации
function searchProperties(filters) {
    let results = getApprovedProperties();
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        results = results.filter(property => 
            property.title.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm) ||
            property.address.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.city) {
        results = results.filter(property => property.city === filters.city);
    }
    
    if (filters.area) {
        results = results.filter(property => property.area <= parseInt(filters.area));
    }
    
    if (filters.price) {
        results = results.filter(property => property.dailyRentPrice <= parseInt(filters.price));
    }
    
    return results;
}

function getPropertiesByCity(city) {
    return properties.filter(property => property.city === city && property.status === 'approved');
}

function getCityTradingPointsCount(city) {
    return getPropertiesByCity(city).length;
}

// Функции для отзывов
function addReview(reviewData) {
    const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        ...reviewData,
        createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    saveReviews();
    return newReview;
}

function getReviewsForUser(userId) {
    return reviews.filter(review => review.targetUserId === userId);
}

function getReviewsForProperty(propertyId) {
    return reviews.filter(review => review.targetPropertyId === propertyId);
}

function getUserReviews(userId) {
    return reviews.filter(review => review.authorId === userId);
}

function getAllReviews() {
    return [...reviews];
}

// Функции для городов
function getCities() {
    return [...cities];
}

function addCity(city) {
    if (!cities.includes(city)) {
        cities.push(city);
        return true;
    }
    return false;
}

// Функции для клиентов
function getAllClients() {
    return [...clients];
}

function getClientById(id) {
    return clients.find(client => client.id === id);
}

function addClient(clientData) {
    const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        code: `CL-${String(clients.length + 1).padStart(3, '0')}`,
        status: 'active',
        ...clientData
    };
    
    clients.push(newClient);
    saveClients();
    return newClient;
}

function deleteClient(clientId) {
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
        clients.splice(index, 1);
        saveClients();
        return true;
    }
    return false;
}

// Функции для договоров аренды
function getAllRentals() {
    return [...rentals];
}

function addRental(rentalData) {
    const newRental = {
        id: rentals.length > 0 ? Math.max(...rentals.map(r => r.id)) + 1 : 1,
        code: `RNT-${String(rentals.length + 1).padStart(3, '0')}`,
        ...rentalData
    };
    
    rentals.push(newRental);
    saveRentals();
    return newRental;
}

function deleteRental(rentalId) {
    const index = rentals.findIndex(r => r.id === rentalId);
    if (index !== -1) {
        rentals.splice(index, 1);
        saveRentals();
        return true;
    }
    return false;
}

// Статистика для админа
function getAdminStats() {
    const approvedCount = getApprovedProperties().length;
    const pendingCount = getPendingProperties().length;
    const totalCount = approvedCount + pendingCount;
    
    return {
        totalTradingPoints: totalCount,
        pendingTradingPoints: pendingCount,
        approvedTradingPoints: approvedCount,
        totalUsers: users.length,
        activeClients: clients.filter(c => c.status === 'active').length,
        activeRentals: rentals.filter(r => r.status === 'active').length
    };
}

// Получить статистику для главной страницы
function getHomeStats() {
    return {
        totalProperties: getApprovedProperties().length,
        totalUsers: users.length,
        totalReviews: reviews.length
    };
}

// Обновить профиль пользователя
function updateUserProfile(userId, updatedData) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updatedData
        };
        saveUsers();
        return users[userIndex];
    }
    return null;
}

// Получить подробную статистику для админа
function getDetailedAdminStats() {
    const stats = getAdminStats();
    const cityStats = {};
    
    cities.forEach(city => {
        cityStats[city] = getPropertiesByCity(city).length;
    });
    
    return {
        ...stats,
        cityStats,
        monthlyGrowth: Math.floor((stats.totalTradingPoints / 100) * 15), // 15% рост
        averageRating: reviews.length > 0 ? 
            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 
            0
    };
}
