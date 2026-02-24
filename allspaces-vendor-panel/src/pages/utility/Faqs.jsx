import React, { useState } from "react";

import { useGetFAQs } from "../../api/contactsApis";
import { ArrowSquareRight } from "iconsax-react";
import { Loader } from "../../components/Loader";

export const Faqs = () => {
  const { data: faqs, isPending } = useGetFAQs();

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-1 h-full flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-heading1 text-semantic-content-contentPrimary">{`FAQs`}</h1>
      </div>
      <div className="flex h-full flex-1 bg-semantic-background-backgroundPrimary rounded-2xl shadow-md overflow-hidden">
        <div className="w-full h-full p-6 overflow-y-auto">
          {isPending ? (
            <Loader />
          ) : (
            <div className="w-full space-y-8 pb-4">
            {faqs.map((faq, index) => (
              <div key={index.toString()}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left text-heading4 font-semibold text-semantic-content-contentPrimary focus:outline-none"
                >
                  {faq.question}
                  <ArrowSquareRight
                    className={`w6- h-6 transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="font-normal text-body1 text-semantic-content-contentTertionary pt-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
