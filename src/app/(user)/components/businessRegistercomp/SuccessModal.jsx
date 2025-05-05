"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdCheckCircle } from "react-icons/md";

export default function SuccessModal({ isOpen, onClose, message }) {
  // const router = useRouter();

  const handleClose = () => {
    onClose(); 
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 backdrop-blur-0"
          enterTo="opacity-100 backdrop-blur-sm"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 backdrop-blur-sm"
          leaveTo="opacity-0 backdrop-blur-0"
        >
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white px-6 py-8 text-left shadow-xl transition-all w-full max-w-md">
                <div className="flex flex-col items-center text-center">
                  <MdCheckCircle className="text-green-500 text-5xl mb-4" />
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                    Success!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message || "Your action was successful."}</p>
                  </div>
                  <div className="mt-6">
                    <button type="button" className="inline-flex justify-center rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all" onClick={handleClose} >
                      Go to Homepage
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
