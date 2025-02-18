import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { getSpeakersList } from '../slices/speakersSlice';
import { RootState, useAppDispatch } from '../store';
import './meetupPage.css';
import { BreadCrumbs } from "../components/BreadCrumbs";

const SpeakersEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const speakers = useSelector((state: RootState) => state.speakers.speakersData.speakers);

   useEffect(() => {
      dispatch(getSpeakersList());
    }, [dispatch]); // Пустой массив зависимостей означает, что эффект выполнится только один раз

  const handleCardClick = (speaker_id: number | undefined) => {
    navigate(`${ROUTES.SPEAKERS}/${speaker_id}`);
  };

  return (
    <div className="container mx-0">
    <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SPEAKERSEDITOR }]} />
      <div className="meetup-card-list">
        {speakers.map((speaker, index) => (
          <div key={index} className="speaker-card justify-content-between align-items-center">
            <div className="m-text-container">
              <p className="primary-text">{speaker.first_name}</p>
            </div>
            <Form.Control
              className="duration-input"
              name="approx_perfomance_duration"
              type="text"
              //value={invite.approx_perfomance_duration || ''}
              //onChange={(e) => handleInviteChange(invite.speaker.id, e.target.value)}
              //onBlur={() => handleSaveInvite(invite.speaker.id)} 
            />
            <div className="m-text-container">
              <p className="primary-text">минут</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakersEditor;