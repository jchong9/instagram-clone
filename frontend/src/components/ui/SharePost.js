import {useState} from "react";
import ImageForm from "../form/ImageForm";

export default function SharePost() {
  const [showModal, setShowModal] = useState(false);

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <button className="btn btn-primary btn-lg floating-btn"
              onClick={() => setShowModal(true)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Add a new post">
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 448 512">
          <path
            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
        </svg>

      </button>
      {showModal && (
        <>
          <div className="modal-backdrop"></div>
          <div className="center-fixed modal-container">
            <div className="modal-header">
              <h4>Start sharing posts today</h4>
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 384 512"
                   onClick={() => setShowModal(false)}>
                <path
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </svg>
            </div>
            <div className="modal-body">
              <ImageForm onClose={closeModal} />
            </div>
          </div>
        </>
      )}
    </>
  );
}