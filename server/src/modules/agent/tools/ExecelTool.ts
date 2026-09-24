
type ExcelToolOptions = {
    action: 'read' | 'write';
    parser: 'json';
}

type ExcelJson = {
    tabs: {
        name: string;
        cells: {
            row: number;
            column: number;
            value: string | number | boolean | null;
        }[]
    }[]
}

export class ExcelTool {
    private parserJson(): ExcelJson {
        return {
            tabs: [
                {
                    name: 'Sheet1',
                    cells: [
                        { row: 1, column: 1, value: 'A1' },
                        { row: 1, column: 2, value: 'B1' },
                        { row: 2, column: 1, value: 'A2' },
                        { row: 2, column: 2, value: 'B2' },
                    ]
                }
            ]
        }
    }

    public execute(file: Buffer, options: ExcelToolOptions): ExcelJson {
        if (options.parser === 'json') {
            return this.parserJson();
        }
        throw new Error('Unsupported parser');
    }
}