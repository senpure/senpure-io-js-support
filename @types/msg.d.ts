declare var aaa: number | string
declare const max: 200

declare function getName(id: number | string): string

declare class Person {
    static maxAge: number//静态变量
    static getMaxAge(): number//静态方法
    constructor(name: string, age: number) //构造函数
    getName(id: number): string
    setAge(age:number):void;
}
declare class User{
    setName(name: string): string
}


