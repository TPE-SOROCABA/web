// Criar componente que vai estar em toda a tela enquanto a requisição estiver sendo feita, fazer leve blur para embasar a tela. Use tailwindcss para estilização.

export const Loader = () => {
    return (
        <div className="flex justify-center items-center mt-14">
            <div className="loader"></div>
        </div>
    );
}
