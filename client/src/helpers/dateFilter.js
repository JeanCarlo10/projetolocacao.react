export const getCurrentMonth = () => {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

// export const filterListByMonth = (list, date) => {
//     const str = date || '';

//     let newList = [];
//     let [year, month] = str.split('-');

//     for (let i in list) {
//         if (
//             list[i].date.getFullYear() === parseInt(year) &&
//             (list[i].date.getMonth() + 1) === parseInt(month)
//         ) {
//             newList.push(list[i]);
//         }
//     }

//     return newList;
// }

export const formatCurrentMonth = (currentMonth) => {
    const str = currentMonth || '';

    let [year, month] = str.split('-');
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    return `${months[parseInt(month) - 1]} de ${year}`;
}
