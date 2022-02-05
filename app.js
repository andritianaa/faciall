var Person = {
  nom: "Andritiana",
  prenom:"Steve",
  age:20,
  incAge:()=>{
    this.age=age++;
  },
  getAge: ()=>{
    console.log(this.age);
    return this.age;
  }
  
}
console.log(Person.getAge());
//<>
