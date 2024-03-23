import { Participant } from "../../../components";

export function ListaDesignacao() {
  const absent = {
    reason: "Consulta medica, filho ficou doente, implrevisto, etc...",
    action: {
      history: "https://www.google.com",
      edit: "https://www.google.com",
    },
  };
  return (
    <>
      <div>
        <h1>Lista de Designação</h1>
        <p>Aqui você pode ver a lista de designações</p>
        <br />
        <Participant
          avatar="https://github.com/jwfelipee.png"
          name="Joao Wictor Felipe da Silva"
          absent={absent}
        />
        <br />
        <Participant
          avatar="https://github.com/wfelipe2011.png"
          name="Wilson Felipe da Silva"
        />
        <br />
        <Participant
          avatar="https://github.com/jwfelipee.png"
          name="Joao Wictor Felipe da Silva"
          absent={absent}
        />
      </div>
    </>
  );
}
