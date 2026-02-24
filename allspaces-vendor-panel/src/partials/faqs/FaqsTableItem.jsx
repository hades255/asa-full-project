import React, { useState } from 'react';

function FaqsTableItem(props) {

  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const statusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400';
      case 'Refunded':
        return 'bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <tbody className="text-sm">
      {/* Row */}
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-slate-800 dark:text-slate-100">{props.question}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 ${descriptionOpen && 'rotate-90'}`}
              aria-expanded={descriptionOpen}
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              aria-controls={`description-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.7402 15.5297L14.2602 11.9997L10.7402 8.46973" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </button>
          </div>
        </td>
      </tr>
      {/*
      Example of content revealing when clicking the button on the right side:
      Note that you must set a "colSpan" attribute on the <td> element,
      and it should match the number of columns in your table
      */}
      <tr id={`description-${props.id}`} role="region" className={`${!descriptionOpen && 'hidden'}`}>
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400 p-3 -mt-3">
            <p className="text-slate-400 dark:text-slate-500 mr-2">
              {props.answer}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default FaqsTableItem;
