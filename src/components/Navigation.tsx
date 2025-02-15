import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import logo from '../assets/logo.jpeg'
import './Navigation.css'

const Navigation = () => {
    return (
        <Navbar expand="lg" className="m-0 p-0">
            <Container className="d-flex flex-dir-row p-0 align-items-center">
                {/* Логотип и бренд (слева) */}
                <Navbar.Brand as={Link} to={ROUTES.HOME} className="logo-container">
                <img src={logo} alt="aima" title="aima" />
                <span>Aima</span>
                </Navbar.Brand>

                {/* Кнопка "бургер" для мобильных устройств */}
                <Navbar.Toggle aria-controls="navbar-nav" className="custom-navbar-toggler" />

                {/* Контейнер для навигации, который сворачивается на мобильных устройствах */}
                <Navbar.Collapse id="navbar-nav">
                {/* Навигационные ссылки (справа) */}
                <Nav className="ms-auto"> {/* Выравнивание справа */}
                    <Nav.Link as={Link} to={ROUTES.HOME} className="d-inline-block px-3">
                    {ROUTE_LABELS.HOME}
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTES.SPEAKERS} className="d-inline-block px-3">
                    {ROUTE_LABELS.SPEAKERS}
                    </Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;