export const ROUTES = {
    HOME: "/",
    SPEAKERS: "/speakers",
    LOGIN: "/login",
    REGISTER: "/register",
    MEETUP: "/meetup",
    SPEAKERSEDITOR: "/speakers-editor",
    FORBIDDEN: "/403",
    MEETUPSEDITOR: "/meetups-editor"
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SPEAKERS: "Спикеры",
    LOGIN: "Авторизация",
    MEETUP: "Митап",
    SPEAKERSEDITOR: "Редактирование спикеров",
    FORBIDDEN: "403",
    MEETUPSEDITOR: "Митапы",
    REGISTER: "Регистрация",
  };