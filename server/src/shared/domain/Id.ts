import { randomUUID } from 'node:crypto';

export class Id {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(): Id {
        return new Id(randomUUID());
    }

    static fromString(value: string): Id {
        return new Id(value);
    }

    toString(): string {
        return this.value;
    }
}
