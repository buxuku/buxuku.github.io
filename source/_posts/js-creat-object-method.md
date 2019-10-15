---
title: javacript中创建对象的几种方式
date: 2016-05-02 23:36:26
tags: javascript
category: 前端
---
javascript中创建对象有几种方式,工厂模式,构造函数模式,原型模式,构造函数+原型混合模式,动态原型模式,寄生构造函数模式,稳妥构造函数模式.
<!--more-->
针对前几种,记录一下自己的书写笔记,有时间再来整理一下文字版.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>对象</title>
	<script>
	//工厂方法 缺点:对象识别问题.
	function CreatPerson(name,age){
		var obj = new Object;
		obj.name = name;
		obj.age = age;
		obj.fav = ["苹果","葡萄"];
		obj.run = function (){
			return this.name+this.age+"正在运行中...";
		};
		return obj;
	}
	/*
	var person1 = CreatPerson("lxd",23);
	person1.fav.push("橙子");
	var person2 = CreatPerson("tian",14);
	person1.name = "xiaodong"; 	
	console.log(person1.run());//xiaodong23正在运行中...
	console.log(person1.fav);// ["苹果", "葡萄", "橙子"] 引用对象不共享
	console.log(person2.run());//tian14正在运行中...
	console.log(person2.fav);// ["苹果", "葡萄"]
	console.log(person1 instanceof Object);//true
	console.log(person1 instanceof CreatPerson);//false 不能获得对象标识
	console.log(person1.run == person2.run);//false
	*/
	//构造函数模式 缺点:里面相同任务的function也会被实例化
	function Person(name,age){
		this.name = name;
		this.age = age;
		this.fav = ["苹果","葡萄"];
		this.run = function(){ //这里的方法也会被实例化,等同于this.run = new Function("return this.name+this.age+'正在运行中...';")
			return this.name+this.age+"正在运行中...";
		}
	}
	var person1 = new Person("lxd",23);
		person1.fav.push("橙子");
	var person2 = new Person("tian",14);
	person1.name = "xiaodong"; 	
	console.log(person1.run());//xiaodong23正在运行中...
	console.log(person1.fav);// ["苹果", "葡萄", "橙子"] 引用对象不共享
	console.log(person2.run());//tian14正在运行中...
	console.log(person2.fav);// ["苹果", "葡萄"]
	console.log(person1 instanceof Object);//true
	console.log(person1 instanceof Person);//true 可以获得对象标识
	console.log(person1.run == person2.run);//false 实例化对象,里面的方法也会实例化

	Person("window",100);//当作普通函数使用 添加到window对象中
	console.log(window.run());//window100正在运行中...
	var o = new Object;
	Person.call(o,"oooo",99);//在另外一个对象的作用域中调用
	console.log(o.run());//oooo99正在运行中...

	//针对构造函数的缺点,进行改造,把函数提取出来 缺点:暴躁在全局变量中的方法,却只能在对象中使用,而且如果方法很多,会创建很多这样的全局方法.
	function NewPerson(name,age){
		this.name = name;
		this.age = age;
		this.fav = ["苹果","葡萄"];
		this.run = run;
	}
	function run(){
		return this.name+this.age+"正在运行中...";
	}
	var newperson1 = new NewPerson("xiaodong",13);
	var newperson2 = new NewPerson("tian",22);
	console.log(newperson1.run == newperson2.run);//true 访问的是同一个方法
	</script>
</head>
<body>
	
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>prototype</title>
	<script>
	//原型模式
	function Person() {};
	Person.prototype.name = "xiaodong";
	Person.prototype.age = 23;
	Person.prototype.job = "do software";
	Person.prototype.sayName = function (){
		return this.name;
	}
	var person1 = new Person();
	var person2 = new Person();
	console.log(person1.sayName());//"xiaodong"
	console.log(person2.sayName());//"xiaodong"
	console.log(person1.sayName === person2.sayName);//访问同一个对象指针
	console.log(Person.prototype.isPrototypeOf(person1));//true person1中包含有指向Person.prototype的指针
	console.log(Object.getPrototypeOf(person1) == Person.prototype);//true page 149 返回prototype的值
	console.log(Object.getPrototypeOf(person1).name);//xiaodong

	person1.name = "tiantian"; //只能添加到实例中,不能改变原型的值
	console.log(person1.name);//"tiantian" 来自实例而非原型
	console.log(person2.name);//"xiaodong" 来自原型而非实例
	delete person1.name;
	console.log(person1.name);//"xiaodong" 来自原型
	/*
	console.log(person1.hasOwnProperty("name"));//false 检测是实例属性还是原型属性
	person1.name = "tian";
	console.log(person1.hasOwnProperty("name"));//ture 实例中包含name属性
	*/
	console.log("name" in person1);//true 可枚举原型中的属性 来自原型
	person1.name = "okok";
	console.log("name" in person1);//true //来自实例
	//利用hasOwnProperty和in可以判断属性是来自实例还是原型例如
	function hasPrototypeProperty(object,name){
		return !object.hasOwnProperty(name) && (name in object);
	}
	delete person1.name;
	console.log(hasPrototypeProperty(person1,"name"));//ture

	person1.name = "test";
	console.log(hasPrototypeProperty(person1,"name"));//false

	for (var i in person1){
		if (i == "age"){
			console.log("1234");//"1234"
		}
	}

	var keys = Object.keys(Person.prototype);
	console.log(keys);//["name", "age", "job", "sayName"]

	var keys = Object.keys(person1);
	console.log(keys);// ["name"] 实例属性
	Person.prototype.toString = function(){
		return "ok";
	}
	var keys = Object.getOwnPropertyNames(Person.prototype);
	console.log(keys);//  ["constructor", "name", "age", "job", "sayName", "toString"] 包含不可枚举的 注意还有tostring;

	var keys = Object.getOwnPropertyNames(person1);
	console.log(keys);//  ["name"] 证明只有构造函数才有constructor等方法
	//person1.prototype.name = "dfsa"; //TypeError: person1.prototype is undefined

	function NewPerson(){};
	NewPerson.prototype = {//采用字面量的方式书写;
		name:"xiaodong",
		age: 23,
		sayName: function(){
			return this.name;
		}
	};
	var newperson = new NewPerson();
	console.log(newperson instanceof Object);//ture
	console.log(newperson instanceof NewPerson);//ture
	console.log(newperson.constructor == NewPerson);//false 重写了默认的prototype,所以其constructor属性变成了新对象的constructor属性(指向Object);
	console.log(newperson.constructor == Object);//ture

	function NewPerson2(){};
	NewPerson2.prototype = {//采用字面量的方式书写;
		constructor:NewPerson2,//显式指定
		name:"xiaodong",
		age: 23,
		sayName: function(){
			return this.name;
		}
	};
	var newperson2 = new NewPerson2();
	console.log(newperson2.constructor == NewPerson2);//ture;

	NewPerson2.prototype.name = "tiantian";
	console.log(newperson2.name);//原型的动态性 对其修改会在所有的对象实例中反映出来

	NewPerson2.prototype = {//但如果重写的话,就会切断构造函数与最初原型的关系 page156 实例中的指针仅指向原型,而不是构造函数
		name : "other"
	};
	console.log(newperson2.name);//tiantian
	console.log(newperson2.constructor === NewPerson2)//true

	//原型模式的缺点:所有的属性都是共享的.

	function Friend(){};
	Friend.prototype={
		name:"jack",
		fav:["苹果","葡萄"],
		run:function(){
			return this.fav;
		}
	};
	var friend1 = new Friend();
	var friend2 = new Friend();
	friend1.fav.push("梨子");//引用类型
	console.log(friend1.fav);// ["苹果", "葡萄", "梨子"] 引用类型
	console.log(friend2.fav);// ["苹果", "葡萄", "梨子"] 引用类型

	//组合使用构造函数模式和原型模式 目前最常用的方式
	function Base(name,age){
		this.name = name;
		this.age = age;
	};
	Base.prototype.run =  function(){
		return this.name;
	};
	var base1 = new Base("xiaodong",23);
	var base2 = new Base("tiantian",22);
	console.log(base1.run());//"xiaodong"
	console.log(base2.run());//"tiantian"
	console.log(base1.run === base2.run);//true

	</script>
</head>
<body>
	
</body>
</html>
```