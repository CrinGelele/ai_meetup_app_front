import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import logo from '../assets/logo.jpeg'
import './Navigation.css'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, RootState } from '../store';
import { logoutUserAsync } from '../slices/usersSlice'; 
import { setSearchValue, getSpeakersList } from '../slices/speakersSlice'; 

const Navigation = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated); // получение из стора значения флага состояния приложения
    const username = useSelector((state: RootState) => state.user.username); // получение значения username из стора
    const isModerator = useSelector((state: RootState) => state.user.isModerator);

    // Обработчик события нажатия на кнопку "Выйти"
    const handleExit = async ()  => {
        await dispatch(logoutUserAsync());
        dispatch(setSearchValue('')); // можно реализовать в `extrareducers` у функции logoutUserAsynс
        navigate('/speakers'); // переход на страницу списка услуг
        await dispatch(getSpeakersList()); // для показа очищения поля поиска
    }

    return (
        <Navbar expand="lg" className="m-0 p-0">
            <Container className="d-flex flex-dir-row p-0 align-items-center">
                {/* Логотип и бренд (слева) */}
                <Navbar.Brand as={Link} to={ROUTES.HOME} className="logo-container">
                
                <span>Aima</span>
                </Navbar.Brand>

                {/* Кнопка "бургер" для мобильных устройств */}
                <Navbar.Toggle aria-controls="navbar-nav" className="custom-navbar-toggler" />

                {/* Контейнер для навигации, который сворачивается на мобильных устройствах */}
                <Navbar.Collapse id="navbar-nav">
                {/* Навигационные ссылки (справа) */}
                <Nav className="ms-auto"> {/* Выравнивание справа */}
                    {(isAuthenticated == true) && (isModerator == true) && (
                        <Nav.Link as={Link} to={ROUTES.SPEAKERSCREATOR} className="d-inline-block px-3">
                            Добавить спикера
                        </Nav.Link>
                    )}
                    <Nav.Link as={Link} to={ROUTES.HOME} className="d-inline-block px-3">
                    {ROUTE_LABELS.HOME}
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTES.SPEAKERS} className="d-inline-block px-3">
                    {ROUTE_LABELS.SPEAKERS}
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTES.MEETUPSEDITOR} className="d-inline-block px-3">
                        Митапы
                    </Nav.Link>
                    {isAuthenticated ? (
                        <Nav.Link as={Link} to={ROUTES.ACCOUNT} className="d-inline-block px-3">
                            {username}
                        </Nav.Link>
                    ) : (
                        <Nav.Link className="d-inline-block px-3">
                            Гость
                        </Nav.Link>
                    )}
                    {(isAuthenticated == false ) && (
                        <Nav.Link as={Link} to={ROUTES.LOGIN} className="d-inline-block px-3">
                        Войти
                        </Nav.Link>
                    )}
                    {(isAuthenticated == true) && (
                        <Nav.Link onClick={handleExit} className="d-inline-block px-3">
                        Выйти
                        </Nav.Link>
                    )}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;