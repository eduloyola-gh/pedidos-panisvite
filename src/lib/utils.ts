export function getDeliveryDate(currentDate: Date = new Date()): Date {
    const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = currentDate.getHours();

    // Target: Thursday of the current week
    // If today is Thursday (4), Friday (5), Saturday (6), Sunday (0), Monday (1)
    // or Tuesday (2) before 14:00 -> This Thursday (or next Thursday if we passed it? No, "orders close Tuesday 14:00")

    // Let's re-read carefully:
    // "Los pedidos para cada semana, se cierran los martes a las 14.00 horas."
    // "La fecha de entrega es siempre el jueves siguiente a la fecha de realización del pedido."
    // "Los pedidos que se hagan después de esa fecha/hora se entregan el miércoles de la semana siguiente."

    // Interpretation:
    // Order placed: Monday -> Delivery: This Thursday
    // Order placed: Tuesday 13:59 -> Delivery: This Thursday
    // Order placed: Tuesday 14:01 -> Delivery: Next week Wednesday
    // Order placed: Wednesday -> Delivery: Next week Wednesday
    // Order placed: Thursday -> Delivery: Next week Wednesday
    // Order placed: Friday -> Delivery: Next week Wednesday
    // Order placed: Saturday -> Delivery: Next week Wednesday
    // Order placed: Sunday -> Delivery: Next week Wednesday

    // Wait, "Next week Wednesday" seems odd if the normal delivery is Thursday.
    // Maybe it means "Wednesday of the week AFTER the current week"?
    // Or maybe it means "Wednesday of the NEXT week relative to the order"?
    // If I order on Wednesday (after cutoff), the "next week" is the one starting next Monday. So delivery Wednesday.

    // Let's implement strictly as written:
    // Cutoff: Tuesday 14:00.
    // If before cutoff: Delivery is Thursday of THIS week.
    // If after cutoff: Delivery is Wednesday of NEXT week.

    const isTuesday = day === 2;
    const isBeforeCutoff = day < 2 || (isTuesday && hour < 14);

    const deliveryDate = new Date(currentDate);

    if (isBeforeCutoff) {
        // Delivery is Thursday of THIS week
        // Calculate days until Thursday (4)
        // If day is 0 (Sun), add 4.
        // If day is 1 (Mon), add 3.
        // If day is 2 (Tue), add 2.
        const daysUntilThursday = 4 - day;
        // Note: if day is 0 (Sunday), it's usually considered start of week in JS getDay(), but end of week in business logic.
        // If today is Sunday, is it before Tuesday 14:00 of the "current" week?
        // Usually weeks start Monday.
        // If today is Sunday, the "Tuesday 14:00" cutoff for this week has passed?
        // Or is Sunday the start of the week?
        // Let's assume ISO week (Monday start).
        // If today is Sunday, we are past the Tuesday cutoff of this week.
        // So Sunday should be treated as "after cutoff".

        // Let's adjust day index so Monday=0, ..., Sunday=6
        const adjustedDay = day === 0 ? 6 : day - 1;
        // Tuesday is 1. Cutoff is adjustedDay 1, hour 14.

        const isTuesdayAdjusted = adjustedDay === 1;
        const isBeforeCutoffAdjusted = adjustedDay < 1 || (isTuesdayAdjusted && hour < 14);

        if (isBeforeCutoffAdjusted) {
            // Delivery this Thursday (adjustedDay 3)
            const daysToAdd = 3 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        } else {
            // Delivery next Wednesday (adjustedDay 2 of next week)
            // Days to end of week (6 - adjustedDay) + 1 (to reach Monday) + 2 (to reach Wednesday)
            // = 7 - adjustedDay + 2 = 9 - adjustedDay
            const daysToAdd = 9 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        }
    } else {
        // Fallback logic if my previous block was confusing.
        // Let's stick to the adjustedDay logic.
        const adjustedDay = day === 0 ? 6 : day - 1;
        const isTuesdayAdjusted = adjustedDay === 1;
        const isBeforeCutoffAdjusted = adjustedDay < 1 || (isTuesdayAdjusted && hour < 14);

        if (isBeforeCutoffAdjusted) {
            // Delivery this Thursday
            // Monday(0) -> +3
            // Tuesday(1) -> +2
            const daysToAdd = 3 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        } else {
            // Delivery next Wednesday
            // Tuesday(1) -> +8 (Tue->Wed next week is 8 days)
            // Wednesday(2) -> +7
            // Thursday(3) -> +6
            // Friday(4) -> +5
            // Saturday(5) -> +4
            // Sunday(6) -> +3
            // Formula: (2 + 7) - adjustedDay = 9 - adjustedDay
            const daysToAdd = 9 - adjustedDay;
            deliveryDate.setDate(currentDate.getDate() + daysToAdd);
        }
    }

    // Set time to something reasonable, e.g., 10:00 AM
    deliveryDate.setHours(10, 0, 0, 0);
    return deliveryDate;
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}
