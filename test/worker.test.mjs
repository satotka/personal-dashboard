import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
test('former financial API is unavailable',async()=>{const r=await worker.fetch(new Request('https://pocket.test/api/data'));assert.equal(r.status,404)});
test('mock does not accept writes',async()=>{const r=await worker.fetch(new Request('https://pocket.test/',{method:'POST'}));assert.equal(r.status,405)});
