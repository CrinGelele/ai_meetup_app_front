import "./speakers.css";
import { FC, useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Speaker, getSpeakers } from "../modules/aimaApi";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { SpeakerCard } from "../components/SpeakerCard";
import { useNavigate } from "react-router-dom";
import { SPEAKERS_MOCK } from "../modules/mock";

const ITunesPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSpeakers()
      .then((response) => {
        setSpeakers(response.speakers);
        setLoading(false);
      })
      .catch(() => {
        setSpeakers(SPEAKERS_MOCK.speakers); // Используем mock данные в случае ошибки
        setLoading(false);
      });
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз

  const handleSearch = () => {
    setLoading(true);
    getSpeakers()
      .then((response) => {
        setSpeakers(
          response.speakers.filter((item) =>
              item.last_name
                  .toLocaleLowerCase()
                  .startsWith(searchValue.toLocaleLowerCase())
          )
        );
        setLoading(false);
      })
      .catch(() => { // В случае ошибки используем mock данные, фильтруем по имени
        setSpeakers(
          SPEAKERS_MOCK.speakers.filter((item) =>
            item.last_name
              .toLocaleLowerCase()
              .startsWith(searchValue.toLocaleLowerCase())
          )
        ); 
        setLoading(false);
      });
  };
  const handleCardClick = (id: number) => {
    // клик на карточку, переход на страницу альбома
    navigate(`${ROUTES.SPEAKERS}/${id}`);
  };

  return (
    <div className="container">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SPEAKERS }]} />
      
      <InputField
        value={searchValue}
        setValue={(value) => setSearchValue(value)}
        loading={loading}
        onSubmit={handleSearch}
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
          </Row>
        ))}
    </div>
  );
};

export default ITunesPage;