import React, { useState, useEffect } from 'react';
import Customer from './CustomersTableItem';

import Image01 from '../../images/user-40-01.jpg';
import Image02 from '../../images/user-40-02.jpg';
import Image03 from '../../images/user-40-03.jpg';
import Image04 from '../../images/user-40-04.jpg';
import Image05 from '../../images/user-40-05.jpg';
import Image06 from '../../images/user-40-06.jpg';
import Image07 from '../../images/user-40-07.jpg';
import Image08 from '../../images/user-40-08.jpg';
import Image09 from '../../images/user-40-09.jpg';
import Image10 from '../../images/user-40-10.jpg';

function CustomersTable({
  selectedItems
}) {

  const customers = [
    {
      id: '0',
      image: Image01,
      name: 'Patricia Semklo',
      email: 'patricia.semklo@app.com',
      location: '🇬🇧 London, UK',
      orders: '24',
      lastOrder: '#123567',
      spent: '$2,890.66',
      refunds: '-',
      fav: true
    },
    {
      id: '1',
      image: Image02,
      name: 'Dominik Lamakani',
      email: 'dominik.lamakani@gmail.com',
      location: '🇩🇪 Dortmund, DE',
      orders: '77',
      lastOrder: '#779912',
      spent: '$14,767.04',
      refunds: '4',
      fav: false
    },
    {
      id: '2',
      image: Image03,
      name: 'Ivan Mesaros',
      email: 'imivanmes@gmail.com',
      location: '🇫🇷 Paris, FR',
      orders: '44',
      lastOrder: '#889924',
      spent: '$4,996.00',
      refunds: '1',
      fav: true
    },
    {
      id: '3',
      image: Image04,
      name: 'Maria Martinez',
      email: 'martinezhome@gmail.com',
      location: '🇮🇹 Bologna, IT',
      orders: '29',
      lastOrder: '#897726',
      spent: '$3,220.66',
      refunds: '2',
      fav: false
    },
    {
      id: '4',
      image: Image05,
      name: 'Vicky Jung',
      email: 'itsvicky@contact.com',
      location: '🇬🇧 London, UK',
      orders: '22',
      lastOrder: '#123567',
      spent: '$2,890.66',
      refunds: '-',
      fav: true
    },
    {
      id: '5',
      image: Image06,
      name: 'Tisho Yanchev',
      email: 'tisho.y@kurlytech.com',
      location: '🇬🇧 London, UK',
      orders: '14',
      lastOrder: '#896644',
      spent: '$1,649.99',
      refunds: '1',
      fav: true
    },
    {
      id: '6',
      image: Image07,
      name: 'James Cameron',
      email: 'james.ceo@james.tech',
      location: '🇫🇷 Marseille, FR',
      orders: '34',
      lastOrder: '#136988',
      spent: '$3,569.87',
      refunds: '2',
      fav: true
    },
    {
      id: '7',
      image: Image08,
      name: 'Haruki Masuno',
      email: 'haruki@supermail.jp',
      location: '🇯🇵 Tokio, JP',
      orders: '112',
      lastOrder: '#442206',
      spent: '$19,246.07',
      refunds: '6',
      fav: false
    },
    {
      id: '8',
      image: Image09,
      name: 'Joe Huang',
      email: 'joehuang@hotmail.com',
      location: '🇨🇳 Shanghai, CN',
      orders: '64',
      lastOrder: '#764321',
      spent: '$12,276.92',
      refunds: '-',
      fav: true
    },
    {
      id: '9',
      image: Image10,
      name: 'Carolyn McNeail',
      email: 'carolynlove@gmail.com',
      location: '🇮🇹 Milan, IT',
      orders: '19',
      lastOrder: '#908764',
      spent: '$1,289.97',
      refunds: '2',
      fav: false
    }
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(customers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(list.map(li => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 relative">
      <header className="flex justify-between items-center mb-4">
        <form
          className="relative h-11 flex items-center bg-[#E8E8E8] rounded-full p-4 gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 21.5C16.7467 21.5 21 17.2467 21 12C21 6.75329 16.7467 2.5 11.5 2.5C6.25329 2.5 2 6.75329 2 12C2 17.2467 6.25329 21.5 11.5 21.5Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 22.5L20 20.5" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            // ref={trigger}
            type="search"
            placeholder="Search"
            value=""
            // onChange={(e) => setQuery(e.target.value)}
            className="flex-1 w-full bg-transparent text-base font-normal text-black placeholder-lightGray border-none focus:border-none focus:ring-0 focus:outline-none p-0"
          />
        </form>
        <button
          className="btn rounded-full bg-black text-base text-white font-medium shadow-sm transition duration-150 px-5 py-3"
        >
          Add New User
        </button>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-sm text-black text-left">
              <tr className='h-10 border-b border-[#E8E8E8]'>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Phone</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal">Status</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Role</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-normal text-left">Action</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm text-black text-left divide-y divide-[#E8E8E8]">
              {
                list.map(customer => {
                  return (
                    <Customer
                      key={customer.id}
                      id={customer.id}
                      image={customer.image}
                      name={customer.name}
                      email={customer.email}
                      location={customer.location}
                      orders={customer.orders}
                      lastOrder={customer.lastOrder}
                      spent={customer.spent}
                      refunds={customer.refunds}
                      fav={customer.fav}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(customer.id)}
                    />
                  )
                })
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default CustomersTable;
