// Copied from src/lib/utils.ts for testing purposes
function getDeliveryDate(currentDate: Date = new Date()): Date {
    const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = currentDate.getHours();

    const isTuesday = day === 2;
    const isBeforeCutoff = day < 2 || (isTuesday && hour < 14);

    const deliveryDate = new Date(currentDate);

    if (isBeforeCutoff) {
        const adjustedDay = day === 0 ? 6 : day - 1;
        const isTuesdayAdjusted = adjustedDay === 1;
        const isBeforeCutoffAdjusted = adjustedDay < 1 || (isTuesdayAdjusted && hour < 14);

        if (isBeforeCutoffAdjusted) {
            const daysToAdd = 3 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        } else {
            const daysToAdd = 9 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        }
    } else {
        const adjustedDay = day === 0 ? 6 : day - 1;
        const isTuesdayAdjusted = adjustedDay === 1;
        const isBeforeCutoffAdjusted = adjustedDay < 1 || (isTuesdayAdjusted && hour < 14);

        if (isBeforeCutoffAdjusted) {
            const daysToAdd = 3 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        } else {
            const daysToAdd = 9 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        }
    }

    deliveryDate.setHours(10, 0, 0, 0);
    return deliveryDate;
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

const testCases = [
    { name: 'Monday 10:00 (Before Cutoff)', date: '2023-10-02T10:00:00' }, // Mon Oct 2 -> Thu Oct 5
    { name: 'Tuesday 13:59 (Before Cutoff)', date: '2023-10-03T13:59:00' }, // Tue Oct 3 -> Thu Oct 5
    { name: 'Tuesday 14:01 (After Cutoff)', date: '2023-10-03T14:01:00' }, // Tue Oct 3 -> Wed Oct 11
    { name: 'Wednesday 10:00 (After Cutoff)', date: '2023-10-04T10:00:00' }, // Wed Oct 4 -> Wed Oct 11
    { name: 'Thursday 10:00 (After Cutoff)', date: '2023-10-05T10:00:00' }, // Thu Oct 5 -> Wed Oct 11
    { name: 'Friday 10:00 (After Cutoff)', date: '2023-10-06T10:00:00' }, // Fri Oct 6 -> Wed Oct 11
    { name: 'Saturday 10:00 (After Cutoff)', date: '2023-10-07T10:00:00' }, // Sat Oct 7 -> Wed Oct 11
    { name: 'Sunday 10:00 (After Cutoff)', date: '2023-10-08T10:00:00' }, // Sun Oct 8 -> Wed Oct 11
];

console.log('--- Delivery Date Verification ---');
testCases.forEach(test => {
    const inputDate = new Date(test.date);
    const deliveryDate = getDeliveryDate(inputDate);
    console.log(`\nTest: ${test.name}`);
    console.log(`Input: ${formatDate(inputDate)} ${inputDate.toLocaleTimeString()}`);
    console.log(`Delivery: ${formatDate(deliveryDate)}`);
});
