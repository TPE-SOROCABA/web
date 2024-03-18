import { useEffect, useState } from "react";
import { useHttp } from "../../lib";

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
