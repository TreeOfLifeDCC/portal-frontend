
export const isNumber = (value: any): value is number => {
    return typeof value === 'number';
};

export const isNumberFinite = (value: any): value is number => {
    return isNumber(value) && isFinite(value);
};

// Not strict positive
export const isPositive = (value: number): boolean => {
    return value >= 0;
};


export const isInteger = (value: number): boolean => {
    // No rest, is an integer
    return (value % 1) === 0;
};

export const toDecimal = (value: number, decimal: number): number => {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
};

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const results = [];
    if (arr) {
        const temp = arr.slice();
        while (temp.length) {
            results.push(temp.splice(0, size));
        }
    }
    return results;
};

export const uniqueArray = <T>(arr: T[], propertyName: string): T[] => {
    return arr.filter((e, i) => arr.findIndex(a => a[propertyName] === e[propertyName]) === i);
};
