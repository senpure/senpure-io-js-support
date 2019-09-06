function User(name) {
    this.name = name;
    this._bb = "55";

}

User.prototype.setName = function (name) {

    this.name = name;
}


var user1 = new User("a");

var user2 = new User("b8888");


console.debug(user1._bb)
console.debug(user1.name)
console.debug(user2.name)
user1.setName("aaa");
console.debug(user1.name)
console.debug(user2.name)
user2.name = 5;
console.debug(user1.name)
console.debug(user2.name)
user2.name = 5;















