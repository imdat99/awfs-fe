export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
    let timeout: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    }
}
export const class2Object = <T>(classConvert: T) => {
    const keys = Object.getOwnPropertyNames(
        Object.getPrototypeOf(classConvert)
    ) as Array<keyof T>
    const object = keys.reduce((classAsObj: Record<string, any>, key) => {
        classAsObj[key as string] = (classConvert[key] as any)?.bind(
            classConvert
        )
        return classAsObj
    }, {})
    return object as T
}
