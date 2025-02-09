import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { Button, Col, Container, Row } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <h1>AIMA</h1>
          <p>
            Добро пожаловать в AIMA!
          </p>
          <Link to={ROUTES.SPEAKERS}>
            <Button variant="primary">Наши спикеры</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};