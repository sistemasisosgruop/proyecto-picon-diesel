export const ToastAlert = ({ error }) => {
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
          <span>{error?.message}</span>
          <br />
        </div>
      )}
    </div>
  );
};
