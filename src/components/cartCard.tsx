import { FC } from "react";
import { Card } from "react-bootstrap";
import "./cartCard.css";
import cartImage from "../assets/meetup_icon.jpg"
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes";

interface Props {
    value: string | null
    meetup_id: number | null
}
export const CartCard: FC<Props> = ({
    value,
    meetup_id
}) => {

    const navigate = useNavigate();

const handleClick = (id: number | null) => {
    if (id) {
        navigate(`${ROUTES.MEETUP}/${id}`);
    }
};

  return (
    <div className="meetup-card">
      <Card.Img
        className="cardImage"
        variant="bottom"
        src={cartImage}
        onClick={() => handleClick(meetup_id ? meetup_id : NaN)}
      />
      <p className="speakers-counter">{value}</p>
    </div>
  );
};