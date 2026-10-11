import moment from 'moment-timezone';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const getIndianTime = (): moment.Moment => {
    return moment().tz(DEFAULT_TIMEZONE);
};

export const getIndianDateTime = (): { date: string; time: string; fullDateTime: string } => {
    const indianTime = getIndianTime();
    return {
        date: indianTime.format('YYYY-MM-DD'),
        time: indianTime.format('HH:mm:ss'),
        fullDateTime: indianTime.format('YYYY-MM-DD HH:mm:ss')
    };
};
export default {
    DEFAULT_TIMEZONE,
    getIndianTime,
    getIndianDateTime
};