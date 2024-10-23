export const Group = ({ title, children, onclick = undefined }) => {
  return (
    <div onClick={onclick} className="relative border border-primary-300 rounded-md p-6 z-100 ">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-base font-medium text-primary-800   ">
        {title}
      </div>
      <div className="flex flex-col gap-4 ">{children}</div>
    </div>
  );
};
export const GroupCustom = ({ title, children, onclick = undefined }) => {
  return (
    <div onClick={onclick} className="relative border border-primary-300 rounded-md pt-2 pb-2 pl-1 pr-1 z-100 w-[60%] ">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-base font-medium text-primary-800 w-[auto]  ">
        {title}
      </div>
      <div className="flex flex-col gap-3 w-[auto] p-0">{children}</div>
    </div>
  );
};
export const GroupCustom2 = ({ title, children, onclick = undefined }) => {
  return (
    <div onClick={onclick} className="relative border border-primary-300 rounded-md pt-2 pb-2 pl-1 pr-1 z-100 w-[30%] ">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-base font-medium text-primary-800 w-[auto]  ">
        {title}
      </div>
      <div className="flex flex-col gap-3 w-[auto] p-0">{children}</div>
    </div>
  );
};

export const GroupInputs = ({ children }) => {
  return <div className="flex gap-3 w-full bg-red-500">{children}</div>;
};
export const GroupInputsCustom = ({ children }) => {
  return <div style={{margin:'0',padding:'0', display:'flex',gap:'1px',justifyContent:'space-evenly'}}>{children}</div>;
};

export const GroupIntern = ({ title, children }) => {
  return (
    <div className="relative border border-primary-100 rounded-md p-6 z-100">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-sm font-medium text-primary-800">
        {title}
      </div>
      <div className="flex gap-3 w-full">{children}</div>
    </div>
  );
};

export const GroupInputsIntern = ({title, children}) => {
  return (
    <div className="relative border border-primary-100 rounded-md p-6 z-100 w-1/2">
      <div className="absolute -top-2 left-4 -mt-2 -ml-2 px-2 py-0.5 bg-white text-sm font-medium text-primary-800">
        {title}
      </div>
      <div className="flex flex-col gap-3 w-full">{children}</div>
    </div>
  );
}

export const GroupInputsBomba = ({ children }) => {
  return <div className="flex gap-1 w-full">{children}</div>;
};



export const InputCustom = ({ label, value, onChange, type,disabled,defaultValue }) => {
  return (
    <div style={{ width: '24%' }}>
      <label style={{fontSize:"11px"}}>{label}</label>
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled} // Puedes descomentar esto si es necesario
        style={{
          width: '100%',
          margin: '0',
          padding: '0.25rem', // Ajusta el padding para una altura menor
          borderRadius: '4px', // Borde redondeado
          border: '1px solid #555', // Borde gris oscuro
          outline: 'none', // Elimina el borde de enfoque predeterminado
          boxShadow: 'none', // Elimina la sombra predeterminada
          transition: 'border-color 0.3s', // Transición suave para el color del borde
          fontSize: '0.875rem', // Ajusta el tamaño de la fuente si es necesario
          backgroundColor: disabled ? '#ddd' : '#fff', // Fondo gris oscuro si está deshabilitado, blanco si no
        }}
        onFocus={(e) => (e.target.style.borderColor = '#333')} // Cambia el color del borde al enfocar
        onBlur={(e) => (e.target.style.borderColor = '#555')} // Restaura el color del borde al desenfocar
      />
    </div>
  );
};


export const SelectCustom = ({ label, value, onChange, isEdit }) => {
  return (
    <div style={{ width: '24%' }}>
      <label style={{ fontSize: "11px" }}>{label}</label>
      <select
        style={{
          width: '100%',
          margin: '0',
          padding: '0.25rem', // Ajusta el padding para una altura adecuada
          borderRadius: '4px', // Borde redondeado
          border: '1px solid #555', // Borde gris oscuro
          outline: 'none', // Elimina el borde de enfoque predeterminado
          boxShadow: 'none', // Elimina la sombra predeterminada
          transition: 'border-color 0.3s', // Transición suave para el color del borde
          fontSize: '0.875rem', // Ajusta el tamaño de la fuente si es necesario
          backgroundColor: '#fff', // Fondo blanco
          color: '#000', // Color del texto negro
        }}
        onChange={onChange}
        value={isEdit ? value : undefined} // Usa value directamente
      >
        <option value="" disabled>Select a currency</option> {/* Opción por defecto */}
        <option key={1} value={"Soles"}>Soles</option>
        <option key={2} value={"Dolar"}>Dólares</option>
      </select>
    </div>
  );
};
