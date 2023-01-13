export const ToastAlert = ({ error }) => {
  const errorDescription = error?.response?.data;
  let customMessage = null;

  if (errorDescription?.code === "P2003") {
    customMessage =
      "El registro no puede ser eliminado ya que tiene dependencias activas, por favor elimine primero las dependencias.";
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
