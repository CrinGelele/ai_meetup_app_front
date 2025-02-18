import "./speakerPage.css";
import { FC } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTE_LABELS } from "../../Routes";

export const Page403: FC = () => {
  return (
    <div>
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.FORBIDDEN }]} />
        <h1>К сожалению, вам нельзя просматривать эту страницу :(</h1>
    </div>
  );
};