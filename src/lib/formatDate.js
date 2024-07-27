export function formatDate(dateString, divider = '/') {
    const months = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
    };

    let dateParts = dateString.split(' ');
    let day = dateParts[0];
    let month = months[dateParts[1]];
    let year = dateParts[2];

    return `${day}${divider}${month}${divider}${year}`;
}