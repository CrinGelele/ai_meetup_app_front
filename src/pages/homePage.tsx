import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { Button, Container } from "react-bootstrap";
import './homePage.css'

export const HomePage: FC = () => {
  return (
    <Container>
        <div className="t-container">
          <h1 className="primary-text">AIMA</h1>
          <p className="secondary-text">
            Добро пожаловать в AIMA!
          </p>
          <Link to={ROUTES.SPEAKERS}>
            <Button className="submit-btn text-decoration-none">Наши спикеры</Button>
          </Link>
        </div>
    </Container>
  );
};