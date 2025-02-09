import "./speakerPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams } from "react-router-dom";
import { Speaker, getSpeakerById } from "../modules/aimaApi";
import { Col, Row, Spinner, Image } from "react-bootstrap";
import { SPEAKERS_MOCK } from "../modules/mock";
import defaultImage from "../assets/defaultImage.png";

export const AlbumPage: FC = () => {
  const [pageData, setPageDdata] = useState<Speaker>();

  const { id } = useParams(); // ид страницы, пример: "/albums/12"

  useEffect(() => {
    if (!id) return;
    getSpeakerById(id)
      .then((response) => setPageDdata(response))
      .catch(
        () =>
          setPageDdata(
            SPEAKERS_MOCK.speakers.find(
              (speaker) => String(speaker.id) == id
            )
          ) /* В случае ошибки используем мок данные, фильтруем по ид */
      );
  }, [id]);

  return (
    <div className="justify-content-center align-items-center">
      <BreadCrumbs 
        crumbs={[
          { label: ROUTE_LABELS.SPEAKERS, path: ROUTES.SPEAKERS },
          { label: pageData ? `${pageData.first_name} ${pageData.last_name}` : "Спикер" },
        ]}
      />
      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="container">
          <div className="page-container">
          <div className="text-container">
            <p className="primary-text">{pageData.first_name}</p>
            <p className="primary-text">{pageData.last_name}</p>
            <p className="secondary-text">{pageData.workplace}</p>
            <p className="info-text">{pageData.description}</p>
                <input type="text" hidden name="speaker_id" value={pageData.id}/>
                <button type="submit" className="submit_btn">Пригласить</button>
          </div>
          <img src={pageData.img_url || defaultImage}/>
          </div>
        </div>
      ) : (
        <div className="album_page_loader_block">{/* загрузка */}
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};