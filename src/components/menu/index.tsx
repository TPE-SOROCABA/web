import { useState } from 'react';

import { AlignJustify, Bell, X } from 'lucide-react';
import { Avatar } from '@material-tailwind/react';

import dashboardIcon from '../../assets/icons/menu/dashboard.svg';
import searchIcon from '../../assets/icons/menu/search.svg';
import designarIcon from '../../assets/icons/menu/designar.svg';
import cadastrarIcon from '../../assets/icons/menu/cadastrar.svg';
import sairIcon from '../../assets/icons/menu/sair.svg';

import tpeDigital from '../../assets/tpe-digital-circle-white.svg';

interface Props {
  open: boolean
}

export const Menu = () => {
  const [open, setOpen] = useState(false)

  const changeMenu = () => {
    setOpen(value => !value)
  }

  return(
    <div>
      <header className='flex flex-row justify-between bg-gradient-to-r from-primary-900 to-primary-500 h-16 px-4' >
        <div className='flex flex-row items-center gap-5'>
          <button onClick={changeMenu}>
            {open ? <X color='#fff'/> : <AlignJustify color='#fff'/>}
          </button>
          <h2 className='text-white text-1xl'>Dashboard</h2>
        </div>
        <div className='flex flex-row items-center gap-8'>
          <h2 className='text-white text-1xl'>Coordenador</h2>
          <Bell color='#fff'/>
          <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" size="sm"/>;
        </div>
      </header>
      <Sidebar open={open}/>
    </div>
  )

  function Sidebar({ open }: Props) {
    return(
      <div className={`${open ? 'w-[254px]' : 'w-[65px]'} h-full min-h-[calc(100vh_-_64px)] max-w-[254px] bg-gradient-to-b from-primary-900 to-primary-500 pt-5 transition-all flex flex-col justify-between `}>
        <ul className='flex flex-col gap-3'>
          <li className={`${open ? 'border-b-[1px]' : 'justify-center'} flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center cursor-pointer`}>
            <img src={dashboardIcon} alt="dashboard" className='w-6'/>
            { open && <h2 className='text-white'>Dashboard</h2> }
          </li>
          <li className={`${open ? 'border-b-[1px]' : 'justify-center'} flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center cursor-pointer`}>
            <img src={searchIcon} alt="search" className='w-6'/>
            { open && <h2 className='text-white'>Consultar</h2>}
          </li>
          <li className={`${open ? 'border-b-[1px]' : 'justify-center'} flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center cursor-pointer`}>
            <img src={designarIcon} alt="designar" className='w-6'/>
            { open && <h2 className='text-white'>Designar</h2>}
          </li>
          <li className={`${open ? 'border-b-[1px]' : 'justify-center'} flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center cursor-pointer`}>
            <img src={cadastrarIcon} alt="cadastrar" className='w-6' />
            { open && <h2 className='text-white'>Cadastrar</h2>}
          </li>
        </ul>

        <div className='flex items-center flex-col gap-9 pb-10'>
            { open && <img src={tpeDigital} alt="tpe" />}
          <li className={`${open ? 'border-b-[0px]' : 'justify-center'} flex gap-[4.25rem] w-[87.666667%] mx-auto h-11 items-center cursor-pointer`}>
            <img src={sairIcon} alt="sair" className='w-6' />
            { open && <h2 className='text-white'>Sair</h2>}
          </li>
        </div>
      </div>
    )
  }
}