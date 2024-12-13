export class SortOptions {
    field: string;
    direction: string;

    public getSortOptionsStr(): string {
        return 'test';
        return `${this.field}|${this.direction}`;
    }
}