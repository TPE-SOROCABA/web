import { Button } from '@material-tailwind/react'
import ellipse from '../../assets/ellipse.png'
import link_off from '../../assets/link_off.png'
import logo from '../../assets/logo.png'
import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp, useToastHot } from '../../lib'
import { LoaderSmall } from '../../components/loadder/LoaderSmall'
import { AlertAbsentParticipant } from './AlertAbsentParticipant'

enum DesignationStatus {
    OPEN = "OPEN",
    CANCELLED = "CANCELLED",
    CLOSED = "CLOSED",
    IN_PROGRESS = "IN_PROGRESS",
}
interface IWeekDesignationModel {
    event: string;
    point: string;
    publication_carts: string[];
    participants: string[];
    createdAt: Date;
    updatedAt: Date;
    expirationDate: Date;
    incident_history: IncidentHistory;
    status: DesignationStatus;
}

interface IncidentHistory {
    reason: string;
    status: string;
}

const DesignationStatusMap = {
    OPEN: 'Aberto',
    CANCELLED: 'Cancelado',
    CLOSED: 'Fechado',
    IN_PROGRESS: 'Em Progresso',
}

export const WeekDesignation = () => {
    const toast = useToastHot();
    const [designations, setDesignation] = useState<IWeekDesignationModel[]>([]);
    const { id } = useParams();
    const http = useHttp();
    const [page, setPage] = useState<'loading' | 'screen' | 'not-found'>('loading');
    const [showAlert, setShowAlert] = useState(false);

    const getDesignation = useCallback(async () => {
        try {
            const { data } = await http.get<IWeekDesignationModel[]>(`/designations/week/participant/${id}`, {});
            setDesignation(data);
            if (data.length === 0) {
                setPage('not-found');
                return;
            }
            setPage('screen');
        } catch (error) {
            setPage('not-found');
        }
    }, [http, id]);

    useEffect(() => {
        getDesignation();
    }, [getDesignation]);

    const handleAbsent = async (reason: string) => {

        await toast.promise(http.post(`/participants/${id}/incidences`, { reason }),
            {
                loading: "Recusando designação...",
                success: "Designação recusada com sucesso",
                error: () => "Erro ao recusar designação",
            });
        await getDesignation();
    }

    switch (page) {
        case 'loading':
            return (<div className='w-10 relative'><LoaderSmall /></div>)
        case 'screen':
            return (<div className="flex flex-col justify-center items-center relative gap-2 max-w-[500px] m-auto">
                <img src={ellipse} alt="ellipse" className="w-full -z-10 -mt-11 md:hidden" />
                <div className='flex flex-col justify-center items-center -mt-28 gap-4'>
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
                        {designations.map((designation, index) => {
                            const isListLast = index === designations.length - 1;
                            return (
                                <div key={index} className="flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <div>
                                            Evento: <strong>{designation.event}</strong>
                                        </div>
                                        <div>
                                            <span className={
                                                `text-xs px-2 py-1 rounded-full 
                                        ${designation.status === "OPEN" ? "border-blue-700 text-blue-700 bg-blue-100" : ""}
                                        ${designation.status === "CANCELLED" ? "border-red-700 text-red-700 bg-red-100" : ""}
                                        ${designation.status === "CLOSED" ? "border-green-700 text-green-700 bg-green-100" : ""}
                                        ${designation.status === "IN_PROGRESS" ? "border-yellow-700 text-yellow-700 bg-yellow-100" : ""}
                                        `
                                            }>
                                                {DesignationStatusMap[designation.status]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">Designação: <strong>{designation.point}</strong>
                                        {designation.publication_carts.length > 0 && (
                                            <span>Carrinhos: <strong>({designation.publication_carts.map((publicationCart, index) => (
                                                <span key={index}>{publicationCart}</span>
                                            ))})</strong></span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 pl-2">
                                        {designation.participants.map((participant, index) => (
                                            <span key={index}>• {participant}</span>
                                        ))}
                                    </div>
                                    <div className='flex justify-end'>
                                        <AlertAbsentParticipant
                                            showButton={showAlert}
                                            close={() => { setShowAlert(false) }}
                                            submit={handleAbsent}
                                        />
                                        <Button
                                            placeholder={"Recusar Designação"}
                                            className={`${designation?.incident_history?.status === "OPEN" ? "bg-blue-700" : "bg-red-700"} w-[95px] flex justify-center`}
                                            onClick={() => {
                                                if (designation?.incident_history?.status === "OPEN") return;
                                                setShowAlert((prev) => !prev)
                                            }}
                                            disabled={designation?.incident_history?.status === "OPEN"}
                                            type='button'
                                        >
                                            {designation?.incident_history?.status === "OPEN" ? "Recusado" : "Recusar"}
                                        </Button>
                                    </div>
                                    {!isListLast && (<div className='border-t-2 border-gray-200 my-2'></div>)}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>)
        case 'not-found':
            return (
                <div className="flex flex-col justify-center items-center relative gap-4 max-w-[500px] h-screen m-auto text-center">
                    <img src={link_off} alt="link_off" className="" />
                    <div><strong>Link não encontrado</strong></div>
                    <div>
                        O link que você está tentando acessar não existe ou foi removido.
                        <br></br>
                        Por favor, verifique com o responsável para mais informações.
                    </div>
                </div>
            )
        default:
            return null;
    }
}
