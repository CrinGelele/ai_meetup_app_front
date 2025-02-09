import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/speakerPage";
import ITunesPage from "./pages/speakers";
import { ROUTES } from "../Routes";
import { HomePage } from "./pages/homePage";
import Navigation from "./components/Navigation";
import './App.css';

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
          </Routes>
        </div>
    </div>
    </BrowserRouter>
  );
}

export default App;