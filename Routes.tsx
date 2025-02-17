export const ROUTES = {
    HOME: "/",
    SPEAKERS: "/speakers",
    LOGIN: "/login",
    MEETUP: "/meetup",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SPEAKERS: "Спикеры",
    LOGIN: "Авторизация",
    MEETUP: "Митап",
  };