import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";

import { useState } from "react";
import { Perfil } from "./Perfil";
import { Congregacao } from "./Congregacao";
import { Disponibilidade } from "./Disponibilidade";

const tabs = [<Perfil />, <Congregacao />, <Disponibilidade />];

export function HandlerTabs() {
  const [tab, setTab] = useState(0);
  return (
    <div className="flex flex-col col-span-1">
      {tabs.map((item, index) => (
        <Accordion placeholder="" open={index === tab} key={index}>
          <AccordionHeader placeholder="" onClick={() => setTab(index)}>
            <div className="flex items-center gap-2">
              <span>{index + 1}</span>
              <span>
                {index === 0
                  ? "Perfil"
                  : index === 1
                  ? "Congregação"
                  : "Disponibilidade"}
              </span>
            </div>
          </AccordionHeader>
          <AccordionBody>{tab === index && item}</AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
