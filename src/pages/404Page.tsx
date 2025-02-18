import "./speakerPage.css";
import { FC } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const Page404: FC = () => {
  return (
    <div>
        <BreadCrumbs crumbs={[{ label: "404" }]} />
        <h1>Страница не найдена :(</h1>
    </div>
  );
};