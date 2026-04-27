const myMath = {
    PI: 3.14159,
    square(num) {
        return num * num;
    },
    cube(num) {
        return num ** 3;
    }
}

const cat = {
    name: 'Blue Steele',
    color: 'grey',
    breed: 'scottish fold',
    meow() {
        console.log("THIS IS:", this)
        console.log(`${this.name} says MEOWWWW`);
    }
}

const meow2 = cat.meow;

const square = {
    area(sideLen) {
        return sideLen * sideLen;
    },
    perimeter(sideLen) {
        return sideLen * 4;
    }

}
console.log(square.area(3)); //9
console.log(square.perimeter(3)); //12

const hen = {
    name: 'Helen',
    eggCount: 0,
    layAnEgg() {
        this.eggCount += 1;
        return 'EGG'
    }
}

