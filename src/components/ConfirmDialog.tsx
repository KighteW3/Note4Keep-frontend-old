import "../styles/ConfirmDialog.css";
import DialogsBar from "./DialogsBar";

interface ConfirmDialog {
  question: string;
}

export default function ConfirmDialog({ question }: ConfirmDialog) {
  return (
    <div className="confirm-dialog">
      <DialogsBar title="Confirm" />
      <div className="confirm-dialog__container">
        <h2 className="confirm-dialog__container__question">{question}</h2>
        <div className="confirm-dialog__container__options">
          <button className="confirm-dialog__container__options__button confirm-dialog__container__options__cancel">
            cancel
          </button>
          <button className="confirm-dialog__container__options__button confirm-dialog__container__options__confirm">
            confirm
          </button>
        </div>
      </div>
    </div>
  );
}
