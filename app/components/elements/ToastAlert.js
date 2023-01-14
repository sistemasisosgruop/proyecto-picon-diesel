export const ToastAlert = ({ error }) => {
  const errorDescription = error?.response?.data;
  let customMessage = null;

  if (errorDescription?.code === "P2003") {
    customMessage =
      "El registro no puede ser eliminado ya que tiene registros asociados, por favor elimine primero los registros asociados.";
  }
  if (errorDescription?.code === "P2002") {
    customMessage = "El registro ya existe.";
  }
    
  if (errorDescription?.error.includes("stock")) {
    customMessage = errorDescription?.error;
  }

  return (
    <div>
      {error?.inner ? (
        error.inner.map((item, index) => (
          <div key={index}>
            <span>{`- ${item.path}: ${item.message}.`}</span>
            <br />
          </div>
        ))
      ) : (
        <div>
          <span>{customMessage ?? error?.message}</span>
          <br />
        </div>
      )}
    </div>
  );
};
