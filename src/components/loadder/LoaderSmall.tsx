// Criar componente que vai estar em toda a tela enquanto a requisição estiver sendo feita, fazer leve blur para embasar a tela. Use tailwindcss para estilização.

export const LoaderSmall = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <span className="loader-small"></span>
        </div>
    );
}
