import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Hello() {
  // const [users, setUsers] = useState<any[]>([]);
  // const http = useHttp();

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const getUsers = async () => {
  //   const data = await http.get("/dev/users");
  //   console.log(data);
  //   setUsers(data);
  // };

  return (
    <>
      <h1>Bem vindo ao TPE-SOROCABA</h1>
      <p>versao WEB</p>
      <p>teste de pipeline</p>
      <Link to="/lista-designacao">
        <Button
          placeholder="ir para lista de desiganação"
          className="md:w-96 w-40 md:rounded-xl bg-primary-600"
          type="button"
        >
          Lista de Designação
        </Button>
      </Link>
      {/* <div>
        <h2>Usuarios</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div> */}
    </>
  );
}
