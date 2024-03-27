import dashboardIcon from '../../assets/icons/menu/dashboard.svg';
import searchIcon from '../../assets/icons/menu/search.svg';
import designarIcon from '../../assets/icons/menu/designar.svg';
import cadastrarIcon from '../../assets/icons/menu/cadastrar.svg';
import sairIcon from '../../assets/icons/menu/sair.svg';

import tpeDigital from '../../assets/tpe-digital-circle-white.svg';
import { tv } from 'tailwind-variants';

interface Props {
  open: boolean
}

const menuTw = tv({
  base: 'flex gap-9 w-[87.666667%] mx-auto border-[#D7D7D7] pb-2 h-11 items-center transition-all cursor-pointer hover:bg-[#374192] hover:w-full hover:border-none hover:px-4 hover:h-[50px]',
  variants: {
    menu: {
      open: 'border-b-[1px]',
      close: 'justify-center'
    }
  }
})

export function Sidebar({ open }: Props) {
  return(
    <div className={`${open ? 'w-[254px] left-0' : 'w-[65px] -left-[68px]'} relative md:left-0 h-full min-h-[calc(100vh_-_64px)] max-w-[254px] bg-gradient-to-b from-primary-900 to-primary-500 pt-5 transition-all flex flex-col justify-between `}>
      <ul className='flex flex-col gap-3'>
        <li className={menuTw({ menu: open ? 'open' : 'close' })}>
          <img src={dashboardIcon} alt="dashboard" className='w-6'/>
          { open && <h2 className='text-white'>Dashboard</h2> }
        </li>
        <li className={menuTw({ menu: open ? 'open' : 'close' })}>
          <img src={searchIcon} alt="search" className='w-6'/>
          { open && <h2 className='text-white'>Consultar</h2>}
        </li>
        <li className={menuTw({ menu: open ? 'open' : 'close' })}>
          <img src={designarIcon} alt="designar" className='w-6'/>
          { open && <h2 className='text-white'>Designar</h2>}
        </li>
        <li className={menuTw({ menu: open ? 'open' : 'close' })}>
          <img src={cadastrarIcon} alt="cadastrar" className='w-6' />
          { open && <h2 className='text-white'>Cadastrar</h2>}
        </li>
      </ul>
      <ul className='flex items-center flex-col gap-9 pb-10'>
          { open && <img src={tpeDigital} alt="tpe" />}
        <li className={menuTw({ menu: open ? 'open' : 'close' })}>
          <img src={sairIcon} alt="sair" className='w-6' />
          { open && <h2 className='text-white'>Sair</h2>}
        </li>
      </ul>
    </div>
  )
}