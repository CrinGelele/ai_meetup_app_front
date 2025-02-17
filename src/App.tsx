import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/speakerPage";
import ITunesPage from "./pages/speakers";
import { ROUTES } from "../Routes";
import { HomePage } from "./pages/homePage";
import Navigation from "./components/Navigation";
import './App.css';
import LoginPage from "./pages/loginPage"
import MeetupPage from "./pages/meetupPage";

function App() {
  return (
    <BrowserRouter basename="/ai_meetup_app_front">
    <div className="space">
        <Navigation/>
        <div className="content-container">
          <Routes>
            <Route path={ROUTES.HOME} index element={<HomePage />} />
            <Route path={ROUTES.SPEAKERS} element={<ITunesPage />} />
            <Route path={`${ROUTES.SPEAKERS}/:id`} element={<AlbumPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={`${ROUTES.MEETUP}/:current_meetup_id`} element={<MeetupPage />} />
          </Routes>
        </div>
    </div>
    </BrowserRouter>
  );
}

export default App;