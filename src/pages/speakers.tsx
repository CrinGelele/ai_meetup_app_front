import "./speakers.css";
import { FC, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import InputField from "../components/InputField";
import { CartCard } from '../components/cartCard'
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { SpeakerCard } from "../components/SpeakerCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSpeakersList } from '../slices/speakersSlice'
import { useAppDispatch, RootState } from '../store';

const POLLING_INTERVAL = 20000; // 5 секунд

const ITunesPage: FC = () => {
  const dispatch = useAppDispatch();
  const { searchValue, loading } = useSelector((state: RootState) => state.speakers); // Получаем значение поиска из Redux
  const speakersData = useSelector((state: RootState) => state.speakers.speakersData);
  const speakers = speakersData?.speakers || [];
  const current_meetup_id = speakersData?.current_meetup_id || null;
  const speakers_quantity = speakersData?.speakers_quantity || null;
  

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSpeakersList());
    const interval = setInterval(() => {
        dispatch(getSpeakersList()); // Запрос для фильтров
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);
  
  const handleCardClick = (id: number) => {
    // клик на карточку, переход на страницу альбома
    navigate(`${ROUTES.SPEAKERS}/${id}`);
  };

  return (
    <div className="container">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SPEAKERS }]} />
      
      <InputField
        value={searchValue}
        loading={loading}
      />

      {loading && ( // здесь можно было использовать тернарный оператор, но это усложняет читаемость
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}
     {!loading &&
        (!speakers.length /* Проверка на существование данных */ ? (
          <div>
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </div>
        ) : (
          <Row className="g-4 px-4 w-100">
            {speakers.map((item, index) => (
              <Col key={index} md={4} className="mb-0 mt-3">
                <SpeakerCard
                  imageClickHandler={() => handleCardClick(item.id)}
                  {...item}
                />
              </Col>
            ))}
            <Col md={4} className="mb-0 mt-3 d-flex justify-content-center align-items-center">
              <CartCard value={speakers_quantity} meetup_id={current_meetup_id}/>
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default ITunesPage;