import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rangeBounds,filterByRange} from '../src/ranges.mjs';
const now=Date.UTC(2026,9,17,12);
test('fixed length years and all five display ranges',()=>{for(const [period,hours]of [['24時間',24],['7日間',168],['30日間',720],['1年間',8760],['10年間',87600]])assert.equal(now-rangeBounds(period,now).from,hours*3600000)});
test('news and markets use exact shared boundaries, excluding older and future records',()=>{for(const period of ['24時間','7日間','30日間','1年間','10年間']){const {from,to}=rangeBounds(period,now);const rows=[{t:from-1},{t:from},{t:to},{t:to+1}];assert.deepEqual(filterByRange(rows,period,now,r=>r.t),[rows[1],rows[2]])}});
