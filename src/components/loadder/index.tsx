// Criar componente que vai estar em toda a tela enquanto a requisição estiver sendo feita, fazer leve blur para embasar a tela. Use tailwindcss para estilização.

export const Loader = () => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="loader"></div>
        </div>
    );
}
