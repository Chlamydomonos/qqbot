class MclError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    constructor(e: any) {
        if (e instanceof Error) {
            this.name = e.name;
            this.message = e.message;
            this.stack = e.stack;
        } else {
            const ee = new Error(e);
            this.name = ee.name;
            this.message = ee.message;
            this.stack = ee.stack;
        }
    }
}
