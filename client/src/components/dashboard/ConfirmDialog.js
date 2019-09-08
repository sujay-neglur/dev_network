import React from "react";

function ConfirmDialog({
  buttonClass,
  title,
  primary,
  secondary,
  buttonName,
  message,
  onClick
}) {
  return (
    <React.Fragment>
      <button
        type="button"
        className={buttonClass}
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        {buttonName}
      </button>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{message}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                {secondary}
              </button>
              <button
                type="button"
                name="primary"
                onClick={onClick}
                className="btn btn-primary"
              >
                {primary}
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ConfirmDialog;
