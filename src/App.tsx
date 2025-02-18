import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AlbumPage } from "./pages/speakerPage";
import ITunesPage from "./pages/speakers";
import { ROUTES } from "../Routes";
import { HomePage } from "./pages/homePage";
import Navigation from "./components/Navigation";
import './App.css';
import LoginPage from "./pages/loginPage"
import MeetupPage from "./pages/meetupPage";
import SpeakersEditor from './pages/speakersEditor';
import MeetupsEditor from './pages/meetupsEditor'
import { Page403 } from './pages/403Page';
import { Page404 } from './pages/404Page';
import { useSelector } from 'react-redux';
import {RootState} from './store';

const ProtectedRoute = ({ children, isAuthenticated, isModerator }) => {
  if (!isAuthenticated || !isModerator) {
    return <Navigate to="/403" replace />; // Перенаправление на страницу 403 (Запрещено)
  }
  return children;
};

const AuthRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/403" replace />; // Перенаправление на страницу 403 (Запрещено)
  }
  return children;
};

function App() {

  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isModerator = useSelector((state: RootState) => state.user.isModerator);

  return (
    <BrowserRouter basename="/ai_meetup_app_front">
    <div className="space">
        <Navigation/>
        <div className="content-container">
          <Routes>
            <Route path="*" element={<Page404 />} />
            <Route path={ROUTES.FORBIDDEN} index element={<Page403 />} />
            <Route path={ROUTES.HOME} index element={<HomePage />} />
            <Route path={ROUTES.SPEAKERS} element={<ITunesPage />} />
            <Route path={`${ROUTES.SPEAKERS}/:id`} element={<AlbumPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={`${ROUTES.MEETUP}/:current_meetup_id`} element={<MeetupPage />} />
            <Route
              path={ROUTES.SPEAKERSEDITOR}
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isModerator={isModerator}>
                  <SpeakersEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.MEETUPSEDITOR}
              element={
                <AuthRoute isAuthenticated={isAuthenticated}>
                  <MeetupsEditor />
                </AuthRoute>
              }
            />
          </Routes>
        </div>
    </div>
    </BrowserRouter>
  );
}

export default App;