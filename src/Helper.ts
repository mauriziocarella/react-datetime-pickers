const Helper = function (firstDayOfWeek: number = 1) {
    let months = [
        {
            month: 0,
            name: 'January'
        },
        {
            month: 1,
            name: 'February'
        },
        {
            month: 2,
            name: 'March'
        },
        {
            month: 3,
            name: 'April'
        },
        {
            month: 4,
            name: 'May'
        },
        {
            month: 5,
            name: 'June'
        },
        {
            month: 6,
            name: 'July'
        },
        {
            month: 7,
            name: 'August'
        },
        {
            month: 8,
            name: 'September'
        },
        {
            month: 9,
            name: 'October'
        },
        {
            month: 10,
            name: 'November'
        },
        {
            month: 11,
            name: 'December'
        }
    ];
    let dows = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    dows = dows.concat(dows.splice(0, firstDayOfWeek));

    return {
        months,
        dows,

        isSameDayAs(a: Date, b: Date) {
            return (
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate()
            )
        },
        isSameMonthAs(a: Date, b: Date) {
            return (
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth()
            )
        },
        isSameYearAs(a: Date, b: Date) {
            return (
                a.getFullYear() === b.getFullYear()
            )
        },
        isSameTimeAs(a: Date, b: Date) {
            return (
                a.getHours() === b.getHours() &&
                a.getMinutes() === b.getMinutes() &&
                a.getSeconds() === b.getSeconds() &&
                a.getMilliseconds() === b.getMilliseconds()
            )
        },

        dayStart(date: Date) {
            let ret = new Date(date)
            ret.setHours(0, 0, 0, 0)
            return ret
        },
        dayEnd(date: Date) {
            let ret = new Date(date)
            ret.setHours(23, 59, 59, 999)
            return ret
        },

        weekStart(date: Date) {
            let ret = new Date(date)
            while (ret.getDay() !== firstDayOfWeek) {
                ret.setDate(ret.getDate() - 1);
            }
            return ret
        },
        weekEnd(date: Date) {
            let ret = this.weekStart(date)
            ret.setDate(ret.getDate() + 6)
            ret.setHours(23, 59, 59, 999)
            return ret
        },
        monthStart(date: Date) {
            let ret = new Date(date)
            ret.setDate(1)
            return ret
        },
        monthEnd(date: Date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0)
        },
        yearStart(date: Date) {
            return new Date(date.getFullYear(), 0, 1)
        },
        yearEnd(date: Date) {
            return new Date(date.getFullYear(), 11, 31)
        },

        getMonthWeeks(year: number, month: number) {
            let lastDayOfMonth = (new Date(year, month + 1, 0))

            let weeks = []

            let date = new Date(year, month, 1)
            let week
            do {
                week = {
                    start: this.weekStart(date),
                    end: this.weekEnd(date),
                    days: [] as {date: Date, disabled: boolean}[]
                }

                for (let d = new Date(week.start); d.getTime() <= week.end.getTime(); d.setDate(d.getDate() + 1)) {
                    let day = new Date(d)
                    week.days.push({
                        date: day,
                        disabled: day.getMonth() !== month
                    })
                }

                date = new Date(week.end)
                date.setDate(date.getDate() + 1)

                weeks.push(week)
            } while (week.end.getTime() <= lastDayOfMonth.getTime() || weeks.length < 6)

            return weeks;
        }
    }
};

export default Helper;