---
title: javascript中继承的几种方式
date: 2016-05-03 23:04:39
updated: 2016-05-03 23:04:39
tags: javascript
category: 前端
---
和创建对象的几个方式类似,javascript也产生了几种不同的实现继承的方式.
<!--more -->

## 原型链

```javascript
	<script>
		function SuperType(){
			this.property = true;
			this.color = ["yellow","red"];
			this.name = "xiaodong";
		}
		SuperType.prototype.getSuperTypeValue = function(){
			return this.property;
		};
		function SubType(){
			this.subproperty = false;
		}
	/*	SubType.prototype.getSubValue = function(){ //添加属性和方法必须在替换原型之后
			return this.subproperty;
		}*/
		SubType.prototype = new SuperType();
		var instance = new SubType();
		console.log(instance.getSuperTypeValue());//true
		console.log(instance instanceof Object);//true 原型和实例的关系
		console.log(instance instanceof SubType);//true
		console.log(instance instanceof SuperType);//true
		console.log(Object.prototype.isPrototypeOf(instance));//true
		console.log(SuperType.prototype.isPrototypeOf(instance));//true
		console.log(SubType.prototype.isPrototypeOf(instance));//true
		/*console.log(SubType.getSubValue());//TypeError: SubType.getSubValue is not a function*/
		SubType.prototype.getSubValue = function(){ //添加属性和方法必须在替换原型之后
			return this.subproperty;
		};
		console.log(instance.getSubValue());//false

	/*	SubType.prototype = { //不能再使用对象字面量的方式来重写原型,这样会断开最初的原型链
			getSubValue : function(){
				return this.subproperty;
			}
		}
		var instance2 = new SubType();
		console.log(instance2.getSuperTypeValue());//TypeError: instance2.getSuperTypeValue is not a function*/
		//原型链继承的问题 :包含超级类的属性值 并且对实例中引用类型的值的修改,会反映到超级类的所有实例上面 并且子类的实例没有办法向超级类传递参数 即使通过子类的参数间接传递也不行
		var instance2 = new SubType();
		instance.name = "tiantian";
		//instance.color = ["black"];
		instance.color.push("black");//如果使用instance.color=["black"],就不会影响到其它实例,因为改变了对象的引用
		console.log(instance2.color);// ["yellow", "red", "black"]
		console.log(instance2.name);//xiaodong
	</script>
```
[view code](http://jsbin.com/gufavatule/edit?js,console)

## 借用构造函数
    
```javasciprt
	<script>
		function SuperType(name){
			this.color = ["yellow","green"];
			this.name  = name;
			this.getName = function(){
				return this.name;
			};
		}
		function SubType(name){
			SuperType.call(this,name);
		}
		var instance  = new SubType("xiaodong");
		instance.color.push("black");
		var instance2 = new SubType();
		console.log(instance.color);//["yellow", "green", "black"]
		console.log(instance.name);//xiaodong
		console.log(instance2.color);// ["yellow", "green"]
		console.log(instance.getName == instance2.getName);//false 方法没有达到共用
		//借用构造函数解决了属性值共享的问题,以及实例向超级类传递参数的问题. 缺点 方法也是在函数中定义 无法解决函数共用的问题
	</script>
```
[view code](http://jsbin.com/viladal/edit?js,console)

## 组合方式

```javascript
	<script>
		//最常用的继承模式
		function SuperType(name){
			this.name = name;
			this.color = ["yellow","green"];
		}
		SuperType.prototype.getName = function(){
			return this.name;
		};
		function SubType (name,age){
			SuperType.call(this,name);
		}
		SubType.prototype = new SubType();
		SubType.prototype.constructor = SubType;
		SubType.prototype.getAge = function (){
			return this.age;
		};
		var instance = new SubType("xiaodong",22);
		instance.color.push("black");
		var instance2 = new SubType("tiantian",11);
		console.log(instance.color);// ["yellow", "green", "black"]
		console.log(instance2.color);// ["yellow", "green"]
		console.log(instance.getName == instance2.getName);//true 实现了方法共享
		console.log(instance.getAge == instance2.getAge);//true 实现了方法共享
	</script>
```
[view code](http://jsbin.com/tiwukab/edit?js,console)

## 原型式继承

```javascript
	<script>
		//基本模型 缺点:引用类型值共享
		function object(o){//o传入一个基本对象
			function F(){}
			F.prototype = Object(o);
			return new F();
		}

		var person = {
			name:"xiaodong",
			color:["yellow","green"],
			getName:function(){
				return this.name;
			}
		};
		var person1 = object(person);
		person1.name = "tiantian";
		person1.color.push("black");
		var person2 = object(person);
		console.log(person1.name);//tiantian
		console.log(person2.name);//xiaodong
		console.log(person1.color);// ["yellow", "green", "black"]
		console.log(person2.color);// ["yellow", "green", "black"]
		console.log(person1.getName == person2.getName);//true 实现了函数共享

		//ES5中新增了Object.create()方法来更加规范地实现这一类继承
		var newperson = {
			name:"xiaodong",
			color:["yellow","green"],
			getName:function(){
				return this.name;
			}
		};
		var newperson1 = Object.create(newperson);
		newperson1.name = "tiantian";
		newperson1.color.push("black");
		var newperson2 = Object.create(newperson);
		console.log(newperson1.name);//tiantian
		console.log(newperson2.name);//xiaodong
		console.log(newperson1.color);// ["yellow", "green", "black"]
		console.log(newperson2.color);// ["yellow", "green", "black"]
		console.log(newperson1.getName == newperson2.getName);//true 实现了函数共享
	</script>
```
[view code](http://jsbin.com/zoqahi/edit?js,console)

## 寄生式继承

```javascript
	<script>
		function object(o){
			var F = function(){};
			F.prototype = o;
			return new F();
		}
		function creatAnother (origin) {
			var clone = object(origin);
			clone.sayHi = function(){
				return "hi";
			};
			return clone;
		}
		var origin = {
			name:"xiaodong",
			color:["yellow","green"],
			getName:function(){
				return this.name;
			}
		};
		var other = creatAnother(origin);
		other.name = "tian";
		other.color.push("black");
		var other2 = creatAnother(origin);
		console.log(other.name);//tian
		console.log(other.color);// ["yellow", "green", "black"] 引用类型共享
		console.log(other2.name);// xiaodong
		console.log(other2.color);// ["yellow", "green", "black"]
		console.log(other.getName == other2.getName);//true
		console.log(other.sayHi == other2.sayHi);//false 使用寄生式继承来为对象添加函数,函数不能共享而降低效率
	</script>
````
[view code](http://jsbin.com/wovaka/edit?js,console)

## 寄生组合式继承

```javascript
	<script>
		/*//组合式继承的缺点:超类会调用两次
		function SuperType(name){
			this.name = name;
			this.color = ["yellow","green"];
			this.age = 23;
		};
		SuperType.prototype.getName = function(){
			return this.name;
		}
		function SubType(name,age){
			SuperType.call(this,name);//第二次调用超类
			this.age= age;
		}
		SubType.prototype = new SuperType();//第一次调用超类
		SubType.constructor = SubType;
		SubType.prototype.getAge = function(){
			return this.age;
		}
		var instance = new SubType("xiaodong",23);
		console.log(instance.getName());//xiaodong*/

		//寄生组合式继承 只调用一次SuerType构造函数,同时避免了在SubType.prototype上面创建不必要的,多余的属性.同时原型链保值不变.
		function inheritPrototype(subType,superType){
			var prototype = Object(superType.prototype);//创建对象
			prototype.constructor = SubType;//增强对象
			subType.prototype = prototype;//指定对象
		}
		function SuperType(name){
			this.name = name;
			this.color = ["yellow","green"];
			this.age = 23;
		}
		SuperType.prototype.getName = function(){
			return this.name;
		};
		function SubType(name,age){
			SuperType.call(this,name);
			this.age = age;
		}
		inheritPrototype(SubType,SuperType);
		SubType.prototype.getAge = function(){
			return this.age;
		};
		var instance = new SubType("xiaodong",23);
		console.log(instance.getName());//xiaodong
	</script>
```
[view code](http://jsbin.com/jumufo/edit?js,console)
