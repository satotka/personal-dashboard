export const RANGE_HOURS={'7D':7*24,'4W':28*24,'365D':365*24,'10Y':3650*24,'24時間':24,'7日間':7*24,'30日間':30*24,'1年間':365*24,'10年間':3650*24};
export function rangeBounds(period,now){if(!(period in RANGE_HOURS))throw new Error('Unknown range');return {from:now-RANGE_HOURS[period]*3600000,to:now};}
export function filterByRange(rows,period,now,getTime){const {from,to}=rangeBounds(period,now);return rows.filter(row=>{const t=getTime(row);return Number.isFinite(t)&&t>=from&&t<=to});}
