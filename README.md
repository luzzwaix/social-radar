# SocialRadar (Frontend)

Frontend-прототип для кейса `AI inDrive / Decentrathon 5.0 (Case #3)`:
платформа раннего обнаружения социальных рисков по районам Алматы с human-in-the-loop логикой.

## 1) Что уже реализовано

- Palantir-style аналитический интерфейс (React).
- Карта районов Алматы + выбор района.
- Дашборд метрик и таблица сравнения.
- Страница активного кейса с AI-рекомендацией и объяснением.
- Блок трассируемости источников и ограничений.
- Human-in-the-loop: финальное действие выполняет человек (`Эскалировать` / `Отклонить` / `Принять`).
- Интеграция с live endpoint для district snapshot.

## 2) Быстрый запуск

```bash
npm install
npm start
```

Локально: `http://localhost:3000`

Production build:

```bash
npm run build
```

## 3) Конфигурация

См. [`.env.example`](./.env.example)

- `API_BASE_URL` — базовый URL будущего FastAPI.
- `DISTRICTS_ENDPOINT` — live snapshot endpoint (по умолчанию уже настроен).

Текущий live endpoint:
- `https://social-radar-final.onrender.com/api/districts`

## 4) Архитектура решения (для формы)

Архитектурная схема:
- [public/assets/architecture.png](./public/assets/architecture.png)

Кратко:
1. Источники данных (open/stat/proxy в рамках прототипа).
2. ML-слой (подготовлен контур explainable scoring).
3. FastAPI (prediction/snapshot API).
4. React dashboard (карта, риски, кейсы, explainability).

## 5) Минимально работающий элемент (для формы)

Минимально рабочий элемент уже доступен в текущем репозитории:

- Фронтенд получает live-данные районов через `DISTRICTS_ENDPOINT`.
- На карте и в карточках отображаются `risk_score`, `risk_level`, `top_factor`.
- В `Активном кейсе` показывается AI-рекомендация и объяснение факторов.
- Решение не автоматизируется: оператор принимает итоговое действие вручную.

Техническая точка входа:
- [src/api/socialRadar.js](./src/api/socialRadar.js)

## 6) Соответствие ТЗ кейса #3

- Explainability: в UI есть объяснение рекомендаций и факторы.
- Human-in-the-loop: финальное решение за экспертом.
- Open-data подход: используются агрегаты и документированные источники.
- Без ПДн: персональные данные не отображаются.
- Demo-ready UX: карта + аналитика + кейсовый сценарий.

Важно: это frontend-first этап. Backend/ML команда подключает полноценную модель и API-контракты без смены UX-архитектуры.

## 7) Стек

- React 18
- React Router
- Framer Motion
- Tailwind CSS
- Recharts
- Leaflet / React Leaflet
- TanStack Table
- Parcel

## 8) Ключевые файлы

- [src/App.jsx](./src/App.jsx)
- [src/routes/OverviewPage.jsx](./src/routes/OverviewPage.jsx)
- [src/routes/DistrictPage.jsx](./src/routes/DistrictPage.jsx)
- [src/routes/CasePage.jsx](./src/routes/CasePage.jsx)
- [src/components/socialradar/DistrictMap.jsx](./src/components/socialradar/DistrictMap.jsx)
- [src/components/advisor/AdvisorPanel.jsx](./src/components/advisor/AdvisorPanel.jsx)
- [src/components/socialradar/DataProvenancePanel.jsx](./src/components/socialradar/DataProvenancePanel.jsx)
- [src/hooks/useSocialRadarWorkspace.js](./src/hooks/useSocialRadarWorkspace.js)

## 9) Ограничения текущего этапа

- Геометрия районов в демо-режиме (не официальный GIS-publish).
- Часть данных в прототипе может быть proxy/демо-слоем (это явно маркируется).
- Финальная production-валидация выполняется после полного backend+ML merge.

