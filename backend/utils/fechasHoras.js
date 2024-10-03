export const convertHoursToSave = (hoursFrontend) => {
    const [horas, minutos] = hoursFrontend.split(':');
    const dateHoras = new Date();
    dateHoras.setHours(horas);
    dateHoras.setMinutes(minutos);

    return dateHoras;
}

export const convertHoursToSendFrontend = (hoursBackend) => {
    return hoursBackend.toLocaleTimeString('es-ES', {hour12: false});
}