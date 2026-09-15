import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DayOfMonth } from './DayOfMonth';

describe('DayOfMonth', () => {
    it('given valid integer when create then succeeds', () => {
        const day = new DayOfMonth(15);
        assert.strictEqual(day.value, 15);
    });

    it('given non-integer when create then throws', () => {
        assert.throws(() => new DayOfMonth(10.5), /integer/);
    });

    it('given value less than 0 when create then throws', () => {
        assert.throws(() => new DayOfMonth(-1), /between 0 and 31/);
    });

    it('given value greater than 31 when create then throws', () => {
        assert.throws(() => new DayOfMonth(32), /between 0 and 31/);
    });
});
