import React, { useState, useEffect } from 'react';
import FaqsTableItem from './FaqsTableItem';

import Image01 from '../../images/icon-01.svg';
import Image02 from '../../images/icon-02.svg';
import Image03 from '../../images/icon-03.svg';
import contactsApis from '../../api/contactsApis';

function FaqsTable({
  selectedItems
}) {

  const faqs = [
    {
      id: 112211,
      question: 'What time is check-in and check-out?',
      answer: 'Check-in time is from 2:00 PM and check-out time is until 12:00 PM.',
    },
    {
      id: 112212,
      question: 'Is breakfast included in the room rate?',
      answer: 'Yes, complimentary breakfast is included with all room bookings.',
    },
    {
      id: 112213,
      question: 'Do you offer free Wi-Fi?',
      answer: 'Yes, we provide free high-speed Wi-Fi in all rooms and public areas.',
    },
    {
      id: 112214,
      question: 'Is there parking available at the hotel?',
      answer: 'Yes, we offer free private parking for all our guests during their stay.',
    },
    {
      id: 112215,
      question: 'Do you allow pets in the hotel?',
      answer: 'Pets are not allowed inside the hotel premises, except for service animals.',
    },
    {
      id: 112216,
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes, bookings can be modified or canceled up to 24 hours before check-in without any charges.',
    },
    {
      id: 112217,
      question: 'Do you provide airport pick-up and drop-off services?',
      answer: 'Yes, we offer airport transportation services at an additional cost. Please contact the front desk to schedule.',
    },
    {
      id: 112218,
      question: 'Is smoking allowed in the rooms?',
      answer: 'No, all our rooms are non-smoking. We have designated smoking areas outside the building.',
    },
    {
      id: 112219,
      question: 'Are there conference or event facilities available?',
      answer: 'Yes, we offer fully equipped conference rooms and event halls for business and social gatherings.',
    },
    {
      id: 112210,
      question: 'What payment methods do you accept?',
      answer: `We accept all major credit cards, debit cards, and online payments.`,
    },
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await contactsApis.faqs();
        console.log("Final response => ", response);

        if (response.status === 200 && response.data.length > 0) {
          setList(response.data);
        } else {
          setList(faqs);
        }
      } catch (error) {
        setList(faqs);
        console.log("error => ", error);
      }
    };

    fetchFaqs();
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
    <div className="text-base font-normal bg-white text-black rounded-xl shadow overflow-hidden p-5">
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full divide-y divide-slate-200">
            {/* Table body */}
            {
              list.map(faq => {
                return (
                  <FaqsTableItem
                    key={faq.id}
                    id={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                  />
                )
              })
            }
          </table>

        </div>
      </div>
    </div>
  );
}

export default FaqsTable;
