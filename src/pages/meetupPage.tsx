import "./meetupPage.css"
import { FC } from 'react';
import { Col, Row, Image, Alert } from "react-bootstrap";
import { ROUTES } from '../../Routes';
import { SpeakerCard } from '../components/SpeakerCard';
import Navigation from "../components/Navigation";
import { ROUTE_LABELS } from '../../Routes';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../store';
import { getMeetup } from '../slices/meetupsSlice';

const MeetupPage: FC = () => {
  const { current_meetup_id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { invites, meetupData, error} = useSelector((state: RootState) => state.meetup);

  useEffect(() => {
    if (current_meetup_id) {
      dispatch(getMeetup(current_meetup_id));
    }
  }, [dispatch]);


  const handleCardClick = (speaker_id: number | undefined) => {
    navigate(`${ROUTES.SPEAKERS}/${speaker_id}`);
  };

  return (
    <div>
        <Row className="g-4 px-4 w-100">
                    {invites.map((item, index) => (
                      <Col key={index} md={4} className="mb-0 mt-3">
                        <p>{item.speaker.first_name}</p>
                      </Col>
                    ))}
                    <Col md={4} className="mb-0 mt-3 d-flex justify-content-center align-items-center">
                    </Col>
                  </Row>
    </div>
  );
};

export default MeetupPage;