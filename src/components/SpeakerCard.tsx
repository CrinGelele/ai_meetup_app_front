import { FC } from "react";
import { Card } from "react-bootstrap";
import "./SpeakerCard.css";
import defaultImage from "../assets/defaultImage.png"

interface SpeakerCardProps {
    id?: number | undefined;
    first_name: string;
    last_name: string;
    workplace: string;
    description?: string | null | undefined;
    img_url?: string | null | undefined;
    imageClickHandler: () => void;
}

export const SpeakerCard: FC<SpeakerCardProps> = ({
    first_name,
    last_name,
    workplace,
    img_url,
    imageClickHandler,
}) => {

  return (
    <Card className="card">
      <Card.Body className="p-0">
        <div className="text-container">
          <Card.Title className="primary-text">{first_name}</Card.Title>
          <Card.Title className="primary-text">{last_name}</Card.Title>
          <Card.Subtitle className="secondary-text">{workplace}</Card.Subtitle>
        </div>
      </Card.Body>
      <Card.Img
        className="cardImage"
        variant="bottom"
        src={img_url ? img_url.replace('http://localhost:9000', '/minio') : defaultImage}
        onClick={imageClickHandler}
      />
    </Card>
  );
};