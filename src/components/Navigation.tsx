import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import logo from '../assets/logo.jpeg'
import './Navigation.css'

const Navigation = () => {
    return (
        <Navbar expand="lg" className="m-0 p-0">
            <Container>
                <Nav className="w-100 d-flex justify-content-between">
                    <Navbar.Brand as={Link} to={ROUTES.HOME} className="logo-container">
                        <img src={logo} alt="aima" title="aima"/>
                        <span>Aima</span>
                    </Navbar.Brand>
                    <div className="nav-container">
                        <Nav.Link as={Link} to={ROUTES.HOME} className="d-inline-block">
                            {ROUTE_LABELS.HOME}
                        </Nav.Link>
                        <Nav.Link as={Link} to={ROUTES.SPEAKERS} className="d-inline-block">
                            {ROUTE_LABELS.SPEAKERS}
                        </Nav.Link>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Navigation;