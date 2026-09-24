
type PayloadText = string;

type PayloadExcel = Buffer;


type InputPayload<Type = 'text' | 'excel'> = {
    type: Type;
    payload: Type extends 'text' ? PayloadText : PayloadExcel;
}

type Input = InputPayload & {
    projectId: string;
    userId: string;
}

type Output = {
    plan: any;
}

export class Planner {
    public async execute(input: Input): Promise<Output> {
        return {
            plan: {}
        }

    }
}