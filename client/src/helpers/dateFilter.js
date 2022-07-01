export const getCurrentMonth = () => {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

export const formatCurrentMonth = (currentMonth) => {
    var month = currentMonth.getMonth();
    var year = currentMonth.getFullYear();

    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    return `${months[parseInt(month)]} de ${year}`;
}
