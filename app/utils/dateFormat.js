export const dateFormato = (date) => {
    let [year, month, day] = date.split('-');
    day = day.split('T')[0];
    const newDate = new Date(year, month, day);
    
    const dateFormatShow = `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
    return dateFormatShow;
}

export const dateRefetchShow = (date = undefined) => {
    if (date !== undefined || date != null){
        let [year, month, day] = date?.split('-');
        day = day.split('T')[0];
        const newDate = new Date(year, month - 1 , day);
        
        const dia = newDate.getDate().toString().padStart(2, '0'); // obtiene el día y lo formatea con dos dígitos
        const mes = (newDate.getMonth() + 1).toString().padStart(2, '0'); // obtiene el mes (se suma 1 porque los meses comienzan desde 0) y lo formatea con dos dígitos
        const anio = newDate.getFullYear(); // obtiene el año
        const fechaFormateada = `${anio}-${mes}-${dia}`; // une los valores en un string con el formato deseado
        return fechaFormateada;
        // const dateFormatShow = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
        // return dateFormatShow;
    }
    
}

export const hoursFormat = (hours) => {
    const temp = new Date(hours);
    // return temp.toLocaleTimeString('es-ES', {hour12: false});
    const horas = temp.getHours();
    const minutos = temp.getMinutes();
    
    const addLeadingZero = (num) => {
        return num < 10 ? "0" + num : num;
    };
    const hours24 = addLeadingZero(horas) + ":" + addLeadingZero(minutos);
    return hours24;
}