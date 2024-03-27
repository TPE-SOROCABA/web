import { Button } from '@material-tailwind/react'
import ellipse from '../assets/ellipse.png'
import logo from '../assets/logo.png'

const mock = {
    point: "Safra /Carrinhos: 15",
    participants: [
        {
            name: "João da Silva",
        },
        {
            name: "Maria da Silva",
        },
        {
            name: "José da Silva",
        }
    ]
}
export const WeekDesignation = () => {
    return (
        <div className="flex flex-col justify-center items-center relative gap-2 max-w-[500px] m-auto">
            <img src={ellipse} alt="ellipse" className="w-full absolute -z-10 -top-6 md:hidden" />
            <div className='flex flex-col justify-center items-center mt-4 gap-4'>
                <div className="text-gray-50">Bem-vindo(a) ao TPE DIGITAL</div>
                <img src={logo} alt="logo" className="w-1/2" />
            </div>
            <p className='text-center p-2 text-sm'>
                <span className='text-sm'>
                    Confira os detalhes da sua
                </span>
                <br></br>
                <strong>
                    Designação desta semana.
                </strong>
                <br></br>
                <span className='text-sm'>
                    Caso não esteja presente, recuse a designação. Qualquer dúvida entre em contato com o capitão do seu grupo.
                </span>
            </p>
            <div className="w-full p-2">
                <div className="bg-white rounded-lg min-h-full flex flex-col gap-4 p-4 text-sm">
                    <div className="">Ponto: <strong>{mock.point}</strong></div>
                    <div className="flex flex-col gap-2">
                        {mock.participants.map((participant, index) => (
                            <span key={index}>{participant.name}</span>
                        ))}
                    </div>
                    <div className='flex justify-end'>
                    <Button placeholder={"Recusar Designação"} className='bg-red-700 w-[95px] flex justify-center' >
                        Recusar
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}